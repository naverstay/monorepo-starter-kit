import { useQuery } from "@tanstack/react-query";
// import { getAllUsers } from "@db/lib/users";
import type { User } from "@shared-types/db";
import { getAllUsers } from "../../../../../../packages/db/src/lib/users.ts";

type UseUsersPageOptions = {
  filters?: Partial<Pick<User, "email" | "name" | "role" | "banned" | "isAnonymous">>;
  page?: number;
  pageSize?: number;
  orderBy?: {
    field: keyof User;
    direction?: "asc" | "desc";
  };
};

export const useUsersPage = (options: UseUsersPageOptions) => {
  const { filters = {}, page = 1, pageSize = 20, orderBy = { field: "createdAt", direction: "desc" } } = options;

  return useQuery({
    queryKey: ["users", { filters, page, pageSize, orderBy }],
    queryFn: () =>
      getAllUsers({
        filters,
        page,
        pageSize,
        orderBy,
      }),
    placeholderData: () => ({
      total: 0,
      page,
      pageSize,
      userList: [],
    }),
    staleTime: 1000 * 60 * 5,
  });
};
