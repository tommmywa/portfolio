import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { scroll004Sound } from '../sounds/scroll-004';
import { click002Sound } from '../sounds/click-002';
import { getAudioContext, decodeAudioData } from '../lib/sound-engine';

const TELEMETRY_STAGES = [
  { threshold: 0, text: 'BOOTSTRAPPING CAD CORE SYSTEM' },
  { threshold: 22, text: 'COMPILING THREE.JS SHADER PIPELINE' },
  { threshold: 48, text: 'CALIBRATING ARCHITECTURAL GRID NODES' },
  { threshold: 75, text: 'MOUNTING SELECTED REELS & ASSETS' },
  { threshold: 96, text: 'SYSTEM READY // DECRYPTING INTERFACE' },
];

const MATRIX_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|<>';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [telemetryText, setTelemetryText] = useState('BOOTSTRAPPING CAD CORE SYSTEM...');
  const [isComplete, setIsComplete] = useState(false);
  
  const containerRef = useRef(null);
  const scannerRef = useRef(null);
  const activeSourceRef = useRef(null);

  // Unlock Web Audio context on user interaction
  const unlockAudio = async () => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      playAuthenticScrollSound();
    } catch (e) {}
  };

  // Pre-decode audio buffer into memory on mount
  useEffect(() => {
    decodeAudioData(scroll004Sound.dataUri).catch(() => {});
    decodeAudioData(click002Sound.dataUri).catch(() => {});

    const handleInteraction = () => {
      unlockAudio();
    };

    window.addEventListener('pointerdown', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  const playAuthenticScrollSound = async () => {
    if (activeSourceRef.current) return;
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const buffer = await decodeAudioData(scroll004Sound.dataUri);
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();

      source.buffer = buffer;
      source.loop = true;
      gain.gain.value = 0.45;

      source.connect(gain);
      gain.connect(ctx.destination);

      source.start(0);
      activeSourceRef.current = source;
    } catch (e) {
      // Fallback
    }
  };

  const stopAuthenticScrollSound = () => {
    if (activeSourceRef.current) {
      try {
        activeSourceRef.current.stop();
      } catch (e) {}
      activeSourceRef.current = null;
    }
  };

  const playClickSound = async () => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      const buffer = await decodeAudioData(click002Sound.dataUri);
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();

      source.buffer = buffer;
      gain.gain.value = 0.5;

      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(0);
    } catch (e) {}
  };

  // Preloader interval timer automatically counting 0% -> 100% on mount
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    let currentProgress = 0;
    const interval = setInterval(() => {
      // Smooth non-linear progress increment
      const increment = Math.floor(Math.random() * 4) + 2;
      currentProgress = Math.min(100, currentProgress + increment);
      setProgress(currentProgress);

      // Determine active telemetry stage text
      const activeStage = [...TELEMETRY_STAGES]
        .reverse()
        .find((stage) => currentProgress >= stage.threshold);

      if (activeStage) {
        const target = activeStage.text;
        let scrambled = '';
        for (let i = 0; i < target.length; i++) {
          if (target[i] === ' ' || i < Math.floor((currentProgress / 100) * target.length)) {
            scrambled += target[i];
          } else {
            scrambled += MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
          }
        }
        setTelemetryText(scrambled);
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        stopAuthenticScrollSound();
        playClickSound();

        setTimeout(() => {
          triggerExitAnimation();
        }, 250);
      }
    }, 45);

    return () => {
      clearInterval(interval);
      stopAuthenticScrollSound();
      document.body.style.overflow = 'unset';
    };
  }, []);

  // GSAP Exit Animation: Smooth vertical curtain slide-up
  const triggerExitAnimation = () => {
    if (!containerRef.current) {
      document.body.style.overflow = 'unset';
      setIsComplete(true);
      if (onComplete) onComplete();
      return;
    }

    gsap.to(containerRef.current, {
      yPercent: -100,
      duration: 0.85,
      ease: 'power4.inOut',
      onComplete: () => {
        setIsComplete(true);
        document.body.style.overflow = 'unset';
        if (onComplete) onComplete();
      },
    });
  };

  if (isComplete) return null;

  return (
    <div
      ref={containerRef}
      onClick={unlockAudio}
      className="fixed inset-0 z-[10000] bg-[#181717] text-[#eeeeee] flex flex-col justify-between p-6 md:p-12 select-none overflow-hidden cursor-pointer"
    >
      {/* Background CAD Dotted Pattern for Preloader */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-700 via-transparent to-transparent">
        <svg className="w-full h-full" width="100%" height="100%">
          <pattern id="preloaderGrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="1" fill="rgba(255, 255, 255, 0.25)" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#preloaderGrid)" />
        </svg>
      </div>

      {/* Animated CAD Scanning Line */}
      <div
        ref={scannerRef}
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/80 to-transparent pointer-events-none animate-pulse"
        style={{ top: `${progress}%`, transition: 'top 0.1s linear' }}
      />

      {/* TOP BAR TELEMETRY */}
      <div className="relative z-10 flex items-center justify-between font-mono text-[10px] sm:text-xs text-neutral-400 tracking-widest uppercase">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping inline-block" />
          <span>[ SYSTEM_BOOT: V2.04 ]</span>
        </div>
        <div>
          <span>[ SCANNER: {progress.toString().padStart(3, '0')}.0mm ]</span>
        </div>
      </div>

      {/* CENTER HUGE PERCENTAGE COUNTER */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
        {/* Main Monospace Counter */}
        <div className="font-pixel-custom text-7xl sm:text-9xl md:text-[140px] text-[#a8a8a8] tracking-tighter leading-none font-bold">
          {progress.toString().padStart(2, '0')}
          <span className="text-[#a8a8a8] font-light text-4xl sm:text-6xl md:text-8xl ml-1">%</span>
        </div>

        {/* Matrix Scramble Telemetry Line */}
        <div className="mt-6 md:mt-8 font-mono text-xs sm:text-sm text-neutral-300 tracking-widest uppercase h-8 px-4 py-1.5 rounded border border-neutral-800 bg-neutral-900/80 backdrop-blur-sm flex items-center gap-2">
          <span className="text-blue-400 font-bold">&gt;</span>
          <span>{telemetryText}</span>
        </div>
      </div>

      {/* BOTTOM SPECS BAR */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[10px] sm:text-xs text-neutral-500 tracking-widest uppercase border-t border-neutral-800/80 pt-4">
        <div>PROJECT: PORTFOLIO_V2 // DECRYPTION ENGINE</div>
        <div className="flex items-center gap-4">
          <span>[ UNIT: MM ]</span>
          <span>[ SHEET: A1 ]</span>
        </div>
      </div>
    </div>
  );
}
