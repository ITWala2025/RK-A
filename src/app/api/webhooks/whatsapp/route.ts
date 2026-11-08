import { NextRequest, NextResponse } from "next/server";
import { documentService } from "@/services/documentService";

// Meta WhatsApp Business Webhook Verification (Section 23 of Spec)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || "rka_ireland_whatsapp_verify_token_2026";

  if (mode === "subscribe" && token === expectedToken) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Verification token mismatch" }, { status: 403 });
}

// Inbound WhatsApp Message / Media Webhook (Section 23 & 24 of Spec)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if valid WhatsApp notification
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (!messages || messages.length === 0) {
      // Acknowledge statuses/read receipts immediately
      return NextResponse.json({ status: "acknowledged" }, { status: 200 });
    }

    const message = messages[0];
    const fromPhone = `+${message.from}`; // Normalize to E.164
    const messageId = message.id;

    // Check for document or image attachment
    if (message.type === "document" || message.type === "image") {
      const mediaData = message.document || message.image;
      const fileName = mediaData.filename || `whatsapp_${message.type}_${Date.now()}.${mediaData.mime_type?.split("/")[1] || "pdf"}`;
      const mimeType = mediaData.mime_type || (message.type === "image" ? "image/jpeg" : "application/pdf");
      const fileSize = mediaData.file_size || 150000;

      // Ingest canonical document
      const doc = await documentService.ingestDocument({
        file: {
          name: fileName,
          size: fileSize,
          mime_type: mimeType,
        },
        source_channel: "whatsapp",
        source_id: messageId,
        sender_identity: fromPhone,
        document_type: "other",
        tax_year: String(new Date().getFullYear()),
        metadata: {
          whatsapp_media_id: mediaData.id,
          caption: mediaData.caption,
          profile_name: value.contacts?.[0]?.profile?.name,
        },
      });

      return NextResponse.json({
        status: "success",
        message_id: messageId,
        document_id: doc.id,
        customer_id: doc.customer_id,
        matched: Boolean(doc.customer_id),
      });
    }

    // Acknowledge other message types (e.g., text)
    return NextResponse.json({
      status: "received_non_media",
      message_id: messageId,
    });
  } catch (error: any) {
    console.error("WhatsApp webhook processing error:", error);
    // Always return 200 to WhatsApp to avoid infinite redelivery storms
    return NextResponse.json(
      { status: "error", error: error.message },
      { status: 200 }
    );
  }
}

