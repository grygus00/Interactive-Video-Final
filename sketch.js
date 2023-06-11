let capture;
let poseNet;
let myPose;
let mic;
let skeleton;
let crown;
let ballSize = 0.1;
let yesSize = 100;
let noSize = 100;
let choice = [];

let song1;
let song2;
let song3;
let song4;
//buttons----
let left_x;
let left_y;
let right_x;
let right_y;
let e_x; //eye x
let e_y; //eye y
let e2_x; //secong eye x
let e2_y; //secong eye y
let counter = -0.2;
crownSwitch = false;
let qSwitch = true;

let q0 = "STAND IN POSITION SO THE CROWN FITS YOUR HEAD";
let q01 =
  "Congratulations, you just become a King of a land called Veridia. Now you will start your journey as a ruler, with great power and even greater responsibility.";
let q02 =
  "From now on you have to choose for your kingdom. Hold your hand in place of the square YES or NO to choose. Do you understand?";
let q1 =
  "You have the ability to remove all poverty from your land, but the cost is the loss of happiness in your life. Would you use this power?";
let q2 =
  "You are given the power to see into the future by sacrificing your own aspirations. Would you accept this power?";
let q3 =
  "You can prevent a global disaster but only by erasing your own name and memory from history. Would you do it?";
let q4 =
  "In the tapestry of your life, are you content with the path you have chosen?";

let lector;
let fft; //wafeworm

let crownW;
let crownH;
let crownX;
let crownY;

