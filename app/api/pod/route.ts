import { NextRequest, NextResponse } from "next/server";

// Combined POD submission endpoint - handles the complete flow
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const shipmentId = formData.get("shipmentId") as string;
    const recipientName = formData.get("recipientName") as string;
    const recipientPhone = formData.get("recipientPhone") as string;
    const deliveryNotes = formData.get("deliveryNotes") as string;
    const driverId = formData.get("driverId") as string;
    const driverName = formData.get("driverName") as string;
    const driverUpiId = formData.get("driverUpiId") as string;
    const paymentAmount = formData.get("paymentAmount") as string;
    const latitude = formData.get("latitude") as string;
    const longitude = formData.get("longitude") as string;

    if (!image || !shipmentId) {
      return NextResponse.json(
        { error: "Image and shipment ID are required" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Step 1: Verify POD with AI
    const verifyFormData = new FormData();
    verifyFormData.append("image", image);
    verifyFormData.append("shipmentId", shipmentId);
    verifyFormData.append("recipientName", recipientName || "");
    verifyFormData.append("recipientPhone", recipientPhone || "");
    verifyFormData.append("deliveryNotes", deliveryNotes || "");

    const verifyResponse = await fetch(`${baseUrl}/api/pod/verify`, {
      method: "POST",
      body: verifyFormData,
    });

    const verifyResult = await verifyResponse.json();

    if (!verifyResponse.ok || !verifyResult.success) {
      return NextResponse.json(
        {
          error: "POD verification failed",
          details: verifyResult.error,
          step: "verification",
        },
        { status: 400 }
      );
    }

    // Check if signature was detected with sufficient confidence
    if (
      !verifyResult.verification.signatureDetected ||
      verifyResult.verification.confidence < 0.6
    ) {
      return NextResponse.json(
        {
          error: "Signature verification failed",
          details: "No valid signature detected or confidence too low",
          verification: verifyResult.verification,
          step: "signature_check",
        },
        { status: 400 }
      );
    }

    // Step 2: Register on blockchain
    const blockchainResponse = await fetch(`${baseUrl}/api/pod/blockchain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shipmentId,
        imageHash: verifyResult.metadata.imageHash,
        metadata: {
          recipientName,
          recipientPhone,
          deliveryNotes,
          latitude: latitude || null,
          longitude: longitude || null,
        },
        verificationData: verifyResult.verification,
      }),
    });

    const blockchainResult = await blockchainResponse.json();

    if (!blockchainResponse.ok || !blockchainResult.success) {
      return NextResponse.json(
        {
          error: "Blockchain registration failed",
          details: blockchainResult.error,
          step: "blockchain",
          verification: verifyResult.verification,
        },
        { status: 500 }
      );
    }

    // Step 3: Trigger payment if UPI ID provided
    let paymentResult = null;
    if (driverUpiId && paymentAmount) {
      const paymentResponse = await fetch(`${baseUrl}/api/pod/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shipmentId,
          podId: blockchainResult.blockchain.podId,
          amount: Math.round(parseFloat(paymentAmount) * 100), // Convert to paise
          driverId: driverId || "unknown",
          driverName: driverName || "Driver",
          driverUpiId,
          paymentMethod: "upi",
        }),
      });

      paymentResult = await paymentResponse.json();

      if (!paymentResponse.ok || !paymentResult.success) {
        // Payment failed but POD is already registered - return partial success
        return NextResponse.json({
          success: true,
          partial: true,
          message: "POD verified and registered, but payment failed",
          verification: verifyResult.verification,
          blockchain: blockchainResult.blockchain,
          payment: {
            error: paymentResult.error,
            status: "failed",
          },
        });
      }
    }

    // Success - return complete result
    return NextResponse.json({
      success: true,
      message: "POD successfully verified, registered, and payment initiated",
      verification: verifyResult.verification,
      blockchain: blockchainResult.blockchain,
      payment: paymentResult?.payment || null,
      metadata: {
        shipmentId,
        imageHash: verifyResult.metadata.imageHash,
        verifiedAt: verifyResult.metadata.verifiedAt,
        recipientName,
        location: latitude && longitude ? { latitude, longitude } : null,
      },
    });
  } catch (error) {
    console.error("POD submission error:", error);
    return NextResponse.json(
      { error: "Failed to process POD submission" },
      { status: 500 }
    );
  }
}

// GET endpoint to list all PODs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const shipmentId = searchParams.get("shipmentId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // In production, this would query the database
    // For now, return mock data structure
    const mockPods = [
      {
        id: "pod_001",
        shipmentId: "SHP-2024-001",
        status: "verified",
        recipientName: "John Doe",
        verifiedAt: new Date().toISOString(),
        confidence: 0.95,
        blockchainHash: "0x1234...5678",
        paymentStatus: "completed",
        paymentAmount: 15000,
      },
      {
        id: "pod_002",
        shipmentId: "SHP-2024-002",
        status: "pending",
        recipientName: "Jane Smith",
        verifiedAt: new Date().toISOString(),
        confidence: 0.78,
        blockchainHash: "0x8765...4321",
        paymentStatus: "processing",
        paymentAmount: 22500,
      },
    ];

    // Apply filters
    let filteredPods = [...mockPods];
    if (status) {
      filteredPods = filteredPods.filter((pod) => pod.status === status);
    }
    if (shipmentId) {
      filteredPods = filteredPods.filter((pod) =>
        pod.shipmentId.includes(shipmentId)
      );
    }

    // Pagination
    const total = filteredPods.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedPods = filteredPods.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      pods: paginatedPods,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: {
        status,
        shipmentId,
        startDate,
        endDate,
      },
    });
  } catch (error) {
    console.error("POD list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch POD list" },
      { status: 500 }
    );
  }
}
