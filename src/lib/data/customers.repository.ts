import type { Customer } from "../domain/types";
import { customers as seedCustomers } from "../domain/seed";

export interface CustomersRepository {
  list(): Promise<Customer[]>;
  getById(id: string): Promise<Customer | null>;
}

function createInMemoryCustomersRepository(initial: Customer[]): CustomersRepository {
  const store = [...initial];
  return {
    async list() {
      return [...store].sort((a, b) => a.legalEntityName.localeCompare(b.legalEntityName));
    },
    async getById(id) {
      return store.find((c) => c.id === id) ?? null;
    },
  };
}

export const customersRepository: CustomersRepository =
  createInMemoryCustomersRepository(seedCustomers);
