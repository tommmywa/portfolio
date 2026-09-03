import React, { useEffect, useState } from 'react';
import { ArrowLeft, ShieldCheck, User, Layers, Calendar, ArrowRight } from 'lucide-react';
import TechnicalDrawingBackground from './TechnicalDrawingBackground';
import { assetDB, isVideoMedia } from '../lib/asset-db';

export default function ProjectDetailPage({ project, allProjects = [], onBack, onSelectProject }) {
  const [resolvedImage, setResolvedImage] = useState(project?.image || '');
  const [resolvedVideo, setResolvedVideo] = useState(project?.video || '');
  const [resolvedGallery, setResolvedGallery] = useState([]);

  // Scroll to top on mount or when project changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [project?.id]);

  // Keyboard shortcut (ESC) to return to main archive
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  // Resolve IndexedDB assets for hero and gallery
  useEffect(() => {
    let isMounted = true;
    if (project?.image) {
      assetDB.getAssetUrl(project.image).then((url) => {
        if (isMounted) setResolvedImage(url || project.image);
      });
    }
    if (project?.video) {
      assetDB.getAssetUrl(project.video).then((url) => {
        if (isMounted) setResolvedVideo(url || project.video);
      });
    }

    // Resolve gallery items if provided
    if (Array.isArray(project?.gallery) && project.gallery.length > 0) {
      Promise.all(project.gallery.map((g) => assetDB.getAssetUrl(g))).then((urls) => {
        if (isMounted) setResolvedGallery(urls);
      });
    } else {
      if (isMounted) setResolvedGallery([]);
    }

    return () => {
      isMounted = false;
    };
  }, [project?.id, project?.image, project?.video, project?.gallery]);

  if (!project) return null;

  const activeImg = resolvedImage || project.image;
  const activeVid = resolvedVideo || project.video;

  // Find next project in array
  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const nextProject =
    allProjects.length > 0
      ? allProjects[(currentIndex + 1) % allProjects.length]
      : null;


  // Default gallery fallback images if custom gallery is not specified
  const galleryItems =
    resolvedGallery.length > 0
      ? resolvedGallery
      : [
          activeImg || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1400&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1400&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1400&auto=format&fit=crop',
        ];

  return (
    <div className="relative min-h-screen bg-[#181717] text-white flex flex-col justify-between font-departure select-none overflow-x-hidden animate-fadeIn">
      {/* Background CAD Technical Grid Layer */}
      <TechnicalDrawingBackground />

      <div className="relative z-10 max-w-[1648px] w-full mx-auto px-6 sm:px-12 md:px-16 pt-12 sm:pt-16 pb-24 flex flex-col gap-12 sm:gap-16">
        {/* Top Header Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-departure text-sm md:text-base text-[#a8a8a8]">
          <button
            onClick={onBack}
            className="group flex items-center gap-3 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 text-left"
          >
            <ArrowLeft className="w-5 h-5 text-[#a8a8a8] group-hover:text-white transition-colors" />
            <span>GO BACK HOME [or press ESC]</span>
          </button>

          <div className="flex items-center gap-2 text-right">
            <span className="text-[#3d75d1] font-bold">[ ID: {project.id} ]</span>
            <span className="text-[#a8a8a8] uppercase">{project.title}</span>
            <span className="text-[#a8a8a8]">[{project.date}]</span>
          </div>
        </div>


        {/* Project Metadata & Case Study Breakdown Cards (Positioned at Top with CAD Line Connector) */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Metadata Sidebar */}
          <div className="lg:col-span-4 bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-6 font-mono text-xs">
            <div>
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest block mb-1">
                PROJECT METADATA
              </span>
              <h3 className="font-pixel-custom text-2xl text-white tracking-wide leading-tight">
                {project.title}
              </h3>
            </div>

            <div className="space-y-5 pt-4 border-t border-neutral-800/80">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest block mb-2">
                    CLIENT
                  </span>
                  <span className="text-neutral-200">{project.client || 'Internal Project'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest block mb-2">
                    ROLE & RESPONSIBILITY
                  </span>
                  <span className="text-neutral-200">
                    {project.role || 'Lead Product & Systems Designer'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest block mb-2">
                    TIMELINE / YEAR
                  </span>
                  <span className="text-neutral-200">{project.date}</span>
                </div>
              </div>
            </div>


          </div>

          {/* Right Case Study Breakdown (With 52px Connector Lines Aligned to its Exact Middle) */}
          <div className="relative lg:col-span-8 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-6">
            {/* Dual Parallel CAD Connector Lines with Terminal Node Circles */}
            <div className="hidden lg:flex flex-col gap-[52px] absolute -left-[32px] w-[32px] top-1/2 -translate-y-1/2 z-20 items-center justify-center pointer-events-none">
              <div className="w-full h-[1px] bg-neutral-800 relative flex items-center justify-between">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-800 border border-neutral-700 -ml-1 shrink-0"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-800 border border-neutral-700 -mr-1 shrink-0"></span>
              </div>
              <div className="w-full h-[1px] bg-neutral-800 relative flex items-center justify-between">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-800 border border-neutral-700 -ml-1 shrink-0"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-800 border border-neutral-700 -mr-1 shrink-0"></span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-xs text-blue-400 uppercase tracking-widest">
                <Layers className="w-4 h-4" />
                <span>[ OVERVIEW & SUMMARY ]</span>
              </div>
              <p className="font-departure text-base sm:text-lg text-neutral-200 leading-relaxed">
                {project.description}
              </p>
            </div>

            {project.longDescription && project.longDescription.trim() !== '' && (
              <div className="pt-6 border-t border-neutral-800/80 space-y-3">
                <div className="font-mono text-xs text-neutral-400 uppercase tracking-widest mb-1">
                  [ CASE STUDY & DESIGN RATIONALE ]
                </div>
                <div className="font-departure text-sm sm:text-base text-neutral-400 leading-relaxed whitespace-pre-wrap space-y-3">
                  {project.longDescription}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Project Media Showcase (Figma Node 512:164 Layout) */}
        <div className="flex flex-col gap-8 sm:gap-10 w-full pt-4">
          {/* Main Full-Width Hero Media Frame (Strict 16:9 Landscape Aspect Ratio with object-contain fit) */}
          <div className="relative w-full aspect-[16/9] rounded-sm overflow-hidden bg-[#181717] border border-neutral-800/80 shadow-2xl flex items-center justify-center">
            {activeVid ? (
              <video
                src={activeVid}
                muted
                loop
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            ) : activeImg ? (
              <img
                src={activeImg}
                alt={project.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-600 text-sm">
                [ MAIN SHOWCASE ASSET ]
              </div>
            )}
          </div>

          {/* 2-Column Gallery Grid (Pictures or Looping Videos) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 w-full">
            {galleryItems.slice(0, 4).map((item, idx) => {
              const isVid = isVideoMedia(item);
              return (
                <div
                  key={idx}
                  className="relative w-full aspect-square rounded-sm overflow-hidden bg-[#222222] border border-neutral-800/80 shadow-xl"
                >
                  {isVid ? (
                    <video
                      src={item}
                      muted
                      loop
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={item}
                      alt={`${project.title} Asset ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Project Footer Navigator */}
        {nextProject && (
          <div className="mt-8 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 font-mono">
            <div className="text-xs text-neutral-500 uppercase tracking-widest">
              [ NEXT ARCHIVED WORK ]
            </div>

            <div
              onClick={() => onSelectProject(nextProject.id)}
              className="group bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-blue-500/50 rounded-2xl p-5 cursor-pointer transition-all duration-300 flex items-center justify-between gap-6 max-w-xl w-full"
            >
              <div>
                <span className="text-[10px] text-blue-400 block mb-1">
                  NEXT PROJECT → {nextProject.id}
                </span>
                <h4 className="font-pixel-custom text-xl text-white group-hover:text-blue-400 transition-colors">
                  {nextProject.title}
                </h4>
                <p className="text-xs text-neutral-400 truncate mt-0.5">{nextProject.category}</p>
              </div>

              <div className="p-3 rounded-full bg-neutral-800 group-hover:bg-blue-600 text-white transition-colors">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
