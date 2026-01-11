import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      shipmentId,
      podId,
      amount, // Amount in paise (INR * 100)
      driverId,
      driverName,
      driverUpiId,
      driverBankAccount,
      driverIfsc,
      paymentMethod = "upi", // upi or bank_transfer
    } = body;

    if (!shipmentId || !podId || !amount || !driverId) {
      return NextResponse.json(
        { error: "Missing required payment parameters" },
        { status: 400 }
      );
    }

    // Generate unique transfer ID
    const transferId = `pod_${shipmentId}_${Date.now()}`;

    // Create payout based on payment method
    if (paymentMethod === "upi" && driverUpiId) {
      // Create UPI payout
      const payout = await razorpay.payouts.create({
        account_number: process.env.RAZORPAY_ACCOUNT_NUMBER || "",
        fund_account: {
          account_type: "vpa",
          vpa: {
            address: driverUpiId,
          },
          contact: {
            name: driverName,
            type: "employee",
            reference_id: driverId,
          },
        },
        amount: amount,
        currency: "INR",
        mode: "UPI",
        purpose: "payout",
        queue_if_low_balance: true,
        reference_id: transferId,
        narration: `POD Payment - ${shipmentId}`,
      });

      return NextResponse.json({
        success: true,
        payment: {
          id: payout.id,
          status: payout.status,
          amount: amount / 100, // Convert back to INR
          currency: "INR",
          method: "UPI",
          upiId: driverUpiId,
          transferId,
          createdAt: new Date().toISOString(),
          estimatedArrival: "60 seconds",
        },
        metadata: {
          shipmentId,
          podId,
          driverId,
          driverName,
        },
      });
    } else if (driverBankAccount && driverIfsc) {
      // Create bank transfer payout
      const payout = await razorpay.payouts.create({
        account_number: process.env.RAZORPAY_ACCOUNT_NUMBER || "",
        fund_account: {
          account_type: "bank_account",
          bank_account: {
            name: driverName,
            ifsc: driverIfsc,
            account_number: driverBankAccount,
          },
          contact: {
            name: driverName,
            type: "employee",
            reference_id: driverId,
          },
        },
        amount: amount,
        currency: "INR",
        mode: "IMPS",
        purpose: "payout",
        queue_if_low_balance: true,
        reference_id: transferId,
        narration: `POD Payment - ${shipmentId}`,
      });

      return NextResponse.json({
        success: true,
        payment: {
          id: payout.id,
          status: payout.status,
          amount: amount / 100,
          currency: "INR",
          method: "IMPS",
          bankAccount: driverBankAccount.slice(-4).padStart(driverBankAccount.length, "*"),
          transferId,
          createdAt: new Date().toISOString(),
          estimatedArrival: "2-4 hours",
        },
        metadata: {
          shipmentId,
          podId,
          driverId,
          driverName,
        },
      });
    } else {
      // Mock payment for development without Razorpay credentials
      const mockPaymentId = `pay_${crypto.randomBytes(12).toString("hex")}`;

      return NextResponse.json({
        success: true,
        payment: {
          id: mockPaymentId,
          status: "processing",
          amount: amount / 100,
          currency: "INR",
          method: paymentMethod.toUpperCase(),
          transferId,
          createdAt: new Date().toISOString(),
          estimatedArrival: paymentMethod === "upi" ? "60 seconds" : "2-4 hours",
          mock: true,
        },
        metadata: {
          shipmentId,
          podId,
          driverId,
          driverName,
        },
      });
    }
  } catch (error) {
    console.error("Payment processing error:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("paymentId");
    const transferId = searchParams.get("transferId");

    if (!paymentId && !transferId) {
      return NextResponse.json(
        { error: "Payment ID or Transfer ID is required" },
        { status: 400 }
      );
    }

    if (!process.env.RAZORPAY_KEY_ID) {
      // Return mock status for development
      return NextResponse.json({
        success: true,
        payment: {
          id: paymentId || transferId,
          status: "processed",
          processedAt: new Date().toISOString(),
          mock: true,
        },
      });
    }

    // Fetch payout status from Razorpay
    const payout = await razorpay.payouts.fetch(paymentId || "");

    return NextResponse.json({
      success: true,
      payment: {
        id: payout.id,
        status: payout.status,
        amount: payout.amount / 100,
        currency: payout.currency,
        processedAt: payout.processed_at
          ? new Date(payout.processed_at * 1000).toISOString()
          : null,
        utr: payout.utr,
        failureReason: payout.failure_reason,
      },
    });
  } catch (error) {
    console.error("Payment status fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment status" },
      { status: 500 }
    );
  }
}
