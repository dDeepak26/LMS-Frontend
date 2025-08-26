import Header from "../Components/Header/Header";
import React from "react";
import CourseCard from "../Components/Courses/CourseCard.tsx";
import { SimpleGrid } from "@mantine/core";
import { useCourses } from "../Hooks/useCourses.tsx";

const InstructorLmsPage = () => {
  // custom hook that store all course and function to get all courses
  const { allCourses } = useCourses();

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
