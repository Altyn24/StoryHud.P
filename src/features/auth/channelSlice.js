import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc, setDoc, collection, getDocs, query, where, orderBy, deleteDoc } from "firebase/firestore";

const convertTimestamp = (ts) => {
  if (!ts) return null;
  if (ts.toDate) return ts.toDate().toISOString();
  if (typeof ts === "string") return ts;
  if (ts.seconds) return new Date(ts.seconds * 1000).toISOString();
  return null;
};

// --- Async Thunks с кешированием ---
export const fetchOrCreateChannel = createAsyncThunk(
  "channel/fetchOrCreateChannel",
  async (userId, { getState }) => {
    const state = getState();
    if (state.channel.channelCache[userId]) {
      return state.channel.channelCache[userId]; // Возвращаем из кеша
    }

    const docRef = doc(db, "channels", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        createdAt: convertTimestamp(data.createdAt),
      };
    } else {
      const user = state.auth.user;
      const newChannel = {
        title: user?.name ? `${user.name}'s Channel` : "Новый канал",
        description: "",
        createdAt: new Date().toISOString(),
        ownerId: userId,
      };
      await setDoc(docRef, newChannel);
      return newChannel;
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  "channel/fetchUserPosts",
  async (userId, { getState }) => {
    const state = getState();
    if (state.channel.postsCache[userId]) {
      return state.channel.postsCache[userId]; // Возвращаем из кеша
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

// --- follow/unfollow и fetchFollowing/fetchFollowers без изменений ---
export const followUser = createAsyncThunk(
  "channel/followUser",
  async ({ followerId, followedId }, { rejectWithValue }) => {
    try {
      const followingRef = doc(db, "users", followerId, "following", followedId);
      const followerRef = doc(db, "users", followedId, "followers", followerId);
      await setDoc(followingRef, { followedId, followedAt: new Date() });
      await setDoc(followerRef, { followerId, followedAt: new Date() });
      return { followedId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const unfollowUser = createAsyncThunk(
  "channel/unfollowUser",
  async ({ followerId, followedId }, { rejectWithValue }) => {
    try {
      const followingRef = doc(db, "users", followerId, "following", followedId);
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

// --- Slice ---
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
    channelCache: {},  // <--- кеш каналов
    postsCache: {},    // <--- кеш постов
  },
  reducers: {},
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
        state.following = [...state.following, action.payload.followedId];
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.following = state.following.filter((id) => id !== action.payload.followedId);
        state.followingDetails = state.followingDetails.filter(
          (user) => user.id !== action.payload.followedId
        );
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.following = action.payload;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.followers = action.payload;
      });
  },
});

export default channelSlice.reducer;
