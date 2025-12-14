import { useQuery } from "@tanstack/react-query";
import { useAxios } from "@modules/shared/providers/Axios.tsx";
import type { User } from "@shared-types/db";

type UseUsersOptions = {
  filters?: Partial<Pick<User, "email" | "name" | "role" | "banned" | "isAnonymous">>;
  page?: number;
  pageSize?: number;
  orderBy?: {
    field: keyof User;
    direction?: "asc" | "desc";
  };
};

export const useUsers = ({ filters = {}, page = 1, pageSize = 20, orderBy = { field: "createdAt", direction: "desc" } }: UseUsersOptions) => {
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

  return useQuery({
    queryKey: ["users", { filters, page, pageSize, orderBy }],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users?${queryString}`);
      return data;
    },
    // staleTime: 1000 * 60 * 5,
  });
};
