"use client";
import { useEffect, useRef } from "react";

/** Native modality provides background inertness, focus containment, and Escape. */
export default function Modal({
  label,
  onClose,
  children,
}: {
  label: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const previous = document.activeElement as HTMLElement | null;
    dialog.showModal();
    // showModal focuses the dialog itself/first element; honor an explicit autofocus child
    const autofocusEl = dialog.querySelector<HTMLElement>("[autofocus]");
    autofocusEl?.focus({ preventScroll: true });
    window.dispatchEvent(new Event("portfolio-modal"));
    return () => {
      dialog.close();
      if (previous?.isConnected) previous.focus({ preventScroll: true });
      window.dispatchEvent(new Event("portfolio-modal"));
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="app-dialog"
      aria-label={label}
      data-lenis-prevent
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {children}
    </dialog>
  );
}
