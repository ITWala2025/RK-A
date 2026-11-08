import { NextRequest, NextResponse } from "next/server";
import { documentService } from "@/services/documentService";
import type { SourceChannel, DocumentCategoryType } from "@/types/document";

// GET /api/documents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId") || undefined;
    const status = (searchParams.get("status") as any) || "all";
    const channel = (searchParams.get("channel") as any) || "all";
    const category = (searchParams.get("category") as any) || "all";
    const search = searchParams.get("search") || undefined;

    const docs = await documentService.listDocuments({
      customerId,
      status,
      channel,
      category,
      search,
    });

    return NextResponse.json({ success: true, count: docs.length, data: docs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to list documents" },
      { status: 500 }
    );
  }
}

// POST /api/documents
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const explicitCustomerId = (formData.get("customerId") as string) || undefined;
      const category = (formData.get("category") as DocumentCategoryType) || "other";
      const channel = (formData.get("sourceChannel") as SourceChannel) || "portal";
      const taxYear = (formData.get("taxYear") as string) || String(new Date().getFullYear());
      const senderIdentity = (formData.get("senderIdentity") as string) || undefined;

      if (!file) {
        return NextResponse.json(
          { success: false, error: "No file provided in form data" },
          { status: 400 }
        );
      }

      // Check max size 25MB
      if (file.size > 25 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: "File exceeds maximum size limit of 25MB" },
          { status: 400 }
        );
      }

      const doc = await documentService.ingestDocument({
        file: {
          name: file.name,
          size: file.size,
          mime_type: file.type,
        },
        source_channel: channel,
        document_type: category,
        tax_year: taxYear,
        explicit_customer_id: explicitCustomerId,
        sender_identity: senderIdentity,
      });

      return NextResponse.json({ success: true, data: doc }, { status: 201 });
    }

    // JSON ingestion payload
    const body = await request.json();
    const {
      fileName,
      fileSize = 100000,
      mimeType = "application/pdf",
      sourceChannel = "portal",
      documentType = "other",
      taxYear = String(new Date().getFullYear()),
      customerId,
      senderIdentity,
      sourceId,
      metadata,
    } = body;

    if (!fileName) {
      return NextResponse.json(
        { success: false, error: "fileName is required" },
        { status: 400 }
      );
    }

    const doc = await documentService.ingestDocument({
      file: {
        name: fileName,
        size: Number(fileSize),
        mime_type: mimeType,
      },
      source_channel: sourceChannel,
      source_id: sourceId,
      sender_identity: senderIdentity,
      document_type: documentType,
      tax_year: taxYear,
      explicit_customer_id: customerId,
      metadata,
    });

    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to ingest document" },
      { status: 500 }
    );
  }
}

