const myPics = document.getElementById("myPics");
const context = myPics.getContext("2d");
const rect = myPics.getBoundingClientRect(); // getboundingclientrect() renvoie la taille d'un élément et sa position relative par rapport à la zone d'affichage (viewport).
const colorButtons = document.querySelectorAll(".color");
const sizeSelect = document.getElementById("sizeSelect");
const rectangleButton = document.getElementById("rectangle");
const cercleButton = document.getElementById("cercle");
const normalButton = document.getElementById("normal");
const clearButton = document.getElementById("clear");
const textButton = document.getElementById("text");

let isDrawing = false; // isDrawing permet de savoir si on dessine ou non (default = false)
let startX, startY, x, y; // startX et startY permettent de stocker les coordonnées du point de départ du tracé, x et y permettent de stocker les coordonnées du point d'arrivée du tracé
let currentMode = "pinceau"; // currentMode permet de savoir si on dessine un rectangle ou un pinceau (default = pinceau)
let color = "black"; // color permet de stocker la couleur du pinceau ou du rectangle (default = black)
let size = "3"; // size permet de stocker la taille du pinceau ou du rectangle (default = 3)
let canvasImage; // canvasImage permet de stocker l'image du canvas
let rectangle = false; // rectangle permet de savoir si on dessine un rectangle ou un pinceau (default = false)
let canvasHistory = []; // pour stocker l'historique des images du canvas

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
function drawCercle(context, x1, y1, radius) {
  context.beginPath();
  context.arc(x1, y1, radius, 0, 2 * Math.PI);
  context.strokeStyle = color;
  context.lineWidth = size;
  context.stroke();
}

// fonction qui permettant de vider le canvas (clear)
function clearCanvas() {
  context.clearRect(0, 0, myPics.width, myPics.height);
}

// fonction qui permettant de dessiner du texte
function drawText(x, y, text) {
  context.font = "24px Arial";
  context.fillStyle = color;
  context.fillText(text, x - rect.left, y - rect.top);
}

function createInput(x, y) {
  const input = document.createElement("input"); // on crée un input
  input.type = "text";
  input.style.position = "absolute";
  input.style.left = x + "px";
  input.style.top = y + "px";
  document.body.appendChild(input); // on ajoute l'input au body

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const text = input.value; // on récupère la valeur de l'input (le texte)
      drawText(x, y, text); // on dessine le texte à l'endroit où on a cliqué grâce aux coordonnées x et y
      input.remove(); // on supprime l'input
    }
  });
  input.focus(); // focus permet de mettre le curseur dans l'input
}

// on stocke l'historique des images du canvas
function saveCanvas() {
  canvasHistory.push(context.getImageData(0, 0, myPics.width, myPics.height));
}

// si on clique sur le canvas on récupère les coordonnées du pointeur de la souris par rapport au coin supérieur gauche du canvas et on stocke ces coordonnées dans les variables startX et startY
myPics.addEventListener("mousedown", (e) => {
  startX = x = e.clientX - rect.left;
  startY = y = e.clientY - rect.top;
  isDrawing = true;

  if (rectangle || cercle) {
    canvasImage = context.getImageData(0, 0, myPics.width, myPics.height); // getImageData permet de récupérer les données d'image du canvas pour garder le dessin précédent
  }
  saveCanvas(); // on stocke l'historique des images du canvas
});

// si on bouge la souris on dessine sauf si isDrawing est false
myPics.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;

  const newX = e.clientX - rect.left;
  const newY = e.clientY - rect.top;

  if (currentMode === "pinceau") {
    drawLine(context, x, y, newX, newY);
    x = newX;
    y = newY;
  } else if (currentMode === "rectangle" && rectangle) {
    context.putImageData(canvasImage, 0, 0);
    drawRectangle(context, startX, startY, newX, newY);
  } else if (currentMode === "cercle" && cercle) {
    context.putImageData(canvasImage, 0, 0);
    const radius = Math.sqrt(
      Math.pow(newX - startX, 2) + Math.pow(newY - startY, 2)
    ); // Calculez le rayon en fonction de la distance entre les coordonnées de départ et d'arrivée de la souris
    drawCercle(context, startX, startY, radius); // Utilisez le rayon calculé pour dessiner le cercle
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

// si un bouton est cliquer on récupère l'id de l'élément sur lequel on a cliqué et on le stocke dans la variable color (donc il faut que les id des boutons soient les couleurs)
colorButtons.forEach((button) =>
  button.addEventListener("click", () => {
    color = button.getAttribute("data-color");
    if (color === "white") {
      size = "8";
      currentMode = "pinceau";
    }
    console.log(color);
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

cercleButton.addEventListener("click", () => {
  currentMode = "cercle";
  rectangle = false;
});

clearButton.addEventListener("click", () => {
  saveCanvas(); // on stocke l'historique des images du canvas
  clearCanvas(); // on vide le canvas
});

textButton.addEventListener("click", () => {
  currentMode = "text";
  myPics.addEventListener(
    "click",
    (e) => {
      const textX = e.clientX;
      const textY = e.clientY;
      createInput(textX, textY); // on crée un input à l'endroit où on a cliqué
      currentMode = "pinceau";
    },
    { once: true }
  );
});

// fonction qui permet de revenir en arrière
window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "z") {
    if (canvasHistory.length > 1) {
      // on vérifie que l'historique contient au moins 2 images
      canvasHistory.pop(); // on supprime la dernière image de l'historique
      const previousCanvas = canvasHistory[canvasHistory.length - 1]; // on récupère la dernière image de l'historique
      context.putImageData(previousCanvas, 0, 0); // on dessine l'image précédente
    }
  }
});
