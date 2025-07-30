import { createAsyncThunk } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { setUser } from "./authSlice";
import { message } from "antd";

export const createUser = createAsyncThunk(
  "auth/createUser",
  async ({ name, email, password, avatar }, { dispatch, rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      let photoURL = "";

      if (avatar) {
        const avatarRef = ref(Storage, `avatars/${user.id}`);
        await uploadBytes(avatarRef, avatar);
        photoURL = await getDownloadURL(avatarRef);
      }

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
        photoURL,
      });

      const updateUser = auth.currentUser;
      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          name: updateUser.displayName,
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
