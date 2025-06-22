import axios from "axios";

const API = axios.create({
  baseURL: "https://taskx-backend.onrender.com/api",
});

export default API;
