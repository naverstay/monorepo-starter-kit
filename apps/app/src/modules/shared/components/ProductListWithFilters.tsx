import {useEffect, useState} from "react";
import {Input} from "@/shadcn/ui/input";
import {Button} from "@/shadcn/ui/button";
import {Spinner} from "@/shadcn/ui/spinner";
import {Slider} from "@/shadcn/ui/slider"
import {ProductList} from "./ProductList";
import {useProducts} from "@modules/shared/queries/useProducts";
import {cn} from "@/lib/utils.ts";

const G_INDEX_MAX = 120;
const G_LOAD_MAX = 100;

export const ProductListWithFilters = () => {
  const [filters, setFilters] = useState({
    name: "",
    g_index_min: 0,
    g_load_min: 0,
    g_index_max: G_INDEX_MAX,
    g_load_max: G_LOAD_MAX,
  });

  const [activeFilters, setActiveFilters] = useState(filters);

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
    enabled: false,
    filters: {
      name_ru: activeFilters.name || undefined,
      name_en: activeFilters.name || undefined,
      name_de: activeFilters.name || undefined,
      g_index_min: activeFilters.g_index_min,
      g_index_max: activeFilters.g_index_max,
      g_load_min: activeFilters.g_load_min,
      g_load_max: activeFilters.g_load_max,
    },
    page: 1,
    pageSize: 30,
    orderBy: {field: "createdAt", direction: "desc"},
  });

  const handleChange = (field: keyof typeof filters, value: string | number) => {
    setFilters((prev) => ({...prev, [field]: value}));
  };

  const handleSearch = () => {
    setActiveFilters(filters);
    refetch();
  };

  useEffect(() => {
    console.log('productList', data?.productList);
  }, [data]);

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner className="h-6 w-6 text-primary"/>
        </div>
      ) : null}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative w-full flex pl-8">
            <div className="absolute top-[50%] translate-y-[-50%] left-0">
              ГИ
            </div>
            <div className="relative m-auto flex-1">
              <Slider
                value={[filters.g_index_min, filters.g_index_max]}
                onValueChange={(range: [number, number]) => {
                  console.log('onValueChange', range);
                  setFilters({...filters, g_index_min: range[0], g_index_max: range[1]});
                }}
                min={0}
                max={G_INDEX_MAX}
                step={1}
              />

              <div className="absolute top-4 left-[50%] translate-x-[-50%] flex">
                <div className={cn(
                  "bg-foreground text-background z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-2 py-1 text-xs text-balance"
                )}>{filters.g_index_min} - {filters.g_index_max}</div>
              </div>
            </div>
          </div>

          <div className="relative w-full flex pl-8">
            <div className="absolute top-[50%] translate-y-[-50%] left-0">
              ГН
            </div>
            <div className="relative m-auto flex-1">
              <Slider
                value={[filters.g_load_min, filters.g_load_max]}
                onValueChange={(range: [number, number]) => {
                  console.log('onValueChange', range);
                  setFilters({...filters, g_load_min: range[0], g_load_max: range[1]});
                }}
                min={0}
                max={G_LOAD_MAX}
                step={1}
              />
              <div className="absolute top-4 left-[50%] translate-x-[-50%] flex">
                <div className={cn(
                  "bg-foreground text-background z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-2 py-1 text-xs text-balance"
                )}>{filters.g_load_min} - {filters.g_load_max}</div>
              </div>
            </div>
          </div>

          <div className="relative pr-12">
            <Input id="name" placeholder="Поиск по имени" value={filters.name}
                   onChange={(e) => handleChange("name", e.target.value)}/>
            <Button onClick={handleSearch} className="absolute w-10 top-0 right-0">🔍</Button>
          </div>
        </div>

        {data?.productList && <ProductList productList={data.productList}/>}
      </div>
    </>
  );
};
