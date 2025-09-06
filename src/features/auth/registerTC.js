import { createAsyncThunk } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { setUser } from "./authSlice";
import { message } from "antd";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const createUser = createAsyncThunk(
  "auth/createUser",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // сохраняем пользователя в коллекцию "users"
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        name: user.displayName || "",
        photoURL: user.photoURL || "",
        createdAt: serverTimestamp(),
      });

      const plainUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
        name: user.displayName || "",
        photoURL: user.photoURL || "",
      };

      dispatch(setUser(plainUser));
      message.success("Регистрация прошла успешно!");

      // ✅ возвращаем plain object вместо _UserImpl
      return plainUser;
    } catch (error) {
      console.error("Ошибка регистрации:", error.message);
      message.error(`Ошибка: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);
