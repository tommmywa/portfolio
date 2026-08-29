import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FolderGit2 } from 'lucide-react';
import WorkImageCanvas from './WorkImageCanvas';
import TechnicalDrawingBackground from './TechnicalDrawingBackground';
import { cmsStore } from '../lib/cms-store';

gsap.registerPlugin(ScrollTrigger);

const RANDOM_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|<>?';

export default function WorkSection({ onSelectProject }) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const [projects, setProjects] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [workTitle, setWorkTitle] = useState('WORK');

  useEffect(() => {
    setProjects(cmsStore.getProjects());
    const unsubscribe = cmsStore.subscribe((updated) => {
      setProjects(updated);
    });
    return () => unsubscribe();
  }, []);

  const scrambleWorkTitle = () => {
    const targetText = 'WORK';
    let iteration = 0;
    const interval = setInterval(() => {
      setWorkTitle(
        targetText
          .split('')
          .map((char, index) => {
            if (index < iteration) return targetText[index];
            return RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)];
          })
          .join('')
      );

      if (iteration >= targetText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 40);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let velocityTimeout;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const vel = (currentScrollY - lastScrollY) * 0.1;
      const clampedVel = Math.max(-2, Math.min(2, vel));
      setScrollVelocity(clampedVel);
      lastScrollY = currentScrollY;

      clearTimeout(velocityTimeout);
      velocityTimeout = setTimeout(() => {
        setScrollVelocity(0);
      }, 80);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // GSAP ScrollTrigger Entrance & Decryption Animation
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        ScrollTrigger.create({
          trigger: titleRef.current,
          start: 'top 85%',
          onEnter: scrambleWorkTitle,
        });
      }

      cardsRef.current.forEach((card) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(velocityTimeout);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work-section"
      className="relative w-full bg-[#181717] text-white py-20 sm:py-28 px-3 sm:px-5 md:px-6 lg:px-8 z-10 overflow-hidden select-none"
    >
      {/* Background CAD Technical Grid Layer */}
      <TechnicalDrawingBackground />

      <div className="relative z-10 w-full max-w-[1920px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-20 pb-8 border-b border-neutral-800">
          <div>
            <h2
              ref={titleRef}
              onMouseEnter={scrambleWorkTitle}
              className="font-pixel-custom text-5xl sm:text-7xl md:text-8xl lg:text-[96px] text-white tracking-widest leading-none drop-shadow-[0_4px_24px_rgba(255,255,255,0.08)] cursor-pointer hover:text-[#a8a8a8] transition-colors duration-300"
            >
              {workTitle}
            </h2>
          </div>

          <div className="font-departure text-xs text-neutral-400 tracking-widest flex items-center gap-3">
            <FolderGit2 className="w-4 h-4 text-[#a8a8a8]" />
            <span>[ {String(projects.length).padStart(2, '0')} ARCHIVED PROJECTS ]</span>
          </div>
        </div>

        {/* 2-Column Equal Dimension Grid Layout - Tightened gap for bigger cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-7 lg:gap-8 items-stretch">
          {projects.map((project, index) => {
            const isHovered = hoveredCard === project.id;
            const ratioMap = {
              '16/9': 'aspect-[16/9]',
              '1/1': 'aspect-square',
              '4/5': 'aspect-[4/5]',
              '21/9': 'aspect-[21/9]',
            };
            const aspectClass = ratioMap[project.aspectRatio] || 'aspect-[16/9]';

            return (
              <div
                key={project.id}
                ref={(el) => (cardsRef.current[index] = el)}
                onClick={() => onSelectProject && onSelectProject(project.id)}
                onMouseEnter={() => setHoveredCard(project.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  transform: `skewY(${scrollVelocity * 0.4}deg) rotate(${scrollVelocity * 0.08}deg) translateY(${scrollVelocity * 0.4}px) scale(${isHovered ? 1.015 : 1.0})`,
                  transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease, box-shadow 0.4s ease',
                  transformOrigin: 'center center',
                }}
                className="group relative flex flex-col cursor-pointer"
              >
                {/* 16:9 Landscape Aspect Ratio Media Container */}
                <div className={`relative w-full ${aspectClass} rounded-sm overflow-hidden shadow-2xl transition-all duration-500`}>
                  {/* WebGL Warp Canvas */}
                  <WorkImageCanvas
                    imageUrl={project.image}
                    videoUrl={project.video}
                    velocity={scrollVelocity}
                    isHovered={isHovered}
                  />

                  {/* Top Bar CAD Telemetry Overlay inside Card */}
                  <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none font-mono text-[10px] sm:text-xs text-neutral-300 tracking-widest uppercase bg-neutral-950/75 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-neutral-800/80">
                    <span className="text-blue-400 font-bold">[ {project.id} ]</span>
                    <span className="truncate max-w-[180px] sm:max-w-none text-neutral-400">{project.category}</span>
                    <span className="text-neutral-500 hidden sm:inline">[ {project.date} ]</span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
