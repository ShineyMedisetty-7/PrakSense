// Floating control panel visible on all screens
import { Play, RotateCcw, Settings, Sun, Cloud, Moon, Calendar, Zap, ChevronDown } from 'lucide-react';
import { ScenarioMode } from '../types';
import { useState } from 'react';

interface FloatingControlsProps {
  scenario: ScenarioMode;
  demoSpeed: number;
  presentationMode: boolean;
  onScenarioChange: (scenario: ScenarioMode) => void;
  onDemoSpeedChange: (speed: number) => void;
  onPresentationModeToggle: () => void;
  onReset: () => void;
}

export const FloatingControls = ({
  scenario,
  demoSpeed,
  presentationMode,
  onScenarioChange,
  onDemoSpeedChange,
  onPresentationModeToggle,
  onReset
}: FloatingControlsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleScenarioChange = (newScenario: ScenarioMode) => {
    onScenarioChange(newScenario);
    setToastMessage(`Scenario changed to ${getScenarioLabel(newScenario)}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const getScenarioIcon = (mode: ScenarioMode) => {
    switch (mode) {
      case 'morning-rush': return Cloud;
      case 'evening-peak': return Moon;
      case 'weekend': return Calendar;
      case 'event': return Zap;
      default: return Sun;
    }
  };

  const getScenarioLabel = (mode: ScenarioMode) => {
    switch (mode) {
      case 'morning-rush': return 'Morning Rush';
      case 'evening-peak': return 'Evening Peak';
      case 'weekend': return 'Weekend';
      case 'event': return 'Event Day';
      default: return 'Normal';
    }
  };

  const ScenarioIcon = getScenarioIcon(scenario);

  if (presentationMode) return null;

  return (
    <>
      {/* Floating Control Panel */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className={`bg-white rounded-2xl shadow-2xl border-2 border-gray-200 transition-all duration-300 ${
          isExpanded ? 'w-80' : 'w-16'
        }`}>
          {/* Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-4 flex items-center justify-center hover:bg-gray-50 rounded-t-2xl transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-6 h-6 text-gray-700 transform rotate-180" />
            ) : (
              <Settings className="w-6 h-6 text-gray-700 animate-spin-slow" />
            )}
          </button>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="p-4 space-y-4 border-t border-gray-200">
              {/* Scenario Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Scenario
                </label>
                <div className="space-y-1">
                  {(['normal', 'morning-rush', 'evening-peak', 'weekend', 'event'] as ScenarioMode[]).map((mode) => {
                    const Icon = getScenarioIcon(mode);
                    return (
                      <button
                        key={mode}
                        onClick={() => handleScenarioChange(mode)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          scenario === mode
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {getScenarioLabel(mode)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Demo Speed */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Demo Speed
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 5, 10].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => onDemoSpeedChange(speed)}
                      className={`py-2 rounded-lg text-sm font-bold transition-colors ${
                        demoSpeed === speed
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-gray-200">
                <button
                  onClick={onPresentationModeToggle}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Presentation Mode
                </button>
                <button
                  onClick={onReset}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Demo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Status Indicator when collapsed */}
        {!isExpanded && (
          <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 text-center">
            <ScenarioIcon className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-xs font-bold text-gray-700">{demoSpeed}x</p>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
          <div className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-2">
            <ScenarioIcon className="w-5 h-5 text-blue-400" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  );
};
