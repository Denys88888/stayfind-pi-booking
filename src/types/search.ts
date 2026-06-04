export interface Hotel {
  id: number;
  name: string;
  location: string;
  address: string;
  rating: number;
  ratingLabel: string;
  reviewCount: number;
  price: number;
  originalPrice: number;
  images: string[];
  tags: string[];
  amenities: string[];
  coordinates: [number, number];
  starRating: number;
  propertyType: string;
  freeCancellation: boolean;
  breakfastIncluded: boolean;
  description: string;
  roomsLeft?: number;
}

export interface FilterState {
  priceRange: [number, number];
  starRatings: number[];
  guestRatings: string[];
  propertyTypes: string[];
  amenities: string[];
  freeCancellation: boolean;
  breakfastIncluded: boolean;
}

export type SortOption =
  | 'top-picks'
  | 'price-low'
  | 'price-high'
  | 'best-reviewed'
  | 'closest';
