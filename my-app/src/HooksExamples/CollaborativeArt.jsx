// Ilya Zeldner
import React, { useState, useDeferredValue, useMemo } from 'react';

// --- EXPLANATION ---
// useDeferredValue accepts a value and returns a new copy of the value
// that will defer to more urgent updates.
// It is useful for improving responsiveness of your app
// when you have some non-urgent part of the UI that can lag behind.
// In this example, we simulate a collaborative art app where the user types text
// that is rendered in a complex way (simulated with a slowdown).
// The complex rendering uses the deferred value, so the typing input remains
// responsive even if the rendering is slow.
// -------------------
// USAGE SCENARIOS:
// 1. When you have a part of the UI that is slow to render (e.g., complex lists, graphs).
// 2. When you want to keep input fields responsive while rendering heavy components.
// 3. When receiving new props/data that trigger expensive renders.
// -------------------
// BEST PRACTICES:
// 1. Use for non-urgent updates that can lag behind urgent ones.
// 2. Combine with useMemo or React.memo to optimize rendering of heavy components.

// ADVANTAGES:
// 1. Similar to useTransition, but used when you receive new props/data 
//    instead of setting state.
// 2. Good for "laggy" interfaces like typing into a filter that renders a graph.

// DISADVANTAGES:
// 1. The user sees "stale" content for a moment.

function CollaborativeArt() {
  const [text, setText] = useState('');
  
  // deferredText will lag behind 'text' if the CPU is busy
  const deferredText = useDeferredValue(text);

  return (
    <div style={{ border: '2px dashed pink', padding: '20px' }}>
      <h2>Digital Canvas</h2>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="Type to paint..." />
      
      <div style={{ marginTop: '20px' }}>
        <h4>Realtime Preview:</h4>
        <p>{text}</p>
        
        <h4>Complex Render (Deferred):</h4>
        {/* We pretend this is a heavy component that uses deferredText */}
        <SlowArtComponent text={deferredText} />
      </div>
    </div>
  );
}

function SlowArtComponent({ text }) {
  // Creating a fake slowdown
  const items = useMemo(() => {
    const data = [];
    for (let i = 0; i < 2000; i++) {
        // generate a deterministic hex color from the index (pure function)
        const hex = (Math.abs(Math.sin(i + 1) * 16777215) >>> 0).toString(16).padStart(6, '0');
        data.push(<span key={i} style={{color: '#' + hex}}>{text} </span>);
    }
    return data;
  }, [text]);

  return <div style={{ opacity: 0.5 }}>{items}</div>;
}

export default CollaborativeArt;