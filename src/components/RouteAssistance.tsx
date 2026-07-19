import { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  Loader,
  X,
  Car,
  ParkingCircle,
  DollarSign,
  AlertCircle,
  Wrench,
  Phone,
  Star,
  UtensilsCrossed,
  Filter,
  Coffee,
  BedDouble,
  Heart,
  Wifi,
  Zap,
  ShoppingBag,
  Pill
} from 'lucide-react';
import {
  RAIPUR_LOCATIONS,
  RaipurLocation,
  searchLocations,
  calculateHaversineDistance,
  getCategoryColor,
  getCategoryLabel
} from '../data/raipurLocations';
import { routeService } from '../services/routeService';
import type { ParkingZone } from '../types';

interface RouteAssistanceProps {
  zones?: ParkingZone[];
}

interface RouteData {
  roadDistance: number;
  aerialDistance: number;
  duration: number;
  geometry: [number, number][];
}

type VehicleType = 'light' | 'heavy';

interface ParkingSlot {
  id: string;
  status: 'available' | 'occupied' | 'reserved' | 'ev';
}

interface Amenity {
  id: string;
  name: string;
  icon: any;
  available: number;
  total: number;
  price?: string;
  description: string;
}

export const RouteAssistance = ({ zones = [] }: RouteAssistanceProps) => {
  const [entryLocation, setEntryLocation] = useState<RaipurLocation | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<RaipurLocation | null>(null);
  const [entryQuery, setEntryQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [showEntrySuggestions, setShowEntrySuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [entrySuggestions, setEntrySuggestions] = useState<RaipurLocation[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<RaipurLocation[]>([]);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nearbyParking, setNearbyParking] = useState<Array<ParkingZone & { distance: number }>>([]);

  const [showMechanics, setShowMechanics] = useState(true);
  const [showRestaurants, setShowRestaurants] = useState(true);
  const [selectedMechanic, setSelectedMechanic] = useState<RaipurLocation | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RaipurLocation | null>(null);
  const [cuisineFilter, setCuisineFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');

  const [vehicleType, setVehicleType] = useState<VehicleType>('light');
  const [showParkingGrid, setShowParkingGrid] = useState(false);
  const [showAmenities, setShowAmenities] = useState(false);

  const entryInputRef = useRef<HTMLDivElement>(null);
  const destInputRef = useRef<HTMLDivElement>(null);

  const lightVehicleSlots: ParkingSlot[] = Array.from({ length: 120 }, (_, i) => ({
    id: `light-${i + 1}`,
    status: i < 45 ? 'available' : i < 110 ? 'occupied' : i < 115 ? 'reserved' : 'ev'
  }));

  const heavyVehicleSlots: ParkingSlot[] = Array.from({ length: 30 }, (_, i) => ({
    id: `heavy-${i + 1}`,
    status: i < 12 ? 'available' : i < 28 ? 'occupied' : 'reserved'
  }));

  const amenities: Amenity[] = [
    { id: 'a1', name: 'Rest Rooms', icon: BedDouble, available: 5, total: 8, price: '₹50 / 30 min', description: 'Clean rooms with shower facilities' },
    { id: 'a2', name: 'Sleeping Pods', icon: BedDouble, available: 3, total: 6, price: '₹100 / 2 hrs', description: 'Power nap pods with recliner chairs' },
    { id: 'a3', name: 'Massage Chairs', icon: Heart, available: 4, total: 4, price: '₹30 / 15 min', description: 'Relaxing massage chairs' },
    { id: 'a4', name: 'Food Court', icon: UtensilsCrossed, available: 1, total: 1, description: 'Quick meals, snacks, and beverages' },
    { id: 'a5', name: 'Convenience Store', icon: ShoppingBag, available: 1, total: 1, description: 'Medicines, toiletries, travel essentials' },
    { id: 'a6', name: 'WiFi Lounge', icon: Wifi, available: 1, total: 1, price: 'Free', description: 'High-speed internet access' },
    { id: 'a7', name: 'Charging Station', icon: Zap, available: 1, total: 1, price: 'Free', description: 'Phone and laptop charging' },
    { id: 'a8', name: 'First Aid', icon: Pill, available: 1, total: 1, description: 'Medical room with basic facilities' }
  ];

  useEffect(() => {
    if (entryQuery.length >= 2) {
      const results = searchLocations(entryQuery);
      setEntrySuggestions(results);
      setShowEntrySuggestions(true);
    } else {
      setEntrySuggestions([]);
      setShowEntrySuggestions(false);
    }
  }, [entryQuery]);

  useEffect(() => {
    if (destinationQuery.length >= 2) {
      const results = searchLocations(destinationQuery);
      setDestinationSuggestions(results);
      setShowDestinationSuggestions(true);
    } else {
      setDestinationSuggestions([]);
      setShowDestinationSuggestions(false);
    }
  }, [destinationQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (entryInputRef.current && !entryInputRef.current.contains(event.target as Node)) {
        setShowEntrySuggestions(false);
      }
      if (destInputRef.current && !destInputRef.current.contains(event.target as Node)) {
        setShowDestinationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFindRoute = async () => {
    if (!entryLocation || !destinationLocation) {
      setError('Please select both entry and destination points');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const aerialDistance = calculateHaversineDistance(
        entryLocation.latitude,
        entryLocation.longitude,
        destinationLocation.latitude,
        destinationLocation.longitude
      );

      const route = await routeService.getRoute(
        entryLocation.latitude,
        entryLocation.longitude,
        destinationLocation.latitude,
        destinationLocation.longitude
      );

      if (route) {
        setRouteData({
          roadDistance: route.distance,
          aerialDistance,
          duration: route.duration,
          geometry: route.geometry
        });
      } else {
        const estimatedTime = routeService.calculateEstimatedTime(aerialDistance);
        setRouteData({
          roadDistance: aerialDistance * 1.3,
          aerialDistance,
          duration: estimatedTime,
          geometry: [
            [entryLocation.latitude, entryLocation.longitude],
            [destinationLocation.latitude, destinationLocation.longitude]
          ]
        });
      }

      if (zones.length > 0) {
        const parkingNearDestination = zones
          .map((zone) => ({
            ...zone,
            distance: calculateHaversineDistance(
              destinationLocation.latitude,
              destinationLocation.longitude,
              zone.latitude,
              zone.longitude
            )
          }))
          .filter((zone) => zone.distance <= 1.0)
          .sort((a, b) => a.distance - b.distance);

        setNearbyParking(parkingNearDestination);
      }
    } catch (err) {
      console.error('Error calculating route:', err);
      setError('Failed to calculate route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = (isEntry: boolean) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentLoc: RaipurLocation = {
            id: 'current-location',
            name: 'Current Location',
            category: 'parking',
            latitude,
            longitude,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            icon: '📍'
          };

          if (isEntry) {
            setEntryLocation(currentLoc);
            setEntryQuery(currentLoc.name);
            setShowEntrySuggestions(false);
          } else {
            setDestinationLocation(currentLoc);
            setDestinationQuery(currentLoc.name);
            setShowDestinationSuggestions(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Unable to get current location');
        }
      );
    } else {
      setError('Geolocation not supported by your browser');
    }
  };

  const selectLocation = (location: RaipurLocation, isEntry: boolean) => {
    if (isEntry) {
      setEntryLocation(location);
      setEntryQuery(location.name);
      setShowEntrySuggestions(false);
    } else {
      setDestinationLocation(location);
      setDestinationQuery(location.name);
      setShowDestinationSuggestions(false);
    }
  };

  const clearLocation = (isEntry: boolean) => {
    if (isEntry) {
      setEntryLocation(null);
      setEntryQuery('');
      setEntrySuggestions([]);
    } else {
      setDestinationLocation(null);
      setDestinationQuery('');
      setDestinationSuggestions([]);
    }
    setRouteData(null);
    setNearbyParking([]);
  };

  const getAvailabilityColor = (available: number, total: number): string => {
    const rate = available / total;
    if (rate > 0.3) return 'bg-green-100 text-green-800';
    if (rate > 0.1) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getSlotColor = (status: string): string => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'occupied': return 'bg-red-500';
      case 'reserved': return 'bg-blue-500';
      case 'ev': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const mechanics = RAIPUR_LOCATIONS.filter(loc => loc.category === 'mechanic');
  const restaurants = RAIPUR_LOCATIONS.filter(loc => loc.category === 'restaurant');

  const filteredRestaurants = restaurants.filter(r => {
    const cuisineMatch = cuisineFilter === 'All' || r.cuisine === cuisineFilter;
    const priceMatch = priceFilter === 'All' || r.priceRange === priceFilter;
    return cuisineMatch && priceMatch;
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Navigation className="w-8 h-8" />
          <div>
            <h2 className="text-3xl font-bold">Raipur Route Assistance</h2>
            <p className="text-blue-100 text-sm">Smart navigation with parking, mechanics & dining options</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div ref={entryInputRef} className="relative">
            <label className="block text-sm font-medium mb-2 text-blue-100">Starting Point</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
              <input
                type="text"
                placeholder="Search Raipur locations..."
                value={entryQuery}
                onChange={(e) => setEntryQuery(e.target.value)}
                onFocus={() => entryQuery.length >= 2 && setShowEntrySuggestions(true)}
                className="w-full pl-10 pr-10 py-3 bg-white rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              {entryLocation && (
                <button
                  onClick={() => clearLocation(true)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={() => handleUseCurrentLocation(true)}
              className="mt-2 text-xs text-blue-100 hover:text-white underline"
            >
              📍 Use Current Location
            </button>

            {showEntrySuggestions && entrySuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-2xl max-h-80 overflow-y-auto">
                {entrySuggestions.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => selectLocation(location, true)}
                    className="w-full px-4 py-3 hover:bg-blue-50 flex items-center gap-3 text-left border-b border-gray-100 last:border-0"
                  >
                    <span className="text-2xl">{location.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{location.name}</p>
                      <p className="text-xs text-gray-600">{location.address}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(location.category)}`}>
                      {getCategoryLabel(location.category)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div ref={destInputRef} className="relative">
            <label className="block text-sm font-medium mb-2 text-blue-100">Destination Point</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
              <input
                type="text"
                placeholder="Search Raipur locations..."
                value={destinationQuery}
                onChange={(e) => setDestinationQuery(e.target.value)}
                onFocus={() => destinationQuery.length >= 2 && setShowDestinationSuggestions(true)}
                className="w-full pl-10 pr-10 py-3 bg-white rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              {destinationLocation && (
                <button
                  onClick={() => clearLocation(false)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={() => handleUseCurrentLocation(false)}
              className="mt-2 text-xs text-blue-100 hover:text-white underline"
            >
              📍 Use Current Location
            </button>

            {showDestinationSuggestions && destinationSuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-2xl max-h-80 overflow-y-auto">
                {destinationSuggestions.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => selectLocation(location, false)}
                    className="w-full px-4 py-3 hover:bg-blue-50 flex items-center gap-3 text-left border-b border-gray-100 last:border-0"
                  >
                    <span className="text-2xl">{location.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{location.name}</p>
                      <p className="text-xs text-gray-600">{location.address}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(location.category)}`}>
                      {getCategoryLabel(location.category)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <button
          onClick={handleFindRoute}
          disabled={!entryLocation || !destinationLocation || loading}
          className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Calculating Route...
            </>
          ) : (
            <>
              <Navigation className="w-5 h-5" />
              Find Route & Services
            </>
          )}
        </button>
      </div>

      {routeData && entryLocation && destinationLocation && (
        <>
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Route Summary</h3>
                  <p className="text-sm text-gray-600">{entryLocation.name} → {destinationLocation.name}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Car className="w-5 h-5 text-blue-600" />
                  <p className="text-sm font-medium text-gray-700">Driving Distance</p>
                </div>
                <p className="text-3xl font-bold text-blue-600">{routeData.roadDistance.toFixed(1)} km</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-medium text-gray-700">Estimated Time</p>
                </div>
                <p className="text-3xl font-bold text-green-600">{Math.round(routeData.duration)} mins</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Navigation className="w-5 h-5 text-gray-600" />
                  <p className="text-sm font-medium text-gray-700">Aerial Distance</p>
                </div>
                <p className="text-3xl font-bold text-gray-600">{routeData.aerialDistance.toFixed(1)} km</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">{entryLocation.name}</span>
                </div>
                <div className="flex-1 mx-4 border-t-2 border-dashed border-blue-400"></div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">{destinationLocation.name}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setShowMechanics(!showMechanics)}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                showMechanics
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-red-300'
              }`}
            >
              <Wrench className="w-5 h-5" />
              Mechanic Shops ({mechanics.length})
            </button>
            <button
              onClick={() => setShowRestaurants(!showRestaurants)}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                showRestaurants
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300'
              }`}
            >
              <UtensilsCrossed className="w-5 h-5" />
              Restaurants ({restaurants.length})
            </button>
            <button
              onClick={() => setShowParkingGrid(!showParkingGrid)}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                showParkingGrid
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300'
              }`}
            >
              <ParkingCircle className="w-5 h-5" />
              Parking System
            </button>
          </div>

          {showMechanics && (
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wrench className="w-6 h-6 text-red-600" />
                  <h3 className="text-xl font-bold text-gray-900">Mechanic Shops Along Route</h3>
                </div>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  {mechanics.length} Available
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mechanics.map((mechanic) => (
                  <div
                    key={mechanic.id}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-red-500 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => setSelectedMechanic(mechanic)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium text-gray-700">{mechanic.rating}</span>
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{mechanic.name}</h4>
                    <p className="text-xs text-gray-600 mb-3">{mechanic.address}</p>
                    <div className="space-y-1 mb-3">
                      {mechanic.services?.slice(0, 2).map((service, idx) => (
                        <p key={idx} className="text-xs text-gray-600">• {service}</p>
                      ))}
                    </div>
                    <button className="w-full bg-red-50 text-red-700 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-1">
                      <Phone className="w-4 h-4" />
                      {mechanic.contact}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showRestaurants && (
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="w-6 h-6 text-orange-600" />
                  <h3 className="text-xl font-bold text-gray-900">Restaurants Along Route</h3>
                </div>
                <div className="flex gap-2">
                  <select
                    value={cuisineFilter}
                    onChange={(e) => setCuisineFilter(e.target.value)}
                    className="px-3 py-1 border-2 border-gray-200 rounded-lg text-sm"
                  >
                    <option>All</option>
                    <option>North Indian</option>
                    <option>Fast Food</option>
                    <option>Cafe</option>
                    <option>South Indian</option>
                    <option>Chinese</option>
                  </select>
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="px-3 py-1 border-2 border-gray-200 rounded-lg text-sm"
                  >
                    <option>All</option>
                    <option>₹</option>
                    <option>₹₹</option>
                    <option>₹₹₹</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredRestaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-orange-500 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => setSelectedRestaurant(restaurant)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <UtensilsCrossed className="w-5 h-5 text-orange-600" />
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">{restaurant.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{restaurant.cuisine}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium text-gray-700">{restaurant.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">{restaurant.priceRange}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">Popular: {restaurant.popular}</p>
                    <button className="w-full bg-orange-50 text-orange-700 py-2 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors">
                      Add as Stop
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showParkingGrid && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 shadow-lg border-2 border-purple-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center">
                    <ParkingCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Advanced Parking System</h3>
                    <p className="text-sm text-gray-600">Real-time slot availability with booking</p>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Vehicle Type</label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setVehicleType('light')}
                      className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                        vehicleType === 'light'
                          ? 'bg-green-600 text-white shadow-lg'
                          : 'bg-white text-gray-700 border-2 border-gray-200'
                      }`}
                    >
                      Light Vehicles
                    </button>
                    <button
                      onClick={() => setVehicleType('heavy')}
                      className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                        vehicleType === 'heavy'
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white text-gray-700 border-2 border-gray-200'
                      }`}
                    >
                      Heavy Vehicles
                    </button>
                  </div>
                </div>

                {vehicleType === 'light' && (
                  <div className="bg-white rounded-lg p-5 border-2 border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Car className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">Light Vehicles</h4>
                          <p className="text-xs text-gray-600">Cars, Bikes, Scooters, Small SUVs</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">45</p>
                        <p className="text-xs text-gray-600">/ 120 Total</p>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-3 mb-4">
                      <p className="text-sm font-medium text-gray-700">₹20/hour • Standard slots (2.5m x 5m)</p>
                    </div>

                    <div className="grid grid-cols-15 gap-1 mb-4">
                      {lightVehicleSlots.slice(0, 60).map((slot) => (
                        <div
                          key={slot.id}
                          className={`h-6 rounded ${getSlotColor(slot.status)} cursor-pointer hover:opacity-80 transition-opacity`}
                          title={`${slot.id} - ${slot.status}`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span>Occupied</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span>Reserved</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                        <span>EV Charging</span>
                      </div>
                    </div>

                    <button className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors">
                      Book Light Vehicle Slot
                    </button>
                  </div>
                )}

                {vehicleType === 'heavy' && (
                  <div className="bg-white rounded-lg p-5 border-2 border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Car className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">Heavy Vehicles</h4>
                          <p className="text-xs text-gray-600">Trucks, Buses, Trailers, Commercial</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">12</p>
                        <p className="text-xs text-gray-600">/ 30 Total</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                      <p className="text-sm font-medium text-gray-700">₹50/hour • Large slots (4m x 12m)</p>
                    </div>

                    <div className="grid grid-cols-10 gap-2 mb-4">
                      {heavyVehicleSlots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`h-8 rounded ${getSlotColor(slot.status)} cursor-pointer hover:opacity-80 transition-opacity`}
                          title={`${slot.id} - ${slot.status}`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span>Occupied</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span>Reserved</span>
                      </div>
                    </div>

                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                      Book Heavy Vehicle Slot
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setShowAmenities(!showAmenities)}
                  className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Coffee className="w-5 h-5" />
                  {showAmenities ? 'Hide' : 'View'} Amenities & Refreshment Facilities
                </button>
              </div>

              {showAmenities && (
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Rest & Refreshment Facilities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {amenities.map((amenity) => {
                      const Icon = amenity.icon;
                      const availability = (amenity.available / amenity.total) * 100;
                      return (
                        <div
                          key={amenity.id}
                          className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-500 hover:shadow-lg transition-all"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Icon className="w-6 h-6 text-purple-600" />
                            </div>
                            {amenity.total > 1 && (
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                availability > 50 ? 'bg-green-100 text-green-800' :
                                availability > 0 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {amenity.available}/{amenity.total}
                              </div>
                            )}
                          </div>
                          <h4 className="font-bold text-gray-900 mb-1">{amenity.name}</h4>
                          <p className="text-xs text-gray-600 mb-3">{amenity.description}</p>
                          {amenity.price && (
                            <p className="text-sm font-medium text-purple-600 mb-3">{amenity.price}</p>
                          )}
                          <button className="w-full bg-purple-50 text-purple-700 py-2 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors">
                            {amenity.available > 0 ? 'Book Now' : 'Check Availability'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {nearbyParking.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <ParkingCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Parking Near Destination</h3>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {nearbyParking.length} Available
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nearbyParking.map((parking) => {
                  const availableSpots = parking.totalSpots - parking.occupiedSpots;
                  return (
                    <div
                      key={parking.id}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-500 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <ParkingCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-xs font-bold text-blue-600">{parking.distance.toFixed(1)} km</span>
                      </div>

                      <h4 className="font-bold text-gray-900 mb-2">{parking.name}</h4>
                      <p className="text-xs text-gray-600 mb-3">{parking.location}</p>

                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{availableSpots}</p>
                          <p className="text-xs text-gray-600">spots available</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(availableSpots, parking.totalSpots)}`}>
                          {Math.round((availableSpots / parking.totalSpots) * 100)}% Free
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
                        <DollarSign className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">₹{parking.currentPrice}/hour</span>
                      </div>

                      <button className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                        <Navigation className="w-4 h-4" />
                        Navigate Here
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {!routeData && (
        <div className="bg-white rounded-xl p-12 text-center shadow-lg">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Plan Your Raipur Journey</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Select your starting point and destination to discover mechanics, restaurants, parking zones, and amenities along your route
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: '🔧', label: 'Mechanics', count: mechanics.length },
              { icon: '🍽️', label: 'Restaurants', count: restaurants.length },
              { icon: '🅿️', label: 'Parking Zones', count: zones.length },
              { icon: '☕', label: 'Amenities', count: amenities.length }
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4">
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-sm font-medium text-gray-700">{item.label}</p>
                <p className="text-xs text-gray-500">{item.count} available</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
