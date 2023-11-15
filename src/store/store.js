import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import AdminSlice from "./slices/adminSlice";
import AuthSlice from "./slices/authSlice";
import CommonSlice from "./slices/commonSlice";

export const store = configureStore({
  reducer: {
    AdminSlice: AdminSlice,
    AuthSlice: AuthSlice,
    CommonSlice: CommonSlice,
  },
  // middleware: [...getDefaultMiddleware(), firebaseMiddleware],
});
