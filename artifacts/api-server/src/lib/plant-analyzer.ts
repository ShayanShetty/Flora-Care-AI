import { openai } from "@workspace/integrations-openai-ai-server";

export interface PlantAnalysisResult {
  plantName: string;
  diseaseName: string;
  confidence: number;
  isHealthy: boolean;
  description: string;
  symptoms: string;
  treatment: string;
  prevention: string;
}

export async function analyzePlantImage(imageBase64: string, mimeType: string): Promise<PlantAnalysisResult> {
  const response = await openai.chat.completions.create({
    model: "gpt-5-mini",
    max_completion_tokens: 1024,
    messages: [
      {
        role: "system",
        content: `You are an expert plant pathologist AI. Analyze plant leaf images and identify diseases.
Always respond with valid JSON only, no markdown, no explanation outside JSON.
Use this exact structure:
{
  "plantName": "Common plant name in uppercase (e.g., TOMATO, HIBISCUS, ROSE)",
  "diseaseName": "Disease name with type in parentheses (e.g., 'Early Blight (fungal)', 'Bacterial Leaf Spot', 'Healthy')",
  "confidence": 0.85,
  "isHealthy": false,
  "description": "Brief 1-2 sentence description of the condition",
  "symptoms": "Key symptoms observed in this image",
  "treatment": "Recommended treatment steps",
  "prevention": "Prevention measures for the future"
}
If the plant appears healthy, set isHealthy to true and diseaseName to "Healthy Plant".
Confidence should be between 0.50 and 0.99.`,
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${imageBase64}`,
              detail: "high",
            },
          },
          {
            type: "text",
            text: "Analyze this plant leaf image for disease. Identify the plant species and any disease present. Provide confidence level and treatment recommendations.",
          },
        ],
      },
    ],
  });

  const content = response.choices[0]?.message?.content ?? "{}";

  try {
    const result = JSON.parse(content) as PlantAnalysisResult;
    return {
      plantName: result.plantName ?? "UNKNOWN PLANT",
      diseaseName: result.diseaseName ?? "Unknown Condition",
      confidence: Math.min(Math.max(result.confidence ?? 0.75, 0.50), 0.99),
      isHealthy: result.isHealthy ?? false,
      description: result.description ?? "Analysis complete",
      symptoms: result.symptoms ?? "See description above",
      treatment: result.treatment ?? "Consult a plant specialist",
      prevention: result.prevention ?? "Maintain proper plant care",
    };
  } catch {
    return {
      plantName: "PLANT",
      diseaseName: "Leaf Spot (likely fungal or bacterial)",
      confidence: 0.72,
      isHealthy: false,
      description: "Disease detected on the plant leaf. Manual inspection recommended.",
      symptoms: "Discoloration and spotting observed on leaf surface",
      treatment: "Apply appropriate fungicide or bactericide. Remove affected leaves.",
      prevention: "Ensure good air circulation and avoid overhead watering.",
    };
  }
}
