"use strict";

const board        = document.getElementById("board");
const ctx          = board.getContext("2d");
const colorPicker  = document.getElementById("color-picker");
const colorPreview = document.getElementById("color-preview");
const brushSize    = document.getElementById("brush-size");
const sizeVal      = document.getElementById("size-val");
const opacitySlider = document.getElementById("opacity");
const opacityVal   = document.getElementById("opacity-val");
const btnBrush     = document.getElementById("btn-brush");
const btnEraser    = document.getElementById("btn-eraser");
const btnFill      = document.getElementById("btn-fill");
const btnClear     = document.getElementById("btn-clear");
const btnUndo      = document.getElementById("btn-undo");
const btnDownload  = document.getElementById("btn-download");
const modeIndicator = document.getElementById("mode-indicator");
const presetsEl    = document.getElementById("presets");
const PRESET_COLORS = [
  "#1a1a1a", "#ffffff", "#e24b4a", "#1d9e75",
  "#185fa5", "#ba7517", "#7f77dd", "#d4537e", "#888780",
];
const MAX_HISTORY = 20;

let mode      = "brush";
let isDrawing = false;
let history   = [];

function init() {
  buildPresets();
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  bindEvents();
}

function buildPresets() {
  PRESET_COLORS.forEach((color) => {
    const swatch = document.createElement("div");
    swatch.className = "preset";
    swatch.style.background = color;
    swatch.title = color;
    swatch.addEventListener("click", () => setColor(color));
    presetsEl.appendChild(swatch);
  });
}

function setColor(hex) {
  colorPicker.value = hex;
  colorPreview.style.background = hex;
}

function resizeCanvas() {
  const wrap   = board.parentElement;
  const w      = Math.min(wrap.clientWidth  - 24, 1200);
  const h      = Math.min(wrap.clientHeight - 24, 800);
  const saved  = ctx.getImageData(0, 0, board.width, board.height);

  board.width  = w;
  board.height = h;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.putImageData(saved, 0, 0);
}

function saveHistory() {
  if (history.length >= MAX_HISTORY) history.shift();
  history.push(ctx.getImageData(0, 0, board.width, board.height));
}

function undo() {
  if (!history.length) return;
  ctx.putImageData(history.pop(), 0, 0);
}

function setMode(m) {
  mode = m;
  btnBrush.classList.toggle("active",  m === "brush");
  btnEraser.classList.toggle("active", m === "eraser");
  board.style.cursor = m === "eraser" ? "cell" : "crosshair";
}

function getPos(e) {
  const rect = board.getBoundingClientRect();
  const src  = e.touches ? e.touches[0] : e;
  return {
    x: src.clientX - rect.left,
    y: src.clientY - rect.top,
  };
}

function startDraw(e) {
  e.preventDefault();
  if (mode !== "brush" && mode !== "eraser") return;
  saveHistory();
  isDrawing = true;
  const { x, y } = getPos(e);
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function draw(e) {
  e.preventDefault();
  if (!isDrawing) return;

  const { x, y } = getPos(e);

  ctx.lineWidth  = brushSize.value;
  ctx.lineCap    = "round";
  ctx.lineJoin   = "round";

  if (mode === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.globalAlpha = 1;
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = colorPicker.value;
    ctx.globalAlpha = parseInt(opacitySlider.value, 10) / 100;
  }

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function endDraw() {
  if (!isDrawing) return;
  isDrawing = false;
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.beginPath();
}

function clearCanvas() {
  saveHistory();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, board.width, board.height);
  toast("Canvas cleared");
}

function fillCanvas() {
  saveHistory();
  ctx.globalAlpha = parseInt(opacitySlider.value, 10) / 100;
  ctx.fillStyle   = colorPicker.value;
  ctx.fillRect(0, 0, board.width, board.height);
  ctx.globalAlpha = 1;
  toast("Canvas filled");
}

function downloadImage() {
  const tmp   = document.createElement("canvas");
  tmp.width   = board.width;
  tmp.height  = board.height;
  const tc    = tmp.getContext("2d");
  tc.fillStyle = "#ffffff";
  tc.fillRect(0, 0, tmp.width, tmp.height);
  tc.drawImage(board, 0, 0);

  const a      = document.createElement("a");
  a.download   = `paint-${Date.now()}.png`;
  a.href       = tmp.toDataURL("image/png");
  a.click();
}

let _toastTimer;
function toast(text) {
  modeIndicator.textContent = text;
  modeIndicator.classList.add("show");
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => modeIndicator.classList.remove("show"), 1500);
}

function bindEvents() {
  board.addEventListener("pointerdown", startDraw);
  board.addEventListener("pointermove", draw);
  board.addEventListener("pointerup",   endDraw);
  board.addEventListener("pointerout",  endDraw);
  board.addEventListener("touchstart", startDraw, { passive: false });
  board.addEventListener("touchmove",  draw,       { passive: false });
  board.addEventListener("touchend",   endDraw);

  btnBrush.addEventListener("click",    () => { setMode("brush");  toast("Brush"); });
  btnEraser.addEventListener("click",   () => { setMode("eraser"); toast("Eraser"); });
  btnUndo.addEventListener("click",     undo);
  btnClear.addEventListener("click",    clearCanvas);
  btnFill.addEventListener("click",     fillCanvas);
  btnDownload.addEventListener("click", downloadImage);

  colorPicker.addEventListener("input", () => {
    colorPreview.style.background = colorPicker.value;
  });

  brushSize.addEventListener("input", () => {
    sizeVal.textContent = brushSize.value;
  });
  opacitySlider.addEventListener("input", () => {
    opacityVal.textContent = opacitySlider.value + "%";
  });

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "z") {
      e.preventDefault();
      undo();
    }
    if (!e.ctrlKey && !e.metaKey && !e.altKey) {
      if (e.key === "b") { setMode("brush");  toast("Brush"); }
      if (e.key === "e") { setMode("eraser"); toast("Eraser"); }
    }
  });
}

init();
