import React from "react";
import Header from "../Components/Header/Header";
import { SimpleGrid } from "@mantine/core";
import CourseCard from "../Components/Courses/CourseCard";
import { useCourses } from "../Hooks/useCourses";
import { useEnrolledCourses } from "../Hooks/useEnrolledCourses";

const StudentLmsPage = () => {
  // getting all courses data from custom hook
  const { allCourses } = useCourses();
  // enrolled courses
  useEnrolledCourses();

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
