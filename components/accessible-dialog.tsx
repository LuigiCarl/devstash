"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { X } from "lucide-react";

export function AccessibleDialog({ title, labelledBy, children, onClose }: { title: string; labelledBy: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !ref.current) return;
      const focusable = ref.current.querySelectorAll<HTMLElement>("button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[href]");
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("keydown", onKeyDown); previous?.focus(); };
  }, [onClose]);
  return <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/60 p-4" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={labelledBy} className="panel max-h-[90vh] w-full max-w-lg overflow-auto rounded-3xl p-6">
      <div className="flex items-center justify-between"><h2 id={labelledBy} className="text-xl font-bold">{title}</h2><button type="button" onClick={onClose} aria-label="Close dialog" className="muted rounded-lg p-1 hover:bg-[var(--bg)]"><X size={18} /></button></div>
      {children}
    </div>
  </div>;
}
