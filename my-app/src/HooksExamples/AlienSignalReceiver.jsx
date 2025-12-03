// Ilya Zeldner
import React, { useState, useEffect } from 'react';

// --- EXPLANATION ---
// useEffect synchronizes a component with an external system
// (timers, network requests, DOM manipulation).
// In this example, we simulate receiving alien signals over time.
// The effect sets up a timer to append random "signal" data every second.
// When the component unmounts, the effect cleans up the timer.
// We also demonstrate how changing a state variable (maxLength)
// can trigger the effect to re-run, simulating dynamic behavior.
function AlienSignalReceiver() {
  const [signalData, setSignalData] = useState('');
  
  // The user can change this value dynamically!
  const [maxLength, setMaxLength] = useState(50); 

  useEffect(() => {
    console.log(`Establishing connection (Limit: ${maxLength} chars)...`);
    
    // setInterval simulates receiving data over time 
    // from an alien source (every second).
  
    const intervalId = setInterval(() => {
      const newData = Math.random().toString(36).substring(7);
      
      
      setSignalData(prevData => {
        // Stop if we reached the CURRENT limit
        if (prevData.length >= maxLength) {
            clearInterval(intervalId);
            return prevData;
        }
        return prevData + newData + ' ';
      });
      
    }, 1000); 

    return () => {
      console.log("Disconnecting signal...");
      clearInterval(intervalId);
    };
    
    // If you move the slider, 'maxLength' changes,
    // causing this effect to restart.
  }, [maxLength]); 

  return (
    <div style={{ border: '1px solid purple', padding: '20px' }}>
      <h2>Alien Signal Receiver</h2>
      
      {/* CONTROL PANEL */}
      <div style={{marginBottom: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '5px'}}>
        <label style={{marginRight: '10px', fontWeight: 'bold', color: '#333'}}>
            Buffer Size Limit: {maxLength}
        </label>
        <input 
            type="range" 
            min="20" 
            max="200" 
            step="10"
            value={maxLength}
            onChange={(e) => {
                // When this changes, the Effect above RE-RUNS automatically
                setMaxLength(Number(e.target.value));
                setSignalData(''); // Optional: Clear old data to start fresh
            }} 
        />
        <p style={{fontSize: '0.8rem', color: '#555', margin: '5px 0 0 0'}}>
            * Dragging the slider restarts the useEffect hook because 'maxLength' is in the dependency array.
        </p>
      </div>

      {/* DATA DISPLAY */}
      <p style={{ wordBreak: 'break-all', fontFamily: 'monospace', background: '#000', color: '#0f0', padding: '10px' }}>
        {signalData || "Waiting for signal..."}
      </p>
      
      {signalData.length >= maxLength && (
        <p style={{ color: 'orange', fontWeight: 'bold' }}>
            Buffer Full. Connection Halted.
        </p>
      )}
    </div>
  );
}

export default AlienSignalReceiver;