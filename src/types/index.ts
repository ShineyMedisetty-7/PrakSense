// Core data types for ParkSense system

export interface ParkingZone {
  id: string;
  name: string;
  location: string;
  totalSpots: number;
  occupiedSpots: number;
  latitude: number;
  longitude: number;
  basePrice: number;
  currentPrice: number;
  priceMultiplier: number;
  hasEVCharging: boolean;
  isCovered: boolean;
  status: 'online' | 'offline';
}

export interface Vehicle {
  plateNumber: string;
  entryTime: Date;
  exitTime?: Date;
  zoneId: string;
  spotNumber: string;
  duration?: number;
  amount?: number;
}

export interface ANPRDetection {
  id: string;
  plateNumber: string;
  timestamp: Date;
  zoneName: string;
  type: 'entry' | 'exit';
  duration?: number;
  spotNumber: string;
}

export interface Reservation {
  id: string;
  userId: string;
  zoneId: string;
  zoneName: string;
  spotNumber: string;
  reservationTime: Date;
  expiresAt: Date;
  qrCode: string;
  status: 'active' | 'expired' | 'completed';
}

export interface ParkingSession {
  id: string;
  plateNumber: string;
  zoneId: string;
  zoneName: string;
  entryTime: Date;
  exitTime?: Date;
  duration: number;
  baseAmount: number;
  surgeAmount: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'completed';
}

export interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  icon: string;
}

export interface OccupancyDataPoint {
  time: string;
  occupancy: number;
  available: number;
}

export interface RevenueByZone {
  zone: string;
  revenue: number;
  sessions: number;
}

export type ViewMode = 'dashboard' | 'mobile' | 'analytics' | 'pricing' | 'route';
export type ScenarioMode = 'normal' | 'morning-rush' | 'evening-peak' | 'weekend' | 'event';
