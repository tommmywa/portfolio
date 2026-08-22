import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, Sliders, Lock, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function FolderHero() {
  const containerRef = useRef(null);
  const paperRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTuningOpen, setIsTuningOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // USER LOCKED-IN CALIBRATION PARAMETERS
  const [params, setParams] = useState({
    paperWidth: 92,        // User locked-in paper width in %
    startTop: -21,         // User locked-in Start Top offset in %
    startRight: 3,         // User locked-in Start Right offset in %
    startRotate: -0.5,     // User locked-in Start Rotation in deg
    endY: 204,             // User locked-in End Y shift in px
    endX: -76,             // User locked-in End X shift in px
    endRotate: 9.63,       // User locked-in End Rotation in deg
    mode: 'scroll',        // 'scroll' | 'start' | 'end'
  });

  // Handle parameter changes
  const updateParam = (key, val) => {
    setParams((prev) => ({ ...prev, [key]: parseFloat(val) || 0 }));
  };

  // GSAP ScrollTrigger Animation or Preview Modes
  useEffect(() => {
    const paper = paperRef.current;
    const container = containerRef.current;
    if (!paper || !container) return;

    if (params.mode === 'start') {
      gsap.killTweensOf(paper);
      gsap.set(paper, { y: 0, x: 0, rotate: params.startRotate, scale: 1 });
      return;
    }

    if (params.mode === 'end') {
      gsap.killTweensOf(paper);
      gsap.set(paper, { y: params.endY, x: params.endX, rotate: params.endRotate, scale: 0.985 });
      return;
    }

    // Scroll Mode
    const ctx = gsap.context(() => {
      gsap.fromTo(
        paper,
        { y: 0, x: 0, rotate: params.startRotate, scale: 1 },
        {
          y: params.endY,
          x: params.endX,
          rotate: params.endRotate,
          scale: 0.985,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: container,
            start: 'top 25%',
            end: 'bottom 15%',
            scrub: 0.8,
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, [params]);

  // Copy locked values to clipboard
  const handleLockValues = () => {
    const codeSnippet = JSON.stringify(params, null, 2);
    navigator.clipboard?.writeText?.(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    console.log('LOCKED PAPER PARAMETERS:', params);
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[64vh] min-h-[64vh] bg-[#181717] pt-8 pb-0 flex flex-col items-center justify-start z-20 overflow-visible mb-[-220px] md:mb-[-340px]"
    >
      {/* Interactive Folder Container */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="relative w-full max-w-[980px] aspect-[865/745] cursor-pointer group perspective-1000 select-none overflow-visible translate-y-[20%] md:translate-y-[24%]"
      >
        {/* FOLDER BACK */}
        <div className="absolute inset-0 z-0 flex items-end justify-end">
          <img
            src="/assets/folder_back.svg"
            alt="Folder Back"
            className="w-full h-auto object-contain object-bottom-right filter drop-shadow-2xl"
          />
        </div>

        {/* WHITE PAPER ASSET - Click to open modal */}
        <div
          ref={paperRef}
          className="absolute z-10 filter drop-shadow-2xl origin-bottom-right"
          style={{
            top: `${params.startTop}%`,
            right: `${params.startRight}%`,
            width: `${params.paperWidth}%`,
          }}
        >
          <img
            src="/assets/White PAPER.svg"
            alt="White Cover Letter Paper"
            className="w-full h-auto object-contain pointer-events-none"
          />
        </div>

        {/* FOLDER FRONT */}
        <div className="absolute bottom-[-9px] right-[-14px] w-[99.6%] h-[56.2%] z-20 pointer-events-none flex items-end justify-end">
          <img
            src="/assets/folder_front.svg"
            alt="Folder Front"
            className="w-full h-full object-contain object-bottom-right"
          />
        </div>
      </div>

      {/* TEMPORARY CALIBRATION / TUNING TOOL PANEL */}
      <div className="fixed bottom-6 left-6 z-50 font-departure">
        {isTuningOpen ? (
          <div className="bg-[#121212]/95 text-white border border-amber-500/40 rounded-xl p-5 shadow-2xl backdrop-blur-md w-[320px] sm:w-[360px] text-xs space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-700 pb-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Sliders className="w-4 h-4" />
                <span>PAPER POSITION CALIBRATOR</span>
              </div>
              <button
                onClick={() => setIsTuningOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Selector */}
            <div className="space-y-1">
              <label className="text-[10px] text-neutral-400 uppercase tracking-wider">Preview Mode</label>
              <div className="grid grid-cols-3 gap-1 bg-neutral-900 p-1 rounded-md border border-neutral-800">
                {['scroll', 'start', 'end'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setParams((p) => ({ ...p, mode: m }))}
                    className={`py-1.5 rounded text-[11px] font-bold uppercase transition-colors ${
                      params.mode === m ? 'bg-amber-500 text-black' : 'text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Paper Size Control */}
            <div className="space-y-1 pt-1 border-t border-neutral-800">
              <div className="flex justify-between text-neutral-300 font-semibold">
                <span>PAPER SIZE (WIDTH)</span>
                <span className="text-amber-400">{params.paperWidth}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="130"
                step="1"
                value={params.paperWidth}
                onChange={(e) => updateParam('paperWidth', e.target.value)}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Start Position Controls */}
            <div className="space-y-2 pt-1 border-t border-neutral-800">
              <span className="text-[10px] text-amber-300/80 font-bold uppercase tracking-wider">1. Start Position (Top/Right)</span>

              <div className="space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>Start Top Offset</span>
                  <span className="text-amber-400">{params.startTop}%</span>
                </div>
                <input
                  type="range"
                  min="-40"
                  max="10"
                  step="1"
                  value={params.startTop}
                  onChange={(e) => updateParam('startTop', e.target.value)}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>Start Right Offset</span>
                  <span className="text-amber-400">{params.startRight}%</span>
                </div>
                <input
                  type="range"
                  min="-25"
                  max="20"
                  step="1"
                  value={params.startRight}
                  onChange={(e) => updateParam('startRight', e.target.value)}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>Start Rotation</span>
                  <span className="text-amber-400">{params.startRotate}°</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  step="0.5"
                  value={params.startRotate}
                  onChange={(e) => updateParam('startRotate', e.target.value)}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* End Position Controls */}
            <div className="space-y-2 pt-1 border-t border-neutral-800">
              <span className="text-[10px] text-amber-300/80 font-bold uppercase tracking-wider">2. End Position (Scrolled)</span>

              <div className="space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>End Y Shift</span>
                  <span className="text-amber-400">{params.endY}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="350"
                  step="2"
                  value={params.endY}
                  onChange={(e) => updateParam('endY', e.target.value)}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>End X Shift</span>
                  <span className="text-amber-400">{params.endX}px</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="2"
                  value={params.endX}
                  onChange={(e) => updateParam('endX', e.target.value)}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>End Rotation</span>
                  <span className="text-amber-400">{params.endRotate}°</span>
                </div>
                <input
                  type="range"
                  min="-15"
                  max="25"
                  step="0.5"
                  value={params.endRotate}
                  onChange={(e) => updateParam('endRotate', e.target.value)}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Lock In Values Button */}
            <button
              onClick={handleLockValues}
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg mt-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span>{copied ? 'LOCKED IN!' : 'LOCK IN VALUES'}</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsTuningOpen(true)}
            className="bg-amber-500/90 hover:bg-amber-400 text-black px-3.5 py-2 rounded-full font-bold text-xs shadow-2xl flex items-center gap-2 border border-amber-300 backdrop-blur-md"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>PAPER CALIBRATOR</span>
          </button>
        )}
      </div>

      {/* FULL COVER LETTER MODAL WITH STANDALONE OUTSIDE CLOSE BUTTON */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-12 animate-fadeIn"
        >
          {/* OUTER WRAPPER CONTAINER: CLOSE BUTTON + PAPER SHEET */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl flex flex-col items-end gap-3 font-departure select-text my-auto"
          >
            {/* STANDALONE OUTSIDE CLOSE BUTTON - SITS 100% OUTSIDE ABOVE TOP RIGHT OF PAPER */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-full bg-[#181717] hover:bg-neutral-800 text-white border border-neutral-600 shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer z-50 flex items-center gap-2 text-xs font-bold tracking-wide"
              title="Close Cover Letter"
            >
              <span>CLOSE</span>
              <X className="w-4 h-4 text-amber-400" />
            </button>

            {/* PAPER SHEET MODAL BODY */}
            <div
              className="w-full max-h-[78vh] overflow-y-auto bg-[#FAF6F3] text-black p-8 md:p-14 rounded-lg shadow-2xl border border-neutral-300/80 text-left"
              style={{
                backgroundImage: 'radial-gradient(rgba(0,0,0,0.03) 1px, transparent 0)',
                backgroundSize: '16px 16px',
              }}
            >
              {/* PAPER HEADER BADGE */}
              <div className="border-b border-neutral-300 pb-5 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold font-departure text-neutral-900 tracking-tight">
                    COVER LETTER // AYODEJI OGUNDIPE
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1 font-departure">
                    Ref: <span className="text-[#c9182e] font-semibold">dsgnr-001</span> • Status: Available for Hire
                  </p>
                </div>

                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-xs font-semibold">
                  ● OPEN TO ROLES
                </span>
              </div>

              {/* FULL COVER LETTER CONTENT */}
              <div className="font-departure text-xs md:text-sm leading-relaxed space-y-5 text-neutral-800">
                <p className="font-bold text-sm md:text-base text-black">Dear Hiring Manager,</p>

                <p>
                  I am writing to express my interest in the Product Designer / UI/UX Designer position at your{' '}
                  <span className="line-through decoration-neutral-500 highlighter-yellow">
                    organization
                  </span>
                  . With over five years of experience in UI/UX design, product design, and visual design, I have developed a strong ability to transform complex business requirements into intuitive, scalable, and visually engaging digital experiences.
                </p>

                <p>
                  In my current role as a UI/UX Designer at{' '}
                  <span className="highlighter-green font-semibold">Afkit.ng</span>, I work across web and mobile products, e-commerce platforms, admin dashboards, and digital products. My responsibilities span the product design process—from understanding user and business requirements, defining user flows and information architecture, and creating wireframes to developing high-fidelity interfaces and design systems.
                </p>

                <p>
                  Every pixel is a choice. Every interaction is a promise. Every product tells users what matters.
                </p>

                <p>
                  I thrive in cross-functional team environments, collaborating closely with engineers, product managers, and executive stakeholders to ship scalable digital products that drive real user value and key business metrics.
                </p>

                {/* FOOTER SIGNATURE */}
                <div className="pt-8 border-t border-neutral-300/80 flex justify-between items-center mt-8">
                  <div>
                    <p className="font-bold text-black text-sm md:text-base">Ayodeji Ogundipe</p>
                    <p className="text-xs text-neutral-600">Product Designer • Lagos, Nigeria</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">ayodeji@example.com</p>
                  </div>
                  <div className="text-right">
                    <span className="font-handwriting text-2xl md:text-3xl text-neutral-700 block">
                      A. Ogundipe
                    </span>
                    <span className="text-[10px] text-neutral-400 tracking-widest uppercase">Official Signature</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
