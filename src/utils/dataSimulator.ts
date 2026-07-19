import { parkingService } from '../services/parkingService';
import { anprService } from '../services/anprService';
import { sessionService } from '../services/sessionService';
import { generatePlateNumber } from '../data/initialData';

export class DataSimulator {
  private intervalId: number | null = null;
  private isRunning = false;

  async start(intervalMs: number = 5000) {
    if (this.isRunning) {
      console.warn('Simulator is already running');
      return;
    }

    this.isRunning = true;
    console.log('Starting data simulator...');

    this.intervalId = window.setInterval(async () => {
      await this.simulateVehicleActivity();
    }, intervalMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.isRunning = false;
      console.log('Data simulator stopped');
    }
  }

  private async simulateVehicleActivity() {
    try {
      const zones = await parkingService.getParkingZones();
      if (zones.length === 0) return;

      const randomZone = zones[Math.floor(Math.random() * zones.length)];
      const isEntry = Math.random() > 0.5;

      if (isEntry && randomZone.occupied_spots < randomZone.total_spots) {
        await this.simulateEntry(randomZone);
      } else if (!isEntry && randomZone.occupied_spots > 0) {
        await this.simulateExit(randomZone);
      }
    } catch (error) {
      console.error('Error simulating vehicle activity:', error);
    }
  }

  private async simulateEntry(zone: { id: string; name: string; occupied_spots: number; total_spots: number }) {
    const plateNumber = generatePlateNumber();
    const spotNumber = `${zone.name.substring(0, 1)}${Math.floor(Math.random() * 999) + 1}`;

    await anprService.createANPRDetection({
      camera_id: `CAM-${Math.floor(Math.random() * 10) + 1}`,
      vehicle_number: plateNumber,
      detection_type: 'entry',
      zone_id: zone.id,
      spot_number: spotNumber,
      confidence_score: 0.92 + Math.random() * 0.08,
    });

    await sessionService.createParkingSession({
      zone_id: zone.id,
      vehicle_number: plateNumber,
      spot_number: spotNumber,
      payment_status: 'pending',
    });

    await parkingService.updateParkingOccupancy(zone.id, zone.occupied_spots + 1);

    console.log(`Vehicle ${plateNumber} entered ${zone.name}`);
  }

  private async simulateExit(zone: { id: string; name: string; occupied_spots: number }) {
    const plateNumber = generatePlateNumber();
    const spotNumber = `${zone.name.substring(0, 1)}${Math.floor(Math.random() * 999) + 1}`;

    const activeSessions = await sessionService.getSessionsByZone(zone.id);
    const activeSession = activeSessions.find((s) => !s.exit_time);

    if (activeSession) {
      const now = new Date().toISOString();
      const baseAmount = 30 + Math.random() * 70;
      const surgeAmount = 5 + Math.random() * 15;

      await sessionService.endParkingSession(
        activeSession.id,
        now,
        baseAmount,
        surgeAmount
      );

      await anprService.createANPRDetection({
        camera_id: `CAM-${Math.floor(Math.random() * 10) + 1}`,
        vehicle_number: activeSession.vehicle_number,
        detection_type: 'exit',
        zone_id: zone.id,
        spot_number: activeSession.spot_number,
        confidence_score: 0.92 + Math.random() * 0.08,
      });

      await parkingService.updateParkingOccupancy(zone.id, Math.max(0, zone.occupied_spots - 1));

      console.log(`Vehicle ${activeSession.vehicle_number} exited ${zone.name}`);
    }
  }

  async updateDynamicPricing() {
    try {
      const zones = await parkingService.getParkingZones();

      for (const zone of zones) {
        const occupancyRate = zone.occupied_spots / zone.total_spots;

        let multiplier = 1.0;
        if (occupancyRate > 0.9) multiplier = 2.5;
        else if (occupancyRate > 0.7) multiplier = 1.8;
        else if (occupancyRate > 0.5) multiplier = 1.3;
        else if (occupancyRate < 0.3) multiplier = 0.8;

        const newPrice = Math.round(zone.base_price * multiplier);

        await parkingService.updateZonePrice(
          zone.id,
          newPrice,
          Math.round(multiplier * 10) / 10
        );
      }

      console.log('Dynamic pricing updated for all zones');
    } catch (error) {
      console.error('Error updating dynamic pricing:', error);
    }
  }
}

export const dataSimulator = new DataSimulator();
