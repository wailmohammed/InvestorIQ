import { GoogleGenAI } from "@google/genai";
import { Holding } from "../types";

// Initialize the API client
// Note: Ensure process.env.API_KEY is available in your environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getPortfolioAnalysis = async (holdings: Holding[]) => {
  if (!process.env.API_KEY) {
    return "API Key missing. Please provide a valid API Key to use AI features.";
  }

  const portfolioSummary = holdings.map(h => 
    `${h.stock.ticker}: ${h.shares} shares @ $${h.avgCost} (Current: $${h.stock.price})`
  ).join('\n');

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Act as a senior financial analyst. Analyze this portfolio for diversification, risk, and improvement opportunities.
      Be concise, professional, and actionable.
      
      Portfolio:
      ${portfolioSummary}
      
      Provide:
      1. Risk Assessment (Low/Medium/High)
      2. Diversification Score (1-10)
      3. Key Strengths
      4. Key Weaknesses
      5. One Actionable Recommendation
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Unable to analyze portfolio at this time. Please try again later.";
  }
};

export const getStockDeepDive = async (ticker: string) => {
   if (!process.env.API_KEY) {
    return { analysis: "API Key missing.", sentiment: "Unknown" };
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Provide a deep dive analysis for stock ticker: ${ticker}.
      Focus on value, growth potential, and dividend safety.
      Assume current date is late 2024/early 2025 context.
      
      Format the output as a JSON object with keys: "analysis" (string, markdown supported), "sentiment" (string: Bullish/Bearish/Neutral), "fairValue" (number estimate).
      Do not include markdown code block syntax (like \`\`\`json). Just the raw JSON string.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing stock:", error);
    return { analysis: "Analysis failed.", sentiment: "Neutral" };
  }
};

export const chatWithAdvisor = async (history: {role: string, parts: string}[], message: string) => {
  if (!process.env.API_KEY) return "Please configure your API Key.";

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are InvestIQ AI, a helpful and knowledgeable financial assistant. You help users understand investing concepts, analyze trends, and manage their expectations. You do NOT give specific financial advice or promise returns. Always be prudent."
      },
      history: history.map(h => ({ role: h.role, parts: [{ text: h.parts }] }))
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat error:", error);
    return "I'm having trouble connecting to the server right now.";
  }
}
