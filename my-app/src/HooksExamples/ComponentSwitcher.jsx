// Ilya Zeldner

// component to switch between all 12 Hook Examples
import React, { useState } from 'react';
import './App.css'; 

// Import all 12 Hook Examples
import OxygenTank from './OxygenTank';             // useState
import AlienSignalReceiver from './AlienSignalReceiver'; // useEffect
import GalaxyEmergencySystem from './GalaxyEmergencySystem'; // useContext
import SurgicalArmControl from './SurgicalArmControl';   // useReducer
import MissileInterceptor from './MissileInterceptor';   // useMemo
import BombDefusalControl from './BombDefusalControl';   // useCallback
import HolographicTargeting from './HolographicTargeting'; // useRef
import CloakedShip from './CloakedShip';           // useLayoutEffect
import SecuritySystem from './SecuritySystem';     // useImperativeHandle
import GalacticSearch from './GalacticSearch';     // useTransition
import CollaborativeArt from './CollaborativeArt'; // useDeferredValue
import SpaceWalkMission from './SpaceWalkMission'; // useDebugValue + Custom Hook

function ComponentSwitcher() {
  const [activeComponent, setActiveComponent] = useState('');

  const components_map = {
    '1. OxygenTank (useState)': <OxygenTank />,
    '2. AlienSignalReceiver (useEffect)': <AlienSignalReceiver />,
    '3. GalaxyEmergencySystem (useContext)': <GalaxyEmergencySystem />,
    '4. SurgicalArmControl (useReducer)': <SurgicalArmControl />,
    '5. MissileInterceptor (useMemo)': <MissileInterceptor />,
    '6. BombDefusalControl (useCallback)': <BombDefusalControl />,
    '7. HolographicTargeting (useRef)': <HolographicTargeting />,
    '8. CloakedShip (useLayoutEffect)': <CloakedShip />,
    '9. SecuritySystem (useImperativeHandle)': <SecuritySystem />,
    '10. GalacticSearch (useTransition)': <GalacticSearch />,
    '11. CollaborativeArt (useDeferredValue)': <CollaborativeArt />,
    '12. SpaceWalkMission (Custom Hook)': <SpaceWalkMission />
  };

  const componentToShow = components_map[activeComponent] || 
    <div className="placeholder-content">
      <h3>System Standby</h3>
      <p>Select a React Hook to initialize simulation module.</p>
    </div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        React Hooks Training Module
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