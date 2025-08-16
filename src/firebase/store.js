import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/authSlice.js";
import storiesReducer from "../features/stories/storiesSlice.js";
import postReducer from "../features/auth/postSlice.js";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    stories: storiesReducer,
    post: postReducer,
  },
});