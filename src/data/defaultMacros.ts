import { Macro } from '../types';

export const DEFAULT_MACROS: Macro[] = [
  {
    id: 'macro-1',
    name: 'Smart Search & Navigate',
    description: 'Types the current list item into the search box, hits enter, waits for results, and clicks the first link.',
    defaultIntervalMs: 800,
    loopCount: 1,
    createdAt: Date.now(),
    steps: [
      {
        id: 's1',
        type: 'click',
        x: 320,
        y: 180,
        selector: '#sandbox-search-input',
        delayMs: 400,
        description: 'Click search input field'
      },
      {
        id: 's2',
        type: 'type_list_item',
        delayMs: 600,
        description: 'Type current list item into search box'
      },
      {
        id: 's3',
        type: 'key_press',
        keyCode: 'Enter',
        delayMs: 1200,
        description: 'Press Enter key to execute search'
      },
      {
        id: 's4',
        type: 'click',
        x: 320,
        y: 280,
        selector: '.sandbox-result-item:first-child',
        delayMs: 800,
        description: 'Click first result item'
      }
    ]
  },
  {
    id: 'macro-2',
    name: 'Bulk Form Submission',
    description: 'Fills out form fields using list items sequentially for rapid data entry testing.',
    defaultIntervalMs: 500,
    loopCount: 1,
    createdAt: Date.now(),
    steps: [
      {
        id: 'f1',
        type: 'click',
        x: 200,
        y: 150,
        selector: '#form-input-name',
        delayMs: 300,
        description: 'Click Name / Query input'
      },
      {
        id: 'f2',
        type: 'type_list_item',
        delayMs: 500,
        description: 'Type list item into input field'
      },
      {
        id: 'f3',
        type: 'click',
        x: 200,
        y: 220,
        selector: '#form-submit-btn',
        delayMs: 1000,
        description: 'Click Submit / Save button'
      }
    ]
  },
  {
    id: 'macro-3',
    name: 'Rapid Clicker Test',
    description: 'Repeatedly clicks the target button with custom interval delays.',
    defaultIntervalMs: 250,
    loopCount: 5,
    createdAt: Date.now(),
    steps: [
      {
        id: 'r1',
        type: 'click',
        x: 400,
        y: 200,
        selector: '#click-target-btn',
        delayMs: 250,
        description: 'Click target button'
      }
    ]
  }
];
