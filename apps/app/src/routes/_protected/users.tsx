import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@modules/auth";

// import { useUsers } from "~/shared/queries/useUsers";
import { useUsers } from "../../../../../apps/app/src/modules/shared/queries/useUsers";

import type { User } from "@shared-types/db";

export const UsersPage = () => {
  const { data, isLoading, isError } = useUsers();

  if (isLoading) return <div>⏳ Загрузка...</div>;
  if (isError) return <div>❌ Ошибка загрузки</div>;

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

export const Route = createFileRoute("/_protected/users")({
  component: UsersRouteComponent,
});

function UsersRouteComponent() {
  const auth = useSession();

  if (!auth.data?.user) {
    return <div>⛔ Доступ запрещён. Войдите в систему.</div>;
  }

  return <UsersPage />;
}
