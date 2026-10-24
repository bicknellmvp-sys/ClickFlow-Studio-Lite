import React, { useState } from 'react';
import { Play, Search, Send, CheckCircle2, RefreshCcw, MousePointer, ShieldCheck, Sparkles } from 'lucide-react';

interface SandboxPlaygroundProps {
  currentExecutingItem?: string;
  activeStepDescription?: string;
  isExecuting: boolean;
}

export const SandboxPlayground: React.FC<SandboxPlaygroundProps> = ({
  currentExecutingItem,
  activeStepDescription,
  isExecuting,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const [formName, setFormName] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [submittedForms, setSubmittedForms] = useState<string[]>([]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    const query = searchValue.trim();
    // Generate simulated search results based on query
    setSearchResults([
      `Result 1 for "${query}" - Official Documentation & Guide`,
      `Result 2 for "${query}" - Community Forum Discussions`,
      `Result 3 for "${query}" - GitHub Repository & API Reference`,
    ]);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    setSubmittedForms((prev) => [formName.trim(), ...prev]);
    setFormName('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Play className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Sandbox Test Arena & Automation Target
            </h2>
            <p className="text-xs text-slate-500">
              Test your macros and list automation live against interactive DOM elements.
            </p>
          </div>
        </div>

        {isExecuting && (
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Executing Item: <span className="font-mono underline">{currentExecutingItem || 'Starting...'}</span>
          </div>
        )}
      </div>

      {/* Live Automation Banner */}
      {isExecuting && activeStepDescription && (
        <div className="bg-indigo-600 text-white px-5 py-2 text-xs font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 animate-spin" />
            Active Step: <strong className="font-mono">{activeStepDescription}</strong>
          </span>
          <span className="text-[10px] bg-indigo-700 px-2 py-0.5 rounded font-mono">
            Target: Sandbox DOM
          </span>
        </div>
      )}

      {/* Sandbox Workspace */}
      <div className="p-6 space-y-6 bg-slate-50/40">
        {/* Search Engine Simulator */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-indigo-600" />
              Mock Search Engine Portal
            </h3>
            <span className="text-xs text-slate-400 font-mono">#sandbox-search-input</span>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              id="sandbox-search-input"
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search items or keywords..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </form>

          {/* Results list */}
          {searchResults.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-semibold text-slate-400">Search Results:</span>
              {searchResults.map((res, i) => (
                <div
                  key={i}
                  className="sandbox-result-item p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-indigo-50/50 hover:border-indigo-200 transition-colors text-xs text-slate-700 font-medium cursor-pointer flex items-center justify-between"
                  onClick={() => alert(`Clicked result: ${res}`)}
                >
                  <span>{res}</span>
                  <span className="text-[10px] text-indigo-600 font-bold">Open →</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Entry & Click Target Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form Filler Box */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-emerald-600" />
                  Data Entry Form
                </h3>
                <span className="text-xs text-slate-400 font-mono">#form-input-name</span>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Item / Name Entry
                  </label>
                  <input
                    id="form-input-name"
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Enter item or data..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                  />
                </div>
                <button
                  id="form-submit-btn"
                  type="submit"
                  className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  Save & Submit Entry
                </button>
              </form>
            </div>

            {submittedForms.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400">Submitted Entries ({submittedForms.length}):</span>
                <div className="max-h-24 overflow-y-auto space-y-1">
                  {submittedForms.map((item, idx) => (
                    <div key={idx} className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded flex items-center justify-between">
                      <span>✓ {item}</span>
                      <span className="text-[10px] text-slate-400">Saved</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Rapid Clicker Target Box */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-4 shadow-xs flex flex-col items-center justify-center text-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 w-full text-left flex items-center gap-1.5">
              <MousePointer className="w-3.5 h-3.5 text-blue-600" />
              Rapid Click Target
            </h3>

            <div className="py-6 flex flex-col items-center gap-3">
              <button
                id="click-target-btn"
                onClick={() => setClickCount((c) => c + 1)}
                className="w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-200 flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold"
              >
                <span className="text-2xl font-mono tabular-nums">{clickCount}</span>
                <span className="text-[11px] opacity-90 uppercase tracking-wide">Clicks</span>
              </button>
              <p className="text-xs text-slate-400">
                Click this target manually or let your auto clicker tap it automatically.
              </p>
            </div>

            <button
              onClick={() => {
                setClickCount(0);
                setSubmittedForms([]);
                setSearchResults([]);
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline flex items-center gap-1"
            >
              <RefreshCcw className="w-3 h-3" />
              Reset Sandbox State
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
