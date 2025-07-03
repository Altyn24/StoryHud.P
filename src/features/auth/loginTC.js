import { createAsyncThunk } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { setUser } from "./authSlice";
import { message } from "antd";

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        })
      );

      message.success("Вы вошли успешно!");
      return user;
    } catch (error) {
      console.error("Ошибка входа:", error.message);
      message.error("Ошибка: неверный email или пароль");
      return rejectWithValue(error.message);
    }
  }
);
