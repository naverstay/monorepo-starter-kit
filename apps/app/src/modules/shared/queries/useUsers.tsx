import { useQuery } from "@tanstack/react-query";
import { useAxios } from "@/shared/providers/Axios";

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
