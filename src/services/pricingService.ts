import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type PricingRule = Database['public']['Tables']['pricing_rules']['Row'];
type PricingRuleInsert = Database['public']['Tables']['pricing_rules']['Insert'];
type PricingRuleUpdate = Database['public']['Tables']['pricing_rules']['Update'];

export const pricingService = {
  async getPricingRules(zoneId?: string): Promise<PricingRule[]> {
    let query = supabase
      .from('pricing_rules')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (zoneId) {
      query = query.eq('zone_id', zoneId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching pricing rules:', error);
      throw error;
    }

    return data || [];
  },

  async getPricingRuleById(ruleId: string): Promise<PricingRule | null> {
    const { data, error } = await supabase
      .from('pricing_rules')
      .select('*')
      .eq('id', ruleId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching pricing rule:', error);
      throw error;
    }

    return data;
  },

  async createPricingRule(rule: PricingRuleInsert): Promise<PricingRule | null> {
    const { data, error } = await supabase
      .from('pricing_rules')
      .insert(rule)
      .select()
      .single();

    if (error) {
      console.error('Error creating pricing rule:', error);
      throw error;
    }

    return data;
  },

  async updatePricingRule(
    ruleId: string,
    updates: PricingRuleUpdate
  ): Promise<PricingRule | null> {
    const { data, error } = await supabase
      .from('pricing_rules')
      .update(updates)
      .eq('id', ruleId)
      .select()
      .single();

    if (error) {
      console.error('Error updating pricing rule:', error);
      throw error;
    }

    return data;
  },

  async deactivatePricingRule(ruleId: string): Promise<void> {
    const { error } = await supabase
      .from('pricing_rules')
      .update({ is_active: false })
      .eq('id', ruleId);

    if (error) {
      console.error('Error deactivating pricing rule:', error);
      throw error;
    }
  },

  calculateDynamicPrice(
    basePrice: number,
    occupancyRate: number,
    rule?: PricingRule
  ): { price: number; multiplier: number } {
    if (!rule) {
      return { price: basePrice, multiplier: 1.0 };
    }

    let multiplier = 1.0;

    if (occupancyRate >= rule.occupancy_threshold_high) {
      multiplier = rule.peak_multiplier;
    } else if (occupancyRate <= rule.occupancy_threshold_low) {
      multiplier = rule.off_peak_multiplier;
    } else {
      const range = rule.occupancy_threshold_high - rule.occupancy_threshold_low;
      const position = occupancyRate - rule.occupancy_threshold_low;
      const progress = position / range;

      multiplier =
        rule.off_peak_multiplier +
        (rule.peak_multiplier - rule.off_peak_multiplier) * progress;
    }

    const price = Math.round(basePrice * multiplier * 100) / 100;

    return { price, multiplier: Math.round(multiplier * 100) / 100 };
  },

  async getActivePricingForZone(zoneId: string): Promise<PricingRule | null> {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('pricing_rules')
      .select('*')
      .eq('zone_id', zoneId)
      .eq('is_active', true)
      .lte('effective_from', now)
      .or(`effective_to.is.null,effective_to.gte.${now}`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching active pricing rule:', error);
      return null;
    }

    return data;
  },

  async calculateAndUpdateZonePricing(
    zoneId: string,
    occupancyRate: number
  ): Promise<{ price: number; multiplier: number } | null> {
    const { data: zone, error: zoneError } = await supabase
      .from('parking_zones')
      .select('base_price')
      .eq('id', zoneId)
      .maybeSingle();

    if (zoneError || !zone) {
      console.error('Error fetching zone for pricing:', zoneError);
      return null;
    }

    const rule = await this.getActivePricingForZone(zoneId);
    const { price, multiplier } = this.calculateDynamicPrice(
      zone.base_price,
      occupancyRate,
      rule || undefined
    );

    const { error: updateError } = await supabase
      .from('parking_zones')
      .update({
        current_price: price,
        price_multiplier: multiplier,
      })
      .eq('id', zoneId);

    if (updateError) {
      console.error('Error updating zone pricing:', updateError);
      return null;
    }

    return { price, multiplier };
  },

  isPeakHour(): boolean {
    const now = new Date();
    const hour = now.getHours();

    return (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20);
  },

  getTimeBasedMultiplier(): number {
    const isPeak = this.isPeakHour();
    return isPeak ? 1.5 : 0.9;
  },
};
