import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  LogOut,
  ArrowUp,
  ArrowDown,
  Layers,
  Image as ImageIcon,
  Tag,
} from 'lucide-react';
import { cmsStore } from '../../lib/cms-store';
import { assetDB } from '../../lib/asset-db';
import AdminProjectEditor from './AdminProjectEditor';
import TechnicalDrawingBackground from '../TechnicalDrawingBackground';

function AdminProjectCard({ project, index, totalCount, onEdit, onDelete, onMove }) {
  const [resolvedImg, setResolvedImg] = useState(project.image);
  const [resolvedVid, setResolvedVid] = useState(project.video);

  useEffect(() => {
    let isMounted = true;
    assetDB.getAssetUrl(project.image).then((url) => {
      if (isMounted) setResolvedImg(url || project.image);
    });
    assetDB.getAssetUrl(project.video).then((url) => {
      if (isMounted) setResolvedVid(url || project.video);
    });
    return () => {
      isMounted = false;
    };
  }, [project.image, project.video]);

  const tagsList = Array.isArray(project.tags)
    ? project.tags
    : typeof project.tags === 'string' && project.tags.length > 0
    ? project.tags.split(',').map((t) => t.trim())
    : [];

  const galleryCount = Array.isArray(project.gallery) ? project.gallery.length : 0;

  return (
    <div className="group bg-neutral-900/90 border border-neutral-800 hover:border-blue-500/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all duration-300 font-mono text-xs hover:shadow-blue-500/5">
      <div>
        {/* Media Thumbnail Container */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 mb-4 flex items-center justify-center">
          {resolvedVid ? (
            <video
              src={resolvedVid}
              muted
              loop
              autoPlay
              playsInline
              className="w-full h-full object-cover pointer-events-none"
            />
          ) : (
            <img
              src={resolvedImg}
              alt={project.title}
              className="w-full h-full object-cover pointer-events-none"
            />
          )}

          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-neutral-950/80 border border-neutral-800 text-[10px] text-blue-400 font-bold backdrop-blur-sm">
            [ ID: {project.id} ]
          </div>
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-neutral-950/80 border border-neutral-800 text-[10px] text-neutral-300 uppercase backdrop-blur-sm">
            {project.video ? 'VIDEO + IMG' : 'IMAGE'}
          </div>

          {galleryCount > 0 && (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-neutral-950/80 border border-neutral-800 text-[9px] text-amber-400 backdrop-blur-sm flex items-center gap-1">
              <ImageIcon className="w-2.5 h-2.5" />
              <span>{galleryCount} GALLERY SHOTS</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="font-pixel-custom text-lg text-white group-hover:text-blue-400 transition-colors truncate">
            {project.title}
          </h3>
          <span className="text-[10px] text-neutral-400 border border-neutral-800 px-2 py-0.5 rounded bg-neutral-950">
            {project.date}
          </span>
        </div>

        <p className="text-[11px] text-blue-400 truncate mb-1">
          {project.client ? `[ ${project.client} ]` : `[ ${project.category} ]`}
        </p>

        <p className="text-neutral-400 line-clamp-2 text-[11px] leading-relaxed mb-3 font-sans">
          {project.description}
        </p>

        {/* Tags */}
        {tagsList.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tagsList.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded bg-neutral-950 border border-neutral-800/80 text-[9px] text-neutral-400"
              >
                {tag}
              </span>
            ))}
            {tagsList.length > 3 && (
              <span className="px-1.5 py-0.5 rounded bg-neutral-950 text-[9px] text-neutral-500">
                +{tagsList.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions Footer */}
      <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMove(index, -1)}
            disabled={index === 0}
            className="p-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-400 disabled:opacity-30 cursor-pointer transition-colors"
            title="Move Up in Order"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onMove(index, 1)}
            disabled={index === totalCount - 1}
            className="p-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-400 disabled:opacity-30 cursor-pointer transition-colors"
            title="Move Down in Order"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(project)}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-blue-600 hover:text-white text-neutral-300 transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>EDIT</span>
          </button>

          <button
            onClick={() => onDelete(project.id)}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-red-600 hover:text-white text-neutral-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>DELETE</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard({ onLogout }) {
  const [projects, setProjects] = useState([]);
  const [currentView, setCurrentView] = useState('list'); // 'list' | 'editor'
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    setProjects(cmsStore.getProjects());
    const unsubscribe = cmsStore.subscribe((updated) => {
      setProjects(updated);
    });
    return () => unsubscribe();
  }, []);

  const handleAddProject = () => {
    setEditingProject(null);
    setCurrentView('editor');
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setCurrentView('editor');
  };

  const handleDeleteProject = (id) => {
    if (window.confirm(`Are you sure you want to delete project [ID: ${id}]?`)) {
      cmsStore.deleteProject(id);
    }
  };

  const handleSaveProject = (projectData) => {
    cmsStore.saveProject(projectData);
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const updated = [...projects];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    cmsStore.saveProjects(updated);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all projects back to original default catalog?')) {
      cmsStore.resetToDefaults();
    }
  };

  // If in dedicated full-page editor view
  if (currentView === 'editor') {
    return (
      <AdminProjectEditor
        project={editingProject}
        allProjects={projects}
        onSave={handleSaveProject}
        onBack={() => setCurrentView('list')}
      />
    );
  }

  // Catalog List View
  return (
    <div className="relative min-h-screen bg-[#181717] text-white flex flex-col p-4 sm:p-8 md:p-10 select-none font-mono">
      <TechnicalDrawingBackground />

      <div className="relative z-10 max-w-[1440px] w-full mx-auto flex flex-col gap-8">
        {/* Top Navbar Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              <h1 className="font-pixel-custom text-2xl sm:text-3xl text-white tracking-wide">
                CAD ADMIN CMS
              </h1>
            </div>
            <p className="font-mono text-xs text-neutral-400 uppercase tracking-widest mt-1">
              [ MANAGE WORK ASSETS, METADATA & DETAIL GALLERIES ]
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <a
              href="/"
              className="px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 transition-colors flex items-center gap-2"
            >
              <span>VIEW PORTFOLIO</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onLogout}
              className="px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900/80 hover:bg-red-500/20 text-neutral-300 hover:text-red-400 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-neutral-900/80 border border-neutral-800 p-4 sm:p-5 rounded-2xl backdrop-blur-md shadow-xl">
          <div className="font-mono text-xs text-neutral-400 tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>[ ACTIVE WORKS CATALOG: {String(projects.length).padStart(2, '0')} PROJECTS ]</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs w-full sm:w-auto">
            <button
              onClick={handleResetDefaults}
              className="px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 hover:bg-neutral-800 text-neutral-400 transition-colors flex items-center gap-2 cursor-pointer"
              title="Reset Catalog to Defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">RESET DEFAULTS</span>
            </button>

            <button
              onClick={handleAddProject}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-blue-600/30 flex items-center gap-2 ml-auto"
            >
              <Plus className="w-4 h-4" />
              <span>ADD NEW PROJECT</span>
            </button>
          </div>
        </div>

        {/* Projects Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <AdminProjectCard
              key={project.id}
              project={project}
              index={index}
              totalCount={projects.length}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
              onMove={handleMove}
            />
          ))}
        </div>

        {/* Bottom Quick Add Card */}
        <div
          onClick={handleAddProject}
          className="w-full border-2 border-dashed border-neutral-800 hover:border-blue-500/60 bg-neutral-900/30 hover:bg-neutral-900/60 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 text-neutral-500 hover:text-blue-400 cursor-pointer transition-all duration-300"
        >
          <div className="p-3 rounded-full bg-neutral-900 border border-neutral-800 text-blue-400">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-bold text-xs uppercase tracking-widest">
            + CREATE NEW PROJECT CAD SPECIFICATION
          </span>
          <span className="text-[10px] text-neutral-600">
            Full case study, metadata, landscape hero & 4 square gallery assets
          </span>
        </div>
      </div>
    </div>
  );
}
