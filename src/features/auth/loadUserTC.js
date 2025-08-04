import { createAsyncThunk } from "@reduxjs/toolkit";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { setUser } from "./authSlice";

export const loadUser = createAsyncThunk("auth/loadUser", async (_, { dispatch }) => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const updatedUser = {
          uid: user.uid,
          email: user.email,
          displayName: storedUser?.displayName || user.displayName || "",
          name: storedUser?.name || user.displayName || "",
          photoURL: storedUser?.photoURL || user.photoURL || "",
        };
        dispatch(setUser(updatedUser));
        localStorage.setItem("user", JSON.stringify(updatedUser)); // Синхронизация
        resolve(updatedUser);
      } else {
        dispatch(setUser(null));
        localStorage.removeItem("user");
        resolve(null);
      }
    });
  });
});