import * as React from "react";
import { useState, useRef } from "react";
import { render } from "react-dom";
import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/javascript/javascript";
import { placeholder, iframeSrc } from "./vars";

const App = () => {
  const iframe = useRef(null);
  const video = useRef(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);

  const currentFrame = useRef(0);
  const animationFrame = useRef(0);
  const previousUpdateAt = useRef(0);

  const [code, setCode] = useState(placeholder);
  const [fps, setFps] = useState(30);
  const [bitRate, setBitRate] = useState(3000);
  const [saf, setSaf] = useState(300); // stop at frame
  const [isRecording, setIsRecording] = useState(false);

  const resetSketch = () =>
    new Promise((resolve, reject) => {
      iframe.current.setAttribute("srcdoc", iframeSrc);
      iframe.current.onload = e => resolve(e);
      iframe.current.onerror = e => reject(e);
    });

  const previewSketch = async () => {
    await resetSketch();
    iframe.current.contentWindow.eval(code);
    iframe.current.contentWindow.eval("window.p = new p5();");
  };

  const startRecording = async () => {
    await previewSketch();
    setIsRecording(true);
    stream.current = iframe.current.contentWindow.p.canvas.captureStream(0);
    chunks.current = [];
    recorder.current = new MediaRecorder(stream.current, {
      videoBitsPerSecond: bitRate * 1000,
      mimeType: "video/webm"
    });
    recorder.current.ondataavailable = handleDataAvailable;
    recorder.current.onstop = handleStop;
    recorder.current.start();
    currentFrame.current = 0;
    previousUpdateAt.current = Date.now();
    handleUpdateFrame();
  };

  const handleUpdateFrame = () => {
    const now = Date.now();
    const elapsed = now - previousUpdateAt.current;
    const interval = 1000 / fps;
    if (elapsed > interval) {
      if (currentFrame.current++ > saf) {
        stopRecording();
        return;
      }
      const tracks = stream.current.getTracks() as any;
      tracks[0].requestFrame();
      previousUpdateAt.current = now - (elapsed % interval);
    }
    animationFrame.current = iframe.current.contentWindow.requestAnimationFrame(
      handleUpdateFrame
    );
  };

  const stopRecording = () => {
    recorder.current.stop();
  };

  const download = () => {};

  const handleDataAvailable = e => {
    chunks.current.push(e.data);
  };

  const handleStop = e => {
    const blob = new Blob(chunks.current, { type: "video/webm" });
    video.current.src = window.URL.createObjectURL(blob);
    iframe.current.contentWindow.cancelAnimationFrame(animationFrame.current);
    setIsRecording(false);
    resetSketch();
    chunks.current = [];
  };

  return (
    <>
      <header>
        <div className="header_item" style={{ flex: 1 }}>
          <button disabled={isRecording} onClick={() => startRecording()}>
            🔴REC
          </button>
        </div>
        <div className="header_item">
          Stop at frame{" "}
          <input
            disabled={isRecording}
            type="number"
            value={saf}
            onChange={e => setSaf(parseInt(e.target.value))}
          />
        </div>
        <div className="header_item">
          <input
            disabled={isRecording}
            type="number"
            value={fps}
            onChange={e => setFps(parseInt(e.target.value))}
          />{" "}
          FPS
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
          ref={iframe}
          seamless
          sandbox="allow-scripts allow-same-origin"
        ></iframe>
      </div>
      <div className="video">
        <span className="label">VIDEO:webm</span>
        <video ref={video} autoPlay controls loop></video>
      </div>
    </>
  );
};

render(<App />, document.getElementById("app"));
