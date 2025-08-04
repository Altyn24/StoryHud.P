import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage, db } from "../../firebase/firebaseConfig";
import { setUser } from "./authSlice";
import { message } from "antd";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async ({ name, avatar }, { dispatch, rejectWithValue }) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Пользователь не авторизован");
      }

      let photoURL = user.photoURL || "";
      if (avatar) {
        const avatarRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(avatarRef, avatar);
        photoURL = await getDownloadURL(avatarRef);
      }

      await updateProfile(user, {
        displayName: name || user.displayName,
        photoURL: photoURL || user.photoURL,
      });

      // Обновляем все посты пользователя в Firestore
      const q = query(
        collection(db, "stories"),
        where("authorId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const updatePromises = querySnapshot.docs.map(async (doc) => {
        await updateDoc(doc.ref, {
          authorName: name || user.displayName,
          authorPhoto: photoURL || user.photoURL,
        });
      });
      await Promise.all(updatePromises);

      const updatedUser = {
        uid: user.uid,
        email: user.email,
        displayName: name || user.displayName,
        name: name || user.displayName,
        photoURL: photoURL || user.photoURL,
      };

      dispatch(setUser(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));
      message.success("Профиль успешно обновлен!");
      return updatedUser;
    } catch (error) {
      console.error("Ошибка обновления профиля:", error.message);
      message.error(`Ошибка: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);