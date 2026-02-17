import { GoogleGenAI } from "@google/genai";
import { UserProfile, PricingDecision } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateUserInsight = async (user: UserProfile, decision: PricingDecision): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI Service Unavailable (Missing API Key)";

  const prompt = `
    You are a Senior Pricing Analyst for EdTech. Analyze this user profile and the pricing engine's decision.
    
    User Profile:
    - Device: ${user.deviceType}
    - City Tier: ${user.cityTier}
    - Mock Tests Taken: ${user.mockTestsTaken}
    - Cart Activity: ${user.addedToCart ? 'Yes' : 'No'}
    - Competitor Signal: ${user.competitorSignal ? 'Yes' : 'No'}
    - Days Inactive: ${user.lastActiveDays}
    
    Calculated Scores:
    - Intent: ${decision.scores.intentScore}
    - Affordability: ${decision.scores.affordabilityScore}
    - Churn Risk: ${decision.scores.churnScore}
    
    System Decision:
    - Discount Offered: ${decision.discount}%
    
    Provide a concise, 2-sentence insight on why this discount strategy is effective for this specific user persona or if there are risks.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No insight generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating insight.";
  }
};

export const generateBatchStrategySummary = async (metrics: { conversionRate: number, revenueUplift: number, aov: number }): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI Service Unavailable";

  const prompt = `
    Analyze the following results from our AI Smart Pricing Engine experiment (15-day simulation):
    - Conversion Rate: ${metrics.conversionRate}%
    - Revenue Uplift: ${metrics.revenueUplift}%
    - Average Order Value (AOV) Uplift: ${metrics.aov}%
    
    The strategy uses dynamic discounting (0-75%) based on Intent, Affordability, and Churn scores.
    Write a short executive summary (max 50 words) confirming the success of the hypothesis or suggesting a tweak.
  `;

  try {
     const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No summary generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating summary.";
  }
};