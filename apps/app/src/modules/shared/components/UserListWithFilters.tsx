import { useState } from "react";
import { Input } from "@/shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { Button } from "@/shadcn/ui/button";
import { Spinner } from "@/shadcn/ui/spinner";
import { UserList } from "./UserList";
import { useUsers } from "@modules/shared/queries/useUsers";

export const UserListWithFilters = () => {
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    role: "",
  });

  // const { data, refetch } = useUsersPage({
  //   filters: {
  //     name: filters.name || undefined,
  //     email: filters.email || undefined,
  //     role: filters.role || undefined,
  //   },
  //   page: 1,
  //   pageSize: 20,
  // });

  const { data, isLoading, refetch } = useUsers({
    filters: {
      name: filters.name || undefined,
      email: filters.email || undefined,
      role: filters.role || undefined,
    },
    page: 1,
    pageSize: 10,
    orderBy: { field: "createdAt", direction: "desc" },
  });

  const handleChange = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    refetch();
  };

  return (
    <>
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner className="h-6 w-6 text-primary" />
        </div>
      ) : null}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input placeholder="Поиск по имени" value={filters.name} onChange={(e) => handleChange("name", e.target.value)} />
          <Input placeholder="Поиск по email" value={filters.email} onChange={(e) => handleChange("email", e.target.value)} />
          <Select onValueChange={(value) => handleChange("role", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Фильтр по роли" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Все роли</SelectItem>
              <SelectItem value="admin">Администратор</SelectItem>
              <SelectItem value="moderator">Модератор</SelectItem>
              <SelectItem value="user">Пользователь</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSearch} className="w-full md:w-auto">
          🔍 Найти пользователей
        </Button>

        {data?.userList && <UserList userList={data.userList} />}
      </div>
    </>
  );
};
