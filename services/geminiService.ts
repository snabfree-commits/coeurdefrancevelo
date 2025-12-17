import { GoogleGenAI, Type } from "@google/genai";
import { Poi, RouteInfo } from '../types';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getRouteDescription = async (start: string, end: string): Promise<RouteInfo> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Crée une description touristique JSON pour le parcours cyclable "Cœur de France à Vélo" entre ${start} et ${end}.
      Inclus : 
      - Une estimation réaliste de la distance (environ 16-20km)
      - La durée à vélo
      - La difficulté
      - Un texte de description attrayant (2-3 phrases) mentionnant le Canal de Berry et le Cher.
      - Un tableau vide pour partnerLogos.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            distance: { type: Type.STRING },
            duration: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            description: { type: Type.STRING },
            partnerLogos: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as RouteInfo;
  } catch (error) {
    console.error("Error fetching route description:", error);
    // Fallback static data
    return {
      distance: "16 km",
      duration: "1h10",
      difficulty: "Facile",
      description: "Une étape agréable mêlant patrimoine historique avec le château de Selles-sur-Cher et douceur de vivre le long du Canal de Berry.",
      partnerLogos: []
    };
  }
};

export const getPoiDetails = async (poiName: string, type: string, city: string = ""): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Ecris une courte description touristique et pratique (3-4 phrases maximum) pour le point d'intérêt "${poiName}" de type "${type}" situé à "${city}" sur le parcours Cœur de France à Vélo.
      Si c'est un producteur (type farm), mentionne les produits du terroir potentiels (fromages, vins, etc).`,
    });
    return response.text || "Aucune description disponible pour le moment.";
  } catch (error) {
    console.error("Error fetching POI details:", error);
    return "Description non disponible (Hors ligne).";
  }
};
