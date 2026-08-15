import React, { useEffect, useState } from 'react';
import logoUd from '../assets/logo-ud.png';
import './SplashScreen.css';

interface SplashScreenProps {
  onFinish: () => void;
}

const HOLD_MS = 1500;
const EXIT_MS = 600;

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => setIsExiting(true), HOLD_MS);
    const finishTimer = setTimeout(onFinish, HOLD_MS + EXIT_MS);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`splash-screen ${isExiting ? 'splash-exiting' : ''}`}
      role="presentation"
      aria-hidden="true"
    >
      <div className="splash-glow" />
      <img src={logoUd} alt="" className="splash-logo" />
      <div className="splash-loader">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default SplashScreen;
