import type { StaffMember } from "../domain/types";
import { staff as seedStaff } from "../domain/seed";

export interface StaffRepository {
  list(): Promise<StaffMember[]>;
  getById(id: string): Promise<StaffMember | null>;
}

function createInMemoryStaffRepository(initial: StaffMember[]): StaffRepository {
  const store = [...initial];
  return {
    async list() {
      return [...store];
    },
    async getById(id) {
      return store.find((s) => s.id === id) ?? null;
    },
  };
}

export const staffRepository: StaffRepository = createInMemoryStaffRepository(seedStaff);
