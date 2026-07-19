// Interactive parking zone map with real-time status indicators
import { MapPin, Zap, Home } from 'lucide-react';
import { ParkingZone } from '../types';

interface ParkingMapProps {
  zones: ParkingZone[];
  onZoneClick?: (zone: ParkingZone) => void;
  selectedZone?: string;
}

export const ParkingMap = ({ zones, onZoneClick, selectedZone }: ParkingMapProps) => {
  const getZoneColor = (zone: ParkingZone): string => {
    if (zone.status === 'offline') return 'bg-gray-400';

    const availabilityRate = (zone.totalSpots - zone.occupiedSpots) / zone.totalSpots;

    if (availabilityRate > 0.7) return 'bg-green-500';
    if (availabilityRate > 0.3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getZoneBorderColor = (zone: ParkingZone): string => {
    if (zone.status === 'offline') return 'border-gray-600';

    const availabilityRate = (zone.totalSpots - zone.occupiedSpots) / zone.totalSpots;

    if (availabilityRate > 0.7) return 'border-green-600';
    if (availabilityRate > 0.3) return 'border-yellow-600';
    return 'border-red-600';
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl relative overflow-hidden h-[600px] flex flex-col">
      {/* Sticky Header */}
      <div className="flex items-center justify-between p-4 bg-white/90 backdrop-blur border-b border-gray-200 sticky top-0 z-20">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Raipur City</h3>
          <p className="text-xs text-gray-600">Live Parking Map • {zones.length} Zones</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-700">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-xs text-gray-700">Limited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-700">Full</span>
          </div>
        </div>
      </div>

      {/* Scrollable zones container */}
      <div className="flex-1 overflow-y-auto smooth-scroll custom-scrollbar p-6 relative scroll-indicator-top scroll-indicator-bottom">
        <div className="grid grid-cols-3 gap-6">
          {zones.map((zone) => {
            const available = zone.totalSpots - zone.occupiedSpots;
            const availabilityRate = available / zone.totalSpots;

            return (
              <div
                key={zone.id}
                className={`relative cursor-pointer group ${
                  selectedZone === zone.id ? 'scale-110 z-20' : 'hover:scale-105'
                } transition-transform duration-300`}
                onClick={() => onZoneClick?.(zone)}
              >
                {/* Pulsing animation for zones with recent changes */}
                {availabilityRate < 0.2 && (
                  <div className={`absolute inset-0 ${getZoneColor(zone)} rounded-lg opacity-20 animate-ping`}></div>
                )}

                <div className={`relative bg-white rounded-lg shadow-lg border-2 ${getZoneBorderColor(zone)} p-4`}>
                  {/* Zone marker */}
                  <div className={`${getZoneColor(zone)} w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center shadow-md`}>
                    <MapPin className="w-6 h-6 text-white" />
                  </div>

                  {/* Zone name */}
                  <h4 className="text-sm font-bold text-gray-900 text-center mb-2 line-clamp-1">
                    {zone.name}
                  </h4>

                  {/* Occupancy info */}
                  <div className="text-center mb-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {available}
                    </p>
                    <p className="text-xs text-gray-600">spots available</p>
                  </div>

                  {/* Current price */}
                  <div className="text-center py-1 bg-blue-50 rounded-md mb-2">
                    <p className="text-sm font-bold text-blue-900">₹{zone.currentPrice}/hr</p>
                  </div>

                  {/* Features */}
                  <div className="flex justify-center gap-2">
                    {zone.hasEVCharging && (
                      <div className="bg-green-100 p-1 rounded" title="EV Charging">
                        <Zap className="w-3 h-3 text-green-700" />
                      </div>
                    )}
                    {zone.isCovered && (
                      <div className="bg-blue-100 p-1 rounded" title="Covered">
                        <Home className="w-3 h-3 text-blue-700" />
                      </div>
                    )}
                  </div>

                  {/* Surge indicator */}
                  {zone.priceMultiplier > 1.5 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-md animate-pulse">
                      SURGE
                    </div>
                  )}

                  {/* Discount indicator */}
                  {zone.priceMultiplier < 1.0 && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-md">
                      SALE
                    </div>
                  )}
                </div>

                {/* Hover tooltip */}
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                  {zone.location}
                  <br />
                  {zone.occupiedSpots}/{zone.totalSpots} occupied
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
