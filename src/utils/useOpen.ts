import { useCallback, useState } from "react";

interface TOpenState {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  setOpen: (o: boolean) => void;
}

const useOpen = (defaultOpen: boolean = false): TOpenState => {
  const [open, setOpen] = useState(defaultOpen);

  const onOpen = useCallback(() => setOpen(true), [setOpen]);
  const onClose = useCallback(() => setOpen(false), [setOpen]);
  const onToggle = useCallback(() => setOpen((prev) => !prev), [setOpen]);

  return {
    open,
    onOpen,
    onClose,
    onToggle,
    setOpen,
  };
};

export type { TOpenState };
export { useOpen };
