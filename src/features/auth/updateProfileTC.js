import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage, db } from "../../firebase/firebaseConfig";
import { setUser } from "./authSlice";
import { message } from "antd";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async ({ name, avatar }, { dispatch, rejectWithValue, getState }) => {
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

      const currentUser = getState().auth.user;
      const newDisplayName = name || user.displayName;
      const newPhotoURL = photoURL || user.photoURL;

      if (newDisplayName !== currentUser.displayName || newPhotoURL !== currentUser.photoURL) {
        await updateProfile(user, {
          displayName: newDisplayName,
          photoURL: newPhotoURL,
        });

        await updateDoc(doc(db, "users", user.uid), {
          name: newDisplayName,
          photoURL: newPhotoURL,
        });

        if (newDisplayName !== currentUser.displayName) {
          const q = query(collection(db, "stories"), where("authorId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const updatePromises = querySnapshot.docs.map(async (doc) => {
            await updateDoc(doc.ref, {
              authorName: newDisplayName,
            });
          });
          await Promise.all(updatePromises);
        }
      }

      const updatedUser = {
        uid: user.uid,
        email: user.email,
        displayName: newDisplayName,
        name: newDisplayName,
        photoURL: newPhotoURL,
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