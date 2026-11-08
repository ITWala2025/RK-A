import type {
  CanonicalDocument,
  DocumentStatus,
  SourceChannel,
  DocumentCategoryType,
  SecurityScanStatus,
  CustomerIdentity,
  DocumentAuditEvent,
  IngestDocumentPayload,
} from '../types/document';
import { mockCustomers } from '../data/mockData';
import { mockStore } from '../data/mockStore';

// Initial Seed Identities for Deterministic Matching (Section 10 & 11)
const initialCustomerIdentities: CustomerIdentity[] = [
  {
    id: 'ident-001',
    customer_id: 'cust-1', // Emerald Coastal Foods Ltd
    identity_type: 'email',
    identity_value: 'accounts@emeraldcoastalfoods.ie',
    verified: true,
    source: 'portal_registration',
    created_at: '2024-03-12T09:00:00Z',
  },
  {
    id: 'ident-002',
    customer_id: 'cust-1',
    identity_type: 'phone',
    identity_value: '+35314987654',
    verified: true,
    source: 'onboarding_verified',
    created_at: '2024-03-12T09:00:00Z',
  },
  {
    id: 'ident-003',
    customer_id: 'cust-1',
    identity_type: 'whatsapp',
    identity_value: '+353871234567',
    verified: true,
    source: 'whatsapp_optin',
    created_at: '2024-03-15T10:00:00Z',
  },
  {
    id: 'ident-004',
    customer_id: 'cust-2', // Fionnuala Byrne
    identity_type: 'email',
    identity_value: 'fionnuala@byrneconsult.ie',
    verified: true,
    source: 'portal_registration',
    created_at: '2025-01-20T09:00:00Z',
  },
  {
    id: 'ident-005',
    customer_id: 'cust-2',
    identity_type: 'whatsapp',
    identity_value: '+353872345678',
    verified: true,
    source: 'whatsapp_optin',
    created_at: '2025-01-22T14:00:00Z',
  },
  {
    id: 'ident-006',
    customer_id: 'cust-3', // Liffey Digital Solutions DAC
    identity_type: 'email',
    identity_value: 'finance@liffeydigital.ie',
    verified: true,
    source: 'portal_registration',
    created_at: '2025-06-02T09:00:00Z',
  },
  {
    id: 'ident-007',
    customer_id: 'cust-3',
    identity_type: 'phone',
    identity_value: '+35316789012',
    verified: true,
    source: 'onboarding_verified',
    created_at: '2025-06-02T09:00:00Z',
  },
  {
    id: 'ident-008',
    customer_id: 'cust-002', // Apex FinTech Solutions Europe
    identity_type: 'email',
    identity_value: 'helena.oconnor@apexfintech.example.ie',
    verified: true,
    source: 'portal_registration',
    created_at: '2026-01-20T11:30:00Z',
  },
  {
    id: 'ident-009',
    customer_id: 'cust-002',
    identity_type: 'whatsapp',
    identity_value: '+353891239999',
    verified: true,
    source: 'whatsapp_optin',
    created_at: '2026-01-21T09:00:00Z',
  },
];

