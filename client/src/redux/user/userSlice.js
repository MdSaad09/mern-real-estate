import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInRequest(state) {
      state.isLoading = true;
      state.error = null;
    },
    signInSuccess(state, action) {
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
    },
    signInFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
   
  },
}); 

export const { signInRequest, signInSuccess, signInFailure } = userSlice.actions;
export const userReducer = userSlice.reducer;
