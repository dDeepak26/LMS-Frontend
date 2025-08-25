import React, { useEffect } from "react";
import Header from "../Components/Header/Header";
import { SimpleGrid } from "@mantine/core";
import CourseCard from "../Components/Courses/CourseCard";
import { setAllCourses } from "../Slices/coursesSlice";
import { getAllCoursesService } from "../Services/courseServices";
import type { courseType } from "../Types/courseType";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";

const StudentLmsPage = () => {
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

export default StudentLmsPage;
