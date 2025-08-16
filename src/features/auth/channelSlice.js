import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc, setDoc, collection, getDocs, query, where, orderBy, deleteDoc } from "firebase/firestore";

export const fetchOrCreateChannel = createAsyncThunk(
  "channel/fetchOrCreateChannel",
  async (userId, { getState }) => {
    const docRef = doc(db, "channels", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || null,
      };
    } else {
      const user = getState().auth.user;
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
  async (userId) => {
    const postsQuery = query(
      collection(db, "stories"),
      where("authorId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(postsQuery);
    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || null,
    }));
    return posts;
  }
);

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

export const fetchFollowingDetails = createAsyncThunk(
  "channel/fetchFollowingDetails",
  async (userId) => {
    const followingRef = collection(db, "users", userId, "following");
    const querySnapshot = await getDocs(followingRef);
    const followedIds = querySnapshot.docs.map((doc) => doc.data().followedId);
    
    if (followedIds.length === 0) return [];
    
    const userPromises = followedIds.map((id) =>
      getDoc(doc(db, "users", id)).then((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
    return Promise.all(userPromises);
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
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrCreateChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrCreateChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.channel = action.payload;
      })
      .addCase(fetchOrCreateChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(followUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.loading = false;
        state.following = [...state.following, action.payload.followedId];
      })
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(unfollowUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.loading = false;
        state.following = state.following.filter(
          (id) => id !== action.payload.followedId
        );
        state.followingDetails = state.followingDetails.filter(
          (user) => user.id !== action.payload.followedId
        );
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.following = action.payload;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.followers = action.payload;
      })
      .addCase(fetchFollowingDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowingDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.followingDetails = action.payload;
      })
      .addCase(fetchFollowingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default channelSlice.reducer;