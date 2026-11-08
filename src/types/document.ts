// Canonical Document Entity & Ingestion Types
// Specified by customer_document_ingestion_customer360_spec.md

export type DocumentStatus =
  | 'received'
  | 'processing'
  | 'ready'
  | 'verified'
  | 'requires_review'
  | 'rejected'
  | 'failed'
  | 'archived';

export type SourceChannel = 'portal' | 'email' | 'whatsapp' | 'admin';

export type DocumentCategoryType =
  | 'bank_statements'
  | 'payroll'
  | 'vat_returns'
  | 'annual_accounts'
  | 'tax_returns'
  | 'company_secretarial'
  | 'correspondence'
  | 'id_verification'
  | 'other';

export type SecurityScanStatus = 'clean' | 'pending_scan' | 'quarantined' | 'suspicious';

export interface CanonicalDocument {
  id: string;
  customer_id: string | null; // null if pending identification / requires_review
  customer_name?: string;
  document_name: string;
  document_type: DocumentCategoryType;
  tax_year?: string;
  status: DocumentStatus;
  source_channel: SourceChannel;
  source_id?: string; // e.g. email msg id or WhatsApp wamid
  sender_identity?: string; // e.g. sender email or phone number
  storage_bucket: string;
  storage_path: string;
  mime_type: string;
  file_size: number;
  checksum: string; // SHA-256
  security_scan_status: SecurityScanStatus;
  uploaded_at: string;
  verified_at?: string;
  verified_by?: string;
  review_notes?: string;
  created_at: string;
  updated_at: string;
  download_url?: string;
  metadata?: Record<string, any>;
}

export interface CustomerIdentity {
  id: string;
  customer_id: string;
  identity_type: 'email' | 'phone' | 'whatsapp' | 'cro_number' | 'vat_number';
  identity_value: string;
  verified: boolean;
  source: string;
  created_at: string;
}

export type DocumentAuditEventType =
  | 'document_received'
  | 'identity_matched'
  | 'identity_unmatched'
  | 'security_scan_clean'
  | 'security_scan_quarantined'
  | 'customer_assigned'
  | 'document_verified'
  | 'document_rejected'
  | 'note_added'
  | 'document_downloaded';

export interface DocumentAuditEvent {
  id: string;
  document_id: string;
  event_type: DocumentAuditEventType;
  actor_id?: string;
  actor_name?: string;
  actor_role?: string;
  details?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface IngestDocumentPayload {
  file: {
    name: string;
    size: number;
    mime_type: string;
    buffer?: ArrayBuffer | Buffer;
    data_url?: string;
  };
  source_channel: SourceChannel;
  source_id?: string;
  sender_identity?: string;
  document_type?: DocumentCategoryType;
  tax_year?: string;
  explicit_customer_id?: string;
  metadata?: Record<string, any>;
}

