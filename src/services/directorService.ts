import { mockStore } from '../data/mockStore';
import type {
  CompanyDirector,
  CreateDirectorInput,
  UpdateDirectorInput,
} from '../types/director';

class DirectorService {
  async getDirectorsByCustomer(customerId: string): Promise<CompanyDirector[]> {
    if (!customerId) return [];
    const directors = mockStore.get<CompanyDirector>('company_directors');
    return directors
      .filter((d) => d.customerId === customerId)
      .sort((a, b) => b.shareholdingPercentage - a.shareholdingPercentage);
  }

  async getDirectorById(id: string): Promise<CompanyDirector | null> {
    if (!id) return null;
    return mockStore.getById<CompanyDirector>('company_directors', id) || null;
  }

  async createDirector(input: CreateDirectorInput): Promise<CompanyDirector> {
    const now = new Date().toISOString();
    const shareholding = Number(input.shareholdingPercentage || 0);
    // Automatic Irish rule: proprietary if holding >= 15%
    const directorType = input.directorType || (shareholding >= 15 ? 'proprietary' : 'non_proprietary');
    const form11FilingRequired = directorType === 'proprietary';

    const newDirector: CompanyDirector = {
      id: `dir-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      customerId: input.customerId,
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone?.trim(),
      ppsn: input.ppsn.trim().toUpperCase(),
      dateOfBirth: input.dateOfBirth,
      nationality: input.nationality || 'Irish',
      residentialAddress: input.residentialAddress.trim(),
      directorType,
      shareholdingPercentage: shareholding,
      appointmentDate: input.appointmentDate || now.split('T')[0],
      status: 'active',
      isCompanySecretary: Boolean(input.isCompanySecretary),
      isPrimaryContact: Boolean(input.isPrimaryContact),
      annualSalaryOrDrawings: Number(input.annualSalaryOrDrawings || 0),
      pensionContributions: Number(input.pensionContributions || 0),
      maritalStatus: input.maritalStatus || 'single',
      form11FilingRequired,
      latestForm11Status: form11FilingRequired ? 'draft' : undefined,
      notes: input.notes,
      createdAt: now,
      updatedAt: now,
    };

    return mockStore.insert<CompanyDirector>('company_directors', newDirector);
  }

  async updateDirector(id: string, updates: UpdateDirectorInput): Promise<CompanyDirector | null> {
    const existing = mockStore.getById<CompanyDirector>('company_directors', id);
    if (!existing) return null;

    const shareholding = updates.shareholdingPercentage !== undefined 
      ? Number(updates.shareholdingPercentage) 
      : existing.shareholdingPercentage;

    const directorType = updates.directorType || (shareholding >= 15 ? 'proprietary' : 'non_proprietary');
    const form11FilingRequired = directorType === 'proprietary';

    const cleanUpdates: Partial<CompanyDirector> = {
      ...updates,
      shareholdingPercentage: shareholding,
      directorType,
      form11FilingRequired,
      updatedAt: new Date().toISOString(),
    };
    if (updates.ppsn) {
      cleanUpdates.ppsn = updates.ppsn.trim().toUpperCase();
    }

    return mockStore.update<CompanyDirector>('company_directors', id, cleanUpdates);
  }

  async deleteDirector(id: string): Promise<boolean> {
    return mockStore.delete('company_directors', id);
  }
}

export const directorService = new DirectorService();
