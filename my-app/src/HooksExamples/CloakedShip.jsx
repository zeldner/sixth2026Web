// Ilya Zeldner
import React, { useRef, useState, useLayoutEffect } from 'react';

// --- EXPLANATION ---
// useLayoutEffect runs synchronously AFTER DOM mutations but BEFORE
// the browser paints.
// This lets you read layout from the DOM and synchronously re-render
// before the browser updates the screen.
// -------------------
// USAGE SCENARIO:
// 1. You need to measure DOM elements (width/height) and adjust layout
//    before the browser paints.
// 2. You want to prevent visual "flicker" where the user sees the wrong
//    size for 1 frame before your effect runs.
// 3. You have to make DOM measurements and then make DOM mutations
//    that would affect the measurements (like changing scroll position).
//   In this case, useLayoutEffect lets you avoid a visual jump.

// ADVANTAGES:
// 1. Perfect for measuring elements (width/height) to adjust layout.
// 2. Prevents visual "flicker" where the user sees the wrong size for 1 frame.

// DISADVANTAGES:
// 1. Blocks the visual update. If the logic is slow, the app feels frozen.
// 2. Prefer useEffect (99% of the time) unless you see flickering.


function CloakedShip() {
    const shipRef = useRef(null);
    const [isCloaked, setIsCloaked] = useState(true);
    const [distortion, setDistortion] = useState({});

    useLayoutEffect(() => {
        // We measure the ship div BEFORE the user sees the update
        if (shipRef.current) {
            const width = shipRef.current.offsetWidth;
            // Based on width, calculate blur immediately
            if (isCloaked) {
                setDistortion({ filter: `blur(${width / 20}px) opacity(0.5)` });
            } else {
                setDistortion({});
            }
        }
    }, [isCloaked]);

    return (
        <div style={{ border: '1px dashed grey', padding: '20px' }}>
            <h3>Stealth Ship</h3>
            <button onClick={() => setIsCloaked(!isCloaked)}>
                {isCloaked ? "De-Cloak" : "Cloak"}
            </button>
            
            <div 
                ref={shipRef} 
                style={{ 
                    marginTop: '20px', 
                    width: '200px', 
                    height: '100px', 
                    background: 'silver',
                    color: 'black',  
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 'bold', 
                    transition: 'all 0.5s',
                    ...distortion 
                }}
            >
                SS Phantom
            </div>
        </div>
    );
}

export default CloakedShip;