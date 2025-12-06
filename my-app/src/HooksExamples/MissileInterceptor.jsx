// Ilya Zeldner
import React, { useState, useMemo } from "react";

// --- HELPER: The "Heavy" Math Function ---
// This simulates a complex physics engine that takes 300ms to run.
// It calculates the time and angle needed to intercept a missile.
// We add console.logs to see when it runs.
// In a real app, this could be a complex calculation.
// We add a label parameter to identify which component is calling it.
const calculateTrajectory = (velocity, distance, label) => {
  console.log(`[${label}] Starting expensive calculation...`);
  const start = performance.now();
  while (performance.now() - start < 300) {
    // ARTIFICIAL LAG: Block the CPU for 300ms
  }
  console.log(`[${label}] Finished calculation.`);

  const time = distance / velocity;
  const angle = Math.atan(velocity / 9.81) * (180 / Math.PI);
  return `Time: ${time.toFixed(2)}s, Angle: ${angle.toFixed(2)}°`;
};

// THE "BAD" COMPONENT (No useMemo)
function SlowInterceptor() {
  const [velocity, setVelocity] = useState(100);
  const [darkTheme, setDarkTheme] = useState(false);
  const distance = 5000;

  // PROBLEM: This runs on EVERY render, even when just toggling the theme!
  const result = calculateTrajectory(velocity, distance, "BAD/SLOW");

  const style = {
    padding: "15px",
    border: "2px solid red",
    backgroundColor: darkTheme ? "#333" : "#fff",
    color: darkTheme ? "#fff" : "#000",
    transition: "background-color 0.2s",
  };

  return (
    <div style={style}>
      <h3 style={{ color: "red" }}>WITHOUT useMemo (Slow)</h3>
      <p>Result: {result}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        <button onClick={() => setVelocity((v) => v + 10)}>
          Step 1: Change Velocity (Lag is normal)
        </button>

        {/* THIS IS THE DEMO: */}
        <button onClick={() => setDarkTheme(!darkTheme)}>
          Step 2: Toggle Theme (LAG IS BAD!)
        </button>
      </div>
      <small>Note: Toggling theme freezes because the math runs again.</small>
    </div>
  );
}

// THE "GOOD" COMPONENT (With useMemo)

function FastInterceptor() {
  const [velocity, setVelocity] = useState(100);
  const [darkTheme, setDarkTheme] = useState(false);
  const distance = 5000;

  // SOLUTION: This only runs when 'velocity' changes.
  // It IGNORES 'darkTheme' changes.
  const result = useMemo(() => {
    return calculateTrajectory(velocity, distance, "GOOD/FAST");
  }, [velocity]); //  Dependency Array

  const style = {
    padding: "15px",
    border: "2px solid green",
    backgroundColor: darkTheme ? "#333" : "#fff",
    color: darkTheme ? "#fff" : "#000",
    transition: "background-color 0.2s",
  };

  return (
    <div style={style}>
      <h3 style={{ color: "green" }}>WITH useMemo (Fast)</h3>
      <p>Result: {result}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        <button onClick={() => setVelocity((v) => v + 10)}>
          Step 1: Change Velocity (Lag is normal)
        </button>

        {/* THIS IS THE DEMO: */}
        <button onClick={() => setDarkTheme(!darkTheme)}>
          Step 2: Toggle Theme (INSTANT!)
        </button>
      </div>
      <small>Note: Toggling theme is instant. Math is skipped.</small>
    </div>
  );
}
function MissileInterceptor() {
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
    >
      <SlowInterceptor />
      <FastInterceptor />
    </div>
  );
}

export default MissileInterceptor;
