import axios from "axios";

const url = import.meta.env.VITE_WEBSITE_URL;

export const listEquipment = async (token,query="", page = 1, limit = 5) => {
  return await axios.get(`${url}/equipment`, {
    params: { query: query, page, limit},
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createEquipment = async (token, form) => {
  return await axios.post(`${url}/equipment`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const listStatusEquipment = async (token) => {
  return await axios.get(
    `${url}/status-equipment
`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getEquipmentByCategory =async(token,id)=>{
  return await axios.get(`${url}/equipment/category/`+id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const getEquipmentById =async(token,id)=>{
  return await axios.get(`${url}/equipment/`+id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const updateEquipment =async(token,id,form)=>{
  return await axios.put(`${url}/equipment/`+id,form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const getEquipmentHistory =async(token,id)=>{
  return await axios.get(`${url}/equipment/history/`+id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const deleteEquipment = async (token, id) => {
  return await axios.delete(`${url}/equipment/`+id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}




