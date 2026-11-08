import { NextRequest, NextResponse } from "next/server";
import { documentService } from "@/services/documentService";

// Inbound Email Webhook (Section 20 & 21 of Spec)
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let senderEmail = "";
    let subject = "";
    let messageId = "";
    let attachments: Array<{ name: string; size?: number; type?: string }> = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      senderEmail = (formData.get("from") as string) || (formData.get("sender") as string) || "";
      subject = (formData.get("subject") as string) || "";
      messageId = (formData.get("message-id") as string) || `em-${Date.now()}`;

      // Extract files from formData
      for (const [key, val] of formData.entries()) {
        if (val instanceof File && key.includes("attachment")) {
          attachments.push({
            name: val.name,
            size: val.size,
            type: val.type,
          });
        }
      }
    } else {
      const body = await request.json();
      senderEmail = body.from || body.sender || body.envelope?.from || "";
      subject = body.subject || "";
      messageId = body.messageId || body["message-id"] || `em-${Date.now()}`;
      attachments = body.attachments || [];
    }

    // Clean sender email (e.g., "John Doe <john@example.com>" -> "john@example.com")
    const emailMatch = senderEmail.match(/<([^>]+)>/);
    const cleanEmail = emailMatch ? emailMatch[1] : senderEmail.trim();

    if (attachments.length === 0) {
      return NextResponse.json({
        status: "no_attachments",
        message: "Email received without attachments. No documents ingested.",
      });
    }

    const ingestedDocs = [];
    for (const att of attachments) {
      const doc = await documentService.ingestDocument({
        file: {
          name: att.name,
          size: att.size || 120000,
          mime_type: att.type || (att.name.endsWith(".pdf") ? "application/pdf" : "application/octet-stream"),
        },
        source_channel: "email",
        source_id: messageId,
        sender_identity: cleanEmail,
        document_type: "other",
        tax_year: String(new Date().getFullYear()),
        metadata: {
          email_subject: subject,
          sender_raw: senderEmail,
        },
      });
      ingestedDocs.push({
        id: doc.id,
        name: doc.document_name,
        customer_id: doc.customer_id,
        status: doc.status,
      });
    }

    return NextResponse.json({
      status: "success",
      email: cleanEmail,
      attachments_count: attachments.length,
      ingested_documents: ingestedDocs,
    });
  } catch (error: any) {
    console.error("Email webhook processing error:", error);
    return NextResponse.json(
      { status: "error", error: error.message },
      { status: 500 }
    );
  }
}

