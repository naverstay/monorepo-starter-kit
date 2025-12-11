/* REACT */
import { useContext } from "react";

/* APP */
import { AxiosContext } from "../providers/Axios";

//fix bug, too many re-renders
export const useAxios = () => {
  const axios = useContext(AxiosContext);
  if (!axios) throw new Error("useAxios must be wrapper by AxiosProvider");

  return axios;
};
