import React, { useState, useMemo, useRef } from 'react';
import {
  ListOrdered,
  Sparkles,
  Trash2,
  FileText,
  CheckCircle2,
  AlertCircle,
  Shuffle,
  Download,
  Upload,
} from 'lucide-react';

interface ListInputBoxProps {
  rawListText: string;
  onChangeRawText: (text: string) => void;
  delimiter: 'auto' | 'newline' | 'comma';
  onDelimiterChange: (del: 'auto' | 'newline' | 'comma') => void;
}

export const ListInputBox: React.FC<ListInputBoxProps> = ({
  rawListText,
  onChangeRawText,
  delimiter,
  onDelimiterChange,
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse items based on delimiter mode
  const parsedItems = useMemo(() => {
    if (!rawListText.trim()) return [];

    let items: string[] = [];
    if (delimiter === 'newline') {
      items = rawListText.split('\n');
    } else if (delimiter === 'comma') {
      items = rawListText.split(',');
    } else {
      if (rawListText.includes('\n')) {
        items = rawListText.split('\n');
      } else {
        items = rawListText.split(',');
      }
    }

    return items
      .map((item) => item.trim())
      .filter((item) => item.length > 0 && !item.startsWith('#'));
  }, [rawListText, delimiter]);

  const loadSampleList = (type: 'products' | 'queries' | 'emails' | 'urls') => {
    switch (type) {
      case 'products':
        onChangeRawText(
          '- Mechanical Gaming Keyboard\n- UltraWide 34in Monitor\n- Ergonomic Standing Desk\n- Wireless Noise-Cancelling Headphones\n- RGB Mousepad XL'
        );
        break;
      case 'queries':
        onChangeRawText('react hooks tutorial, typescript advanced types, tailwind css grid, vite build optimization, node express rest api');
        break;
      case 'emails':
        onChangeRawText('alex.johnson@example.com, sarah.connor@example.com, michael.scott@example.com, dwight.schrute@example.com');
        break;
      case 'urls':
        onChangeRawText('https://github.com\nhttps://stackoverflow.com\nhttps://developer.mozilla.org\nhttps://news.ycombinator.com');
        break;
    }
  };

  // Advanced List Management Features
  const handleShuffle = () => {
    if (parsedItems.length <= 1) return;
    const shuffled = [...parsedItems].sort(() => Math.random() - 0.5);
    onChangeRawText(shuffled.join('\n'));
  };

  const handleSaveToFile = () => {
    const blob = new Blob([rawListText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clickflow-list-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onChangeRawText(content);
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header Bar */}
      <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <ListOrdered className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Automation List (Comma or Markdown Lines)
            </h2>
            <p className="text-xs text-slate-500">
              Paste your items below. The macro will execute sequentially for each item.
            </p>
          </div>
        </div>

        {/* Advanced List Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Delimiter selector */}
          <div className="hidden sm:flex items-center bg-slate-200/60 p-0.5 rounded-lg text-xs font-medium text-slate-700">
            <button
              onClick={() => onDelimiterChange('auto')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                delimiter === 'auto' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Auto
            </button>
            <button
              onClick={() => onDelimiterChange('newline')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                delimiter === 'newline' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Lines
            </button>
            <button
              onClick={() => onDelimiterChange('comma')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                delimiter === 'comma' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Comma
            </button>
          </div>

          {/* Shuffle Button */}
          <button
            onClick={handleShuffle}
            disabled={parsedItems.length <= 1}
            title="Shuffle item order randomly"
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-40 transition-colors flex items-center gap-1 shadow-2xs"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Shuffle</span>
          </button>

          {/* Save to File */}
          <button
            onClick={handleSaveToFile}
            disabled={!rawListText.trim()}
            title="Save list to text file"
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-40 transition-colors flex items-center gap-1 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* Load from File */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.md,.csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Load list from file (.txt, .md, .csv)"
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors flex items-center gap-1 shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Load</span>
          </button>

          {/* Clear List */}
          <button
            onClick={() => onChangeRawText('')}
            title="Clear list"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sample Lists Bar */}
      <div className="px-5 py-2.5 bg-indigo-50/30 border-b border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-600 font-medium flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          Load Sample Lists:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => loadSampleList('products')}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors font-medium"
          >
            Products
          </button>
          <button
            onClick={() => loadSampleList('queries')}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors font-medium"
          >
            Search Queries
          </button>
          <button
            onClick={() => loadSampleList('emails')}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors font-medium"
          >
            Emails
          </button>
          <button
            onClick={() => loadSampleList('urls')}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors font-medium"
          >
            URLs
          </button>
        </div>
      </div>

      {/* Editor / Preview Toggle */}
      <div className="px-5 pt-3 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('edit')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'edit'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Raw Editor
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Parsed Items Preview ({parsedItems.length})
          </button>
        </div>

        <div className="text-xs font-medium text-slate-500 pb-2.5 tabular-nums">
          Total Items: <span className="font-bold text-slate-900">{parsedItems.length}</span>
        </div>
      </div>

      {/* Textarea or Preview */}
      <div className="p-4 bg-slate-50/30">
        {activeTab === 'edit' ? (
          <textarea
            value={rawListText}
            onChange={(e) => onChangeRawText(e.target.value)}
            placeholder="Paste your items here... e.g.:
- Apple iPhone 16 Pro
- Samsung Galaxy S25
- Google Pixel 9 Pro
Or separated by comma: item1, item2, item3"
            rows={7}
            className="w-full p-4 rounded-xl border border-slate-200 bg-white font-mono text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-y shadow-xs"
          />
        ) : (
          <div className="max-h-52 overflow-y-auto bg-white rounded-xl border border-slate-200 p-3 space-y-1.5 divide-y divide-slate-100">
            {parsedItems.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                <AlertCircle className="w-5 h-5 text-slate-300" />
                No items found. Paste list items in the editor tab or load a sample.
              </div>
            ) : (
              parsedItems.map((item, idx) => (
                <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-right font-bold text-slate-400 tabular-nums">
                      #{idx + 1}
                    </span>
                    <span className="text-slate-800 font-medium">{item}</span>
                  </div>
                  <span className="text-slate-400 text-[10px] bg-slate-100 px-2 py-0.5 rounded">
                    Ready
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
