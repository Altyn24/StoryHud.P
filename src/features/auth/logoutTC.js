import { createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "../../firebase/firebaseConfig";
import { logout } from "./authSlice";
import { signOut } from "firebase/auth";
import { message } from "antd";

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (__, { dispatch, rejectWihtValue }) => {
    try {
      await signOut(auth);
      dispatch(logout());
      message.success("Вы вышли из аккаунта");
    } catch (error) {
      message.error("Ошибка выхода");
      return rejectWihtValue(error.message);
    }
  }
);
