import * as React from "react";
import { useState, useRef } from "react";
import { render } from "react-dom";
import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/javascript/javascript";

const placeholder = `function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}`;

const iframeSrc = `
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
    background: #666;
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

const App = () => {
  const frame: any = useRef(null);
  const [code, setCode] = useState(placeholder);
  const [fps, setFps] = useState(30);
  const [bitRate, setBitRate] = useState(3000);
  const [saf, setSaf] = useState(600); // stop at frame
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const resetSketch = () => {
    return new Promise((resolve, reject) => {
      frame.current.setAttribute("srcdoc", iframeSrc);
      frame.current.onload = e => resolve(e);
      frame.current.onerror = e => reject(e);
    });
  };

  const previewSketch = () => {
    resetSketch().then(p => {
      frame.current.contentWindow.eval(code);
      frame.current.contentWindow.eval("window.p = new p5();");
    });
  };

  return (
    <>
      <header>
        <div className="header_item" style={{ flex: 1 }}>
          <button onClick={() => previewSketch()}>🔴REC</button>
        </div>
        <div className="header_item">
          Stop at frame{" "}
          <input
            type="number"
            value={saf}
            onChange={e => setSaf(parseInt(e.target.value))}
          />
        </div>
        <div className="header_item">
          <input
            type="number"
            value={fps}
            onChange={e => setFps(parseInt(e.target.value))}
          />{" "}
          FPS
        </div>
        <div className="header_item">
          Bitrate:{" "}
          <input
            type="number"
            value={bitRate}
            onChange={e => setBitRate(parseInt(e.target.value))}
            style={{ width: "4rem" }}
          />{" "}
          kbps
        </div>
      </header>
      <div className="sketch">
        <span className="label">CODE</span>
        <CodeMirror
          value={placeholder}
          options={{
            mode: "javascript",
            theme: "material",
            lineWrapping: true,
            lineNumbers: true
          }}
          onChange={(editor, data, value) => {
            setCode(value);
          }}
        />
      </div>
      <div className="preview">
        <span className="label">PREVIEW:x0.5</span>
        <iframe
          srcDoc={iframeSrc}
          ref={frame}
          seamless
          sandbox="allow-scripts allow-same-origin"
        ></iframe>
      </div>
      <div className="video">
        <span className="label">VIDEO:webm</span>
        <video controls loop></video>
      </div>
    </>
  );
};

render(<App />, document.getElementById("app"));
