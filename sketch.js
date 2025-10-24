let video;
let circleSize = 10; // Diameter of each circle
let gridWidth; // Width of the grid in pixels
let gridHeight; // Height of the grid in pixels
let clickedPositions = []; // Store positions of mouse clicks

// Audio-related variables
let mic;
let fft;

// Font and 3D Model
let myFont;
let myModel; // 3D object

let rotationX = 0; // X-axis
let rotationY = 0; // Y-axis
let prevMouseX, prevMouseY; 

function preload() {
  myFont = loadFont('fonts/IBMPlexMono-Regular.ttf');
  myModel = loadModel('models/origami.obj', true);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  gridWidth = windowWidth * 0.8; 
  gridHeight = windowHeight * 0.8; 

  video = createCapture(VIDEO);
  video.size(floor(gridWidth / circleSize), floor(gridHeight / circleSize)); 
  video.hide();
  noStroke();

  mic = new p5.AudioIn();
  mic.start(() => console.log("Microphone started successfully."));

  fft = new p5.FFT();
  fft.setInput(mic);

  textFont(myFont); 
  textSize(16);

  prevMouseX = mouseX;
  prevMouseY = mouseY;
}
let myModel2; // Second 3D crane model

function preload() {

  myFont = loadFont('fonts/IBMPlexMono-Regular.ttf'); 

  myModel = loadModel('models/origami.obj', true); // First crane model
  myModel2 = loadModel('models/origami.obj', true); // Second crane model
  }

function draw() {
  background(50);

  const centerX = windowWidth / 2;
  const centerY = windowHeight / 2;

  directionalLight(255, 255, 255, 0.5, 0.5, -1);
  ambientLight(100);

  // Render the 3D model
  push();
  translate(windowWidth / 4, 0, 100); 
  rotateX(rotationX); 
  rotateY(rotationY); 
  scale(1); 
  model(myModel); 
  pop();


    push();
    translate(-windowWidth / 4, 100, 200);
    rotateX(rotationX * 0.8); 
    rotateY(rotationY * 1.2);
    scale(1.2); 
    model(myModel2); 
    pop();

  push();
  translate(-gridWidth / 2, -gridHeight / 2, 0);
  video.loadPixels();
  for (let y = 0; y < video.height; y++) {
    for (let x = 0; x < video.width; x++) {
      let index = (x + y * video.width) * 4;
      let r = video.pixels[index];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];

      let isClicked = clickedPositions.some(pos => 
        dist(pos.x, pos.y, x * circleSize, y * circleSize) < circleSize
      );

      fill(isClicked ? 255 : r, isClicked ? 255 : g, isClicked ? 255 : b);

      let zOffset = map((r + g + b) / 3, 0, 255, -50, 50);
      push();
      translate(x * circleSize, y * circleSize, zOffset);
      ellipse(0, 0, circleSize); 
      pop();
    }
  }
  pop();

  resetMatrix(); 
  noLights(); 

  fill(255); 
  textFont(myFont); 
  textSize(16);
  textAlign(CENTER, CENTER);

  let leftX = centerX - gridWidth / 2 - 700; 
  let rightX = centerX + gridWidth / 2 + 700; 
  let topY = centerY - gridHeight / 2 - 370; 
  let bottomY = centerY + gridHeight / 2 + 100; 

  for (let x = 0; x <= gridWidth; x += 40) {
    let value = floor(random(100)); 
    text(value, leftX + x + 40, topY); 
    text(value, leftX + x + 40, bottomY); 
  }

  for (let y = 0; y <= gridHeight; y += 40) {
    let value = floor(random(100)); 
    text(value, leftX, topY + y); 
    text(value, rightX, topY + y); 
  }
}

function mousePressed() {
  let gridX = floor((mouseX - width / 2 + gridWidth / 2) / circleSize);
  let gridY = floor((mouseY - height / 2 + gridHeight / 2) / circleSize);

  if (gridX >= 0 && gridX < video.width && gridY >= 0 && gridY < video.height) {
    clickedPositions.push({ x: gridX * circleSize, y: gridY * circleSize });
  }

  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

function mouseDragged() {

  let gridX = floor((mouseX - width / 2 + gridWidth / 2) / circleSize);
  let gridY = floor((mouseY - height / 2 + gridHeight / 2) / circleSize);


  if (
    gridX >= 0 &&
    gridX < video.width &&
    gridY >= 0 &&
    gridY < video.height
  ) {

    let alreadyClicked = clickedPositions.some(
      (pos) => pos.x === gridX * circleSize && pos.y === gridY * circleSize
    );

    if (!alreadyClicked) {
      clickedPositions.push({ x: gridX * circleSize, y: gridY * circleSize });
    }
  }

  let deltaX = mouseX - prevMouseX;
  let deltaY = mouseY - prevMouseY;

  rotationY += deltaX * 0.01;
  rotationX -= deltaY * 0.01; 

  prevMouseX = mouseX;
  prevMouseY = mouseY;
}


function mouseDragged() {

  let deltaX = mouseX - prevMouseX;
  let deltaY = mouseY - prevMouseY;


  rotationY += deltaX * 0.01;
  rotationX -= deltaY * 0.01; 

  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

function touchMoved() {
  let deltaX = mouseX - prevMouseX;
  let deltaY = mouseY - prevMouseY;

  rotationY += deltaX * 0.01;
  rotationX -= deltaY * 0.01;

  prevMouseX = mouseX;
  prevMouseY = mouseY;

  return false; 
}

