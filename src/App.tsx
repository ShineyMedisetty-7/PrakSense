// ParkSense: AI-Powered Dynamic Parking & Traffic Guidance System
// Production-ready prototype for hackathon presentation

import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Smartphone,
  BarChart3,
  Brain,
  Play,
  Zap,
  MapPin
} from 'lucide-react';

// Components
import { MetricCard } from './components/MetricCard';
import { ParkingMap } from './components/ParkingMap';
import { ANPRMonitor } from './components/ANPRMonitor';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { PricingEngine } from './components/PricingEngine';
import { MobileView } from './components/MobileView';
import { ZoneModal } from './components/ZoneModal';
import { FloatingControls } from './components/FloatingControls';
import { RouteAssistance } from './components/RouteAssistance';
import { AnimatedTrafficBackground } from './components/AnimatedTrafficBackground';

// Hooks & Data
import { useSimulation } from './hooks/useSimulation';
import { useSupabaseData } from './hooks/useSupabaseData';
import { generateOccupancyData, generateRevenueData } from './data/initialData';
import { ViewMode, ScenarioMode, ParkingZone } from './types';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [demoSpeed, setDemoSpeed] = useState<number>(1);
  const [scenario, setScenario] = useState<ScenarioMode>('normal');
  const [presentationMode, setPresentationMode] = useState(false);
  const [selectedZone, setSelectedZone] = useState<ParkingZone | null>(null);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [useRealData, setUseRealData] = useState<boolean>(true);

  const simulationData = useSimulation(demoSpeed, scenario);
  const supabaseData = useSupabaseData();

  const {
    zones,
    anprDetections,
    totalRevenue,
    todaySessions,
    getTotalStats,
    loading,
    error
  } = useRealData ? supabaseData : { ...simulationData, loading: false, error: null };

  const resetSimulation = simulationData.resetSimulation;
  const refreshData = supabaseData.refreshData;

  const stats = getTotalStats();
  const occupancyData = generateOccupancyData();
  const revenueData = generateRevenueData();

  // Zone click handler
  const handleZoneClick = (zone: ParkingZone) => {
    setSelectedZone(zone);
    setShowZoneModal(true);
  };

  // Keyboard shortcuts for presentation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '1') setViewMode('dashboard');
      if (e.key === '2') setViewMode('route');
      if (e.key === '3') setViewMode('mobile');
      if (e.key === '4') setViewMode('analytics');
      if (e.key === '5') setViewMode('pricing');
      if (e.key === 'p') setPresentationMode(!presentationMode);
      if (e.key === 'r') useRealData ? refreshData() : resetSimulation();
      if (e.key === 'd') setUseRealData(!useRealData);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [presentationMode, resetSimulation, refreshData, useRealData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-3 rounded-xl">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  ParkSense
                </h1>
                <p className="text-xs text-gray-600">
                  AI-Powered Parking Management • Raipur Smart City
                </p>
              </div>
            </div>

            {/* View Mode Tabs */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'route', label: 'Route Assist', icon: MapPin },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'pricing', label: 'AI Pricing', icon: Brain },
                { id: 'mobile', label: 'Mobile App', icon: Smartphone }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setViewMode(id as ViewMode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {!presentationMode && <span className="text-sm">{label}</span>}
                </button>
              ))}
            </div>

            {/* Control Panel */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-green-100 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-800">LIVE</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                useRealData ? 'bg-blue-100' : 'bg-amber-100'
              }`}>
                <span className={`text-sm font-medium ${
                  useRealData ? 'text-blue-800' : 'text-amber-800'
                }`}>
                  {useRealData ? 'Real Data' : 'Demo Mode'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
              <p className="mt-4 text-lg text-gray-600">Loading parking data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-red-500 text-xl">⚠</div>
              <div>
                <h3 className="text-lg font-bold text-red-800">Error Loading Data</h3>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => refreshData()}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard View */}
        {!loading && !error && viewMode === 'dashboard' && (
          <div className="space-y-6 relative">
            {/* Animated Traffic Background */}
            <AnimatedTrafficBackground />

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              <MetricCard
                title="Total Parking Spots"
                value={stats.totalSpots}
                icon={LayoutDashboard}
                iconColor="bg-blue-500"
              />
              <MetricCard
                title="Currently Occupied"
                value={stats.totalOccupied}
                change={5.2}
                trend="up"
                icon={Smartphone}
                iconColor="bg-orange-500"
              />
              <MetricCard
                title="Available Now"
                value={stats.totalAvailable}
                change={3.1}
                trend="down"
                icon={BarChart3}
                iconColor="bg-green-500"
              />
            </div>

            {/* Main Dashboard Grid */}
            <div className="space-y-6 relative z-10">
              {/* Parking Map */}
              <div>
                <ParkingMap
                  zones={zones}
                  onZoneClick={handleZoneClick}
                  selectedZone={selectedZone?.id}
                />
              </div>

              {/* ANPR Monitor */}
              <div>
                <ANPRMonitor detections={anprDetections} />
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">{stats.occupancyRate}%</p>
                  <p className="text-blue-200 text-sm">Overall Occupancy</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{todaySessions}</p>
                  <p className="text-blue-200 text-sm">Sessions Today</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">₹{Math.round(totalRevenue / todaySessions)}</p>
                  <p className="text-blue-200 text-sm">Avg Per Session</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">98.2%</p>
                  <p className="text-blue-200 text-sm">System Uptime</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Route Assistance View */}
        {!loading && !error && viewMode === 'route' && <RouteAssistance zones={zones} />}

        {/* Mobile View */}
        {!loading && !error && viewMode === 'mobile' && (
          <div className="flex justify-center">
            <MobileView zones={zones} />
          </div>
        )}

        {/* Analytics View */}
        {!loading && !error && viewMode === 'analytics' && (
          <AnalyticsDashboard
            occupancyData={occupancyData}
            revenueData={revenueData}
            totalRevenue={totalRevenue}
            todaySessions={todaySessions}
          />
        )}

        {/* Pricing Engine View */}
        {!loading && !error && viewMode === 'pricing' && <PricingEngine zones={zones} />}
      </main>

      {/* Floating Controls */}
      <FloatingControls
        scenario={scenario}
        demoSpeed={demoSpeed}
        presentationMode={presentationMode}
        onScenarioChange={setScenario}
        onDemoSpeedChange={setDemoSpeed}
        onPresentationModeToggle={() => setPresentationMode(!presentationMode)}
        onReset={resetSimulation}
      />

      {/* Zone Detail Modal */}
      {showZoneModal && selectedZone && (
        <ZoneModal
          zone={selectedZone}
          recentActivity={anprDetections}
          onClose={() => setShowZoneModal(false)}
        />
      )}

      {/* Keyboard Shortcuts Helper */}
      {!presentationMode && (
        <div className="fixed bottom-6 left-6 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-2xl text-xs z-30">
          <p className="font-bold mb-2">Keyboard Shortcuts:</p>
          <div className="space-y-1 text-gray-300">
            <p><span className="font-mono bg-gray-800 px-2 py-0.5 rounded">1-5</span> Switch views</p>
            <p><span className="font-mono bg-gray-800 px-2 py-0.5 rounded">P</span> Presentation mode</p>
            <p><span className="font-mono bg-gray-800 px-2 py-0.5 rounded">R</span> Refresh data</p>
            <p><span className="font-mono bg-gray-800 px-2 py-0.5 rounded">D</span> Toggle data source</p>
          </div>
        </div>
      )}

      {/* Presentation Mode Banner */}
      {presentationMode && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-2">
          <Play className="w-5 h-5" />
          <span className="font-bold">PRESENTATION MODE ACTIVE</span>
        </div>
      )}
    </div>
  );
}

export default App;
