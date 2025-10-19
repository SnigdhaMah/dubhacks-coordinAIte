// the type returned by the feature recommendation API

export type Recommendation = {
  title: string;
  description?: string;
  bookingLink?: string;
  images?: string[]; // array of image URLs
  price?: number | string; // numeric value or formatted string
  date?: string; // ISO date string
  color?: string; // CSS color (hex, rgb, named)
  contactInfo?: {
    name?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  justification: string; // why ai recommended this
};

export type FeatureType = { 
    uid: string;
    featureTitle: string; 
    selected: Recommendation | null; 
    recommended: Recommendation[]; 
}