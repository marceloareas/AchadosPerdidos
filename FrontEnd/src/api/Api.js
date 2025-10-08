import axios from "axios";

class CreateAxios {
  static instance = null;

  static getInstance() {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: "http://localhost:8080",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    return this.instance;
  }
}

const Api = CreateAxios.getInstance();
export default Api;
