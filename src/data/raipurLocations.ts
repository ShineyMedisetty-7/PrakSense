export interface RaipurLocation {
  id: string;
  name: string;
  category: 'landmark' | 'mall' | 'market' | 'transport' | 'parking' | 'mechanic' | 'restaurant';
  latitude: number;
  longitude: number;
  address: string;
  icon: string;
  rating?: number;
  services?: string[];
  contact?: string;
  cuisine?: string;
  priceRange?: string;
  popular?: string;
}

export const RAIPUR_LOCATIONS: RaipurLocation[] = [
  {
    id: 'loc-landmark-1',
    name: 'Marine Drive',
    category: 'landmark',
    latitude: 21.2514,
    longitude: 81.6296,
    address: 'Marine Drive, Raipur, Chhattisgarh',
    icon: '🌊'
  },
  {
    id: 'loc-landmark-2',
    name: 'Nandan Van Zoo',
    category: 'landmark',
    latitude: 21.1866,
    longitude: 81.6850,
    address: 'Naya Raipur, Atal Nagar, Chhattisgarh',
    icon: '🦁'
  },
  {
    id: 'loc-landmark-3',
    name: 'Telibandha Talab',
    category: 'landmark',
    latitude: 21.2270,
    longitude: 81.6730,
    address: 'Telibandha, Raipur, Chhattisgarh',
    icon: '🏞️'
  },
  {
    id: 'loc-landmark-4',
    name: 'Vivekananda Sarovar',
    category: 'landmark',
    latitude: 21.2395,
    longitude: 81.6789,
    address: 'Buddha Talab, Raipur, Chhattisgarh',
    icon: '🛶'
  },
  {
    id: 'loc-landmark-5',
    name: 'Mahant Ghasidas Museum',
    category: 'landmark',
    latitude: 21.2357,
    longitude: 81.6372,
    address: 'Civil Lines, Raipur, Chhattisgarh',
    icon: '🏛️'
  },
  {
    id: 'loc-landmark-6',
    name: 'Purkhouti Muktangan',
    category: 'landmark',
    latitude: 21.1726,
    longitude: 81.7398,
    address: 'Naya Raipur, Atal Nagar, Chhattisgarh',
    icon: '🎭'
  },
  {
    id: 'loc-landmark-7',
    name: 'Rajiv Smriti Van',
    category: 'landmark',
    latitude: 21.2550,
    longitude: 81.5889,
    address: 'GE Road, Raipur, Chhattisgarh',
    icon: '🌳'
  },
  {
    id: 'loc-mall-1',
    name: 'Magneto The Mall',
    category: 'mall',
    latitude: 21.2644,
    longitude: 81.6745,
    address: 'Labhandih, GE Road, Raipur, Chhattisgarh',
    icon: '🏬'
  },
  {
    id: 'loc-mall-2',
    name: 'City Center Mall 36',
    category: 'mall',
    latitude: 21.2367,
    longitude: 81.6542,
    address: 'Jail Road, Raipur, Chhattisgarh',
    icon: '🛍️'
  },
  {
    id: 'loc-market-1',
    name: 'Pandri Market',
    category: 'market',
    latitude: 21.2180,
    longitude: 81.6530,
    address: 'Pandri, Raipur, Chhattisgarh',
    icon: '🏪'
  },
  {
    id: 'loc-market-2',
    name: 'Sadar Bazaar',
    category: 'market',
    latitude: 21.2440,
    longitude: 81.6345,
    address: 'Civil Lines, Raipur, Chhattisgarh',
    icon: '🛒'
  },
  {
    id: 'loc-market-3',
    name: 'Ganj Para',
    category: 'market',
    latitude: 21.2425,
    longitude: 81.6285,
    address: 'Ganj Para, Raipur, Chhattisgarh',
    icon: '🏬'
  },
  {
    id: 'loc-market-4',
    name: 'Civil Lines Market',
    category: 'market',
    latitude: 21.2379,
    longitude: 81.6337,
    address: 'Civil Lines, Raipur, Chhattisgarh',
    icon: '🏪'
  },
  {
    id: 'loc-transport-1',
    name: 'Raipur Railway Station',
    category: 'transport',
    latitude: 21.2543,
    longitude: 81.6211,
    address: 'Station Road, Raipur, Chhattisgarh',
    icon: '🚂'
  },
  {
    id: 'loc-transport-2',
    name: 'Swami Vivekananda Airport',
    category: 'transport',
    latitude: 21.1804,
    longitude: 81.7388,
    address: 'Airport Road, Naya Raipur, Chhattisgarh',
    icon: '✈️'
  },
  {
    id: 'parking-1',
    name: 'Marine Drive Market Parking',
    category: 'parking',
    latitude: 21.2514,
    longitude: 81.6296,
    address: 'Marine Drive, Raipur',
    icon: '🅿️'
  },
  {
    id: 'parking-2',
    name: 'Civil Lines Parking',
    category: 'parking',
    latitude: 21.2379,
    longitude: 81.6337,
    address: 'Civil Lines, Raipur',
    icon: '🅿️'
  },
  {
    id: 'parking-3',
    name: 'GE Road Mall Parking',
    category: 'parking',
    latitude: 21.2497,
    longitude: 81.6077,
    address: 'GE Road, Raipur',
    icon: '🅿️'
  },
  {
    id: 'parking-4',
    name: 'Pandri Market Parking',
    category: 'parking',
    latitude: 21.2180,
    longitude: 81.6530,
    address: 'Pandri, Raipur',
    icon: '🅿️'
  },
  {
    id: 'parking-5',
    name: 'Telibandha Lake Parking',
    category: 'parking',
    latitude: 21.2270,
    longitude: 81.6730,
    address: 'Telibandha, Raipur',
    icon: '🅿️'
  },
  {
    id: 'parking-6',
    name: 'Railway Station Parking',
    category: 'parking',
    latitude: 21.2543,
    longitude: 81.6211,
    address: 'Raipur Junction',
    icon: '🅿️'
  },
  {
    id: 'parking-7',
    name: 'Magneto Mall Parking',
    category: 'parking',
    latitude: 21.2644,
    longitude: 81.6745,
    address: 'Magneto The Mall, Raipur',
    icon: '🅿️'
  },
  {
    id: 'parking-8',
    name: 'City Center Parking',
    category: 'parking',
    latitude: 21.2367,
    longitude: 81.6542,
    address: 'Jail Road, Raipur',
    icon: '🅿️'
  },
  {
    id: 'parking-9',
    name: 'Shankar Nagar Parking',
    category: 'parking',
    latitude: 21.2410,
    longitude: 81.6450,
    address: 'Shankar Nagar, Raipur',
    icon: '🅿️'
  },
  {
    id: 'parking-10',
    name: 'Jaistambh Chowk Parking',
    category: 'parking',
    latitude: 21.2300,
    longitude: 81.6400,
    address: 'Jaistambh Square, Raipur',
    icon: '🅿️'
  },
  {
    id: 'parking-11',
    name: 'NIT Raipur Parking',
    category: 'parking',
    latitude: 21.2498,
    longitude: 81.5952,
    address: 'GE Road, NIT Campus',
    icon: '🅿️'
  },
  {
    id: 'parking-12',
    name: 'Devendra Nagar Parking',
    category: 'parking',
    latitude: 21.2320,
    longitude: 81.6700,
    address: 'Devendra Nagar, Raipur',
    icon: '🅿️'
  },
  {
    id: 'parking-13',
    name: 'Mowa Overbridge Parking',
    category: 'parking',
    latitude: 21.2280,
    longitude: 81.6220,
    address: 'Mowa, Raipur',
    icon: '🅿️'
  },
  {
    id: 'parking-14',
    name: 'Fafadih Chowk Parking',
    category: 'parking',
    latitude: 21.2400,
    longitude: 81.6600,
    address: 'Fafadih, Raipur',
    icon: '🅿️'
  },
  {
    id: 'parking-15',
    name: 'Rajdhani College Parking',
    category: 'parking',
    latitude: 21.2450,
    longitude: 81.6150,
    address: 'Kota, Raipur',
    icon: '🅿️'
  },
  {
    id: 'mechanic-1',
    name: 'Highway Auto Care',
    category: 'mechanic',
    latitude: 21.2480,
    longitude: 81.6250,
    address: 'GE Road, Near Marine Drive, Raipur',
    icon: '🔧',
    rating: 4.5,
    services: ['Tire Repair', 'Oil Change', 'Engine Check', 'AC Repair'],
    contact: '+91 98765-43210'
  },
  {
    id: 'mechanic-2',
    name: 'RapidFix Service Center',
    category: 'mechanic',
    latitude: 21.2420,
    longitude: 81.6380,
    address: 'Civil Lines, Raipur',
    icon: '🔧',
    rating: 4.2,
    services: ['All Services', '24/7 Available', 'Towing', 'Battery Replacement'],
    contact: '+91 98765-43211'
  },
  {
    id: 'mechanic-3',
    name: 'QuickWheels Garage',
    category: 'mechanic',
    latitude: 21.2350,
    longitude: 81.6500,
    address: 'Pandri Road, Raipur',
    icon: '🔧',
    rating: 4.7,
    services: ['Puncture', 'Basic Repair', 'Oil Change', 'Brake Service'],
    contact: '+91 98765-43212'
  },
  {
    id: 'mechanic-4',
    name: 'TruckMech Pro',
    category: 'mechanic',
    latitude: 21.2550,
    longitude: 81.6180,
    address: 'Near Railway Station, Raipur',
    icon: '🔧',
    rating: 4.4,
    services: ['Heavy Vehicle Specialist', 'Brake Service', 'Suspension', 'Engine Overhaul'],
    contact: '+91 98765-43213'
  },
  {
    id: 'mechanic-5',
    name: 'SpeedyFix Auto',
    category: 'mechanic',
    latitude: 21.2600,
    longitude: 81.6700,
    address: 'Magneto Mall Road, Raipur',
    icon: '🔧',
    rating: 4.6,
    services: ['Quick Service', 'Towing', 'Battery Replacement', 'Electrical Work'],
    contact: '+91 98765-43214'
  },
  {
    id: 'mechanic-6',
    name: 'CarCare Expert',
    category: 'mechanic',
    latitude: 21.2450,
    longitude: 81.6600,
    address: 'Shankar Nagar, Raipur',
    icon: '🔧',
    rating: 4.3,
    services: ['Full Service', 'Denting & Painting', 'Wheel Alignment', 'AC Service'],
    contact: '+91 98765-43215'
  },
  {
    id: 'mechanic-7',
    name: 'Auto Rescue 24x7',
    category: 'mechanic',
    latitude: 21.2280,
    longitude: 81.6650,
    address: 'Telibandha, Raipur',
    icon: '🔧',
    rating: 4.8,
    services: ['Emergency Service', 'Towing', 'On-Spot Repair', 'Crane Service'],
    contact: '+91 98765-43216'
  },
  {
    id: 'restaurant-1',
    name: 'Punjabi Dhaba',
    category: 'restaurant',
    latitude: 21.2490,
    longitude: 81.6320,
    address: 'Marine Drive Road, Raipur',
    icon: '🍽️',
    rating: 4.3,
    cuisine: 'North Indian',
    priceRange: '₹₹',
    popular: 'Butter Chicken, Naan, Dal Makhani'
  },
  {
    id: 'restaurant-2',
    name: 'Highway Treats',
    category: 'restaurant',
    latitude: 21.2440,
    longitude: 81.6360,
    address: 'Civil Lines, Raipur',
    icon: '🍽️',
    rating: 4.1,
    cuisine: 'Fast Food',
    priceRange: '₹',
    popular: 'Burgers, Fries, Pizza'
  },
  {
    id: 'restaurant-3',
    name: 'Rajasthani Rasoi',
    category: 'restaurant',
    latitude: 21.2380,
    longitude: 81.6490,
    address: 'Pandri, Raipur',
    icon: '🍽️',
    rating: 4.5,
    cuisine: 'Rajasthani',
    priceRange: '₹₹₹',
    popular: 'Dal Baati, Thali, Gatte ki Sabzi'
  },
  {
    id: 'restaurant-4',
    name: 'Cafe Route',
    category: 'restaurant',
    latitude: 21.2520,
    longitude: 81.6240,
    address: 'Near Railway Station, Raipur',
    icon: '🍽️',
    rating: 4.4,
    cuisine: 'Cafe',
    priceRange: '₹₹',
    popular: 'Coffee, Sandwiches, Pasta'
  },
  {
    id: 'restaurant-5',
    name: 'Truck Stop Diner',
    category: 'restaurant',
    latitude: 21.2560,
    longitude: 81.6160,
    address: 'Station Road, Raipur',
    icon: '🍽️',
    rating: 4.0,
    cuisine: 'Multi-Cuisine',
    priceRange: '₹',
    popular: 'Meals, Chai, Paratha'
  },
  {
    id: 'restaurant-6',
    name: 'Spice Junction',
    category: 'restaurant',
    latitude: 21.2400,
    longitude: 81.6580,
    address: 'Shankar Nagar, Raipur',
    icon: '🍽️',
    rating: 4.6,
    cuisine: 'Indian',
    priceRange: '₹₹',
    popular: 'Curry, Biryani, Tandoori'
  },
  {
    id: 'restaurant-7',
    name: 'Green Bites',
    category: 'restaurant',
    latitude: 21.2620,
    longitude: 81.6720,
    address: 'Near Magneto Mall, Raipur',
    icon: '🍽️',
    rating: 4.2,
    cuisine: 'Healthy',
    priceRange: '₹₹',
    popular: 'Salads, Smoothies, Wraps'
  },
  {
    id: 'restaurant-8',
    name: 'Royal Feast',
    category: 'restaurant',
    latitude: 21.2340,
    longitude: 81.6420,
    address: 'City Center Area, Raipur',
    icon: '🍽️',
    rating: 4.7,
    cuisine: 'Fine Dining',
    priceRange: '₹₹₹',
    popular: 'Continental, Indian, Chinese'
  },
  {
    id: 'restaurant-9',
    name: 'Dosa Point',
    category: 'restaurant',
    latitude: 21.2460,
    longitude: 81.6640,
    address: 'Devendra Nagar, Raipur',
    icon: '🍽️',
    rating: 4.3,
    cuisine: 'South Indian',
    priceRange: '₹',
    popular: 'Masala Dosa, Idli, Vada'
  },
  {
    id: 'restaurant-10',
    name: 'Chinese Dragon',
    category: 'restaurant',
    latitude: 21.2300,
    longitude: 81.6680,
    address: 'Telibandha, Raipur',
    icon: '🍽️',
    rating: 4.4,
    cuisine: 'Chinese',
    priceRange: '₹₹',
    popular: 'Fried Rice, Noodles, Manchurian'
  }
];

export const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'landmark': return 'bg-blue-100 text-blue-800';
    case 'mall': return 'bg-purple-100 text-purple-800';
    case 'market': return 'bg-orange-100 text-orange-800';
    case 'transport': return 'bg-red-100 text-red-800';
    case 'parking': return 'bg-green-100 text-green-800';
    case 'mechanic': return 'bg-red-100 text-red-800';
    case 'restaurant': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getCategoryLabel = (category: string): string => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

export const searchLocations = (query: string): RaipurLocation[] => {
  if (!query || query.length < 2) return [];

  const lowerQuery = query.toLowerCase();

  return RAIPUR_LOCATIONS.filter(location => {
    const nameMatch = location.name.toLowerCase().includes(lowerQuery);
    const addressMatch = location.address.toLowerCase().includes(lowerQuery);
    const categoryMatch = location.category.toLowerCase().includes(lowerQuery);

    return nameMatch || addressMatch || categoryMatch;
  }).slice(0, 8);
};

export const calculateHaversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
};
