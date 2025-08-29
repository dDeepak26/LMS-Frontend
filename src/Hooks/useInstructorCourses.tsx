import { useDispatch, useSelector } from "react-redux";
import type { courseType } from "../Types/courseType";
import type { RootState } from "../store";
import { getInstructorCoursesService } from "../Services/courseServices";
import { setAllCourses } from "../Slices/coursesSlice";
import { useEffect } from "react";

export const useInstructorCourses = () => {
  const dispatch = useDispatch();

  // getting from db and setting allCourse
  const getAllInstructorCourses = async () => {
    try {
      const coursesData = await getInstructorCoursesService();

      if (coursesData.length !== 0) {
        dispatch(setAllCourses(coursesData));
      }
    } catch (err) {
      console.error("Error in getting the courses data", err);
    }
  };

  // getting the state data
  const allInstructorCourses: courseType[] = useSelector(
    (state: RootState) => state.allCourses
  );

  useEffect(() => {
    getAllInstructorCourses();
  }, []);

  return { allInstructorCourses, getAllInstructorCourses };
};
