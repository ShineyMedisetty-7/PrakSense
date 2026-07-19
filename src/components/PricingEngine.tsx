// AI Pricing Engine visualization showing dynamic pricing logic
import { Brain, TrendingUp, Cloud, Calendar, Zap, Clock } from 'lucide-react';
import { ParkingZone } from '../types';
import { useState } from 'react';

interface PricingEngineProps {
  zones: ParkingZone[];
}

export const PricingEngine = ({ zones }: PricingEngineProps) => {
  const [selectedZone, setSelectedZone] = useState<ParkingZone>(zones[0]);
  const [simulatedOccupancy, setSimulatedOccupancy] = useState(
    selectedZone.occupiedSpots / selectedZone.totalSpots * 100
  );

  const calculatePrice = (occupancyRate: number): { price: number; multiplier: number; recommendation: string } => {
    const basePrice = selectedZone.basePrice;
    let multiplier = 1.0;
    let recommendation = 'Normal Pricing';

    if (occupancyRate > 90) {
      multiplier = 2.5;
      recommendation = 'SURGE PRICING ACTIVE';
    } else if (occupancyRate > 70) {
      multiplier = 1.8;
      recommendation = 'High Demand - Price Increase';
    } else if (occupancyRate > 50) {
      multiplier = 1.3;
      recommendation = 'Moderate Demand';
    } else if (occupancyRate < 30) {
      multiplier = 0.8;
      recommendation = 'LOW DEMAND DISCOUNT';
    }

    return {
      price: Math.round(basePrice * multiplier),
      multiplier,
      recommendation
    };
  };

  const simulated = calculatePrice(simulatedOccupancy);
  const confidence = 92;

  // Current time factors
  const currentHour = new Date().getHours();
  const isPeakTime = (currentHour >= 17 && currentHour <= 21) || (currentHour >= 7 && currentHour <= 9);
  const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;

  return (
    <div className="space-y-6">
      {/* AI Model Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 p-3 rounded-lg backdrop-blur">
            <Brain className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Pricing Engine</h2>
            <p className="text-purple-200">Machine Learning-Based Dynamic Pricing</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur">
          <Zap className="w-4 h-4 text-yellow-300" />
          <span className="text-sm font-medium">Model Confidence: {confidence}%</span>
        </div>
      </div>

      {/* Input Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Input Factors</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-700">Current Occupancy</span>
              </div>
              <span className="text-lg font-bold text-blue-600">
                {((selectedZone.occupiedSpots / selectedZone.totalSpots) * 100).toFixed(1)}%
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-700">Day Type</span>
              </div>
              <span className="text-lg font-bold text-green-600">
                {isWeekend ? 'Weekend' : 'Weekday'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-gray-700">Time Period</span>
              </div>
              <span className={`text-lg font-bold ${isPeakTime ? 'text-red-600' : 'text-orange-600'}`}>
                {isPeakTime ? 'Peak Hours' : 'Off-Peak'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Cloud className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-700">Weather</span>
              </div>
              <span className="text-lg font-bold text-purple-600">Clear</span>
            </div>
          </div>
        </div>

        {/* Pricing Output */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Pricing Output</h3>
          <div className="space-y-4">
            <div className="text-center p-6 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg text-white">
              <p className="text-sm font-medium mb-2">Current Price</p>
              <p className="text-5xl font-bold">₹{selectedZone.currentPrice}</p>
              <p className="text-blue-200 text-sm mt-2">per hour</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Base Price</p>
                <p className="text-2xl font-bold text-gray-900">₹{selectedZone.basePrice}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Multiplier</p>
                <p className="text-2xl font-bold text-gray-900">{selectedZone.priceMultiplier}x</p>
              </div>
            </div>

            <div className={`p-3 rounded-lg text-center font-bold ${
              selectedZone.priceMultiplier > 1.5
                ? 'bg-red-100 text-red-700'
                : selectedZone.priceMultiplier < 1.0
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {selectedZone.priceMultiplier > 1.5
                ? '⚡ SURGE PRICING ACTIVE'
                : selectedZone.priceMultiplier < 1.0
                ? '🎉 LOW DEMAND DISCOUNT'
                : '✓ NORMAL PRICING'}
            </div>
          </div>
        </div>
      </div>

      {/* Zone Selector */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Select Zone for Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {zones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => {
                setSelectedZone(zone);
                setSimulatedOccupancy(zone.occupiedSpots / zone.totalSpots * 100);
              }}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedZone.id === zone.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <p className="font-medium text-sm text-gray-900">{zone.name.split(' ')[0]}</p>
              <p className="text-xs text-gray-600">₹{zone.currentPrice}/hr</p>
            </button>
          ))}
        </div>
      </div>

      {/* What-If Simulator */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">What-If Scenario Tester</h3>
        <p className="text-sm text-gray-600 mb-4">
          Adjust occupancy to see how pricing changes in real-time
        </p>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Simulated Occupancy: {simulatedOccupancy.toFixed(0)}%
              </label>
              <span className="text-sm text-gray-600">
                {Math.round((simulatedOccupancy / 100) * selectedZone.totalSpots)}/{selectedZone.totalSpots} spots
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={simulatedOccupancy}
              onChange={(e) => setSimulatedOccupancy(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Calculated Price</p>
              <p className="text-3xl font-bold text-blue-600">₹{simulated.price}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Multiplier</p>
              <p className="text-3xl font-bold text-purple-600">{simulated.multiplier}x</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Revenue Change</p>
              <p className="text-3xl font-bold text-green-600">
                {simulated.multiplier > 1 ? '+' : ''}{((simulated.multiplier - 1) * 100).toFixed(0)}%
              </p>
            </div>
          </div>

          <div className={`p-4 rounded-lg text-center font-bold ${
            simulated.multiplier > 1.5
              ? 'bg-red-100 text-red-700'
              : simulated.multiplier < 1.0
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            AI Recommendation: {simulated.recommendation}
          </div>
        </div>
      </div>

      {/* Historical Pricing Trend */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">12-Hour Pricing History</h3>
        <div className="flex items-end justify-between h-48 gap-2">
          {Array.from({ length: 12 }).map((_, i) => {
            const hour = (new Date().getHours() - 11 + i + 24) % 24;
            const isPeak = (hour >= 17 && hour <= 21) || (hour >= 7 && hour <= 9);
            const height = isPeak ? 70 + Math.random() * 30 : 30 + Math.random() * 40;

            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full rounded-t-lg transition-all hover:opacity-80 ${
                    isPeak ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ height: `${height}%` }}
                  title={`${hour}:00 - ₹${Math.round(selectedZone.basePrice * (isPeak ? 1.8 : 1.1))}`}
                />
                <p className="text-xs text-gray-600 mt-2">{hour}h</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
