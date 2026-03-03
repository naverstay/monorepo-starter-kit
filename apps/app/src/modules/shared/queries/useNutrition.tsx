import {useQuery} from "@tanstack/react-query";
import {useAxios} from "@modules/shared/providers/Axios.tsx";
import type {Product} from "@shared-types/db";
import type {GI_GL} from "@shared-types/global";
import {buildQueryString} from "@/lib/utils.ts";

type UseNutritionOptions = {
  filters?: Partial<Pick<Product, "name_de" | "name_ru" | "name_en"> & GI_GL & { ids?: string[]; text?: string }>;
  enabled?: boolean;
};

export const useNutrition = ({
                               filters = {},
                               enabled = true,
                             }: UseNutritionOptions) => {
  const axios = useAxios();

  const queryString = buildQueryString(filters);

  return useQuery({
    queryKey: ["nutrition", {filters}],
    queryFn: async () => {
      const {data} = await axios.get(`/api/nutrition?${queryString}`);
      return data;
    },
    // staleTime: 1000 * 60 * 5,
    enabled,
  });
};
