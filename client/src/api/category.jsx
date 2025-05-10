import axios from 'axios'


const url = import.meta.env.VITE_WEBSITE_URL

export const listCategory = async(token,query="", page = 1, limit = 5) => {
  return await axios.get(`${url}/category`,{
    params: { query: query, page, limit},
    headers: {
        Authorization: `Bearer ${token}`
    }
  })
}

export const createCategory = async (token, form) => {
  return await axios.post(`${url}/category`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteCategory = async (token, id) => {
  return await axios.delete(`${url}/category/`+id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

//edit show data category
export const getCategoryById =async(token,id)=>{
  return await axios.get(`${url}/category/`+id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const updateCategory = async (token,id, form) => {
  return await axios.patch(`${url}/category/`+id, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


