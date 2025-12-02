// Ilya Zeldner
import React, { createContext, useContext, useState } from 'react';

// --- EXPLANATION ---
// useContext allows you to subscribe to React Context without wrapping logic.
// It helps share data (like themes, user info) across many components
// without passing props down manually at every level.
// HOW IT WORKS:
// 1. Create a Context with createContext().
// 2. Use a Provider to pass the current value to the tree below.
// 3. Any component can read the context value using useContext(ContextName).
// 4. When the Provider's value changes, all consuming components re-render.
// WHEN TO USE:
// - When many components need access to the same data.
// - To avoid "prop drilling" (passing props through many layers).

// ADVANTAGES:
// 1. Solves "Prop Drilling" (passing data through 5 layers of components).
// 2. Great for global themes, user auth, or language settings.

// DISADVANTAGES:
// 1. Makes components less reusable (they rely on the context existing).
// 2. Performance: If context value changes, ALL consumers re-render.

const AlertLevelContext = createContext('LOW');

function AlertLevelProvider({ children }) {
  const [alertLevel, setAlertLevel] = useState('LOW');
  return (
    <AlertLevelContext.Provider value={{ alertLevel, setAlertLevel }}>
      {children}
    </AlertLevelContext.Provider>
  );
}

// Child Component 1
function Starship() {
  const { alertLevel } = useContext(AlertLevelContext);
  return (
    <div style={{ border: '1px solid grey', margin: '10px', padding: '10px' }}>
      <h4>Starship Crew</h4>
      <p>Alert Status: <strong style={{ color: alertLevel === 'HIGH' ? 'red' : 'green' }}>{alertLevel}</strong></p>
    </div>
  );
}

// Child Component 2
function EmergencyControl() {
  const { setAlertLevel } = useContext(AlertLevelContext);
  return (
    <div>
      <button onClick={() => setAlertLevel('HIGH')}>RED ALERT</button>
      <button onClick={() => setAlertLevel('LOW')}>STAND DOWN</button>
    </div>
  );
}

function GalaxyEmergencySystem() {
  return (
    <AlertLevelProvider>
      <div style={{ border: '2px solid gold', padding: '20px' }}>
        <h2>Galactic Command Center</h2>
        <EmergencyControl />
        <Starship />
        <Starship />
      </div>
    </AlertLevelProvider>
  );
}

export default GalaxyEmergencySystem;