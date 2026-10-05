import React, { useState, useEffect } from 'react';
import { Heart, X, Edit3, Sparkles } from 'lucide-react';
import { birthdayContent } from '../data/birthdayContent';
import { getStoredMemories } from '../utils/storage';
import PhotoEditor from './PhotoEditor';

export default function MemoryLane({ onContinueToLetter }) {
  const [memories, setMemories] = useState(birthdayContent.memories);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [imgErrors, setImgErrors] = useState({});

  // Load any previously saved memories from IndexedDB
  useEffect(() => {
    async function loadData() {
      const stored = await getStoredMemories();
      if (stored && stored.length > 0) {
        setMemories(stored);
      }
    }
    loadData();
  }, []);

  const handleImgError = (id) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  // Preset rotations for handmade scrapbook charm
  const defaultRotations = [-3, 2.5, -2, 3.2, -1.5, 2, -2.5];

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #fdf5f0 0%, #fceed9 35%, #fae6de 70%, #f7deda 100%)',
        padding: '80px 20px 60px 20px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
      aria-label="Memory Lane Scrapbook"
    >
      {/* Decorative Washi Tape / Paper Accents */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '12px', background: 'radial-gradient(ellipse at 50% 0%, rgba(226, 75, 116, 0.15) 0%, rgba(0,0,0,0) 80%)' }} />

      {/* Header Container */}
      <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 40px auto' }}>
        <p
          style={{
            margin: '0 0 6px 0',
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#a04862',
          }}
        >
          A Little Scrapbook
        </p>

        <h2
          style={{
            margin: '0 0 14px 0',
            fontFamily: 'Great Vibes, cursive',
            fontSize: 'clamp(46px, 8vw, 68px)',
            fontWeight: 400,
            color: '#7b1f3d',
            lineHeight: 1.1,
          }}
        >
          Memory Lane
        </h2>

        <p
          style={{
            margin: '0 auto',
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: '18px',
            fontStyle: 'italic',
            color: '#6f3d4c',
            maxWidth: '460px',
            lineHeight: 1.45,
          }}
        >
          A quiet corner of little moments, sweet memories, and smiles worth holding onto forever.
        </p>

        {/* Subtle "✎ Edit Memories" Button */}
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => setIsEditorOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: '20px',
              border: '1px solid rgba(220, 100, 130, 0.35)',
              background: 'rgba(255, 250, 248, 0.85)',
              color: '#8b2e4b',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(180, 80, 100, 0.08)',
              backdropFilter: 'blur(6px)',
              transition: 'all 0.25s ease',
            }}
          >
            <Edit3 size={14} /> ✎ Edit Memories
          </button>
        </div>
      </div>

      {/* Polaroid Scrapbook Grid */}
      {/* Layout: Photo 1, 2, 3, 4 across top/flex, Photo 5 centered beneath */}
      <div
        style={{
          maxWidth: '1060px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '32px 28px',
          padding: '10px 0 40px 0',
        }}
      >
        {memories.map((mem, index) => {
          const rotation = mem.rotation !== undefined ? mem.rotation : defaultRotations[index % defaultRotations.length];
          const hasError = imgErrors[mem.id] || !mem.image;

          // Special 5th polaroid styling: center on new line if 5 items
          const isFifth = index === 4;

          return (
            <div
              key={mem.id || index}
              onClick={() => setSelectedPhoto(mem)}
              role="button"
              tabIndex={0}
              aria-label={`View photo ${index + 1}: ${mem.caption}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setSelectedPhoto(mem);
              }}
              style={{
                position: 'relative',
                width: 'clamp(210px, 42vw, 240px)',
                background: '#ffffff',
                padding: '12px 12px 38px 12px',
                borderRadius: '6px',
                boxShadow: '0 12px 28px -6px rgba(140, 50, 70, 0.16), 0 4px 10px rgba(0, 0, 0, 0.05)',
                transform: `rotate(${rotation}deg)`,
                cursor: 'pointer',
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
                ...(isFifth
                  ? {
                      flexBasis: '100%',
                      maxWidth: '250px',
                      marginTop: '8px',
                    }
                  : {}),
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = `scale(1.04) rotate(0deg)`;
                e.currentTarget.style.zIndex = '15';
                e.currentTarget.style.boxShadow = '0 22px 40px -8px rgba(160, 40, 70, 0.28)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `rotate(${rotation}deg)`;
                e.currentTarget.style.zIndex = '1';
                e.currentTarget.style.boxShadow = '0 12px 28px -6px rgba(140, 50, 70, 0.16), 0 4px 10px rgba(0, 0, 0, 0.05)';
              }}
            >
              {/* Washi Tape / Decorative Pin at Top */}
              <div
                style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '56px',
                  height: '18px',
                  background: 'rgba(255, 218, 225, 0.85)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                  border: '1px dashed rgba(220, 110, 130, 0.35)',
                  borderRadius: '2px',
                  zIndex: 2,
                }}
              />

              {/* Photo Image or Beautiful Romantic Placeholder */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1.08',
                  backgroundColor: '#fdf3f0',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {!hasError ? (
                  <img
                    src={mem.image}
                    alt={mem.caption || `Memory ${index + 1}`}
                    loading="lazy"
                    onError={() => handleImgError(mem.id)}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                ) : (
                  // Romantic handmade placeholder — NEVER a broken image icon!
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'radial-gradient(circle, #fff0f3 0%, #fde4ea 100%)',
                      padding: '16px',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(220, 80, 110, 0.15)',
                        marginBottom: '8px',
                      }}
                    >
                      <Heart size={18} fill="#ff6584" color="#e83e6d" />
                    </div>
                    <span
                      style={{
                        fontFamily: 'Caveat, cursive',
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#9c3855',
                        lineHeight: 1.25,
                      }}
                    >
                      Your memory goes here ❤️
                    </span>
                    <span style={{ fontSize: '11px', color: '#b87588', marginTop: '4px' }}>
                      Tap to replace photo
                    </span>
                  </div>
                )}
              </div>

              {/* Handwritten Caption at bottom */}
              <div
                style={{
                  marginTop: '12px',
                  textAlign: 'center',
                  padding: '0 4px',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'Caveat, cursive',
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#4f2d35',
                    lineHeight: 1.2,
                  }}
                >
                  {mem.caption}
                </p>
              </div>

              {/* Tiny corner heart stamp */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '10px',
                  opacity: 0.65,
                }}
              >
                <Heart size={12} fill="#ff8aa3" color="#ff8aa3" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal when a photo is clicked */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(40, 16, 24, 0.72)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 150,
            padding: '20px',
            animation: 'fadeInText 0.3s ease',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '480px',
              width: '100%',
              backgroundColor: '#ffffff',
              padding: '16px 16px 36px 16px',
              borderRadius: '12px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
              animation: 'popInNote 0.35s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
              textAlign: 'center',
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close photo"
              style={{
                position: 'absolute',
                top: '-16px',
                right: '-16px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#8b2e4b',
              }}
            >
              <X size={18} />
            </button>

            {/* Enlarge Image */}
            <div
              style={{
                width: '100%',
                maxHeight: '62vh',
                borderRadius: '6px',
                overflow: 'hidden',
                backgroundColor: '#fcf0ed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {selectedPhoto.image && !imgErrors[selectedPhoto.id] ? (
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.caption}
                  style={{ width: '100%', maxHeight: '62vh', objectFit: 'contain' }}
                />
              ) : (
                <div style={{ padding: '60px 20px' }}>
                  <Heart size={42} fill="#ff6584" color="#e83e6d" style={{ marginBottom: '14px' }} />
                  <p style={{ fontFamily: 'Caveat, cursive', fontSize: '26px', color: '#88314a', margin: 0 }}>
                    Your memory goes here ❤️
                  </p>
                  <p style={{ fontSize: '13px', color: '#9d6371', marginTop: '8px' }}>
                    Click "Edit Memories" to upload your own picture!
                  </p>
                </div>
              )}
            </div>

            {/* Caption */}
            <p
              style={{
                margin: '18px 0 0 0',
                fontFamily: 'Caveat, cursive',
                fontSize: '26px',
                fontWeight: 600,
                color: '#4e2832',
                lineHeight: 1.3,
              }}
            >
              {selectedPhoto.caption}
            </p>
          </div>
        </div>
      )}

      {/* Photo Editor Drawer / Modal */}
      {isEditorOpen && (
        <PhotoEditor
          memories={memories}
          onUpdate={(updated) => {
            setMemories(updated);
            setImgErrors({});
          }}
          onClose={() => setIsEditorOpen(false)}
        />
      )}

      {/* Button to proceed to the handwritten letter */}
      {onContinueToLetter && (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            onClick={onContinueToLetter}
            style={{
              padding: '13px 28px',
              borderRadius: '26px',
              border: 'none',
              background: 'linear-gradient(135deg, #e83e6d 0%, #cb1d53 100%)',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(200, 30, 80, 0.28)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              letterSpacing: '0.02em',
            }}
          >
            <span>Read My Letter For You</span>
            <Heart size={15} fill="#ffffff" />
          </button>
        </div>
      )}
    </section>
  );
}
