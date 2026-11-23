import { createSlice } from "@reduxjs/toolkit";

interface UiSlice {
  isLoading: boolean;
  isLoggedIn: boolean;
  error: string;
  success: string;
  loginSignup: boolean;
  productListShow: "col";
}

const initialState = {
  isLoading: false,
  isLoggedIn: false,
  error: "",
  success: "",
  loginSignup: true,
  productListShow: "col",
  sorting: "close",
};
const uiSlice = createSlice({
  name: "ui",
  initialState: initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
    clearError: (state) => {
      state.error = "";
    },
    clearAll: (state) => {
      state.isLoading = false;
      state.error = "";
      state.success = "";
      state.isLoggedIn = false;
      state.productListShow = "col";
    },
    loginSignup: (state, action) => {
      state.loginSignup = action.payload;
    },
    setProductListShow: (state, action) => {
      state.productListShow = action.payload;
    },
    setSorting: (state, action) => {
      state.sorting = action.payload;
    },
  },
});

export const {
  setIsLoading,
  setError,
  setSuccess,
  clearError,
  clearAll,
  setIsLoggedIn,
  loginSignup,
  setProductListShow,
  setSorting,
} = uiSlice.actions;
export default uiSlice.reducer;
