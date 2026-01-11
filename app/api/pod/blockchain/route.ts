import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";

// Simple POD Registry ABI
const POD_REGISTRY_ABI = [
  "function registerPOD(string shipmentId, string imageHash, uint256 timestamp, string metadata) returns (bytes32)",
  "function getPOD(bytes32 podId) view returns (string shipmentId, string imageHash, uint256 timestamp, string metadata, address registrar)",
  "event PODRegistered(bytes32 indexed podId, string shipmentId, string imageHash, uint256 timestamp)",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shipmentId, imageHash, metadata, verificationData } = body;

    if (!shipmentId || !imageHash) {
      return NextResponse.json(
        { error: "Shipment ID and image hash are required" },
        { status: 400 }
      );
    }

    // Initialize provider for Polygon Mumbai testnet
    const provider = new ethers.JsonRpcProvider(
      process.env.POLYGON_RPC_URL || "https://rpc-mumbai.maticvigil.com"
    );

    // Use a wallet for signing transactions
    const wallet = new ethers.Wallet(
      process.env.BLOCKCHAIN_PRIVATE_KEY || "",
      provider
    );

    // Contract address (deploy your own or use existing)
    const contractAddress = process.env.POD_REGISTRY_CONTRACT || "";

    if (!contractAddress) {
      // If no contract deployed, generate mock blockchain data
      const mockTxHash = `0x${Buffer.from(
        `${shipmentId}-${imageHash}-${Date.now()}`
      )
        .toString("hex")
        .slice(0, 64)}`;

      const mockBlockNumber = Math.floor(Math.random() * 1000000) + 40000000;
      const mockPodId = ethers.id(`${shipmentId}-${imageHash}-${Date.now()}`);

      return NextResponse.json({
        success: true,
        blockchain: {
          network: "polygon-mumbai",
          transactionHash: mockTxHash,
          blockNumber: mockBlockNumber,
          podId: mockPodId,
          timestamp: Date.now(),
          explorerUrl: `https://mumbai.polygonscan.com/tx/${mockTxHash}`,
        },
        data: {
          shipmentId,
          imageHash,
          metadata,
          verificationData,
        },
      });
    }

    // Connect to contract
    const contract = new ethers.Contract(
      contractAddress,
      POD_REGISTRY_ABI,
      wallet
    );

    // Prepare metadata JSON
    const metadataJson = JSON.stringify({
      ...metadata,
      verification: verificationData,
      registeredAt: new Date().toISOString(),
    });

    // Register POD on blockchain
    const tx = await contract.registerPOD(
      shipmentId,
      imageHash,
      Math.floor(Date.now() / 1000),
      metadataJson
    );

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    // Get POD ID from event
    const event = receipt.logs.find(
      (log: ethers.Log) =>
        log.topics[0] === ethers.id("PODRegistered(bytes32,string,string,uint256)")
    );
    const podId = event?.topics[1] || ethers.id(`${shipmentId}-${imageHash}`);

    return NextResponse.json({
      success: true,
      blockchain: {
        network: "polygon-mumbai",
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        podId,
        timestamp: Date.now(),
        explorerUrl: `https://mumbai.polygonscan.com/tx/${receipt.hash}`,
      },
      data: {
        shipmentId,
        imageHash,
        metadata,
        verificationData,
      },
    });
  } catch (error) {
    console.error("Blockchain registration error:", error);
    return NextResponse.json(
      { error: "Failed to register POD on blockchain" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const podId = searchParams.get("podId");
    const shipmentId = searchParams.get("shipmentId");

    if (!podId && !shipmentId) {
      return NextResponse.json(
        { error: "POD ID or Shipment ID is required" },
        { status: 400 }
      );
    }

    // Initialize provider
    const provider = new ethers.JsonRpcProvider(
      process.env.POLYGON_RPC_URL || "https://rpc-mumbai.maticvigil.com"
    );

    const contractAddress = process.env.POD_REGISTRY_CONTRACT || "";

    if (!contractAddress) {
      // Return mock data if no contract
      return NextResponse.json({
        success: true,
        pod: {
          podId: podId || ethers.id(shipmentId || ""),
          shipmentId: shipmentId || "UNKNOWN",
          imageHash: "mock-hash",
          timestamp: Date.now(),
          metadata: {},
          registrar: "0x0000000000000000000000000000000000000000",
        },
      });
    }

    const contract = new ethers.Contract(
      contractAddress,
      POD_REGISTRY_ABI,
      provider
    );

    const [storedShipmentId, imageHash, timestamp, metadata, registrar] =
      await contract.getPOD(podId);

    return NextResponse.json({
      success: true,
      pod: {
        podId,
        shipmentId: storedShipmentId,
        imageHash,
        timestamp: Number(timestamp) * 1000,
        metadata: JSON.parse(metadata || "{}"),
        registrar,
      },
    });
  } catch (error) {
    console.error("Blockchain fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch POD from blockchain" },
      { status: 500 }
    );
  }
}
