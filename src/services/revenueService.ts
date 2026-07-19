import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type RevenueAnalytics = Database['public']['Tables']['revenue_analytics']['Row'];
type RevenueAnalyticsInsert = Database['public']['Tables']['revenue_analytics']['Insert'];

export const revenueService = {
  async getTodayRevenue(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('parking_sessions')
      .select('total_amount')
      .gte('entry_time', today.toISOString())
      .eq('payment_status', 'completed');

    if (error) {
      console.error('Error fetching today revenue:', error);
      throw error;
    }

    return data.reduce((sum, session) => sum + (session.total_amount || 0), 0);
  },

  async getRevenueByDateRange(
    startDate: string,
    endDate: string
  ): Promise<RevenueAnalytics[]> {
    const { data, error } = await supabase
      .from('revenue_analytics')
      .select('*')
      .gte('analytics_date', startDate)
      .lte('analytics_date', endDate)
      .order('analytics_date', { ascending: true });

    if (error) {
      console.error('Error fetching revenue by date range:', error);
      throw error;
    }

    return data || [];
  },

  async getRevenueByZone(zoneId: string): Promise<RevenueAnalytics[]> {
    const { data, error } = await supabase
      .from('revenue_analytics')
      .select('*')
      .eq('zone_id', zoneId)
      .order('analytics_date', { ascending: false })
      .limit(30);

    if (error) {
      console.error('Error fetching zone revenue:', error);
      throw error;
    }

    return data || [];
  },

  async getTodayRevenueByZone(): Promise<{ zone_id: string; revenue: number }[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('parking_sessions')
      .select('zone_id, total_amount')
      .gte('entry_time', today.toISOString())
      .eq('payment_status', 'completed');

    if (error) {
      console.error('Error fetching today revenue by zone:', error);
      throw error;
    }

    const revenueByZone = data.reduce((acc, session) => {
      const existing = acc.find(item => item.zone_id === session.zone_id);
      if (existing) {
        existing.revenue += session.total_amount || 0;
      } else {
        acc.push({
          zone_id: session.zone_id,
          revenue: session.total_amount || 0,
        });
      }
      return acc;
    }, [] as { zone_id: string; revenue: number }[]);

    return revenueByZone;
  },

  async updateDailyRevenue(date: string): Promise<void> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const { data: sessions, error: sessionsError } = await supabase
      .from('parking_sessions')
      .select('zone_id, total_amount, duration_minutes')
      .gte('entry_time', startOfDay.toISOString())
      .lte('entry_time', endOfDay.toISOString())
      .eq('payment_status', 'completed');

    if (sessionsError) {
      console.error('Error fetching sessions for daily revenue:', sessionsError);
      throw sessionsError;
    }

    const zoneStats = sessions.reduce((acc, session) => {
      if (!acc[session.zone_id]) {
        acc[session.zone_id] = {
          total_revenue: 0,
          total_sessions: 0,
          total_duration: 0,
        };
      }

      acc[session.zone_id].total_revenue += session.total_amount || 0;
      acc[session.zone_id].total_sessions += 1;
      acc[session.zone_id].total_duration += session.duration_minutes || 0;

      return acc;
    }, {} as Record<string, { total_revenue: number; total_sessions: number; total_duration: number }>);

    const analyticsRecords: RevenueAnalyticsInsert[] = Object.entries(zoneStats).map(
      ([zoneId, stats]) => ({
        analytics_date: date,
        zone_id: zoneId,
        total_revenue: stats.total_revenue,
        total_sessions: stats.total_sessions,
        avg_duration_minutes:
          stats.total_sessions > 0
            ? Math.round(stats.total_duration / stats.total_sessions)
            : 0,
        avg_revenue_per_session:
          stats.total_sessions > 0
            ? Math.round((stats.total_revenue / stats.total_sessions) * 100) / 100
            : 0,
        peak_hour: '6 PM - 8 PM',
      })
    );

    for (const record of analyticsRecords) {
      const { error } = await supabase
        .from('revenue_analytics')
        .upsert(record, {
          onConflict: 'analytics_date,zone_id',
        });

      if (error) {
        console.error('Error upserting revenue analytics:', error);
      }
    }
  },

  async getRevenueInsights() {
    const todayRevenue = await this.getTodayRevenue();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const yesterdayEnd = new Date(yesterday);
    yesterdayEnd.setHours(23, 59, 59, 999);

    const { data: yesterdaySessions, error } = await supabase
      .from('parking_sessions')
      .select('total_amount')
      .gte('entry_time', yesterday.toISOString())
      .lte('entry_time', yesterdayEnd.toISOString())
      .eq('payment_status', 'completed');

    if (error) {
      console.error('Error fetching yesterday revenue:', error);
      return { todayRevenue, changePercent: 0 };
    }

    const yesterdayRevenue = yesterdaySessions.reduce(
      (sum, s) => sum + (s.total_amount || 0),
      0
    );

    const changePercent =
      yesterdayRevenue > 0
        ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
        : 0;

    return {
      todayRevenue,
      yesterdayRevenue,
      changePercent: Math.round(changePercent * 10) / 10,
    };
  },
};
