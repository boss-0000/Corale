import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import { Wordmark } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Accedi — Corale",
};

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Editorial cover — the brand statement, not decoration */}
      <aside className="relative hidden flex-col justify-between bg-espresso-900 px-14 py-10 lg:flex">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2.5 text-[0.625rem] font-medium uppercase tracking-[0.22em] text-espresso-ink-dim">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brass-400" />
            Sistema attivo
            <span aria-hidden className="text-espresso-700">·</span>
            Milano
          </p>
          <p className="text-[0.625rem] font-medium uppercase tracking-[0.22em] text-espresso-ink-dim">
            MMXXVI
          </p>
        </div>

        <div className="max-w-xl">
          <p className="mb-7 text-[0.625rem] font-semibold uppercase tracking-[0.28em] text-brass-400">
            Piattaforma di gestione
          </p>
          <Wordmark tone="ivory" size="xl" />
          <p className="mt-8 max-w-md font-display text-lg italic leading-[1.5] text-espresso-ink-dim">
            Un sistema corale per gestire, valutare e valorizzare ogni persona del
            vostro team.
          </p>
          <span aria-hidden className="mt-8 block h-px w-14 bg-brass-500" />
        </div>

        <div className="flex items-end justify-between">
          <p className="font-display text-sm italic text-espresso-ink-dim">
            Numero <span className="text-[1.5rem] not-italic text-brass-400">01</span>
          </p>
          <p className="text-[0.625rem] uppercase tracking-[0.18em] text-espresso-ink-dim">
            © Corale · Tutti i diritti riservati
          </p>
        </div>
      </aside>

      {/* Form panel */}
      <main className="relative flex flex-col justify-between bg-ivory-200 px-6 py-10 sm:px-14">
        <div className="flex justify-end">
          <p className="text-sm text-ink-400">
            Non hai un account?{" "}
            <a
              href="#"
              className="text-ink-900 underline decoration-brass-500 underline-offset-4 transition-colors hover:text-brass-600"
            >
              Richiedi accesso
            </a>
          </p>
        </div>

        <div className="mx-auto w-full max-w-md py-10">
          <div className="mb-10 lg:hidden">
            <Wordmark size="lg" subtitle="HR Suite" />
          </div>

          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.28em] text-brass-600">
            Accesso riservato
          </p>

          {/* Kept from the approved concept. Note for production: Italian
              greetings inflect for gender, so this string must come from the
              person's own profile rather than be hardcoded — on a login screen,
              before the session exists, the neutral "Accedi al tuo spazio" is
              the safe form. Flagged for the client to decide. */}
          <h1 className="mt-5 font-display text-[2.5rem] leading-[1.12] text-ink-900">
            Bentornata,
            <br />
            <em className="text-bord-500">accedi al tuo spazio.</em>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-500">
            Inserisci le tue credenziali per accedere alla dashboard.
          </p>

          <LoginForm />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-[0.625rem] uppercase tracking-[0.18em] text-ink-400">
          <p>
            V. 2.4 <span className="mx-1.5 text-ivory-500">·</span>
            <span className="text-brass-600">Sicurezza AES-256</span>
          </p>
          <p>Assistenza · Privacy · Termini</p>
        </div>
      </main>
    </div>
  );
}
