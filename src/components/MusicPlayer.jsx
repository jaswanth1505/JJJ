import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react';
import { birthdayContent } from '../data/birthdayContent';
import { romanticSynth } from '../utils/audio';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [usingSynth, setUsingSynth] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.5;

    const handleEnded = () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
      romanticSynth.stop();
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!isPlaying) {
      // Try playing audio file first
      if (audio) {
        audio.play()
          .then(() => {
            setIsPlaying(true);
            setUsingSynth(false);
          })
          .catch(() => {
            // Audio file missing or failed -> use synthesized romantic melody!
            console.log('Using romantic melody synthesizer');
            romanticSynth.start();
            setUsingSynth(true);
            setIsPlaying(true);
          });
      } else {
        romanticSynth.start();
        setUsingSynth(true);
        setIsPlaying(true);
      }
    } else {
      if (audio && !usingSynth) {
        audio.pause();
      }
      if (usingSynth) {
        romanticSynth.stop();
      }
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (audio) {
      audio.muted = nextMuted;
    }
    if (usingSynth) {
      romanticSynth.setVolume(nextMuted ? 0 : 1);
    }
  };

  return (
    <aside 
      style={{
        position: 'fixed',
        top: '18px',
        right: '18px',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
      aria-label="Background Music Controls"
    >
      <audio ref={audioRef} src={birthdayContent.music} preload="none" loop />

      <button
        onClick={togglePlay}
        title={isPlaying ? "Pause music" : "Play music"}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          borderRadius: '24px',
          border: '1px solid rgba(226, 75, 116, 0.25)',
          background: 'rgba(255, 250, 248, 0.88)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          color: '#8b2e4b',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(180, 80, 100, 0.1)',
          transition: 'all 0.25s ease',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {isPlaying ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ 
                width: '3px', height: '12px', background: '#e24b74', borderRadius: '2px', 
                animation: 'gentlePulse 1s ease infinite' 
              }}></span>
              <span style={{ 
                width: '3px', height: '16px', background: '#e24b74', borderRadius: '2px', 
                animation: 'gentlePulse 1.2s ease 0.2s infinite' 
              }}></span>
              <span style={{ 
                width: '3px', height: '10px', background: '#e24b74', borderRadius: '2px', 
                animation: 'gentlePulse 0.9s ease 0.4s infinite' 
              }}></span>
            </span>
          ) : (
            <Music size={15} color="#e24b74" />
          )}
        </span>

        <span style={{ letterSpacing: '0.02em' }}>
          {isPlaying ? 'Music' : '♫ Music'}
        </span>

        {isPlaying && (
          <span 
            onClick={toggleMute} 
            title={isMuted ? "Unmute" : "Mute"} 
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleMute(e); }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              paddingLeft: '4px',
              borderLeft: '1px solid rgba(226, 75, 116, 0.2)',
              marginLeft: '2px'
            }}
          >
            {isMuted ? <VolumeX size={14} color="#a64d67" /> : <Volume2 size={14} color="#e24b74" />}
          </span>
        )}
      </button>
    </aside>
  );
}
