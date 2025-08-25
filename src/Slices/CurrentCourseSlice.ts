import { createSlice } from "@reduxjs/toolkit";
import { getItem, setItem } from "../utils/storageConfig";
import { CURRENT_COURSE } from "../Constants";

export const currentCourseSlice = createSlice({
  name: "currentCourse",
  initialState: getItem(CURRENT_COURSE),
  reducers: {
    setCurrentCourse: (state, action) => {
      setItem(CURRENT_COURSE, action.payload);
      state = getItem(CURRENT_COURSE);
      return state;
    },
  },
});

export const { setCurrentCourse } = currentCourseSlice.actions;
export default currentCourseSlice.reducer;
