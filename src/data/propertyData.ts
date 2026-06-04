export interface RoomType {
  id: string;
  name: string;
  image: string;
  size: string;
  capacity: string;
  bed: string;
  amenities: string[];
  description: string;
  pricePerNight: number;
  totalPrice: number;
  taxes: number;
  cancellation: string;
  badge?: string;
  badgeType?: 'warning' | 'success' | 'coral';
}

export interface Review {
  id: string;
  name: string;
  avatar: string;
  date: string;
  score: number;
  title: string;
  text: string;
  tags: string[];
  helpful: number;
}

export interface AmenityCategory {
  category: string;
  icon: string;
  items: { name: string; available: boolean }[];
}

export interface NearbyAttraction {
  name: string;
  type: string;
  distance: string;
  walkTime: string;
}

export interface HotelData {
  id: string;
  name: string;
  stars: number;
  class: string;
  rating: number;
  ratingLabel: string;
  reviewCount: number;
  address: string;
  city: string;
  country: string;
  breadcrumb: string[];
  images: string[];
  description: string;
  highlights: string[];
  checkIn: string;
  checkOut: string;
  cancellation: string;
  children: string;
  pets: string;
  smoking: string;
  popularFacilities: { icon: string; name: string }[];
  propertyHighlights: string[];
  breakfastInfo: string;
  nearbyAttractionsQuick: { name: string; distance: string }[];
  roomTypes: RoomType[];
  amenities: AmenityCategory[];
  ratingBreakdown: {
    staff: number;
    facilities: number;
    cleanliness: number;
    comfort: number;
    value: number;
    location: number;
    wifi: number;
  };
  reviews: Review[];
  nearbyAttractions: NearbyAttraction[];
  similarProperties: {
    id: string;
    name: string;
    image: string;
    location: string;
    rating: number;
    reviewCount: number;
    price: number;
    tags: string[];
  }[];
  mapCoordinates: { lat: number; lng: number };
}

