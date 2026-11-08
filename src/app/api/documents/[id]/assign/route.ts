import { NextRequest, NextResponse } from "next/server";
import { documentService } from "@/services/documentService";

// POST /api/documents/[id]/assign
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { customerId, adminUser = "Practice Staff", notes } = body;

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: "customerId is required" },
        { status: 400 }
      );
    }

    const updatedDoc = await documentService.assignCustomer(id, customerId, adminUser, notes);

    return NextResponse.json({ success: true, data: updatedDoc });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to assign document" },
      { status: 500 }
    );
  }
}

