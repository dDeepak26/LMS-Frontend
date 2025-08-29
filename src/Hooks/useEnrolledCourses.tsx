import { useDispatch, useSelector } from "react-redux";
import type { enrolledCoursesType } from "../Types/courseType";
import type { RootState } from "../store";
import { getEnrolledCoursesService } from "../Services/courseServices";
import { useEffect } from "react";
import { setEnrolledCourses } from "../Slices/enrolledCoursesSlice";

export const useEnrolledCourses = () => {
  const dispatch = useDispatch();

  // getting from db and setting allCourse
  const getEnrolledCourses = async () => {
    try {
      const enrolledCoursesData = await getEnrolledCoursesService();
      if (enrolledCoursesData && enrolledCoursesData.length !== 0) {
        dispatch(setEnrolledCourses(enrolledCoursesData));
      }
    } catch (err) {
      console.error("Error in getting the courses data", err);
    }
  };

  // getting the state data
  const enrolledCourses: enrolledCoursesType[] = useSelector(
    (state: RootState) => state.enrolledCourses
  );

  useEffect(() => {
    getEnrolledCourses();
  }, []);

  return { enrolledCourses, getEnrolledCourses };
};
