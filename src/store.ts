import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slices/userSlice.ts";

export default configureStore({
  reducer: {
    user: userReducer,
  },
});
