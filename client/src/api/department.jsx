import axios from 'axios'


const url = import.meta.env.VITE_WEBSITE_URL

export const listDepartment = async(token,query="", page = 1, limit = 5) => {
  return await axios.get(`${url}/department`,{
    params: { query: query, page, limit},
    headers: {
        Authorization: `Bearer ${token}`
    }
  })
}

export const createDepartment = async (token, form) => {
  return await axios.post(`${url}/department`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteDepartment = async (token, id) => {
  return await axios.delete(`${url}/department/`+id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const getDepartmentById =async(token,id)=>{
  return await axios.get(`${url}/department/`+id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const updateDepartment= async (token,id, form) => {
  return await axios.patch(`${url}/department/`+id, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


