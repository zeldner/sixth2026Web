// Ilya Zeldner
import React, { useState } from 'react';

// --- EXPLANATION ---
// useState adds local state to function components.
// It returns a pair: the current state value and a function to update it.
// HOW IT WORKS:
// 1. Call useState(initialValue) to create a state variable.
// 2. It returns [state, setState].
// 3. Call setState(newValue) to update the state and re-render the component.
// WHEN TO USE:
// - For simple state management in components.
// - When you need to track values that change over time (like form inputs, toggles).

// ADVANTAGES:
// 1. Simple to use for basic values (numbers, strings, booleans).
// 2. Triggers a re-render automatically when data changes.

// DISADVANTAGES:
// 1. Not ideal for complex state logic (use useReducer instead).
// 2. Updates are asynchronous (you can't read the new value immediately after setting it).

function OxygenTank() {
  const [oxygenLevel, setOxygenLevel] = useState(100);

  const depleteOxygen = () => {
    // Functional update ensures we use the most recent value
    setOxygenLevel(prev => Math.max(0, prev - 10)); 
  };

  const refillOxygen = () => {
    setOxygenLevel(100);
  };

  return (
    <div style={{ border: '1px solid blue', padding: '20px' }}>
      <h2>Oxygen Tank System</h2>
      <p style={{ fontSize: '24px', color: oxygenLevel < 20 ? 'red' : 'green' }}>
        Level: {oxygenLevel}%
      </p>
      <button onClick={depleteOxygen}>Use Oxygen</button>
      <button onClick={refillOxygen}>Refill Tank</button>
    </div>
  );
}

export default OxygenTank;