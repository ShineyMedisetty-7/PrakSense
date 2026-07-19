import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type ANPRDetection = Database['public']['Tables']['anpr_detections']['Row'];
type ANPRDetectionInsert = Database['public']['Tables']['anpr_detections']['Insert'];

export const anprService = {
  async getANPRDetections(limit: number = 50): Promise<ANPRDetection[]> {
    const { data, error } = await supabase
      .from('anpr_detections')
      .select('*')
      .order('detection_time', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching ANPR detections:', error);
      throw error;
    }

    return data || [];
  },

  async getDetectionsByZone(zoneId: string, limit: number = 20): Promise<ANPRDetection[]> {
    const { data, error } = await supabase
      .from('anpr_detections')
      .select('*')
      .eq('zone_id', zoneId)
      .order('detection_time', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching zone detections:', error);
      throw error;
    }

    return data || [];
  },

  async getRecentDetectionsByVehicle(vehicleNumber: string): Promise<ANPRDetection[]> {
    const { data, error } = await supabase
      .from('anpr_detections')
      .select('*')
      .eq('vehicle_number', vehicleNumber)
      .order('detection_time', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching vehicle detections:', error);
      throw error;
    }

    return data || [];
  },

  async createANPRDetection(detection: ANPRDetectionInsert): Promise<ANPRDetection | null> {
    const { data, error } = await supabase
      .from('anpr_detections')
      .insert(detection)
      .select()
      .single();

    if (error) {
      console.error('Error creating ANPR detection:', error);
      throw error;
    }

    return data;
  },

  subscribeToANPRDetections(
    callback: (detection: ANPRDetection) => void
  ) {
    const channel = supabase
      .channel('anpr-detections-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'anpr_detections',
        },
        (payload) => {
          callback(payload.new as ANPRDetection);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  async getDetectionStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('anpr_detections')
      .select('detection_type')
      .gte('detection_time', today.toISOString());

    if (error) {
      console.error('Error fetching detection stats:', error);
      return { totalDetections: 0, entries: 0, exits: 0 };
    }

    const totalDetections = data.length;
    const entries = data.filter(d => d.detection_type === 'entry').length;
    const exits = data.filter(d => d.detection_type === 'exit').length;

    return { totalDetections, entries, exits };
  },
};
