let currentMode = "GPU"; // Start with mode 2 (GPU rendering)
let needsCPURender = (currentMode === "CPU") ? true : false; 

let shaderProgram;

// Common parameters
let zoom = 400;
let power = 3;
let offsetX = 0.0;
let offsetY = 0.0;

// Mode 1 (CPU variables)
let maxIter = 20;
let a;

// Mode 2 (Shader variables)
// (already using shaderProgram, zoom, etc.)

function preload() {
  shaderProgram = loadShader('shader.vert', 'shader.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  noStroke();
  a = new Complex(1, 0);

  cpuGraphics = createGraphics(windowWidth, windowHeight);
  cpuGraphics.pixelDensity(1); 
}

function draw() {
  clear();
  resetMatrix();
  camera();
  background(0);

  console.log("Current mode is ", currentMode);
  if (currentMode === "CPU") {
    if (needsCPURender) {
      runCPURender();
      needsCPURender = false;
  }
    resetMatrix();
    translate(-width / 2, -height / 2);
    texture(cpuGraphics);
    rect(0, 0, width, height);
  } else if (currentMode === "GPU") {
    cpuGraphics.clear(); 
    runShaderRender();
  }
}

function runCPURender() {
    cpuGraphics.background(0); // Clear first
    cpuGraphics.loadPixels();  // Then load the blank pixels (order is important)
    rootColors = [];

    let resolution = 1;

    for (let x = 0; x < cpuGraphics.width; x += resolution) {
        for (let y = 0; y < cpuGraphics.height; y += resolution) {
            let zx = (x - cpuGraphics.width / 2) / zoom;
            let zy = (y - cpuGraphics.height / 2) / zoom;
            let z = new Complex(zx, zy);

            let iter = 0;
            let root = null;

            for (let i = 0; i < maxIter; i++) {
                let [zPowMinus1, zPow, sinZ, cosZ] = computeHeavy(z, power);
                let f = zPow.mult(sinZ).sub(a);
                let df = zPowMinus1.mult(new Complex(power, 0)).mult(sinZ).add(zPow.mult(cosZ));

                if (df.mag() === 0) break;

                let zNext = z.sub(f.div(df));
                if (zNext.sub(z).mag() < 1e-6) {
                    root = findOrRegisterRoot(zNext);
                    break;
                }
                z = zNext;
                iter++;
            }

            const col = root ? colorRoot(root, iter) : color(0);
            const idx = (x + y * cpuGraphics.width) * 4;
            cpuGraphics.pixels[idx + 0] = red(col);
            cpuGraphics.pixels[idx + 1] = green(col);
            cpuGraphics.pixels[idx + 2] = blue(col);
            cpuGraphics.pixels[idx + 3] = 255;
        }
    }

    cpuGraphics.updatePixels();
}


function runShaderRender() {
  shader(shaderProgram);

  let t = frameCount * 0.05 * 0.01;
  power = 3 + sin(t) * 3;


  resetMatrix(); // reset any previous transform
  beginShape();
  shader(shaderProgram);


  shaderProgram.setUniform("u_resolution", [width, height]);
  shaderProgram.setUniform("u_power", power);
  shaderProgram.setUniform("u_zoom", zoom);
  shaderProgram.setUniform("u_offset", [offsetX, offsetY]);
  shaderProgram.setUniform("u_time", millis() / 1000.0);


  
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
      power = val;
      document.getElementById("currentPowerDisplay").innerText = `Current Power: n = ${power.toFixed(2)}`;
    } else {
      alert("Please enter a number between 0 and 6.");
    }

    runCPURender();
  }



function keyPressed() {

    let step = 20.0 / zoom;
    let zoomStep = 1.1;

    if (key === ' ' || keyCode === 32) {
      console.log("space pressed");

      if(currentMode === "GPU"){
        currentMode = "CPU";
        needsCPURender = true;

        cpuGraphics = createGraphics(windowWidth, windowHeight);
        cpuGraphics.pixelDensity(1);

        noLoop();

        document.getElementById("renderer").innerText = `\nCurrent Renderer: CPU mode. \nPress "Space" to switch to GPU mode.`;
        document.getElementById("navigation").innerText = ``;
      }
      else{
        currentMode = "GPU";
        needsCPURender = false;

        loop();

        document.getElementById("renderer").innerText = `\nCurrent Renderer: GPU mode. \nPress "Space" to switch to CPU mode.`;
        document.getElementById("navigation").innerText = `\nUse WASD to move. Press Z to zoom in and X to zoom out.`;
      }

      console.log(currentMode, " version is activated");
    }

    if (currentMode === "GPU"){
      if (key === 'a' || key === 'A') offsetX -= step;
      if (key === 'd' || key === 'D') offsetX += step;
      if (key === 'w' || key === 'W') offsetY += step;
      if (key === 's' || key === 'S') offsetY -= step;


      if (key === 'z' || key === 'Z' || key === 'x' || key === 'X') {
        console.log("z or x pressed");

        let oldZoom = zoom;
        if (key === 'z' || key === 'Z') zoom *= zoomStep;
        if (key === 'x' || key === 'X') zoom /= zoomStep;
        adjustOffsetAfterZoom(width/2, height/2, oldZoom, zoom);
      }
    }
}

