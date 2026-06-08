import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json"
  }
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common.Authorization;
  }
};

export const signup = async (payload) => {
  const response = await API.post("/auth/register", payload);
  return response.data;
};

export const login = async (payload) => {
  const response = await API.post("/auth/login", payload);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await API.get("/auth/me");
  return response.data;
};

export const getUsers = async () => {
  const response = await API.get("/auth/users");
  return response.data;
};

export const getOnlineUsers = async () => {
  const response = await API.get("/auth/online");
  return response.data;
};

export const fetchConversation = async (userA, userB) => {
  const response = await API.get("/messages/conversation/private", {
    params: { userA, userB }
  });
  return response.data;
};

export const sendMessage = async (payload) => {
  const response = await API.post("/messages/send", payload);
  return response.data;
};

export const uploadFile = async (formData, token) => {
  const upload = axios.create({
    baseURL: "http://localhost:8080/api/files",
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      "Content-Type": "multipart/form-data"
    }
  });
  const response = await upload.post("/upload", formData);
  return response.data;
};

export default API;