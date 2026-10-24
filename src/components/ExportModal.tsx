import React, { useState } from 'react';
import { X, Copy, Check, Code, ExternalLink, Sparkles } from 'lucide-react';
import { Macro } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  macro: Macro;
  rawListText: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  macro,
  rawListText,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate automated JS bookmarklet script
  const generatedScript = `javascript:(function() {
  const macroName = ${JSON.stringify(macro.name)};
  const steps = ${JSON.stringify(macro.steps)};
  const items = ${JSON.stringify(
    rawListText.split('\n').map((i) => i.trim()).filter(Boolean)
  )};
  
  console.log('⚡ ClickFlow Studio Automation Started:', macroName);
  console.log('Total items to process:', items.length);

  let itemIdx = 0;
  async function runNextItem() {
    if (itemIdx >= items.length) {
      alert('ClickFlow Studio: All items completed successfully!');
      return;
    }
    const currentItem = items[itemIdx];
    console.log(\`Processing item \${itemIdx + 1}/\${items.length}: \${currentItem}\`);

    for (const step of steps) {
      await new Promise(r => setTimeout(r, step.delayMs || 500));
      if (step.type === 'type_list_item') {
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
          activeEl.value = currentItem;
          activeEl.dispatchEvent(new Event('input', { bubbles: true }));
        }
      } else if (step.type === 'key_press') {
        const activeEl = document.activeElement;
        if (activeEl) {
          activeEl.dispatchEvent(new KeyboardEvent('keydown', { key: step.keyCode || 'Enter', bubbles: true }));
        }
      } else if (step.type === 'click') {
        const el = step.selector ? document.querySelector(step.selector) : document.elementFromPoint(step.x || 100, step.y || 100);
        if (el) el.click();
      }
    }
    itemIdx++;
    setTimeout(runNextItem, 1000);
  }
  runNextItem();
})();`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Export Automation Bookmarklet
              </h3>
              <p className="text-xs text-slate-500">
                Run your recorded macro and list items on any external website.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="text-xs text-slate-600 space-y-2">
            <p className="font-semibold text-slate-800">How to use as a browser bookmarklet:</p>
            <ol className="list-decimal pl-4 space-y-1 text-slate-600">
              <li>Copy the JavaScript code snippet below.</li>
              <li>Create a new bookmark in your browser bookmarks bar.</li>
              <li>Paste the code as the bookmark URL (`URL:` field).</li>
              <li>Navigate to your target website, open your bookmarks bar, and click your saved bookmarklet!</li>
            </ol>
          </div>

          <div className="relative">
            <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto max-h-60">
              {generatedScript}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Bookmarklet
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Configured for: <strong className="text-slate-700">{macro.name}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
