// Ilya Zeldner
import React, { useState, useCallback, memo } from 'react';

// --- EXPLANATION ---
// useCallback caches a function definition between re-renders.
// Typically used with React.memo().
// This prevents child components from re-rendering unnecessarily
// when the parent re-renders but the function logic hasn't changed.
// -------------------
// USAGE SCENARIO:
// 1. You have a parent component that passes a function as a prop
//    to a child component.
// 2. The parent component re-renders frequently due to state changes
//    unrelated to the child component.
// 3. The child component is wrapped in React.memo() to prevent
//    unnecessary re-renders when its props haven't changed.
// 4. Without useCallback, the function prop gets a new memory address
//    on every parent re-render, causing the child to re-render too.
// 5. By wrapping the function in useCallback, you ensure that
//    the function retains the same memory address between renders
//    unless its dependencies change, preventing unnecessary
//    child re-renders.

// ADVANTAGES:
// 1. Prevents child components from re-rendering unnecessarily because 
//    the function prop "changed" (got a new memory address).

// DISADVANTAGES:
// 1. Useless if the child component isn't wrapped in React.memo().
// 2. Makes code harder to read for minor performance gains.

// Child component wrapped in memo (Only updates if props change)
const BombVisualizer = memo(({ onCutWire }) => {
  console.log("BombVisualizer RENDERED!"); // Watch the console!
  return (
    <div style={{ border: '2px dashed red', padding: '10px', marginTop: '10px' }}>
      <h4>Visualizer Module</h4>
      <button onClick={onCutWire}>CUT THE WIRE</button>
    </div>
  );
});

function BombDefusalControl() {
  const [defused, setDefused] = useState(false);
  const [roomLight, setRoomLight] = useState(true); // Unrelated state

  // Without useCallback, 'handleCut' is a NEW function 
  // every time we toggle the room lights, forcing the BombVisualizer to re-render.
  const handleCut = useCallback(() => {
    setDefused(true);
    alert("Wire Cut!");
  }, []); 

  return (
    <div style={{ border: '1px solid black', padding: '20px' }}>
      <h2>Bomb Squad Control</h2>
      <p>Status: {defused ? "SAFE" : "ARMED"}</p>
      
      {/* Changing this causes Parent Render. 
          Due to useCallback, Child should NOT render. */}
      <button onClick={() => setRoomLight(!roomLight)}>
        Toggle Room Lights (Current: {roomLight ? "ON" : "OFF"})
      </button>

      <BombVisualizer onCutWire={handleCut} />
    </div>
  );
}

export default BombDefusalControl;