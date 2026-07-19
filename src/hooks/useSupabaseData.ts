import { useState, useEffect, useCallback } from 'react';
import { parkingService } from '../services/parkingService';
import { anprService } from '../services/anprService';
import { sessionService } from '../services/sessionService';
import { revenueService } from '../services/revenueService';
import { pricingService } from '../services/pricingService';
import type { ParkingZone, ANPRDetection } from '../types';

export const useSupabaseData = () => {
  const [zones, setZones] = useState<ParkingZone[]>([]);
  const [anprDetections, setAnprDetections] = useState<ANPRDetection[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [todaySessions, setTodaySessions] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadParkingZones = useCallback(async () => {
    try {
      const dbZones = await parkingService.getParkingZones();

      const mappedZones: ParkingZone[] = dbZones.map((zone) => ({
        id: zone.id,
        name: zone.zone_name,
        location: zone.location,
        totalSpots: zone.total_spots,
        occupiedSpots: zone.occupied_spots,
        latitude: Number(zone.latitude),
        longitude: Number(zone.longitude),
        basePrice: Number(zone.base_price),
        currentPrice: Number(zone.current_price),
        priceMultiplier: Number(zone.price_multiplier),
        hasEVCharging: zone.has_ev_charging,
        isCovered: zone.is_covered,
        status: zone.status,
      }));

      setZones(mappedZones);
    } catch (err) {
      console.error('Error loading parking zones:', err);
      setError('Failed to load parking zones');
    }
  }, []);

  const loadANPRDetections = useCallback(async () => {
    try {
      const dbDetections = await anprService.getANPRDetections(50);

      const mappedDetections: ANPRDetection[] = dbDetections.map((detection) => ({
        id: detection.id,
        plateNumber: detection.vehicle_number,
        timestamp: new Date(detection.detection_time),
        zoneName: zones.find((z) => z.id === detection.zone_id)?.name || 'Unknown',
        type: detection.detection_type,
        spotNumber: detection.spot_number,
      }));

      setAnprDetections(mappedDetections);
    } catch (err) {
      console.error('Error loading ANPR detections:', err);
      setError('Failed to load ANPR detections');
    }
  }, [zones]);

  const loadRevenueData = useCallback(async () => {
    try {
      const revenue = await revenueService.getTodayRevenue();
      setTotalRevenue(revenue);

      const stats = await sessionService.getSessionStats();
      setTodaySessions(stats.totalSessions);
    } catch (err) {
      console.error('Error loading revenue data:', err);
      setError('Failed to load revenue data');
    }
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await loadParkingZones();
      setLoading(false);
    };

    initializeData();
  }, [loadParkingZones]);

  useEffect(() => {
    if (zones.length > 0) {
      loadANPRDetections();
      loadRevenueData();
    }
  }, [zones.length, loadANPRDetections, loadRevenueData]);

  useEffect(() => {
    const unsubscribeZones = parkingService.subscribeToParkingZones((updatedZones) => {
      const mappedZones: ParkingZone[] = updatedZones.map((zone) => ({
        id: zone.id,
        name: zone.zone_name,
        location: zone.location,
        totalSpots: zone.total_spots,
        occupiedSpots: zone.occupied_spots,
        latitude: Number(zone.latitude),
        longitude: Number(zone.longitude),
        basePrice: Number(zone.base_price),
        currentPrice: Number(zone.current_price),
        priceMultiplier: Number(zone.price_multiplier),
        hasEVCharging: zone.has_ev_charging,
        isCovered: zone.is_covered,
        status: zone.status,
      }));
      setZones(mappedZones);
    });

    const unsubscribeANPR = anprService.subscribeToANPRDetections((newDetection) => {
      const zoneName = zones.find((z) => z.id === newDetection.zone_id)?.name || 'Unknown';

      const mappedDetection: ANPRDetection = {
        id: newDetection.id,
        plateNumber: newDetection.vehicle_number,
        timestamp: new Date(newDetection.detection_time),
        zoneName,
        type: newDetection.detection_type,
        spotNumber: newDetection.spot_number,
      };

      setAnprDetections((prev) => [mappedDetection, ...prev].slice(0, 50));

      if (newDetection.detection_type === 'exit') {
        loadRevenueData();
      }
    });

    return () => {
      unsubscribeZones();
      unsubscribeANPR();
    };
  }, [zones, loadRevenueData]);

  const getTotalStats = useCallback(() => {
    const totalSpots = zones.reduce((sum, z) => sum + z.totalSpots, 0);
    const totalOccupied = zones.reduce((sum, z) => sum + z.occupiedSpots, 0);
    const totalAvailable = totalSpots - totalOccupied;

    return {
      totalSpots,
      totalOccupied,
      totalAvailable,
      occupancyRate: totalSpots > 0 ? ((totalOccupied / totalSpots) * 100).toFixed(1) : '0',
    };
  }, [zones]);

  const refreshData = useCallback(async () => {
    await loadParkingZones();
    await loadANPRDetections();
    await loadRevenueData();
  }, [loadParkingZones, loadANPRDetections, loadRevenueData]);

  return {
    zones,
    anprDetections,
    totalRevenue,
    todaySessions,
    loading,
    error,
    getTotalStats,
    refreshData,
  };
};
