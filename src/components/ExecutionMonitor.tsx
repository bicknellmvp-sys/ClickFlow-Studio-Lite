import React from 'react';
import { ExecutionLog } from '../types';
import { Play, Pause, Square, FastForward, CheckCircle2, AlertCircle, Clock, Terminal, Download, Code } from 'lucide-react';

interface ExecutionMonitorProps {
  isExecuting: boolean;
  isPaused: boolean;
  onStartExecution: () => void;
  onPauseExecution: () => void;
  onResumeExecution: () => void;
  onStopExecution: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  currentItemIndex: number;
  totalItems: number;
  currentItemValue: string;
  currentStepIndex: number;
  totalSteps: number;
  logs: ExecutionLog[];
  onOpenExportModal: () => void;
}

export const ExecutionMonitor: React.FC<ExecutionMonitorProps> = ({
  isExecuting,
  isPaused,
  onStartExecution,
  onPauseExecution,
  onResumeExecution,
  onStopExecution,
  speed,
  onSpeedChange,
  currentItemIndex,
  totalItems,
  currentItemValue,
  currentStepIndex,
  totalSteps,
  logs,
  onOpenExportModal,
}) => {
  const progressPercent =
    totalItems > 0 ? Math.round(((currentItemIndex + 1) / totalItems) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Execution Control & Live Monitor
            </h2>
            <p className="text-xs text-slate-500">
              Play your recorded macro across the pasted list items automatically.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenExportModal}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Code className="w-3.5 h-3.5 text-indigo-600" />
            Export Bookmarklet / Script
          </button>
        </div>
      </div>

      {/* Control Actions Bar */}
      <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {!isExecuting ? (
            <button
              onClick={onStartExecution}
              disabled={totalItems === 0 || totalSteps === 0}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              Start Automation
            </button>
          ) : isPaused ? (
            <button
              onClick={onResumeExecution}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              Resume
            </button>
          ) : (
            <button
              onClick={onPauseExecution}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Pause className="w-4 h-4 fill-current" />
              Pause
            </button>
          )}

          {isExecuting && (
            <button
              onClick={onStopExecution}
              className="px-4 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-rose-500/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Square className="w-4 h-4 fill-current" />
              Stop
            </button>
          )}
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl text-xs font-medium">
          <FastForward className="w-4 h-4 text-indigo-400" />
          <span>Speed:</span>
          {[0.5, 1, 2, 5].map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2 py-1 rounded-md transition-colors ${
                speed === s ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Progress & Status Details */}
      {(isExecuting || currentItemIndex >= 0) && (
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 space-y-3">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-600">
              Processing Item <strong className="text-slate-900 tabular-nums">#{currentItemIndex + 1}</strong> of <span className="tabular-nums">{totalItems}</span>: <span className="font-mono font-bold text-indigo-600">"{currentItemValue}"</span>
            </span>
            <span className="text-slate-500 font-mono tabular-nums">
              Step {currentStepIndex + 1} / {totalSteps} ({progressPercent}%)
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Live Logs Terminal */}
      <div className="p-4 bg-slate-900 text-slate-200 font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
          <span className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            Live Execution Output Logs
          </span>
          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 tabular-nums">
            {logs.length} events logged
          </span>
        </div>

        <div className="max-h-48 overflow-y-auto space-y-1.5 pt-3">
          {logs.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No execution logs yet. Click "Start Automation" to begin running your macro with the list items.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 py-1 border-b border-slate-800/50 last:border-0">
                <span className="text-slate-500 tabular-nums shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold shrink-0 ${
                    log.status === 'success'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : log.status === 'error'
                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}
                >
                  {log.status}
                </span>
                <div className="flex-1 text-slate-300">
                  <span className="text-indigo-400">[{log.itemValue}]</span> {log.message}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
