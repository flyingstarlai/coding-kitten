import { create } from "zustand";

interface DialogStore {
  open: boolean;
  message: string;
  openDialog: (msg: string) => void;
  closeDialog: () => void;
}

export const useDialogStore = create<DialogStore>((set) => ({
  open: false,
  message: "",
  openDialog: (msg: string) => set({ open: true, message: msg }),
  closeDialog: () => set({ open: false, message: "" }),
}));
