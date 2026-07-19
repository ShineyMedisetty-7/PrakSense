// Initial data for Raipur parking zones and realistic simulation
import { ParkingZone, OccupancyDataPoint, RevenueByZone } from '../types';

export const RAIPUR_ZONES: ParkingZone[] = [
  {
    id: 'zone-1',
    name: 'Marine Drive Market',
    location: 'Marine Drive, Raipur',
    totalSpots: 150,
    occupiedSpots: 105,
    latitude: 21.2514,
    longitude: 81.6296,
    basePrice: 30,
    currentPrice: 45,
    priceMultiplier: 1.5,
    hasEVCharging: true,
    isCovered: true,
    status: 'online'
  },
  {
    id: 'zone-2',
    name: 'Civil Lines',
    location: 'Civil Lines, Raipur',
    totalSpots: 200,
    occupiedSpots: 180,
    latitude: 21.2379,
    longitude: 81.6337,
    basePrice: 40,
    currentPrice: 80,
    priceMultiplier: 2.0,
    hasEVCharging: true,
    isCovered: true,
    status: 'online'
  },
  {
    id: 'zone-3',
    name: 'GE Road Mall',
    location: 'GE Road, Raipur',
    totalSpots: 180,
    occupiedSpots: 95,
    latitude: 21.2497,
    longitude: 81.6077,
    basePrice: 35,
    currentPrice: 42,
    priceMultiplier: 1.2,
    hasEVCharging: false,
    isCovered: true,
    status: 'online'
  },
  {
    id: 'zone-4',
    name: 'Pandri Market',
    location: 'Pandri, Raipur',
    totalSpots: 120,
    occupiedSpots: 115,
    latitude: 21.2180,
    longitude: 81.6530,
    basePrice: 25,
    currentPrice: 55,
    priceMultiplier: 2.2,
    hasEVCharging: false,
    isCovered: false,
    status: 'online'
  },
  {
    id: 'zone-5',
    name: 'Telibandha Lake',
    location: 'Telibandha, Raipur',
    totalSpots: 100,
    occupiedSpots: 35,
    latitude: 21.2270,
    longitude: 81.6730,
    basePrice: 20,
    currentPrice: 16,
    priceMultiplier: 0.8,
    hasEVCharging: false,
    isCovered: false,
    status: 'online'
  },
  {
    id: 'zone-6',
    name: 'Railway Station',
    location: 'Raipur Junction',
    totalSpots: 250,
    occupiedSpots: 220,
    latitude: 21.2543,
    longitude: 81.6211,
    basePrice: 50,
    currentPrice: 100,
    priceMultiplier: 2.0,
    hasEVCharging: true,
    isCovered: true,
    status: 'online'
  },
  {
    id: 'zone-7',
    name: 'Magneto Mall',
    location: 'Magneto The Mall, Raipur',
    totalSpots: 300,
    occupiedSpots: 165,
    latitude: 21.2644,
    longitude: 81.6745,
    basePrice: 30,
    currentPrice: 33,
    priceMultiplier: 1.1,
    hasEVCharging: true,
    isCovered: true,
    status: 'online'
  },
  {
    id: 'zone-8',
    name: 'City Center',
    location: 'Jail Road, Raipur',
    totalSpots: 175,
    occupiedSpots: 140,
    latitude: 21.2367,
    longitude: 81.6542,
    basePrice: 35,
    currentPrice: 63,
    priceMultiplier: 1.8,
    hasEVCharging: true,
    isCovered: true,
    status: 'online'
  },
  {
    id: 'zone-9',
    name: 'Shankar Nagar',
    location: 'Shankar Nagar, Raipur',
    totalSpots: 130,
    occupiedSpots: 85,
    latitude: 21.2410,
    longitude: 81.6450,
    basePrice: 25,
    currentPrice: 30,
    priceMultiplier: 1.2,
    hasEVCharging: false,
    isCovered: false,
    status: 'online'
  },
  {
    id: 'zone-10',
    name: 'Jaistambh Chowk',
    location: 'Jaistambh Square, Raipur',
    totalSpots: 90,
    occupiedSpots: 78,
    latitude: 21.2300,
    longitude: 81.6400,
    basePrice: 30,
    currentPrice: 48,
    priceMultiplier: 1.6,
    hasEVCharging: true,
    isCovered: true,
    status: 'online'
  },
  {
    id: 'zone-11',
    name: 'NIT Raipur',
    location: 'GE Road, NIT Campus',
    totalSpots: 200,
    occupiedSpots: 120,
    latitude: 21.2498,
    longitude: 81.5952,
    basePrice: 20,
    currentPrice: 24,
    priceMultiplier: 1.2,
    hasEVCharging: true,
    isCovered: false,
    status: 'online'
  },
  {
    id: 'zone-12',
    name: 'Devendra Nagar',
    location: 'Devendra Nagar, Raipur',
    totalSpots: 110,
    occupiedSpots: 45,
    latitude: 21.2320,
    longitude: 81.6700,
    basePrice: 20,
    currentPrice: 16,
    priceMultiplier: 0.8,
    hasEVCharging: false,
    isCovered: false,
    status: 'online'
  },
  {
    id: 'zone-13',
    name: 'Mowa Overbridge',
    location: 'Mowa, Raipur',
    totalSpots: 160,
    occupiedSpots: 145,
    latitude: 21.2280,
    longitude: 81.6220,
    basePrice: 35,
    currentPrice: 70,
    priceMultiplier: 2.0,
    hasEVCharging: true,
    isCovered: true,
    status: 'online'
  },
  {
    id: 'zone-14',
    name: 'Fafadih Chowk',
    location: 'Fafadih, Raipur',
    totalSpots: 85,
    occupiedSpots: 50,
    latitude: 21.2400,
    longitude: 81.6600,
    basePrice: 25,
    currentPrice: 30,
    priceMultiplier: 1.2,
    hasEVCharging: false,
    isCovered: false,
    status: 'online'
  },
  {
    id: 'zone-15',
    name: 'Rajdhani College',
    location: 'Kota, Raipur',
    totalSpots: 140,
    occupiedSpots: 65,
    latitude: 21.2450,
    longitude: 81.6150,
    basePrice: 20,
    currentPrice: 22,
    priceMultiplier: 1.1,
    hasEVCharging: false,
    isCovered: false,
    status: 'online'
  }
];

