/* REACT */
import { createContext, useContext, useMemo } from "react";

/* LIBRARIES */
import axios from "axios";
import toast from "react-hot-toast";

/* APP */
import { config } from "config";

/* TYPES */
type AxiosInstance = ReturnType<typeof axios.create>;

/* CONTEXT */
export const AxiosContext = createContext<AxiosInstance | null>(null);

/* PROVIDER */
export const AxiosProvider = ({ children }: { children: React.ReactNode }) => {
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: config.url.api,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
      withCredentials: true,
    });

    instance.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error?.response || error?.message),
    );

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error?.response?.status || 0;
        if (status === 401) {
          console.warn("Unauthorized:", error?.response);
          toast.error("Session expired. Please log in again.");
        }
        return Promise.reject(error?.response || error?.message);
      },
    );

    return instance;
  }, []);

  return <AxiosContext.Provider value={axiosInstance}>{children}</AxiosContext.Provider>;
};

/* HOOK */
export const useAxios = (): AxiosInstance => {
  const context = useContext(AxiosContext);
  if (!context) {
    throw new Error("useAxios must be used within an AxiosProvider");
  }
  return context;
};
