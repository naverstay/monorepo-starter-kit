import {create} from "zustand";

export const useCheckStore = create<{
  checked: Record<string, boolean>;
  toggle: (id: string) => void;
  getSelected: () => string[];
}>((set, get) => ({
  checked: {},
  toggle: (id) =>
    set((state) => ({
      checked: {...state.checked, [id]: !state.checked[id]}
    })),
  getSelected: () => {
    const checked = get().checked;
    return Object.keys(checked).filter(id => checked[id]);
  },
}));
