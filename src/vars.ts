export const placeholder = `let counter = 1
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  textAlign(CENTER)
  textSize(100)
  text(counter++, width/2,height/2)
}`;

export const iframeSrc = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=1024,height=1024">
<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  position: fixed;
  overflow: hidden;
}
body {
    background: #000;
    transform: scale(0.5);
}
canvas {
  background: #fff;
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
}
</style>
<script src="https://cdn.jsdelivr.net/npm/p5/lib/p5.min.js"></script>
</head>
<body>
</body>
</html>
`;
