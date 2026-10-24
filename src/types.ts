export type ActionType = 'click' | 'double_click' | 'type_text' | 'type_list_item' | 'key_press' | 'wait' | 'scroll' | 'custom_js';

export interface MacroStep {
  id: string;
  type: ActionType;
  x?: number;
  y?: number;
  textValue?: string; // For typing or custom text
  keyCode?: string; // e.g. 'Enter', 'Tab', 'Space'
  delayMs: number; // Interval before/after action
  selector?: string; // CSS selector if applicable
  description: string;
}

export interface Macro {
  id: string;
  name: string;
  description: string;
  steps: MacroStep[];
  defaultIntervalMs: number;
  loopCount: number; // 0 for infinite or number of loops per item
  createdAt: number;
}

export interface ExecutionLog {
  id: string;
  timestamp: number;
  itemIndex: number;
  itemValue: string;
  stepIndex: number;
  stepDescription: string;
  status: 'success' | 'error' | 'running';
  message: string;
}

export type AppTab = 'studio' | 'sandbox' | 'history' | 'templates';
