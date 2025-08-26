import { Notifications } from "@mantine/notifications";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./Pages/Index";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import StudentLmsPage from "./Pages/StudentLmsPage";
import InstructorLmsPage from "./Pages/InstructorLmsPage";
import NoPage from "./Pages/NoPage";
import CourseCreateUpdate from "./Pages/CourseCreateUpdate";
import CourseDetailPage from "./Pages/CourseDetailPage";
import EnrollCoursesPage from "./Pages/EnrollCoursesPage";

const App = () => {
  return (
    <>
      <Notifications position="top-center" />
      <BrowserRouter>
        <Routes>
          {/* index route */}
          <Route path="/" element={<Index />} />

          {/* auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* student route */}
          <Route path="/student-lms" element={<StudentLmsPage />} />
          <Route
            path="/student-lms/enrolled-courses"
            element={<EnrollCoursesPage />}
          />

          {/* instructor route */}
          <Route path="/instructor-lms" element={<InstructorLmsPage />} />
          <Route
            path="/instructor-lms/course"
            element={<CourseCreateUpdate />}
          />

          {/* course route */}
          <Route
            path="/course-detail/:courseId"
            element={<CourseDetailPage />}
          />

          {/* no page */}
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
