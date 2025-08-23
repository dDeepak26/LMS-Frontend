import axios from "axios";
import { TOKEN } from "../Constants";
import { toSnakeCaseOnlyLetters } from "../utils/camelCaseText";

const token = sessionStorage.getItem(TOKEN);

const uploadVideoService = async (file: File, courseName: string) => {
  // calling the get video signature api with the course name (snake case) so that inside cloudinary the video will be store in this format LMS/videos/instructorEmail/courseName
  const { data } = await axios.get(
    `http://localhost:8080/cloudinary/get-video-signature/${toSnakeCaseOnlyLetters(
      courseName
    )}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", data.apiKey);
  formData.append("timestamp", data.timestamp);
  formData.append("signature", data.signature);
  formData.append("folder", data.folder);

  console.log(
    "form data for the cloudinary upload config",
    Object.fromEntries(formData.entries())
  );

  // uploading to the cloudinary
  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${data.cloudName}/video/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.secure_url;
};

export default uploadVideoService;
