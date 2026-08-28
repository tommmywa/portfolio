import React, { useState, useEffect } from 'react';
import { useSound } from '../hooks/useSound';
import { click002Sound } from '../sounds/click-002';

const RANDOM_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|<>?';

export default function Header() {
  const [timeString, setTimeString] = useState('');
  const [playClick] = useSound(click002Sound);
  
  // Decryption effect states for AYODEJI and OGUNDIPE
  const [line1, setLine1] = useState('AYODEJI');
  const [line2, setLine2] = useState('OGUNDIPE');

  const scrambleLine = (targetText, setFn) => {
    let iteration = 0;
    const interval = setInterval(() => {
      setFn(
        targetText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return targetText[index];
            return RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)];
          })
          .join('')
      );

      if (iteration >= targetText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2.5;
    }, 40);
  };

  const triggerDecryption = () => {
    scrambleLine('AYODEJI', setLine1);
    scrambleLine('OGUNDIPE', setLine2);
  };

  // Trigger decryption effect on initial mount
  useEffect(() => {
    triggerDecryption();
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const options = {
        timeZone: 'Africa/Lagos',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      const formatted = new Intl.DateTimeFormat('en-US', options).format(new Date());
      setTimeString(formatted.toUpperCase());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative w-full z-20 pt-6 sm:pt-8 pb-4 px-4 sm:px-6 md:px-16 max-w-[1920px] mx-auto select-none">
      {/* Top Row */}
      <div className="flex flex-row justify-between items-center gap-4">
        {/* Decrypting Name Logo with Tightened Line-Height */}
        <div
          onMouseEnter={triggerDecryption}
          onClick={playClick}
          className="font-departure text-2xl sm:text-4xl md:text-5xl font-bold text-[#a8a8a8] tracking-wider hover:text-white transition-colors duration-300 cursor-pointer group leading-[0.85] md:leading-[0.85] space-y-0"
        >
          <p className="m-0 p-0 leading-[0.85] block">{line1}</p>
          <p className="m-0 p-0 leading-[0.85] block">{line2}</p>
        </div>

        {/* Social Links */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-1.5 sm:gap-4 md:gap-2 font-departure text-xs sm:text-sm md:text-base text-[#a8a8a8] text-right">
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            onClick={playClick}
            className="hover:text-white transition-colors duration-200"
          >
            X(TWITTER)
          </a>
          <a
            href="https://dribbble.com"
            target="_blank"
            rel="noreferrer"
            onClick={playClick}
            className="hover:text-white transition-colors duration-200"
          >
            DRIBBLE
          </a>
          <a
            href="mailto:ayodeji@example.com"
            onClick={playClick}
            className="hover:text-white transition-colors duration-200"
          >
            EMAIL
          </a>
        </div>
      </div>

      {/* Subheader Status Bar - Restored original desktop margin (md:mt-24) */}
      <div className="mt-10 sm:mt-16 md:mt-24 flex flex-col items-center justify-center gap-2 font-departure text-[11px] sm:text-xs md:text-sm text-[#a8a8a8]">
        {/* Row 1 */}
        <div className="flex justify-center items-center gap-2 sm:gap-6">
          <p className="w-[80px] sm:w-[102px] text-left text-[#eee] m-0">PR DCT</p>
          <p className="w-[80px] sm:w-[102px] text-center text-[#a8a8a8] whitespace-nowrap m-0">[MUSC LVR]</p>
          <p className="w-[80px] sm:w-[102px] text-right text-[#eee] m-0">D S GNER</p>
        </div>

        {/* Row 2 */}
        <div className="flex justify-center items-center gap-2 sm:gap-6">
          <p className="w-[80px] sm:w-[102px] text-left text-[#eee] whitespace-nowrap m-0">
            [{timeString || '10:07 AM'}]
          </p>
          <p className="w-[80px] sm:w-[102px] text-center text-[#a8a8a8] m-0">[LAGOS]</p>
          <div className="w-[80px] sm:w-[102px] flex items-center justify-end gap-1.5 text-[#eee]">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>OPEN</span>
          </div>
        </div>
      </div>
    </header>
  );
}

