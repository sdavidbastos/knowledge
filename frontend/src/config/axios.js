import axios from "axios";

const sucess = (response) => response;

const error = (error) => {
  if (401 === error.response.status) {
    window.location = "/";
  } else {
    return Promise.reject(error);
  }
};

axios.interceptors.response.use(sucess, error);
