import { Badge, Button, Card, Group, Image, Text } from "@mantine/core";
import type { courseType } from "../../Types/courseType";
import { IconStarFilled } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentCourse } from "../../Slices/CurrentCourseSlice";

const CourseCard = ({ course }: { course: courseType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image src={course.imageUrl} alt={course.name} />
      </Card.Section>
      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{course.name}</Text>
        <Badge
          color={
            course.level === "Beginner"
              ? "green"
              : course.level === "Intermediate"
              ? "yellow"
              : "red"
          }
        >
          {course.level}
        </Badge>
      </Group>

      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          {course.instructor?.fullName}
        </Text>
        <Text className="flex flex-row justify-center items-center">
          4.5 <IconStarFilled size={18} className="ml-1 text-amber-500" />
        </Text>
      </Group>

      <Button
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        onClick={() => {
          dispatch(setCurrentCourse(course));
          navigate(`/course-detail/${course._id}`, { replace: true });
        }}
      >
        View Detail
      </Button>
    </Card>
  );
};

export default CourseCard;
