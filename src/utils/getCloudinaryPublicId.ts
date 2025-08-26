const getCloudinaryPublicId = (url: string) => {
  try {
    const cleanUrl = url.split("?")[0];

    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^\/]+$/;
    const match = cleanUrl.match(regex);

    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }

    return null;
  } catch (error) {
    console.error("Error extracting Cloudinary public ID:", error);
    return null;
  }
};

export default getCloudinaryPublicId;
