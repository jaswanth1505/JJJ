import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { birthdayContent } from '../data/birthdayContent';
import { playGiftChime } from '../utils/audio';

export default function GiftScreen({ onNext }) {
  const [isOpening, setIsOpening] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleUnwrap = () => {
    if (isOpening) return;
    setIsOpening(true);
    playGiftChime();

    // Trigger subtle sparkles & hearts
    try {
      // Confetti burst with romantic tones
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { x: 0.38, y: 0.65 },
        colors: ['#ff85a2', '#ff5789', '#f9bd3b', '#fff0f5', '#ffd1dc'],
        ticks: 180,
        gravity: 0.8,
        scalar: 1.1,
      });
    } catch (_) {}

    // Show tender text
    setTimeout(() => {
      setShowMessage(true);
    }, 400);

    // Transition to Screen 2
    setTimeout(() => {
      onNext();
    }, 1800);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        minHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'radial-gradient(ellipse at 35% 65%, #fdf5f2 0%, #faece7 60%, #f6e0da 100%)',
        overflow: 'hidden',
        transition: 'opacity 0.8s ease',
      }}
    >
      {/* Background ambient motes */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${6 + (i % 5) * 2}px`,
              height: `${6 + (i % 5) * 2}px`,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 182, 193, 0.45)',
              top: `${15 + (i * 11)}%`,
              left: `${10 + (i * 12)}%`,
              filter: 'blur(1px)',
              animation: `floatUp ${8 + i * 2}s infinite ease-in-out`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
      </div>

      {/* Main gift container positioned slightly lower-left for cinematic composition */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: 'translate(-8%, 5%)',
          maxWidth: '380px',
        }}
      >
        {/* The Gift Box */}
        <div
          onClick={handleUnwrap}
          role="button"
          tabIndex={0}
          aria-label="Tap to unwrap your gift"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleUnwrap();
          }}
          style={{
            position: 'relative',
            width: '136px',
            height: '136px',
            cursor: 'pointer',
            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: isOpening ? 'scale(1.08)' : 'scale(1)',
          }}
        >
          {/* Ambient gift shadow */}
          <div
            style={{
              position: 'absolute',
              bottom: '-14px',
              left: '12px',
              right: '12px',
              height: '24px',
              borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(160, 80, 100, 0.22) 0%, rgba(0,0,0,0) 70%)',
              filter: 'blur(3px)',
            }}
          />

          {/* Escape Hearts during opening */}
          {isOpening && (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
              {[
                { x: -30, y: -70, s: 20, d: '0s', rot: -20 },
                { x: 35, y: -90, s: 24, d: '0.1s', rot: 15 },
                { x: 0, y: -110, s: 28, d: '0.2s', rot: -5 },
                { x: -50, y: -50, s: 18, d: '0.15s', rot: -35 },
                { x: 50, y: -60, s: 22, d: '0.25s', rot: 30 },
              ].map((h, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: `translate(calc(-50% + ${h.x}px), calc(-50% + ${h.y}px)) rotate(${h.rot}deg)`,
                    fontSize: `${h.s}px`,
                    opacity: 0,
                    animation: `floatEscape 1.3s cubic-bezier(0.16, 1, 0.3, 1) forwards ${h.d}`,
                  }}
                >
                  ❤️
                </div>
              ))}
            </div>
          )}

          {/* SVG Detailed Gift Box */}
          <svg
            viewBox="0 0 140 140"
            width="100%"
            height="100%"
            style={{
              overflow: 'visible',
              filter: 'drop-shadow(0 12px 24px rgba(190, 85, 115, 0.16))',
              animation: isOpening ? 'giftShake 0.45s ease' : 'gentlePulse 3.5s ease infinite',
            }}
          >
            <defs>
              {/* Box pastel gradient */}
              <linearGradient id="boxGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#fee4ec" />
                <stop offset="60%" stop-color="#f8c3d3" />
                <stop offset="100%" stop-color="#f2adbe" />
              </linearGradient>

              {/* Ribbon vibrant pink gradient */}
              <linearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#ff7399" />
                <stop offset="50%" stop-color="#eb396e" />
                <stop offset="100%" stop-color="#cb1d53" />
              </linearGradient>

              {/* Golden bow center knot */}
              <radialGradient id="goldCenter" cx="35%" cy="35%" r="70%">
                <stop offset="0%" stop-color="#ffe494" />
                <stop offset="50%" stop-color="#f9bd3b" />
                <stop offset="100%" stop-color="#c9881d" />
              </radialGradient>

              {/* Subtle dotted pattern for gift paper */}
              <pattern id="giftDots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="4" cy="4" r="1.5" fill="#fdf0f4" opacity="0.8" />
                <circle cx="12" cy="12" r="1.5" fill="#fdf0f4" opacity="0.8" />
              </pattern>
            </defs>

            {/* Gift Body */}
            <rect x="18" y="38" width="104" height="92" rx="14" fill="url(#boxGrad)" />
            <rect x="18" y="38" width="104" height="92" rx="14" fill="url(#giftDots)" />

            {/* Vertical Ribbon */}
            <rect x="58" y="38" width="24" height="92" fill="url(#ribbonGrad)" />
            {/* Horizontal Ribbon */}
            <rect x="18" y="74" width="104" height="20" fill="url(#ribbonGrad)" />

            {/* Lid / Rim */}
            <g
              style={{
                transformOrigin: '70px 38px',
                transform: isOpening ? 'translateY(-26px) rotate(-14deg)' : 'none',
                transition: 'transform 0.6s cubic-bezier(0.2, 0.9, 0.3, 1.2)',
              }}
            >
              <rect x="14" y="30" width="112" height="18" rx="8" fill="url(#boxGrad)" stroke="#f7b7cb" strokeWidth="1" />
              <rect x="58" y="30" width="24" height="18" fill="url(#ribbonGrad)" />

              {/* Bow loops */}
              <g
                style={{
                  transformOrigin: '70px 30px',
                  transform: isOpening ? 'scale(1.2) translateY(-10px)' : 'none',
                  transition: 'transform 0.4s ease',
                }}
              >
                {/* Left bow loop */}
                <path
                  d="M70 28 C 48 10, 32 16, 40 32 C 46 42, 64 32, 70 28 Z"
                  fill="url(#ribbonGrad)"
                  filter="drop-shadow(0 2px 4px rgba(180, 40, 80, 0.25))"
                />
                {/* Right bow loop */}
                <path
                  d="M70 28 C 92 10, 108 16, 100 32 C 94 42, 76 32, 70 28 Z"
                  fill="url(#ribbonGrad)"
                  filter="drop-shadow(0 2px 4px rgba(180, 40, 80, 0.25))"
                />
                {/* Ribbon tails */}
                <path d="M64 30 Q 50 48, 44 60 Q 54 56, 62 44 Z" fill="url(#ribbonGrad)" opacity="0.9" />
                <path d="M76 30 Q 90 48, 96 60 Q 86 56, 78 44 Z" fill="url(#ribbonGrad)" opacity="0.9" />

                {/* Golden Knot Center */}
                <circle cx="70" cy="28" r="8" fill="url(#goldCenter)" stroke="#fff" strokeWidth="1" />
              </g>
            </g>
          </svg>
        </div>

        {/* Action prompt beneath */}
        <div style={{ marginTop: '32px', textAlign: 'center', height: '48px' }}>
          {!showMessage ? (
            <p
              style={{
                margin: 0,
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.22em',
                color: '#ab496a',
                textTransform: 'uppercase',
                opacity: 0.88,
                transition: 'opacity 0.3s ease',
              }}
            >
              {birthdayContent.screen1.giftHint}
            </p>
          ) : (
            <p
              style={{
                margin: 0,
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontStyle: 'italic',
                fontSize: '22px',
                fontWeight: 500,
                color: '#8c2d4d',
                letterSpacing: '0.04em',
                animation: 'fadeInText 0.5s ease forwards',
              }}
            >
              {birthdayContent.screen1.openingText}
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes giftShake {
          0% { transform: scale(1) rotate(0deg); }
          20% { transform: scale(1.05) rotate(-6deg); }
          40% { transform: scale(1.08) rotate(6deg); }
          60% { transform: scale(1.07) rotate(-4deg); }
          80% { transform: scale(1.06) rotate(3deg); }
          100% { transform: scale(1.05) rotate(0deg); }
        }

        @keyframes floatEscape {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.4); }
          30% { opacity: 1; }
          100% { opacity: 0; transform: translate(var(--tw-translate-x, -50%), -180px) scale(1.3); }
        }

        @keyframes fadeInText {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
