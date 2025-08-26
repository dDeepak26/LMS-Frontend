import {
  Button,
  Checkbox,
  FileInput,
  Group,
  LoadingOverlay,
  Modal,
  NumberInput,
  Select,
  TagsInput,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconBrandYoutube, IconPhotoPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import {
  updateCourseDataService,
  updateCourseImageService,
  updateCourseLectureService,
} from "../../Services/courseServices";
import getCloudinaryPublicId from "../../utils/getCloudinaryPublicId";
import { useDispatch } from "react-redux";
import { setCurrentCourse } from "../../Slices/CurrentCourseSlice";
import { useForm } from "@mantine/form";
import type { courseType, lecture } from "../../Types/courseType";

const UpdateCourseModal = ({
  modelFor,
  opened,
  close,
  course,
  lecture,
}: {
  modelFor: string;
  opened: any;
  close: any;
  course: courseType;
  lecture?: lecture;
}) => {
  const dispatch = useDispatch();
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // form config for course Data
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
    },
  });

  //   form config for course lecture
  const formForLecture = useForm({
    mode: "uncontrolled",
    initialValues: {
      order: null,
      title: "",
      lectureDescription: "",
      preview: false,
      videoUrl: null,
    },
    validate: {
      title: (value) =>
        value.trim().length === 0 ? "Lecture title is required" : null,

      lectureDescription: (value) =>
        value.trim().length === 0 ? "Lecture Description is required" : null,
    },
  });

  //   useEffect to change the form data when modal state is for data
  useEffect(() => {
    if (course) {
      form.setValues({
        name: course.name,
        description: course.description,
        category: course.category,
        level: course.level,
        outcomes: course.outcomes,
        skillsGained: course.skillsGained,
        price: course.price,
        discount: course.discount,
      });
    }
  }, [course, modelFor === "data"]);

  //   useEffect to change the form data for lecture when modal state is for lecture
  useEffect(() => {
    if (lecture) {
      formForLecture.setValues({
        order: lecture.order,
        title: lecture.title,
        lectureDescription: lecture.lectureDescription,
        preview: lecture.preview,
      });
    }
  }, [lecture, modelFor === "lecture"]);

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={"Update Course"}
      size={"lg"}
      centered
    >
      {/* Modal content for Image*/}
      {modelFor && modelFor === "image" && (
        <>
          <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
            loaderProps={{ color: "blue", type: "bars" }}
          />
          <FileInput
            withAsterisk
            label="Select New Course Image"
            placeholder="select image"
            accept="image/png,image/jpeg, image/jpg, image/webp"
            leftSection={<IconPhotoPlus />}
            required
            clearable
            value={image}
            onChange={setImage}
          />
          <Button
            variant="light"
            color="yellow"
            fullWidth
            mt={"md"}
            onClick={async () => {
              setLoading(true);
              // send data to api to update the image
              const data = await updateCourseImageService(
                image,
                course._id,
                getCloudinaryPublicId(course.imageUrl ?? "") ?? ""
              );
              //   making the api call to get the latest course data
              //   const updatedCourseData = await getCourseDetail(course._id);
              //   updating the state
              dispatch(setCurrentCourse(data.updatedCourseData));
              setLoading(false);
              //   closing the model
              close();
              //   resetting the state/form
              setImage(null);
            }}
          >
            Update Image
          </Button>
        </>
      )}
      {/* Modal content for data */}
      {modelFor && modelFor === "data" && (
        <form
          className="space-y-2"
          onSubmit={form.onSubmit(async (values) => {
            setLoading(true);
            // making the api call to update the data
            const data = await updateCourseDataService(course._id, values);
            if (data.updatedCourseData) {
              dispatch(setCurrentCourse(data.updatedCourseData));
              // resetting form
              form.reset();
              setLoading(false);
              close();
            }
            setLoading(false);
          })}
        >
          <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
            loaderProps={{ color: "blue", type: "bars" }}
          />
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
          <Button
            type="submit"
            variant="light"
            color="yellow"
            fullWidth
            mt={"md"}
          >
            Update Course
          </Button>
        </form>
      )}

      {/* Modal content for Lectures*/}
      {modelFor && modelFor === "lecture" && (
        <>
          <form
            className="space-y-2"
            onSubmit={formForLecture.onSubmit(async (values) => {
              setLoading(true);
              //   api call to update the lecture
              let data;
              //   if video is not uploaded then sending the previous video url
              if (!values.videoUrl) {
                data = await updateCourseLectureService(
                  course._id,
                  course.name,
                  {
                    ...values,
                    videoUrl: lecture?.videoUrl,
                  }
                );
              } else if (values.videoUrl) {
                // if video is uploaded then setting the video url to previous url and send the video file
                data = await updateCourseLectureService(
                  course._id,
                  course.name,
                  {
                    ...values,
                    videoUrl: lecture?.videoUrl,
                  },
                  values.videoUrl
                );
              }

              //   updating the state
              if (data.updatedLectureData) {
                dispatch(setCurrentCourse(data.updatedLectureData));
                close();
                setLoading(false);
                formForLecture.reset();
              }
              setLoading(false);
            })}
          >
            <LoadingOverlay
              visible={loading}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
              loaderProps={{ color: "blue", type: "bars" }}
            />

            <TextInput
              withAsterisk
              label={`Lecture Title`}
              placeholder="title"
              key={formForLecture.key(`title`)}
              {...formForLecture.getInputProps(`title`)}
            />

            <Textarea
              label="Lecture Description"
              placeholder="description"
              minRows={3}
              autosize
              resize="vertical"
              key={formForLecture.key(`lectureDescription`)}
              {...formForLecture.getInputProps(`lectureDescription`)}
            />

            <Checkbox
              label="Make this lecture visible to unEnrolled users"
              checked={lecture?.preview}
              key={formForLecture.key(`preview`)}
              {...formForLecture.getInputProps(`preview`)}
            />

            <FileInput
              withAsterisk
              label="Select Lecture Video"
              placeholder="select video"
              accept="video/mp4,video/mkv,video/webm"
              clearable
              leftSection={<IconBrandYoutube />}
              {...formForLecture.getInputProps(`videoUrl`)}
              key={formForLecture.key(`videoUrl`)}
            />
            <Button
              type="submit"
              variant="light"
              color="yellow"
              fullWidth
              mt={"md"}
            >
              Update Lecture
            </Button>
          </form>
        </>
      )}
    </Modal>
  );
};

export default UpdateCourseModal;
