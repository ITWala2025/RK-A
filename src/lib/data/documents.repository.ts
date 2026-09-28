import type { DocumentCategory, DocumentItem } from "../domain/types";
import { documents as seedDocuments } from "../domain/seed";

export interface NewDocumentInput {
  customerId: string;
  fileName: string;
  category: DocumentCategory;
  taxYear: string;
}

export interface DocumentsRepository {
  listByCustomer(customerId: string): Promise<DocumentItem[]>;
  create(input: NewDocumentInput): Promise<DocumentItem>;
  markScanResult(id: string, status: "clean" | "quarantined"): Promise<DocumentItem>;
}

function createInMemoryDocumentsRepository(initial: DocumentItem[]): DocumentsRepository {
  const store = [...initial];
  let sequence = store.length;

  return {
    async listByCustomer(customerId) {
      return store
        .filter((d) => d.customerId === customerId)
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    },
    async create(input) {
      sequence += 1;
      const uploadedAt = new Date().toISOString();
      const retentionExpiresAt = new Date(
        new Date(uploadedAt).setFullYear(new Date(uploadedAt).getFullYear() + 6)
      ).toISOString();
      const doc: DocumentItem = {
        id: `doc-${sequence}`,
        customerId: input.customerId,
        fileName: input.fileName,
        category: input.category,
        taxYear: input.taxYear,
        uploadedAt,
        status: "pending_scan",
        retentionExpiresAt,
      };
      store.push(doc);
      return doc;
    },
    async markScanResult(id, status) {
      const doc = store.find((d) => d.id === id);
      if (!doc) throw new Error(`Document ${id} not found`);
      doc.status = status;
      return doc;
    },
  };
}

export const documentsRepository: DocumentsRepository =
  createInMemoryDocumentsRepository(seedDocuments);
