import axios from "axios";

const api = axios.create({
  baseURL: "https://projeto-finacheck-main-back.onrender.com"
});

export default api;
