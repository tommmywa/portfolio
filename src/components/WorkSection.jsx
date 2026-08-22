import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

const PROJECTS = [
  {
    id: '01',
    title: 'Afkit.ng Commerce',
    category: 'E-Commerce & Digital Products',
    year: '2026',
    description: 'Transforming multi-merchant e-commerce with seamless flow, intelligent search, and high-conversion UI design.',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop',
    tags: ['UI/UX', 'Design System', 'E-Commerce', 'Mobile App'],
    link: '#',
  },
  {
    id: '02',
    title: 'Fintech Dashboard',
    category: 'Admin & Financial Analytics',
    year: '2025',
    description: 'Scalable data visualization and transaction dashboard built for high-throughput enterprise management.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    tags: ['Dashboard', 'Data Viz', 'Fintech', 'SaaS'],
    link: '#',
  },
  {
    id: '03',
    title: 'Aura Sound System',
    category: 'Audio & Music Experience',
    year: '2025',
    description: 'Immersive sound design interface and spatial audio player for music purists.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop',
    tags: ['Web Audio', 'Experimental', '3D Graphics'],
    link: '#',
  },
];

export default function WorkSection() {
  const [activeTab, setActiveTab] = useState('WORK 01');
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0]);

  return (
    <section className="relative w-full py-24 px-6 md:px-16 max-w-[1920px] mx-auto z-10 select-none">
      {/* Big Title */}
      <h2 className="font-pixel-custom text-6xl md:text-8xl lg:text-9xl text-white tracking-widest mb-16">
        WORK
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Navigation Menu */}
        <div className="lg:col-span-3 font-departure text-base md:text-xl space-y-4 text-[#a8a8a8]">
          <button
            onClick={() => {
              setActiveTab('WORK 01');
              setSelectedProject(PROJECTS[0]);
            }}
            className={`flex items-center gap-2 w-full text-left transition-colors duration-200 ${
              activeTab === 'WORK 01' ? 'text-white font-bold' : 'hover:text-white'
            }`}
          >
            <span>{activeTab === 'WORK 01' ? '>> WORK 01' : '   WORK 01'}</span>
          </button>

          <a
            href="https://dribbble.com"
            target="_blank"
            rel="noreferrer"
            className="block text-[#a8a8a8] hover:text-white transition-colors duration-200 pl-6"
          >
            DRIBBLE
          </a>

          <a
            href="mailto:ayodeji@example.com"
            className="block text-[#a8a8a8] hover:text-white transition-colors duration-200 pl-6"
          >
            EMAIL
          </a>
        </div>

        {/* Main Work Showcase */}
        <div className="lg:col-span-9 space-y-12">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group relative glass-panel rounded-lg p-6 md:p-10 border border-neutral-800 hover:border-neutral-500 transition-all duration-500 cursor-pointer overflow-hidden"
            >
              {/* Background Glow on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/50 to-neutral-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                {/* Text Info */}
                <div className="md:col-span-6 space-y-4">
                  <div className="flex items-center justify-between text-xs font-departure text-neutral-400">
                    <span>// {project.id}</span>
                    <span>{project.year}</span>
                  </div>

                  <h3 className="font-pixel-custom text-2xl md:text-3xl text-white group-hover:text-amber-200 transition-colors duration-300 flex items-center gap-3">
                    {project.title}
                    <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-amber-300" />
                  </h3>

                  <p className="text-xs md:text-sm text-neutral-400 font-departure leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] md:text-xs font-departure px-2.5 py-1 rounded bg-neutral-800/80 text-neutral-300 border border-neutral-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project Image Preview - Clean image without hover zoom or filter */}
                <div className="md:col-span-6 overflow-hidden rounded-md border border-neutral-700/60 aspect-[16/10]">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
