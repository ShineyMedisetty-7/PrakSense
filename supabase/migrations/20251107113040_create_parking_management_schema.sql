/*
  # Parking Management System - Complete Database Schema

  ## Overview
  This migration creates the complete database schema for the ParkSense AI-Powered 
  Parking Management System. It includes tables for parking zones, sessions, ANPR 
  detections, revenue analytics, and dynamic pricing rules.

  ## Tables Created

  ### 1. parking_zones
  Stores information about parking areas across the city
  - `id` (uuid, primary key) - Unique identifier
  - `zone_name` (text) - Name of the parking zone
  - `location` (text) - Physical address/location description
  - `total_spots` (integer) - Total parking capacity
  - `occupied_spots` (integer) - Currently occupied spots
  - `latitude` (numeric) - GPS latitude coordinate
  - `longitude` (numeric) - GPS longitude coordinate
  - `base_price` (numeric) - Base hourly rate
  - `current_price` (numeric) - Current dynamic price
  - `price_multiplier` (numeric) - Dynamic pricing multiplier
  - `has_ev_charging` (boolean) - EV charging availability
  - `is_covered` (boolean) - Covered parking indicator
  - `status` (text) - Zone status (online/offline)
  - `created_at` (timestamp) - Record creation time
  - `updated_at` (timestamp) - Last update time

  ### 2. parking_sessions
  Tracks individual parking sessions from entry to exit
  - `id` (uuid, primary key)
  - `zone_id` (uuid, foreign key to parking_zones)
  - `vehicle_number` (text) - License plate number
  - `spot_number` (text) - Assigned parking spot
  - `entry_time` (timestamp) - Vehicle entry time
  - `exit_time` (timestamp, nullable) - Vehicle exit time
  - `duration_minutes` (integer, nullable) - Parking duration
  - `base_amount` (numeric, nullable) - Base parking fee
  - `surge_amount` (numeric, nullable) - Dynamic pricing surge
  - `total_amount` (numeric, nullable) - Total payment amount
  - `payment_status` (text) - pending/completed/failed
  - `created_at` (timestamp)

  ### 3. anpr_detections
  Logs Automatic Number Plate Recognition detections
  - `id` (uuid, primary key)
  - `camera_id` (text) - ANPR camera identifier
  - `vehicle_number` (text) - Detected plate number
  - `detection_time` (timestamp) - Detection timestamp
  - `detection_type` (text) - entry/exit
  - `confidence_score` (numeric) - Recognition confidence (0-1)
  - `image_url` (text, nullable) - Stored image reference
  - `zone_id` (uuid, foreign key to parking_zones)
  - `spot_number` (text) - Associated parking spot
  - `created_at` (timestamp)

  ### 4. revenue_analytics
  Aggregated daily revenue and analytics data
  - `id` (uuid, primary key)
  - `analytics_date` (date) - Date for analytics
  - `zone_id` (uuid, foreign key to parking_zones)
  - `total_revenue` (numeric) - Total revenue for the day
  - `total_sessions` (integer) - Number of parking sessions
  - `peak_hour` (text) - Peak usage time period
  - `avg_duration_minutes` (integer) - Average parking duration
  - `avg_revenue_per_session` (numeric) - Average revenue per session
  - `created_at` (timestamp)

  ### 5. pricing_rules
  Dynamic pricing rules and configurations
  - `id` (uuid, primary key)
  - `zone_id` (uuid, foreign key to parking_zones)
  - `rule_name` (text) - Descriptive rule name
  - `rule_type` (text) - hourly/daily/dynamic/event
  - `base_price` (numeric) - Base pricing amount
  - `peak_multiplier` (numeric) - Peak hours multiplier
  - `off_peak_multiplier` (numeric) - Off-peak hours multiplier
  - `occupancy_threshold_high` (numeric) - High demand threshold (%)
  - `occupancy_threshold_low` (numeric) - Low demand threshold (%)
  - `is_active` (boolean) - Rule active status
  - `effective_from` (timestamp) - Rule start time
  - `effective_to` (timestamp, nullable) - Rule end time
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Public read access for parking zones (for mobile app users)
  - Authenticated users can view sessions and detections
  - Only authenticated users can insert/update operational data

  ## Indexes
  - Created on foreign keys for optimal query performance
  - Time-based indexes for analytics queries
  - Zone-based indexes for location queries
*/

-- Create parking_zones table
CREATE TABLE IF NOT EXISTS parking_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_name text NOT NULL,
  location text NOT NULL,
  total_spots integer NOT NULL CHECK (total_spots > 0),
  occupied_spots integer NOT NULL DEFAULT 0 CHECK (occupied_spots >= 0),
  latitude numeric(10, 8) NOT NULL,
  longitude numeric(11, 8) NOT NULL,
  base_price numeric(10, 2) NOT NULL CHECK (base_price >= 0),
  current_price numeric(10, 2) NOT NULL CHECK (current_price >= 0),
  price_multiplier numeric(3, 2) NOT NULL DEFAULT 1.0 CHECK (price_multiplier >= 0),
  has_ev_charging boolean DEFAULT false,
  is_covered boolean DEFAULT false,
  status text NOT NULL DEFAULT 'online' CHECK (status IN ('online', 'offline')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create parking_sessions table
CREATE TABLE IF NOT EXISTS parking_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id uuid NOT NULL REFERENCES parking_zones(id) ON DELETE CASCADE,
  vehicle_number text NOT NULL,
  spot_number text NOT NULL,
  entry_time timestamptz NOT NULL DEFAULT now(),
  exit_time timestamptz,
  duration_minutes integer CHECK (duration_minutes >= 0),
  base_amount numeric(10, 2) CHECK (base_amount >= 0),
  surge_amount numeric(10, 2) DEFAULT 0 CHECK (surge_amount >= 0),
  total_amount numeric(10, 2) CHECK (total_amount >= 0),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  created_at timestamptz DEFAULT now()
);