function preload() {
  song1 = loadSound("forrest.mp3");
  song2 = loadSound("wind.mp3");
  song3 = loadSound("rain.mp3");
  song4 = loadSound("wave.mp3");
  crown = loadImage("crown.png");
}
//SETUP------------------------------------------------------------------
function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  capture = createCapture(VIDEO);

  capture.size(windowWidth * 0.85, windowHeight * 0.85);
  capture.position(-800, 0);
  capture.hide();

  poseNet = ml5.poseNet(capture, modelLoaded);
  poseNet.on("pose", onPose);

  lector = new p5.Speech(); // speech synthesis object
  lector.setPitch(0.01);

  song1.setVolume(0.05);
  song2.setVolume(0.05);
  song3.setVolume(0.05);
  song4.setVolume(0.05);

  fft = new p5.FFT();

  crownW = width / 3 + 50;
  crownH = height / 4;
  crownX = 150;
  crownY = 80;
}
function onPose(poses) {
  if (poses.length > 0) {
    myPose = poses[0].pose;
  }
}
function modelLoaded() {
  print("loaded");
}
//DRAW------------------------------------------------------------------
function draw() {
  background(220);
  push();
  translate(width * 0.925, height * 0.085);
  scale(-1, 1);

  // ballSize = ballSize + 0.001;
  capture.loadPixels();
  noStroke();
  for (let i = 0; i < capture.width; i += 10) {
    for (let j = 0; j < capture.height; j += 10) {
      let idx = (i + j * capture.width) * 4;
      let r = capture.pixels[idx];
      let g = capture.pixels[idx + 1];
      let b = capture.pixels[idx + 2];
      let brightness = (r + g + b) / 3;

      fill(0);
      ellipse(i, j, brightness * ballSize);
    }
  }

  if (myPose) {
    e_x = myPose.keypoints[1].position.x;
    e_y = myPose.keypoints[1].position.y;
    e2_x = myPose.keypoints[2].position.x;
    e2_y = myPose.keypoints[2].position.y;
    left_x = myPose.keypoints[9].position.x;
    left_y = myPose.keypoints[9].position.y;
    right_x = myPose.keypoints[10].position.x;
    right_y = myPose.keypoints[10].position.y;
    fill("#FFD700");
    // ellipse(e_x, e_y, 16, 16); //eye dot
    // ellipse(e2_x, e2_y, 16, 16);//eye dot
    ellipse(left_x, left_y, 12, 12);
    ellipse(right_x, right_y, 12, 12);
  }
  pop();
  push();
  fill(0);
  rect(width / 2, 0, width, 160);

  pop();
  if (counter >= 0) {
    //BUTTONS-------------------------------------------

    push();

    fill("#FFD700");
    noStroke();

    let xNo = width / 8;
    let yNo = height / 3;
    let xYes = width - width / 8;
    let yYes = height / 3;

    rect(xYes, yYes, yesSize, yesSize);

    rect(xNo, yNo, noSize, noSize);

    fill(0);
    textSize(40);
    text("YES", xYes, yYes + 15);
    text("NO", xNo, yNo + 15);
    pop();

    noStroke();

    d1 = dist(left_x, left_y, xYes, yYes);
    d2 = dist(left_x, left_y, xNo, yNo);
    d3 = dist(right_x, right_y, xYes, yYes);
    d4 = dist(right_x, right_y, xNo, yNo);

    if (d1 < 130 || d3 < 130) {
      noSize++;
      if (noSize > 130) {
        counter += 1;
        noSize = 100;
        ballSize += 0.1;
        choice.push("NO");
        console.log(choice);
        qSwitch = true;
      }
    }

    if (d1 > 130 && noSize > 101 && noSize < 131) {
      noSize--;
    }
    if (d2 < 130 || d4 < 130) {
      yesSize++;
      if (yesSize > 130) {
        counter += 1;
        yesSize = 100;
        ballSize -= 0.04;
        choice.push("YES");
        console.log(choice);
        qSwitch = true;
      }
    }
    if (d4 > 150 && yesSize > 101 && yesSize < 121) {
      yesSize--;
    }
  }
  //TEXT-------------------------------------------
  rectMode(CENTER);
  textAlign(CENTER);
  fill("#FFD700");
  textSize(24);
  if (counter == -0.2) {
    text(q0, width / 2, 20, width / 1.3);
  }
  if (counter == -0.1) {
    text(q01, width / 2, 20, width / 1.3);
    setInterval(startGame, 11500);
    if (qSwitch) {
      lector.speak(q01);
    }
  }
  if (counter == 0) {
    text(q02, width / 2, 20, width / 1.3);
    setInterval(quiet, 9300);
    if (qSwitch) {
      lector.speak(q02);
      qSwitch = false;
    }
  }
  if (counter == 1) {
    text(q1, width / 2, 20, width / 1.3);
    song4.play();
    if (qSwitch) {
      lector.speak(q1);
      qSwitch = false;
    }
  }
  if (counter == 2) {
    text(q2, width / 2, 20, width / 1.3);
    song4.stop();
    song1.play();

    if (qSwitch) {
      lector.speak(q2);
      qSwitch = false;
    }
  }
  if (counter == 3) {
    text(q3, width / 2, 20, width / 1.3);
    song2.play();
    song1.stop();
    if (qSwitch) {
      lector.speak(q3);
      qSwitch = false;
    }
  }
  if (counter == 4) {
    text(q4, width / 2, 20, width / 1.3);
    song3.play();
    song2.stop();
    if (qSwitch) {
      lector.speak(q4);
      qSwitch = false;
    }
  }
  if (counter == 5) {
    song1.stop();
    song2.stop();
    song3.stop();
    song4.stop();

    if (qSwitch) {
      lector.speak(
        "Whatever your choices are, whether you are upset or happy, remember that, this too shall pass. Long ago, there was a wise and powerful king who ruled over a magnificent kingdom. One day, a terrible crisis befell the land—a destructive earthquake shook the very foundations of the kingdom. As the king witnessed the devastation, he remembered the timeless words of the Buddha This too shall pass. In the midst of chaos and despair, he found solace in the impermanence of life. With a heart full of courage, the king rallied his people, rebuilt their homes, and restored hope. Through his unwavering leadership, he guided the kingdom toward a brighter future. In times of triumph, the king humbly acknowledged the fleeting nature of his achievements, always mindful of the transient nature of glory and power. And in times of adversity, he drew strength from the knowledge that even the darkest moments would eventually fade away. The story of the wise king teaches us the profound lesson that This too shall pass. In joy or sorrow, success or failure, let us embrace the impermanence of life, finding wisdom, resilience, and peace along our journey. Thank you for your time, that's the end oof out journey."
      );
      qSwitch = false;
    }
  }
  push();
  stroke("#FFD700");
  let wave = fft.waveform();
  for (let i = 0; i < width; i++) {
    let index = floor(map(i, 0, width, 0, wave.length));

    let x = i;
    let y = wave[index] * 300 + height / 1.05;
    point(x, y);
  }

  pop();

  push();
  translate(width * 0.925, height * 0.085);
  scale(-1, 1);
  let eyedis = dist(e_x, 0, e2_x, 0);

  let crownEyedist = dist(e_x, crownX, e_y, crownY);
  image(crown, crownW, crownH, crownX, crownY);
  if (eyedis < 62 && crownEyedist < 350) {
    crownSwitch = true;
  }
  if (crownSwitch) {
    crownW = e_x - eyedis * 2 - 30;
    crownH = e_y - crown.height + 50;
    crownX = 4 * eyedis;
    crownY = 2 * eyedis;
    if (counter >= -0.2 && counter < -0.12) {
      counter += 0.1;
    }
    if (eyedis > 70) {
      crownH = e_y - crown.height - 110;
    }
  }

  pop();
}
function startGame() {
  if (counter >= -0.1 && counter < -0.09) {
    qSwitch = true;
    counter += 0.1;
  }
}
function quiet() {
  if (counter >= 0 && counter < 0.1) {
    lector.cancel(q02);
    qSwitch = true;
  }
}
