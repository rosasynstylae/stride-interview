import { useCallback, useEffect, useRef } from "react";
import { useOpen } from "./useOpen";

/**
 * View ↔ edit toggle for details that are edited in place (the edit form
 * replaces the read-only view). Swapping unmounts the trigger, then the form, so
 * focus would fall back to <body>; this sends it back to the trigger when the
 * form closes. (Moving focus *into* the form is up to the form, e.g. setFocus.)
 *
 * Attach `triggerRef` to the "Edit" button, call `onOpen` from it, and pass
 * `closeForm` as the form's cancel/success handler.
 */
function useInlineEditToggle<T extends HTMLElement = HTMLButtonElement>() {
  const { open, onOpen, onClose } = useOpen();
  const triggerRef = useRef<T>(null);
  const returnFocus = useRef(false);

  const closeForm = useCallback(() => {
    returnFocus.current = true;
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open && returnFocus.current) {
      returnFocus.current = false;
      triggerRef.current?.focus();
    }
  }, [open]);

  return { open, onOpen, closeForm, triggerRef };
}

export { useInlineEditToggle };
