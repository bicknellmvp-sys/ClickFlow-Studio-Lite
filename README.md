# ClickFlow Lite (Multi-Box Sequence Recorder) ⚡

**ClickFlow Lite** is a high-performance Chrome Extension and web automation tool featuring a **Multi-Box Auto-Pasting Sequence Recorder** and smart list iteration.

---

## 🎨 Design System ("Color me NSFW" Aesthetic)

- **Canvas Background**: `#080808` (Deep obsidian black)
- **Primary Accent**: `#E60033` (Electric Crimson) with crimson glow box-shadows
- **Panel Surfaces**: `#121218` with 1px `#262626` borders
- **Typography**: Playfair Display (serif uppercase wide-tracking headers) & Inter (sans-serif UI elements)

---

## 🚀 Key Features

1. **Central List Input**: Paste lists separated by commas or markdown bullet points (`-` or `*`). Markdown bullets and comments are automatically parsed.
2. **Multi-Box Sequence Record Mode**:
   - Click **"Record Sequence"** to activate page-level box tracking.
   - Click any `<input>`, `<textarea>`, or `contentEditable` field on your target web page in the exact order you want them filled.
   - Each click automatically captures the CSS selector, pastes the next item from the list, and dispatches `input` and `change` events so React/Vue/Svelte register the text.
3. **Batch Playback**:
   - Click **"Play Batch"** to automatically iterate through your recorded box sequence and fill each corresponding text box sequentially with configurable interval delays (`100ms`, `250ms`, `500ms`, `1000ms`).
4. **Chrome Extension Manifest v3**: Fully packaged with a background service worker (`background.js`), content script (`content.js`), and popup UI (`index.html`).
5. **Undo & Redo History**: History stack for list edits with keyboard shortcuts (`Ctrl+Z` / `Ctrl+Y`).

---

## 🛠️ Getting Started (Local Development)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Build for extension / production**:
   ```bash
   npm run build
   ```

---

## 📦 Loading as a Chrome Extension

1. Run `npm run build`.
2. Open `chrome://extensions` in Google Chrome.
3. Enable **Developer mode** in the top right.
4. Click **"Load unpacked"** and select your project's build/dist folder.

---

## 📄 License

Distributed under the Apache 2.0 License.
