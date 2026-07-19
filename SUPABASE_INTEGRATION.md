# Supabase Backend Integration Guide

## Overview

This parking management system now uses Supabase as its backend database, providing real-time data synchronization, persistent storage, and scalable infrastructure.

## Features Implemented

### 1. Database Schema
Complete database schema with the following tables:
- **parking_zones**: Stores parking area information with real-time occupancy
- **parking_sessions**: Tracks vehicle parking sessions from entry to exit
- **anpr_detections**: Logs ANPR camera detections for vehicle tracking
- **revenue_analytics**: Daily aggregated revenue and analytics data
- **pricing_rules**: Dynamic pricing configurations per zone

### 2. Real-Time Subscriptions
- Live parking zone occupancy updates
- Real-time ANPR detection feed
- Automatic revenue calculations on session completion

### 3. Service Layer
Complete TypeScript service layer for all database operations:
- `parkingService.ts`: Parking zone management
- `anprService.ts`: ANPR detection handling
- `sessionService.ts`: Parking session tracking
- `revenueService.ts`: Revenue analytics and reporting
- `pricingService.ts`: Dynamic pricing calculations

### 4. UI Integration
- Loading states with spinner
- Error handling with retry functionality
- Toggle between real Supabase data and demo simulation
- Data source indicator in navigation bar

## Setup Instructions

### Environment Variables
The following environment variables are already configured in `.env`:
```
VITE_SUPABASE_URL=https://tvwdlxswoabjnqrpydhb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Database Setup
The database schema has been automatically applied with:
- All tables created with proper constraints
- Row Level Security (RLS) enabled
- Indexes for optimal query performance
- Triggers for automatic timestamp updates

### Seed Data
Sample data has been inserted:
- 15 parking zones across Raipur city
- Pricing rules for dynamic pricing
- Sample ANPR detections
- Test parking sessions

## Usage

### Keyboard Shortcuts
- **1-5**: Switch between different views
- **P**: Toggle presentation mode
- **R**: Refresh data from Supabase
- **D**: Toggle between Real Data and Demo Mode

### Data Source Toggle
The application can switch between:
- **Real Data**: Live data from Supabase with real-time updates
- **Demo Mode**: Simulated data for demonstration purposes

### API Services

#### Parking Service
```typescript
import { parkingService } from './services/parkingService';

// Fetch all parking zones
const zones = await parkingService.getParkingZones();

// Update occupancy
await parkingService.updateParkingOccupancy(zoneId, occupiedSpots);

// Subscribe to real-time updates
const unsubscribe = parkingService.subscribeToParkingZones((zones) => {
  console.log('Updated zones:', zones);
});
```

#### ANPR Service
```typescript
import { anprService } from './services/anprService';

// Fetch recent detections
const detections = await anprService.getANPRDetections(50);

// Create new detection
await anprService.createANPRDetection({
  camera_id: 'CAM-001',
  vehicle_number: 'CG04AB1234',
  detection_type: 'entry',
  zone_id: 'zone-id',
  spot_number: 'A45'
});

// Subscribe to real-time detections
const unsubscribe = anprService.subscribeToANPRDetections((detection) => {
  console.log('New detection:', detection);
});
```

#### Session Service
```typescript
import { sessionService } from './services/sessionService';

// Create parking session
await sessionService.createParkingSession({
  zone_id: 'zone-id',
  vehicle_number: 'CG04AB1234',
  spot_number: 'A45'
});

// End parking session
await sessionService.endParkingSession(
  sessionId,
  exitTime,
  baseAmount,
  surgeAmount
);

// Get today's sessions
const sessions = await sessionService.getTodaySessions();
```

#### Revenue Service
```typescript
import { revenueService } from './services/revenueService';

// Get today's revenue
const revenue = await revenueService.getTodayRevenue();

// Get revenue by date range
const analytics = await revenueService.getRevenueByDateRange(
  '2025-01-01',
  '2025-01-31'
);

// Get revenue insights
const insights = await revenueService.getRevenueInsights();
```

#### Pricing Service
```typescript
import { pricingService } from './services/pricingService';

// Calculate dynamic price
const { price, multiplier } = pricingService.calculateDynamicPrice(
  basePrice,
  occupancyRate,
  rule
);

// Update zone pricing
await pricingService.calculateAndUpdateZonePricing(zoneId, occupancyRate);

// Get active pricing rules
const rules = await pricingService.getPricingRules(zoneId);
```

## Database Schema

### parking_zones
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| zone_name | text | Name of parking zone |
| location | text | Physical address |
| total_spots | integer | Total capacity |
| occupied_spots | integer | Currently occupied |
| latitude | numeric | GPS latitude |
| longitude | numeric | GPS longitude |
| base_price | numeric | Base hourly rate |
| current_price | numeric | Current dynamic price |
| price_multiplier | numeric | Pricing multiplier |
| has_ev_charging | boolean | EV charging available |
| is_covered | boolean | Covered parking |
| status | text | online/offline |

### parking_sessions
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| zone_id | uuid | Foreign key to parking_zones |
| vehicle_number | text | License plate |
| spot_number | text | Parking spot number |
| entry_time | timestamptz | Entry timestamp |
| exit_time | timestamptz | Exit timestamp (nullable) |
| duration_minutes | integer | Calculated duration |
| base_amount | numeric | Base parking fee |
| surge_amount | numeric | Dynamic pricing surge |
| total_amount | numeric | Total payment |
| payment_status | text | pending/completed/failed |

### anpr_detections
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| camera_id | text | Camera identifier |
| vehicle_number | text | Detected plate |
| detection_time | timestamptz | Detection timestamp |
| detection_type | text | entry/exit |
| confidence_score | numeric | Recognition confidence |
| zone_id | uuid | Foreign key to parking_zones |
| spot_number | text | Associated spot |

## Security

### Row Level Security (RLS)
All tables have RLS enabled with appropriate policies:
- Public read access for parking zones (mobile app users)
- Authenticated access for operational data
- Secure write operations for system updates

### Authentication
The system uses Supabase's anonymous key for public read operations. For production:
1. Implement Supabase Auth for admin users
2. Set up role-based access control
3. Secure sensitive operations with authentication

## Performance Optimizations

### Indexes
- Foreign key indexes for joins
- Time-based indexes for analytics queries
- Zone-based indexes for location queries

### Real-Time Subscriptions
- Efficient channel management
- Automatic reconnection handling
- Optimized payload filtering

## Troubleshooting

### Connection Issues
If you encounter connection errors:
1. Verify environment variables are set correctly
2. Check Supabase project status
3. Ensure network connectivity

### Data Not Loading
If data doesn't load:
1. Press 'R' to refresh data
2. Check browser console for errors
3. Verify database contains seed data
4. Toggle to Demo Mode with 'D' key

### Build Errors
If build fails:
```bash
npm run build
```
Check for TypeScript errors and missing dependencies.

## Future Enhancements

1. **Authentication**: Add Supabase Auth for admin access
2. **Storage**: Integrate Supabase Storage for ANPR images
3. **Edge Functions**: Add serverless functions for complex operations
4. **Analytics**: Enhanced reporting with Supabase analytics
5. **Mobile App**: Native mobile app with offline support

## Support

For issues or questions:
1. Check Supabase documentation: https://supabase.com/docs
2. Review service layer code in `src/services/`
3. Inspect database schema in Supabase dashboard
4. Check browser console for detailed errors