-- Create anpr_detections table
CREATE TABLE IF NOT EXISTS anpr_detections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  camera_id text NOT NULL,
  vehicle_number text NOT NULL,
  detection_time timestamptz NOT NULL DEFAULT now(),
  detection_type text NOT NULL CHECK (detection_type IN ('entry', 'exit')),
  confidence_score numeric(3, 2) NOT NULL DEFAULT 0.95 CHECK (confidence_score >= 0 AND confidence_score <= 1),
  image_url text,
  zone_id uuid NOT NULL REFERENCES parking_zones(id) ON DELETE CASCADE,
  spot_number text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create revenue_analytics table
CREATE TABLE IF NOT EXISTS revenue_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analytics_date date NOT NULL,
  zone_id uuid NOT NULL REFERENCES parking_zones(id) ON DELETE CASCADE,
  total_revenue numeric(12, 2) NOT NULL DEFAULT 0 CHECK (total_revenue >= 0),
  total_sessions integer NOT NULL DEFAULT 0 CHECK (total_sessions >= 0),
  peak_hour text,
  avg_duration_minutes integer CHECK (avg_duration_minutes >= 0),
  avg_revenue_per_session numeric(10, 2) CHECK (avg_revenue_per_session >= 0),
  created_at timestamptz DEFAULT now(),
  UNIQUE(analytics_date, zone_id)
);

-- Create pricing_rules table
CREATE TABLE IF NOT EXISTS pricing_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id uuid NOT NULL REFERENCES parking_zones(id) ON DELETE CASCADE,
  rule_name text NOT NULL,
  rule_type text NOT NULL CHECK (rule_type IN ('hourly', 'daily', 'dynamic', 'event')),
  base_price numeric(10, 2) NOT NULL CHECK (base_price >= 0),
  peak_multiplier numeric(3, 2) NOT NULL DEFAULT 1.5 CHECK (peak_multiplier >= 1.0),
  off_peak_multiplier numeric(3, 2) NOT NULL DEFAULT 0.8 CHECK (off_peak_multiplier > 0),
  occupancy_threshold_high numeric(3, 2) NOT NULL DEFAULT 0.85 CHECK (occupancy_threshold_high >= 0 AND occupancy_threshold_high <= 1),
  occupancy_threshold_low numeric(3, 2) NOT NULL DEFAULT 0.30 CHECK (occupancy_threshold_low >= 0 AND occupancy_threshold_low <= 1),
  is_active boolean DEFAULT true,
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_parking_sessions_zone_id ON parking_sessions(zone_id);
CREATE INDEX IF NOT EXISTS idx_parking_sessions_entry_time ON parking_sessions(entry_time);
CREATE INDEX IF NOT EXISTS idx_parking_sessions_vehicle_number ON parking_sessions(vehicle_number);
CREATE INDEX IF NOT EXISTS idx_parking_sessions_payment_status ON parking_sessions(payment_status);

CREATE INDEX IF NOT EXISTS idx_anpr_detections_zone_id ON anpr_detections(zone_id);
CREATE INDEX IF NOT EXISTS idx_anpr_detections_detection_time ON anpr_detections(detection_time);
CREATE INDEX IF NOT EXISTS idx_anpr_detections_vehicle_number ON anpr_detections(vehicle_number);

CREATE INDEX IF NOT EXISTS idx_revenue_analytics_date ON revenue_analytics(analytics_date);
CREATE INDEX IF NOT EXISTS idx_revenue_analytics_zone_id ON revenue_analytics(zone_id);

CREATE INDEX IF NOT EXISTS idx_pricing_rules_zone_id ON pricing_rules(zone_id);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_is_active ON pricing_rules(is_active);

-- Enable Row Level Security
ALTER TABLE parking_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE anpr_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for parking_zones (public read access)
CREATE POLICY "Public can view parking zones"
  ON parking_zones FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update parking zones"
  ON parking_zones FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert parking zones"
  ON parking_zones FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for parking_sessions
CREATE POLICY "Public can view parking sessions"
  ON parking_sessions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert parking sessions"
  ON parking_sessions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update parking sessions"
  ON parking_sessions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for anpr_detections
CREATE POLICY "Public can view ANPR detections"
  ON anpr_detections FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert ANPR detections"
  ON anpr_detections FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for revenue_analytics
CREATE POLICY "Public can view revenue analytics"
  ON revenue_analytics FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert revenue analytics"
  ON revenue_analytics FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update revenue analytics"
  ON revenue_analytics FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for pricing_rules
CREATE POLICY "Public can view active pricing rules"
  ON pricing_rules FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage pricing rules"
  ON pricing_rules FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_parking_zones_updated_at
  BEFORE UPDATE ON parking_zones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_rules_updated_at
  BEFORE UPDATE ON pricing_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate parking session totals
CREATE OR REPLACE FUNCTION calculate_session_total()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.exit_time IS NOT NULL AND NEW.entry_time IS NOT NULL THEN
    NEW.duration_minutes = EXTRACT(EPOCH FROM (NEW.exit_time - NEW.entry_time)) / 60;
    NEW.total_amount = COALESCE(NEW.base_amount, 0) + COALESCE(NEW.surge_amount, 0);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for session calculations
CREATE TRIGGER calculate_parking_session_total
  BEFORE INSERT OR UPDATE ON parking_sessions
  FOR EACH ROW
  EXECUTE FUNCTION calculate_session_total();
