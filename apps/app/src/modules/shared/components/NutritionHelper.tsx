import React, {useEffect, useMemo, useState} from "react";
import {Input} from "@/shadcn/ui/input";
import {Button} from "@/shadcn/ui/button";
import {Spinner} from "@/shadcn/ui/spinner";
import {Slider} from "@/shadcn/ui/slider";
import {ProductList} from "./ProductList";
import {useProducts} from "@modules/shared/queries/useProducts";
import {Search, X} from "lucide-react";
import {useDebounce} from "use-debounce";
import {cn} from "@/lib/utils";
import {useCheckStore} from "@/store/nutrition";
import {useFilterStore} from "@/store/filters.ts";
import {Checkbox} from "@/shadcn/ui/checkbox.tsx";
import type {Product} from "@shared-types/db";

const G_INDEX_MAX = 120;
const G_LOAD_MAX = 100;

export const NutritionHelper = () => {
  const filters = useFilterStore(s => s.filters);
  const setFilter = useFilterStore(s => s.setFilter);
  const setFilters = useFilterStore(s => s.setFilters);

  const pageSize = Infinity;

  const [searchTerm, setSearchTerm] = useState(filters.name);
  const [debouncedSearch] = useDebounce(searchTerm, 300);

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

  const {data, isLoading} = useProducts({
    enabled: true,
    // filters: {
    //   name_ru: activeFilters.name || undefined,
    //   name_en: activeFilters.name || undefined,
    //   name_de: activeFilters.name || undefined,
    //   g_index_min: activeFilters.g_index_min,
    //   g_index_max: activeFilters.g_index_max,
    //   g_load_min: activeFilters.g_load_min,
    //   g_load_max: activeFilters.g_load_max,
    // },
    // page,
    pageSize,
    orderBy: {field: "createdAt", direction: "desc"},
  });

  const productList = useMemo(() => (data?.productList ?? []), [data]);

  const productFiltered = useMemo(() => {
    const items = data?.productList ?? [];
    const search = debouncedSearch.toLowerCase();

    return items.filter(f => {
      const matchesIndex = f.g_index <= filters.g_index_max && f.g_index >= filters.g_index_min;
      const matchesLoad = f.g_load <= filters.g_load_max && f.g_load >= filters.g_load_min;

      if (!matchesIndex || !matchesLoad) return false;

      if (!search) return true;

      return [f.name_de, f.name_en, f.name_ru].some(name =>
        name?.toLowerCase().includes(search)
      );
    });
  }, [productList, filters.g_index_max, filters.g_index_min, filters.g_load_max, filters.g_load_min, debouncedSearch]);

  const checked = useCheckStore(state => state.checked);

  const selectedIds = useMemo(() => {
    return Object.keys(checked).filter(id => checked[id]);
  }, [checked]);

  const selectedProducts = useMemo(() => {
    return productList.filter((product: Product) => selectedIds.includes(String(product.id)));
  }, [productList, selectedIds]);

  const toggle = useCheckStore((s) => s.toggle);

  const handleSearch = () => {
    setActiveFilters(filters);
  };

  useEffect(() => {
    setFilter("name", debouncedSearch);
  }, [debouncedSearch]);

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

        <div className="sticky bg-background top-0 p-4 pb-8 mx-[-1rem] z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            <div className="relative w-full flex pl-8">
              <div className="absolute top-[50%] translate-y-[-50%] left-0">ГИ</div>
              <div className="relative m-auto flex-1">
                <Slider
                  value={[filters.g_index_min, filters.g_index_max]}
                  onValueChange={(range: [number, number]) => {
                    setFilters({...filters, g_index_min: range[0], g_index_max: range[1]});
                  }}
                  min={0}
                  max={G_INDEX_MAX}
                  step={1}
                />

                <div className="absolute top-2 left-[50%] translate-x-[-50%] flex">
                  <div
                    className={cn(
                      "bg-foreground text-background z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-2 py-1 text-xs text-balance",
                    )}
                  >
                    {filters.g_index_min} - {filters.g_index_max}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative w-full flex pl-8">
              <div className="absolute top-[50%] translate-y-[-50%] left-0">ГН</div>
              <div className="relative m-auto flex-1">
                <Slider
                  value={[filters.g_load_min, filters.g_load_max]}
                  onValueChange={(range: [number, number]) => {
                    setFilters({...filters, g_load_min: range[0], g_load_max: range[1]});
                  }}
                  min={0}
                  max={G_LOAD_MAX}
                  step={1}
                />
                <div className="absolute top-2 left-[50%] translate-x-[-50%] flex">
                  <div
                    className={cn(
                      "bg-foreground text-background z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-2 py-1 text-xs text-balance",
                    )}
                  >
                    {filters.g_load_min} - {filters.g_load_max}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative pr-12">
              <Input
                id="name"
                placeholder="Поиск по имени"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key.toLowerCase() === "enter") {
                    handleSearch();
                  }
                }}
              />
              <Button onClick={handleSearch} className="cursor-pointer absolute w-10 top-0 right-0">
                <Search className="size-4"/>
              </Button>
            </div>
          </div>
        </div>

        <div className="selected-products sticky top-[84px] pb-4 bg-background z-10">
          {selectedProducts.length > 0 ? <div className="flex flex-wrap gap-2">
            {(
              selectedProducts.map((p, pi) => (
                <div key={pi}
                     className="flex min-h-[30px] items-center gap-2 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm border border-primary/20">
                  <Checkbox checked={!!checked} onCheckedChange={() => toggle(p.id)}/>
                  <span>{p.name_ru || p.name_en || p.name_de}</span>
                  <span className="text-sm text-muted-foreground"><span>ГИ</span> <b>{p.g_index}</b></span>
                  <span className="text-sm text-muted-foreground"><span>ГН</span> <b>{p.g_load}</b></span>
                </div>
              ))
            )}
          </div> : (
            <span className="text-muted-foreground inline-block min-h-[30px] bg-primary/10 px-2 py-1 rounded-md text-sm border border-primary/20">Ничего не выбрано</span>
          )}
        </div>

        {productFiltered.length ? (
          <div className="flex-1">
            <ProductList short={true} productList={productFiltered}/>
          </div>
        ) : isLoading ? null : (
          <div className="text-center p-10 flex-1 flex items-center justify-center">
            -= <X/> <Search/> <X/> =-
          </div>
        )}
    </>
  );
};