// Generate realistic occupancy data for last 24 hours
export const generateOccupancyData = (): OccupancyDataPoint[] => {
  const data: OccupancyDataPoint[] = [];
  const now = new Date();

  for (let i = 23; i >= 0; i--) {
    const hour = new Date(now.getTime() - i * 60 * 60 * 1000).getHours();
    let occupancyRate = 0.4; // Base rate

    // Morning rush (7-9 AM)
    if (hour >= 7 && hour <= 9) occupancyRate = 0.75;
    // Lunch time (12-2 PM)
    else if (hour >= 12 && hour <= 14) occupancyRate = 0.85;
    // Evening peak (5-9 PM)
    else if (hour >= 17 && hour <= 21) occupancyRate = 0.9;
    // Night time (10 PM - 6 AM)
    else if (hour >= 22 || hour <= 6) occupancyRate = 0.2;

    const totalCapacity = 1475; // Sum of all zones
    const occupied = Math.floor(totalCapacity * occupancyRate);

    data.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      occupancy: occupied,
      available: totalCapacity - occupied
    });
  }

  return data;
};

// Generate revenue by zone data
export const generateRevenueData = (): RevenueByZone[] => {
  return RAIPUR_ZONES.map(zone => ({
    zone: zone.name.split(' ')[0], // Short name
    revenue: Math.floor(Math.random() * 50000) + 20000,
    sessions: Math.floor(Math.random() * 200) + 50
  }));
};

// Indian number plate generator (CG prefix for Chhattisgarh)
export const generatePlateNumber = (): string => {
  const prefixes = ['CG04', 'CG07', 'CG20', 'CG09', 'CG01'];
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const letter1 = letters[Math.floor(Math.random() * letters.length)];
  const letter2 = letters[Math.floor(Math.random() * letters.length)];
  const numbers = Math.floor(Math.random() * 9000) + 1000;

  return `${prefix}${letter1}${letter2}${numbers}`;
};

// Popular Raipur destinations for autocomplete
export const RAIPUR_DESTINATIONS = [
  'Marine Drive Market',
  'Civil Lines',
  'GE Road Mall',
  'Pandri Market',
  'Telibandha Lake',
  'Raipur Railway Station',
  'Magneto Mall',
  'City Center Mall',
  'Rajdhani College',
  'NIT Raipur',
  'Jaistambh Chowk',
  'Fafadih Chowk',
  'Mowa Overbridge',
  'Shankar Nagar',
  'Devendra Nagar'
];
