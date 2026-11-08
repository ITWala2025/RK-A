// ====================================================================
// Company Directors & Proprietary Officers Model
// Irish Companies Act 2014 & Revenue Self-Assessment (Form 11) Rules
// ====================================================================

export type DirectorType = 'proprietary' | 'non_proprietary';

export type DirectorStatus = 'active' | 'resigned';

export interface CompanyDirector {
  id: string;
  customerId: string; // Company UUID, e.g. 'cust-1'
  companyName?: string;
  name: string;
  email: string;
  phone?: string;
  
  /** Irish Personal Public Service Number (PPSN) - Mandatory for Revenue Form 11 */
  ppsn: string;
  dateOfBirth?: string;
  nationality?: string;
  residentialAddress: string;
  
  /**
   * Proprietary Director: Holds >= 15% beneficial shareholding.
   * Under Irish law, proprietary directors MUST file an annual Form 11 Income Tax return,
   * regardless of whether all remuneration was taxed under PAYE.
   */
  directorType: DirectorType;
  shareholdingPercentage: number;
  
  appointmentDate: string;
  resignationDate?: string;
  status: DirectorStatus;
  
  isCompanySecretary: boolean;
  isPrimaryContact: boolean;
  
  /** Personal remuneration & tax details */
  annualSalaryOrDrawings: number;
  pensionContributions?: number;
  maritalStatus: 'single' | 'married_one_earner' | 'married_two_earners';
  
  /** Form 11 filing tracking */
  form11FilingRequired: boolean;
  latestForm11Status?: 'not_filed' | 'draft' | 'ready_to_file' | 'submitted_ros' | 'acknowledged';
  latestForm11TaxYear?: number;
  latestRosRef?: string;
  
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDirectorInput {
  customerId: string;
  name: string;
  email: string;
  phone?: string;
  ppsn: string;
  dateOfBirth?: string;
  nationality?: string;
  residentialAddress: string;
  directorType?: DirectorType;
  shareholdingPercentage: number;
  appointmentDate: string;
  isCompanySecretary?: boolean;
  isPrimaryContact?: boolean;
  annualSalaryOrDrawings?: number;
  pensionContributions?: number;
  maritalStatus?: 'single' | 'married_one_earner' | 'married_two_earners';
  notes?: string;
}

export interface UpdateDirectorInput extends Partial<CreateDirectorInput> {
  status?: DirectorStatus;
  resignationDate?: string;
  latestForm11Status?: 'not_filed' | 'draft' | 'ready_to_file' | 'submitted_ros' | 'acknowledged';
  latestForm11TaxYear?: number;
  latestRosRef?: string;
}
