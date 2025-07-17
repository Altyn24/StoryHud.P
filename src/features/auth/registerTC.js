import { createAsyncThunk } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { setUser } from "./authSlice";
import { message } from "antd";

export const createUser = createAsyncThunk(
  "auth/createUser",
  async ({ name, email, password }, { dispatch, rejectWithValue }) => {
    try {
      // Создание пользователя
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Установка имени (displayName) в Firebase
      await updateProfile(user, {
        displayName: name,
      });

      // Обновлённый user уже содержит displayName
      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
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
