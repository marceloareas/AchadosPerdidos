import axios from "axios";

class CreateAxios {
  static instance = null;

  static getInstance() {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: "http://localhost:8080",
        // headers: {
        //   "Content-Type": "application/json",
        // },
      });
    }
    return this.instance;
  }
}

const Api = CreateAxios.getInstance();

Api.interceptors.request.use((config) => {
  // 🔥 SE FOR FormData, NÃO SETA Content-Type
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});
export default Api;
