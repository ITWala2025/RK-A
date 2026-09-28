import type { ComplianceItem } from "../domain/types";
import { complianceItems as seedComplianceItems } from "../domain/seed";

export interface ComplianceRepository {
  list(): Promise<ComplianceItem[]>;
  listByCustomer(customerId: string): Promise<ComplianceItem[]>;
}

function createInMemoryComplianceRepository(initial: ComplianceItem[]): ComplianceRepository {
  const store = [...initial];
  return {
    async list() {
      return [...store].sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
    },
    async listByCustomer(customerId) {
      return store
        .filter((c) => c.customerId === customerId)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    },
  };
}

export const complianceRepository: ComplianceRepository =
  createInMemoryComplianceRepository(seedComplianceItems);
