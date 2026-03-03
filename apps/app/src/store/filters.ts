import {create} from "zustand";

export const useFilterStore = create((set) => ({
  filters: {
    name: "",
    g_index_min: 0,
    g_index_max: 120,
    g_load_min: 0,
    g_load_max: 100,
  },

  setFilter: (key, value) =>
    set((state) => ({
      filters: {...state.filters, [key]: value}
    })),

  setFilters: (newFilters) =>
    set(() => ({filters: newFilters}))
}));
