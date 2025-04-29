let shaderProgram;

// Common parameters
let zoom = 400;
let power = 3;
let offsetX = 0.0;
let offsetY = 0.0;

let basePower = 3;

let color1 = [0.9, 0.85, 0.9]; // pastel pink
let color2 = [0.67, 0.67, 1.0]; // lavender
let color3 = [0.9, 0.8, 0.9];   // beige-gold

let uiVisible = true;
let animatePower = true;

let keysPressed = {};


function preload() {
  shaderProgram = loadShader('shader.vert', 'shader.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  noStroke();
}

function draw() {
  handleMovement();
  
  clear();
  resetMatrix();
  camera();
  background(0);

  runShaderRender();
}


function runShaderRender() {
  shader(shaderProgram);

  if (animatePower) {
    let t = frameCount * 0.05 * 0.01;
    power = basePower + sin(t) * basePower;
  }

  document.getElementById("currentPowerDisplay").innerText = `Current Power: n = ${power.toFixed(2)}`;


  resetMatrix(); // reset any previous transform
  beginShape();
  shader(shaderProgram);


  shaderProgram.setUniform("u_resolution", [width, height]);
  shaderProgram.setUniform("u_power", power);
  shaderProgram.setUniform("u_zoom", zoom);
  shaderProgram.setUniform("u_offset", [offsetX, offsetY]);
  shaderProgram.setUniform("u_time", millis() / 1000.0);

  shaderProgram.setUniform("u_color1", color1);
  shaderProgram.setUniform("u_color2", color2);
  shaderProgram.setUniform("u_color3", color3);


  vertex(-1, -1, 0, 0);
  vertex(1, -1, 1, 0);
  vertex(1, 1, 1, 1);
  vertex(-1, 1, 0, 1);
  endShape(CLOSE);
}


function updatePower() {
    let input = document.getElementById("powerInput");
    let val = parseFloat(input.value);

    animatePower = false;
  
    if (!isNaN(val) && val >= 0 && val <= 6) {
      animatePower = false;
      power = val;
      document.getElementById("currentPowerDisplay").innerHTML = `<b>Current Power: n = ${power.toFixed(2)}</b>`;
    } else {
      alert("Please enter a number between 0 and 6.");
    }

    runCPURender();
  }



function keyPressed() {

  keysPressed[key.toLowerCase()] = true;

  if (key === ' ') {
    uiVisible = !uiVisible;
    document.getElementById("ui-panel").style.display = uiVisible ? "block" : "none";
  }

}


function keyReleased() {
  keysPressed[key.toLowerCase()] = false;
}




function handleMovement() {
  let step = 20.0 / zoom;
  let zoomStep = 1.1;

  if (keysPressed['a']) offsetX -= step;
  if (keysPressed['d']) offsetX += step;
  if (keysPressed['w']) offsetY += step;
  if (keysPressed['s']) offsetY -= step;

  if (keysPressed['z']) {
    let oldZoom = zoom;
    zoom *= zoomStep;
    adjustOffsetAfterZoom(width/2, height/2, oldZoom, zoom);
  }

  if (keysPressed['x']) {
    let oldZoom = zoom;
    zoom /= zoomStep;
    adjustOffsetAfterZoom(width/2, height/2, oldZoom, zoom);
  }
}




function resumeAnimation() {
  animatePower = true;
}


function setColors(c1, c2, c3) {
  color1 = c1;
  color2 = c2;
  color3 = c3;

  function updateInputs(prefix, color) {
    document.getElementById(prefix + "r").value = Math.round(color[0] * 255);
    document.getElementById(prefix + "g").value = Math.round(color[1] * 255);
    document.getElementById(prefix + "b").value = Math.round(color[2] * 255);
  }

  updateInputs("c1", c1);
  updateInputs("c2", c2);
  updateInputs("c3", c3);
}

function useDefaultColors() {
  setColors([0.9, 0.85, 0.9], [0.67, 0.67, 1.0], [0.9, 0.8, 0.9]);
}

function useSunsetColors() {
  setColors([1.0, 0.6, 0.3], [1.0, 0.3, 0.5], [1.0, 0.8, 0.3]);
}

function useOceanColors() {
  setColors([0.3, 0.5, 1.0], [0.3, 0.8, 1.0], [0.6, 1.0, 0.8]);
}

function useRandomColors() {
  function randomColor() {
    return [random(0.5, 1.0), random(0.5, 1.0), random(0.5, 1.0)];
  }
  setColors(randomColor(), randomColor(), randomColor());
}


function applyCustomColors() {
  function getColor(idR, idG, idB) {
    return [
      constrain(parseFloat(document.getElementById(idR).value) / 255, 0, 1),
      constrain(parseFloat(document.getElementById(idG).value) / 255, 0, 1),
      constrain(parseFloat(document.getElementById(idB).value) / 255, 0, 1)
    ];
  }

  const c1 = getColor("c1r", "c1g", "c1b");
  const c2 = getColor("c2r", "c2g", "c2b");
  const c3 = getColor("c3r", "c3g", "c3b");

  setColors(c1, c2, c3);
}