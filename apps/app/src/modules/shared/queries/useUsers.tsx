import { useQuery } from "@tanstack/react-query";
import { useAxios } from "@modules/shared/providers/Axios.tsx";

export const useUsers = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axios.get("/api/users");
      return data;
    },
  });
};
