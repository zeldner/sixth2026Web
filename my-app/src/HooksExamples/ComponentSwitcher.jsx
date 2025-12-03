// Ilya Zeldner
import React, { useState } from 'react';
import './App.css'; // Make sure this file exists with the CSS I gave you!

// --- THE ESSENTIALS ---
import OxygenTank from './OxygenTank';             // useState
import AlienSignalReceiver from './AlienSignalReceiver'; // useEffect
import GalaxyEmergencySystem from './GalaxyEmergencySystem'; // useContext

// --- REFS & DOM ---
import HolographicTargeting from './HolographicTargeting'; // useRef
import CloakedShip from './CloakedShip';           // useLayoutEffect
import SecuritySystem from './SecuritySystem';     // useImperativeHandle

// --- PERFORMANCE ---
import MissileInterceptor from './MissileInterceptor';   // useMemo
import BombDefusalControl from './BombDefusalControl';   // useCallback

// --- CONCURRENCY ---
import GalacticSearch from './GalacticSearch';     // useTransition
import CollaborativeArt from './CollaborativeArt'; // useDeferredValue

// --- ADVANCED LOGIC & CUSTOM HOOKS ---
import SurgicalArmControl from './SurgicalArmControl';   // useReducer
import SpaceWalkMission from './SpaceWalkMission'; // useDebugValue + Custom Hook

// --- REAL PROJECT ---
import AcademicPortal from '../ex6/AcademicPortal'     // The Full Login/Auth System

function ComponentSwitcher() {
  const [activeComponent, setActiveComponent] = useState('');

  // Map the button names to the actual components
  const components_map = {
    // Basics
    '1. OxygenTank (useState)': <OxygenTank />,
    '2. AlienSignalReceiver (useEffect)': <AlienSignalReceiver />,
    '3. GalaxyEmergencySystem (useContext)': <GalaxyEmergencySystem />,
    
    // Logic & Refs
    '4. SurgicalArmControl (useReducer)': <SurgicalArmControl />,
    '5. HolographicTargeting (useRef)': <HolographicTargeting />,
    '6. CloakedShip (useLayoutEffect)': <CloakedShip />,
    '7. SecuritySystem (useImperativeHandle)': <SecuritySystem />,

    // Performance
    '8. MissileInterceptor (useMemo)': <MissileInterceptor />,
    '9. BombDefusalControl (useCallback)': <BombDefusalControl />,

    // Concurrency
    '10. GalacticSearch (useTransition)': <GalacticSearch />,
    '11. CollaborativeArt (useDeferredValue)': <CollaborativeArt />,
    
    // Custom & Advanced
    '12. SpaceWalkMission (Custom Hook)': <SpaceWalkMission />,

    // FINAL PROJECT
    '13. AcademicPortal (Full Project)': <AcademicPortal />
  };

  const componentToShow = components_map[activeComponent] || 
    <div className="placeholder-content">
      <h3>System Ready</h3>
      <p>Select a module from the control panel above.</p>
    </div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        React Hooks Master Class
      </h1>
      
      {/* Navigation Buttons */}
      <div className="nav-container">
        {Object.keys(components_map).map(key => (
          <button
            key={key}
            onClick={() => setActiveComponent(key)}
            className={`nav-button ${activeComponent === key ? 'active' : ''}`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Active Component Display Area */}
      <div className="simulation-window">
        {componentToShow}
      </div>
    </div>
  );
}

export default ComponentSwitcher;