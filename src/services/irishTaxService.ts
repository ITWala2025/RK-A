import { mockStore } from '../data/mockStore';
import type {
  IrishTaxReturn,
  IrishVATReturn,
  IrishTaxReturnStatus,
  IrishVATReturnStatus,
} from '../types/irishTax';

class IrishTaxService {
  /**
   * Get all filed tax returns (CT1, Form 11, etc.) for a specific customer
   */
  async getTaxReturnsByCustomer(customerId: string): Promise<IrishTaxReturn[]> {
    if (!customerId) return [];
    const returns = mockStore.get<IrishTaxReturn>('irish_tax_returns');
    return returns
      .filter((r) => r.customerId === customerId)
      .sort((a, b) => (b.taxYear !== a.taxYear ? b.taxYear - a.taxYear : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }

  /**
   * Get all VAT returns (VAT3, RTD, VIES) for a specific customer
   */
  async getVatReturnsByCustomer(customerId: string): Promise<IrishVATReturn[]> {
    if (!customerId) return [];
    const returns = mockStore.get<IrishVATReturn>('irish_vat_returns');
    return returns
      .filter((r) => r.customerId === customerId)
      .sort((a, b) => (b.year !== a.year ? b.year - a.year : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }

  /**
   * Save a newly calculated tax return (generated from Tax Calculator or Manual Entry)
   */
  async createTaxReturn(
    data: Omit<IrishTaxReturn, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<IrishTaxReturn> {
    const now = new Date().toISOString();
    const newRecord: IrishTaxReturn = {
      ...data,
      id: `tax-ret-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };
    return mockStore.insert<IrishTaxReturn>('irish_tax_returns', newRecord);
  }

  /**
   * Save a newly calculated VAT return (generated from VAT Calculator or Manual Entry)
   */
  async createVatReturn(
    data: Omit<IrishVATReturn, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<IrishVATReturn> {
    const now = new Date().toISOString();
    const newRecord: IrishVATReturn = {
      ...data,
      id: `vat-ret-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };
    return mockStore.insert<IrishVATReturn>('irish_vat_returns', newRecord);
  }

  /**
   * Update Tax Return status (e.g. from draft -> ready_to_file -> submitted_ros -> acknowledged)
   */
  async updateTaxReturnStatus(
    id: string,
    status: IrishTaxReturnStatus,
    rosAcknowledgmentNumber?: string
  ): Promise<IrishTaxReturn | null> {
    const existing = mockStore.getById<IrishTaxReturn>('irish_tax_returns', id);
    if (!existing) return null;

    const updates: Partial<IrishTaxReturn> = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (rosAcknowledgmentNumber) {
      updates.rosAcknowledgmentNumber = rosAcknowledgmentNumber;
      if (status === 'submitted_ros' || status === 'acknowledged') {
        updates.filingDate = new Date().toISOString();
      }
    }
    return mockStore.update<IrishTaxReturn>('irish_tax_returns', id, updates);
  }

  /**
   * Update VAT Return status
   */
  async updateVatReturnStatus(
    id: string,
    status: IrishVATReturnStatus,
    rosNoticeNumber?: string
  ): Promise<IrishVATReturn | null> {
    const existing = mockStore.getById<IrishVATReturn>('irish_vat_returns', id);
    if (!existing) return null;

    const updates: Partial<IrishVATReturn> = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (rosNoticeNumber) {
      updates.rosNoticeNumber = rosNoticeNumber;
      if (status === 'submitted_ros' || status === 'acknowledged') {
        updates.filingDate = new Date().toISOString();
      }
    }
    return mockStore.update<IrishVATReturn>('irish_vat_returns', id, updates);
  }

  /**
   * Delete tax return
   */
  async deleteTaxReturn(id: string): Promise<boolean> {
    return mockStore.delete('irish_tax_returns', id);
  }

  /**
   * Delete VAT return
   */
  async deleteVatReturn(id: string): Promise<boolean> {
    return mockStore.delete('irish_vat_returns', id);
  }
}

export const irishTaxService = new IrishTaxService();
