"use client";

import { useEffect, useRef, useState } from "react";

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
  onSignIn: (name: string) => void;
  eyebrow?: string;
  title?: string;
  description?: string;
  submitLabel?: string;
}

export function SignInModal({
  open,
  onClose,
  onSignIn,
  eyebrow = "Daily Challenge",
  title = "Sign in to start reviewing",
  description = "No password needed. Just a name and email to track your progress locally.",
  submitLabel = "Start Today's Review",
}: SignInModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    localStorage.setItem("reviewforge-user", JSON.stringify({ name: name.trim(), email: email.trim() }));
    onSignIn(name.trim());
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md rounded-3xl border border-[var(--line-strong)] bg-[var(--surface)] p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-lg p-1.5 text-[var(--muted)] hover:text-[var(--ink)] focus-ring"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <p className="eyebrow">{eyebrow}</p>
        <h2 className="display-title mt-2 text-2xl md:text-3xl">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="sign-in-name" className="wire-label mb-2 block">
              Name
            </label>
            <input
              ref={inputRef}
              id="sign-in-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>
          <div>
            <label htmlFor="sign-in-email" className="wire-label mb-2 block">
              Email
            </label>
            <input
              id="sign-in-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>
          <button
            type="submit"
            disabled={!name.trim() || !email.trim()}
            className="btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
}
