"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock POD data
const mockPODs = [
  {
    id: "POD-001",
    shipmentId: "SHP-2026-001",
    driverName: "Rajesh Kumar",
    recipientName: "ABC Traders",
    capturedAt: "2026-01-11T10:30:00",
    verificationStatus: "FULLY_VERIFIED",
    signatureConfidence: 0.95,
    blockchainTxHash:
      "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
    paymentStatus: "COMPLETED",
    amount: 15000,
    imageUrl: "/api/placeholder/400/300",
  },
  {
    id: "POD-002",
    shipmentId: "SHP-2026-002",
    driverName: "Amit Singh",
    recipientName: "XYZ Industries",
    capturedAt: "2026-01-11T09:15:00",
    verificationStatus: "FULLY_VERIFIED",
    signatureConfidence: 0.88,
    blockchainTxHash:
      "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    paymentStatus: "COMPLETED",
    amount: 22500,
    imageUrl: "/api/placeholder/400/300",
  },
  {
    id: "POD-003",
    shipmentId: "SHP-2026-003",
    driverName: "Suresh Patel",
    recipientName: "Global Exports",
    capturedAt: "2026-01-11T08:45:00",
    verificationStatus: "AI_VERIFIED",
    signatureConfidence: 0.92,
    blockchainTxHash: null,
    paymentStatus: "PENDING",
    amount: 18000,
    imageUrl: "/api/placeholder/400/300",
  },
  {
    id: "POD-004",
    shipmentId: "SHP-2026-004",
    driverName: "Vikram Sharma",
    recipientName: "Metro Distributors",
    capturedAt: "2026-01-10T16:20:00",
    verificationStatus: "REJECTED",
    signatureConfidence: 0.35,
    blockchainTxHash: null,
    paymentStatus: "FAILED",
    amount: 12000,
    imageUrl: "/api/placeholder/400/300",
  },
  {
    id: "POD-005",
    shipmentId: "SHP-2026-005",
    driverName: "Ramesh Yadav",
    recipientName: "Star Logistics",
    capturedAt: "2026-01-10T14:00:00",
    verificationStatus: "FULLY_VERIFIED",
    signatureConfidence: 0.97,
    blockchainTxHash:
      "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b",
    paymentStatus: "COMPLETED",
    amount: 28500,
    imageUrl: "/api/placeholder/400/300",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "FULLY_VERIFIED":
      return (
        <Badge className="bg-green-500">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      );
    case "AI_VERIFIED":
      return (
        <Badge className="bg-blue-500">
          <Clock className="h-3 w-3 mr-1" />
          AI Verified
        </Badge>
      );
    case "PENDING":
      return (
        <Badge variant="secondary">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getPaymentBadge = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return <Badge className="bg-green-500">Paid</Badge>;
    case "PENDING":
      return <Badge variant="secondary">Pending</Badge>;
    case "PROCESSING":
      return <Badge className="bg-blue-500">Processing</Badge>;
    case "FAILED":
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function PODList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPOD, setSelectedPOD] = useState<(typeof mockPODs)[0] | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredPODs = mockPODs.filter((pod) => {
    const matchesSearch =
      pod.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pod.shipmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pod.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pod.recipientName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || pod.verificationStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPODs.length / itemsPerPage);
  const paginatedPODs = filteredPODs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="font-mono">POD Registry</CardTitle>
            <CardDescription>
              Blockchain-verified proof of deliveries
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search PODs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="FULLY_VERIFIED">Verified</SelectItem>
                <SelectItem value="AI_VERIFIED">AI Verified</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>POD ID</TableHead>
                <TableHead>Shipment</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Captured</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPODs.map((pod) => (
                <TableRow key={pod.id}>
                  <TableCell className="font-mono font-medium">
                    {pod.id}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {pod.shipmentId}
                  </TableCell>
                  <TableCell>{pod.driverName}</TableCell>
                  <TableCell>{pod.recipientName}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(pod.capturedAt).toLocaleString("en-IN", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(pod.verificationStatus)}
                  </TableCell>
                  <TableCell>{getPaymentBadge(pod.paymentStatus)}</TableCell>
                  <TableCell className="font-mono">
                    ₹{pod.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedPOD(pod)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {pod.blockchainTxHash && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          window.open(
                            `https://mumbai.polygonscan.com/tx/${pod.blockchainTxHash}`,
                            "_blank"
                          )
                        }
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredPODs.length)} of{" "}
            {filteredPODs.length} PODs
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>

      {/* POD Detail Dialog */}
      <Dialog open={!!selectedPOD} onOpenChange={() => setSelectedPOD(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-mono">
              POD Details - {selectedPOD?.id}
            </DialogTitle>
            <DialogDescription>
              Complete verification and payment details
            </DialogDescription>
          </DialogHeader>

          {selectedPOD && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: Image */}
              <div>
                <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
                  <span className="text-muted-foreground">POD Image</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    IPFS
                  </Button>
                </div>
              </div>

              {/* Right: Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Shipment ID</p>
                    <p className="font-mono font-medium">
                      {selectedPOD.shipmentId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Driver</p>
                    <p className="font-medium">{selectedPOD.driverName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Recipient</p>
                    <p className="font-medium">{selectedPOD.recipientName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Captured At</p>
                    <p className="font-medium text-sm">
                      {new Date(selectedPOD.capturedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Verification</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      {getStatusBadge(selectedPOD.verificationStatus)}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        AI Confidence
                      </p>
                      <p className="font-mono font-bold text-green-600">
                        {(selectedPOD.signatureConfidence * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                {selectedPOD.blockchainTxHash && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Blockchain</h4>
                    <div className="bg-muted rounded p-2">
                      <p className="text-xs text-muted-foreground mb-1">
                        Transaction Hash
                      </p>
                      <code className="text-xs break-all">
                        {selectedPOD.blockchainTxHash}
                      </code>
                    </div>
                    <Button
                      variant="link"
                      className="text-xs p-0 h-auto mt-1"
                      onClick={() =>
                        window.open(
                          `https://mumbai.polygonscan.com/tx/${selectedPOD.blockchainTxHash}`,
                          "_blank"
                        )
                      }
                    >
                      View on Polygonscan →
                    </Button>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Payment</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      {getPaymentBadge(selectedPOD.paymentStatus)}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <p className="font-mono font-bold text-xl">
                        ₹{selectedPOD.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