// Initial Seed Documents
const initialDocuments: CanonicalDocument[] = [
  {
    id: 'doc-001',
    customer_id: 'cust-1',
    customer_name: 'Emerald Coastal Foods Ltd',
    document_name: 'Bank_Statement_AIB_Aug2026.pdf',
    document_type: 'bank_statements',
    tax_year: '2026',
    status: 'verified',
    source_channel: 'portal',
    sender_identity: 'accounts@emeraldcoastalfoods.ie',
    storage_bucket: 'customer-documents',
    storage_path: 'cust-1/2026/doc-001_Bank_Statement_AIB_Aug2026.pdf',
    mime_type: 'application/pdf',
    file_size: 142050,
    checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    security_scan_status: 'clean',
    uploaded_at: '2026-09-05T11:00:00Z',
    verified_at: '2026-09-06T09:30:00Z',
    verified_by: 'Aoife Ryan (Partner)',
    review_notes: 'Reconciled against Q3 VAT3 return.',
    created_at: '2026-09-05T11:00:00Z',
    updated_at: '2026-09-06T09:30:00Z',
    download_url: '/api/documents/doc-001',
  },
  {
    id: 'doc-002',
    customer_id: 'cust-1',
    customer_name: 'Emerald Coastal Foods Ltd',
    document_name: 'Payroll_ERR_September_2026.xlsx',
    document_type: 'payroll',
    tax_year: '2026',
    status: 'verified',
    source_channel: 'email',
    source_id: 'msg-em-984210',
    sender_identity: 'accounts@emeraldcoastalfoods.ie',
    storage_bucket: 'customer-documents',
    storage_path: 'cust-1/2026/doc-002_Payroll_ERR_September_2026.xlsx',
    mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    file_size: 89400,
    checksum: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
    security_scan_status: 'clean',
    uploaded_at: '2026-09-22T09:30:00Z',
    verified_at: '2026-09-22T14:15:00Z',
    verified_by: 'Declan Walsh (Payroll Officer)',
    review_notes: 'Uploaded and filed to Revenue ROS ERR portal.',
    created_at: '2026-09-22T09:30:00Z',
    updated_at: '2026-09-22T14:15:00Z',
    download_url: '/api/documents/doc-002',
  },
  {
    id: 'doc-003',
    customer_id: 'cust-2',
    customer_name: 'Fionnuala Byrne Consultancy',
    document_name: 'Rental_Income_Summary_2025.pdf',
    document_type: 'tax_returns',
    tax_year: '2025',
    status: 'ready',
    source_channel: 'whatsapp',
    source_id: 'wamid.HBgLMzUzODcyMzQ1Njc4FQIAEhgg...',
    sender_identity: '+353872345678',
    storage_bucket: 'customer-documents',
    storage_path: 'cust-2/2025/doc-003_Rental_Income_Summary_2025.pdf',
    mime_type: 'application/pdf',
    file_size: 204800,
    checksum: 'b45cffe084dd3d20d928bee85e7b0f21',
    security_scan_status: 'clean',
    uploaded_at: '2026-10-01T15:20:00Z',
    created_at: '2026-10-01T15:20:00Z',
    updated_at: '2026-10-01T15:20:00Z',
    download_url: '/api/documents/doc-003',
  },
  {
    id: 'doc-004',
    customer_id: null, // Unmatched / Requires Admin Review
    customer_name: undefined,
    document_name: 'Supplier_Invoice_INV9912.pdf',
    document_type: 'vat_returns',
    tax_year: '2026',
    status: 'requires_review',
    source_channel: 'email',
    source_id: 'msg-em-unmatched-1102',
    sender_identity: 'billing@dublindistributors.ie',
    storage_bucket: 'customer-documents',
    storage_path: 'unassigned/2026/doc-004_Supplier_Invoice_INV9912.pdf',
    mime_type: 'application/pdf',
    file_size: 73200,
    checksum: 'c71d6502886e64b8519da15be6e52489',
    security_scan_status: 'clean',
    uploaded_at: '2026-10-03T11:45:00Z',
    review_notes: 'Sender email not matched in customer registry. Requires manual customer assignment.',
    created_at: '2026-10-03T11:45:00Z',
    updated_at: '2026-10-03T11:45:00Z',
    download_url: '/api/documents/doc-004',
  },
  {
    id: 'doc-005',
    customer_id: null,
    customer_name: undefined,
    document_name: 'Director_Passport_Photo.jpg',
    document_type: 'id_verification',
    tax_year: '2026',
    status: 'requires_review',
    source_channel: 'whatsapp',
    source_id: 'wamid.HBgLMzUzODkyMjIyMzM0FQIAEhgg...',
    sender_identity: '+353892222334',
    storage_bucket: 'customer-documents',
    storage_path: 'unassigned/2026/doc-005_Director_Passport_Photo.jpg',
    mime_type: 'image/jpeg',
    file_size: 1540000,
    checksum: 'd9b32e185c7b39922e3914a1e9447a11',
    security_scan_status: 'clean',
    uploaded_at: '2026-10-04T16:10:00Z',
    review_notes: 'WhatsApp number +353892222334 not associated with any active client record.',
    created_at: '2026-10-04T16:10:00Z',
    updated_at: '2026-10-04T16:10:00Z',
    download_url: '/api/documents/doc-005',
  },
];

