import { NextRequest, NextResponse } from "next/server";

// Get single POD by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "POD ID is required" },
        { status: 400 }
      );
    }

    // In production, fetch from database
    // Mock data for now
    const mockPod = {
      id,
      shipmentId: "SHP-2024-001",
      status: "verified",
      recipientName: "John Doe",
      recipientPhone: "+91 98765 43210",
      deliveryNotes: "Left at reception",
      verifiedAt: new Date().toISOString(),
      verification: {
        signatureDetected: true,
        confidence: 0.95,
        imageQuality: "good",
        readableText: "Received in good condition",
      },
      blockchain: {
        network: "polygon-mumbai",
        transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        blockNumber: 40123456,
        podId: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab",
        explorerUrl: "https://mumbai.polygonscan.com/tx/0x1234...",
      },
      payment: {
        id: "pay_abc123xyz",
        status: "completed",
        amount: 15000,
        currency: "INR",
        method: "UPI",
        upiId: "driver@upi",
        processedAt: new Date().toISOString(),
        utr: "UTR123456789",
      },
      location: {
        latitude: 19.076,
        longitude: 72.8777,
        address: "Mumbai, Maharashtra, India",
      },
      imageUrl: "/pod-images/pod_001.jpg",
      imageHash: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      pod: mockPod,
    });
  } catch (error) {
    console.error("POD fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch POD" },
      { status: 500 }
    );
  }
}

// Update POD status or details
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, deliveryNotes, adminNotes } = body;

    if (!id) {
      return NextResponse.json(
        { error: "POD ID is required" },
        { status: 400 }
      );
    }

    // In production, update database
    // Mock response for now
    return NextResponse.json({
      success: true,
      pod: {
        id,
        status: status || "verified",
        deliveryNotes: deliveryNotes || null,
        adminNotes: adminNotes || null,
        updatedAt: new Date().toISOString(),
      },
      message: "POD updated successfully",
    });
  } catch (error) {
    console.error("POD update error:", error);
    return NextResponse.json(
      { error: "Failed to update POD" },
      { status: 500 }
    );
  }
}

// Delete/Archive POD
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "POD ID is required" },
        { status: 400 }
      );
    }

    // In production, soft delete or archive in database
    // Note: Blockchain record is immutable and cannot be deleted

    return NextResponse.json({
      success: true,
      message: "POD archived successfully",
      note: "Blockchain record remains immutable",
      id,
      archivedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("POD delete error:", error);
    return NextResponse.json(
      { error: "Failed to archive POD" },
      { status: 500 }
    );
  }
}
