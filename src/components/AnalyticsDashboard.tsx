// Advanced analytics dashboard with charts and insights
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, DollarSign, Clock, Users } from 'lucide-react';
import { OccupancyDataPoint, RevenueByZone } from '../types';
import { MetricCard } from './MetricCard';

interface AnalyticsDashboardProps {
  occupancyData: OccupancyDataPoint[];
  revenueData: RevenueByZone[];
  totalRevenue: number;
  todaySessions: number;
}

export const AnalyticsDashboard = ({
  occupancyData,
  revenueData,
  totalRevenue,
  todaySessions
}: AnalyticsDashboardProps) => {
  const avgDuration = '2h 15m';
  const peakHour = '6 PM - 8 PM';

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue Today"
          value={`₹${totalRevenue.toLocaleString()}`}
          change={12.5}
          trend="up"
          icon={DollarSign}
          iconColor="bg-green-500"
        />
        <MetricCard
          title="Parking Sessions"
          value={todaySessions}
          change={8.3}
          trend="up"
          icon={Users}
          iconColor="bg-blue-500"
        />
        <MetricCard
          title="Average Duration"
          value={avgDuration}
          change={-3.2}
          trend="down"
          icon={Clock}
          iconColor="bg-purple-500"
        />
        <MetricCard
          title="Peak Period"
          value={peakHour}
          icon={TrendingUp}
          iconColor="bg-orange-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy Trend */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">24-Hour Occupancy Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="time"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="occupancy"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={false}
                name="Occupied Spots"
              />
              <Line
                type="monotone"
                dataKey="available"
                stroke="#10b981"
                strokeWidth={3}
                dot={false}
                name="Available Spots"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Zone */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue by Zone</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="zone"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (₹)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Peak Hours Heatmap */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Demand Heatmap - Peak Hours</h3>
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center">
              <p className="text-xs font-medium text-gray-600 mb-2">{day}</p>
              <div className="space-y-1">
                {['Morning', 'Noon', 'Evening', 'Night'].map((period, idx) => {
                  const intensity = day === 'Sat' || day === 'Sun'
                    ? idx === 2 ? 90 : idx === 1 ? 60 : 30
                    : idx === 2 ? 95 : idx === 1 ? 85 : idx === 0 ? 75 : 25;

                  return (
                    <div
                      key={period}
                      className="h-12 rounded flex items-center justify-center text-xs font-medium transition-all hover:scale-105 cursor-pointer"
                      style={{
                        backgroundColor: `rgba(59, 130, 246, ${intensity / 100})`,
                        color: intensity > 50 ? '#fff' : '#1f2937'
                      }}
                      title={`${day} ${period}: ${intensity}% occupancy`}
                    >
                      {intensity}%
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600">Lower Demand</p>
          <div className="flex gap-1">
            {[20, 40, 60, 80, 100].map((opacity) => (
              <div
                key={opacity}
                className="w-8 h-4 rounded"
                style={{ backgroundColor: `rgba(59, 130, 246, ${opacity / 100})` }}
              />
            ))}
          </div>
          <p className="text-xs text-gray-600">Higher Demand</p>
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Today's Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-4xl font-bold mb-2">2,450</p>
            <p className="text-blue-200">Parking searches eliminated</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold mb-2">1,200</p>
            <p className="text-blue-200">Hours saved by citizens</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold mb-2">450 kg</p>
            <p className="text-blue-200">CO₂ emissions reduced</p>
          </div>
        </div>
      </div>
    </div>
  );
};
