import { useEffect } from "react";
import { useAuth } from "../contexts/AuthenticaContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const useApi = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          if (error.response.status === 401 || error.response.status === 404) {
            logout(); 
            navigate("/iniciarsesion");
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [logout, navigate]);

  return api;
};
