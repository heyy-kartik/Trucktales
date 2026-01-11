"use client";

import { useState, useRef, useCallback } from "react";
import {
  Camera,
  Upload,
  X,
  CheckCircle,
  Loader2,
  MapPin,
  User,
  Phone,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type VerificationStep =
  | "idle"
  | "uploading"
  | "ai-verifying"
  | "blockchain"
  | "payment"
  | "complete";

interface VerificationResult {
  signatureDetected: boolean;
  confidence: number;
  blockchainTxHash?: string;
  paymentStatus?: string;
  paymentId?: string;
}

export function PODCapture() {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [step, setStep] = useState<VerificationStep>("idle");
  const [progress, setProgress] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Form fields
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [shipmentId, setShipmentId] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setShowCamera(true);
    } catch (error) {
      console.error("Camera error:", error);
      toast.error("Could not access camera. Please check permissions.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setImage(dataUrl);

        // Convert to file
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], `pod-${Date.now()}.jpg`, {
                type: "image/jpeg",
              });
              setImageFile(file);
            }
          },
          "image/jpeg",
          0.8
        );

        stopCamera();
      }
    }
  }, [stopCamera]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const clearImage = useCallback(() => {
    setImage(null);
    setImageFile(null);
    setStep("idle");
    setProgress(0);
    setVerificationResult(null);
  }, []);

  const simulateVerification = useCallback(async () => {
    if (!image || !shipmentId) {
      toast.error("Please capture a POD image and enter shipment ID");
      return;
    }

    // Step 1: Uploading
    setStep("uploading");
    setProgress(10);
    await new Promise((r) => setTimeout(r, 1000));
    setProgress(25);

    // Step 2: AI Verification
    setStep("ai-verifying");
    setProgress(40);
    await new Promise((r) => setTimeout(r, 2000));

    // Simulate AI result (in real app, call /api/pod/verify)
    const aiResult = {
      signatureDetected: Math.random() > 0.2, // 80% success rate for demo
      confidence: 0.85 + Math.random() * 0.15,
    };
    setProgress(55);

    if (!aiResult.signatureDetected) {
      setStep("idle");
      setProgress(0);
      toast.error("Signature not detected. Please capture a clearer image.");
      return;
    }

    // Step 3: Blockchain
    setStep("blockchain");
    setProgress(70);
    await new Promise((r) => setTimeout(r, 2000));
    setProgress(85);

    // Simulate blockchain hash
    const txHash = `0x${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")}`;

    // Step 4: Payment
    setStep("payment");
    setProgress(95);
    await new Promise((r) => setTimeout(r, 1500));

    // Complete
    setStep("complete");
    setProgress(100);

    const result: VerificationResult = {
      signatureDetected: true,
      confidence: aiResult.confidence,
      blockchainTxHash: txHash,
      paymentStatus: "SUCCESS",
      paymentId: `PAY-${Date.now()}`,
    };

    setVerificationResult(result);
    setShowSuccessDialog(true);
    toast.success("POD verified and payment initiated!");
  }, [image, shipmentId]);

  const getStepLabel = () => {
    switch (step) {
      case "uploading":
        return "Uploading image...";
      case "ai-verifying":
        return "AI verifying signature...";
      case "blockchain":
        return "Recording on blockchain...";
      case "payment":
        return "Initiating UPI payment...";
      case "complete":
        return "Complete!";
      default:
        return "Ready to capture";
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Left: Camera/Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="font-mono">Capture Delivery Proof</CardTitle>
          <CardDescription>
            Take a photo of the signed delivery receipt
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!image && !showCamera && (
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                Capture or upload POD image
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={startCamera}
                  variant="default"
                  className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Open Camera
                </Button>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          )}

          {showCamera && (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg"
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <Button
                  onClick={capturePhoto}
                  className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Capture
                </Button>
                <Button onClick={stopCamera} variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {image && (
            <div className="relative">
              <img
                src={image}
                alt="POD Preview"
                className="w-full rounded-lg"
              />
              <Button
                onClick={clearImage}
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>

              {step !== "idle" && step !== "complete" && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p className="font-mono">{getStepLabel()}</p>
                  </div>
                </div>
              )}

              {step === "complete" && (
                <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
              )}
            </div>
          )}

          {/* Progress Bar */}
          {step !== "idle" && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-mono">{getStepLabel()}</span>
                <span className="font-mono">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right: Form Section */}
      <Card>
        <CardHeader>
          <CardTitle className="font-mono">Delivery Details</CardTitle>
          <CardDescription>
            Enter recipient and shipment information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shipmentId" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Shipment ID *
            </Label>
            <Input
              id="shipmentId"
              placeholder="Enter shipment ID"
              value={shipmentId}
              onChange={(e) => setShipmentId(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipientName" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Recipient Name
            </Label>
            <Input
              id="recipientName"
              placeholder="Enter recipient name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipientPhone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Recipient Phone
            </Label>
            <Input
              id="recipientPhone"
              placeholder="+91 XXXXX XXXXX"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Delivery Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Any special notes about the delivery..."
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Button
            onClick={simulateVerification}
            disabled={!image || !shipmentId || step !== "idle"}
            className="w-full bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 font-mono"
          >
            {step === "idle" ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Verify & Process Payment
              </>
            ) : (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            )}
          </Button>

          {/* Info Box */}
          <div className="bg-muted rounded-lg p-4 text-sm">
            <h4 className="font-semibold mb-2">How it works:</h4>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Capture signed POD photo</li>
              <li>AI verifies signature presence</li>
              <li>Hash stored on Polygon blockchain</li>
              <li>UPI payment triggered automatically</li>
              <li>Driver receives ₹ in 60 seconds!</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              POD Verified Successfully!
            </DialogTitle>
            <DialogDescription>
              Your delivery has been verified and payment has been initiated.
            </DialogDescription>
          </DialogHeader>

          {verificationResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">
                    Signature Confidence
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {(verificationResult.confidence * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">
                    Payment Status
                  </p>
                  <Badge className="bg-green-500">
                    {verificationResult.paymentStatus}
                  </Badge>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">
                  Blockchain Transaction
                </p>
                <code className="text-xs break-all">
                  {verificationResult.blockchainTxHash}
                </code>
                <Button
                  variant="link"
                  className="text-xs p-0 h-auto mt-1"
                  onClick={() =>
                    window.open(
                      `https://mumbai.polygonscan.com/tx/${verificationResult.blockchainTxHash}`,
                      "_blank"
                    )
                  }
                >
                  View on Polygonscan →
                </Button>
              </div>

              <Button
                onClick={() => {
                  setShowSuccessDialog(false);
                  clearImage();
                  setShipmentId("");
                  setRecipientName("");
                  setRecipientPhone("");
                  setDeliveryNotes("");
                }}
                className="w-full bg-[#FF6B2C] hover:bg-[#FF6B2C]/90"
              >
                Capture Next POD
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
