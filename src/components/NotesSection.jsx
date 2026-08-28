import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FULL_NOTES_TEXT = `**********  NOTES  **********

Date: 22-Aug-2026
Version: portfolio_1101

*****************************

I design the moments between intention and action.

Every pixel is a choice.
Every interaction is a promise.
Every product tells users what matters.

*****************************

Total Word Count: 24`;

export default function NotesSection() {
  const [typedIndex, setTypedIndex] = useState(0);
  const sectionRef = useRef(null);
  const animationTriggered = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        onEnter: () => {
          if (animationTriggered.current) return;
          animationTriggered.current = true;

          let current = 0;
          const interval = setInterval(() => {
            if (current <= FULL_NOTES_TEXT.length) {
              setTypedIndex(current);
              current++;
            } else {
              clearInterval(interval);
            }
          }, 25);
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const typedContent = FULL_NOTES_TEXT.slice(0, typedIndex);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#222222] text-[#a8a8a8] pt-[520px] sm:pt-[680px] md:pt-[780px] lg:pt-[900px] pb-24 md:pb-40 px-4 sm:px-6 md:px-16 min-h-[100vh] flex items-center justify-center overflow-hidden z-10 select-none"
    >
      {/* Background Graphic Asset from Figma (group34233.svg) */}
      <div className="absolute left-[-120px] sm:left-[-180px] md:left-[-220px] top-[15%] sm:top-[20%] w-[380px] sm:w-[600px] md:w-[980px] opacity-35 pointer-events-none z-0">
        <img
          src="/assets/group34233.svg"
          alt="Vector Graphic Art"
          className="w-full h-auto object-contain"
        />
      </div>

      <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* Left Column: Spacer for Overflowing Folder Image */}
        <div className="lg:col-span-6 min-h-[100px] hidden lg:block" />

        {/* Right Column: Fixed-Height Container to Prevent Layout Jumps/Expansion */}
        <div className="lg:col-span-6 font-departure text-sm sm:text-base md:text-lg lg:text-[20px] leading-[28px] sm:leading-[32px] md:leading-[36px] text-[#a8a8a8] max-w-[480px] mx-auto lg:ml-8 relative min-h-[420px] sm:min-h-[500px] md:min-h-[580px] mt-8 sm:mt-12 lg:mt-0">
          {/* Invisible Ghost Text Layout footprint so height is 100% fixed upfront */}
          <div
            className="invisible pointer-events-none whitespace-pre-wrap select-none"
            aria-hidden="true"
          >
            {FULL_NOTES_TEXT}
          </div>

          {/* Active Typewriter Text Overlay */}
          <div className="absolute inset-0 whitespace-pre-wrap">
            {typedContent}
            {/* SLEEK THIN WHITE CURSOR */}
            <span className="inline-block w-[2px] h-[22px] md:h-[26px] bg-white ml-1 animate-pulse align-middle shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
