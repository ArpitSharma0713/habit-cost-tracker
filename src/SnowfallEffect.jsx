import Snowfall from 'react-snowfall';
import { useEffect, useRef } from 'react';

function SnowfallEffect({ children, config = {} }) {
  const snowfallRef = useRef(null);

  const defaultConfig = {
    snowflakeCount: 80,        
    speed: [0.5, 2],            
    wind: [-1, 1],             
    radius: [0.5, 2.5],           
    opacity: [0.6, 1],          
    color: '#FFFFFF',           
  };

  const settings = { ...defaultConfig, ...config };

  return (
    <>
      <Snowfall
        ref={snowfallRef}
        snowflakeCount={settings.snowflakeCount}
        speed={settings.speed}
        wind={settings.wind}
        radius={settings.radius}
        opacity={settings.opacity}
        color={settings.color}
      />
      {children}
    </>
  );
}

export default SnowfallEffect;
