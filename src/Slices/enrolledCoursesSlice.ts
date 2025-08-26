import { createSlice } from "@reduxjs/toolkit";
import { getItem, setItem } from "../utils/storageConfig";
import { ENROLLED_COURSE } from "../Constants";

export const enrolledCoursesSlice = createSlice({
  name: "enrolledCourses",
  initialState: getItem(ENROLLED_COURSE),
  reducers: {
    setEnrolledCourses: (state, action) => {
      setItem(ENROLLED_COURSE, action.payload);
      state = getItem(ENROLLED_COURSE);
      return state;
    },
  },
});

export const { setEnrolledCourses } = enrolledCoursesSlice.actions;
export default enrolledCoursesSlice.reducer;
