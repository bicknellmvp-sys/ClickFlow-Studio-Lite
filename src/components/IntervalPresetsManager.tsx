import React, { useState } from 'react';
import { Clock, Bookmark, Plus, Trash2, Check, Zap } from 'lucide-react';

export interface IntervalPreset {
  id: string;
  name: string;
  intervalMs: number;
}

interface IntervalPresetsManagerProps {
  currentInterval: number;
  onSelectInterval: (ms: number) => void;
}

const DEFAULT_INTERVAL_PRESETS: IntervalPreset[] = [
  { id: 'p1', name: 'Lightning Fast (100ms)', intervalMs: 100 },
  { id: 'p2', name: 'Fast Clicks (250ms)', intervalMs: 250 },
  { id: 'p3', name: 'Standard Speed (500ms)', intervalMs: 500 },
  { id: 'p4', name: 'Deliberate Pace (1000ms)', intervalMs: 1000 },
  { id: 'p5', name: 'Slow Form Filler (2000ms)', intervalMs: 2000 },
];

export const IntervalPresetsManager: React.FC<IntervalPresetsManagerProps> = ({
  currentInterval,
  onSelectInterval,
}) => {
  const [presets, setPresets] = useState<IntervalPreset[]>(DEFAULT_INTERVAL_PRESETS);
  const [newPresetName, setNewPresetName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) return;

    const preset: IntervalPreset = {
      id: `preset-${Date.now()}`,
      name: newPresetName.trim(),
      intervalMs: currentInterval,
    };

    setPresets((prev) => [...prev, preset]);
    setNewPresetName('');
    setIsAdding(false);
  };

  const handleDeletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPresets((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-indigo-600" />
          Interval Speed Presets
        </label>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          Save Current ({currentInterval}ms)
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSavePreset} className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-200 flex gap-2">
          <input
            type="text"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            placeholder="Preset name (e.g. 'Fast clicks')"
            className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            Save
          </button>
        </form>
      )}

      {/* Preset Buttons Grid / Dropdown */}
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => {
          const isSelected = currentInterval === preset.intervalMs;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectInterval(preset.intervalMs)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-semibold'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              <span>{preset.name}</span>
              {presets.length > 3 && !DEFAULT_INTERVAL_PRESETS.some((d) => d.id === preset.id) && (
                <span
                  onClick={(e) => handleDeletePreset(preset.id, e)}
                  className="text-slate-400 hover:text-rose-600 ml-1"
                  title="Delete preset"
                >
                  ×
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
