import { createSlice } from "@reduxjs/toolkit";
import { createUser } from "./registerTC";
import { loginUser } from "./loginTC";

const initialState = {
  user: null,
  isAuth: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { uid, email, displayName, photoURL } = action.payload;
      state.user = { uid, email, displayName, photoURL };
      state.isAuth = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuth = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createUser.fulfilled, (state) => {
      state.loading = false;
    });
    // builder.addCase(createSlice.rejected, (state, action)=>{
    //   state.error = action.payload
    // }) 
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
