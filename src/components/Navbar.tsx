import React from 'react';
import { AppTab } from '../types';
import { Zap, Play, Terminal, History, BookOpen, Bookmark } from 'lucide-react';

interface NavbarProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  isExecuting: boolean;
  onQuickStart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  isExecuting,
  onQuickStart,
}) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
          <Zap className="w-5 h-5 fill-current" />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            ClickFlow Studio
          </span>
          <span className="hidden sm:inline-block ml-2 text-xs text-slate-500 font-medium">
            v2.4 Pro
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation links */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-sm font-medium text-slate-600">
        <button
          onClick={() => onTabChange('studio')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
            currentTab === 'studio'
              ? 'bg-white text-slate-900 shadow-sm font-semibold'
              : 'hover:text-slate-900'
          }`}
        >
          <Terminal className="w-4 h-4 text-indigo-600" />
          Automation Studio
        </button>
        <button
          onClick={() => onTabChange('sandbox')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
            currentTab === 'sandbox'
              ? 'bg-white text-slate-900 shadow-sm font-semibold'
              : 'hover:text-slate-900'
          }`}
        >
          <Play className="w-4 h-4 text-emerald-600" />
          Sandbox Test Arena
        </button>
        <button
          onClick={() => onTabChange('templates')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
            currentTab === 'templates'
              ? 'bg-white text-slate-900 shadow-sm font-semibold'
              : 'hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-600" />
          Templates
        </button>
        <button
          onClick={() => onTabChange('history')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
            currentTab === 'history'
              ? 'bg-white text-slate-900 shadow-sm font-semibold'
              : 'hover:text-slate-900'
          }`}
        >
          <History className="w-4 h-4 text-blue-600" />
          Execution Logs
        </button>
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-3">
        {isExecuting ? (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs font-semibold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            Automation Running...
          </div>
        ) : (
          <button
            onClick={onQuickStart}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all flex items-center gap-1.5 whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Quick Demo Load
          </button>
        )}
      </div>
    </header>
  );
};
