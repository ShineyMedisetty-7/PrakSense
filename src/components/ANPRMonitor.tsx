// ANPR (Automatic Number Plate Recognition) monitoring panel
import { Camera, ArrowDownCircle, ArrowUpCircle, Clock, AlertTriangle } from 'lucide-react';
import { ANPRDetection } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface ANPRMonitorProps {
  detections: ANPRDetection[];
}

export const ANPRMonitor = ({ detections }: ANPRMonitorProps) => {
  return (
    <div className="bg-white rounded-xl shadow-xl border-2 border-blue-200 h-[600px] flex flex-col overflow-hidden">
      {/* Sticky Header with distinct styling */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-10">
        <div className="bg-white/20 p-2 rounded-lg backdrop-blur">
          <Camera className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold">ANPR Live Feed</h3>
          <p className="text-xs text-blue-200">Real-time vehicle detection</p>
        </div>
        <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1.5 rounded-full backdrop-blur">
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold">LIVE</span>
        </div>
      </div>

      {/* Scrollable content with visible box styling */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-3 custom-scrollbar"
           style={{
             scrollbarWidth: 'thin',
             scrollbarColor: '#3b82f6 #e5e7eb'
           }}>
        {detections.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Waiting for detections...</p>
          </div>
        ) : (
          detections.map((detection) => (
            <div
              key={detection.id}
              className={`p-4 rounded-lg border-l-4 transition-all duration-300 ${
                detection.type === 'entry'
                  ? 'bg-green-50 border-green-500 hover:bg-green-100'
                  : 'bg-blue-50 border-blue-500 hover:bg-blue-100'
              } animate-slide-in`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-full ${
                    detection.type === 'entry' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {detection.type === 'entry' ? (
                      <ArrowDownCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowUpCircle className="w-5 h-5 text-blue-600" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-lg font-bold text-gray-900">
                        {detection.plateNumber}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        detection.type === 'entry'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-blue-200 text-blue-800'
                      }`}>
                        {detection.type.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 font-medium mb-1">
                      {detection.zoneName}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(detection.timestamp, { addSuffix: true })}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Spot:</span>
                        {detection.spotNumber}
                      </div>
                    </div>

                    {detection.duration && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Duration:</span>
                          <span className="text-sm font-bold text-gray-900">
                            {Math.floor(detection.duration / 60)}h {detection.duration % 60}m
                          </span>
                        </div>
                      </div>
                    )}

                    {detection.duration && detection.duration > 180 && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                        <AlertTriangle className="w-3 h-3" />
                        <span className="font-medium">Overstay Alert</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer with stats */}
      <div className="p-4 bg-white border-t-2 border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {detections.filter(d => d.type === 'entry').length}
            </p>
            <p className="text-xs text-gray-600 font-medium">Entries Today</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {detections.filter(d => d.type === 'exit').length}
            </p>
            <p className="text-xs text-gray-600 font-medium">Exits Today</p>
          </div>
        </div>
      </div>
    </div>
  );
};
