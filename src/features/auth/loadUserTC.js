import { createAsyncThunk } from "@reduxjs/toolkit";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { setUser } from "./authSlice";
import { doc, getDoc } from "firebase/firestore";
import { fetchOrCreateChannel } from "./channelSlice";

export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { dispatch }) => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};

          const updatedUser = {
            uid: user.uid,
            email: user.email,
            displayName: userData.name || user.displayName || "",
            name: userData.name || user.displayName || "",
            photoURL: userData.photoURL || user.photoURL || "",
          };

          dispatch(setUser(updatedUser));
          localStorage.setItem("user", JSON.stringify(updatedUser));
          dispatch(fetchOrCreateChannel(updatedUser));

          resolve(updatedUser);
        } else {
          dispatch(setUser(null));
          localStorage.removeItem("user");
          resolve(null);
        }
      });
    });
  }
);
