import {
  Button,
  Checkbox,
  FileInput,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  TagsInput,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconCheck,
  IconPhotoPlus,
  IconX,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { createCourseService } from "../Services/courseServices";
import type { courseType } from "../Types/courseType";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

const CourseCreateUpdate = () => {
  const [visible, { open, close }] = useDisclosure(false);

  // form config
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      description: "",
      category: "",
      level: "Beginner",
      outcomes: "",
      skillsGained: [],
      price: null,
      discount: null,
      imageUrl: null,
      lectures: [
        {
          order: null,
          title: "",
          lectureDescription: "",
          preview: false,
          videoUrl: null,
        },
      ],
    },
    validate: {
      name: (value) =>
        value.trim().length === 0 ? "Course name is required" : null,

      description: (value) =>
        value.trim().length === 0 ? "Description is required" : null,

      category: (value) =>
        value.trim().length === 0 ? "Category is required" : null,

      level: (value) =>
        ["Beginner", "Intermediate", "Advanced"].includes(value)
          ? null
          : "Level must be one of: Beginner, Intermediate, Advanced",

      outcomes: (value) =>
        value.trim().length === 0 ? "Outcomes are required" : null,

      skillsGained: (value) =>
        Array.isArray(value) && value.length > 0
          ? null
          : "At least one skill is required",

      price: (value) =>
        value && value > 0 ? null : "Price must be a number greater than 0",

      discount: (value) =>
        value === null || value >= 0
          ? null
          : "Discount must be a positive number or 0",

      imageUrl: (value) =>
        value === null ? "Must be a valid image URL" : null,
    },
  });

  const handleCreateCourse = async (values: courseType) => {
    open();

    const serRes = await createCourseService(values);
    if (serRes) {
      console.log("server response: ", serRes);

      if (serRes.msg) {
        console.log("Course Created", serRes);
        form.reset();
        notifications.show({
          title: `Course Created Successfully`,
          message: "",
          color: "green",
          icon: <IconCheck size={18} />,
          autoClose: 3000,
        });
        close();
      } else {
        close();
        notifications.show({
          title: `${serRes.response.statusText}`,
          message: "Error in creating course",
          color: "red",
          icon: <IconX size={18} />,
          autoClose: 3000,
        });
      }
      close();
    }
  };

  return (
    <>
      {/* header */}
      <div className="flex justify-between p-3 border-neutral-600 shadow-2xl">
        <Link to={"/instructor-lms"}>
          <Title order={3} className="cursor-pointer">
            LMS
          </Title>
        </Link>
        <Link to={"/instructor-lms"}>
          <Button variant="light" leftSection={<IconArrowLeft />}>
            Back
          </Button>
        </Link>
      </div>

      {/* form */}
      <div className="flex justify-center mt-5 mb-20">
        <div className="w-1/3 md:w-1/2 sm:w-full sm:p-5 shadow-md rounded-lg relative">
          <LoadingOverlay
            visible={visible}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
            loaderProps={{ color: "blue", type: "bars" }}
          />
          <form
            onSubmit={form.onSubmit((values) => handleCreateCourse(values))}
            className="space-y-4"
          >
            {/* name */}
            <TextInput
              withAsterisk
              label="Enter Course Name"
              placeholder="eg. full stack web development"
              required={true}
              key={form.key("name")}
              {...form.getInputProps("name")}
            />

            {/* description */}
            <Textarea
              label="Enter Course Description"
              placeholder="description"
              required={true}
              minRows={3}
              autosize
              resize="vertical"
              key={form.key("description")}
              {...form.getInputProps("description")}
            />

            {/* category */}
            <TextInput
              withAsterisk
              label="Enter Course Category"
              placeholder="IT"
              required={true}
              key={form.key("category")}
              {...form.getInputProps("category")}
            />

            {/* level */}
            <Select
              label="Select Course Level"
              placeholder="Pick value"
              data={["Beginner", "Intermediate", "Advanced"]}
              allowDeselect={false}
              key={form.key("level")}
              {...form.getInputProps("level")}
            />

            {/* outcome */}
            <Textarea
              label="Enter Course Outcome"
              placeholder="full stack development"
              required={true}
              minRows={3}
              autosize
              resize="vertical"
              key={form.key("outcomes")}
              {...form.getInputProps("outcomes")}
            />

            {/* skill gained */}
            <TagsInput
              withAsterisk
              label="Enter skills"
              placeholder="Enter tag"
              required={true}
              isDuplicate={(tagValue, currentTags) =>
                currentTags.some((val) => val === tagValue)
              }
              key={form.key("skillsGained")}
              {...form.getInputProps("skillsGained")}
            />
            {/* price, discount */}
            <Group grow>
              <NumberInput
                withAsterisk
                required={true}
                label="Enter Course Price"
                prefix="₹"
                placeholder="₹5000"
                min={0}
                allowNegative={false}
                thousandSeparator=","
                key={form.key("price")}
                {...form.getInputProps("price")}
              />
              <NumberInput
                withAsterisk
                required={true}
                label="Enter Course Discount"
                suffix="%"
                placeholder="10%"
                min={0}
                max={100}
                allowNegative={false}
                key={form.key("discount")}
                {...form.getInputProps("discount")}
              />
            </Group>

            {/* image */}
            <FileInput
              withAsterisk
              label="Select Course Thumbnail Image"
              placeholder="select image"
              accept="image/png,image/jpeg, image/jpg, image/webp"
              clearable
              leftSection={<IconPhotoPlus />}
              required={true}
              key={form.key("imageUrl")}
              {...form.getInputProps("imageUrl")}
            />

            {form.values.lectures.map((_lecture, index) => (
              <div
                key={index}
                className="border border-neutral-600 p-3 rounded-lg my-3 space-y-2"
              >
                <TextInput
                  withAsterisk
                  label={`Lecture ${index + 1} Title`}
                  placeholder="title"
                  key={form.key(`lectures.${index}.title`)}
                  {...form.getInputProps(`lectures.${index}.title`)}
                />

                <Textarea
                  label="Lecture Description"
                  placeholder="description"
                  minRows={3}
                  autosize
                  resize="vertical"
                  key={form.key(`lectures.${index}.lectureDescription`)}
                  {...form.getInputProps(
                    `lectures.${index}.lectureDescription`
                  )}
                />

                <Checkbox
                  label="Make this lecture visible to free users"
                  key={form.key(`lectures.${index}.preview`)}
                  {...form.getInputProps(`lectures.${index}.preview`)}
                />

                <FileInput
                  withAsterisk
                  label="Select Lecture Video"
                  placeholder="select video"
                  accept="video/mp4,video/mkv,video/webm"
                  clearable
                  leftSection={<IconPhotoPlus />}
                  {...form.getInputProps(`lectures.${index}.videoUrl`)}
                  key={form.key(`lectures.${index}.videoUrl`)}
                />

                <Button
                  variant="light"
                  color="red"
                  onClick={() => form.removeListItem("lectures", index)}
                >
                  Remove Lecture
                </Button>
              </div>
            ))}

            {/* add lectures button */}
            <Button
              fullWidth
              variant="light"
              onClick={() =>
                form.insertListItem("lectures", {
                  order: null,
                  title: "",
                  lectureDescription: "",
                  preview: false,
                  videoUrl: null,
                })
              }
            >
              Add Lecture
            </Button>
            {/* create course button */}
            <Button type="submit" fullWidth>
              Create Course
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CourseCreateUpdate;
