let capture;
let poseNet;
let myPose;
let mic;
let skeleton;
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
let counter = 1;

let q1 =
  "You're given the power to read minds, but you can't turn it off. Would you accept this power?";
let q2 =
  "You have the power to remove all pain from your life, but it also means you'll never truly appreciate happiness. Would you use this power?";
let q3 =
  "You can prevent a global disaster but it would mean erasing yourself from existence. Would you do it?";
let q4 = "Are you happy?";
function preload() {
  song1 = loadSound("forrest.mp3");
  song2 = loadSound("wind.mp3");
  song3 = loadSound("rain.mp3");
  song4 = loadSound("wave.mp3");
}
//SETUP------------------------------------------------------------------
function setup() {
  createCanvas(windowWidth, windowHeight);

  capture = createCapture(VIDEO);
  capture.size(windowWidth, windowHeight);
  capture.position(0, 0);
  capture.hide();

  poseNet = ml5.poseNet(capture, modelLoaded);
  poseNet.on("pose", onPose);
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
  translate(width, 0);
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
    left_x = myPose.keypoints[9].position.x;
    left_y = myPose.keypoints[9].position.y;
    right_x = myPose.keypoints[10].position.x;
    right_y = myPose.keypoints[10].position.y;
    fill(0, 255, 0);
    ellipse(left_x, left_y, 16, 16);
    ellipse(right_x, right_y, 16, 16);
  }
  pop();

  //BUTTONS-------------------------------------------
  push();

  fill(0, 0, 255);
  noStroke();

  let xNo = width / 8;
  let yNo = height / 3;
  let xYes = width - width / 8;
  let yYes = height / 3;

  ellipse(xYes, yYes, yesSize, yesSize);

  ellipse(xNo, yNo, noSize, noSize);

  fill(255, 255, 255);
  textSize(40);
  text("YES", xYes, yYes + 15);
  text("NO", xNo, yNo + 15);
  pop();

  noStroke();

  d1 = dist(left_x, left_y, xYes, yYes);
  d2 = dist(left_x, left_y, xNo, yNo);
  d3 = dist(right_x, right_y, xYes, yYes);
  d4 = dist(right_x, right_y, xNo, yNo);

  if (d1 < 150 || d3 < 150) {
    noSize++;
    console.log(noSize);
    if (noSize > 150) {
      counter += 1;
      noSize = 100;
      ballSize += 0.1;
      choice.push("YES");
      console.log(choice);
    }
  }
  if (d1 > 150 && noSize > 101 && noSize < 151) {
    noSize--;
  }
  if (d2 < 150 || d4 < 150) {
    yesSize++;
    console.log(yesSize);
    if (yesSize > 150) {
      counter += 1;
      yesSize = 100;
      ballSize -= 0.04;
      choice.push("YES");
      console.log(choice);
    }
  }
  if (d4 > 150 && yesSize > 101 && yesSize < 151) {
    yesSize--;
  }
  //TEXT-------------------------------------------
  rectMode(CENTER);
  fill(0);
  rect(width / 2, height / 8, width / 1.2, 100);
  textAlign(CENTER);
  fill(255);
  textSize(24);

  if (counter == 1) {
    text(q1, width / 2, height / 8 - 30, width / 1.3);
  }
  if (counter == 2) {
    text(q2, width / 2, height / 8 - 30, width / 1.3);
    song1.play();
  }
  if (counter == 3) {
    text(q3, width / 2, height / 8 - 30, width / 1.3);
    song2.play();
  }
  if (counter == 4) {
    text(q4, width / 2, height / 8 - 30, width / 1.3);
    song3.play();
  }
  if (counter == 5) {
    song1.stop();
    song2.stop();
    song3.stop();
    song4.play();
  }
}