export const hotelsData: Record<string, HotelData> = {
  '1': {
    id: '1',
    name: 'The Grand Palace Hotel',
    stars: 5,
    class: '5-Star Hotel',
    rating: 9.4,
    ratingLabel: 'Wonderful',
    reviewCount: 1240,
    address: '12 Rue de la Paix, 2nd Arr.',
    city: 'Paris',
    country: 'France',
    breadcrumb: ['Home', 'France', 'Paris', 'Hotels', 'The Grand Palace Hotel'],
    images: [
      '/hotel-1.jpg',
      '/hotel-2.jpg',
      '/hotel-3.jpg',
      '/hotel-4.jpg',
      '/hotel-5.jpg',
      '/hotel-6.jpg',
    ],
    description:
      'Nestled in the heart of Paris\'s prestigious 2nd arrondissement, The Grand Palace Hotel offers an unparalleled blend of historic elegance and modern luxury. Originally built in 1897 as a private mansion, the property has been meticulously restored to offer 127 individually designed rooms and suites. Each space features original architectural details complemented by contemporary furnishings, marble bathrooms, and state-of-the-art technology. Guests enjoy award-winning dining at Le Jardin restaurant, a world-class spa, indoor heated pool, and a rooftop terrace with panoramic views of the City of Light.',
    highlights: ['Free WiFi', 'Breakfast Included', 'Pool & Spa', 'Airport Shuttle'],
    checkIn: 'From 3:00 PM',
    checkOut: 'Until 12:00 PM',
    cancellation: 'Free cancellation until 24h before',
    children: 'All children welcome',
    pets: 'Not allowed',
    smoking: 'Non-smoking property',
    popularFacilities: [
      { icon: 'Waves', name: 'Swimming pool' },
      { icon: 'Dumbbell', name: 'Fitness center' },
      { icon: 'Car', name: 'Airport shuttle' },
      { icon: 'Wifi', name: 'Free WiFi' },
      { icon: 'Coffee', name: 'Restaurant & Bar' },
      { icon: 'Wind', name: 'Air conditioning' },
    ],
    propertyHighlights: [
      'Perfect for a 2-night stay!',
      'Located in the heart of Paris',
      'Breakfast info: Continental, Buffet',
    ],
    breakfastInfo: 'Continental, Buffet',
    nearbyAttractionsQuick: [
      { name: 'Louvre Museum', distance: '0.8 km' },
      { name: 'Champs-\u00c9lys\u00e9es', distance: '0.3 km' },
      { name: 'Eiffel Tower', distance: '2.1 km' },
      { name: 'Opera Garnier', distance: '0.5 km' },
      { name: 'Notre-Dame', distance: '1.5 km' },
    ],
    roomTypes: [
      {
        id: 'r1',
        name: 'Deluxe King Room',
        image: '/hotel-2.jpg',
        size: '35 m\u00b2',
        capacity: '2 Adults',
        bed: '1 King Bed',
        amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'],
        description: 'Spacious room with city view, marble bathroom, and premium bedding.',
        pricePerNight: 285,
        totalPrice: 1995,
        taxes: 299,
        cancellation: 'Free cancellation until Dec 13',
      },
      {
        id: 'r2',
        name: 'Premier Suite',
        image: '/hotel-3.jpg',
        size: '55 m\u00b2',
        capacity: '2 Adults + 1 Child',
        bed: '1 King Bed + Sofa',
        amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi', 'Balcony'],
        description: 'Luxurious suite with separate living area, panoramic city views, and private balcony.',
        pricePerNight: 450,
        totalPrice: 3150,
        taxes: 472,
        cancellation: 'Free cancellation until Dec 13',
        badge: 'Only 2 rooms left!',
        badgeType: 'warning',
      },
      {
        id: 'r3',
        name: 'Classic Twin Room',
        image: '/hotel-4.jpg',
        size: '28 m\u00b2',
        capacity: '2 Adults',
        bed: '2 Twin Beds',
        amenities: ['WiFi', 'AC', 'TV'],
        description: 'Cozy and comfortable room with modern amenities and garden view.',
        pricePerNight: 195,
        totalPrice: 1365,
        taxes: 204,
        cancellation: 'Free cancellation until Dec 13',
        badge: 'Breakfast included',
        badgeType: 'success',
      },
      {
        id: 'r4',
        name: 'Presidential Penthouse',
        image: '/hotel-5.jpg',
        size: '120 m\u00b2',
        capacity: '4 Adults',
        bed: '2 King Beds',
        amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Butler', 'Terrace', 'Kitchen'],
        description: 'Ultimate luxury with private terrace, butler service, and breathtaking views.',
        pricePerNight: 1200,
        totalPrice: 8400,
        taxes: 1260,
        cancellation: 'Free cancellation until Dec 13',
        badge: 'Best Seller',
        badgeType: 'coral',
      },
    ],
    amenities: [
      {
        category: 'Bathroom',
        icon: 'Bath',
        items: [
          { name: 'Toilet paper', available: true },
          { name: 'Towels', available: true },
          { name: 'Bathtub or shower', available: true },
          { name: 'Slippers', available: true },
          { name: 'Private bathroom', available: true },
          { name: 'Free toiletries', available: true },
          { name: 'Hairdryer', available: true },
        ],
      },
      {
        category: 'Bedroom',
        icon: 'Bed',
        items: [
          { name: 'Linens', available: true },
          { name: 'Wardrobe or closet', available: true },
          { name: 'Alarm clock', available: true },
        ],
      },
      {
        category: 'View',
        icon: 'Eye',
        items: [
          { name: 'City view', available: true },
          { name: 'Landmark view', available: true },
        ],
      },
      {
        category: 'Outdoors',
        icon: 'TreePine',
        items: [
          { name: 'Terrace', available: true },
          { name: 'Garden', available: false },
        ],
      },
      {
        category: 'Kitchen',
        icon: 'Utensils',
        items: [
          { name: 'Electric kettle', available: true },
          { name: 'Minibar', available: true },
        ],
      },
      {
        category: 'Room Amenities',
        icon: 'Sofa',
        items: [
          { name: 'Socket near the bed', available: true },
          { name: 'Clothes rack', available: true },
          { name: 'Flat-screen TV', available: true },
          { name: 'Telephone', available: true },
          { name: 'Satellite channels', available: true },
        ],
      },
      {
        category: 'Services',
        icon: 'Headphones',
        items: [
          { name: 'Wake-up service', available: true },
          { name: 'Daily housekeeping', available: true },
          { name: 'Laundry', available: true },
          { name: 'Dry cleaning', available: true },
        ],
      },
      {
        category: 'Safety',
        icon: 'Shield',
        items: [
          { name: 'Fire extinguishers', available: true },
          { name: 'Smoke alarms', available: true },
          { name: 'Security alarm', available: true },
          { name: '24-hour security', available: true },
          { name: 'Safe', available: true },
        ],
      },
      {
        category: 'Internet',
        icon: 'Wifi',
        items: [
          { name: 'WiFi available in all areas and is free of charge', available: true },
        ],
      },
    ],
    ratingBreakdown: {
      staff: 9.6,
      facilities: 9.3,
      cleanliness: 9.7,
      comfort: 9.4,
      value: 8.9,
      location: 9.8,
      wifi: 9.2,
    },
    reviews: [
      {
        id: 'rev1',
        name: 'Emily Watson',
        avatar: '/reviewer-1.jpg',
        date: 'Nov 2025',
        score: 10,
        title: 'Absolutely Perfect Stay',
        text: 'From the moment we arrived, the staff went above and beyond. The room was immaculate with stunning views of Paris. The breakfast buffet was exceptional with a wide variety of fresh options. We will definitely be returning!',
        tags: ['Couple', 'Deluxe King Room'],
        helpful: 24,
      },
      {
        id: 'rev2',
        name: 'Michael Brown',
        avatar: '/reviewer-2.jpg',
        date: 'Oct 2025',
        score: 9,
        title: 'Great Location, Beautiful Hotel',
        text: 'Perfect location within walking distance of all major attractions. The room was spacious and well-appointed with elegant decor. Only minor issue was the WiFi being slightly slow in the evenings, but overall a fantastic experience.',
        tags: ['Solo', 'Premier Suite'],
        helpful: 18,
      },
      {
        id: 'rev3',
        name: 'Sofia Martinez',
        avatar: '/reviewer-3.jpg',
        date: 'Oct 2025',
        score: 10,
        title: 'Honeymoon Dream',
        text: 'We stayed here for our honeymoon and it was magical. The staff arranged champagne and rose petals in our room. The spa treatments were world-class and the rooftop dinner was unforgettable. Truly a once-in-a-lifetime experience.',
        tags: ['Couple', 'Presidential Penthouse'],
        helpful: 45,
      },
      {
        id: 'rev4',
        name: 'James Wilson',
        avatar: '/reviewer-1.jpg',
        date: 'Sep 2025',
        score: 8,
        title: 'Very Good Overall',
        text: 'Excellent facilities and location. The pool area is beautiful and serene. Room service was prompt and the food quality was high. Would definitely stay again on our next visit to Paris.',
        tags: ['Family', 'Classic Twin Room'],
        helpful: 12,
      },
      {
        id: 'rev5',
        name: 'Anna Schmidt',
        avatar: '/reviewer-2.jpg',
        date: 'Sep 2025',
        score: 10,
        title: 'Beyond Expectations',
        text: 'I\'ve stayed at many luxury hotels and this ranks among the best. Attention to detail is impeccable. The concierge helped us secure restaurant reservations at fully booked places. Simply outstanding service.',
        tags: ['Business', 'Deluxe King Room'],
        helpful: 31,
      },
      {
        id: 'rev6',
        name: 'David Kim',
        avatar: '/reviewer-3.jpg',
        date: 'Aug 2025',
        score: 9,
        title: 'Fantastic Experience',
        text: 'The hotel exceeded our expectations in every way. The rooms are beautifully designed, the staff is incredibly attentive, and the location cannot be beaten. Highly recommend the spa package.',
        tags: ['Couple', 'Premier Suite'],
        helpful: 22,
      },
    ],
    nearbyAttractions: [
      { name: 'Louvre Museum', type: 'Museum', distance: '0.8 km', walkTime: '10 min' },
      { name: 'Champs-\u00c9lys\u00e9es', type: 'Shopping', distance: '0.3 km', walkTime: '4 min' },
      { name: 'Eiffel Tower', type: 'Landmark', distance: '2.1 km', walkTime: '26 min' },
      { name: 'Opera Garnier', type: 'Culture', distance: '0.5 km', walkTime: '6 min' },
      { name: 'Notre-Dame', type: 'Cathedral', distance: '1.5 km', walkTime: '19 min' },
      { name: 'Seine River', type: 'Nature', distance: '0.6 km', walkTime: '8 min' },
    ],
    similarProperties: [
      {
        id: 's1',
        name: 'Ritz Paris',
        image: '/hotel-1.jpg',
        location: 'Paris, France',
        rating: 9.6,
        reviewCount: 892,
        price: 520,
        tags: ['Luxury', 'Spa'],
      },
      {
        id: 's2',
        name: 'Hotel de Crillon',
        image: '/hotel-3.jpg',
        location: 'Paris, France',
        rating: 9.3,
        reviewCount: 654,
        price: 480,
        tags: ['Historic', 'Pool'],
      },
      {
        id: 's3',
        name: 'Le Meurice',
        image: '/hotel-4.jpg',
        location: 'Paris, France',
        rating: 9.5,
        reviewCount: 723,
        price: 510,
        tags: ['5-Star', 'Fine Dining'],
      },
      {
        id: 's4',
        name: 'Shangri-La Paris',
        image: '/hotel-5.jpg',
        location: 'Paris, France',
        rating: 9.4,
        reviewCount: 567,
        price: 460,
        tags: ['Eiffel View', 'Spa'],
      },
    ],
    mapCoordinates: { lat: 48.8689, lng: 2.3317 },
  },
  '2': {
    id: '2',
    name: 'Tokyo Imperial Resort',
    stars: 5,
    class: 'Luxury Resort',
    rating: 9.2,
    ratingLabel: 'Excellent',
    reviewCount: 876,
    address: '1-1-1 Marunouchi, Chiyoda',
    city: 'Tokyo',
    country: 'Japan',
    breadcrumb: ['Home', 'Japan', 'Tokyo', 'Hotels', 'Tokyo Imperial Resort'],
    images: [
      '/hotel-3.jpg',
      '/hotel-1.jpg',
      '/hotel-5.jpg',
      '/hotel-2.jpg',
      '/hotel-6.jpg',
      '/hotel-4.jpg',
    ],
    description:
      'Discover the perfect harmony of Japanese tradition and contemporary luxury at Tokyo Imperial Resort. Located in the heart of Marunouchi, our resort features 210 exquisite rooms and suites with breathtaking views of the Imperial Palace gardens. Experience authentic kaiseki dining, a serene onsen-inspired spa, and the renowned Japanese hospitality that makes every stay unforgettable.',
    highlights: ['Free WiFi', 'Onsen Spa', 'Imperial Garden View', 'Concierge'],
    checkIn: 'From 2:00 PM',
    checkOut: 'Until 11:00 AM',
    cancellation: 'Free cancellation until 48h before',
    children: 'All children welcome',
    pets: 'Not allowed',
    smoking: 'Designated smoking areas only',
    popularFacilities: [
      { icon: 'Waves', name: 'Onsen spa' },
      { icon: 'Dumbbell', name: 'Fitness center' },
      { icon: 'Car', name: 'Airport shuttle' },
      { icon: 'Wifi', name: 'Free WiFi' },
      { icon: 'Coffee', name: '2 Restaurants' },
      { icon: 'Wind', name: 'Climate control' },
    ],
    propertyHighlights: [
      'Perfect for a 3-night stay!',
      'Steps from Imperial Palace',
      'Breakfast info: Japanese, Western',
    ],
    breakfastInfo: 'Japanese, Western',
    nearbyAttractionsQuick: [
      { name: 'Imperial Palace', distance: '0.2 km' },
      { name: 'Tokyo Station', distance: '0.3 km' },
      { name: 'Ginza District', distance: '0.8 km' },
      { name: 'Akihabara', distance: '1.5 km' },
      { name: 'Senso-ji Temple', distance: '3.2 km' },
    ],
    roomTypes: [
      {
        id: 'r1',
        name: 'Deluxe City Room',
        image: '/hotel-2.jpg',
        size: '32 m\u00b2',
        capacity: '2 Adults',
        bed: '1 King Bed',
        amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'],
        description: 'Modern room with city skyline view and traditional Japanese design elements.',
        pricePerNight: 320,
        totalPrice: 2240,
        taxes: 336,
        cancellation: 'Free cancellation until Dec 11',
      },
      {
        id: 'r2',
        name: 'Garden View Suite',
        image: '/hotel-3.jpg',
        size: '60 m\u00b2',
        capacity: '2 Adults + 2 Children',
        bed: '2 Queen Beds',
        amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Onsen', 'Balcony'],
        description: 'Suite with private balcony overlooking the Imperial Palace gardens.',
        pricePerNight: 580,
        totalPrice: 4060,
        taxes: 609,
        cancellation: 'Free cancellation until Dec 11',
        badge: 'Only 3 rooms left!',
        badgeType: 'warning',
      },
      {
        id: 'r3',
        name: 'Traditional Tatami Room',
        image: '/hotel-4.jpg',
        size: '30 m\u00b2',
        capacity: '2 Adults',
        bed: '2 Futons',
        amenities: ['WiFi', 'AC', 'TV'],
        description: 'Authentic Japanese experience with tatami mats and shoji screens.',
        pricePerNight: 240,
        totalPrice: 1680,
        taxes: 252,
        cancellation: 'Free cancellation until Dec 11',
        badge: 'Cultural experience',
        badgeType: 'success',
      },
      {
        id: 'r4',
        name: 'Imperial Penthouse',
        image: '/hotel-5.jpg',
        size: '150 m\u00b2',
        capacity: '4 Adults',
        bed: '2 King Beds',
        amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Butler', 'Terrace', 'Onsen'],
        description: 'Ultimate luxury with private onsen, terrace, and 360\u00b0 city views.',
        pricePerNight: 1500,
        totalPrice: 10500,
        taxes: 1575,
        cancellation: 'Free cancellation until Dec 11',
        badge: 'Exclusive',
        badgeType: 'coral',
      },
    ],
    amenities: [
      {
        category: 'Bathroom',
        icon: 'Bath',
        items: [
          { name: 'Toilet paper', available: true },
          { name: 'Towels', available: true },
          { name: 'Bathtub or shower', available: true },
          { name: 'Slippers', available: true },
          { name: 'Private bathroom', available: true },
          { name: 'Free toiletries', available: true },
          { name: 'Hairdryer', available: true },
        ],
      },
      {
        category: 'Bedroom',
        icon: 'Bed',
        items: [
          { name: 'Linens', available: true },
          { name: 'Wardrobe or closet', available: true },
          { name: 'Alarm clock', available: true },
        ],
      },
      {
        category: 'View',
        icon: 'Eye',
        items: [
          { name: 'City view', available: true },
          { name: 'Garden view', available: true },
          { name: 'Landmark view', available: true },
        ],
      },
      {
        category: 'Outdoors',
        icon: 'TreePine',
        items: [
          { name: 'Terrace', available: true },
          { name: 'Garden access', available: true },
        ],
      },
      {
        category: 'Kitchen',
        icon: 'Utensils',
        items: [
          { name: 'Electric kettle', available: true },
          { name: 'Tea set', available: true },
          { name: 'Minibar', available: true },
        ],
      },
      {
        category: 'Room Amenities',
        icon: 'Sofa',
        items: [
          { name: 'Socket near the bed', available: true },
          { name: 'Clothes rack', available: true },
          { name: 'Flat-screen TV', available: true },
          { name: 'Telephone', available: true },
          { name: 'Satellite channels', available: true },
        ],
      },
      {
        category: 'Services',
        icon: 'Headphones',
        items: [
          { name: 'Wake-up service', available: true },
          { name: 'Daily housekeeping', available: true },
          { name: 'Laundry', available: true },
          { name: 'Dry cleaning', available: true },
        ],
      },
      {
        category: 'Safety',
        icon: 'Shield',
        items: [
          { name: 'Fire extinguishers', available: true },
          { name: 'Smoke alarms', available: true },
          { name: 'Security alarm', available: true },
          { name: '24-hour security', available: true },
          { name: 'Safe', available: true },
        ],
      },
      {
        category: 'Internet',
        icon: 'Wifi',
        items: [
          { name: 'WiFi available in all areas and is free of charge', available: true },
        ],
      },
    ],
    ratingBreakdown: {
      staff: 9.5,
      facilities: 9.4,
      cleanliness: 9.6,
      comfort: 9.3,
      value: 8.7,
      location: 9.7,
      wifi: 9.1,
    },
    reviews: [
      {
        id: 'rev1',
        name: 'Sarah Chen',
        avatar: '/reviewer-1.jpg',
        date: 'Nov 2025',
        score: 10,
        title: 'Unforgettable Japanese Hospitality',
        text: 'The level of service here is beyond anything we\'ve experienced. Every staff member greeted us with genuine warmth. The onsen experience was heavenly and the traditional breakfast was a highlight of our trip.',
        tags: ['Family', 'Garden View Suite'],
        helpful: 28,
      },
      {
        id: 'rev2',
        name: 'Robert Tanaka',
        avatar: '/reviewer-2.jpg',
        date: 'Oct 2025',
        score: 9,
        title: 'Perfect Business Hotel',
        text: 'Excellent location right next to Tokyo Station. The rooms are spacious by Tokyo standards and the work desk setup is perfect. High-speed WiFi and the business center are top-notch.',
        tags: ['Business', 'Deluxe City Room'],
        helpful: 15,
      },
      {
        id: 'rev3',
        name: 'Lisa Wong',
        avatar: '/reviewer-3.jpg',
        date: 'Oct 2025',
        score: 10,
        title: 'Magical Anniversary Stay',
        text: 'We celebrated our anniversary here and the staff made it so special. They arranged a private dinner with Mount Fuji views and surprised us with a cake. The Imperial Penthouse is worth every penny.',
        tags: ['Couple', 'Imperial Penthouse'],
        helpful: 38,
      },
      {
        id: 'rev4',
        name: 'Thomas Muller',
        avatar: '/reviewer-1.jpg',
        date: 'Sep 2025',
        score: 8,
        title: 'Great But Pricey',
        text: 'Beautiful property with impeccable service. The gardens are stunning especially in autumn. The only downside is the price point, but for a special occasion it\'s absolutely worth it.',
        tags: ['Couple', 'Traditional Tatami Room'],
        helpful: 19,
      },
      {
        id: 'rev5',
        name: 'Yuki Nakamura',
        avatar: '/reviewer-2.jpg',
        date: 'Sep 2025',
        score: 9,
        title: 'Authentic Yet Modern',
        text: 'I loved how they blend traditional Japanese aesthetics with modern comforts. The tatami room was beautifully designed and the bathroom amenities were premium quality. Will recommend to friends.',
        tags: ['Solo', 'Traditional Tatami Room'],
        helpful: 14,
      },
      {
        id: 'rev6',
        name: 'Emma Johnson',
        avatar: '/reviewer-3.jpg',
        date: 'Aug 2025',
        score: 10,
        title: 'Best Hotel in Tokyo',
        text: 'Having stayed at many Tokyo hotels, this is by far my favorite. The location is unbeatable, the views are spectacular, and the onsen spa is the perfect way to unwind after exploring the city.',
        tags: ['Solo', 'Deluxe City Room'],
        helpful: 27,
      },
    ],
    nearbyAttractions: [
      { name: 'Imperial Palace', type: 'Landmark', distance: '0.2 km', walkTime: '3 min' },
      { name: 'Tokyo Station', type: 'Transport', distance: '0.3 km', walkTime: '4 min' },
      { name: 'Ginza District', type: 'Shopping', distance: '0.8 km', walkTime: '10 min' },
      { name: 'Akihabara', type: 'Entertainment', distance: '1.5 km', walkTime: '19 min' },
      { name: 'Senso-ji Temple', type: 'Temple', distance: '3.2 km', walkTime: '40 min' },
      { name: 'Tokyo Skytree', type: 'Landmark', distance: '3.8 km', walkTime: '47 min' },
    ],
    similarProperties: [
      {
        id: 's1',
        name: 'Aman Tokyo',
        image: '/hotel-1.jpg',
        location: 'Tokyo, Japan',
        rating: 9.5,
        reviewCount: 432,
        price: 680,
        tags: ['Luxury', 'Spa'],
      },
      {
        id: 's2',
        name: 'Park Hyatt Tokyo',
        image: '/hotel-2.jpg',
        location: 'Tokyo, Japan',
        rating: 9.3,
        reviewCount: 567,
        price: 550,
        tags: ['City View', 'Pool'],
      },
      {
        id: 's3',
        name: 'Mandarin Oriental',
        image: '/hotel-6.jpg',
        location: 'Tokyo, Japan',
        rating: 9.4,
        reviewCount: 489,
        price: 590,
        tags: ['5-Star', 'Fine Dining'],
      },
      {
        id: 's4',
        name: 'Conrad Tokyo',
        image: '/hotel-4.jpg',
        location: 'Tokyo, Japan',
        rating: 9.1,
        reviewCount: 345,
        price: 480,
        tags: ['Bay View', 'Spa'],
      },
    ],
    mapCoordinates: { lat: 35.6812, lng: 139.7671 },
  },
  '3': {
    id: '3',
    name: 'Bali Sunrise Villa Resort',
    stars: 4,
    class: 'Beach Resort',
    rating: 9.0,
    ratingLabel: 'Wonderful',
    reviewCount: 2103,
    address: 'Jl. Kayu Aya, Seminyak',
    city: 'Bali',
    country: 'Indonesia',
    breadcrumb: ['Home', 'Indonesia', 'Bali', 'Hotels', 'Bali Sunrise Villa Resort'],
    images: [
      '/hotel-5.jpg',
      '/hotel-6.jpg',
      '/hotel-1.jpg',
      '/hotel-3.jpg',
      '/hotel-4.jpg',
      '/hotel-2.jpg',
    ],
    description:
      'Escape to paradise at Bali Sunrise Villa Resort, nestled along the pristine Seminyak Beach. Our beachfront resort features 85 private villas, each with its own plunge pool and tropical garden. Immerse yourself in Balinese culture with daily yoga sessions, traditional cooking classes, and rejuvenating spa treatments using organic local ingredients. Watch breathtaking sunsets from our beachfront restaurant while savoring fresh seafood and creative cocktails.',
    highlights: ['Free WiFi', 'Beachfront', 'Private Pools', 'Yoga Classes'],
    checkIn: 'From 2:00 PM',
    checkOut: 'Until 12:00 PM',
    cancellation: 'Free cancellation until 72h before',
    children: 'All children welcome',
    pets: 'Not allowed',
    smoking: 'Non-smoking villas',
    popularFacilities: [
      { icon: 'Waves', name: '2 Swimming pools' },
      { icon: 'Dumbbell', name: 'Yoga pavilion' },
      { icon: 'Car', name: 'Airport transfer' },
      { icon: 'Wifi', name: 'Free WiFi' },
      { icon: 'Coffee', name: 'Beachfront restaurant' },
      { icon: 'Wind', name: 'Air conditioning' },
    ],
    propertyHighlights: [
      'Perfect for a 5-night stay!',
      'Direct beach access',
      'Breakfast info: Continental, Indonesian',
    ],
    breakfastInfo: 'Continental, Indonesian',
    nearbyAttractionsQuick: [
      { name: 'Seminyak Beach', distance: '0.1 km' },
      { name: 'Petitenget Temple', distance: '0.5 km' },
      { name: 'Eat Street', distance: '0.3 km' },
      { name: 'Tanah Lot', distance: '12 km' },
      { name: 'Ubud Center', distance: '25 km' },
    ],
    roomTypes: [
      {
        id: 'r1',
        name: 'Garden Villa',
        image: '/hotel-6.jpg',
        size: '45 m\u00b2',
        capacity: '2 Adults',
        bed: '1 King Bed',
        amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Pool'],
        description: 'Private villa with tropical garden and plunge pool.',
        pricePerNight: 180,
        totalPrice: 1260,
        taxes: 189,
        cancellation: 'Free cancellation until Dec 9',
      },
      {
        id: 'r2',
        name: 'Ocean View Villa',
        image: '/hotel-3.jpg',
        size: '55 m\u00b2',
        capacity: '2 Adults + 1 Child',
        bed: '1 King Bed',
        amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Pool', 'Ocean View'],
        description: 'Beachfront villa with direct ocean views and private terrace.',
        pricePerNight: 260,
        totalPrice: 1820,
        taxes: 273,
        cancellation: 'Free cancellation until Dec 9',
        badge: 'Popular choice',
        badgeType: 'warning',
      },
      {
        id: 'r3',
        name: 'Family Pool Villa',
        image: '/hotel-4.jpg',
        size: '80 m\u00b2',
        capacity: '4 Adults + 2 Children',
        bed: '2 King Beds',
        amenities: ['WiFi', 'AC', 'TV', 'Kitchen', 'Pool'],
        description: 'Spacious two-bedroom villa with large private pool and kitchenette.',
        pricePerNight: 380,
        totalPrice: 2660,
        taxes: 399,
        cancellation: 'Free cancellation until Dec 9',
        badge: 'Family friendly',
        badgeType: 'success',
      },
      {
        id: 'r4',
        name: 'Presidential Beach Villa',
        image: '/hotel-5.jpg',
        size: '200 m\u00b2',
        capacity: '6 Adults',
        bed: '3 King Beds',
        amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Butler', 'Beach', 'Kitchen'],
        description: 'Ultimate beachfront luxury with private beach access and personal butler.',
        pricePerNight: 850,
        totalPrice: 5950,
        taxes: 892,
        cancellation: 'Free cancellation until Dec 9',
        badge: 'Ultra luxury',
        badgeType: 'coral',
      },
    ],
    amenities: [
      {
        category: 'Bathroom',
        icon: 'Bath',
        items: [
          { name: 'Toilet paper', available: true },
          { name: 'Towels', available: true },
          { name: 'Outdoor shower', available: true },
          { name: 'Slippers', available: true },
          { name: 'Private bathroom', available: true },
          { name: 'Free toiletries', available: true },
          { name: 'Hairdryer', available: true },
        ],
      },
      {
        category: 'Bedroom',
        icon: 'Bed',
        items: [
          { name: 'Linens', available: true },
          { name: 'Wardrobe or closet', available: true },
          { name: 'Mosquito net', available: true },
        ],
      },
      {
        category: 'View',
        icon: 'Eye',
        items: [
          { name: 'Garden view', available: true },
          { name: 'Pool view', available: true },
          { name: 'Ocean view', available: true },
        ],
      },
      {
        category: 'Outdoors',
        icon: 'TreePine',
        items: [
          { name: 'Private terrace', available: true },
          { name: 'Private pool', available: true },
          { name: 'Garden', available: true },
          { name: 'Beach access', available: true },
        ],
      },
      {
        category: 'Kitchen',
        icon: 'Utensils',
        items: [
          { name: 'Electric kettle', available: true },
          { name: 'Minibar', available: true },
          { name: 'Coffee machine', available: true },
        ],
      },
      {
        category: 'Room Amenities',
        icon: 'Sofa',
        items: [
          { name: 'Socket near the bed', available: true },
          { name: 'Clothes rack', available: true },
          { name: 'Flat-screen TV', available: true },
          { name: 'Telephone', available: true },
          { name: 'Bluetooth speaker', available: true },
        ],
      },
      {
        category: 'Services',
        icon: 'Headphones',
        items: [
          { name: 'Wake-up service', available: true },
          { name: 'Daily housekeeping', available: true },
          { name: 'Laundry', available: true },
          { name: 'Airport shuttle', available: true },
        ],
      },
      {
        category: 'Safety',
        icon: 'Shield',
        items: [
          { name: 'Fire extinguishers', available: true },
          { name: 'Smoke alarms', available: true },
          { name: '24-hour security', available: true },
          { name: 'Safe', available: true },
        ],
      },
      {
        category: 'Internet',
        icon: 'Wifi',
        items: [
          { name: 'WiFi available in all areas and is free of charge', available: true },
        ],
      },
    ],
    ratingBreakdown: {
      staff: 9.3,
      facilities: 9.1,
      cleanliness: 9.0,
      comfort: 9.2,
      value: 9.1,
      location: 9.4,
      wifi: 8.8,
    },
    reviews: [
      {
        id: 'rev1',
        name: 'Jessica Lee',
        avatar: '/reviewer-1.jpg',
        date: 'Nov 2025',
        score: 10,
        title: 'Paradise Found',
        text: 'This resort is absolutely magical. Our private villa was stunning with its own pool surrounded by tropical flowers. The staff arranged a floating breakfast which was the highlight of our trip. Cannot recommend enough!',
        tags: ['Couple', 'Garden Villa'],
        helpful: 52,
      },
      {
        id: 'rev2',
        name: 'Mark Thompson',
        avatar: '/reviewer-2.jpg',
        date: 'Oct 2025',
        score: 9,
        title: 'Amazing Family Vacation',
        text: 'We traveled with our two kids and the family pool villa was perfect. The kids loved the private pool and the kids club activities. The beachfront restaurant has excellent food and the sunset views are unbeatable.',
        tags: ['Family', 'Family Pool Villa'],
        helpful: 31,
      },
      {
        id: 'rev3',
        name: 'Priya Sharma',
        avatar: '/reviewer-3.jpg',
        date: 'Oct 2025',
        score: 10,
        title: 'Wellness Retreat Dream',
        text: 'I came for a wellness retreat and it exceeded all expectations. The yoga pavilion overlooking the ocean is serene, the spa treatments are world-class, and the healthy dining options are delicious. Left feeling completely renewed.',
        tags: ['Solo', 'Ocean View Villa'],
        helpful: 28,
      },
      {
        id: 'rev4',
        name: 'Daniel Garcia',
        avatar: '/reviewer-1.jpg',
        date: 'Sep 2025',
        score: 8,
        title: 'Beautiful But Busy',
        text: 'Gorgeous property and excellent service. The beach can get a bit crowded during peak hours but the private pool compensates. Overall a wonderful stay and we would come back during a quieter season.',
        tags: ['Couple', 'Ocean View Villa'],
        helpful: 17,
      },
      {
        id: 'rev5',
        name: 'Olivia Wang',
        avatar: '/reviewer-2.jpg',
        date: 'Sep 2025',
        score: 10,
        title: 'Best Bali Experience',
        text: 'I\'ve been to Bali many times and this is hands down the best resort. The attention to detail is incredible - from the fresh flower arrangements to the personalized welcome drink. The Presidential Beach Villa is absolute heaven.',
        tags: ['Group', 'Presidential Beach Villa'],
        helpful: 43,
      },
      {
        id: 'rev6',
        name: 'Chris Anderson',
        avatar: '/reviewer-3.jpg',
        date: 'Aug 2025',
        score: 9,
        title: 'Perfect Honeymoon Spot',
        text: 'We chose this for our honeymoon and it was perfect in every way. Romantic private villa, amazing food, and the most beautiful sunsets. The staff even organized a private beach dinner for us. Pure magic!',
        tags: ['Couple', 'Garden Villa'],
        helpful: 35,
      },
    ],
    nearbyAttractions: [
      { name: 'Seminyak Beach', type: 'Beach', distance: '0.1 km', walkTime: '1 min' },
      { name: 'Petitenget Temple', type: 'Temple', distance: '0.5 km', walkTime: '6 min' },
      { name: 'Eat Street', type: 'Dining', distance: '0.3 km', walkTime: '4 min' },
      { name: 'Tanah Lot', type: 'Temple', distance: '12 km', walkTime: '20 min drive' },
      { name: 'Ubud Center', type: 'Culture', distance: '25 km', walkTime: '45 min drive' },
      { name: 'Waterbom Park', type: 'Fun', distance: '5 km', walkTime: '12 min drive' },
    ],
    similarProperties: [
      {
        id: 's1',
        name: 'Four Seasons Bali',
        image: '/hotel-1.jpg',
        location: 'Ubud, Bali',
        rating: 9.5,
        reviewCount: 1234,
        price: 450,
        tags: ['Luxury', 'Jungle View'],
      },
      {
        id: 's2',
        name: 'Ayana Resort',
        image: '/hotel-3.jpg',
        location: 'Jimbaran, Bali',
        rating: 9.2,
        reviewCount: 876,
        price: 320,
        tags: ['Cliffside', 'Spa'],
      },
      {
        id: 's3',
        name: 'Alila Seminyak',
        image: '/hotel-2.jpg',
        location: 'Seminyak, Bali',
        rating: 9.1,
        reviewCount: 654,
        price: 290,
        tags: ['Beachfront', 'Modern'],
      },
      {
        id: 's4',
        name: 'COMO Uma Ubud',
        image: '/hotel-6.jpg',
        location: 'Ubud, Bali',
        rating: 9.3,
        reviewCount: 543,
        price: 350,
        tags: ['Valley View', 'Wellness'],
      },
    ],
    mapCoordinates: { lat: -8.6901, lng: 115.1676 },
  },
};

export function getHotelById(id: string): HotelData {
  return hotelsData[id] || hotelsData['1'];
}
