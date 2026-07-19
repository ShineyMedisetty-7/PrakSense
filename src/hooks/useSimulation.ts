// Real-time simulation engine for live demo
import { useState, useEffect, useCallback } from 'react';
import { ParkingZone, ANPRDetection, ScenarioMode } from '../types';
import { RAIPUR_ZONES, generatePlateNumber } from '../data/initialData';

export const useSimulation = (demoSpeed: number = 1, scenario: ScenarioMode = 'normal') => {
  const [zones, setZones] = useState<ParkingZone[]>(RAIPUR_ZONES);
  const [anprDetections, setAnprDetections] = useState<ANPRDetection[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(45320);
  const [todaySessions, setTodaySessions] = useState<number>(892);

  // Calculate scenario-specific occupancy rates
  const getScenarioMultiplier = useCallback((): { occupancy: number; priceBoost: number } => {
    switch (scenario) {
      case 'morning-rush':
        return { occupancy: 1.3, priceBoost: 1.4 };
      case 'evening-peak':
        return { occupancy: 1.5, priceBoost: 1.8 };
      case 'weekend':
        return { occupancy: 0.7, priceBoost: 0.9 };
      case 'event':
        return { occupancy: 1.8, priceBoost: 2.5 };
      default:
        return { occupancy: 1.0, priceBoost: 1.0 };
    }
  }, [scenario]);

  // Simulate vehicle entry or exit
  const simulateVehicleMovement = useCallback(() => {
    setZones(prevZones => {
      const updatedZones = [...prevZones];
      const randomZone = updatedZones[Math.floor(Math.random() * updatedZones.length)];

      if (!randomZone || randomZone.status === 'offline') return prevZones;

      const isEntry = Math.random() > 0.5;
      const multiplier = getScenarioMultiplier();

      if (isEntry && randomZone.occupiedSpots < randomZone.totalSpots) {
        // Vehicle entry
        randomZone.occupiedSpots += 1;

        const plateNumber = generatePlateNumber();
        const spotNumber = `${randomZone.name.substring(0, 1)}${Math.floor(Math.random() * 999) + 1}`;

        const detection: ANPRDetection = {
          id: `anpr-${Date.now()}-${Math.random()}`,
          plateNumber,
          timestamp: new Date(),
          zoneName: randomZone.name,
          type: 'entry',
          spotNumber
        };

        setAnprDetections(prev => [detection, ...prev].slice(0, 50));
      } else if (!isEntry && randomZone.occupiedSpots > 0) {
        // Vehicle exit
        randomZone.occupiedSpots -= 1;

        const plateNumber = generatePlateNumber();
        const duration = Math.floor(Math.random() * 180) + 15; // 15-195 minutes
        const spotNumber = `${randomZone.name.substring(0, 1)}${Math.floor(Math.random() * 999) + 1}`;

        const detection: ANPRDetection = {
          id: `anpr-${Date.now()}-${Math.random()}`,
          plateNumber,
          timestamp: new Date(),
          zoneName: randomZone.name,
          type: 'exit',
          duration,
          spotNumber
        };

        setAnprDetections(prev => [detection, ...prev].slice(0, 50));

        // Calculate revenue
        const hours = Math.ceil(duration / 60);
        const revenue = randomZone.currentPrice * hours;
        setTotalRevenue(prev => prev + revenue);
        setTodaySessions(prev => prev + 1);
      }

      // Update dynamic pricing based on occupancy
      const occupancyRate = randomZone.occupiedSpots / randomZone.totalSpots;
      let newMultiplier = 1.0;

      if (occupancyRate > 0.9) newMultiplier = 2.5 * multiplier.priceBoost;
      else if (occupancyRate > 0.7) newMultiplier = 1.8 * multiplier.priceBoost;
      else if (occupancyRate > 0.5) newMultiplier = 1.3 * multiplier.priceBoost;
      else if (occupancyRate < 0.3) newMultiplier = 0.8 * multiplier.priceBoost;

      randomZone.priceMultiplier = Math.round(newMultiplier * 10) / 10;
      randomZone.currentPrice = Math.round(randomZone.basePrice * newMultiplier);

      return updatedZones;
    });
  }, [getScenarioMultiplier]);

  // Run simulation at specified speed
  useEffect(() => {
    const interval = setInterval(() => {
      simulateVehicleMovement();
    }, Math.max(100, 3000 / demoSpeed)); // Faster with higher demo speed

    return () => clearInterval(interval);
  }, [demoSpeed, simulateVehicleMovement]);

  const getTotalStats = useCallback(() => {
    const totalSpots = zones.reduce((sum, z) => sum + z.totalSpots, 0);
    const totalOccupied = zones.reduce((sum, z) => sum + z.occupiedSpots, 0);
    const totalAvailable = totalSpots - totalOccupied;

    return {
      totalSpots,
      totalOccupied,
      totalAvailable,
      occupancyRate: ((totalOccupied / totalSpots) * 100).toFixed(1)
    };
  }, [zones]);

  const resetSimulation = useCallback(() => {
    setZones(RAIPUR_ZONES);
    setAnprDetections([]);
    setTotalRevenue(45320);
    setTodaySessions(892);
  }, []);

  return {
    zones,
    anprDetections,
    totalRevenue,
    todaySessions,
    getTotalStats,
    resetSimulation
  };
};
