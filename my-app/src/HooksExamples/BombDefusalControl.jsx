// Ilya Zeldner
import React, { useState, useCallback, memo, useRef, useEffect } from "react";

// THE CHILD COMPONENT (The Bomb)
// This component shows how many times it has rendered.
// It has a button to "Cut the Wire".
// We will see how often it re-renders based on parent props.
// We use React.memo to avoid re-rendering unless props change.

const BombVisualizer = memo(({ label, onCutWire, isCorrect }) => {
  const renderCount = useRef(0);
  const spanRef = useRef(null);

  // THIS IS THE FIX:
  // We perform the "Side Effect" (Updating the count) inside useEffect.
  // This runs AFTER React finishes rendering, so it is allowed/pure.
  useEffect(() => {
    renderCount.current += 1;
    if (spanRef.current) {
      spanRef.current.innerText = renderCount.current;
      // Add a visual "Flash" effect
      spanRef.current.style.color = "yellow";
      spanRef.current.style.textShadow = "0 0 10px yellow";

      const timer = setTimeout(() => {
        if (spanRef.current) {
          spanRef.current.style.color = "white";
          spanRef.current.style.textShadow = "none";
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }); // No dependency array = Runs on EVERY Render

  const style = {
    padding: "15px",
    marginTop: "10px",
    border: "2px dashed " + (isCorrect ? "green" : "red"),
    background: "#222",
    color: "white",
    transition: "all 0.3s",
  };

  return (
    <div style={style}>
      <h4>{label}</h4>
      <p>
        Render Count:
        {/* We use a ref to update this number directly */}
        <strong
          ref={spanRef}
          style={{ marginLeft: "10px", fontSize: "1.5rem" }}
        >
          0
        </strong>
      </p>
      <button
        onClick={onCutWire}
        style={{
          width: "100%",
          background: "red",
          color: "white",
          border: "none",
          padding: "8px",
          cursor: "pointer",
        }}
      >
        ✂ CUT WIRE
      </button>
    </div>
  );
});

// THE "BAD" PARENT (No useCallback)
function BadDefusal() {
  const [lightsOn, setLightsOn] = useState(true);

  // PROBLEM: This function is recreated every time the parent renders.
  const handleCut = () => {
    alert("BOOM! (Bad Version)");
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid red",
        background: lightsOn ? "#fff" : "#666",
        transition: "background 0.3s",
      }}
    >
      <h3 style={{ color: "red" }}>WITHOUT useCallback</h3>

      <button onClick={() => setLightsOn(!lightsOn)}>
        Toggle Lights (Triggers Re-render)
      </button>

      <BombVisualizer
        label="Unstable Bomb"
        onCutWire={handleCut}
        isCorrect={false}
      />

      <small
        style={{
          display: "block",
          marginTop: "10px",
          color: lightsOn ? "black" : "white",
        }}
      >
        Proof: Toggle Lights to see Count INCREASE (Bad)
      </small>
    </div>
  );
}

// THE "GOOD" PARENT (With useCallback)

function GoodDefusal() {
  const [lightsOn, setLightsOn] = useState(true);

  // SOLUTION: This function is cached.
  const handleCut = useCallback(() => {
    alert("Defused! (Good Version)");
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid green",
        background: lightsOn ? "#fff" : "#666",
        transition: "background 0.3s",
      }}
    >
      <h3 style={{ color: "green" }}>WITH useCallback</h3>

      <button onClick={() => setLightsOn(!lightsOn)}>
        Toggle Lights (Efficient)
      </button>

      <BombVisualizer
        label="Stable Bomb"
        onCutWire={handleCut}
        isCorrect={true}
      />

      <small
        style={{
          display: "block",
          marginTop: "10px",
          color: lightsOn ? "black" : "white",
        }}
      >
        Proof: Toggle Lights... Count STAYS SAME (Good)
      </small>
    </div>
  );
}

function BombDefusalControl() {
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
    >
      <BadDefusal />
      <GoodDefusal />
    </div>
  );
}

export default BombDefusalControl;
