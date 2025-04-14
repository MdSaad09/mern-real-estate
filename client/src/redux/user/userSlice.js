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
      state.user = action.payload;
      state.error = null;
    },
    signInFailure: (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      },
  },
});

export const { signInRequest, signInSuccess, signInFailure } = userSlice.actions;
export default userSlice.reducer;
