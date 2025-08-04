import { createAsyncThunk } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { setUser } from "./authSlice";
import { message } from "antd";

export const createUser = createAsyncThunk(
  "auth/createUser",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "",
          name: user.displayName || "",
          photoURL: user.photoURL || "",
        })
      );

      message.success("Регистрация прошла успешно!");
      return user;
    } catch (error) {
      console.error("Ошибка регистрации:", error.message);
      message.error(`Ошибка: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);