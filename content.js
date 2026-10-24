/**
 * ClickFlow Lite - Content Script for Multi-Box Auto-Pasting Sequence Recorder
 */

let isRecording = false;
let recordedSequence = [];
let currentListItems = [];
let itemIndex = 0;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'START_RECORDING') {
    isRecording = true;
    currentListItems = request.items || [];
    itemIndex = 0;
    recordedSequence = [];
    document.addEventListener('click', handlePageClick, true);
    sendResponse({ status: 'recording_started' });
  } else if (request.action === 'STOP_RECORDING') {
    isRecording = false;
    document.removeEventListener('click', handlePageClick, true);
    sendResponse({ status: 'recording_stopped', sequence: recordedSequence });
  } else if (request.action === 'PLAY_SEQUENCE') {
    const sequence = request.sequence || [];
    const items = request.items || [];
    const interval = request.interval || 500;
    playSequence(sequence, items, interval);
    sendResponse({ status: 'playback_started' });
  }
});

function getCssSelector(el) {
  if (el.id) return `#${CSS.escape(el.id)}`;
  if (el.className && typeof el.className === 'string') {
    const classes = el.className.trim().split(/\s+/).join('.');
    if (classes) return `${el.tagName.toLowerCase()}.${classes}`;
  }
  return el.tagName.toLowerCase();
}

function handlePageClick(e) {
  if (!isRecording) return;
  const target = e.target;
  const tagName = target.tagName ? target.tagName.toLowerCase() : '';
  const isEditable = tagName === 'input' || tagName === 'textarea' || target.isContentEditable;

  if (isEditable) {
    e.preventDefault();
    e.stopPropagation();

    const selector = getCssSelector(target);
    recordedSequence.push(selector);

    const nextItem = currentListItems[itemIndex % currentListItems.length] || '';
    
    if (target.isContentEditable) {
      target.innerText = nextItem;
    } else {
      target.value = nextItem;
    }

    target.dispatchEvent(new Event('input', { bubbles: true }));
    target.dispatchEvent(new Event('change', { bubbles: true }));

    itemIndex++;

    chrome.runtime.sendMessage({
      action: 'BOX_RECORDED',
      selector,
      item: nextItem,
      totalRecorded: recordedSequence.length
    });
  }
}

async function playSequence(sequence, items, interval) {
  for (let i = 0; i < sequence.length; i++) {
    const selector = sequence[i];
    const item = items[i % items.length];
    const el = document.querySelector(selector);

    if (el) {
      if (el.isContentEditable) {
        el.innerText = item;
      } else {
        el.value = item;
      }
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }

    await new Promise((r) => setTimeout(r, interval));
  }
}
