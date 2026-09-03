import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import BackgroundShader from './components/BackgroundShader';
import NoiseOverlay from './components/NoiseOverlay';
import Preloader from './components/Preloader';
import Header from './components/Header';
import FolderHero from './components/FolderHero';
import NotesSection from './components/NotesSection';
import WorkSection from './components/WorkSection';
import FooterSection from './components/FooterSection';
import ProjectDetailPage from './components/ProjectDetailPage';

import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import { cmsStore } from './lib/cms-store';
import { supabase, isSupabaseConfigured } from './lib/supabase';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isAdminView, setIsAdminView] = useState(
    window.location.pathname === '/admin' || window.location.search.includes('admin')
  );
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(isSupabaseConfigured());
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projects, setProjects] = useState([]);

  // true = user came back from a project detail page, so skip the preloader
  const [skipPreloader, setSkipPreloader] = useState(false);

  const handleOpenProject = (id) => {
    // Mark that the next return to home should bypass the preloader
    setSkipPreloader(true);
    setSelectedProjectId(id);
  };

  const handleBackFromProject = () => {
    // skipPreloader stays true — Preloader will receive skip=true and render null
    setSelectedProjectId(null);
  };

  useEffect(() => {
    setProjects(cmsStore.getProjects());
    const unsubscribe = cmsStore.subscribe((updated) => {
      setProjects(updated);
    });
    return () => unsubscribe();
  }, []);

  // Keyboard shortcut (Ctrl + Shift + A) to toggle Admin Portal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminView((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isAdminView || selectedProjectId) return;

    // Initialize Lenis smooth scroll for main public archive view
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    window.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, [isAdminView, selectedProjectId]);

  // Synchronize Supabase Auth Session
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      setAuthChecking(false);
      return;
    }

    // 1. Initial session check on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAdminUser(session.user);
        setIsAdminAuthenticated(true);
      } else {
        setAdminUser(null);
        setIsAdminAuthenticated(false);
      }
      setAuthChecking(false);
    }).catch(() => {
      setAuthChecking(false);
    });

    // 2. Real-time auth state subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAdminUser(session.user);
        setIsAdminAuthenticated(true);
      } else {
        setAdminUser(null);
        setIsAdminAuthenticated(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Admin View
  if (isAdminView) {
    if (authChecking) {
      return (
        <div className="min-h-screen bg-[#181717] text-white flex items-center justify-center font-mono text-xs p-4 select-none">
          <div className="flex items-center gap-3 p-4 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-neutral-300 uppercase tracking-widest">[ VERIFYING CAD SECURITY SESSION... ]</span>
          </div>
        </div>
      );
    }

    if (!isAdminAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={(user) => {
            setAdminUser(user);
            setIsAdminAuthenticated(true);
          }}
          onBackToPortfolio={() => {
            window.history.pushState({}, '', '/');
            setIsAdminView(false);
          }}
        />
      );
    }
    return (
      <AdminDashboard
        user={adminUser}
        onLogout={async () => {
          if (isSupabaseConfigured() && supabase) {
            await supabase.auth.signOut();
          }
          setAdminUser(null);
          setIsAdminAuthenticated(false);
        }}
      />
    );
  }

  // Selected Project Detail Page View
  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  if (selectedProject) {
    return (
      <div className="relative min-h-screen bg-[#181717] text-[#eeeeee] overflow-x-hidden selection:bg-amber-300 selection:text-black">
        <BackgroundShader />
        <NoiseOverlay />
        <ProjectDetailPage
          project={selectedProject}
          allProjects={projects}
          onBack={handleBackFromProject}
          onSelectProject={handleOpenProject}
        />
        <FooterSection />
      </div>
    );
  }

  // Main Portfolio Archive View
  return (
    <div className="relative min-h-screen bg-[#181717] text-[#eeeeee] overflow-x-hidden selection:bg-amber-300 selection:text-black">
      {/*
        Preloader is always mounted here but receives skip=true when the user
        came back from a project detail page — in that case Preloader renders null
        immediately without registering any event listeners.
      */}
      <Preloader skip={skipPreloader} />

      {/* WebGL Background Shader Layer */}
      <BackgroundShader />

      {/* Whole-Website WebGL Animated Film Grain Noise Overlay */}
      <NoiseOverlay />

      {/* Main Content Layout */}
      <div className="relative z-10">
        <Header />
        <main>
          <FolderHero />
          <NotesSection />
          <WorkSection onSelectProject={handleOpenProject} />
        </main>
        <FooterSection />
      </div>
    </div>
  );
}
