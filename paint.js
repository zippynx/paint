const board = document.getElementById("board");
const context = board.getContext("2d");

let isDrawing = false;
const colorPicker = document.getElementById("color-picker");
const brushSize = document.getElementById("brush-size");
const clearButton = document.getElementById("clear-button");
const fillButton = document.getElementById("fill-button");
const downloadButton = document.getElementById("download-button");

board.addEventListener("pointerdown", () => {isDrawing = true}); 
board.addEventListener("pointerup", () => {
    isDrawing = false;
    context.beginPath(); 
});
board.addEventListener("pointerout", () => {isDrawing = false}); 
board.addEventListener("pointermove", draw);
board.style.touchAction = "none";

clearButton.addEventListener("click", clearCanvas);
fillButton.addEventListener("click", fillCanvas);
downloadButton.addEventListener("click", downloadImage);

function draw(e) { 
    if (!isDrawing) return;

    context.lineWidth = brushSize.value;
    context.lineCap = "round";
    context.strokeStyle = colorPicker.value;

    context.lineTo(e.offsetX, e.offsetY); 
    context.stroke();   
    context.beginPath(); 
    context.moveTo(e.offsetX, e.offsetY); 
}

function clearCanvas() {
    context.clearRect(0, 0, board.width, board.height);
}

function fillCanvas() {
    context.fillStyle = colorPicker.value;
    context.fillRect(0, 0, board.width, board.height);
}

function downloadImage() {
    const imageLink = document.createElement("a");
    imageLink.download = `kennyyipcoding-${Date.now()}.png`;  
    imageLink.href = board.toDataURL("image/png");
    imageLink.click();
}