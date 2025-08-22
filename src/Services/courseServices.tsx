import axios from "axios";
import type { courseType } from "../Types/courseType";
import { TOKEN } from "../Constants";

const BASE_URL = "http://localhost:8080/courses";
const token = sessionStorage.getItem(TOKEN);

// create course (Instructor)
const createCourseService = async (values: courseType) => {
  console.log("values data for service", values);

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

  // appending the meta data for the lecture with the lecture.video reference buz the file cannot into into object string
  const lectureMeta = values.lectures.map((lecture, index) => ({
    order: index + 1,
    title: lecture.title,
    lectureDescription: lecture.lectureDescription,
    preview: lecture.preview,
    videoUrl: null,
  }));

  formData.append("lectures", JSON.stringify(lectureMeta));

  // now uploading the video separately with the matched key
  values.lectures.forEach((lecture) => {
    formData.append(`videos`, lecture.videoUrl);
  });

  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

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
