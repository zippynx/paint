const board = document.getElementById("board");
const context = board.getContext("2d");
let isDrawing = false;

const colorPicker = document.getElementById("color-picker");
const brushSize = document.getElementById("brush-size");
const sizeVal = document.getElementById("size-val");
const clearButton = document.getElementById("clear-button");
const fillButton = document.getElementById("fill-button");
const downloadButton = document.getElementById("download-button");

function initCanvas() {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, board.width, board.height);
}
initCanvas();

brushSize.addEventListener("input", (e) => {
    sizeVal.textContent = e.target.value;
});

board.addEventListener("pointerdown", (e) => {
    isDrawing = true;
    draw(e); 
}); 

board.addEventListener("pointerup", () => {
    isDrawing = false;
    context.beginPath(); 
});

board.addEventListener("pointerout", () => {
    isDrawing = false;
    context.beginPath();
}); 

board.addEventListener("pointermove", draw);
board.style.touchAction = "none";

clearButton.addEventListener("click", () => {
    initCanvas(); 
});

fillButton.addEventListener("click", () => {
    context.fillStyle = colorPicker.value;
    context.fillRect(0, 0, board.width, board.height);
});

downloadButton.addEventListener("click", () => {
    const imageLink = document.createElement("a");
    imageLink.download = `MyArtwork-${Date.now()}.png`;  
    imageLink.href = board.toDataURL("image/png");
    imageLink.click();
});

function draw(e) { 
    if (!isDrawing) return;

    const rect = board.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.lineWidth = brushSize.value;
    context.lineCap = "round";
    context.lineJoin = "round"; 
    context.strokeStyle = colorPicker.value;
    
    context.lineTo(x, y); 
    context.stroke();   
    context.beginPath(); 
    context.moveTo(x, y); 
}
