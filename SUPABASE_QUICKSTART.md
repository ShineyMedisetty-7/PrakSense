# Supabase Integration - Quick Start Guide

## What's Been Integrated

Your parking management system now has a fully functional Supabase backend with:

✅ **Database Schema** - 5 tables with proper relationships and constraints
✅ **Real-Time Updates** - Live parking occupancy and ANPR detections
✅ **Service Layer** - Complete TypeScript API for all operations
✅ **Sample Data** - 15 parking zones, 50 ANPR detections, 30+ sessions
✅ **UI Integration** - Loading states, error handling, and data toggle
✅ **Security** - Row Level Security (RLS) policies on all tables

## Quick Test

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open the application** and you'll see "Real Data" indicator in the top-right

3. **Test keyboard shortcuts:**
   - Press `D` to toggle between Real Data and Demo Mode
   - Press `R` to refresh data from Supabase
   - Press `1-5` to switch between views

## Using the System

### View Real-Time Data
- The Dashboard automatically loads data from Supabase
- Zone occupancy updates in real-time
- ANPR detections appear as they're added to the database

### Switch Data Sources
- **Real Data Mode**: Shows live data from Supabase database
- **Demo Mode**: Shows simulated data (original behavior)
- Toggle with the `D` key or by clicking the indicator

### Test the API

Open browser console and try:

```javascript
// Import services (only works in dev)
import { parkingService } from './services/parkingService';

// Get all zones
const zones = await parkingService.getParkingZones();
console.log(zones);

// Update a zone's occupancy
await parkingService.updateParkingOccupancy(zones[0].id, 50);
```

## Data Simulator

To continuously generate test data, open the console and run:

```javascript
import { dataSimulator } from './utils/dataSimulator';

// Start simulating vehicle entries/exits every 5 seconds
dataSimulator.start(5000);

// Stop the simulator
dataSimulator.stop();

// Update all zone prices based on occupancy
await dataSimulator.updateDynamicPricing();
```

## Database Access

### View Data in Supabase Dashboard
1. Go to your Supabase project: https://tvwdlxswoabjnqrpydhb.supabase.co
2. Navigate to Table Editor
3. View and edit data in any table

### Direct SQL Queries
Use the SQL Editor in Supabase dashboard:

```sql
-- View all zones with occupancy
SELECT zone_name, occupied_spots, total_spots,
       ROUND((occupied_spots::numeric / total_spots) * 100, 1) as occupancy_rate
FROM parking_zones
ORDER BY occupancy_rate DESC;

-- Today's revenue
SELECT SUM(total_amount) as total_revenue,
       COUNT(*) as session_count
FROM parking_sessions
WHERE entry_time >= CURRENT_DATE
AND payment_status = 'completed';

-- Recent ANPR detections
SELECT vehicle_number, detection_type, detection_time,
       (SELECT zone_name FROM parking_zones WHERE id = anpr_detections.zone_id) as zone
FROM anpr_detections
ORDER BY detection_time DESC
LIMIT 10;
```

## API Services Documentation

### 1. Parking Service
```typescript
import { parkingService } from './services/parkingService';

// Get all online parking zones
const zones = await parkingService.getParkingZones();

// Get specific zone
const zone = await parkingService.getParkingZoneById('zone-id');

// Update occupancy
await parkingService.updateParkingOccupancy('zone-id', 75);

// Subscribe to real-time updates
const unsubscribe = parkingService.subscribeToParkingZones((zones) => {
  console.log('Zones updated:', zones);
});
// Later: unsubscribe();
```

### 2. ANPR Service
```typescript
import { anprService } from './services/anprService';

// Get recent detections
const detections = await anprService.getANPRDetections(50);

// Create new detection
await anprService.createANPRDetection({
  camera_id: 'CAM-001',
  vehicle_number: 'CG04AB1234',
  detection_type: 'entry',
  zone_id: 'zone-id',
  spot_number: 'A45'
});

// Subscribe to new detections
const unsubscribe = anprService.subscribeToANPRDetections((detection) => {
  console.log('New detection:', detection);
});
```

### 3. Session Service
```typescript
import { sessionService } from './services/sessionService';

// Create parking session
await sessionService.createParkingSession({
  zone_id: 'zone-id',
  vehicle_number: 'CG04AB1234',
  spot_number: 'A45'
});

// End session with payment
await sessionService.endParkingSession(
  'session-id',
  new Date().toISOString(),
  45.50,  // base amount
  10.25   // surge amount
);

// Get active sessions
const active = await sessionService.getActiveSessions();

// Get today's stats
const stats = await sessionService.getSessionStats();
```

### 4. Revenue Service
```typescript
import { revenueService } from './services/revenueService';

// Today's revenue
const revenue = await revenueService.getTodayRevenue();

// Revenue by date range
const analytics = await revenueService.getRevenueByDateRange(
  '2025-01-01',
  '2025-01-31'
);

// Revenue insights with comparison
const insights = await revenueService.getRevenueInsights();
console.log(`Today: ₹${insights.todayRevenue}`);
console.log(`Change: ${insights.changePercent}%`);
```

### 5. Pricing Service
```typescript
import { pricingService } from './services/pricingService';

// Calculate dynamic price
const result = pricingService.calculateDynamicPrice(
  30,    // base price
  0.85,  // occupancy rate (85%)
  rule   // optional pricing rule
);
console.log(`Price: ₹${result.price}, Multiplier: ${result.multiplier}`);

// Update zone pricing
await pricingService.calculateAndUpdateZonePricing('zone-id', 0.85);

// Get pricing rules
const rules = await pricingService.getPricingRules('zone-id');
```

## Troubleshooting

### "Loading parking data..." stays forever
- Check browser console for errors
- Verify Supabase environment variables in `.env`
- Press `D` to switch to Demo Mode as fallback

### No data showing
- Verify database has seed data (check Supabase dashboard)
- Press `R` to refresh data
- Check network tab for failed requests

### Real-time updates not working
- Check Supabase Realtime is enabled in project settings
- Verify no network/firewall blocking WebSocket connections
- Check browser console for subscription errors

## Files Structure

```
src/
├── lib/
│   └── supabase.ts              # Supabase client configuration
├── types/
│   └── database.ts              # TypeScript database types
├── services/
│   ├── parkingService.ts        # Parking zone operations
│   ├── anprService.ts           # ANPR detection operations
│   ├── sessionService.ts        # Session management
│   ├── revenueService.ts        # Revenue analytics
│   └── pricingService.ts        # Dynamic pricing
├── hooks/
│   ├── useSimulation.ts         # Demo mode simulation
│   └── useSupabaseData.ts       # Real data hook
└── utils/
    └── dataSimulator.ts         # Test data generator
```

## Next Steps

1. **Test the system** with real-time updates
2. **Add more seed data** if needed
3. **Customize pricing rules** for your use case
4. **Add authentication** for admin features (optional)
5. **Deploy to production** when ready

## Need Help?

- Check `SUPABASE_INTEGRATION.md` for detailed documentation
- Review service files in `src/services/` for API examples
- Inspect database schema in Supabase dashboard
- Check browser console for detailed error messages

---

**Status:** ✅ Fully Integrated and Tested
**Database:** ✅ Schema Applied with Seed Data
**Services:** ✅ All 5 services implemented
**UI:** ✅ Loading states and error handling added
**Build:** ✅ Passes successfully
