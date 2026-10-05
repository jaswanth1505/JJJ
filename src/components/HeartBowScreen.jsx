import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { birthdayContent } from '../data/birthdayContent';
import { playArrowHit } from '../utils/audio';

export default function HeartBowScreen({ onNext }) {
  const containerRef = useRef(null);
  const targetRef = useRef(null);
  const targetHeartRef = useRef(null);
  const heartGlowRef = useRef(null);
  const archeryRef = useRef(null);
  const bowRef = useRef(null);
  const arrowRef = useRef(null);
  const strLRef = useRef(null);
  const strRRef = useRef(null);
  const servingRef = useRef(null);
  const aimRef = useRef(null);

  const [hasFired, setHasFired] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const curDrawRef = useRef(0);
  const maxDrawRef = useRef(110);
  const pullUnitRef = useRef({ x: 0, y: 1 });
  const arrowBaseRef = useRef({ x: 0, y: 0 });
  const svgScaleRef = useRef(1);

  const REST_NOCK = 96;

  // Apply string position
  const setNockY = useCallback((y) => {
    if (strLRef.current) strLRef.current.setAttribute('y2', y);
    if (strRRef.current) strRRef.current.setAttribute('y2', y);
    if (servingRef.current) servingRef.current.setAttribute('cy', y);
  }, []);

  const setDraw = useCallback((d) => {
    const clamped = Math.max(0, Math.min(d, maxDrawRef.current));
    curDrawRef.current = clamped;
    if (arrowRef.current) {
      gsap.set(arrowRef.current, {
        x: arrowBaseRef.current.x,
        y: arrowBaseRef.current.y + clamped,
      });
    }
    setNockY(REST_NOCK + clamped / svgScaleRef.current);
    if (aimRef.current) {
      gsap.set(aimRef.current, { opacity: 0.65 * (clamped / maxDrawRef.current) });
    }
  }, [setNockY]);

  // Setup rig geometry and heart aiming
  const refreshRig = useCallback(() => {
    if (!containerRef.current || !archeryRef.current || !bowRef.current || !arrowRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const W = container.width;
    const H = container.height;

    // Anchor points: Grip at ~22% X, ~74% Y; Heart at ~50% X, ~34% Y
    const gripX = W * 0.22;
    const gripY = H * 0.74;
    const heartX = W * 0.50;
    const heartY = H * 0.34;

    const aimRad = Math.atan2(heartX - gripX, gripY - heartY);
    pullUnitRef.current = {
      x: -Math.sin(aimRad),
      y: Math.cos(aimRad),
    };

    // Neutralize transforms to measure
    setNockY(REST_NOCK);
    gsap.set(archeryRef.current, { rotation: 0, scale: 1, x: 0, y: 0 });
    archeryRef.current.style.left = '0px';
    archeryRef.current.style.top = '0px';
    gsap.set(arrowRef.current, { x: 0, y: 0 });

    const aR = archeryRef.current.getBoundingClientRect();
    const bR = bowRef.current.getBoundingClientRect();
    const sR = servingRef.current ? servingRef.current.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 };
    const rR = arrowRef.current.getBoundingClientRect();

    svgScaleRef.current = bR.width / 460 || 1;
    const gripLX = (bR.left - aR.left) + 0.5 * bR.width;
    const gripLY = (bR.top - aR.top) + (240 / 300) * bR.height;
    const nockLX = (sR.left - aR.left) + 0.5 * sR.width;
    const nockLY = (sR.top - aR.top) + 0.5 * sR.height;

    arrowBaseRef.current = {
      x: nockLX - ((rR.left - aR.left) + 0.5 * rR.width),
      y: nockLY - ((rR.top - aR.top) + (205 / 220) * rR.height),
    };

    archeryRef.current.style.left = `${gripX - gripLX}px`;
    archeryRef.current.style.top = `${gripY - gripLY}px`;

    gsap.set(archeryRef.current, {
      transformOrigin: `${gripLX}px ${gripLY}px`,
      rotation: (aimRad * 180) / Math.PI,
    });
    gsap.set(arrowRef.current, {
      x: arrowBaseRef.current.x,
      y: arrowBaseRef.current.y,
    });

    maxDrawRef.current = Math.min(bR.height * 0.75, H * 0.18, 125);
    setDraw(0);
  }, [setDraw, setNockY]);

  // Gentle beating heart animation
  useEffect(() => {
    refreshRig();
    window.addEventListener('resize', refreshRig);

    // Initial heart pulse
    const beatTL = gsap.timeline({ repeat: -1, repeatDelay: 0.55 });
    if (targetHeartRef.current && heartGlowRef.current) {
      beatTL
        .to(targetHeartRef.current, { scale: 1.08, duration: 0.14, ease: 'power2.out' }, 0)
        .to(heartGlowRef.current, { scale: 1.2, opacity: 0.9, duration: 0.14, ease: 'power2.out' }, 0)
        .to(targetHeartRef.current, { scale: 1.0, duration: 0.22, ease: 'power2.in' }, 0.14)
        .to(targetHeartRef.current, { scale: 1.05, duration: 0.12, ease: 'power2.out' }, 0.32)
        .to(targetHeartRef.current, { scale: 1.0, duration: 0.45, ease: 'power2.inOut' }, 0.44)
        .to(heartGlowRef.current, { scale: 1.0, opacity: 0.65, duration: 0.6, ease: 'power2.inOut' }, 0.32);
    }

    return () => {
      window.removeEventListener('resize', refreshRig);
      beatTL.kill();
    };
  }, [refreshRig]);

  // Fire sequence
  const fireArrow = useCallback(() => {
    if (hasFired) return;
    setHasFired(true);
    isDraggingRef.current = false;

    const archeryEl = archeryRef.current;
    const arrowEl = arrowRef.current;
    const targetEl = targetRef.current;
    const targetHeartEl = targetHeartRef.current;
    const aimEl = aimRef.current;

    if (!archeryEl || !arrowEl || !targetEl || !targetHeartEl) return;

    // Calculate flight distance to heart
    const tRect = targetEl.getBoundingClientRect();
    const aRect = arrowEl.getBoundingClientRect();
    const flightDist = Math.hypot(
      tRect.left + tRect.width / 2 - (aRect.left + aRect.width / 2),
      tRect.top + tRect.height / 2 - (aRect.top + aRect.height / 2)
    );

    const tl = gsap.timeline({
      onComplete: () => {
        // Transition to Love Tree (Screen 3)
        setTimeout(() => {
          onNext();
        }, 1100);
      },
    });

    // 1. Release string & launch arrow
    tl.to(
      { val: REST_NOCK + curDrawRef.current / svgScaleRef.current },
      {
        val: REST_NOCK,
        duration: 0.3,
        ease: 'elastic.out(1, 0.3)',
        onUpdate: function () {
          setNockY(this.targets()[0].val);
        },
      },
      0
    )
      .to(arrowEl, { y: arrowBaseRef.current.y - flightDist * 0.96, duration: 0.24, ease: 'power3.in' }, 0)
      .to(aimEl, { opacity: 0, duration: 0.1 }, 0);

    // 2. Arrow hits heart!
    tl.call(() => {
      playArrowHit();

      // Confetti burst of mini hearts!
      try {
        const heartPos = targetHeartEl.getBoundingClientRect();
        const xNorm = (heartPos.left + heartPos.width / 2) / window.innerWidth;
        const yNorm = (heartPos.top + heartPos.height / 2) / window.innerHeight;

        confetti({
          particleCount: 50,
          spread: 80,
          origin: { x: xNorm, y: yNorm },
          colors: ['#ff4d79', '#ff85a2', '#ffccd5', '#f9bd3b', '#e23b67'],
          scalar: 1.2,
          ticks: 200,
        });
      } catch (_) {}
    }, null, 0.24);

    // 3. Heart reacts, bounces, glows, and shatters into mini hearts!
    tl.to(targetHeartEl, { scale: 1.25, x: 8, y: -8, duration: 0.08, ease: 'power2.out' }, 0.24)
      .to(heartGlowRef.current, { scale: 2.2, opacity: 1, duration: 0.18, ease: 'power2.out' }, 0.24)
      .to(targetHeartEl, { scale: 1.4, opacity: 0.3, duration: 0.25, ease: 'power2.in' }, 0.36)
      .to(arrowEl, { opacity: 0, duration: 0.15 }, 0.38)
      .to(targetHeartEl, { scale: 2.0, opacity: 0, duration: 0.35, ease: 'power3.out' }, 0.6)
      .to(heartGlowRef.current, { scale: 3.5, opacity: 0, duration: 0.5, ease: 'power2.out' }, 0.6);
  }, [hasFired, onNext, setNockY]);

  // Spring back if not drawn enough
  const springBack = useCallback(() => {
    const from = curDrawRef.current;
    gsap.to(
      { d: from },
      {
        d: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.4)',
        onUpdate: function () {
          setDraw(this.targets()[0].d);
        },
      }
    );
  }, [setDraw]);

  // Pointer drag events for mobile & desktop
  const handlePointerDown = (e) => {
    if (hasFired) return;
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || hasFired) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const proj = dx * pullUnitRef.current.x + dy * pullUnitRef.current.y;
    setDraw(proj);
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current || hasFired) return;
    isDraggingRef.current = false;
    if (curDrawRef.current > maxDrawRef.current * 0.22) {
      fireArrow();
    } else {
      springBack();
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        minHeight: '600px',
        background: 'radial-gradient(ellipse at 50% 30%, #fff6f3 0%, #faede8 55%, #f5dbd4 100%)',
        overflow: 'hidden',
        touchAction: 'none',
      }}
    >
      {/* Top Header Eyebrow */}
      <div
        style={{
          position: 'absolute',
          top: '44px',
          left: 0,
          right: 0,
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(20px, 4vw, 28px)',
            fontWeight: 500,
            color: '#8e3a53',
            letterSpacing: '0.04em',
            animation: 'fadeInText 0.8s ease forwards',
          }}
        >
          {birthdayContent.screen2.intro}
        </p>
      </div>

      {/* Target: Large Glossy Candy/Glass Pink Heart */}
      <div
        ref={targetRef}
        style={{
          position: 'absolute',
          top: '34%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 4,
          pointerEvents: 'none',
        }}
      >
        {/* Soft Heart Glow */}
        <div
          ref={heartGlowRef}
          style={{
            position: 'absolute',
            inset: '-20px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 110, 150, 0.45) 0%, rgba(255, 110, 150, 0) 70%)',
            filter: 'blur(16px)',
            opacity: 0.7,
          }}
        />

        {/* 3D Glossy Candy Heart SVG */}
        <div ref={targetHeartRef} style={{ width: '150px', height: '140px' }}>
          <svg viewBox="0 0 100 92" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <defs>
              <radialGradient id="candyHeartGrad" cx="38%" cy="28%" r="85%">
                <stop offset="0%" stop-color="#ffe6ee" />
                <stop offset="28%" stop-color="#ff7b9f" />
                <stop offset="65%" stop-color="#db2057" />
                <stop offset="100%" stop-color="#990b39" />
              </radialGradient>
              <linearGradient id="candySheen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="rgba(255,255,255,0.92)" />
                <stop offset="42%" stop-color="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>

            {/* Heart 3D Base */}
            <path
              d="M50 86.5C26 68 10.5 53.6 10.5 34.6 10.5 20.4 21 11 33.2 11c8.6 0 14.2 4.7 16.8 11.4C52.6 15.7 58.2 11 66.8 11 79 11 89.5 20.4 89.5 34.6 89.5 53.6 74 68 50 86.5Z"
              fill="url(#candyHeartGrad)"
              filter="drop-shadow(0 14px 28px rgba(180, 25, 70, 0.28))"
            />
            {/* Top glass reflection */}
            <path
              d="M50 86.5C26 68 10.5 53.6 10.5 34.6 10.5 20.4 21 11 33.2 11c8.6 0 14.2 4.7 16.8 11.4C52.6 15.7 58.2 11 66.8 11 79 11 89.5 20.4 89.5 34.6 89.5 53.6 74 68 50 86.5Z"
              fill="url(#candySheen)"
              opacity="0.65"
            />
            {/* Glossy specular highlight */}
            <ellipse
              cx="34"
              cy="28"
              rx="9"
              ry="5.8"
              fill="#ffffff"
              opacity="0.85"
              style={{ mixBlendMode: 'screen' }}
            />
          </svg>
        </div>
      </div>

      {/* Interactive Archery Rig (Recurve Bow + Cupid's Arrow) */}
      <div
        ref={archeryRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="button"
        tabIndex={0}
        aria-label="Draw bow and release to send arrow to heart"
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') fireArrow();
        }}
        style={{
          position: 'absolute',
          width: '240px',
          height: '240px',
          cursor: hasFired ? 'default' : 'grab',
          touchAction: 'none',
          userSelect: 'none',
          zIndex: 8,
        }}
      >
        {/* Aim guide line */}
        <div
          ref={aimRef}
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '50%',
            width: '2px',
            height: '420px',
            background: 'linear-gradient(to top, rgba(249, 189, 59, 0.9), rgba(249, 189, 59, 0))',
            transformOrigin: 'bottom center',
            pointerEvents: 'none',
            opacity: 0,
          }}
        />

        {/* Realistic Recurve Bow SVG */}
        <svg
          ref={bowRef}
          viewBox="0 0 460 300"
          width="100%"
          height="100%"
          style={{ overflow: 'visible', pointerEvents: 'none' }}
        >
          <defs>
            <linearGradient id="bowLimb" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="#4a2a1a" />
              <stop offset="0.2" stop-color="#6b3f24" />
              <stop offset="0.5" stop-color="#8a5127" />
              <stop offset="0.8" stop-color="#6b3f24" />
              <stop offset="1" stop-color="#4a2a1a" />
            </linearGradient>
            <linearGradient id="bowGrip" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="#2a1a10" />
              <stop offset="0.5" stop-color="#5a3822" />
              <stop offset="1" stop-color="#2a1a10" />
            </linearGradient>
          </defs>

          {/* Bow Limb */}
          <path
            d="M34 96 C 118 168, 168 240, 230 252 C 292 240, 342 168, 426 96"
            fill="none"
            stroke="url(#bowLimb)"
            strokeWidth="13"
            strokeLinecap="round"
          />
          {/* Recurve Tips */}
          <path d="M34 96 C 22 82, 26 70, 40 66" fill="none" stroke="url(#bowLimb)" strokeWidth="8" strokeLinecap="round" />
          <path d="M426 96 C 438 82, 434 70, 420 66" fill="none" stroke="url(#bowLimb)" strokeWidth="8" strokeLinecap="round" />

          {/* Grip */}
          <rect x="216" y="206" width="28" height="70" rx="9" fill="url(#bowGrip)" />
          <path d="M219 220h22 M219 236h22 M219 252h22" stroke="rgba(0,0,0,0.35)" strokeWidth="2" />

          {/* Bowstring Left & Right */}
          <line ref={strLRef} x1="40" y1="70" x2="230" y2="96" stroke="#a48c77" strokeWidth="2.2" strokeLinecap="round" />
          <line ref={strRRef} x1="420" y1="70" x2="230" y2="96" stroke="#a48c77" strokeWidth="2.2" strokeLinecap="round" />
          <circle ref={servingRef} cx="230" cy="96" r="4.5" fill="#6f5137" />
        </svg>

        {/* Cupid's Love Arrow SVG */}
        <svg
          ref={arrowRef}
          viewBox="0 0 64 220"
          style={{
            position: 'absolute',
            width: '32px',
            height: '110px',
            overflow: 'visible',
            pointerEvents: 'none',
          }}
        >
          <defs>
            <linearGradient id="arrowGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#ffe38c" />
              <stop offset="0.45" stop-color="#f4a626" />
              <stop offset="1" stop-color="#a85f0e" />
            </linearGradient>
            <linearGradient id="arrowFletch" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#ff7f9c" />
              <stop offset="0.5" stop-color="#e6396a" />
              <stop offset="1" stop-color="#a8154a" />
            </linearGradient>
          </defs>

          {/* Shaft */}
          <rect x="29.4" y="30" width="5.2" height="168" rx="2.6" fill="#6b3f24" />

          {/* Golden Heart Tip */}
          <path
            d="M32 12 C 30 7, 22 6.5, 21.5 13 C 21 18, 27 22, 32 27 C 37 22, 43 18, 42.5 13 C 42 6.5, 34 7, 32 12 Z"
            fill="url(#arrowGold)"
            stroke="#a5701a"
            strokeWidth="0.8"
          />

          {/* Feather fletching */}
          <g>
            <path d="M32 150 C 16 156, 10 178, 15 200 C 24 194, 30 184, 32 176 Z" fill="url(#arrowFletch)" />
            <path d="M32 150 C 48 156, 54 178, 49 200 C 40 194, 34 184, 32 176 Z" fill="url(#arrowFletch)" opacity="0.92" />
          </g>
        </svg>
      </div>

      {/* Bottom Action Prompt */}
      <div
        style={{
          position: 'absolute',
          bottom: '36px',
          left: 0,
          right: 0,
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.24em',
            color: '#9f4664',
            textTransform: 'uppercase',
            opacity: 0.85,
            animation: 'gentlePulse 2.5s ease infinite',
          }}
        >
          {birthdayContent.screen2.pullHint}
        </p>
      </div>
    </div>
  );
}
