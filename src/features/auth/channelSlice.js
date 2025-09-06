import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase/firebaseConfig";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { deleteStory } from "../stories/storiesSlice";

const convertTimestamp = (ts) => {
  if (!ts) return null;
  if (ts.toDate) return ts.toDate().toISOString();
  if (typeof ts === "string") return ts;
  if (ts.seconds) return new Date(ts.seconds * 1000).toISOString();
  return null;
};

export const fetchFollowingDetails = createAsyncThunk(
  "channel/fetchFollowingDetails",
  async (userId) => {
    const followingRef = collection(db, "users", userId, "following");
    const querySnapshot = await getDocs(followingRef);
    const ids = querySnapshot.docs.map((doc) => doc.data().followedId);

    if (ids.length === 0) return [];

    const channelsRef = collection(db, "channels");
    const q = query(channelsRef, where("__name__", "in", ids));
    const channelsSnap = await getDocs(q);

    return channelsSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
      };
    });
  }
);

export const fetchOrCreateChannel = createAsyncThunk(
  "channel/fetchOrCreateChannel",
  async (userId, { getState }) => {
    const state = getState();
    if (state.channel.channelCache[userId]) {
      return state.channel.channelCache[userId];
    }

    const docRef = doc(db, "channels", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
      };
    } else {
      // ⚡ Берём профиль из users/{userId}
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      let newChannel;
      if (userSnap.exists()) {
        const userData = userSnap.data();
        newChannel = {
          title: userData.name || "Новый канал",
          avatar: userData.photoURL || null,
          description: "",
          createdAt: new Date().toISOString(),
          ownerId: userId,
        };
      } else {
        newChannel = {
          title: "Новый канал",
          description: "",
          createdAt: new Date().toISOString(),
          ownerId: userId,
        };
      }

      await setDoc(docRef, newChannel);
      return { id: userId, ...newChannel };
    }
  }
);

// 🔥 Обновляем followUser
export const followUser = createAsyncThunk(
  "channel/followUser",
  async ({ followerId, followedId }, { rejectWithValue, dispatch }) => {
    try {
      const followingRef = doc(
        db,
        "users",
        followerId,
        "following",
        followedId
      );
      const followerRef = doc(db, "users", followedId, "followers", followerId);

      await setDoc(followingRef, { followedId, followedAt: new Date() });
      await setDoc(followerRef, { followerId, followedAt: new Date() });

      // ⚡ Сразу тянем канал подписанного пользователя
      const channel = await dispatch(fetchOrCreateChannel(followedId)).unwrap();

      return { followedId, channel };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  "channel/fetchUserPosts",
  async (userId, { getState }) => {
    const state = getState();
    if (state.channel.postsCache[userId]) {
      return state.channel.postsCache[userId];
    }

    const postsQuery = query(
      collection(db, "stories"),
      where("authorId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(postsQuery);
    const posts = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
      };
    });
    return posts;
  }
);

export const unfollowUser = createAsyncThunk(
  "channel/unfollowUser",
  async ({ followerId, followedId }, { rejectWithValue }) => {
    try {
      const followingRef = doc(
        db,
        "users",
        followerId,
        "following",
        followedId
      );
      const followerRef = doc(db, "users", followedId, "followers", followerId);
      await deleteDoc(followingRef);
      await deleteDoc(followerRef);
      return { followedId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFollowing = createAsyncThunk(
  "channel/fetchFollowing",
  async (userId) => {
    const followingRef = collection(db, "users", userId, "following");
    const querySnapshot = await getDocs(followingRef);
    return querySnapshot.docs.map((doc) => doc.data().followedId);
  }
);

export const fetchFollowers = createAsyncThunk(
  "channel/fetchFollowers",
  async (userId) => {
    const followersRef = collection(db, "users", userId, "followers");
    const querySnapshot = await getDocs(followersRef);
    return querySnapshot.docs.map((doc) => doc.data().followerId);
  }
);

const channelSlice = createSlice({
  name: "channel",
  initialState: {
    channel: null,
    posts: [],
    following: [],
    followers: [],
    followingDetails: [],
    loading: false,
    error: null,
    channelCache: {},
    postsCache: {},
  },
  reducers: {
    addPostToCache(state, action) {
      const { userId, post } = action.payload;
      if (!state.postsCache[userId]) {
        state.postsCache[userId] = [];
      }
      state.postsCache[userId].unshift(post);
      state.posts = state.postsCache[userId];
    },
    removePostFromCache(state, action) {
      const { userId, storyId } = action.payload;
      if (state.postsCache[userId]) {
        state.postsCache[userId] = state.postsCache[userId].filter(
          (post) => post.id !== storyId
        );
        state.posts = state.postsCache[userId];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrCreateChannel.fulfilled, (state, action) => {
        state.channel = action.payload;
        state.channelCache[action.payload.ownerId] = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        if (action.meta.arg) {
          state.postsCache[action.meta.arg] = action.payload;
        }
        state.loading = false;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        const { followedId, channel } = action.payload;
        if (!state.following.includes(followedId)) {
          state.following.push(followedId);
          state.followingDetails.push(channel);
        }
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.following = state.following.filter(
          (id) => id !== action.payload.followedId
        );
        state.followingDetails = state.followingDetails.filter(
          (user) => user.id !== action.payload.followedId
        );
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.following = action.payload;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.followers = action.payload;
      })
      .addCase(fetchFollowingDetails.fulfilled, (state, action) => {
        state.followingDetails = action.payload;
      })
      .addCase(deleteStory.fulfilled, (state, action) => {
        const storyId = action.payload;
        const userId = Object.keys(state.postsCache).find((uid) =>
          state.postsCache[uid].some((post) => post.id === storyId)
        );
        if (userId) {
          state.postsCache[userId] = state.postsCache[userId].filter(
            (post) => post.id !== storyId
          );
          state.posts = state.postsCache[userId];
        }
      });
  },
});

export const { addPostToCache, removePostFromCache } = channelSlice.actions;
export default channelSlice.reducer;
