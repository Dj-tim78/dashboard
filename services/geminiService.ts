import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult } from "../types";

const getAiClient = () => {
  // In a real app, this would be securely handled. 
  // For this demo, we assume the environment variable is injected.
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will be simulated or fail.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeContainerLogs = async (containerName: string, logs: string[]): Promise<AIAnalysisResult> => {
  const ai = getAiClient();
  
  if (!ai) {
    // Fallback mock if no key is present for demo purposes
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          summary: "API Key missing. This is a simulated analysis. The logs indicate a connection timeout.",
          suggestedFix: "docker restart " + containerName,
          severity: "medium"
        });
      }, 1500);
    });
  }

  const prompt = `
    You are a DevOps expert. Analyze the following Docker container logs for container "${containerName}".
    Identify the root cause of any errors and suggest a specific fix (e.g., a docker command or config change).
    
    Logs:
    ${logs.slice(-20).join('\n')}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A concise explanation of what is happening in the logs." },
            suggestedFix: { type: Type.STRING, description: "A specific command or action to fix the issue." },
            severity: { type: Type.STRING, enum: ["low", "medium", "high"] }
          },
          required: ["summary", "suggestedFix", "severity"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");
    
    return JSON.parse(resultText) as AIAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return {
      summary: "Failed to analyze logs using Gemini AI.",
      suggestedFix: "Check internet connection and API Key.",
      severity: "low"
    };
  }
};