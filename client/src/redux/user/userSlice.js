import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: state => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    signInFailure: (state, action) => {
      state.loading = false;
    },
    updateUserStart: state => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    updateUserFailure: (state, action) => {
      state.loading = false;
    },
    deleteUserStart: state => {
      state.loading = true;
    },
    deleteUserSuccess: state => {
      state.currentUser = null;
      state.loading = false;
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
    },
    signOut: state => {
      state.currentUser = null;
      state.loading = false;
    }
  }
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut
} = userSlice.actions;

export default userSlice.reducer;
