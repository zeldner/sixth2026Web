// Ilya Zeldner
import React, { useReducer } from 'react';

// --- EXPLANATION ---
// useReducer is an alternative to useState for complex state logic.
// It uses a "reducer" function (state, action) => newState.
// In this example, we control a surgical robotic arm with multiple
// parameters: position, rotation, grip strength.
// The reducer centralizes state update logic based on action types.
// WHEN TO USE:
// - When state logic is complex or involves multiple sub-values.
// - When the next state depends on the previous state.


// ADVANTAGES:
// 1. Predictable state transitions (logic is central, not scattered in event handlers).
// 2. Easier to test the logic (the reducer is a pure function).

// DISADVANTAGES:
// 1. More boilerplate code (switch statements, action objects).
// 2. Overkill for simple boolean toggles.

const ACTIONS = {
  MOVE: 'move',
  ROTATE: 'rotate',
  GRIP: 'grip',
  RESET: 'reset'
};

function roboticArmReducer(state, action) {
  switch (action.type) {
    case ACTIONS.MOVE:
      // Must spread ...state to keep other properties!
      return { ...state, x: action.payload.x, y: action.payload.y, z: action.payload.z };
    case ACTIONS.ROTATE:
      // Logic lives here, not in the component
      return { ...state, rotation: (state.rotation + action.payload.angle) % 360 };
    case ACTIONS.GRIP:
      return { ...state, gripStrength: action.payload.strength };
    case ACTIONS.RESET:
      return { x: 0, y: 0, z: 0, rotation: 0, gripStrength: 0 };
    default:
      return state;
  }
}

const initialState = { x: 0, y: 0, z: 0, rotation: 0, gripStrength: 0 };

function SurgicalArmControl() {
  const [state, dispatch] = useReducer(roboticArmReducer, initialState);

  return (
    <div style={{ border: '1px solid purple', padding: '20px' }}>
      <h2>Surgical Robotic Arm</h2>
      <p>Position: X:{state.x} Y:{state.y} Z:{state.z}</p>
      <p>Rotation: {state.rotation}°</p>
      <p>Grip: {state.gripStrength}%</p>

      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        <button onClick={() => dispatch({ type: ACTIONS.MOVE, payload: { x: 10, y: 20, z: 50 } })}>
          Move to Target
        </button>
        <button onClick={() => dispatch({ type: ACTIONS.ROTATE, payload: { angle: 90 } })}>
          Rotate +90°
        </button>
        <button onClick={() => dispatch({ type: ACTIONS.GRIP, payload: { strength: 80 } })}>
          Grip Tissue
        </button>
        <button style={{backgroundColor: 'red', color: 'white'}} onClick={() => dispatch({ type: ACTIONS.RESET })}>
          EMERGENCY RESET
        </button>
      </div>
    </div>
  );
}

export default SurgicalArmControl;