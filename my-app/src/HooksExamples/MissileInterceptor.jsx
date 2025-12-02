// Ilya Zeldner
import React, { useState, useMemo } from 'react';

// --- EXPLANATION ---
// useMemo caches the result of a calculation between re-renders.
// It only recalculates if dependencies change.
// In this example, we simulate an expensive calculation for missile interception trajectory.

// Without useMemo, every state change (even unrelated ones) would trigger the expensive calculation,
// causing UI lag. With useMemo, we avoid recalculating unless relevant inputs change.

// ADVANTAGES:
// 1. Prevents expensive calculations from running on every render.
// 2. Essential for referential equality (preventing useEffects from firing).

// DISADVANTAGES:
// 1. Consumes memory to store the cached value.
// 2. Adds overhead. Don't use it for simple math (like a + b).

function MissileInterceptor() {
    const [targetVelocity, setTargetVelocity] = useState(100);
    const [targetDistance, setTargetDistance] = useState(5000);
    const [theme, setTheme] = useState('dark'); // Unrelated state

    const interceptionTrajectory = useMemo(() => {
        // Deterministic "expensive" calculation that is pure (no performance.now)
        // Perform a CPU-bound loop whose iteration count depends only on inputs 
        // to keep the function pure.
        const iterations = 300000 + Math.abs(Math.floor(targetDistance / 10)) + Math.abs(Math.floor(targetVelocity)) * 10;
        let acc = 0;
        for (let i = 0; i < iterations; i++) {
            // pure math work to keep CPU busy without calling impure APIs
            acc += Math.sin(i) * Math.cos((i + targetVelocity) % (targetDistance + 1));
        }
        // Use acc so the loop work isn't optimized away
        if (acc === Infinity) {
            console.log('unexpected');
        }
        
        console.log("Recalculating Trajectory... (This is slow)");
        const timeToIntercept = targetDistance / targetVelocity;
        const angle = Math.atan(targetVelocity / 9.81) * (180 / Math.PI);
        return `Time: ${timeToIntercept.toFixed(2)}s, Angle: ${angle.toFixed(2)}°`;
    }, [targetVelocity, targetDistance]); 
    // ^ Dependency Array: Only recalculate if velocity or distance changes. 
    // Changing 'theme' will NOT trigger this calculation.

    return (
        <div style={{ 
            border: '1px solid orange', 
            padding: '20px', 
            background: theme === 'dark' ? '#333' : '#FFF',
            color: theme === 'dark' ? '#FFF' : '#000'
        }}>
            <h2>Missile Interceptor</h2>
            <p>Calculated Trajectory: <strong>{interceptionTrajectory}</strong></p>
            
            <button onClick={() => setTargetVelocity(v => v + 10)}>Increase Velocity</button>
            <button onClick={() => setTargetDistance(d => d - 500)}>Decrease Distance</button>
            <hr/>
            <button onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}>
                Toggle Theme (Should be fast)
            </button>
        </div>
    );
}

export default MissileInterceptor;