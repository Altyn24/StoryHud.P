import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export const fetchPostById = createAsyncThunk(
  "post/fetchById",
  async (id, thunkAPI) => {
    const ref = doc(db, "stories", id);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      const data = docSnap.data();

      const createdAt = data.createdAt?.toDate().toISOString() || null;

      return {
        id: docSnap.id,
        ...data,
        createdAt,
      };
    } else {
      return thunkAPI.rejectWithValue("История не найдена");
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState: {
    item: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearPost(state) {
      state.item = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.item = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearPost } = postSlice.actions;

export default postSlice.reducer;
