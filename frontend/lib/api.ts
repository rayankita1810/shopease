import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
  baseURL: "https://shopease-w340.onrender.com/api",
});

// Attach token
API.interceptors.request.use((req) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  }

  return req;
});

// Global response handler
API.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    // Ignore login/register 401 errors
    const isAuthRoute =
      url?.includes("/auth/login") ||
      url?.includes("/auth/register");

    // Token expired
    if (status === 401 && !isAuthRoute) {
      // clear old session
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // avoid multiple toasts
      if (!window.location.pathname.includes("/login")) {
        toast.error("Your session expired. Please login again.");

        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      }

      // STOP further axios errors
      return Promise.resolve({
        data: null,
      });
    }

    return Promise.reject(error);
  }
);

export default API;