// Initial Audit Trail
const initialAuditEvents: DocumentAuditEvent[] = [
  {
    id: 'audit-001',
    document_id: 'doc-001',
    event_type: 'document_received',
    actor_name: 'Emerald Coastal Foods (Portal User)',
    actor_role: 'customer',
    details: 'Document uploaded via Client Portal',
    timestamp: '2026-09-05T11:00:00Z',
  },
  {
    id: 'audit-002',
    document_id: 'doc-001',
    event_type: 'security_scan_clean',
    actor_name: 'Malware Scanner Daemon',
    actor_role: 'system',
    details: 'ClamAV signature scan passed: Clean',
    timestamp: '2026-09-05T11:00:05Z',
  },
  {
    id: 'audit-003',
    document_id: 'doc-001',
    event_type: 'document_verified',
    actor_name: 'Aoife Ryan',
    actor_role: 'partner_admin',
    details: 'Verified against Q3 VAT3 return',
    timestamp: '2026-09-06T09:30:00Z',
  },
  {
    id: 'audit-004',
    document_id: 'doc-004',
    event_type: 'document_received',
    actor_name: 'Inbound Email Ingestion Worker',
    actor_role: 'system',
    details: 'Received from billing@dublindistributors.ie',
    timestamp: '2026-10-03T11:45:00Z',
  },
  {
    id: 'audit-005',
    document_id: 'doc-004',
    event_type: 'identity_unmatched',
    actor_name: 'Identity Matcher',
    actor_role: 'system',
    details: 'No verified customer record found for billing@dublindistributors.ie. Queued for admin review.',
    timestamp: '2026-10-03T11:45:01Z',
  },
];

// In-Memory Storage with Persistence Key
const DOCS_STORAGE_KEY = 'rka_canonical_documents_v1';
const IDENTS_STORAGE_KEY = 'rka_customer_identities_v1';
const AUDIT_STORAGE_KEY = 'rka_document_audit_v1';

class DocumentService {
  private documents: CanonicalDocument[] = [];
  private identities: CustomerIdentity[] = [];
  private auditEvents: DocumentAuditEvent[] = [];

  constructor() {
    this.loadState();
  }

  private loadState() {
    if (typeof window === 'undefined') {
      this.documents = JSON.parse(JSON.stringify(initialDocuments));
      this.identities = JSON.parse(JSON.stringify(initialCustomerIdentities));
      this.auditEvents = JSON.parse(JSON.stringify(initialAuditEvents));
      return;
    }

    try {
      const storedDocs = localStorage.getItem(DOCS_STORAGE_KEY);
      this.documents = storedDocs ? JSON.parse(storedDocs) : JSON.parse(JSON.stringify(initialDocuments));

      const storedIdents = localStorage.getItem(IDENTS_STORAGE_KEY);
      this.identities = storedIdents ? JSON.parse(storedIdents) : JSON.parse(JSON.stringify(initialCustomerIdentities));

      const storedAudit = localStorage.getItem(AUDIT_STORAGE_KEY);
      this.auditEvents = storedAudit ? JSON.parse(storedAudit) : JSON.parse(JSON.stringify(initialAuditEvents));
    } catch {
      this.documents = JSON.parse(JSON.stringify(initialDocuments));
      this.identities = JSON.parse(JSON.stringify(initialCustomerIdentities));
      this.auditEvents = JSON.parse(JSON.stringify(initialAuditEvents));
    }
  }

