import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { Poi, RouteInfo } from '../types';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export const getRouteDescription = async (start: string, end: string): Promise<RouteInfo> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: `Crée une description touristique JSON pour le parcours cyclable "Cœur de France à Vélo" entre ${start} et ${end}.
          Inclus : 
          - Une estimation réaliste de la distance (environ 16-20km)
          - La durée à vélo
          - La difficulté
          - Un texte de description attrayant (2-3 phrases) mentionnant le Canal de Berry et le Cher.
          - Un tableau vide pour partnerLogos.`
        }]
      }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            distance: { type: SchemaType.STRING },
            duration: { type: SchemaType.STRING },
            difficulty: { type: SchemaType.STRING },
            description: { type: SchemaType.STRING },
            partnerLogos: { 
              type: SchemaType.ARRAY, 
              items: { type: SchemaType.STRING } 
            }
          },
          required: ['distance', 'duration', 'difficulty', 'description', 'partnerLogos']
        }
      }
    });

    const response = result.response;
    const text = response.text();
    
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
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: `Ecris une courte description touristique et pratique (3-4 phrases maximum) pour le point d'intérêt "${poiName}" de type "${type}" situé à "${city}" sur le parcours Cœur de France à Vélo.
          Si c'est un producteur (type farm), mentionne les produits du terroir potentiels (fromages, vins, etc).`
        }]
      }]
    });

    const response = result.response;
    return response.text() || "Aucune description disponible pour le moment.";
  } catch (error) {
    console.error("Error fetching POI details:", error);
    return "Description non disponible (Hors ligne).";
  }
};