import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs, query, orderBy, doc, setDoc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";

export const fetchStories = createAsyncThunk(
  "stories/fetchStories",
  async () => {
    const q = query(
      collection(db, "stories"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || null,
    }));
  }
);

export const toggleLike = createAsyncThunk(
  "stories/toggleLike",
  async ({ storyId, userId }, { rejectWithValue }) => {
    if (!storyId || !userId) {
      return rejectWithValue("storyId or userId is undefined");
    }
    try {
      const likeRef = doc(db, "stories", storyId, "likes", userId);
      const likeSnap = await getDoc(likeRef);
      if (likeSnap.exists()) {
        await deleteDoc(likeRef);
        return { storyId, liked: false };
      } else {
        await setDoc(likeRef, { userId, likedAt: new Date() });
        return { storyId, liked: true };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteStory = createAsyncThunk(
  "stories/deleteStory",
  async (storyId, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "stories", storyId));
      return storyId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editStory = createAsyncThunk(
  "stories/editStory",
  async ({ storyId, title, text, previewImage }, { rejectWithValue }) => {
    try {
      const storyRef = doc(db, "stories", storyId);
      await updateDoc(storyRef, { title, text, previewImage });
      return { id: storyId, title, text, previewImage };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const storiesSlice = createSlice({
  name: "stories",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    updateUserPosts(state, action) {
      const { userId, posts } = action.payload;
      // удаляем старые посты пользователя и добавляем новые
      state.items = state.items.filter(post => post.authorId !== userId).concat(posts);
    },
    // Новый редукер: Добавляет новый пост в начало списка (для ленты, assuming desc sort)
    addStory(state, action) {
      const newStory = action.payload;
      state.items.unshift(newStory); // Добавляем в начало для desc order
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { storyId, liked } = action.payload;
        const story = state.items.find((item) => item.id === storyId);
        if (story) {
          story.likedByUser = liked;
        }
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteStory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteStory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteStory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(editStory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editStory.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { id, title, text, previewImage } = action.payload;
        const story = state.items.find((item) => item.id === id);
        if (story) {
          story.title = title;
          story.text = text;
          story.previewImage = previewImage;
        }
      })
      .addCase(editStory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});
export const { updateUserPosts, addStory } = storiesSlice.actions;
export default storiesSlice.reducer;