  private saveState() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(this.documents));
      localStorage.setItem(IDENTS_STORAGE_KEY, JSON.stringify(this.identities));
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(this.auditEvents));
    } catch (e) {
      console.error('Failed to save document store state', e);
    }
  }

  // -------------------------------------------------------------
  // Customer Identity Resolution (Section 10 of Spec)
  // Priority:
  // 1. Explicit Customer ID
  // 2. Verified WhatsApp Phone (E.164)
  // 3. Verified Email Address
  // -------------------------------------------------------------
  public resolveCustomerIdentity(
    explicitCustomerId?: string,
    senderIdentity?: string,
    channel?: SourceChannel
  ): { customerId: string | null; matchedBy: string; customerName?: string } {
    if (explicitCustomerId) {
      const c = mockCustomers.find((cust) => cust.id === explicitCustomerId);
      if (c) {
        return {
          customerId: c.id,
          matchedBy: 'explicit_customer_id',
          customerName: c.company_name || c.contact_person,
        };
      }
    }

    if (!senderIdentity) {
      return { customerId: null, matchedBy: 'unmatched' };
    }

    const cleanSender = senderIdentity.trim().toLowerCase();

    // Check verified identities table
    const matchedIdent = this.identities.find((ident) => {
      const identVal = ident.identity_value.trim().toLowerCase();
      if (channel === 'whatsapp' || ident.identity_type === 'whatsapp' || ident.identity_type === 'phone') {
        const normSender = cleanSender.replace(/\D/g, '');
        const normIdent = identVal.replace(/\D/g, '');
        return normSender.endsWith(normIdent) || normIdent.endsWith(normSender);
      }
      return identVal === cleanSender;
    });

    if (matchedIdent) {
      const cust = mockCustomers.find((c) => c.id === matchedIdent.customer_id);
      return {
        customerId: matchedIdent.customer_id,
        matchedBy: `verified_${matchedIdent.identity_type}_match`,
        customerName: cust?.company_name || cust?.contact_person,
      };
    }

    // Direct lookup in mockCustomers table
    for (const cust of mockCustomers) {
      if (channel === 'whatsapp' || cleanSender.startsWith('+') || /^\d+$/.test(cleanSender.replace(/[\s\-\+]/g, ''))) {
        const normSender = cleanSender.replace(/\D/g, '');
        const normCustPhone = (cust.phone || '').replace(/\D/g, '');
        if (normCustPhone && (normSender.endsWith(normCustPhone) || normCustPhone.endsWith(normSender))) {
          return {
            customerId: cust.id,
            matchedBy: 'customer_profile_phone_match',
            customerName: cust.company_name || cust.contact_person,
          };
        }
      } else {
        if (cust.email && cust.email.toLowerCase() === cleanSender) {
          return {
            customerId: cust.id,
            matchedBy: 'customer_profile_email_match',
            customerName: cust.company_name || cust.contact_person,
          };
        }
      }
    }

    return { customerId: null, matchedBy: 'unmatched' };
  }

  // -------------------------------------------------------------
  // Ingest Document (Section 16, 17, 18 of Spec)
  // -------------------------------------------------------------
  public async ingestDocument(payload: IngestDocumentPayload): Promise<CanonicalDocument> {
    const {
      file,
      source_channel,
      source_id,
      sender_identity,
      document_type = 'other',
      tax_year = String(new Date().getFullYear()),
      explicit_customer_id,
      metadata = {},
    } = payload;

    // Generate SHA-256 Checksum simulation
    const fakeChecksum =
      'sha256_' +
      Math.random().toString(36).substring(2, 10) +
      Date.now().toString(36) +
      file.name.replace(/[^a-zA-Z0-9]/g, '');

    // Check for duplicate document
    const existingDoc = this.documents.find(
      (d) => d.document_name === file.name && d.file_size === file.size && d.source_channel === source_channel
    );
    if (existingDoc) {
      this.recordAuditEvent({
        document_id: existingDoc.id,
        event_type: 'document_received',
        details: `Duplicate upload detected for file ${file.name}. Returning existing document record.`,
      });
      return existingDoc;
    }

    // Resolve Customer Identity
    const { customerId, matchedBy, customerName } = this.resolveCustomerIdentity(
      explicit_customer_id,
      sender_identity,
      source_channel
    );

    const docId = `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const nowIso = new Date().toISOString();

    const status: DocumentStatus = customerId ? 'ready' : 'requires_review';
    const storagePath = customerId
      ? `${customerId}/${tax_year}/${docId}_${file.name}`
      : `unassigned/${tax_year}/${docId}_${file.name}`;

    const newDoc: CanonicalDocument = {
      id: docId,
      customer_id: customerId,
      customer_name: customerName,
      document_name: file.name,
      document_type,
      tax_year,
      status,
      source_channel,
      source_id,
      sender_identity,
      storage_bucket: 'customer-documents',
      storage_path: storagePath,
      mime_type: file.mime_type || 'application/octet-stream',
      file_size: file.size,
      checksum: fakeChecksum,
      security_scan_status: 'clean',
      uploaded_at: nowIso,
      created_at: nowIso,
      updated_at: nowIso,
      download_url: `/api/documents/${docId}`,
      metadata: {
        ...metadata,
        matchedBy,
      },
    };

    this.documents.unshift(newDoc);

    // Audit Event 1: document_received
    this.recordAuditEvent({
      document_id: docId,
      event_type: 'document_received',
      actor_name: sender_identity || 'Customer Portal',
      actor_role: source_channel,
      details: `Received via ${source_channel.toUpperCase()}: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
    });

    // Audit Event 2: identity matching result
    if (customerId) {
      this.recordAuditEvent({
        document_id: docId,
        event_type: 'identity_matched',
        actor_name: 'Identity Resolution Engine',
        actor_role: 'system',
        details: `Customer identified: ${customerName} (${customerId}) via ${matchedBy}`,
      });
    } else {
      this.recordAuditEvent({
        document_id: docId,
        event_type: 'identity_unmatched',
        actor_name: 'Identity Resolution Engine',
        actor_role: 'system',
        details: `Sender ${sender_identity || 'unknown'} could not be mapped. Routed to Requires Review Inbox.`,
      });
    }

    // Audit Event 3: security scan clean
    this.recordAuditEvent({
      document_id: docId,
      event_type: 'security_scan_clean',
      actor_name: 'Malware Scanner',
      actor_role: 'system',
      details: `ClamAV malware signature scan passed clean. Checksum: ${fakeChecksum.substring(0, 16)}...`,
    });

    this.saveState();
    return newDoc;
  }

  // -------------------------------------------------------------
  // List Documents with Filters (Section 25 & 26 of Spec)
  // -------------------------------------------------------------
  public async listDocuments(filters?: {
    customerId?: string;
    status?: DocumentStatus | 'all';
    channel?: SourceChannel | 'all';
    category?: DocumentCategoryType | 'all';
    search?: string;
  }): Promise<CanonicalDocument[]> {
    this.loadState();
    let result = [...this.documents];

    if (filters?.customerId) {
      result = result.filter((d) => d.customer_id === filters.customerId);
    }

    if (filters?.status && filters.status !== 'all') {
      result = result.filter((d) => d.status === filters.status);
    }

    if (filters?.channel && filters.channel !== 'all') {
      result = result.filter((d) => d.source_channel === filters.channel);
    }

    if (filters?.category && filters.category !== 'all') {
      result = result.filter((d) => d.document_type === filters.category);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (d) =>
          d.document_name.toLowerCase().includes(q) ||
          (d.customer_name && d.customer_name.toLowerCase().includes(q)) ||
          (d.sender_identity && d.sender_identity.toLowerCase().includes(q))
      );
    }

    return result;
  }

  public async getDocumentById(id: string): Promise<CanonicalDocument | null> {
    this.loadState();
    const doc = this.documents.find((d) => d.id === id);
    return doc || null;
  }

  // -------------------------------------------------------------
  // Assign Customer (Section 25: For 'requires_review')
  // -------------------------------------------------------------
  public async assignCustomer(
    documentId: string,
    customerId: string,
    adminUser: string = 'Practice Staff',
    notes?: string
  ): Promise<CanonicalDocument> {
    this.loadState();
    const doc = this.documents.find((d) => d.id === documentId);
    if (!doc) throw new Error(`Document ${documentId} not found`);

    const cust = mockCustomers.find((c) => c.id === customerId);
    if (!cust) throw new Error(`Customer ${customerId} not found`);

    doc.customer_id = customerId;
    doc.customer_name = cust.company_name || cust.contact_person;
    doc.status = 'ready';
    doc.review_notes = notes || doc.review_notes;
    doc.storage_path = `${customerId}/${doc.tax_year || '2026'}/${doc.id}_${doc.document_name}`;
    doc.updated_at = new Date().toISOString();

    this.recordAuditEvent({
      document_id: documentId,
      event_type: 'customer_assigned',
      actor_name: adminUser,
      actor_role: 'admin',
      details: `Assigned to customer ${doc.customer_name} (${customerId}). ${notes ? `Note: ${notes}` : ''}`,
    });

    this.saveState();
    return doc;
  }

  // -------------------------------------------------------------
  // Verify Document (Section 25: Admin verification)
  // -------------------------------------------------------------
  public async verifyDocument(
    documentId: string,
    adminUser: string = 'Aoife Ryan (Partner)',
    notes?: string
  ): Promise<CanonicalDocument> {
    this.loadState();
    const doc = this.documents.find((d) => d.id === documentId);
    if (!doc) throw new Error(`Document ${documentId} not found`);

    doc.status = 'verified';
    doc.verified_at = new Date().toISOString();
    doc.verified_by = adminUser;
    if (notes) doc.review_notes = notes;
    doc.updated_at = new Date().toISOString();

    this.recordAuditEvent({
      document_id: documentId,
      event_type: 'document_verified',
      actor_name: adminUser,
      actor_role: 'admin',
      details: `Verified by ${adminUser}. ${notes ? `Note: ${notes}` : ''}`,
    });

    this.saveState();
    return doc;
  }

  // -------------------------------------------------------------
  // Reject Document (Section 25)
  // -------------------------------------------------------------
  public async rejectDocument(
    documentId: string,
    reason: string,
    adminUser: string = 'Practice Staff'
  ): Promise<CanonicalDocument> {
    this.loadState();
    const doc = this.documents.find((d) => d.id === documentId);
    if (!doc) throw new Error(`Document ${documentId} not found`);

    doc.status = 'rejected';
    doc.review_notes = reason;
    doc.updated_at = new Date().toISOString();

    this.recordAuditEvent({
      document_id: documentId,
      event_type: 'document_rejected',
      actor_name: adminUser,
      actor_role: 'admin',
      details: `Rejected: ${reason}`,
    });

    this.saveState();
    return doc;
  }

  // -------------------------------------------------------------
  // Add Review Note
  // -------------------------------------------------------------
  public async addReviewNote(
    documentId: string,
    note: string,
    adminUser: string = 'Staff'
  ): Promise<CanonicalDocument> {
    this.loadState();
    const doc = this.documents.find((d) => d.id === documentId);
    if (!doc) throw new Error(`Document ${documentId} not found`);

    doc.review_notes = doc.review_notes ? `${doc.review_notes}\n[${new Date().toLocaleDateString('en-IE')} ${adminUser}]: ${note}` : `[${new Date().toLocaleDateString('en-IE')} ${adminUser}]: ${note}`;
    doc.updated_at = new Date().toISOString();

    this.recordAuditEvent({
      document_id: documentId,
      event_type: 'note_added',
      actor_name: adminUser,
      actor_role: 'admin',
      details: `Note added: ${note}`,
    });

    this.saveState();
    return doc;
  }

  // -------------------------------------------------------------
  // Audit Trail (Section 28 of Spec)
  // -------------------------------------------------------------
  public recordAuditEvent(event: Omit<DocumentAuditEvent, 'id' | 'timestamp'>): DocumentAuditEvent {
    const newEvent: DocumentAuditEvent = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...event,
    };
    this.auditEvents.unshift(newEvent);
    this.saveState();
    return newEvent;
  }

  public getAuditTrail(documentId?: string): DocumentAuditEvent[] {
    this.loadState();
    if (documentId) {
      return this.auditEvents.filter((e) => e.document_id === documentId);
    }
    return [...this.auditEvents];
  }

  // Helper for stats
  public async getStats() {
    this.loadState();
    const total = this.documents.length;
    const verified = this.documents.filter((d) => d.status === 'verified').length;
    const requiresReview = this.documents.filter((d) => d.status === 'requires_review').length;
    const ready = this.documents.filter((d) => d.status === 'ready').length;
    const rejected = this.documents.filter((d) => d.status === 'rejected').length;

    const byChannel = {
      portal: this.documents.filter((d) => d.source_channel === 'portal').length,
      email: this.documents.filter((d) => d.source_channel === 'email').length,
      whatsapp: this.documents.filter((d) => d.source_channel === 'whatsapp').length,
      admin: this.documents.filter((d) => d.source_channel === 'admin').length,
    };

    return { total, verified, requiresReview, ready, rejected, byChannel };
  }
}

export const documentService = new DocumentService();

