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

export default function Preloader({ onComplete, skip = false }) {
  const [hasStarted, setHasStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [telemetryText, setTelemetryText] = useState('CAD CORE SYSTEM READY // AWAITING BOOT INITIALIZATION');
  const [isComplete, setIsComplete] = useState(false);

  
  const containerRef = useRef(null);
  const scannerRef = useRef(null);
  
  // Synchronous ref lock to prevent mobile touch double-trigger audio node leaks
  const hasStartedRef = useRef(false);
  const activeSourcesRef = useRef([]);

  // Pre-decode audio buffer into memory on mount
  useEffect(() => {
    decodeAudioData(scroll004Sound.dataUri).catch(() => {});
    decodeAudioData(click002Sound.dataUri).catch(() => {});
  }, []);

  const playAuthenticScrollSound = async () => {
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
      activeSourcesRef.current.push(source);
    } catch (e) {
      // Fallback
    }
  };

  const stopAllScrollSounds = () => {
    if (activeSourcesRef.current.length > 0) {
      activeSourcesRef.current.forEach((source) => {
        try {
          source.stop();
          source.disconnect();
        } catch (e) {}
      });
      activeSourcesRef.current = [];
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

  // Start boot sequence explicitly on user click / tap / keypress
  const startBootSequence = () => {
    // Synchronous ref check prevents dual trigger from touchstart + click on mobile
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    setHasStarted(true);

    // Play authentic original scroll sound file upon explicit user click
    playAuthenticScrollSound();
  };

  // Listen for initial explicit user interaction (disabled when skip=true)
  useEffect(() => {
    if (skip) return;

    const handleInteraction = (e) => {
      startBootSequence();
    };

    window.addEventListener('pointerdown', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [skip]);

  // Preloader interval timer counting 0% -> 100% AFTER explicit user click
  useEffect(() => {
    if (!hasStarted) return;

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
        stopAllScrollSounds();
        playClickSound();

        setTimeout(() => {
          triggerExitAnimation();
        }, 300);
      }
    }, 45);

    return () => {
      clearInterval(interval);
      stopAllScrollSounds();
      document.body.style.overflow = 'unset';
    };
  }, [hasStarted]);

  // GSAP Exit Animation: Smooth vertical curtain slide-up
  const triggerExitAnimation = () => {
    stopAllScrollSounds();

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
        stopAllScrollSounds();
        setIsComplete(true);
        document.body.style.overflow = 'unset';
        if (onComplete) onComplete();
      },
    });
  };

  if (skip || isComplete) return null;

  return (
    <div
      ref={containerRef}
      onClick={startBootSequence}
      className="fixed inset-0 z-[10000] bg-[#181717] text-[#eeeeee] flex flex-col justify-between p-4 sm:p-6 md:p-12 select-none overflow-hidden cursor-pointer"
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
      <div className="relative z-10 flex items-center justify-between font-mono text-[9px] sm:text-xs text-neutral-400 tracking-widest uppercase">
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
        <div className="font-pixel-custom text-6xl sm:text-8xl md:text-[140px] text-[#a8a8a8] tracking-tighter leading-none font-bold">
          {progress.toString().padStart(2, '0')}
          <span className="text-[#a8a8a8] font-light text-3xl sm:text-5xl md:text-8xl ml-1">%</span>
        </div>

        {/* Matrix Scramble Telemetry Line */}
        <div className="mt-4 sm:mt-6 md:mt-8 font-mono text-[11px] sm:text-xs md:text-sm text-neutral-300 tracking-widest uppercase h-8 px-3 sm:px-4 py-1.5 rounded border border-neutral-800 bg-neutral-900/80 backdrop-blur-sm flex items-center gap-2 max-w-[90vw] truncate">
          <span className="text-blue-400 font-bold">&gt;</span>
          <span className="truncate">{telemetryText}</span>
        </div>

        {/* Prominent Explicit Click / Tap Prompt */}
        {!hasStarted && (
          <div className="mt-5 sm:mt-6 inline-flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full border border-blue-500/60 bg-blue-500/10 text-blue-400 font-mono text-[10px] sm:text-xs tracking-widest uppercase animate-pulse shadow-[0_0_20px_rgba(59,130,246,0.3)] max-w-[90vw] text-center">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping shrink-0" />
            <span>[ CLICK ANYWHERE TO INITIALIZE CAD SYSTEM ]</span>
          </div>
        )}
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
