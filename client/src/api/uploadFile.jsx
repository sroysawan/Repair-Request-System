import axios from "axios";

const url = import.meta.env.VITE_WEBSITE_URL;

export const uploadImage = async (token, form) => {
  return await axios.post(
    `${url}/images`,
    { image: form },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const removeFiles = async (token, publicId, userId) => {
  return await axios.post(
    `${url}/removeimages`,
    { public_id: publicId, userId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};