// Ilya Zeldner
import React, { useState, useEffect, useDebugValue } from 'react';

// --- CUSTOM HOOK ---
// We pass 'astronautID' to the hook to identify who we are monitoring
function useAstronautVitals(astronautID) {
  const [heartRate, setHeartRate] = useState(80);
  const [isStable, setIsStable] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      const rate = 80 + Math.floor(Math.random() * 40);
      setHeartRate(rate);
      setIsStable(rate < 110);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- THE FIX ---
  // Now we actually USE the variable!
  // In React DevTools, the label will now show: "Commander Shepard: Stable"
  // This helps you distinguish between different astronauts if you use this hook multiple times.
  useDebugValue(`${astronautID}: ${isStable ? "Stable" : "CRITICAL"}`);

  return { heartRate, isStable };
}

// --- THE COMPONENT ---
function SpaceWalkMission() {
  const { heartRate, isStable } = useAstronautVitals("Commander Shepard");

  return (
    <div style={{ border: '2px solid white', background: '#222', color: 'white', padding: '20px' }}>
      <h2>EVA Mission Monitor</h2>
      <h3>Astronaut: Commander Shepard</h3>
      <p>Heart Rate: {heartRate} BPM</p>
      <p>Status: <strong style={{ color: isStable ? 'lime' : 'red' }}>
          {isStable ? "NORMAL" : "TACHYCARDIA WARNING"}
      </strong></p>
      <small>* Open React DevTools to see "Commander Shepard" in the label.</small>
    </div>
  );
}

export default SpaceWalkMission;