// Ilya Zeldner
import React, { useState, useCallback, memo } from 'react';


// useCallback caches a function definition between re-renders.
// Typically used with React.memo().
// Prevents child components from re-rendering unnecessarily
// when parent re-renders due to unrelated state changes.
// Useful for performance optimization.

// ADVANTAGES:
// 1. Prevents unnecessary re-renders of child components.
// 2. Improves performance in certain scenarios.
// 3. Useful when passing functions to memoized child components.
// DISADVANTAGES:
// 1. Adds complexity to the code.
// 2. Overuse can lead to harder-to-read code.
// 3. Not always a performance win; measure before optimizing.


// Child component wrapped in memo (Only updates if props change)
const BombVisualizer = memo(({ onCutWire }) => {
  console.log("💥 BombVisualizer RENDERED! (This should NOT happen when lights toggle)");
  return (
    <div style={{ border: '2px dashed red', padding: '10px', marginTop: '10px', background: 'white', color: 'black' }}>
      <h4>Visualizer Module</h4>
      <button onClick={onCutWire} style={{background: 'red', color: 'white'}}>CUT THE WIRE</button>
    </div>
  );
});

function BombDefusalControl() {
  const [defused, setDefused] = useState(false);
  const [roomLight, setRoomLight] = useState(true); // Unrelated state


  // useCallback to memoize the handleCut function
  // so that its reference doesn't change on re-renders
  // caused by roomLight state changes.
  const handleCut = useCallback(() => {
    setDefused(true);
    alert("Wire Cut!");
  }, []); 

  return (
    <div style={{ 
        border: '1px solid black', 
        padding: '20px',
        // --- VISUAL FIX: Actually change the background color! ---
        backgroundColor: roomLight ? '#ffffff' : '#555555',
        color: roomLight ? 'black' : 'white',
        transition: 'background-color 0.3s'
    }}>
      <h2>Bomb Squad Control</h2>
      <p>Status: {defused ? "SAFE" : "ARMED"}</p>
      
      {/* 1. CLICKING THIS changes the Parent Background */}
      <button onClick={() => setRoomLight(!roomLight)}>
        Toggle Room Lights (Current: {roomLight ? "ON" : "OFF"})
      </button>

      <p style={{fontStyle: 'italic', fontSize: '0.8rem'}}>
        (Open Console F12: Toggling lights should NOT re-render the Bomb below)
      </p>

      {/* 2. BUT THIS COMPONENT SHOULD NOT FLICKER/RENDER */}
      <BombVisualizer onCutWire={handleCut} />
    </div>
  );
}

export default BombDefusalControl;