import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface ExtractedData {
  highway?: string;
  kilometer?: number;
  issue?: string;
  eta?: string;
  severity?: "low" | "medium" | "high";
}

// Geocode with Mapbox
async function geocodeLocation(highway: string, kilometer: number) {
  const query = `${highway} km ${kilometer}`;
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query
    )}.json?access_token=${process.env.MAPBOX_SECRET_TOKEN}`
  );

  if (!response.ok) {
    throw new Error("Geocoding failed");
  }

  const data = await response.json();
  if (data.features && data.features.length > 0) {
    const [longitude, latitude] = data.features[0].center;
    return { latitude, longitude };
  }

  return null;
}

// Extract information using Gemini
async function extractInfoWithGemini(transcript: string): Promise<ExtractedData> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Extract the following information from this highway incident report:
- Highway name/number
- Kilometer marker
- Issue/problem description
- ETA (estimated time of arrival or resolution time)
- Severity level (low, medium, or high)

Transcript: "${transcript}"

Respond in JSON format with keys: highway, kilometer, issue, eta, severity
If any field is not mentioned, use null. For severity, assess based on the issue description.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const extracted = JSON.parse(jsonMatch[0]);
      return {
        highway: extracted.highway || undefined,
        kilometer: extracted.kilometer ? parseFloat(extracted.kilometer) : undefined,
        issue: extracted.issue || undefined,
        eta: extracted.eta || undefined,
        severity: extracted.severity || "medium",
      };
    }
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
  }

  return { severity: "medium" };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { audioUrl, audioBase64, text } = body;

    let transcript = text;

    // If audio is provided, transcribe it with Whisper
    if (audioUrl || audioBase64) {
      try {
        let audioData;
        
        if (audioBase64) {
          // Handle base64 audio
          const buffer = Buffer.from(audioBase64, 'base64');
          audioData = new File([buffer], "audio.wav", { type: "audio/wav" });
        } else if (audioUrl) {
          // Fetch audio from URL
          const audioResponse = await fetch(audioUrl);
          const audioBlob = await audioResponse.blob();
          audioData = new File([audioBlob], "audio.wav", { type: "audio/wav" });
        }

        if (audioData) {
          const transcription = await openai.audio.transcriptions.create({
            file: audioData,
            model: "whisper-1",
          });
          transcript = transcription.text;
        }
      } catch (error) {
        console.error("Whisper transcription failed:", error);
        return NextResponse.json(
          { error: "Failed to transcribe audio" },
          { status: 500 }
        );
      }
    }

    if (!transcript) {
      return NextResponse.json(
        { error: "No text or audio provided" },
        { status: 400 }
      );
    }

    // Extract information using Gemini
    const extractedData = await extractInfoWithGemini(transcript);

    // Geocode if we have highway and kilometer
    let coordinates = null;
    if (extractedData.highway && extractedData.kilometer) {
      try {
        coordinates = await geocodeLocation(
          extractedData.highway,
          extractedData.kilometer
        );
      } catch (error) {
        console.error("Geocoding failed:", error);
      }
    }

    // Prepare response data
    const incidentData = {
      ...extractedData,
      latitude: coordinates?.latitude,
      longitude: coordinates?.longitude,
      audioTranscript: transcript,
      timestamp: new Date().toISOString(),
    };

    // Store in Convex (client will handle this via mutation)
    // Here we just return the processed data
    return NextResponse.json({
      success: true,
      data: incidentData,
    });
  } catch (error) {
    console.error("Error processing tale:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
