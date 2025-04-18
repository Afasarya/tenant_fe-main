import axios from "axios";

// Fetch token and tenant from localStorage
const token = localStorage.getItem("token_user") ?? "";
const tenant = JSON.parse((localStorage.getItem("tenant") as string) || "{}");

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: `http://178.128.109.250/${tenant?.id ?? ""}`,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Access-Control-Allow-Origin": "*",
    Authorization: token ? `Bearer ${token}` : "",
  },
  timeout: 5000, // Set request timeout
});

// Request interceptor (optional, for example: modify headers dynamically)
axiosInstance.interceptors.request.use(
  (config) => {
    // You can dynamically update headers or other settings here
    return config;
  },
  (error) => {
    // Handle request errors before they are sent
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Return response directly in case of success
    return response;
  },
  (error) => {
    // Format and throw the error for use in try-catch
    const errorData = {
      message: error.response?.data?.message,
      status: error.response?.status,
      data: error.response?.data,
      success: false,
    };

    console.error("Response Error:", errorData); // Log structured error data
    return Promise.reject(errorData); // Reject promise with formatted error
  }
);

export default axiosInstance;
