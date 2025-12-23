"use client";

import { useEffect, useRef } from "react";
import { Modal } from "./Modal";
import { Input } from "./Input";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Search">
      <div className="space-y-4">
        <Input
          ref={inputRef}
          placeholder="Search incidents, services, or anything..."
          icon={<span className="material-symbols-outlined">search</span>}
        />
        <div className="text-sm text-slate-400">
          <p className="mb-2">Quick actions:</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs">⌘K</kbd>
              <span>Open search</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs">Esc</kbd>
              <span>Close search</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

