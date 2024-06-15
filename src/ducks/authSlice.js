import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: null,
  userId: null,  // Add userId to the state
  profilePicture: null,  // Add profilePicture to the state
  authorizationLevel: null,
  isLoggedIn: false,
  lastLoginTime: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.username = action.payload.username;
      state.userId = action.payload.userId;  // Store userId
      state.profilePicture = action.payload.profilePicture;  // Store profilePicture
      state.authorizationLevel = action.payload.authorizationLevel;
      state.isLoggedIn = true;
      state.lastLoginTime = new Date().getTime();
    },
    logout: (state) => {
      state.username = null;
      state.userId = null;  // Reset userId
      state.profilePicture = null;  // Reset profilePicture
      state.authorizationLevel = null;
      state.isLoggedIn = false;
      state.lastLoginTime = null;
    },
    checkAuthTimeout: (state) => {
      const currentTime = new Date().getTime();
      const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
      if (currentTime - state.lastLoginTime > oneHour) {
        state.username = null;
        state.userId = null;  // Reset userId
        state.profilePicture = null;  // Reset profilePicture
        state.authorizationLevel = null;
        state.isLoggedIn = false;
        state.lastLoginTime = null;
      }
    },
  },
});

export const { login, logout, checkAuthTimeout } = authSlice.actions;
export default authSlice.reducer;
