import { useSelector } from "react-redux";
import type {
  courseType,
  enrolledCoursesType,
  lecture,
} from "../Types/courseType";
import type { RootState } from "../store";
import Header from "../Components/Header/Header";
import {
  Accordion,
  ActionIcon,
  AspectRatio,
  Avatar,
  Badge,
  Button,
  Flex,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import getDiscountedPrice from "../utils/getDiscountedPrice";
import type { userType } from "../Types/UserType";
import { useDisclosure, useHover } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import UpdateCourseModal from "../Components/Modal/UpdateCourseModal";
import { useEffect, useState } from "react";
import {
  enrollToCourseService,
  getEnrollUsersService,
} from "../Services/courseServices";
import { useEnrolledCourses } from "../Hooks/useEnrolledCourses";
import type { enrolledUserCourseType } from "../Types/enrolledUserCourseType";
import { toSnakeCaseOnlyLetters } from "../utils/camelCaseText";
import { Link } from "react-router-dom";

const CourseDetailPage = () => {
  const [updateModalOpened, { open, close }] = useDisclosure(false);
  // state to manage which model should open to update the course
  const [modelState, setModelState] = useState<string>("");
  // state to store the lecture order to update it
  const [updateLecture, setUpdateLecture] = useState<lecture>();
  // enrolled student data list for the current course
  const [enrolledStudents, setEnrolledStudents] = useState<
    enrolledUserCourseType[]
  >([]);
  enrolledStudents && console.log(enrolledStudents);

  // getting current course data state
  const course: courseType = useSelector(
    (state: RootState) => state.currentCourse
  );
  // getting user data state
  const user: userType = useSelector((state: RootState) => state.user);

  // getting enrolled data state
  const enrolledCourses: enrolledCoursesType[] = useSelector(
    (state: RootState) => state.enrolledCourses
  );
  // checking weather the current is enroller or not
  let isCurrentCourseEnroll: boolean = false;
  if (enrolledCourses && enrolledCourses.length !== 0) {
    // checking if course is enroller or not
    isCurrentCourseEnroll = enrolledCourses.some(
      (data) => data.course._id === course._id
    );
  }
  // get enrolled function form custom hook
  const { getEnrolledCourses } = useEnrolledCourses();

  // hover from mantine
  const { hovered, ref } = useHover();

  // getting the enrolled student data
  const getEnrolledStudent = async () => {
    try {
      // getting data from api
      const enrollStudentData = await getEnrollUsersService(course._id);
      // storing data in state
      setEnrolledStudents(enrollStudentData);
    } catch (err) {
      console.error("error in getting the enrolled student data");
    }
  };

  useEffect(() => {
    getEnrolledStudent();
  }, [course]);

  return (
    <>
      <UpdateCourseModal
        modelFor={modelState}
        opened={updateModalOpened}
        close={close}
        course={course}
        lecture={updateLecture}
      />
      <main className="pt-16">
        <Header />
        <Flex
          gap="md"
          justify="flex-start"
          align="start"
          direction="row"
          wrap="wrap"
        >
          {/* left section */}
          <div className="flex-2 border rounded-xl border-neutral-600 p-3">
            {/* name */}
            <Group justify="space-between">
              <Title order={2}>{course.name}</Title>
              {/* edit data except image and lectures */}
              {user && user.role === "instructor" && (
                <Button
                  variant="subtle"
                  color="yellow"
                  onClick={() => {
                    open();
                    setModelState("data");
                  }}
                >
                  Edit
                </Button>
              )}
            </Group>
            {/* description */}
            <Title order={4} mt={"md"}>
              Description:
            </Title>
            <Text>{course.description}</Text>
            {/* outcome */}
            <Title order={4} mt={"md"}>
              OutComes:
            </Title>
            <Text>{course.outcomes}</Text>
            {/* skills */}
            <Title order={4} mt={"md"}>
              Skills:
            </Title>
            <Flex gap="xs" wrap="wrap">
              {course.skillsGained.map((skill, index) => (
                <Badge color="gray" key={index}>
                  {skill}
                </Badge>
              ))}
            </Flex>
            <Group justify="space-between">
              <Title order={4} mt={"md"}>
                Lectures:
              </Title>
              {/* <Button variant="transparent" color="green">
                Add Lectures
              </Button> */}
            </Group>
            {/* lectures */}
            <Accordion
              multiple={true}
              chevronPosition="right"
              variant="contained"
              radius="md"
            >
              {course.lectures.map((lecture, index) => (
                <Accordion.Item key={index} value={lecture.title}>
                  <Accordion.Control>
                    {lecture.title}{" "}
                    {user && user.role === "instructor" && (
                      <Text
                        c={"yellow"}
                        fw={400}
                        onClick={() => {
                          open();
                          setModelState("lecture");
                          setUpdateLecture(lecture);
                        }}
                      >
                        Edit
                      </Text>
                    )}
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text>{lecture.lectureDescription}</Text>
                    {(lecture.preview || isCurrentCourseEnroll) && (
                      <Link
                        to={`/${toSnakeCaseOnlyLetters(
                          course.name
                        )}/${toSnakeCaseOnlyLetters(lecture.title)}`}
                        className="text-blue-600"
                      >
                        {isCurrentCourseEnroll ? "View Lecture" : "Preview"}
                      </Link>
                    )}
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </div>

          {/* right section */}
          <div className="flex-1 border rounded-xl border-neutral-600 p-3">
            {/* image for student */}
            {user && user.role === "student" && (
              <Image
                ref={ref}
                src={course.imageUrl}
                alt={course.name}
                radius={"md"}
                className="relative"
              />
            )}

            {/* image for instructor with edit button */}
            {user && user.role === "instructor" && (
              <AspectRatio
                ratio={16 / 9}
                ref={ref}
                className="relative rounded-md overflow-hidden cursor-pointer group"
              >
                {/* Image */}
                <Image
                  src={course.imageUrl}
                  alt={course.name}
                  radius="md"
                  className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-90"
                />

                <div
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                    hovered ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <ActionIcon
                    variant="filled"
                    color="yellow"
                    size="xl"
                    className="shadow-lg"
                    onClick={() => {
                      open();
                      setModelState("image");
                    }}
                  >
                    <IconPencil size={24} />
                  </ActionIcon>
                </div>
              </AspectRatio>
            )}

            {/* price */}
            <Title order={3} my={"md"}>
              Price: ₹{getDiscountedPrice(course.price, course.discount)}/-
            </Title>
            {/* enroll button */}
            {user && user.role === "student" && !isCurrentCourseEnroll && (
              <Button
                fullWidth
                onClick={async () => {
                  await enrollToCourseService(course._id);
                  await getEnrolledCourses();
                }}
              >
                Enroll Now
              </Button>
            )}
            {/* instructor details */}
            <Title order={4} mt={"md"}>
              Instructor Details:
            </Title>
            <Group>
              <Avatar src="" alt="Instructor image" />
              <Flex direction={"column"}>
                <Text>{course.instructor.fullName}</Text>
                <Text>{course.instructor.email}</Text>
              </Flex>
              {/* other details of instructor */}
            </Group>
            {/* enrolled student list */}
            {user &&
              user.role === "instructor" &&
              enrolledStudents &&
              enrolledStudents.length > 0 && (
                <div className="mt-2 max-h-screen overflow-y-auto border-t pt-1">
                  <Title order={4}>Enrolled Students</Title>
                  <Stack p={"xs"} align="stretch" justify="center" gap="md">
                    {enrolledStudents &&
                      enrolledStudents.map((student, index) => (
                        <Group key={index}>
                          <Avatar src="" alt="Instructor image" />
                          <Flex direction={"column"}>
                            <Text>{student.user.fullName}</Text>
                            <Text>{student.user.email}</Text>
                          </Flex>
                        </Group>
                      ))}
                  </Stack>
                </div>
              )}
          </div>
        </Flex>
      </main>
    </>
  );
};

export default CourseDetailPage;
