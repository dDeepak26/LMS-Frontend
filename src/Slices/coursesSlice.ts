import { createSlice } from "@reduxjs/toolkit";
import { getItem, setItem } from "../utils/storageConfig";
import { ALL_COURSES } from "../Constants";

export const allCoursesSlice = createSlice({
  name: "allCourses",
  initialState: getItem(ALL_COURSES),
  reducers: {
    setAllCourses: (state, action) => {
      setItem(ALL_COURSES, action.payload);
      state = getItem(ALL_COURSES);
      return state;
    },
  },
});

export const { setAllCourses } = allCoursesSlice.actions;
export default allCoursesSlice.reducer;
