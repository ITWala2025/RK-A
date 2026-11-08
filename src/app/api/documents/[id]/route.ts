import { NextRequest, NextResponse } from "next/server";
import { documentService } from "@/services/documentService";

// GET /api/documents/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doc = await documentService.getDocumentById(id);

    if (!doc) {
      return NextResponse.json(
        { success: false, error: `Document ${id} not found` },
        { status: 404 }
      );
    }

    const auditTrail = documentService.getAuditTrail(id);

    return NextResponse.json({
      success: true,
      data: {
        ...doc,
        auditTrail,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch document" },
      { status: 500 }
    );
  }
}

