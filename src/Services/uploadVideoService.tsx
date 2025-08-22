import axios from "axios";
import { TOKEN } from "../Constants";

const token = sessionStorage.getItem(TOKEN);

const uploadVideoService = async (file: File) => {
  console.log("file data that is send to uploadVideoService", file);

  const { data } = await axios.get(
    "http://localhost:8080/cloudinary/get-video-signature",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("signature", data);

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

  console.log("res of the uploading the video api", res.data);

  return res.data.secure_url;
};

export default uploadVideoService;
