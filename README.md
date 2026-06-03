# Paint App

Browser-based drawing app. No dependencies, no build step open and draw.

## Files

```
paint-app/
├── index.html   
├── paint.css    
└── paint.js     
```

## Usage

Download all three files into the same folder, then open `index.html` in any modern browser.

## Features

| Feature | Detail |
|---|---|
| Brush | Freehand drawing with adjustable size and opacity |
| Eraser | True erase via `destination-out` compositing |
| Fill | Flood-fill canvas with current color + opacity |
| Undo | Up to 20 steps — `Ctrl+Z` / `⌘Z` |
| Presets | 9 quick-access color swatches |
| Save | Exports as `.png` with white background |

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `B` | Switch to Brush |
| `E` | Switch to Eraser |
| `Ctrl+Z` / `⌘Z` | Undo |

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). Uses Pointer Events API — supports mouse, touch, and stylus input.
