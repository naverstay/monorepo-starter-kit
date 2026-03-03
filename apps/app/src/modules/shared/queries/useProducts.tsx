import {useQuery} from "@tanstack/react-query";
import {useAxios} from "@modules/shared/providers/Axios.tsx";
import type {Product} from "@shared-types/db";
import type {GI_GL} from "@shared-types/global";

type UseProductsOptions = {
  filters?: Partial<Pick<Product, "name_de" | "name_ru" | "name_en"> & GI_GL>;
  page?: number;
  pageSize?: number;
  orderBy?: {
    field: keyof Product;
    direction?: "asc" | "desc";
  };
  enabled?: boolean;
};

export const useProducts = ({
                              filters = {},
                              page = 1,
                              pageSize = 20,
                              enabled = true,
                              orderBy = {field: "createdAt", direction: "desc"},
                            }: UseProductsOptions) => {
  const axios = useAxios();

  const queryParams = new URLSearchParams();

  queryParams.set("page", page.toString());
  queryParams.set("pageSize", pageSize.toString());

  if (orderBy?.field) queryParams.set("orderByField", String(orderBy.field));
  if (orderBy?.direction) queryParams.set("orderByDirection", String(orderBy.direction));

  Object.entries(filters).forEach(([key, value]) => {
    const trimValue = String(value).trim();
    if (value !== undefined && trimValue) queryParams.set(key, trimValue);
  });

  const queryString = queryParams.toString();

  // console.log('filters', filters, queryString);

  return useQuery({
    queryKey: ["products", {filters, page, pageSize, orderBy}],
    queryFn: async () => {
      const {data} = await axios.get(`/api/products?${queryString}`);
      return data;
    },
    // staleTime: 1000 * 60 * 5,
    enabled,
  });
};
