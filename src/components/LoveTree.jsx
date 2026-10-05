import React, { useRef, useEffect, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, X } from 'lucide-react';
import { birthdayContent } from '../data/birthdayContent';
import { playHeartPop } from '../utils/audio';

export default function LoveTree({ onNext }) {
  const canvasRef = useRef(null);
  const [discoveredCount, setDiscoveredCount] = useState(0);
  const [discoveredSet, setDiscoveredSet] = useState(new Set());
  const [activeMessage, setActiveMessage] = useState(null);
  const [showSubtleHint, setShowSubtleHint] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Palettes for hundreds of heart leaves
  const BLOSSOM_COLORS = [
    { fill: '#ff80aa', stroke: '#e84d9a' },
    { fill: '#f4577f', stroke: '#d81e57' },
    { fill: '#ff9ebb', stroke: '#f06292' },
    { fill: '#ffa07a', stroke: '#f4511e' },
    { fill: '#ffb3ba', stroke: '#e57373' },
    { fill: '#ffd166', stroke: '#f59e0b' },
    { fill: '#ff70a6', stroke: '#e91e63' },
    { fill: '#ffccd5', stroke: '#ff85a2' },
  ];

  // Mathematical heart polygon distribution
  const heartPoints = useMemo(() => {
    const raw = [];
    for (let i = 0; i <= 100; i++) {
      const t = (i / 100) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      raw.push([x, y]);
    }
    return raw;
  }, []);

  const pointInHeart = (u, v) => {
    // Standard normalized heart curve check: (x^2 + y^2 - 1)^3 - x^2 * y^3 <= 0
    const x = u * 1.15;
    const y = v * 1.15 + 0.15;
    return Math.pow(x * x + y * y - 1, 3) - x * x * Math.pow(y, 3) <= 0;
  };

  // Generate interactive DOM heart leaves distributed across the heart canopy
  const interactiveHearts = useMemo(() => {
    const list = [];
    let seed = 42;
    const pseudoRand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    let attempts = 0;
    while (list.length < 55 && attempts < 800) {
      attempts++;
      const u = (pseudoRand() - 0.5) * 2.2;
      const v = (pseudoRand() - 0.5) * 2.2;
      if (pointInHeart(u, v)) {
        // Convert normalized (-1..1) to percentage coordinates on canopy
        const leftPercent = 50 + u * 36;
        const topPercent = 38 - v * 28;
        const color = BLOSSOM_COLORS[Math.floor(pseudoRand() * BLOSSOM_COLORS.length)];
        const size = 20 + Math.floor(pseudoRand() * 16);
        const rotation = (pseudoRand() - 0.5) * 45;
        const animDelay = pseudoRand() * 3;

        list.push({
          id: list.length,
          left: leftPercent,
          top: topPercent,
          color,
          size,
          rotation,
          animDelay,
        });
      }
    }
    return list;
  }, []);

  // Canvas animation for tree trunk, branches, ambient falling petals, and sparkles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Drifting petals
    const petals = [];
    for (let i = 0; i < 24; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: 0.6 + Math.random() * 1.2,
        size: 7 + Math.random() * 8,
        color: BLOSSOM_COLORS[Math.floor(Math.random() * BLOSSOM_COLORS.length)].fill,
        rotation: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.04,
        swayPhase: Math.random() * Math.PI * 2,
      });
    }

    // Sparkles in canopy
    const sparkles = [];
    for (let i = 0; i < 18; i++) {
      sparkles.push({
        x: width * 0.5 + (Math.random() - 0.5) * width * 0.55,
        y: height * 0.38 + (Math.random() - 0.5) * height * 0.45,
        size: 1 + Math.random() * 2.5,
        alpha: Math.random(),
        speed: 0.015 + Math.random() * 0.02,
      });
    }

    // Draw tree trunk and branches
    const drawTrunk = () => {
      const centerX = width * 0.5;
      const groundY = height * 0.94;
      const trunkTopY = height * 0.56;
      const trunkWidth = Math.max(16, width * 0.026);

      ctx.save();
      const trunkGrad = ctx.createLinearGradient(centerX - trunkWidth, groundY, centerX + trunkWidth, trunkTopY);
      trunkGrad.addColorStop(0, '#3a1f14');
      trunkGrad.addColorStop(0.5, '#563120');
      trunkGrad.addColorStop(1, '#6d3c26');

      ctx.fillStyle = trunkGrad;
      ctx.strokeStyle = '#432316';
      ctx.lineWidth = 2;

      // Main trunk path
      ctx.beginPath();
      ctx.moveTo(centerX - trunkWidth * 1.5, groundY);
      ctx.quadraticCurveTo(centerX - trunkWidth * 0.8, (groundY + trunkTopY) / 2, centerX - trunkWidth * 0.4, trunkTopY);
      ctx.lineTo(centerX + trunkWidth * 0.4, trunkTopY);
      ctx.quadraticCurveTo(centerX + trunkWidth * 0.8, (groundY + trunkTopY) / 2, centerX + trunkWidth * 1.5, groundY);
      ctx.closePath();
      ctx.fill();

      // Main Arching Branches
      const branches = [
        { sx: centerX - trunkWidth * 0.3, sy: trunkTopY + 10, ex: centerX - width * 0.22, ey: height * 0.36, cpx: centerX - width * 0.12, cpy: height * 0.46, w: 10 },
        { sx: centerX + trunkWidth * 0.3, sy: trunkTopY + 10, ex: centerX + width * 0.22, ey: height * 0.36, cpx: centerX + width * 0.12, cpy: height * 0.46, w: 10 },
        { sx: centerX, sy: trunkTopY, ex: centerX - width * 0.10, ey: height * 0.28, cpx: centerX - width * 0.05, cpy: height * 0.38, w: 8 },
        { sx: centerX, sy: trunkTopY, ex: centerX + width * 0.10, ey: height * 0.28, cpx: centerX + width * 0.05, cpy: height * 0.38, w: 8 },
        { sx: centerX - trunkWidth * 0.2, sy: trunkTopY - 20, ex: centerX - width * 0.18, ey: height * 0.26, cpx: centerX - width * 0.12, cpy: height * 0.34, w: 6 },
        { sx: centerX + trunkWidth * 0.2, sy: trunkTopY - 20, ex: centerX + width * 0.18, ey: height * 0.26, cpx: centerX + width * 0.12, cpy: height * 0.34, w: 6 },
      ];

      branches.forEach((b) => {
        ctx.beginPath();
        ctx.moveTo(b.sx, b.sy);
        ctx.quadraticCurveTo(b.cpx, b.cpy, b.ex, b.ey);
        ctx.strokeStyle = '#4e2a1b';
        ctx.lineWidth = b.w;
        ctx.lineCap = 'round';
        ctx.stroke();
      });

      ctx.restore();
    };

    let time = 0;
    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Warm radial glow behind canopy
      const glowGrad = ctx.createRadialGradient(
        width * 0.5, height * 0.38, 20,
        width * 0.5, height * 0.38, Math.min(width, height) * 0.48
      );
      glowGrad.addColorStop(0, 'rgba(255, 235, 215, 0.45)');
      glowGrad.addColorStop(0.6, 'rgba(255, 200, 210, 0.18)');
      glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      drawTrunk();

      // Sparkles
      sparkles.forEach((s) => {
        s.alpha += s.speed;
        const a = (Math.sin(s.alpha) + 1) / 2;
        ctx.fillStyle = `rgba(255, 240, 190, ${a * 0.7})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Drifting falling petals
      petals.forEach((p) => {
        p.y += p.vy;
        p.x += Math.sin(time + p.swayPhase) * 0.7 + p.vx;
        p.rotation += p.vrot;

        if (p.y > height + 20) {
          p.y = height * 0.2 + Math.random() * 40;
          p.x = width * 0.5 + (Math.random() - 0.5) * width * 0.5;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.65;

        // Mini heart petal
        ctx.beginPath();
        ctx.moveTo(0, p.size * 0.3);
        ctx.bezierCurveTo(0, 0, -p.size * 0.5, 0, -p.size * 0.5, p.size * 0.3);
        ctx.bezierCurveTo(-p.size * 0.5, p.size * 0.65, 0, p.size * 0.9, 0, p.size);
        ctx.bezierCurveTo(0, p.size * 0.9, p.size * 0.5, p.size * 0.65, p.size * 0.5, p.size * 0.3);
        ctx.bezierCurveTo(p.size * 0.5, 0, 0, 0, 0, p.size * 0.3);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Heart tap interaction
  const handleHeartClick = (e, heart) => {
    e.stopPropagation();
    playHeartPop();

    // Mark as discovered
    const nextSet = new Set(discoveredSet);
    nextSet.add(heart.id);
    setDiscoveredSet(nextSet);
    const count = nextSet.size;
    setDiscoveredCount(count);

    // Pick a secret message from array
    const messageIndex = (heart.id + count) % birthdayContent.secretMessages.length;
    const note = birthdayContent.secretMessages[messageIndex];
    setActiveMessage(note);

    // Burst confetti particles around the tapped heart
    const rect = e.currentTarget.getBoundingClientRect();
    const xNorm = (rect.left + rect.width / 2) / window.innerWidth;
    const yNorm = (rect.top + rect.height / 2) / window.innerHeight;

    try {
      confetti({
        particleCount: 22,
        spread: 55,
        origin: { x: xNorm, y: yNorm },
        colors: ['#ff4d79', '#f9bd3b', '#ff85a2', '#ffccd5'],
        scalar: 0.9,
      });
    } catch (_) {}

    // Special subtle hint after discovering a few messages (e.g. at 3 or 4)
    if (count === 3 && !showSubtleHint) {
      setTimeout(() => {
        setShowSubtleHint(true);
        setTimeout(() => setShowSubtleHint(false), 4500);
      }, 1200);
    }
  };

  const handleNextClick = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      onNext();
    }, 800);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        minHeight: '680px',
        background: 'linear-gradient(180deg, #fff5ec 0%, #fdece2 45%, #fadbd2 82%, #f5cac0 100%)',
        overflow: 'hidden',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        opacity: isTransitioning ? 0 : 1,
        transform: isTransitioning ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      {/* Background Canvas: Trunk, Atmosphere, Falling Petals */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Decorative Text in Lower-Left / Left */}
      <div
        style={{
          position: 'absolute',
          bottom: '120px',
          left: 'clamp(20px, 5vw, 60px)',
          maxWidth: '360px',
          zIndex: 5,
          pointerEvents: 'none',
          textShadow: '0 2px 10px rgba(255,255,255,0.7)',
        }}
      >
        <p
          style={{
            margin: '0 0 4px 0',
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontStyle: 'italic',
            fontSize: '16px',
            color: '#a04862',
            letterSpacing: '0.04em',
          }}
        >
          {birthdayContent.tree.eyebrow}
        </p>

        <h1
          style={{
            margin: '0 0 6px 0',
            fontFamily: 'Great Vibes, cursive',
            fontSize: 'clamp(44px, 7vw, 68px)',
            color: '#8b2046',
            fontWeight: 400,
            lineHeight: 1.1,
          }}
        >
          {birthdayContent.tree.title}
        </h1>

        <p
          style={{
            margin: 0,
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontStyle: 'italic',
            fontSize: '17px',
            color: '#7f4454',
            letterSpacing: '0.02em',
          }}
        >
          {birthdayContent.tree.subtext}
        </p>
      </div>

      {/* Counter for Little Secrets Discovered */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: 'clamp(18px, 4vw, 40px)',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 250, 248, 0.85)',
          padding: '6px 14px',
          borderRadius: '20px',
          border: '1px solid rgba(226, 75, 116, 0.2)',
          boxShadow: '0 4px 15px rgba(160, 50, 80, 0.08)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Heart size={15} fill="#ff4d79" color="#e24b74" />
        <span
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#8c2e4d',
            letterSpacing: '0.02em',
          }}
        >
          Little secrets discovered: {discoveredCount} / {birthdayContent.tree.secretsGoal}
        </span>
      </div>

      {/* Subtle Jaya Moment Toast (Top-Center) */}
      {showSubtleHint && (
        <div
          style={{
            position: 'absolute',
            top: '74px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            background: 'rgba(255, 252, 250, 0.94)',
            padding: '10px 22px',
            borderRadius: '24px',
            border: '1px solid rgba(249, 189, 59, 0.4)',
            boxShadow: '0 8px 24px rgba(180, 80, 100, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeInText 0.6s ease',
          }}
        >
          <Sparkles size={16} color="#d9822b" />
          <span
            style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontStyle: 'italic',
              fontSize: '16px',
              fontWeight: 600,
              color: '#82314a',
            }}
          >
            {birthdayContent.tree.subtleHint}
          </span>
        </div>
      )}

      {/* Canopy of Interactive Tappable Hearts */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 4,
          pointerEvents: 'none',
        }}
      >
        {interactiveHearts.map((h) => {
          const isOpened = discoveredSet.has(h.id);
          return (
            <button
              key={h.id}
              onClick={(e) => handleHeartClick(e, h)}
              aria-label="Tap to reveal secret birthday message"
              style={{
                position: 'absolute',
                left: `${h.left}%`,
                top: `${h.top}%`,
                width: `${h.size}px`,
                height: `${h.size}px`,
                transform: `translate(-50%, -50%) rotate(${h.rotation}deg) scale(${isOpened ? 1.15 : 1})`,
                background: 'none',
                border: 'none',
                padding: 0,
                margin: 0,
                cursor: 'pointer',
                pointerEvents: 'auto',
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease',
                filter: isOpened
                  ? 'drop-shadow(0 0 8px rgba(255, 220, 100, 0.8))'
                  : 'drop-shadow(0 2px 4px rgba(140, 30, 60, 0.2))',
                animation: `gentlePulse 3.5s ease-in-out infinite`,
                animationDelay: `${h.animDelay}s`,
              }}
            >
              <svg viewBox="0 0 24 22" width="100%" height="100%">
                <path
                  d="M12 20C5.5 15 1.5 11.4 1.5 6.9 1.5 3.6 4 1.5 7 1.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3 0 5.5 2.1 5.5 5.4C23.5 11.4 19.5 15 12 20Z"
                  fill={h.color.fill}
                  stroke={h.color.stroke}
                  strokeWidth="0.8"
                />
              </svg>
            </button>
          );
        })}
      </div>

      {/* Secret Note Card Modal when a heart is tapped */}
      {activeMessage && (
        <div
          onClick={() => setActiveMessage(null)}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(50, 20, 30, 0.28)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '20px',
            animation: 'fadeInText 0.25s ease',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '380px',
              width: '100%',
              background: '#fffbf7',
              borderRadius: '20px',
              padding: '36px 30px 28px 30px',
              boxShadow: '0 20px 50px rgba(140, 40, 70, 0.25), 0 0 0 1px rgba(230, 160, 175, 0.3)',
              textAlign: 'center',
              animation: 'popInNote 0.35s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setActiveMessage(null)}
              aria-label="Close message"
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                background: 'rgba(235, 120, 150, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#9e3f5c',
              }}
            >
              <X size={16} />
            </button>

            {/* Little heart seal decoration */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #ffe3ec 0%, #ffb3c9 100%)',
                boxShadow: '0 4px 10px rgba(220, 70, 110, 0.2)',
                marginBottom: '18px',
              }}
            >
              <Heart size={20} fill="#e23b67" color="#d81e57" />
            </div>

            {/* Secret Message Text */}
            <p
              style={{
                margin: '0 0 20px 0',
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: '22px',
                fontStyle: 'italic',
                fontWeight: 600,
                color: '#6e1d35',
                lineHeight: 1.45,
                letterSpacing: '0.02em',
              }}
            >
              "{activeMessage}"
            </p>

            <button
              onClick={() => setActiveMessage(null)}
              style={{
                background: 'linear-gradient(135deg, #f4577f 0%, #db2057 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '9px 22px',
                borderRadius: '24px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(219, 32, 87, 0.3)',
                letterSpacing: '0.04em',
              }}
            >
              Keep Exploring ✨
            </button>
          </div>
        </div>
      )}

      {/* The Letter Button at Bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: '34px',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        <button
          onClick={handleNextClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 28px',
            borderRadius: '30px',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            background: 'linear-gradient(135deg, #ff6584 0%, #e83e6d 100%)',
            color: '#ffffff',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(232, 62, 109, 0.38), 0 0 20px rgba(255, 175, 195, 0.5)',
            letterSpacing: '0.03em',
            transition: 'all 0.3s ease',
            animation: 'gentlePulse 2.8s ease infinite',
          }}
        >
          <span>{birthdayContent.tree.nextButtonText}</span>
        </button>
      </div>

      <style>{`
        @keyframes popInNote {
          0% { transform: scale(0.8) translateY(20px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
