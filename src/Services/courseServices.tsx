import axios from "axios";
import type { courseType } from "../Types/courseType";
import { TOKEN } from "../Constants";
import uploadVideoService from "./uploadVideoService";

const BASE_URL = "http://localhost:8080/courses";
const token = sessionStorage.getItem(TOKEN);

// create course (Instructor)
const createCourseService = async (values: courseType) => {
  console.log("values that will be used for api service", values);

  // uploading the videos through upload video service
  const newLectures = await Promise.all(
    values.lectures.map(async (lecture) => {
      const videoUrl = await uploadVideoService(lecture.videoUrl);
      return { ...lecture, videoUrl };
    })
  );
  console.log("new lecture data", newLectures);

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

  // printing the form data
  // for (const pair of formData.entries()) {
  //   console.log(pair[0], pair[1]);
  // }
  console.log(
    "form data that will be send to api for create course",
    Object.fromEntries(formData.entries())
  );

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
