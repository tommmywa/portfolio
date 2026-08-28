import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X } from 'lucide-react';
import TechnicalDrawingBackground from './TechnicalDrawingBackground';
import { useSound } from '../hooks/useSound';
import { bookFlip3Sound } from '../sounds/book-flip-3';
import { click002Sound } from '../sounds/click-002';

gsap.registerPlugin(ScrollTrigger);

// USER LOCKED-IN CALIBRATION PARAMETERS
const PAPER_PARAMS = {
  paperWidth: 92,        // User locked-in paper width in %
  startTop: -21,         // User locked-in Start Top offset in %
  startRight: 3,         // User locked-in Start Right offset in %
  startRotate: -0.5,     // User locked-in Start Rotation in deg
  endY: 204,             // User locked-in End Y shift in px
  endX: -76,             // User locked-in End X shift in px
  endRotate: 9.63,       // User locked-in End Rotation in deg
};

export default function FolderHero() {
  const containerRef = useRef(null);
  const paperRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playBookFlip] = useSound(bookFlip3Sound);
  const [playClick] = useSound(click002Sound);

  const handleOpenModal = () => {
    playBookFlip();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    playClick();
    setIsModalOpen(false);
  };

  // GSAP ScrollTrigger Animation (Paper animates back into folder upright on scroll)
  useEffect(() => {
    const paper = paperRef.current;
    const container = containerRef.current;
    if (!paper || !container) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isMobile: '(max-width: 767px)',
        isDesktop: '(min-width: 768px)',
      },
      (context) => {
        const { isMobile } = context.conditions;
        // Scale displacement proportionally on mobile so paper stays inside folder pocket
        const scaleFactor = isMobile ? 0.42 : 1.0;

        gsap.fromTo(
          paper,
          { y: 0, x: 0, rotate: PAPER_PARAMS.startRotate, scale: 1 },
          {
            y: PAPER_PARAMS.endY * scaleFactor,
            x: PAPER_PARAMS.endX * scaleFactor,
            rotate: PAPER_PARAMS.endRotate,
            scale: 0.985,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: container,
              start: isMobile ? 'top 15%' : 'top 30%',
              end: isMobile ? 'bottom 10%' : 'bottom 20%',
              scrub: 0.1,
            },
          }
        );
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[28vh] sm:h-[36vh] md:h-[64vh] min-h-[200px] sm:min-h-[260px] md:min-h-[64vh] bg-[#181717] pt-2 sm:pt-6 md:pt-8 pb-0 flex flex-col items-center justify-start z-20 overflow-visible mb-[-240px] sm:mb-[-300px] md:mb-[-340px] px-4 sm:px-0"
    >
      {/* Architectural CAD Technical Illustration Background Layer */}
      <TechnicalDrawingBackground />

      {/* Interactive Folder Container - Restored to original desktop position (md:translate-y-[24%]) */}
      <div
        onClick={handleOpenModal}
        className="relative w-[92%] sm:w-[94%] md:w-full max-w-[440px] sm:max-w-[620px] md:max-w-[980px] aspect-[865/745] cursor-pointer group perspective-1000 select-none overflow-visible translate-y-[38%] sm:translate-y-[46%] md:translate-y-[24%] mx-auto"
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
            top: `${PAPER_PARAMS.startTop}%`,
            right: `${PAPER_PARAMS.startRight}%`,
            width: `${PAPER_PARAMS.paperWidth}%`,
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

      {/* FULL COVER LETTER MODAL WITH STANDALONE OUTSIDE CLOSE BUTTON */}
      {isModalOpen && (
        <div
          onClick={handleCloseModal}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-12 animate-fadeIn"
        >
          {/* OUTER WRAPPER CONTAINER: CLOSE BUTTON + PAPER SHEET */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl flex flex-col items-end gap-3 font-departure select-text my-auto"
          >
            {/* STANDALONE OUTSIDE CLOSE BUTTON - SITS 100% OUTSIDE ABOVE TOP RIGHT OF PAPER */}
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 rounded-full bg-[#181717] hover:bg-neutral-800 text-white border border-neutral-600 shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer z-50 flex items-center gap-2 text-xs font-bold tracking-wide"
              title="Close Cover Letter"
            >
              <span>CLOSE</span>
              <X className="w-4 h-4 text-amber-400" />
            </button>

            {/* PAPER SHEET MODAL BODY */}
            <div
              className="w-full max-h-[82vh] overflow-y-auto bg-[#FAF6F3] text-black p-5 sm:p-8 md:p-14 rounded-lg shadow-2xl border border-neutral-300/80 text-left"
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
