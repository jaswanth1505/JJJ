import React, { useState, useRef } from 'react';
import GiftScreen from './components/GiftScreen';
import HeartBowScreen from './components/HeartBowScreen';
import LoveTree from './components/LoveTree';
import MemoryLane from './components/MemoryLane';
import Letter from './components/Letter';
import FinalReveal from './components/FinalReveal';
import MusicPlayer from './components/MusicPlayer';
import './styles/index.css';

export default function App() {
  // Screen sequence:
  // 0: The Secret Gift Box (Screen 1)
  // 1: The Bow & Candy Heart (Screen 2)
  // 2: Jaya's Love Tree (Screen 3)
  // 3: Memory Lane & Scrapbook Journey (Screen 4)
  // 4: Final Reveal (Screen 6)
  const [currentScreen, setCurrentScreen] = useState(0);

  const letterRef = useRef(null);
  const finalRef = useRef(null);

  const goToNextScreen = () => {
    setCurrentScreen((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const restartJourney = () => {
    setCurrentScreen(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToLetter = () => {
    if (letterRef.current) {
      letterRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFinal = () => {
    if (finalRef.current) {
      finalRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Background grain texture and soft vignette */}
      <div className="noise-overlay" aria-hidden="true" />
      <div className="vignette-overlay" aria-hidden="true" />

      {/* Floating background music player */}
      <MusicPlayer />

      {/* Screen 1: The Secret Gift Box */}
      {currentScreen === 0 && <GiftScreen onNext={goToNextScreen} />}

      {/* Screen 2: A Little Something For You (Bow & Heart) */}
      {currentScreen === 1 && <HeartBowScreen onNext={goToNextScreen} />}

      {/* Screen 3: Jaya's Love Tree */}
      {currentScreen === 2 && <LoveTree onNext={goToNextScreen} />}

      {/* Screen 4, 5, 6: Memory Lane -> Personal Letter -> Final Reveal */}
      {currentScreen >= 3 && (
        <div style={{ animation: 'fadeInText 0.8s ease' }}>
          {/* Scrapbook Section */}
          <MemoryLane onContinueToLetter={scrollToLetter} />

          {/* Emotional Birthday Letter */}
          <div ref={letterRef}>
            <Letter onContinueToFinal={scrollToFinal} />
          </div>

          {/* Final Emotional Reveal */}
          <div ref={finalRef}>
            <FinalReveal onRestart={restartJourney} />
          </div>
        </div>
      )}
    </div>
  );
}
