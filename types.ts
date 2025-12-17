
export interface Coordinate {
  lat: number;
  lng: number;
}

export interface Poi {
  id: string;
  name: string;
  description: string;
  position: Coordinate;
  type: 'castle' | 'nature' | 'restaurant' | 'village' | 'farm';
  imageUrl?: string;
  // New fields for Backoffice
  phone?: string;
  website?: string;
  openingHours?: string;
  // Address fields for automatic geocoding
  address?: string;
  zipCode?: string;
  city?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

export interface RouteInfo {
  distance: string;
  duration: string;
  difficulty: string;
  description: string;
  partnerLogos?: string[]; // Array of strings for multiple logos
}
