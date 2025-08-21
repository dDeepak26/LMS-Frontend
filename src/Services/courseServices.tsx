import axios from "axios";
import type { courseType } from "../Types/courseType";
import { TOKEN } from "../Constants";

const BASE_URL = "http://localhost:8080/courses";
const token = sessionStorage.getItem(TOKEN);

// create course (Instructor)
const createCourseService = async (values: courseType) => {
  // converting values into form data
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("description", values.description);
  formData.append("category", values.category);
  formData.append("level", values.level);
  formData.append("outcomes", values.outcomes);
  formData.append("skillsGained", values.skillsGained);
  formData.append("price", values.price);
  formData.append("discount", values.discount);
  formData.append("imageUrl", values.imageUrl);

  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  const res = await axios
    .post(`${BASE_URL}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      err;
      console.log(err);
    });

  return res;
};

export { createCourseService };
