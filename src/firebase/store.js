import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/authSlice.js";
import storiesReducer from "../features/stories/storiesSlice.js";
import postReducer from "../features/auth/postSlice.js";
import searchReduser from "../features/searchSlice.js";
import chennelSlice from "../features/auth/channelSlice.js";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    stories: storiesReducer,
    post: postReducer,
    search: searchReduser,
    channel: chennelSlice,
  },
});
