import Header from "../Components/Header/Header";
import React from "react";
import CourseCard from "../Components/Courses/CourseCard.tsx";
import { SimpleGrid } from "@mantine/core";
import { useInstructorCourses } from "../Hooks/useInstructorCourses.tsx";

const InstructorLmsPage = () => {
  // custom hook that store all course and function to get all courses
  const { allInstructorCourses } = useInstructorCourses();

  return (
    <div className="pt-16">
      <Header />
      {/* container to display the courses */}
      <SimpleGrid cols={3} p={"md"}>
        {allInstructorCourses &&
          allInstructorCourses.map((course, index) => (
            <React.Fragment key={index}>
              <CourseCard course={course} />
            </React.Fragment>
          ))}
      </SimpleGrid>
    </div>
  );
};

export default InstructorLmsPage;
