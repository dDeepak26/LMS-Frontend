import axios from "axios";
import type { courseType } from "../Types/courseType";
import { TOKEN } from "../Constants";
import uploadVideoService from "./uploadVideoService";
import getCloudinaryPublicId from "../utils/getCloudinaryPublicId";
import { useDispatch } from "react-redux";
import { setEnrolledCourses } from "../Slices/enrolledCoursesSlice";

const BASE_URL = "http://localhost:8080/courses";
const token = sessionStorage.getItem(TOKEN);

// create course (Instructor)
const createCourseService = async (values: courseType) => {
  try {
    // uploading the videos through upload video service and getting the uploaded url and appending it into the newLecture array object
    const newLectures = await Promise.all(
      values.lectures.map(async (lecture, index) => {
        const videoUrl = await uploadVideoService(
          lecture.videoUrl,
          values.name
        );
        return { ...lecture, order: index + 1, videoUrl };
      })
    );

    // converting values into form data
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("category", values.category);
    formData.append("level", values.level);
    formData.append("outcomes", values.outcomes);
    formData.append("skillsGained", JSON.stringify(values.skillsGained));
    formData.append("price", values.price.toString());
    formData.append("discount", values.discount.toString());
    formData.append("imageUrl", values.imageUrl);
    formData.append("lectures", JSON.stringify(newLectures));

    const res = await axios
      .post(`${BASE_URL}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data);

    return res;
  } catch (err) {
    console.error("Error in creating course", err);
  }
};

// Both student and instructor
const getAllCoursesService = async () => {
  try {
    const res = await axios
      .get(`${BASE_URL}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data);
    return res;
  } catch (err) {
    console.error("Error in getting all courses data", err);
  }
};

// get instructor created courses
const getInstructorCoursesService = async () => {
  try {
    const res = await axios
      .get(`${BASE_URL}/instructor`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data);

    return res;
  } catch (err) {
    console.error("error in getting instructor courses", err);
  }
};

// get courses details by courseId
const getCourseDetail = async (courseId: string) => {
  try {
    const res = await axios
      .get(`${BASE_URL}/detail/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data);

    return res;
  } catch (err) {
    console.error("error in getting course detail");
  }
};

// update image service
const updateCourseImageService = async (
  image: File | null,
  courseId: string,
  imageId: string
) => {
  try {
    // checking params
    if (!image || !courseId || !imageId) {
      console.log(
        "updateCourseImageService requires image , courseId, imageId"
      );
      return;
    }

    // creating form data
    const formData = new FormData();
    formData.append("imageUrl", image);
    formData.append("imageId", imageId);

    const imageUpdateRes = await axios
      .put(`${BASE_URL}/image/${courseId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data);

    return imageUpdateRes;
  } catch (err) {
    console.error("error in updating the course image", err);
  }
};

// update course data except image and lecture
const updateCourseDataService = async (courseId: string, values: any) => {
  try {
    const updateCourseDataRes = await axios
      .put(`${BASE_URL}/data/${courseId}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data);

    return updateCourseDataRes;
  } catch (err) {
    console.error("error in updating course data", err);
  }
};

// update course lecture only
const updateCourseLectureService = async (
  courseId: string,
  courseName: string,
  values: any,
  video?: File
) => {
  try {
    let newVideoUrl;
    // let lectureObj = values;
    if (video) {
      let previousVideoUrl = getCloudinaryPublicId(values.videoUrl);

      // deleting the previous video
      await axios.post(
        `${BASE_URL}/delete-video`,
        { publicId: previousVideoUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // uploading the new video
      newVideoUrl = await uploadVideoService(video, courseName);

      values = { ...values, videoUrl: newVideoUrl };
    }

    // updating the lecture
    const updateCourseLectureRes = await axios
      .put(`${BASE_URL}/lecture/${courseId}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data);

    return updateCourseLectureRes;
  } catch (err) {
    console.error("error in updating the course lecture", err);
  }
};

// get enrolled courses of user
const getEnrolledCoursesService = async () => {
  try {
    const enrolledCoursesRes = await axios
      .get(`${BASE_URL}/enrolled-courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data);

    return enrolledCoursesRes;
  } catch (err) {
    console.log("Error in getting the enrolled courses data");
  }
};

// enroll to course
// by course id
const enrollToCourseService = async (courseId: string) => {
  try {
    const enrollCourseRes = await axios
      .post(
        `${BASE_URL}/enroll/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        const dispatch = useDispatch();
        dispatch(setEnrolledCourses(res.data));
      });

    return enrollCourseRes;
  } catch (err) {
    console.error("Error in enroll to course", err);
  }
};

const getEnrollUsersService = async (courseId: string) => {
  try {
    const enrollUsersRes = await axios
      .get(`${BASE_URL}/enrolled-users/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data);

    return enrollUsersRes;
  } catch (err) {
    console.error("Error in getting the enrolled users data", err);
  }
};

const updateLectureProgressService = async (courseId: string, values: any) => {
  try {
    console.log("service called with data", values);

    const updateLectureProgressRes = await axios
      .put(`${BASE_URL}/lectureProgress/${courseId}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data);

    return updateLectureProgressRes;
  } catch (err) {
    console.error("error in updating the lecture progress", err);
  }
};

export {
  createCourseService,
  getAllCoursesService,
  getInstructorCoursesService,
  getCourseDetail,
  updateCourseImageService,
  updateCourseDataService,
  updateCourseLectureService,
  getEnrolledCoursesService,
  enrollToCourseService,
  getEnrollUsersService,
  updateLectureProgressService,
};
