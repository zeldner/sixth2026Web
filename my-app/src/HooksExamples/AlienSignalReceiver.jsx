// Ilya Zeldner
import React, { useState, useEffect } from 'react';

// --- EXPLANATION ---
// use Effect Hook :
// Purpose: Manage side effects in functional components.
// Examples of side effects include data fetching, subscriptions,
// or manually changing the DOM.
// In this example, we simulate receiving alien signals every 2 seconds
// and updating the component state accordingly.
// useEffect synchronizes a component with an external system
// (timers, network requests, DOM manipulation).
// HOW IT WORKS:
// 1. Accepts a function that contains side-effect logic.
// 2. The function runs after the render is committed to the screen.
// 3. Can optionally return a cleanup function to run on unmount or before re-running the effect.
// 4. Takes a dependency array to control when the effect runs.
// WHEN TO USE:
// - For data fetching, subscriptions, or manually changing the DOM.
// - To run code on mount, unmount, or when specific values change.
// - To encapsulate side-effect logic separately from rendering logic.
//
// Note: In StrictMode (development only), effects run twice to help identify side-effect bugs.


// ADVANTAGES:
// 1. Handles cleanup automatically (via the return function).
// 2. Consolidates mount, update, and unmount logic in one place.

// DISADVANTAGES:
// 1. Easy to create infinite loops if dependency array is wrong.
// 2. StrictMode runs effects twice in dev, which can be confusing.

function AlienSignalReceiver() {
  const [signalData, setSignalData] = useState('');
  const MAX_DATA_LENGTH = 50; 

  useEffect(() => {
    console.log("Establishing connection to alien signal...");
    
    const intervalId = setInterval(() => {
      const newData = Math.random().toString(36).substring(7);
      
      // Using functional update allows us to remove 'signalData' 
      // from dependencies, preventing the connection from resetting 
      // every 2 seconds.
      setSignalData(prevData => {
        if (prevData.length >= MAX_DATA_LENGTH) {
            clearInterval(intervalId);
            return prevData;
        }
        return prevData + newData + ' ';
      });
      
      console.log("Receiving packet...");
    }, 2000);

    // Runs when component unmounts
    return () => {
      console.log("Disconnecting signal...");
      clearInterval(intervalId);
    };
  }, [MAX_DATA_LENGTH]); // Only re-run if config changes, not on every data packet

  return (
    <div style={{ border: '1px solid purple', padding: '20px' }}>
      <h2>Alien Signal Receiver</h2>
      <p style={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>
        {signalData}
      </p>
      {signalData.length >= MAX_DATA_LENGTH && (
        <p style={{ color: 'orange' }}>Buffer Full. Connection Halted.</p>
      )}
    </div>
  );
}

export default AlienSignalReceiver;