import { useSelector } from "react-redux";
import type { courseType } from "../Types/courseType";
import type { RootState } from "../store";
import Header from "../Components/Header/Header";
import {
  Accordion,
  ActionIcon,
  Anchor,
  AspectRatio,
  Avatar,
  Badge,
  Button,
  Flex,
  Group,
  Image,
  Text,
  Title,
} from "@mantine/core";
import getDiscountedPrice from "../utils/getDiscountedPrice";
import type { userType } from "../Types/UserType";
import { useHover } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";

const CourseDetailPage = () => {
  const course: courseType = useSelector(
    (state: RootState) => state.currentCourse
  );
  const user: userType = useSelector((state: RootState) => state.user);

  const { hovered, ref } = useHover();

  return (
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
              <Button variant="subtle" color="yellow">
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
            {/* edit lecture only */}
            {user && user.role === "instructor" && (
              <Button variant="subtle" color="yellow">
                Edit
              </Button>
            )}
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
                <Accordion.Control>{lecture.title}</Accordion.Control>
                <Accordion.Panel>
                  <Text>{lecture.lectureDescription}</Text>
                  {lecture.preview && (
                    <Anchor
                      href={lecture.videoUrl}
                      target="_blank"
                      color="blue"
                    >
                      Preview
                    </Anchor>
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
                    console.log("Edit image clicked");
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
          {user && user.role === "student" && (
            <Button fullWidth>Enroll Now</Button>
          )}
          {/* instructor */}
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
        </div>
      </Flex>
    </main>
  );
};

export default CourseDetailPage;
