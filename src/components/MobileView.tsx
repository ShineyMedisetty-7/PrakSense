// Mobile app interface simulation for user experience
import { useState } from 'react';
import {
  MapPin,
  Search,
  Clock,
  CreditCard,
  User,
  Navigation,
  Zap,
  Home,
  Filter,
  QrCode,
  CheckCircle,
  Wallet
} from 'lucide-react';
import { ParkingZone } from '../types';

interface MobileViewProps {
  zones: ParkingZone[];
}

export const MobileView = ({ zones }: MobileViewProps) => {
  const [screen, setScreen] = useState<'home' | 'search' | 'reservation' | 'payment'>('home');
  const [selectedZone, setSelectedZone] = useState<ParkingZone | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredZones = zones
    .filter(z => z.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => (b.totalSpots - b.occupiedSpots) - (a.totalSpots - a.occupiedSpots));

  return (
    <div className="max-w-md mx-auto bg-gray-100 rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-900">
      {/* Status Bar */}
      <div className="bg-gray-900 text-white px-6 py-2 flex items-center justify-between">
        <span className="text-xs">9:41</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-3 border border-white rounded-sm"></div>
          <div className="w-1 h-2 bg-white rounded-sm"></div>
        </div>
      </div>

      {/* App Content */}
      <div className="bg-white h-[700px] overflow-y-auto">
        {/* Home Screen */}
        {screen === 'home' && (
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ParkSense</h1>
                <p className="text-sm text-gray-600">Find parking in seconds</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Search Bar */}
            <div
              onClick={() => setScreen('search')}
              className="flex items-center gap-3 bg-gray-100 px-4 py-4 rounded-2xl cursor-pointer hover:bg-gray-200 transition-colors"
            >
              <Search className="w-5 h-5 text-gray-400" />
              <span className="text-gray-500">Where do you want to park?</span>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setScreen('search')}
                className="bg-blue-500 text-white p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-blue-600 transition-colors"
              >
                <MapPin className="w-6 h-6" />
                <span className="text-xs font-medium">Find Now</span>
              </button>
              <button className="bg-green-500 text-white p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-green-600 transition-colors">
                <Clock className="w-6 h-6" />
                <span className="text-xs font-medium">Bookings</span>
              </button>
              <button className="bg-purple-500 text-white p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-purple-600 transition-colors">
                <CreditCard className="w-6 h-6" />
                <span className="text-xs font-medium">Payments</span>
              </button>
            </div>

            {/* Nearby Zones */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-900">Nearby Parking</h2>
                <button
                  onClick={() => setScreen('search')}
                  className="text-sm text-blue-600 font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {zones.slice(0, 3).map((zone) => {
                  const available = zone.totalSpots - zone.occupiedSpots;
                  const distance = (Math.random() * 5 + 0.5).toFixed(1);

                  return (
                    <div
                      key={zone.id}
                      onClick={() => {
                        setSelectedZone(zone);
                        setScreen('reservation');
                      }}
                      className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-500 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-900">{zone.name}</h3>
                        <span className="text-sm font-bold text-blue-600">₹{zone.currentPrice}/hr</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">{zone.location}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {distance} km
                          </span>
                          <span className={`font-medium ${
                            available > 20 ? 'text-green-600' : available > 5 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {available} spots
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {zone.hasEVCharging && <Zap className="w-3 h-3 text-green-600" />}
                          {zone.isCovered && <Home className="w-3 h-3 text-blue-600" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment History Preview */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-900">Recent Sessions</h2>
                <button className="text-sm text-blue-600 font-medium">See All</button>
              </div>
              <div className="space-y-2">
                {['Marine Drive Market', 'Civil Lines'].map((name, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{name}</p>
                      <p className="text-xs text-gray-600">2 hours • Yesterday</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">₹{60 + idx * 20}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Screen */}
        {screen === 'search' && (
          <div className="h-full flex flex-col">
            {/* Search Header */}
            <div className="p-6 pb-4 bg-white border-b border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setScreen('home')}
                  className="text-gray-600"
                >
                  ← Back
                </button>
                <h2 className="text-xl font-bold text-gray-900">Find Parking</h2>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search location or parking zone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="mt-3 flex items-center gap-2 text-sm text-blue-600 font-medium"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              {showFilters && (
                <div className="mt-3 p-3 bg-gray-50 rounded-xl space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-700">EV Charging</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-700">Covered Parking</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-700">Under ₹50/hr</span>
                  </label>
                </div>
              )}
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto p-6 pt-4">
              <p className="text-sm text-gray-600 mb-4">{filteredZones.length} zones available</p>
              <div className="space-y-3">
                {filteredZones.map((zone) => {
                  const available = zone.totalSpots - zone.occupiedSpots;
                  const distance = (Math.random() * 5 + 0.5).toFixed(1);
                  const walkTime = Math.ceil(Number(distance) * 12);

                  return (
                    <div
                      key={zone.id}
                      onClick={() => {
                        setSelectedZone(zone);
                        setScreen('reservation');
                      }}
                      className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-500 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">{zone.name}</h3>
                          <p className="text-xs text-gray-600 mb-2">{zone.location}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {distance} km
                            </span>
                            <span className="flex items-center gap-1">
                              <Navigation className="w-3 h-3" />
                              {walkTime} min walk
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">₹{zone.currentPrice}</p>
                          <p className="text-xs text-gray-600">per hour</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            available > 20 ? 'bg-green-500' : available > 5 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <span className={`text-sm font-medium ${
                            available > 20 ? 'text-green-600' : available > 5 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {available} spots available
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {zone.hasEVCharging && (
                            <div className="bg-green-100 p-1 rounded">
                              <Zap className="w-3 h-3 text-green-700" />
                            </div>
                          )}
                          {zone.isCovered && (
                            <div className="bg-blue-100 p-1 rounded">
                              <Home className="w-3 h-3 text-blue-700" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Reservation Screen */}
        {screen === 'reservation' && selectedZone && (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 pb-4 bg-white border-b border-gray-200">
              <button
                onClick={() => setScreen('search')}
                className="text-gray-600 mb-3"
              >
                ← Back
              </button>
              <h2 className="text-xl font-bold text-gray-900">Reserve Parking</h2>
            </div>

            {/* Reservation Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Zone Details */}
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-gray-900 mb-1">{selectedZone.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{selectedZone.location}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">₹{selectedZone.currentPrice}/hr</span>
                  <span className="text-sm font-medium text-green-600">
                    {selectedZone.totalSpots - selectedZone.occupiedSpots} spots left
                  </span>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6 text-center">
                <div className="w-48 h-48 bg-white border-4 border-gray-900 mx-auto mb-4 flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-gray-900" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">Scan at Entry Gate</p>
                <p className="text-xs text-gray-600">Reservation ID: RES{Math.floor(Math.random() * 100000)}</p>
              </div>

              {/* Spot Info */}
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-green-900">Spot Reserved!</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  Your spot: <span className="font-bold">A-{Math.floor(Math.random() * 200) + 1}</span>
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock className="w-4 h-4" />
                  <span>Expires in: <span className="font-bold text-orange-600">9:45</span></span>
                </div>
              </div>

              {/* Duration Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Duration
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['1h', '2h', '3h', '4h'].map((duration) => (
                    <button
                      key={duration}
                      className="py-3 border-2 border-blue-500 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                    >
                      {duration}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setScreen('payment')}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Navigation className="w-5 h-5" />
                  Navigate to Parking
                </button>
                <button className="w-full bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-colors">
                  Extend Reservation
                </button>
                <button
                  onClick={() => setScreen('search')}
                  className="w-full text-red-600 py-2 rounded-xl font-medium hover:bg-red-50 transition-colors"
                >
                  Cancel Reservation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Screen */}
        {screen === 'payment' && selectedZone && (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 pb-4 bg-white border-b border-gray-200">
              <button
                onClick={() => setScreen('reservation')}
                className="text-gray-600 mb-3"
              >
                ← Back
              </button>
              <h2 className="text-xl font-bold text-gray-900">Payment Summary</h2>
            </div>

            {/* Payment Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Session Details */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{selectedZone.name}</p>
                    <p className="text-xs text-gray-600">Spot A-{Math.floor(Math.random() * 200) + 1}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Entry Time</span>
                    <span className="font-medium text-gray-900">{new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium text-gray-900">2 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Rate</span>
                    <span className="font-medium text-gray-900">₹{selectedZone.basePrice}/hr</span>
                  </div>
                  {selectedZone.priceMultiplier !== 1 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {selectedZone.priceMultiplier > 1 ? 'Surge' : 'Discount'}
                      </span>
                      <span className={`font-medium ${
                        selectedZone.priceMultiplier > 1 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {selectedZone.priceMultiplier > 1 ? '+' : '-'}
                        ₹{Math.abs(selectedZone.currentPrice - selectedZone.basePrice) * 2}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="bg-blue-600 text-white rounded-xl p-6 mb-6">
                <p className="text-sm mb-2">Total Amount</p>
                <p className="text-4xl font-bold">₹{selectedZone.currentPrice * 2}</p>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Payment Method</h3>
                <div className="space-y-2">
                  {[
                    { name: 'UPI', icon: Wallet, selected: true },
                    { name: 'Credit/Debit Card', icon: CreditCard, selected: false },
                    { name: 'Wallet Balance', icon: Wallet, selected: false }
                  ].map((method) => (
                    <button
                      key={method.name}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${
                        method.selected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <method.icon className={`w-5 h-5 ${
                          method.selected ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                        <span className={`font-medium ${
                          method.selected ? 'text-blue-900' : 'text-gray-700'
                        }`}>
                          {method.name}
                        </span>
                      </div>
                      {method.selected && (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={() => {
                  alert('Payment successful! ✓');
                  setScreen('home');
                }}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Pay ₹{selectedZone.currentPrice * 2}
              </button>

              <p className="text-xs text-center text-gray-600 mt-4">
                🔒 Secured by 256-bit encryption
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Home Indicator */}
      <div className="bg-gray-900 py-2 flex justify-center">
        <div className="w-32 h-1 bg-white rounded-full"></div>
      </div>
    </div>
  );
};
