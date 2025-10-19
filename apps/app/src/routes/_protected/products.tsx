import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@modules/auth";
import { useUsers } from "@modules/shared/queries/useUsers";

import type { User } from "@shared-types/db";
import { ProductListWithFilters } from "@modules/shared/components/ProductListWithFilters";

export const UsersPage = () => {
  const { data, isLoading } = useUsers({
    filters: { banned: false, role: "admin" },
    page: 2,
    pageSize: 10,
    orderBy: { field: "createdAt", direction: "desc" },
  });

  if (isLoading) return <div>⏳ Загрузка...</div>;

  console.log("data", data);

  const { userList } = data;

  return (
    <>
      <section>
        <h1>👥 Список пользователей</h1>

        <ul>
          {userList.map((user: User) => (
            <li key={user.id}>
              <strong>{user.name}</strong> — {user.email}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export const Route = createFileRoute("/_protected/products")({
  component: UsersRouteComponent,
});

function UsersRouteComponent() {
  const auth = useSession();

  if (!auth.data?.user) {
    return <div>⛔ Доступ запрещён. Войдите в систему.</div>;
  }

  return <ProductListWithFilters />;
  // return <UsersPage />;
}
