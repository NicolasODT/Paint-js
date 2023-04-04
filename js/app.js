// Un booléen qui, lorsqu'il est vrai, indique que le déplacement de
// la souris entraîne un dessin sur le canevas
let isDrawing = false;
let x = 0;
let y = 0;

const myPics = document.getElementById("myPics");
const context = myPics.getContext("2d");

// On récupère le décalage du canevas en x et y par rapport aux bords
// de la page
const rect = myPics.getBoundingClientRect();

// On ajoute les gestionnaires d'évènements pour mousedown, mousemove
// et mouseup
myPics.addEventListener("mousedown", (e) => {
  x = e.clientX - rect.left;
  y = e.clientY - rect.top;
  isDrawing = true;
});

myPics.addEventListener("mousemove", (e) => {
  if (isDrawing === true) {
    drawLine(context, x, y, e.clientX - rect.left, e.clientY - rect.top);
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
  }
});

window.addEventListener("mouseup", (e) => {
  if (isDrawing === true) {
    drawLine(context, x, y, e.clientX - rect.left, e.clientY - rect.top);
    x = 0;
    y = 0;
    isDrawing = false;
  }
});

const colorButtons = document.querySelectorAll(
  "#yellow, #green, #red, #blue, #black, #white"
);

for (const button of colorButtons) {
  button.addEventListener("click", () => {
    color = button.id;
    if (color === "white") {
      size = "20";
    }
  });
}

const sizeSelect = document.getElementById("sizeSelect");

sizeSelect.addEventListener("change", () => {
  size = sizeSelect.value;
});

let color = "black";
let size = "1";
function drawLine(context, x1, y1, x2, y2) {
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = size;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}
