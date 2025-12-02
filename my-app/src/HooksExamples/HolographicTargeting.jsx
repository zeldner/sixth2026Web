// Ilya Zeldner
import React, { useRef } from 'react';

// --- EXPLANATION ---
// useRef creates a reference object that holds a value ({ current: ... }).
// Changing it does NOT trigger a re-render.
// Typically used to access DOM elements directly.
// -------------------
// USAGE SCENARIO:
// 1. You need to directly manipulate a DOM element (e.g., focus an input,
//    play/pause a video, draw on a canvas).
// 2. You want to store a mutable value that persists across renders
//    but doesn't require UI updates (like a timer ID).
// 3. You want to avoid re-renders when updating a value that doesn't affect the UI.

// ADVANTAGES:
// 1. Essential for accessing DOM elements (focus inputs, play video, canvas).
// 2. Can store mutable values (like a timer ID) that don't need to update the UI.

// DISADVANTAGES:
// 1. If you change a ref and want the screen to update, it won't work. Use useState for that.

function HolographicTargeting() {
  const videoRef = useRef(null);

  const handlePlay = () => {
    // Direct DOM manipulation
    if (videoRef.current) {
        videoRef.current.play();
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
        videoRef.current.pause();
    }
  };

  return (
    <div style={{ border: '2px solid cyan', padding: '20px' }}>
      <h2>Holographic Interface</h2>
      <video
        ref={videoRef}
        width="300"
        style={{ backgroundColor: 'black' }}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
      <div style={{ marginTop: '10px' }}>
        <button onClick={handlePlay}>Engage (Play)</button>
        <button onClick={handlePause}>Freeze (Pause)</button>
      </div>
    </div>
  );
}

export default HolographicTargeting;