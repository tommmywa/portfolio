import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import BackgroundShader from './components/BackgroundShader';
import NoiseOverlay from './components/NoiseOverlay';
import Preloader from './components/Preloader';
import Header from './components/Header';
import FolderHero from './components/FolderHero';
import NotesSection from './components/NotesSection';
import WorkSection from './components/WorkSection';
import FooterSection from './components/FooterSection';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    window.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#181717] text-[#eeeeee] overflow-x-hidden selection:bg-amber-300 selection:text-black">
      {/* Architectural Decryption Preloader Screen */}
      <Preloader />

      {/* WebGL Background Shader Layer */}
      <BackgroundShader />

      {/* Whole-Website WebGL Animated Film Grain Noise Overlay */}
      <NoiseOverlay />

      {/* Main Content Layout */}
      <div className="relative z-10">
        <Header />
        <main>
          <FolderHero />
          <NotesSection />
          <WorkSection />
        </main>
        <FooterSection />
      </div>
    </div>
  );
}
