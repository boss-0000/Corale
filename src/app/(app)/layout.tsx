import { AppShell } from "@/components/AppShell";
import { getRepository } from "@/lib/data/repository";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const repo = getRepository();
  const [user, employees] = await Promise.all([
    repo.getCurrentUser(),
    repo.listEmployees(),
  ]);

  return (
    <AppShell user={user} personCount={employees.length}>
      {children}
    </AppShell>
  );
}
