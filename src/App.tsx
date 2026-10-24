import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Square,
  CircleDot,
  Undo2,
  Redo2,
  ListOrdered,
  Clock,
  Trash2,
  Shuffle,
  Download,
  Upload,
  Layers,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check,
  Code
} from 'lucide-react';

declare const chrome: any;

export default function App() {
  // List Text State
  const [listText, setListText] = useState(
    '- Product Alpha\n- Product Beta\n- Product Gamma\n- Product Delta'
  );
  const [intervalMs, setIntervalMs] = useState(500);

  // Recording & Sequence State
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSequence, setRecordedSequence] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [logs, setLogs] = useState<string[]>([]);

  // Guide Modal
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [copiedBookmarklet, setCopiedBookmarklet] = useState(false);

  // Undo / Redo History for List Text
  const [history, setHistory] = useState<string[]>([listText]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateListText = (newText: string) => {
    setListText(newText);
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(newText);
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const idx = historyIndex - 1;
      setHistoryIndex(idx);
      setListText(history[idx]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const idx = historyIndex + 1;
      setHistoryIndex(idx);
      setListText(history[idx]);
    }
  };

  const parsedItems = listText
    .split(/\n|,/)
    .map((i: string) => i.replace(/^[-*]\s*/, '').trim())
    .filter((i: string) => i.length > 0 && !i.startsWith('#'));

  const progressPercent =
    parsedItems.length > 0 && currentIndex >= 0
      ? Math.round(((currentIndex + 1) / parsedItems.length) * 100)
      : isExecuting
      ? 100
      : 0;

  // Listen for Chrome Extension messages if running as extension
  useEffect(() => {
    const messageListener = (message: any) => {
      if (message.action === 'BOX_RECORDED') {
        setRecordedSequence((prev: string[]) => [...prev, message.selector]);
        setLogs((prev: string[]) => [
          `[${new Date().toLocaleTimeString()}] Clicked box [${message.selector}] -> Patted "${message.item}"`,
          ...prev,
        ]);
      }
    };
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener(messageListener);
    }
    return () => {
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
        // chrome.runtime.onMessage.removeListener(messageListener);
      }
    };
  }, []);

  // Record Mode Toggle
  const handleToggleRecord = async () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordedSequence([]);
      setLogs((prev: string[]) => [`[${new Date().toLocaleTimeString()}] Record mode started. Click form boxes on the page!`, ...prev]);

      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
          if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: 'START_RECORDING',
              items: parsedItems,
            });
          }
        });
      }
    } else {
      setIsRecording(false);
      setLogs((prev: string[]) => [`[${new Date().toLocaleTimeString()}] Record mode stopped. ${recordedSequence.length} boxes recorded.`, ...prev]);

      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
          if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'STOP_RECORDING' }, (response: any) => {
              if (response && response.sequence) {
                setRecordedSequence(response.sequence);
              }
            });
          }
        });
      }
    }
  };

  // Batch Playback
  const handleBatchPlay = async () => {
    if (parsedItems.length === 0) return;

    setIsExecuting(true);
    setCurrentIndex(0);
    setLogs((prev: string[]) => [`[${new Date().toLocaleTimeString()}] Starting batch playback across ${parsedItems.length} items...`, ...prev]);

    // If extension context
    if (typeof chrome !== 'undefined' && chrome.tabs && recordedSequence.length > 0) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'PLAY_SEQUENCE',
            sequence: recordedSequence,
            items: parsedItems,
            interval: intervalMs,
          });
        }
      });
    }

    // Also simulate in local sandbox for testing in web preview
    for (let i = 0; i < parsedItems.length; i++) {
      setCurrentIndex(i);
      const item = parsedItems[i];
      await new Promise((r) => setTimeout(r, intervalMs));

      const sandboxInputs = document.querySelectorAll('.sandbox-box');
      if (sandboxInputs[i]) {
        (sandboxInputs[i] as HTMLInputElement).value = item;
        sandboxInputs[i].dispatchEvent(new Event('input', { bubbles: true }));
      }
      setLogs((prev: string[]) => [`[${new Date().toLocaleTimeString()}] Batch item #${i + 1}: "${item}"`, ...prev]);
    }

    setIsExecuting(false);
    setCurrentIndex(-1);
    setLogs((prev: string[]) => [`[${new Date().toLocaleTimeString()}] Batch playback complete!`, ...prev]);
  };

  const handleShuffle = () => {
    if (parsedItems.length <= 1) return;
    const shuffled = [...parsedItems].sort(() => Math.random() - 0.5);
    updateListText(shuffled.join('\n'));
  };

  const handleSave = () => {
    const blob = new Blob([listText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clickflow-sequence.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev: ProgressEvent<FileReader>) => {
      const content = ev.target?.result as string;
      if (content) updateListText(content);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const bookmarkletCode = `javascript:(function(){
  const items = ${JSON.stringify(parsedItems)};
  const inputs = document.querySelectorAll('input, textarea');
  inputs.forEach((el, i) => {
    if (items[i]) {
      el.value = items[i];
      el.dispatchEvent(new Event('input', {bubbles: true}));
    }
  });
  alert('ClickFlow Lite: Multi-box auto-paste complete!');
})();`;

  const copyBookmarklet = () => {
    navigator.clipboard.writeText(bookmarkletCode);
    setCopiedBookmarklet(true);
    setTimeout(() => setCopiedBookmarklet(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col font-sans antialiased max-w-md mx-auto shadow-2xl border-x border-[#262626]">
      {/* Header */}
      <header className="px-5 py-4 bg-[#121218] border-b border-[#262626] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E60033] flex items-center justify-center font-bold text-white text-xs shadow-md shadow-[#E60033]/30">
            ⚡
          </div>
          <div>
            <h1 className="font-brand uppercase tracking-wider text-sm font-bold text-white flex items-center gap-2">
              ClickFlow Lite
              <span className="text-[9px] bg-[#E60033]/20 text-[#E60033] px-2 py-0.5 rounded border border-[#E60033]/40 font-sans">
                v1.1
              </span>
            </h1>
          </div>
        </div>

        <button
          onClick={() => setShowHelpModal(true)}
          className="px-3 py-1.5 bg-[#121218] hover:bg-[#262626] border border-[#262626] rounded-lg text-xs font-medium text-[#94A3B8] hover:text-white transition-colors flex items-center gap-1.5"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#E60033]" /> Guide
        </button>
      </header>

      {/* Progress Bar */}
      {isExecuting && (
        <div className="bg-[#121218] px-5 py-2.5 border-b border-[#262626] space-y-1.5 animate-pulse">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#94A3B8]">
              Item <strong className="text-white">#{currentIndex + 1}</strong> of {parsedItems.length}
            </span>
            <span className="text-[#E60033] font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#080808] rounded-full overflow-hidden border border-[#262626]">
            <div
              className="h-full bg-[#E60033] transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(230,0,51,0.6)]"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="p-5 space-y-5 flex-1 flex flex-col">
        {/* History / Undo-Redo */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#94A3B8]">List History:</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="px-2.5 py-1 obsidian-card hover:bg-[#262626] disabled:opacity-40 rounded-lg text-xs text-[#94A3B8] hover:text-white flex items-center gap-1 transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3 h-3" /> Undo
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="px-2.5 py-1 obsidian-card hover:bg-[#262626] disabled:opacity-40 rounded-lg text-xs text-[#94A3B8] hover:text-white flex items-center gap-1 transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-3 h-3" /> Redo
            </button>
          </div>
        </div>

        {/* List Text Box (Central text area for lists separated by commas or markdown bullets) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-1.5 font-brand tracking-wide uppercase">
              <ListOrdered className="w-3.5 h-3.5 text-[#E60033]" />
              List Input (Comma or Bullet Points)
            </label>
            <span className="text-xs font-mono text-[#94A3B8]">{parsedItems.length} items</span>
          </div>

          <textarea
            value={listText}
            onChange={(e) => updateListText(e.target.value)}
            placeholder="- Item 1&#10;- Item 2&#10;or item1, item2..."
            rows={5}
            className="w-full p-3 rounded-xl crimson-input text-xs font-mono resize-y"
          />

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleShuffle}
                disabled={parsedItems.length <= 1}
                className="px-2.5 py-1 obsidian-card hover:bg-[#262626] disabled:opacity-40 rounded-lg text-xs text-[#94A3B8] hover:text-white flex items-center gap-1 transition-colors"
              >
                <Shuffle className="w-3 h-3" /> Shuffle
              </button>
              <button
                onClick={handleSave}
                disabled={!listText.trim()}
                className="px-2.5 py-1 obsidian-card hover:bg-[#262626] disabled:opacity-40 rounded-lg text-xs text-[#94A3B8] hover:text-white flex items-center gap-1 transition-colors"
              >
                <Download className="w-3 h-3" /> Save
              </button>
              <input type="file" ref={fileInputRef} onChange={handleLoad} accept=".txt,.md,.csv" className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 obsidian-card hover:bg-[#262626] rounded-lg text-xs text-[#94A3B8] hover:text-white flex items-center gap-1 transition-colors"
              >
                <Upload className="w-3 h-3" /> Load
              </button>
            </div>

            <button
              onClick={() => updateListText('')}
              className="p-1.5 text-[#94A3B8] hover:text-[#E60033] rounded-lg transition-colors"
              title="Clear list"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Multi-Box Record Mode & Batch Playback Controls */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={handleToggleRecord}
            className={`py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isRecording
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_12px_rgba(217,119,6,0.5)] animate-pulse'
                : 'obsidian-card hover:bg-[#262626] text-white'
            }`}
          >
            <CircleDot className={`w-4 h-4 ${isRecording ? 'animate-spin text-white' : 'text-[#E60033]'}`} />
            {isRecording ? 'Stop Recording' : 'Record Sequence'}
          </button>

          <button
            onClick={handleBatchPlay}
            disabled={parsedItems.length === 0 || isExecuting}
            className="py-3 crimson-btn rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" /> Play Batch
          </button>
        </div>

        {/* Recorded Sequence Summary */}
        <div className="obsidian-card rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-white font-brand tracking-wide uppercase">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#E60033]" />
              Recorded Box Sequence ({recordedSequence.length})
            </span>
            {recordedSequence.length > 0 && (
              <button
                onClick={() => setRecordedSequence([])}
                className="text-[10px] text-[#94A3B8] hover:text-[#E60033] font-sans font-normal"
              >
                Clear
              </button>
            )}
          </div>
          {recordedSequence.length === 0 ? (
            <div className="text-[11px] text-[#94A3B8]/60 italic">
              Click "Record Sequence" and click input boxes on your page to record selectors.
            </div>
          ) : (
            <div className="max-h-24 overflow-y-auto space-y-1 font-mono text-[10px] text-[#94A3B8]">
              {recordedSequence.map((sel: string, idx: number) => (
                <div key={idx} className="bg-[#080808] px-2 py-1 rounded border border-[#262626] flex items-center justify-between">
                  <span>#{idx + 1}: {sel}</span>
                  <span className="text-[#E60033]">{parsedItems[idx % parsedItems.length]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interval Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-white flex items-center gap-1.5 font-brand tracking-wide uppercase">
            <Clock className="w-3.5 h-3.5 text-[#E60033]" />
            Interval Delay ({intervalMs}ms)
          </label>
          <div className="flex gap-2">
            {[100, 250, 500, 1000].map((ms) => (
              <button
                key={ms}
                onClick={() => setIntervalMs(ms)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  intervalMs === ms
                    ? 'bg-[#E60033] text-white shadow-[0_0_10px_rgba(230,0,51,0.4)]'
                    : 'obsidian-card text-[#94A3B8] hover:text-white hover:bg-[#262626]'
                }`}
              >
                {ms}ms
              </button>
            ))}
          </div>
        </div>

        {/* Sandbox Test Target (Multi-box simulation for preview) */}
        <div className="space-y-2 pt-2 border-t border-[#262626]">
          <label className="block text-xs font-medium text-[#94A3B8]">Multi-Box Sandbox Test Area</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Box 1 (e.g. First Name)"
              className="sandbox-box px-3 py-2 crimson-input rounded-xl text-xs font-mono"
            />
            <input
              type="text"
              placeholder="Box 2 (e.g. Last Name)"
              className="sandbox-box px-3 py-2 crimson-input rounded-xl text-xs font-mono"
            />
            <input
              type="text"
              placeholder="Box 3 (e.g. Email)"
              className="sandbox-box px-3 py-2 crimson-input rounded-xl text-xs font-mono"
            />
            <input
              type="text"
              placeholder="Box 4 (e.g. Company)"
              className="sandbox-box px-3 py-2 crimson-input rounded-xl text-xs font-mono"
            />
          </div>
        </div>

        {/* Mini Logs */}
        <div className="obsidian-card rounded-xl p-3 font-mono text-[11px] space-y-1.5 max-h-28 overflow-y-auto">
          <div className="text-[#94A3B8] uppercase tracking-wider font-bold text-[10px]">Execution Logs ({logs.length})</div>
          {logs.length === 0 ? (
            <div className="text-[#94A3B8]/60">Ready to record or play...</div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="text-[#94A3B8] truncate">
                {log}
              </div>
            ))
          )}
        </div>
      </main>

      {/* Guide Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="obsidian-card rounded-2xl p-6 max-w-sm w-full space-y-5 text-xs shadow-2xl border border-[#262626]">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <h3 className="font-brand uppercase tracking-wider font-bold text-sm text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-[#E60033]" />
                Sequence Recorder Guide
              </h3>
              <button onClick={() => setShowHelpModal(false)} className="text-[#94A3B8] hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-[#94A3B8]">
              <p>How to use the <strong className="text-white">Multi-Box Auto-Pasting Sequence Recorder</strong>:</p>
              
              <ol className="list-decimal pl-4 space-y-1.5 text-[#94A3B8]">
                <li>Paste your list in the central text box (separated by commas or markdown bullet points like <code className="text-[#E60033]">- Item</code>).</li>
                <li>Click <strong className="text-white">"Record Sequence"</strong>.</li>
                <li>Click on text input boxes on your target web page in the exact order you want them filled.</li>
                <li>Click <strong className="text-white">"Stop Recording"</strong> when finished.</li>
                <li>Click <strong className="text-white">"Play Batch"</strong> to automatically fill all recorded boxes sequentially item-by-item!</li>
              </ol>

              <div className="relative">
                <pre className="p-3 bg-[#080808] text-[#E60033] rounded-xl font-mono text-[10px] overflow-x-auto max-h-28 border border-[#262626]">
                  {bookmarkletCode}
                </pre>
                <button
                  onClick={copyBookmarklet}
                  className="absolute top-2.5 right-2.5 px-2.5 py-1 crimson-btn rounded text-[10px] font-semibold flex items-center gap-1"
                >
                  {copiedBookmarklet ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedBookmarklet ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 crimson-btn rounded-xl font-bold uppercase tracking-wider transition-colors"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
