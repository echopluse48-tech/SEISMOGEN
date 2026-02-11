import { GoogleGenAI, Type } from "@google/genai";
import { SimulationParams, SimulationReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateEarthquakeReport = async (
  params: SimulationParams
): Promise<SimulationReport> => {
  const prompt = `
    Generate a realistic earthquake impact report.
    
    Scenario Data:
    - Magnitude: ${params.magnitude} (Richter Scale)
    - Depth: ${params.depth} km
    - Setting: ${params.locationType}
    
    The report should be scientific yet accessible, acting as an immediate geological survey summary.
    If the magnitude is very low (< 3.0), describe it as mostly unnoticed.
    If it is extreme (> 8.0), describe catastrophic consequences.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING, description: "Breaking news style headline" },
            description: { type: Type.STRING, description: "A detailed paragraph describing the physical sensation and immediate environmental impact." },
            intensityMercalli: { type: Type.STRING, description: "Estimated Modified Mercalli Intensity (e.g., 'IV', 'IX')" },
            safetyTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 specific safety instructions for this specific scenario"
            },
            estimatedDamageCost: { type: Type.STRING, description: "Rough estimate of economic impact (e.g., 'Minimal', '$100M', '$50B')" },
            affectedPopulationEstimate: { type: Type.STRING, description: "Estimate of people feeling the shake (e.g., 'None', '500,000', '10 Million')" }
          },
          required: ["headline", "description", "intensityMercalli", "safetyTips", "estimatedDamageCost", "affectedPopulationEstimate"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as SimulationReport;
  } catch (error) {
    console.error("Error generating report:", error);
    return {
      headline: "Data Unavailable",
      description: "Unable to retrieve seismic analysis at this time. Please try again.",
      intensityMercalli: "Unknown",
      safetyTips: ["Drop, Cover, and Hold On"],
      estimatedDamageCost: "Unknown",
      affectedPopulationEstimate: "Unknown"
    };
  }
};