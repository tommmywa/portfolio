import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Mail, Copy, Check, X, ExternalLink } from 'lucide-react';
import { useSound } from '../hooks/useSound';
import { click002Sound } from '../sounds/click-002';

const RANDOM_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|<>?';

export default function Header() {
  const [timeString, setTimeString] = useState('');
  const [playClick] = useSound(click002Sound);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
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

  // Lock background scroll and pause Lenis when email modal is open
  useEffect(() => {
    if (isEmailModalOpen) {
      if (window.lenis) window.lenis.stop();
      document.body.style.overflow = 'hidden';
    } else {
      if (window.lenis) window.lenis.start();
      document.body.style.overflow = '';
    }
    return () => {
      if (window.lenis) window.lenis.start();
      document.body.style.overflow = '';
    };
  }, [isEmailModalOpen]);

  // Handle ESC key to close email modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isEmailModalOpen) {
        setIsEmailModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEmailModalOpen]);

  const handleCopyEmail = () => {
    playClick();
    navigator.clipboard.writeText('ogundipeayodeji00@gmail.com').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const handleOpenEmailModal = (e) => {
    e.preventDefault();
    playClick();
    setIsEmailModalOpen(true);
  };

  const handleCloseEmailModal = () => {
    playClick();
    setIsEmailModalOpen(false);
  };

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
            href="https://x.com/anewhuman_"
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClick}
            className="hover:text-white transition-colors duration-200"
          >
            X(TWITTER)
          </a>
          <a
            href="https://dribbble.com/A_NewHuman"
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClick}
            className="hover:text-white transition-colors duration-200"
          >
            DRIBBLE
          </a>
          <button
            type="button"
            onClick={handleOpenEmailModal}
            className="hover:text-white transition-colors duration-200 cursor-pointer text-right bg-transparent border-0 p-0 font-departure"
          >
            EMAIL
          </button>
        </div>
      </div>

      {/* Interactive Email Dispatch CAD Popup Modal */}
      {isEmailModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={handleCloseEmailModal}
        >
          <div
            className="relative w-full max-w-lg bg-[#181717] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-left space-y-6 selection:bg-amber-300 selection:text-black"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CAD Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
              <div className="flex items-center gap-2 font-mono text-xs text-blue-400 uppercase tracking-widest">
                <Mail className="w-4 h-4" />
                <span>[ INITIATE COMMUNICATION // EMAIL ]</span>
              </div>
              <button
                type="button"
                onClick={handleCloseEmailModal}
                className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Recipient Details */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">
                DIRECT RECIPIENT ADDRESS
              </span>
              <div className="p-3.5 bg-neutral-950/80 border border-neutral-800 rounded-xl flex items-center justify-between gap-3">
                <span className="font-mono text-xs sm:text-sm text-neutral-200 select-all break-all">
                  ogundipeayodeji00@gmail.com
                </span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-[11px] font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Dispatch Actions */}
            <div className="space-y-3 pt-2">
              {/* Primary Native Mail App Composer */}
              <a
                href="mailto:ogundipeayodeji00@gmail.com?subject=Project%20Inquiry%20%2F%2F%20Ayodeji%20Ogundipe"
                onClick={playClick}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20"
              >
                <Mail className="w-4 h-4" />
                <span>COMPOSE IN DEFAULT MAIL APP</span>
              </a>

              {/* Secondary Webmail (Gmail) Direct Dispatch */}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=ogundipeayodeji00@gmail.com&su=Project%20Inquiry%20%2F%2F%20Ayodeji%20Ogundipe"
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClick}
                className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>OPEN IN GMAIL BROWSER</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
              </a>
            </div>

            {/* CAD Footer Telemetry */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60 font-mono text-[10px] text-neutral-600">
              <span>STATUS: DISPATCH CHANNEL OPEN</span>
              <span>ESC TO DISMISS</span>
            </div>
          </div>
        </div>,
        document.body
      )}

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

