import type {
  ActivityEntry,
  CompanyStats,
  CurrentUser,
  Department,
  Employee,
  Insight,
} from "@/lib/types";
import * as mock from "./mock";

/**
 * The data layer boundary.
 *
 * Every screen reads through this interface and nothing else. The prototype ships
 * `MockRepository`; production swaps in an `ApiRepository` that calls the NestJS
 * backend over the same signatures. No component changes.
 *
 * All methods are async on purpose — a synchronous mock that later becomes a
 * network call is the usual reason a "prototype to production" port turns into a
 * rewrite of every component.
 */
export interface CoraleRepository {
  getCurrentUser(): Promise<CurrentUser>;
  getCompanyStats(): Promise<CompanyStats>;
  listDepartments(): Promise<Department[]>;
  getDepartment(id: string): Promise<Department | null>;
  listEmployees(query?: EmployeeQuery): Promise<Employee[]>;
  getEmployee(id: string): Promise<Employee | null>;
  listCompanyInsights(): Promise<Insight[]>;
  listEmployeeInsights(employeeId: string): Promise<Insight[]>;
  listActivity(limit?: number): Promise<ActivityEntry[]>;
}

export interface EmployeeQuery {
  /** Free text over name, position and email. */
  search?: string;
  departmentId?: string;
  status?: Employee["status"];
}

class MockRepository implements CoraleRepository {
  async getCurrentUser() {
    return mock.currentUser;
  }

  async getCompanyStats() {
    return mock.companyStats;
  }

  async listDepartments() {
    return mock.departments;
  }

  async getDepartment(id: string) {
    return mock.departments.find((d) => d.id === id) ?? null;
  }

  async listEmployees(query: EmployeeQuery = {}) {
    const term = query.search?.trim().toLowerCase();
    return mock.employees.filter((e) => {
      if (query.departmentId && e.departmentId !== query.departmentId) return false;
      if (query.status && e.status !== query.status) return false;
      if (term) {
        const haystack =
          `${e.firstName} ${e.lastName} ${e.position} ${e.email}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }

  async getEmployee(id: string) {
    return mock.employees.find((e) => e.id === id) ?? null;
  }

  async listCompanyInsights() {
    return mock.insights;
  }

  async listEmployeeInsights(employeeId: string) {
    return mock.employeeInsights[employeeId] ?? [];
  }

  async listActivity(limit = 6) {
    return mock.activity.slice(0, limit);
  }
}

const repository: CoraleRepository = new MockRepository();

export function getRepository(): CoraleRepository {
  return repository;
}
