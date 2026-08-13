"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Prototype authentication.
 *
 * Any credentials pass. In production this posts to the NestJS auth module and
 * the session's role drives both the rail and the row-level policy on the
 * database side — the UI never decides what a person may see.
 *
 * Fields are underlined rather than boxed, per the concept: on an ivory ground
 * a hairline reads as a writing line, a filled box reads as a form.
 */
export function LoginForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fieldClass =
    "w-full border-0 border-b border-ivory-500 bg-transparent px-0 py-2.5 text-[0.9375rem] text-ink-900 transition-colors placeholder:text-ink-300 focus:border-brass-500 focus:outline-none focus:ring-0";

  return (
    <form
      className="mt-10"
      onSubmit={(e) => {
        e.preventDefault();
        setPending(true);
        router.push("/dashboard");
      }}
    >
      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-ink-400"
        >
          Indirizzo email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue="giulia.ferrari@corale.it"
          className={fieldClass}
        />
      </div>

      <div className="mt-7">
        <div className="mb-1 flex items-baseline justify-between">
          <label
            htmlFor="password"
            className="block text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-ink-400"
          >
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-xs text-ink-400 transition-colors hover:text-brass-600"
          >
            {showPassword ? "Nascondi" : "Mostra"}
          </button>
        </div>
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          required
          defaultValue="prototipo2026"
          className={fieldClass}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-500">
          <input
            type="checkbox"
            defaultChecked
            className="h-3.5 w-3.5 rounded-none border-ivory-500 accent-[var(--brass-500)]"
          />
          Ricordami su questo dispositivo
        </label>
        <a
          href="#"
          className="font-display text-sm italic text-ink-500 underline decoration-ivory-500 underline-offset-4 transition-colors hover:text-brass-600"
        >
          Password dimenticata?
        </a>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="group mt-9 flex w-full items-center justify-between bg-espresso-900 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-espresso-ink transition-colors hover:bg-espresso-800 disabled:opacity-70"
      >
        {pending ? "Accesso in corso…" : "Entra nel sistema"}
        <span
          aria-hidden
          className="text-base transition-transform group-hover:translate-x-1"
        >
          →
        </span>
      </button>

      <div className="my-7 flex items-center gap-4">
        <span aria-hidden className="h-px flex-1 bg-ivory-400" />
        <span className="text-[0.625rem] uppercase tracking-[0.2em] text-ink-400">
          oppure
        </span>
        <span aria-hidden className="h-px flex-1 bg-ivory-400" />
      </div>

      <button
        type="button"
        onClick={() => router.push("/dashboard")}
        className="w-full border border-ivory-500 px-6 py-3.5 text-sm text-ink-700 transition-colors hover:border-brass-500 hover:text-ink-900"
      >
        Continua con SSO aziendale
      </button>

      <p className="mt-8 text-center text-xs leading-relaxed text-ink-400">
        Prototipo dimostrativo — i dati mostrati sono fittizi.
        <br />
        Qualsiasi credenziale è valida per entrare.
      </p>
    </form>
  );
}
