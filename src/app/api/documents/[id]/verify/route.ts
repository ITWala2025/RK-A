import { NextRequest, NextResponse } from "next/server";
import { documentService } from "@/services/documentService";

// POST /api/documents/[id]/verify
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { adminUser = "Aoife Ryan (Partner)", notes } = body;

    const updatedDoc = await documentService.verifyDocument(id, adminUser, notes);

    return NextResponse.json({ success: true, data: updatedDoc });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify document" },
      { status: 500 }
    );
  }
}

