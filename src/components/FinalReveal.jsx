import React, { useState, useEffect } from 'react';
import { Heart, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { birthdayContent } from '../data/birthdayContent';

export default function FinalReveal({ onRestart }) {
  const [stage, setStage] = useState(0); // 0: "One last thing...", 1: Final Birthday Reveal

  useEffect(() => {
    // Stage 0 -> Stage 1 pause
    const timer = setTimeout(() => {
      setStage(1);

      // Gentle celebratory romantic confetti
      try {
        confetti({
          particleCount: 45,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff80aa', '#ffccd5', '#f9bd3b', '#fff0f5', '#e23b67'],
          scalar: 1.1,
          ticks: 240,
        });
      } catch (_) {}
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        minHeight: '620px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 60%, #fff7f4 0%, #faece5 55%, #f6ddd5 100%)',
        overflow: 'hidden',
        textAlign: 'center',
        padding: '24px',
        boxSizing: 'border-box',
      }}
      aria-label="Final Birthday Wish"
    >
      {/* Endless stream of small hearts slowly floating upward like lanterns */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        {[...Array(20)].map((_, i) => {
          const left = 5 + (i * 4.7) + (Math.sin(i) * 2);
          const size = 12 + (i % 5) * 4;
          const duration = 9 + (i % 6) * 2;
          const delay = (i * 0.45);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${left}%`,
                bottom: '-30px',
                fontSize: `${size}px`,
                color: i % 2 === 0 ? '#ff80aa' : '#f4577f',
                opacity: 0.6,
                animation: `lanternFloat ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
              }}
            >
              ❤️
            </div>
          );
        })}
      </div>

      {/* Stage 0: "One last thing..." */}
      {stage === 0 && (
        <div style={{ animation: 'fadeInText 0.8s ease', zIndex: 5 }}>
          <p
            style={{
              margin: 0,
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: 500,
              color: '#8b2e4b',
              letterSpacing: '0.04em',
            }}
          >
            {birthdayContent.finalGreeting}
          </p>
        </div>
      )}

      {/* Stage 1: The Final Emotional Message */}
      {stage === 1 && (
        <div
          style={{
            maxWidth: '680px',
            animation: 'fadeInText 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 5,
          }}
        >
          {/* Heart Emblem */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: '#ffe8ef',
              boxShadow: '0 6px 18px rgba(220, 60, 100, 0.18)',
              marginBottom: '20px',
              animation: 'gentlePulse 2.8s ease infinite',
            }}
          >
            <Heart size={26} fill="#e24b74" color="#d81e57" />
          </div>

          <h1
            style={{
              margin: '0 0 16px 0',
              fontFamily: 'Great Vibes, cursive',
              fontSize: 'clamp(48px, 9vw, 84px)',
              fontWeight: 400,
              color: '#7b1937',
              lineHeight: 1.15,
            }}
          >
            {birthdayContent.finalMessage}
          </h1>

          <p
            style={{
              margin: '0 auto 36px auto',
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(20px, 3.5vw, 26px)',
              color: '#6e3847',
              maxWidth: '520px',
              lineHeight: 1.4,
            }}
          >
            {birthdayContent.finalSubtext}
          </p>

          {/* Replay Journey Button */}
          {onRestart && (
            <div>
              <button
                onClick={onRestart}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '11px 24px',
                  borderRadius: '24px',
                  border: '1px solid rgba(220, 100, 130, 0.35)',
                  backgroundColor: 'rgba(255, 250, 248, 0.9)',
                  color: '#8b2e4b',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(180, 70, 90, 0.1)',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.25s ease',
                }}
              >
                <RotateCcw size={15} />
                <span>Replay the journey</span>
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes lanternFloat {
          0% {
            transform: translateY(0) scale(0.7) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.65;
          }
          85% {
            opacity: 0.65;
          }
          100% {
            transform: translateY(-110vh) scale(1.1) rotate(20deg);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
