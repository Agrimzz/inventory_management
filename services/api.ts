import axios from "axios";

// You can load this from process.env (with react-native-config) in real apps.
const API_BASE_URL = "http://192.168.101.6:8000/api/ims";

const api = axios.create({
  baseURL: API_BASE_URL,

  // timeout: 10_000,
});

export default api;
