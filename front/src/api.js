import axios from "axios";

const api = axios.create({
  baseURL: "http://163.245.208.70",
});

export default api;