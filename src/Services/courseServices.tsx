import axios from "axios";
import type { courseType } from "../Types/courseType";
import { TOKEN } from "../Constants";
import uploadVideoService from "./uploadVideoService";

const BASE_URL = "http://localhost:8080/courses";
const token = sessionStorage.getItem(TOKEN);

// create course (Instructor)
const createCourseService = async (values: courseType) => {
  // uploading the videos through upload video service and getting the uploaded url and appending it into the newLecture array object
  const newLectures = await Promise.all(
    values.lectures.map(async (lecture, index) => {
      const videoUrl = await uploadVideoService(lecture.videoUrl, values.name);
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
    .then((res) => res.data)
    .catch((err) => err);

  return res;
};

export { createCourseService };
