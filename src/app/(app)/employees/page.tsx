import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { EmployeeTable } from "./EmployeeTable";
import { getRepository } from "@/lib/data/repository";

export const metadata: Metadata = {
  title: "Dipendenti — Corale",
};

export default async function EmployeesPage() {
  const repo = getRepository();
  const [employees, departments] = await Promise.all([
    repo.listEmployees(),
    repo.listDepartments(),
  ]);

  return (
    <div className="mx-auto max-w-[1180px] px-6 py-8 lg:px-10 lg:py-10">
      <PageHeader
        eyebrow="Anagrafica"
        title="Dipendenti"
        lede="L’elenco completo delle persone in organico, con reparto, contratto e indicatori del periodo corrente."
        action={
          <button
            type="button"
            className="rounded-md bg-bord-500 px-4 py-2.5 text-sm font-medium text-ivory-50 transition-colors hover:bg-bord-450"
          >
            Nuovo dipendente
          </button>
        }
      />

      <div className="mt-8">
        <EmployeeTable employees={employees} departments={departments} />
      </div>
    </div>
  );
}
