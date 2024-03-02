import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  // timeout: 1000,
});

api.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = "Bareer jjjdjdjdjkkklkl";
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    // console.log(err);
    if (err.response) {
      err.message = `Server Error Status: ${err.response.status} Message: ${err.message}`;
    }
    return Promise.reject(err);
  }
);

export { api };
