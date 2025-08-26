import { useDispatch, useSelector } from "react-redux";
import type { courseType } from "../Types/courseType";
import type { RootState } from "../store";
import { getAllCoursesService } from "../Services/courseServices";
import { setAllCourses } from "../Slices/coursesSlice";
import { useEffect } from "react";

export const useCourses = () => {
  const dispatch = useDispatch();

  // getting from db and setting allCourse
  const getAllCourses = async () => {
    try {
      const coursesData = await getAllCoursesService();

      if (coursesData.length !== 0) {
        dispatch(setAllCourses(coursesData));
      }
    } catch (err) {
      console.error("Error in getting the courses data", err);
    }
  };

  // getting the state data
  const allCourses: courseType[] = useSelector(
    (state: RootState) => state.allCourses
  );

  useEffect(() => {
    getAllCourses();
  }, []);

  return { allCourses, getAllCourses };
};
