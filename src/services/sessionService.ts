import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type ParkingSession = Database['public']['Tables']['parking_sessions']['Row'];
type ParkingSessionInsert = Database['public']['Tables']['parking_sessions']['Insert'];

export const sessionService = {
  async createParkingSession(
    session: ParkingSessionInsert
  ): Promise<ParkingSession | null> {
    const { data, error } = await supabase
      .from('parking_sessions')
      .insert(session)
      .select()
      .single();

    if (error) {
      console.error('Error creating parking session:', error);
      throw error;
    }

    return data;
  },

  async endParkingSession(
    sessionId: string,
    exitTime: string,
    baseAmount: number,
    surgeAmount: number = 0
  ): Promise<ParkingSession | null> {
    const { data, error } = await supabase
      .from('parking_sessions')
      .update({
        exit_time: exitTime,
        base_amount: baseAmount,
        surge_amount: surgeAmount,
        payment_status: 'completed',
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      console.error('Error ending parking session:', error);
      throw error;
    }

    return data;
  },

  async getActiveSessions(): Promise<ParkingSession[]> {
    const { data, error } = await supabase
      .from('parking_sessions')
      .select('*')
      .is('exit_time', null)
      .order('entry_time', { ascending: false });

    if (error) {
      console.error('Error fetching active sessions:', error);
      throw error;
    }

    return data || [];
  },

  async getSessionsByZone(zoneId: string): Promise<ParkingSession[]> {
    const { data, error } = await supabase
      .from('parking_sessions')
      .select('*')
      .eq('zone_id', zoneId)
      .order('entry_time', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching zone sessions:', error);
      throw error;
    }

    return data || [];
  },

  async getSessionHistory(
    startDate?: string,
    endDate?: string,
    zoneId?: string
  ): Promise<ParkingSession[]> {
    let query = supabase
      .from('parking_sessions')
      .select('*')
      .not('exit_time', 'is', null)
      .order('entry_time', { ascending: false });

    if (startDate) {
      query = query.gte('entry_time', startDate);
    }

    if (endDate) {
      query = query.lte('entry_time', endDate);
    }

    if (zoneId) {
      query = query.eq('zone_id', zoneId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching session history:', error);
      throw error;
    }

    return data || [];
  },

  async getTodaySessions(): Promise<ParkingSession[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('parking_sessions')
      .select('*')
      .gte('entry_time', today.toISOString());

    if (error) {
      console.error('Error fetching today sessions:', error);
      throw error;
    }

    return data || [];
  },

  async getSessionStats() {
    const sessions = await this.getTodaySessions();

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.payment_status === 'completed');
    const totalRevenue = completedSessions.reduce(
      (sum, s) => sum + (s.total_amount || 0),
      0
    );

    const avgDuration = completedSessions.length > 0
      ? Math.round(
          completedSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) /
            completedSessions.length
        )
      : 0;

    return {
      totalSessions,
      completedSessions: completedSessions.length,
      totalRevenue,
      avgDuration,
    };
  },

  subscribeToSessions(
    callback: (session: ParkingSession) => void
  ) {
    const channel = supabase
      .channel('parking-sessions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'parking_sessions',
        },
        (payload) => {
          callback(payload.new as ParkingSession);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
