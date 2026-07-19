export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      parking_zones: {
        Row: {
          id: string;
          zone_name: string;
          location: string;
          total_spots: number;
          occupied_spots: number;
          latitude: number;
          longitude: number;
          base_price: number;
          current_price: number;
          price_multiplier: number;
          has_ev_charging: boolean;
          is_covered: boolean;
          status: 'online' | 'offline';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          zone_name: string;
          location: string;
          total_spots: number;
          occupied_spots?: number;
          latitude: number;
          longitude: number;
          base_price: number;
          current_price: number;
          price_multiplier?: number;
          has_ev_charging?: boolean;
          is_covered?: boolean;
          status?: 'online' | 'offline';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          zone_name?: string;
          location?: string;
          total_spots?: number;
          occupied_spots?: number;
          latitude?: number;
          longitude?: number;
          base_price?: number;
          current_price?: number;
          price_multiplier?: number;
          has_ev_charging?: boolean;
          is_covered?: boolean;
          status?: 'online' | 'offline';
          created_at?: string;
          updated_at?: string;
        };
      };
      parking_sessions: {
        Row: {
          id: string;
          zone_id: string;
          vehicle_number: string;
          spot_number: string;
          entry_time: string;
          exit_time: string | null;
          duration_minutes: number | null;
          base_amount: number | null;
          surge_amount: number | null;
          total_amount: number | null;
          payment_status: 'pending' | 'completed' | 'failed';
          created_at: string;
        };
        Insert: {
          id?: string;
          zone_id: string;
          vehicle_number: string;
          spot_number: string;
          entry_time?: string;
          exit_time?: string | null;
          duration_minutes?: number | null;
          base_amount?: number | null;
          surge_amount?: number | null;
          total_amount?: number | null;
          payment_status?: 'pending' | 'completed' | 'failed';
          created_at?: string;
        };
        Update: {
          id?: string;
          zone_id?: string;
          vehicle_number?: string;
          spot_number?: string;
          entry_time?: string;
          exit_time?: string | null;
          duration_minutes?: number | null;
          base_amount?: number | null;
          surge_amount?: number | null;
          total_amount?: number | null;
          payment_status?: 'pending' | 'completed' | 'failed';
          created_at?: string;
        };
      };
      anpr_detections: {
        Row: {
          id: string;
          camera_id: string;
          vehicle_number: string;
          detection_time: string;
          detection_type: 'entry' | 'exit';
          confidence_score: number;
          image_url: string | null;
          zone_id: string;
          spot_number: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          camera_id: string;
          vehicle_number: string;
          detection_time?: string;
          detection_type: 'entry' | 'exit';
          confidence_score?: number;
          image_url?: string | null;
          zone_id: string;
          spot_number: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          camera_id?: string;
          vehicle_number?: string;
          detection_time?: string;
          detection_type?: 'entry' | 'exit';
          confidence_score?: number;
          image_url?: string | null;
          zone_id?: string;
          spot_number?: string;
          created_at?: string;
        };
      };
      revenue_analytics: {
        Row: {
          id: string;
          analytics_date: string;
          zone_id: string;
          total_revenue: number;
          total_sessions: number;
          peak_hour: string | null;
          avg_duration_minutes: number | null;
          avg_revenue_per_session: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          analytics_date: string;
          zone_id: string;
          total_revenue?: number;
          total_sessions?: number;
          peak_hour?: string | null;
          avg_duration_minutes?: number | null;
          avg_revenue_per_session?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          analytics_date?: string;
          zone_id?: string;
          total_revenue?: number;
          total_sessions?: number;
          peak_hour?: string | null;
          avg_duration_minutes?: number | null;
          avg_revenue_per_session?: number | null;
          created_at?: string;
        };
      };
      pricing_rules: {
        Row: {
          id: string;
          zone_id: string;
          rule_name: string;
          rule_type: 'hourly' | 'daily' | 'dynamic' | 'event';
          base_price: number;
          peak_multiplier: number;
          off_peak_multiplier: number;
          occupancy_threshold_high: number;
          occupancy_threshold_low: number;
          is_active: boolean;
          effective_from: string;
          effective_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          zone_id: string;
          rule_name: string;
          rule_type: 'hourly' | 'daily' | 'dynamic' | 'event';
          base_price: number;
          peak_multiplier?: number;
          off_peak_multiplier?: number;
          occupancy_threshold_high?: number;
          occupancy_threshold_low?: number;
          is_active?: boolean;
          effective_from?: string;
          effective_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          zone_id?: string;
          rule_name?: string;
          rule_type?: 'hourly' | 'daily' | 'dynamic' | 'event';
          base_price?: number;
          peak_multiplier?: number;
          off_peak_multiplier?: number;
          occupancy_threshold_high?: number;
          occupancy_threshold_low?: number;
          is_active?: boolean;
          effective_from?: string;
          effective_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
