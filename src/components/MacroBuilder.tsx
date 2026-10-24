import React, { useState } from 'react';
import { Macro, MacroStep, ActionType } from '../types';
import { IntervalPresetsManager } from './IntervalPresetsManager';
import {
  MousePointer,
  Keyboard,
  Clock,
  ArrowUpDown,
  Plus,
  Trash2,
  Edit3,
  Sliders,
  Sparkles,
  Layers,
  CircleDot,
  FastForward,
} from 'lucide-react';

interface MacroBuilderProps {
  macro: Macro;
  onUpdateMacro: (updated: Macro) => void;
  onRunTestStep?: (step: MacroStep) => void;
}

export const MacroBuilder: React.FC<MacroBuilderProps> = ({
  macro,
  onUpdateMacro,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<string>('');

  const handleAddStep = (type: ActionType) => {
    const newStep: MacroStep = {
      id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      delayMs: macro.defaultIntervalMs || 500,
      description: getDefaultDescription(type),
      keyCode: type === 'key_press' ? 'Enter' : undefined,
      x: 250,
      y: 200,
    };
    onUpdateMacro({
      ...macro,
      steps: [...macro.steps, newStep],
    });
  };

  const getDefaultDescription = (type: ActionType): string => {
    switch (type) {
      case 'click':
        return 'Click at coordinates (X: 250, Y: 200)';
      case 'double_click':
        return 'Double-click at target element';
      case 'type_text':
        return 'Type static text string';
      case 'type_list_item':
        return 'Type current list item into active element';
      case 'key_press':
        return 'Press Enter / Key';
      case 'wait':
        return 'Wait for interval delay';
      case 'scroll':
        return 'Scroll down page (300px)';
      case 'custom_js':
        return 'Execute custom JavaScript';
    }
  };

  const handleUpdateStep = (stepId: string, updates: Partial<MacroStep>) => {
    const updatedSteps = macro.steps.map((s) => (s.id === stepId ? { ...s, ...updates } : s));
    onUpdateMacro({ ...macro, steps: updatedSteps });
  };

  const handleDeleteStep = (stepId: string) => {
    const updatedSteps = macro.steps.filter((s) => s.id !== stepId);
    onUpdateMacro({ ...macro, steps: updatedSteps });
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingStatus('Recording actions... Click or type in the Sandbox Test Arena to record steps.');
    setTimeout(() => {
      const recordedStep: MacroStep = {
        id: `rec-${Date.now()}`,
        type: 'click',
        x: 350,
        y: 190,
        delayMs: macro.defaultIntervalMs,
        description: 'Recorded Click on #sandbox-search-input',
      };
      const typeStep: MacroStep = {
        id: `rec-type-${Date.now()}`,
        type: 'type_list_item',
        delayMs: macro.defaultIntervalMs,
        description: 'Recorded Type List Item',
      };
      onUpdateMacro({
        ...macro,
        steps: [...macro.steps, recordedStep, typeStep],
      });
      setIsRecording(false);
      setRecordingStatus('Successfully recorded 2 steps!');
    }, 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={macro.name}
                onChange={(e) => onUpdateMacro({ ...macro, name: e.target.value })}
                className="font-bold text-sm text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-none px-1"
              />
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                Active Macro
              </span>
            </div>
            <p className="text-xs text-slate-500">{macro.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStartRecording}
            disabled={isRecording}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <CircleDot className={`w-3.5 h-3.5 ${isRecording ? 'animate-spin' : ''}`} />
            {isRecording ? 'Recording...' : 'Record Macro'}
          </button>
        </div>
      </div>

      {/* Recording Status Banner */}
      {isRecording && (
        <div className="bg-rose-500 text-white px-5 py-2.5 text-xs font-medium flex items-center justify-between animate-pulse">
          <span>🔴 {recordingStatus}</span>
          <span className="text-[11px] bg-black/20 px-2 py-0.5 rounded">Perform clicks in Sandbox</span>
        </div>
      )}

      {/* Settings / Intervals bar & Interval Presets */}
      <div className="px-5 py-4 bg-slate-50/70 border-b border-slate-100 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-600 font-medium">Default Interval (ms):</span>
            <input
              type="number"
              value={macro.defaultIntervalMs}
              onChange={(e) =>
                onUpdateMacro({ ...macro, defaultIntervalMs: Number(e.target.value) })
              }
              className="w-20 px-2 py-1 rounded-lg border border-slate-200 bg-white font-mono text-xs tabular-nums text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              step={50}
              min={50}
            />
          </div>

          <div className="flex items-center gap-2">
            <FastForward className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-600 font-medium">Loops per Item:</span>
            <input
              type="number"
              value={macro.loopCount}
              onChange={(e) =>
                onUpdateMacro({ ...macro, loopCount: Number(e.target.value) })
              }
              className="w-16 px-2 py-1 rounded-lg border border-slate-200 bg-white font-mono text-xs tabular-nums text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              min={1}
            />
          </div>

          <div className="text-slate-500 tabular-nums font-medium">
            Total Steps: <span className="font-bold text-slate-900">{macro.steps.length}</span>
          </div>
        </div>

        {/* Interval Presets Manager */}
        <IntervalPresetsManager
          currentInterval={macro.defaultIntervalMs}
          onSelectInterval={(ms) => onUpdateMacro({ ...macro, defaultIntervalMs: ms })}
        />
      </div>

      {/* Steps List */}
      <div className="p-4 space-y-2.5 max-h-72 overflow-y-auto bg-slate-50/30">
        {macro.steps.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <Sliders className="w-6 h-6 text-slate-300" />
            No macro steps configured. Click below to add steps or record live actions.
          </div>
        ) : (
          macro.steps.map((step, idx) => (
            <div
              key={step.id}
              className="p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-200 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs group"
            >
              <div className="flex items-start sm:items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-bold font-mono text-xs flex items-center justify-center shrink-0 tabular-nums">
                  {idx + 1}
                </span>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {step.type.replace('_', ' ')}
                    </span>
                    {step.type === 'type_list_item' && (
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Dynamic List Injection
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={step.description}
                    onChange={(e) => handleUpdateStep(step.id, { description: e.target.value })}
                    className="text-xs text-slate-800 font-medium bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-600 focus:outline-none w-full sm:w-80"
                  />
                </div>
              </div>

              {/* Step Controls */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                  <span>Delay:</span>
                  <input
                    type="number"
                    value={step.delayMs}
                    onChange={(e) => handleUpdateStep(step.id, { delayMs: Number(e.target.value) })}
                    className="w-16 px-1.5 py-0.5 rounded border border-slate-200 text-xs tabular-nums text-center focus:outline-none"
                    step={50}
                  />
                  <span>ms</span>
                </div>

                <button
                  onClick={() => handleDeleteStep(step.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete step"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Step Action Bar */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-600">Add Action Step:</span>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => handleAddStep('click')}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center gap-1"
          >
            <MousePointer className="w-3.5 h-3.5 text-indigo-600" />
            Click
          </button>
          <button
            onClick={() => handleAddStep('type_list_item')}
            className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 shadow-xs transition-all flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Type List Item
          </button>
          <button
            onClick={() => handleAddStep('key_press')}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center gap-1"
          >
            <Keyboard className="w-3.5 h-3.5 text-emerald-600" />
            Key Press (Enter)
          </button>
          <button
            onClick={() => handleAddStep('wait')}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center gap-1"
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Wait Delay
          </button>
          <button
            onClick={() => handleAddStep('scroll')}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center gap-1"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" />
            Scroll
          </button>
        </div>
      </div>
    </div>
  );
};
