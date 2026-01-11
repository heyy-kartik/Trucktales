import { ethers } from "ethers";
import { createHash } from "crypto";

// POD Registry Contract ABI
export const POD_REGISTRY_ABI = [
  // Events
  "event PODRegistered(bytes32 indexed podId, string shipmentId, string imageHash, uint256 timestamp, address registrar)",
  "event PODVerified(bytes32 indexed podId, bool verified, uint256 confidence)",

  // Functions
  "function registerPOD(string shipmentId, string imageHash, uint256 timestamp, string metadata) returns (bytes32)",
  "function getPOD(bytes32 podId) view returns (string shipmentId, string imageHash, uint256 timestamp, string metadata, address registrar, bool verified)",
  "function verifyPOD(bytes32 podId, bool verified, uint256 confidence) returns (bool)",
  "function getPODCount() view returns (uint256)",
  "function getAllPODs() view returns (bytes32[])",
];

// Generate a deterministic POD ID from shipment data
export function generatePodId(
  shipmentId: string,
  imageHash: string,
  timestamp: number
): string {
  return ethers.id(`${shipmentId}-${imageHash}-${timestamp}`);
}

// Get provider for Polygon Mumbai
export function getProvider() {
  const rpcUrl =
    process.env.POLYGON_RPC_URL || "https://rpc-mumbai.maticvigil.com";
  return new ethers.JsonRpcProvider(rpcUrl);
}

// Get signer for transactions
export function getSigner() {
  const provider = getProvider();
  const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error("BLOCKCHAIN_PRIVATE_KEY not configured");
  }

  return new ethers.Wallet(privateKey, provider);
}

// Get contract instance (read-only)
export function getReadOnlyContract() {
  const contractAddress = process.env.POD_REGISTRY_CONTRACT;

  if (!contractAddress) {
    throw new Error("POD_REGISTRY_CONTRACT not configured");
  }

  const provider = getProvider();
  return new ethers.Contract(contractAddress, POD_REGISTRY_ABI, provider);
}

// Get contract instance (with signer for write operations)
export function getWritableContract() {
  const contractAddress = process.env.POD_REGISTRY_CONTRACT;

  if (!contractAddress) {
    throw new Error("POD_REGISTRY_CONTRACT not configured");
  }

  const signer = getSigner();
  return new ethers.Contract(contractAddress, POD_REGISTRY_ABI, signer);
}

// Format transaction hash for display
export function formatTxHash(hash: string, length: number = 8): string {
  if (hash.length <= length * 2 + 2) return hash;
  return `${hash.slice(0, length + 2)}...${hash.slice(-length)}`;
}

// Get explorer URL for a transaction
export function getExplorerUrl(
  txHash: string,
  network: "mumbai" | "polygon" = "mumbai"
): string {
  const baseUrl =
    network === "mumbai"
      ? "https://mumbai.polygonscan.com"
      : "https://polygonscan.com";
  return `${baseUrl}/tx/${txHash}`;
}

// Verify if a transaction was successful
export async function verifyTransaction(
  txHash: string
): Promise<{
  success: boolean;
  blockNumber?: number;
  gasUsed?: string;
  error?: string;
}> {
  try {
    const provider = getProvider();
    const receipt = await provider.getTransactionReceipt(txHash);

    if (!receipt) {
      return { success: false, error: "Transaction not found" };
    }

    return {
      success: receipt.status === 1,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Calculate image hash from buffer
export function calculateImageHash(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

// Parse metadata from blockchain
export function parseMetadata(metadataJson: string): Record<string, unknown> {
  try {
    return JSON.parse(metadataJson);
  } catch {
    return {};
  }
}
