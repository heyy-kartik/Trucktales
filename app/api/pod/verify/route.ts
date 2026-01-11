import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import crypto from "crypto";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const shipmentId = formData.get("shipmentId") as string;
    const recipientName = formData.get("recipientName") as string;
    const recipientPhone = formData.get("recipientPhone") as string;
    const deliveryNotes = formData.get("deliveryNotes") as string;

    if (!image || !shipmentId) {
      return NextResponse.json(
        { error: "Image and shipment ID are required" },
        { status: 400 }
      );
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    // Generate image hash for blockchain
    const imageHash = crypto.createHash("sha256").update(buffer).digest("hex");

    // Use Gemini Vision to verify signature
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze this delivery proof image and determine:
1. Is there a signature visible in the image? (yes/no)
2. What is your confidence level that this is a valid delivery receipt with a signature? (0-100)
3. Can you read any text or details from the receipt?
4. Is the image clear enough for verification purposes?

Respond in JSON format:
{
  "signatureDetected": boolean,
  "confidence": number (0-100),
  "readableText": string or null,
  "imageQuality": "good" | "acceptable" | "poor",
  "notes": string
}`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: image.type,
          data: base64Image,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // Parse AI response
    let aiResult;
    try {
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch {
      // Fallback if parsing fails
      aiResult = {
        signatureDetected: text.toLowerCase().includes("yes") || text.toLowerCase().includes("signature"),
        confidence: 75,
        readableText: null,
        imageQuality: "acceptable",
        notes: "AI response parsing fallback",
      };
    }

    // Normalize confidence to 0-1 scale
    const normalizedConfidence = aiResult.confidence / 100;

    return NextResponse.json({
      success: true,
      verification: {
        signatureDetected: aiResult.signatureDetected,
        confidence: normalizedConfidence,
        imageQuality: aiResult.imageQuality,
        readableText: aiResult.readableText,
        notes: aiResult.notes,
      },
      metadata: {
        shipmentId,
        recipientName,
        recipientPhone,
        deliveryNotes,
        imageHash,
        verifiedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("POD verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify POD" },
      { status: 500 }
    );
  }
}
