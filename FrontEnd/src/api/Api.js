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

      // Interceptador do Axios
      this.instance.interceptors.request.use((config) => {
        const token = localStorage.getItem("Bearer-token");
        
        if (token) {
          // Garante que o Spring Security receba a palavra "Bearer " antes do hash
          config.headers.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
        }
        
        return config;
      }, (error) => {
        return Promise.reject(error);
      });
    }
    return this.instance;
  }
}

const Api = CreateAxios.getInstance();

export const uploadImagemChat = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await Api.post("/chat/upload-imagem", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  return response.data; 
};

export default Api;