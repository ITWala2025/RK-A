import type { Lead, LeadStatus } from "../domain/types";
import { leads as seedLeads } from "../domain/seed";

export interface NewLeadInput {
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  serviceInterest: string[];
  message?: string;
  consentMarketing: boolean;
}

export interface LeadsRepository {
  list(): Promise<Lead[]>;
  getById(id: string): Promise<Lead | null>;
  create(input: NewLeadInput): Promise<Lead>;
  updateStatus(id: string, status: LeadStatus): Promise<Lead>;
}

function createInMemoryLeadsRepository(initial: Lead[]): LeadsRepository {
  const store = [...initial];
  let sequence = store.length;

  return {
    async list() {
      return [...store].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
    async getById(id) {
      return store.find((lead) => lead.id === id) ?? null;
    },
    async create(input) {
      sequence += 1;
      // Simple round-robin routing across relationship managers (PRD §2.1.7).
      const owners = ["staff-2", "staff-3"];
      const lead: Lead = {
        id: `lead-${sequence}`,
        name: input.name,
        companyName: input.companyName,
        email: input.email,
        phone: input.phone,
        serviceInterest: input.serviceInterest,
        message: input.message,
        source: "direct",
        consentMarketing: input.consentMarketing,
        status: "new",
        assignedOwnerId: owners[sequence % owners.length],
        createdAt: new Date().toISOString(),
      };
      store.push(lead);
      return lead;
    },
    async updateStatus(id, status) {
      const lead = store.find((l) => l.id === id);
      if (!lead) throw new Error(`Lead ${id} not found`);
      lead.status = status;
      return lead;
    },
  };
}

// Swap this export for a Supabase-backed implementation later (see Design.md §5) —
// no calling code should need to change.
export const leadsRepository: LeadsRepository = createInMemoryLeadsRepository(seedLeads);
