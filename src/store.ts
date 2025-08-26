import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slices/userSlice.ts";
import allCoursesReducer from "./Slices/coursesSlice.ts";
import currentCourseReducer from "./Slices/CurrentCourseSlice.ts";
import enrolledCoursesReducer from "./Slices/enrolledCoursesSlice.ts";

export const store = configureStore({
  reducer: {
    user: userReducer,
    allCourses: allCoursesReducer,
    currentCourse: currentCourseReducer,
    enrolledCourses: enrolledCoursesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
