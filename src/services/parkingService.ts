import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type ParkingZone = Database['public']['Tables']['parking_zones']['Row'];
type ParkingZoneInsert = Database['public']['Tables']['parking_zones']['Insert'];
type ParkingZoneUpdate = Database['public']['Tables']['parking_zones']['Update'];

export const parkingService = {
  async getParkingZones(): Promise<ParkingZone[]> {
    const { data, error } = await supabase
      .from('parking_zones')
      .select('*')
      .eq('status', 'online')
      .order('zone_name');

    if (error) {
      console.error('Error fetching parking zones:', error);
      throw error;
    }

    return data || [];
  },

  async getParkingZoneById(zoneId: string): Promise<ParkingZone | null> {
    const { data, error } = await supabase
      .from('parking_zones')
      .select('*')
      .eq('id', zoneId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching parking zone:', error);
      throw error;
    }

    return data;
  },

  async updateParkingOccupancy(
    zoneId: string,
    occupiedSpots: number
  ): Promise<ParkingZone | null> {
    const { data, error } = await supabase
      .from('parking_zones')
      .update({ occupied_spots: occupiedSpots })
      .eq('id', zoneId)
      .select()
      .single();

    if (error) {
      console.error('Error updating parking occupancy:', error);
      throw error;
    }

    return data;
  },

  async updateZonePrice(
    zoneId: string,
    currentPrice: number,
    priceMultiplier: number
  ): Promise<ParkingZone | null> {
    const { data, error } = await supabase
      .from('parking_zones')
      .update({
        current_price: currentPrice,
        price_multiplier: priceMultiplier,
      })
      .eq('id', zoneId)
      .select()
      .single();

    if (error) {
      console.error('Error updating zone price:', error);
      throw error;
    }

    return data;
  },

  async createParkingZone(zone: ParkingZoneInsert): Promise<ParkingZone | null> {
    const { data, error } = await supabase
      .from('parking_zones')
      .insert(zone)
      .select()
      .single();

    if (error) {
      console.error('Error creating parking zone:', error);
      throw error;
    }

    return data;
  },

  subscribeToParkingZones(
    callback: (zones: ParkingZone[]) => void
  ) {
    const channel = supabase
      .channel('parking-zones-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'parking_zones',
        },
        async () => {
          const zones = await this.getParkingZones();
          callback(zones);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  async getTotalStats() {
    const zones = await this.getParkingZones();

    const totalSpots = zones.reduce((sum, zone) => sum + zone.total_spots, 0);
    const totalOccupied = zones.reduce((sum, zone) => sum + zone.occupied_spots, 0);
    const totalAvailable = totalSpots - totalOccupied;
    const occupancyRate = totalSpots > 0
      ? Math.round((totalOccupied / totalSpots) * 100)
      : 0;

    return {
      totalSpots,
      totalOccupied,
      totalAvailable,
      occupancyRate,
    };
  },
};
