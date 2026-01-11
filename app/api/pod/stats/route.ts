import { NextRequest, NextResponse } from "next/server";

// POD Analytics and Statistics API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "7d"; // 7d, 30d, 90d, 1y

    // Calculate date range
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // In production, aggregate from database
    // Mock statistics data
    const stats = {
      overview: {
        totalPods: 12847,
        verifiedPods: 12234,
        pendingPods: 423,
        rejectedPods: 190,
        verificationRate: 95.2,
        averageConfidence: 0.923,
        totalPaymentsProcessed: 287456000, // in paise
        averagePaymentTime: 47, // seconds
      },
      trends: {
        podsToday: 156,
        podsYesterday: 142,
        changePercent: 9.86,
        weekOverWeek: 12.5,
        monthOverMonth: 23.4,
      },
      dailyData: generateDailyData(period),
      verificationBreakdown: {
        highConfidence: 8234, // > 90%
        mediumConfidence: 3456, // 70-90%
        lowConfidence: 544, // 50-70%
        failed: 613, // < 50%
      },
      paymentStats: {
        upiPayments: 11234,
        bankTransfers: 1613,
        averageAmount: 22350, // paise
        totalVolume: 287456000, // paise
        successRate: 99.2,
        averageSettlementTime: 47, // seconds for UPI
      },
      blockchainStats: {
        totalRegistered: 12847,
        networkFees: 234500, // MATIC in wei
        averageBlockTime: 2.1, // seconds
        contractCalls: 25694,
      },
      topRoutes: [
        { route: "Mumbai → Delhi", pods: 2341, revenue: 52300000 },
        { route: "Bangalore → Chennai", pods: 1876, revenue: 42100000 },
        { route: "Kolkata → Hyderabad", pods: 1234, revenue: 27600000 },
        { route: "Pune → Ahmedabad", pods: 987, revenue: 22100000 },
        { route: "Jaipur → Lucknow", pods: 756, revenue: 16900000 },
      ],
      recentActivity: [
        {
          id: "act_001",
          type: "pod_verified",
          shipmentId: "SHP-2024-12847",
          confidence: 0.97,
          timestamp: new Date(Date.now() - 120000).toISOString(),
        },
        {
          id: "act_002",
          type: "payment_completed",
          shipmentId: "SHP-2024-12846",
          amount: 15000,
          timestamp: new Date(Date.now() - 300000).toISOString(),
        },
        {
          id: "act_003",
          type: "blockchain_registered",
          shipmentId: "SHP-2024-12845",
          txHash: "0x1234...5678",
          timestamp: new Date(Date.now() - 600000).toISOString(),
        },
      ],
    };

    return NextResponse.json({
      success: true,
      period,
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
      stats,
    });
  } catch (error) {
    console.error("POD stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch POD statistics" },
      { status: 500 }
    );
  }
}

// Helper function to generate daily data
function generateDailyData(period: string) {
  const days = period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 365;
  const data = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toISOString().split("T")[0],
      pods: Math.floor(Math.random() * 50) + 130,
      verified: Math.floor(Math.random() * 45) + 125,
      payments: Math.floor(Math.random() * 2000000) + 2800000,
      avgConfidence: (Math.random() * 0.1 + 0.88).toFixed(3),
    });
  }

  return data;
}
