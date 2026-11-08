import { NextRequest, NextResponse } from "next/server";
import { documentService } from "@/services/documentService";

// POST /api/documents/[id]/review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action = "note", note, reason, adminUser = "Practice Staff" } = body;

    let updatedDoc;
    if (action === "reject") {
      if (!reason) {
        return NextResponse.json(
          { success: false, error: "Reason is required for rejection" },
          { status: 400 }
        );
      }
      updatedDoc = await documentService.rejectDocument(id, reason, adminUser);
    } else {
      if (!note) {
        return NextResponse.json(
          { success: false, error: "Note is required" },
          { status: 400 }
        );
      }
      updatedDoc = await documentService.addReviewNote(id, note, adminUser);
    }

    return NextResponse.json({ success: true, data: updatedDoc });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process review" },
      { status: 500 }
    );
  }
}

