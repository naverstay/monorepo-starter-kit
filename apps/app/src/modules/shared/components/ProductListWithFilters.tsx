import {useState} from "react";
import {Input} from "@/shadcn/ui/input";
import {Button} from "@/shadcn/ui/button";
import {Spinner} from "@/shadcn/ui/spinner";
import {UserList} from "./UserList";
import {useProducts} from "@modules/shared/queries/useProducts";

export const ProductListWithFilters = () => {
  const [filters, setFilters] = useState({
    name: "",
    g_index_min: 0,
    g_load_min: 0,
    g_index_max: 0,
    g_load_max: 0,
  });

  // const { data, refetch } = useProductsPage({
  //   filters: {
  //     name: filters.name || undefined,
  //     email: filters.email || undefined,
  //     role: filters.role || undefined,
  //   },
  //   page: 1,
  //   pageSize: 20,
  // });

  const {data, isLoading, refetch} = useProducts({
    filters: {
      name_ru: filters.name || undefined,
      name_en: filters.name || undefined,
      name_de: filters.name || undefined,
      g_index_min: filters.g_index_min || undefined,
      g_index_max: filters.g_index_max || undefined,
      g_load_min: filters.g_load_min || undefined,
      g_load_max: filters.g_load_max || undefined,
    },
    page: 1,
    pageSize: 10,
    orderBy: {field: "createdAt", direction: "desc"},
  });

  const handleChange = (field: keyof typeof filters, value: string | number) => {
    setFilters((prev) => ({...prev, [field]: value}));
  };

  const handleSearch = () => {
    refetch();
  };

  return (
    <>
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner className="h-6 w-6 text-primary"/>
        </div>
      ) : null}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input placeholder="Поиск по имени" value={filters.name}
                 onChange={(e) => handleChange("name", e.target.value)}/>
          <Input placeholder="Поиск по ГИ" value={filters.g_index_min}
                 onChange={(e) => handleChange("g_index_min", parseFloat(e.target.value))}/>
          <Input placeholder="Поиск по ГИ" value={filters.g_index_max}
                 onChange={(e) => handleChange("g_index_max", parseFloat(e.target.value))}/>
          <Input placeholder="Поиск по ГН" value={filters.g_load_min}
                 onChange={(e) => handleChange("g_load_min", parseFloat(e.target.value))}/>
          <Input placeholder="Поиск по ГН" value={filters.g_load_max}
                 onChange={(e) => handleChange("g_load_max", parseFloat(e.target.value))}/>
        </div>

        <Button onClick={handleSearch} className="w-full md:w-auto">
          🔍 Найти пользователей
        </Button>

        {data?.userList && <UserList userList={data.userList}/>}
      </div>
    </>
  );
};
