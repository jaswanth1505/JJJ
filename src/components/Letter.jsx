import React from 'react';
import { Heart, Feather } from 'lucide-react';
import { birthdayContent } from '../data/birthdayContent';

export default function Letter({ onContinueToFinal }) {
  // Split letter text by paragraphs
  const letterParagraphs = birthdayContent.letter.split('\n\n');

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f7deda 0%, #fae6e2 40%, #fceed9 80%, #fff4ec 100%)',
        padding: '70px 20px 80px 20px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-label="Birthday Letter for Jaya"
    >
      {/* Decorative top icon */}
      <div
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          backgroundColor: '#fff0f3',
          border: '1px solid rgba(226, 75, 116, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(180, 80, 100, 0.12)',
          marginBottom: '28px',
        }}
      >
        <Feather size={20} color="#c23c62" />
      </div>

      {/* The Stationery Parchment Letter */}
      <article
        style={{
          maxWidth: '620px',
          width: '100%',
          backgroundColor: '#fffdfa',
          borderRadius: '16px',
          padding: 'clamp(32px, 6vw, 56px)',
          boxSizing: 'border-box',
          boxShadow: '0 20px 60px -15px rgba(130, 40, 60, 0.18), 0 0 0 1px rgba(230, 180, 190, 0.35)',
          position: 'relative',
          lineHeight: 1.85,
        }}
      >
        {/* Subtle decorative watermark */}
        <div
          style={{
            position: 'absolute',
            top: '24px',
            right: '28px',
            opacity: 0.15,
            pointerEvents: 'none',
          }}
        >
          <Heart size={64} fill="#e24b74" color="#e24b74" />
        </div>

        {/* Letter Body */}
        <div style={{ color: '#4a2c35' }}>
          {letterParagraphs.map((para, index) => {
            const trimmed = para.trim();
            if (!trimmed) return null;

            // Highlight opening "Jaya," or first line
            const isFirst = index === 0 && trimmed.toLowerCase().startsWith(birthdayContent.name.toLowerCase());

            return (
              <p
                key={index}
                style={{
                  margin: '0 0 20px 0',
                  fontFamily: isFirst ? 'Playfair Display, serif' : 'Cormorant Garamond, Georgia, serif',
                  fontSize: isFirst ? 'clamp(26px, 4vw, 32px)' : 'clamp(18px, 2.5vw, 21px)',
                  fontWeight: isFirst ? 600 : 500,
                  color: isFirst ? '#751d38' : '#452b33',
                  lineHeight: isFirst ? 1.3 : 1.75,
                  letterSpacing: '0.015em',
                  whiteSpace: 'pre-line',
                }}
              >
                {trimmed}
              </p>
            );
          })}
        </div>

        {/* Soft Wax Stamp Seal at bottom */}
        <div
          style={{
            marginTop: '36px',
            paddingTop: '24px',
            borderTop: '1px dashed #f0d2d8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'Caveat, cursive',
                fontSize: '22px',
                color: '#8b2e4b',
              }}
            >
              With all my heart
            </span>
            <Heart size={15} fill="#e24b74" color="#e24b74" />
          </div>

          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#e6396a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 3px 8px rgba(230, 57, 106, 0.3)',
            }}
          >
            <Heart size={14} fill="#ffffff" color="#ffffff" />
          </div>
        </div>
      </article>

      {/* Button to Proceed to Final Reveal */}
      {onContinueToFinal && (
        <div style={{ marginTop: '45px', textAlign: 'center' }}>
          <button
            onClick={onContinueToFinal}
            style={{
              padding: '13px 30px',
              borderRadius: '26px',
              border: 'none',
              background: 'linear-gradient(135deg, #e83e6d 0%, #cb1d53 100%)',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(200, 30, 80, 0.28)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              letterSpacing: '0.02em',
            }}
          >
            <span>One Last Thing...</span>
            <Heart size={15} fill="#ffffff" />
          </button>
        </div>
      )}
    </section>
  );
}
