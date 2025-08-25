import Header from "../Components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store.ts";
import React, { useEffect } from "react";
import { getAllCoursesService } from "../Services/courseServices.tsx";
import { setAllCourses } from "../Slices/coursesSlice.ts";
import CourseCard from "../Components/Courses/CourseCard.tsx";
import { SimpleGrid } from "@mantine/core";
import type { courseType } from "../Types/courseType.ts";

const InstructorLmsPage = () => {
  const dispatch = useDispatch();
  const allCourses: courseType[] = useSelector(
    (state: RootState) => state.allCourses
  );

  const getAllCourses = async () => {
    try {
      const coursesData = await getAllCoursesService();
      dispatch(setAllCourses(coursesData));
    } catch (err) {
      console.error("Error in getting the courses data");
    }
  };

  useEffect(() => {
    getAllCourses();
  }, []);

  return (
    <div className="pt-16">
      <Header />
      {/* container to display the courses */}
      <SimpleGrid cols={3} p={"md"}>
        {allCourses &&
          allCourses.map((course, index) => (
            <React.Fragment key={index}>
              <CourseCard course={course} />
            </React.Fragment>
          ))}
      </SimpleGrid>
    </div>
  );
};

export default InstructorLmsPage;
