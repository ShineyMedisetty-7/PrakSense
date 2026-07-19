// Modal popup for parking zone details
import { X, MapPin, Zap, Home, TrendingUp, Navigation as NavIcon } from 'lucide-react';
import { ParkingZone, ANPRDetection } from '../types';
import { useEffect } from 'react';

interface ZoneModalProps {
  zone: ParkingZone;
  recentActivity: ANPRDetection[];
  onClose: () => void;
}

export const ZoneModal = ({ zone, recentActivity, onClose }: ZoneModalProps) => {
  const available = zone.totalSpots - zone.occupiedSpots;
  const occupancyRate = (zone.occupiedSpots / zone.totalSpots) * 100;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const zoneActivity = recentActivity
    .filter(a => a.zoneName === zone.name)
    .slice(0, 10);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{zone.name}</h2>
              <p className="text-blue-200 text-sm">{zone.location}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Occupancy Visualization */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Current Occupancy</h3>
              <span className={`text-2xl font-bold ${
                occupancyRate > 80 ? 'text-red-600' :
                occupancyRate > 50 ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {occupancyRate.toFixed(0)}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden mb-4">
              <div
                className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                  occupancyRate > 80 ? 'bg-red-500' :
                  occupancyRate > 50 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${occupancyRate}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">
                  {zone.occupiedSpots} / {zone.totalSpots} spots
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-blue-600">{zone.totalSpots}</p>
                <p className="text-xs text-gray-600">Total Spots</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-orange-600">{zone.occupiedSpots}</p>
                <p className="text-xs text-gray-600">Occupied</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-600">{available}</p>
                <p className="text-xs text-gray-600">Available</p>
              </div>
            </div>
          </div>

          {/* Pricing Info */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-medium">Current Price</span>
              <span className="text-3xl font-bold text-blue-600">₹{zone.currentPrice}/hr</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Base Rate: ₹{zone.basePrice}</span>
              <span className={`font-bold ${
                zone.priceMultiplier > 1.5 ? 'text-red-600' :
                zone.priceMultiplier < 1.0 ? 'text-green-600' :
                'text-blue-600'
              }`}>
                {zone.priceMultiplier}x multiplier
              </span>
            </div>
            {zone.priceMultiplier > 1.5 && (
              <div className="mt-2 bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium text-center">
                ⚡ SURGE PRICING ACTIVE
              </div>
            )}
            {zone.priceMultiplier < 1.0 && (
              <div className="mt-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium text-center">
                🎉 DISCOUNT PRICING
              </div>
            )}
          </div>

          {/* Features */}
          <div className="flex items-center gap-4">
            {zone.hasEVCharging && (
              <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                <Zap className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">EV Charging</span>
              </div>
            )}
            {zone.isCovered && (
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                <Home className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Covered Parking</span>
              </div>
            )}
            {zone.status === 'online' && (
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-900">System Online</span>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Recent Vehicle Activity</h3>
            {zoneActivity.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {zoneActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className={`p-3 rounded-lg border ${
                      activity.type === 'entry'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-gray-900">
                        {activity.plateNumber}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        activity.type === 'entry'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-blue-200 text-blue-800'
                      }`}>
                        {activity.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-xs text-gray-600">
                      <span>Spot: {activity.spotNumber}</span>
                      <span>{activity.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5" />
              Reserve Spot
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
              <NavIcon className="w-5 h-5" />
              Navigate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
