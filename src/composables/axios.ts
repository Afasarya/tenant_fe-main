import axiosInstance from "@/plugins/axios";

export default function useAxios() {
  const get = async (url: string, config = {}) => {
    try {
      const response = await axiosInstance.get(url, config);
      return response.data;
    } catch (err) {
      return err;
    }
  };

  const post = async (url: string, payload = {}, config = {}) => {
    try {
      const response = await axiosInstance.post(url, payload, config);
      return response.data;
    } catch (err) {
      return err;
    }
  };

  const put = async (url: string, payload = {}, config = {}) => {
    try {
      const response = await axiosInstance.put(url, payload, config);
      return response.data;
    } catch (err) {
      return err;
    }
  };

  const remove = async (url: string, config = {}) => {
    try {
      const response = await axiosInstance.delete(url, config);
      return response.data;
    } catch (err) {
      return err;
    }
  };

  return {
    get,
    post,
    put,
    remove,
  };
}
