import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FolderGit2 } from 'lucide-react';
import WorkImageCanvas from './WorkImageCanvas';
import TechnicalDrawingBackground from './TechnicalDrawingBackground';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    id: '01',
    title: 'Afkit.ng Commerce',
    category: 'E-Commerce & Digital Products',
    date: '2026',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-41483-large.mp4',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1400&auto=format&fit=crop',
    link: '#',
    description: 'Next-generation commerce platform built for high-scale digital & physical inventory.',
  },
  {
    id: '02',
    title: 'Fintech Dashboard',
    category: 'Financial Analytics & SaaS',
    date: '2025',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop',
    link: '#',
    description: 'Real-time financial telemetry dashboard with predictive portfolio intelligence.',
  },
  {
    id: '03',
    title: 'Aura Sound System',
    category: 'Audio & Spatial Experience',
    date: '2025',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-connection-dots-and-lines-41551-large.mp4',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1400&auto=format&fit=crop',
    link: '#',
    description: 'Spatial audio web engine rendering real-time acoustic environments.',
  },
  {
    id: '04',
    title: 'Neon Horizon OS',
    category: 'Cyberpunk Web Interface',
    date: '2024',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1400&auto=format&fit=crop',
    link: '#',
    description: 'Futuristic desktop shell interface with custom window compositor & node graph.',
  },
  {
    id: '05',
    title: 'Kinetic Motion Studio',
    category: '3D Shader & Physics Engine',
    date: '2024',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-tunnel-of-futuristic-neon-lights-41555-large.mp4',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1400&auto=format&fit=crop',
    link: '#',
    description: 'Experimental WebGL physics environment exploring procedural particle dynamics.',
  },
  {
    id: '06',
    title: 'Quantum Synthesizer',
    category: 'Interactive Audio & WebGL',
    date: '2024',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1400&auto=format&fit=crop',
    link: '#',
    description: 'Generative synthesizer interface translating user gestures into generative spatial sound.',
  },
];

const RANDOM_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|<>?';

export default function WorkSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [workTitle, setWorkTitle] = useState('WORK');

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
      className="relative w-full bg-[#181717] text-white py-24 sm:py-32 px-6 sm:px-10 md:px-16 z-10 overflow-hidden select-none"
    >
      {/* Background CAD Technical Grid Layer */}
      <TechnicalDrawingBackground />

      <div className="relative z-10 max-w-[1600px] mx-auto">
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
            <span>[ {String(PROJECTS.length).padStart(2, '0')} ARCHIVED PROJECTS ]</span>
          </div>
        </div>

        {/* 2-Column Equal Dimension Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-14 items-stretch">
          {PROJECTS.map((project, index) => {
            const isHovered = hoveredCard === project.id;

            return (
              <div
                key={project.id}
                ref={(el) => (cardsRef.current[index] = el)}
                onMouseEnter={() => setHoveredCard(project.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  transform: `skewY(${scrollVelocity * 1.6}deg) rotate(${scrollVelocity * 0.35}deg) translateY(${scrollVelocity * 1.8}px) scale(${isHovered ? 1.02 : 1.0})`,
                  transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease, box-shadow 0.4s ease',
                  transformOrigin: 'center center',
                }}
                className="group relative flex flex-col cursor-pointer"
              >
                {/* Equal Large Square Dimension Media Container */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl transition-all duration-500">
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

                  {/* Bottom CAD Title & Specs Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-5 sm:p-6 bg-gradient-to-t from-[#181717]/95 via-[#181717]/80 to-transparent backdrop-blur-[2px] transition-all duration-300">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <h3 className="font-pixel-custom text-xl sm:text-2xl md:text-3xl text-white group-hover:text-blue-400 transition-colors duration-300 tracking-wider">
                        {project.title}
                      </h3>
                      <span className="font-mono text-[10px] text-neutral-500 uppercase px-2 py-0.5 border border-neutral-800 rounded bg-neutral-900/60">
                        ARCHIVE_{project.id}
                      </span>
                    </div>
                    <p className="font-departure text-xs sm:text-sm text-[#a8a8a8] line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
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
