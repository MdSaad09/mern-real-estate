import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  error: null,
  isLoading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInRequest:(state) => {
      state.isLoading = true;
      state.error = null;
    },
    signInSuccess:(state, action) => {
      state.isLoading = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    signInFailure: (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
    },
    updateUserStart :(state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateUserSuccess :(state, action) => {
      state.isLoading = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    updateUserFailure :(state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    deleteUserStart :(state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteUserSuccess :(state) => {
      state.isLoading = false;
      state.currentUser = null;
      state.error = null;
    },
    deleteUserFailure :(state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    signOutUserStart :(state) => {
      state.isLoading = true;
      state.error = null;
    },
    signOutUserSuccess :(state) => {
      state.isLoading = false;
      state.currentUser = null;
      state.error = null;
    },
    signOutUserFailure :(state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

  },
});

export const { signInRequest, signInSuccess, signInFailure, updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutUserStart, signOutUserSuccess, signOutUserFailure } = userSlice.actions;
export default userSlice.reducer;
