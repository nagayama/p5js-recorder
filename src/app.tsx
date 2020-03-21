import * as React from "react";
import { useState } from "react";
import { render } from "react-dom";
import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/javascript/javascript";

const placeholder = `function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}`;

const App = () => {
  const [code, setCode] = useState(placeholder);
  return (
    <>
      <header>header</header>
      <div className="sketch">
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
      <div className="preview">preview</div>
      <div className="video">video</div>
    </>
  );
};

render(<App />, document.getElementById("app"));
