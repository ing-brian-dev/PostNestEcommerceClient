import { create } from "zustand";

interface Store {
    total: number;
}

export const useStore = create<Store>(() => ({
    total: 0
}));