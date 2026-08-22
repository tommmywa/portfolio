import React, { useEffect } from 'react';
import Lenis from 'lenis';

import BackgroundShader from './components/BackgroundShader';
import Header from './components/Header';
import FolderHero from './components/FolderHero';
import NotesSection from './components/NotesSection';
import WorkSection from './components/WorkSection';
import FooterSection from './components/FooterSection';

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

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#181717] text-[#eeeeee] overflow-x-hidden selection:bg-amber-300 selection:text-black">
      {/* WebGL Background Shader Layer */}
      <BackgroundShader />

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
