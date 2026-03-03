/* LIBRARIES */
import { useQueryClient } from "@tanstack/react-query";

//HOOK
export const useKillAppData = () => {
  const queryClient = useQueryClient();

  const killData = () => {
    localStorage.clear();
    //remove all queries and mutations
    queryClient.clear();
  };

  return { killData };
};
