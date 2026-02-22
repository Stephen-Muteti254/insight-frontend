import { createContext, useContext } from "react";

interface DialogContextType {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}

export const DialogContext = createContext<DialogContextType | null>(null);

export function useDialogContext() {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error("useDialogContext must be used inside DialogContext.Provider");
  }
  return ctx;
}
