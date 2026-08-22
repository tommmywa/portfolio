import React, { useState, useEffect } from 'react';

export default function FooterSection() {
  const [timeString, setTimeString] = useState('');

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
    <footer className="relative w-full bg-[#1f1c1e] text-[#a8a8a8] pt-20 pb-12 overflow-hidden z-10 select-none border-t border-neutral-800">
      {/* Repeating Subheader Info Bar - Centrally aligned 3 columns of 102px each */}
      <div className="flex flex-col items-center justify-center gap-2.5 font-departure text-xs md:text-sm text-[#a8a8a8] mb-12">
        {/* Row 1 */}
        <div className="flex justify-center items-center gap-6">
          <p className="w-[102px] text-left text-[#eee] m-0">PR DCT</p>
          <p className="w-[102px] text-center text-[#a8a8a8] whitespace-nowrap m-0">[MUSC LVR]</p>
          <p className="w-[102px] text-right text-[#eee] m-0">D S GNER</p>
        </div>

        {/* Row 2 */}
        <div className="flex justify-center items-center gap-6">
          <p className="w-[102px] text-left text-[#eee] whitespace-nowrap m-0">
            [{timeString || '10:07 AM'}]
          </p>
          <p className="w-[102px] text-center text-[#a8a8a8] m-0">[LAGOS]</p>
          <div className="w-[102px] flex items-center justify-end gap-1.5 text-[#eee]">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>OPEN</span>
          </div>
        </div>
      </div>

      {/* Giant Pixel Marquee / Typography Title */}
      <div className="w-full overflow-hidden whitespace-nowrap opacity-90 my-8">
        <h1 className="font-pixel-custom text-[120px] sm:text-[180px] md:text-[260px] lg:text-[360px] leading-none text-[#333333] hover:text-[#555555] transition-colors duration-500 tracking-wider text-center select-none">
          AYODEJI
        </h1>
      </div>

      {/* Footer Bottom Bar */}
      <div className="max-w-[1920px] mx-auto px-6 md:px-16 pt-8 border-t border-neutral-800/60 flex flex-col md:flex-row justify-between items-center gap-4 font-departure text-xs text-neutral-400">
        <p>© 2026 AYODEJI OGUNDIPE. ALL RIGHTS RESERVED.</p>
        <p className="text-neutral-400">DESIGNED IN FIGMA • BUILT WITH VITE, THREE.JS & GSAP</p>
      </div>
    </footer>
  );
}
