import { createAsyncThunk } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

export const createUser = createAsyncThunk(
  "auth/createUser",
  async ({ email, password }, { dispatch }, thunkAPI) => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      dispatch(user.user);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
