import { createSlice } from "@reduxjs/toolkit";
import { clearAllItem, getItem, setItem } from "../utils/storageConfig";
import { USER } from "../Constants";

export const userSlice = createSlice({
  name: "user",
  initialState: getItem(USER),
  reducers: {
    setUser: (state, action) => {
      setItem(USER, action.payload);
      state = getItem(USER);
      return state;
    },
    removeUser: (state) => {
      clearAllItem();
      state = null;
      return state;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
