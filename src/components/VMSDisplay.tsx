// Variable Message Signs (VMS) display simulation for roadside guidance
import { Navigation, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { ParkingZone } from '../types';

interface VMSDisplayProps {
  zones: ParkingZone[];
}

export const VMSDisplay = ({ zones }: VMSDisplayProps) => {
  // Simulate different VMS locations around the city
  const vmsLocations = [
    { name: 'GE Road Junction', nearbyZones: zones.slice(0, 3) },
    { name: 'Civil Lines Square', nearbyZones: zones.slice(2, 5) },
    { name: 'Telibandha Intersection', nearbyZones: zones.slice(4, 7) },
    { name: 'Railway Station Approach', nearbyZones: zones.slice(5, 8) }
  ];

  const getStatusColor = (available: number, total: number) => {
    const rate = available / total;
    if (rate > 0.3) return 'text-green-400';
    if (rate > 0.1) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Navigation className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold">Variable Message Signs (VMS)</h2>
            <p className="text-gray-400">Real-time roadside parking guidance</p>
          </div>
        </div>
      </div>

      {/* VMS Boards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {vmsLocations.map((location) => (
          <div key={location.name} className="space-y-4">
            {/* Location Label */}
            <div className="bg-white rounded-lg shadow-md px-4 py-2">
              <p className="text-sm font-medium text-gray-600">📍 {location.name}</p>
            </div>

            {/* LED Display Board */}
            <div className="bg-gray-900 rounded-xl p-6 border-8 border-yellow-500 shadow-2xl">
              {/* Display Header */}
              <div className="text-center mb-4 pb-4 border-b-2 border-yellow-500">
                <h3 className="text-2xl font-bold text-yellow-400 tracking-wider mb-1">
                  PARKING GUIDANCE SYSTEM
                </h3>
                <p className="text-sm text-gray-400 uppercase tracking-wide">
                  Live Availability Updates
                </p>
              </div>

              {/* Zones Display */}
              <div className="space-y-3">
                {location.nearbyZones.map((zone) => {
                  const available = zone.totalSpots - zone.occupiedSpots;
                  const distance = (Math.random() * 3 + 0.5).toFixed(1);

                  return (
                    <div
                      key={zone.id}
                      className="bg-black rounded-lg p-4 border-2 border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <ArrowRight className="w-5 h-5 text-blue-400 animate-pulse" />
                            <p className="text-white font-bold text-lg tracking-wide uppercase">
                              {zone.name.split(' ')[0]}
                            </p>
                          </div>
                          <p className="text-gray-400 text-sm ml-7">{distance} km ahead</p>
                        </div>

                        <div className="text-right">
                          {available > 0 ? (
                            <>
                              <p className={`text-4xl font-bold ${getStatusColor(available, zone.totalSpots)} tabular-nums`}>
                                {available}
                              </p>
                              <p className="text-gray-500 text-xs uppercase tracking-wide">
                                Spots Free
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="text-3xl font-bold text-red-400">FULL</p>
                              <p className="text-gray-500 text-xs uppercase tracking-wide">
                                No Vacancy
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Rate Display */}
                      <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Current Rate:</span>
                        <span className="text-yellow-400 font-bold text-lg">
                          ₹{zone.currentPrice}/hr
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Status */}
              <div className="mt-4 pt-4 border-t-2 border-yellow-500 flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-green-400 text-sm font-medium uppercase tracking-wide">
                  System Online • Updated {Math.floor(Math.random() * 5) + 1}s ago
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Traffic Signal Integration Preview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Traffic Signal Integration (Future Feature)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="font-bold text-green-900">Smart Routing</p>
            </div>
            <p className="text-sm text-gray-700">
              Traffic signals guide vehicles to zones with high availability
            </p>
          </div>

          <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <p className="font-bold text-blue-900">Dynamic Timing</p>
            </div>
            <p className="text-sm text-gray-700">
              Signal timing adjusts based on parking demand and traffic flow
            </p>
          </div>

          <div className="border-2 border-purple-200 bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              <p className="font-bold text-purple-900">Congestion Relief</p>
            </div>
            <p className="text-sm text-gray-700">
              Reduces search traffic and improves overall traffic flow
            </p>
          </div>
        </div>
      </div>

      {/* Integration Mockup */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          External Integration Preview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Google Maps Integration */}
          <div className="border-2 border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <Navigation className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Google Maps</p>
                <p className="text-xs text-gray-600">Real-time Integration</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              Live parking availability shown directly in Google Maps navigation
            </p>
            <div className="bg-gray-50 rounded p-3 text-xs font-mono text-gray-600">
              API: /api/v1/parking/availability
              <br />
              Status: ✅ Connected
            </div>
          </div>

          {/* City Traffic Control */}
          <div className="border-2 border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Traffic Control Center</p>
                <p className="text-xs text-gray-600">Municipal Integration</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              Direct data feed to Raipur Traffic Police control room
            </p>
            <div className="bg-gray-50 rounded p-3 text-xs font-mono text-gray-600">
              Connection: Secure VPN
              <br />
              Status: ✅ Synchronized
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
