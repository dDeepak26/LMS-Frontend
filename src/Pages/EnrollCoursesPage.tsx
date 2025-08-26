import React from "react";
import Header from "../Components/Header/Header";
import { useEnrolledCourses } from "../Hooks/useEnrolledCourses";
import CourseCard from "../Components/Courses/CourseCard";
import { SimpleGrid } from "@mantine/core";

const EnrollCoursesPage = () => {
  const { enrolledCourses } = useEnrolledCourses();

  return (
    <div className="pt-16">
      <Header />
      {/* container to display the enrolled courses */}
      <SimpleGrid cols={3} p={"md"}>
        {enrolledCourses &&
          enrolledCourses.map((course, index) => (
            <React.Fragment key={index}>
              <CourseCard course={course.course} />
            </React.Fragment>
          ))}
      </SimpleGrid>
    </div>
  );
};

export default EnrollCoursesPage;
