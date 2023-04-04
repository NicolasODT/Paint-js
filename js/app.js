const myPics = document.getElementById("myPics");
const context = myPics.getContext("2d");
const rect = myPics.getBoundingClientRect(); // getboundingclientrect() renvoie la taille d'un élément et sa position relative par rapport à la zone d'affichage (viewport).
const colorButtons = document.querySelectorAll(
  "#yellow, #green, #red, #blue, #black, #white"
);
const sizeSelect = document.getElementById("sizeSelect");
const rectangleButton = document.getElementById("rectangle");
const normalButton = document.getElementById("normal");

let isDrawing = false; // isDrawing permet de savoir si on dessine ou non ( default = false)
let startX, startY, x, y; // startX et startY permettent de stocker les coordonnées du point de départ du tracé, x et y permettent de stocker les coordonnées du point d'arrivée du tracé
let currentMode = "pinceau"; // currentMode permet de savoir si on dessine un rectangle ou un pinceau ( default = pinceau)
let color = "black"; // color permet de stocker la couleur du pinceau ou du rectangle ( default = black)
let size = "3"; // size permet de stocker la taille du pinceau ou du rectangle ( default = 3)
let canvasImage; // canvasImage permet de stocker l'image du canvas
let rectangle = false; // rectangle permet de savoir si on dessine un rectangle ou un pinceau ( default = false)

// Fonctions permettant de dessiner avec le "pinceau"
function drawLine(context, x1, y1, x2, y2) {
  context.beginPath(); // beginPath() permet de commencer un nouveau chemin
  context.strokeStyle = color; // strokeStyle permet de définir la couleur du tracé
  context.lineWidth = size; // lineWidth permet de définir la taille du tracé
  context.moveTo(x1, y1); // moveTo permet de déplacer le point de départ du tracé
  context.lineTo(x2, y2); // lineTo permet de définir le point d'arrivée du tracé
  context.stroke(); // stroke permet de dessiner le tracé
  context.closePath(); // closePath permet de fermer le chemin
}

// Fonctions permettant de dessiner un rectangle
function drawRectangle(context, x1, y1, x2, y2) {
  context.beginPath();
  context.rect(x1, y1, x2 - x1, y2 - y1); // x1 et y1 permettent de définir le point de départ du rectangle, x2 - x1 et y2 - y1 permettent de définir la taille du rectangle
  context.strokeStyle = color;
  context.lineWidth = size;
  context.stroke();
}

// si on clique sur le canvas on récupère les coordonnées du pointeur de la souris par rapport au coin supérieur gauche du canvas et on stocke ces coordonnées dans les variables startX et startY
myPics.addEventListener("mousedown", (e) => {
  startX = x = e.clientX - rect.left;
  startY = y = e.clientY - rect.top;
  isDrawing = true;

  if (rectangle) {
    canvasImage = context.getImageData(0, 0, myPics.width, myPics.height); // getImageData permet de récupérer les données d'image du canvas pour garder le dessin précédent
  }
});

// si on bouge la souris on dessine sauf si isDrawing est false
myPics.addEventListener("mousemove", (e) => {
  if (!isDrawing) return; // si isDrawing est false, on ne dessine pas

  const newX = e.clientX - rect.left;
  const newY = e.clientY - rect.top;

  if (currentMode === "pinceau") {
    drawLine(context, x, y, newX, newY);
    x = newX;
    y = newY;
  } else if (currentMode === "rectangle" && rectangle) {
    context.putImageData(canvasImage, 0, 0); // putImageData permet de dessiner les données d'image sur le canvas et supprime les données d'image précédentes
    drawRectangle(context, startX, startY, newX, newY); // startX et startY permettent de définir le point de départ du rectangle, newX et newY permettent de définir le point d'arrivée du rectangle
  }
});

// si on relache le clic de la souris on arrête de dessiner sinon on continue de dessiner
window.addEventListener("mouseup", (e) => {
  if (!isDrawing) return;

  if (currentMode === "pinceau") {
    drawLine(context, x, y, e.clientX - rect.left, e.clientY - rect.top);
  }
  isDrawing = false;
});

// si un bouton est cliquer on récupère l'id de l'élément sur lequel on a cliqué et on le stocke dans la variable color ( donc il faut que les id des boutons soient les couleurs )
colorButtons.forEach((button) =>
  button.addEventListener("click", () => {
    color = button.id;
    if (color === "white") {
      size = "8";
      currentMode = "pinceau";
    }
  })
);

sizeSelect.addEventListener("change", () => {
  size = sizeSelect.value;
});

rectangleButton.addEventListener("click", () => {
  currentMode = "rectangle";
  rectangle = true;
});

normalButton.addEventListener("click", () => {
  currentMode = "pinceau";
  rectangle = false;
});
