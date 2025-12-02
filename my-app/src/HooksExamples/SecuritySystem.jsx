// Ilya Zeldner
import React, { useState, useImperativeHandle, forwardRef, useRef } from 'react';

// --- EXPLANATION ---
// useImperativeHandle lets you customize the instance value that is exposed
// to parent components when using refs.
// This is useful for exposing specific methods or properties of a child
// component to its parent, while keeping other internal details private.
// -------------------
// USAGE SCENARIO:
// 1. You want to expose specific functions or properties of a child
//    component to its parent.
// 2. You need to interact with a child component's internal state or methods
//    from the parent component.
// 3. You are working with third-party libraries that require imperative
//    control over components.

// ADVANTAGES:
// 1. Allows parent to trigger specific functions inside a child (e.g., "reset()", "focus()").
// 2. Encapsulates internal logic while giving external control.

// DISADVANTAGES:
// 1. Breaks the declarative "Props Down" flow of React.
// 2. Should be avoided unless absolutely necessary (like integrating with libraries).

const ShieldGenerator = forwardRef((props, ref) => {
  const [integrity, setIntegrity] = useState(100);

  useImperativeHandle(ref, () => ({
    // Only these functions are visible to the parent
    emergencyBoost: () => setIntegrity(150),
    shutdown: () => setIntegrity(0)
  }));

  return (
    <div style={{ border: '1px solid cyan', margin: '10px', padding: '10px' }}>
      <h4>Shield Generator</h4>
      <p>Integrity: {integrity}%</p>
    </div>
  );
});

function SecuritySystem() {
  const shieldRef = useRef();

  return (
    <div style={{ border: '2px solid navy', padding: '20px' }}>
      <h2>Defense Control</h2>
      <button onClick={() => shieldRef.current.emergencyBoost()}>Boost Shields</button>
      <button onClick={() => shieldRef.current.shutdown()}>Shutdown</button>
      
      <ShieldGenerator ref={shieldRef} />
    </div>
  );
}

export default SecuritySystem;