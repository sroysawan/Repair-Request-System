import axios from "axios";

const url = import.meta.env.VITE_WEBSITE_URL;

export const login = async (form) => {
  return await axios.post(`${url}/login`, form);
};

//register By admin and Supervisor
export const registerUser = async (token, form) => {
  return await axios.post(`${url}/register`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const currentUser = async (token) => {
  return await axios.get(`${url}/current-user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
