import { configureStore } from "@reduxjs/toolkit";
import  authSlice  from "../features/auth/authSlice.js"
import storiesReducer from "../features/auth/storiesSlice.js"

export const store = configureStore({
  reducer: {
   auth: authSlice,
   stories: storiesReducer,
  },
});
