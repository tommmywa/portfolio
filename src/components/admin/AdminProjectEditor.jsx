import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Check,
  Upload,
  Video,
  Image as ImageIcon,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Layers,
  Tag,
  Calendar,
  User,
  Plus,
  Eye,
  Sparkles,
  Info,
  X,
} from 'lucide-react';
import WorkImageCanvas from '../WorkImageCanvas';
import TechnicalDrawingBackground from '../TechnicalDrawingBackground';
import { assetDB, isVideoMedia } from '../../lib/asset-db';
import { uploadMediaToSupabase, isSupabaseConfigured } from '../../lib/supabase';

const POPULAR_TAGS = [
  'React',
  'Next.js',
  'Three.js',
  'WebGL',
  'TailwindCSS',
  'TypeScript',
  'GLSL',
  'Web Audio API',
  'Figma',
  'UI/UX Design',
  'D3.js',
  'Stripe API',
  'IndexedDB',
];

export default function AdminProjectEditor({ project, allProjects = [], onSave, onBack }) {
  // Compute next available ID if creating a brand new project
  const getNextId = () => {
    if (project?.id) return project.id;
    const existingNums = allProjects
      .map((p) => parseInt(p.id, 10))
      .filter((n) => !isNaN(n));
    const maxNum = existingNums.length > 0 ? Math.max(...existingNums) : 0;
    return String(maxNum + 1).padStart(2, '0');
  };

  const [formData, setFormData] = useState({
    id: project?.id || getNextId(),
    title: project?.title || '',
    category: project?.category || '',
    date: project?.date || new Date().getFullYear().toString(),
    client: project?.client || '',
    role: project?.role || '',
    tags: Array.isArray(project?.tags)
      ? project.tags
      : typeof project?.tags === 'string' && project.tags.length > 0
      ? project.tags.split(',').map((t) => t.trim())
      : ['React', 'WebGL', 'TailwindCSS'],
    liveUrl: project?.liveUrl || '',
    aspectRatio: project?.aspectRatio || '16/9',
    image: project?.image || '',
    video: project?.video || '',
    description: project?.description || '',
    longDescription: project?.longDescription || '',
    gallery: Array.isArray(project?.gallery) ? project.gallery : ['', '', '', ''],
  });

  const [tagInput, setTagInput] = useState('');
  const [previewHover, setPreviewHover] = useState(false);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview'
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Resolved URLs for IndexedDB assets
  const [resolvedHeroImg, setResolvedHeroImg] = useState(formData.image);
  const [resolvedHeroVid, setResolvedHeroVid] = useState(formData.video);
  const [resolvedGallery, setResolvedGallery] = useState(['', '', '', '']);

  // Resolve assets whenever formData changes
  useEffect(() => {
    let isMounted = true;
    if (formData.image) {
      assetDB.getAssetUrl(formData.image).then((url) => {
        if (isMounted) setResolvedHeroImg(url || formData.image);
      });
    } else {
      setResolvedHeroImg('');
    }

    if (formData.video) {
      assetDB.getAssetUrl(formData.video).then((url) => {
        if (isMounted) setResolvedHeroVid(url || formData.video);
      });
    } else {
      setResolvedHeroVid('');
    }

    // Resolve gallery items
    const galleryArr = Array.isArray(formData.gallery) ? formData.gallery : [];
    Promise.all(
      [0, 1, 2, 3].map(async (i) => {
        const item = galleryArr[i] || '';
        if (!item) return '';
        const resolved = await assetDB.getAssetUrl(item);
        return resolved || item;
      })
    ).then((urls) => {
      if (isMounted) setResolvedGallery(urls);
    });

    return () => {
      isMounted = false;
    };
  }, [formData.image, formData.video, formData.gallery]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isSupabaseConfigured()) {
      const { url, error } = await uploadMediaToSupabase(file, 'hero');
      if (url && !error) {
        setFormData((prev) => ({ ...prev, [field]: url }));
        return;
      }
    }

    const assetId = `asset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    await assetDB.saveAsset(assetId, file);
    setFormData((prev) => ({ ...prev, [field]: assetId }));
  };

  const handleGalleryUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isSupabaseConfigured()) {
      const { url, error } = await uploadMediaToSupabase(file, 'gallery');
      if (url && !error) {
        setFormData((prev) => {
          const nextGallery = [...(prev.gallery || ['', '', '', ''])];
          nextGallery[index] = url;
          return { ...prev, gallery: nextGallery };
        });
        return;
      }
    }

    const isVid = file.type.startsWith('video/');
    const typePrefix = isVid ? 'vid' : 'img';
    const assetId = `asset_gal_${typePrefix}_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 7)}`;
    await assetDB.saveAsset(assetId, file);

    setFormData((prev) => {
      const nextGallery = [...(prev.gallery || ['', '', '', ''])];
      nextGallery[index] = assetId;
      return { ...prev, gallery: nextGallery };
    });
  };

  const handleGalleryUrlChange = (index, value) => {
    setFormData((prev) => {
      const nextGallery = [...(prev.gallery || ['', '', '', ''])];
      nextGallery[index] = value;
      return { ...prev, gallery: nextGallery };
    });
  };

  const handleRemoveGalleryItem = (index) => {
    setFormData((prev) => {
      const nextGallery = [...(prev.gallery || ['', '', '', ''])];
      nextGallery[index] = '';
      return { ...prev, gallery: nextGallery };
    });
  };

  const handleAddTag = (tagToAdd) => {
    const cleanTag = (tagToAdd || tagInput).trim();
    if (!cleanTag) return;
    if (!formData.tags.includes(cleanTag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, cleanTag] }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!formData.title || !formData.category) {
      alert('Please provide at least a Project Title and Category.');
      return;
    }

    setIsSaving(true);
    // Format payload
    const cleanLongDesc = formData.longDescription ? formData.longDescription.trim() : '';
    const projectPayload = {
      ...formData,
      longDescription: cleanLongDesc,
      tags: formData.tags,
      // Clean up empty trailing gallery slots
      gallery: formData.gallery.filter((g) => g && g.trim() !== ''),
    };

    onSave(projectPayload);
    setSaveSuccess(true);
    setTimeout(() => {
      setIsSaving(false);
      onBack();
    }, 400);
  };

  return (
    <div className="relative min-h-screen bg-[#181717] text-white flex flex-col font-mono select-none overflow-x-hidden">
      {/* Background CAD Layer */}
      <TechnicalDrawingBackground />

      <div className="relative z-10 max-w-[1500px] w-full mx-auto p-4 sm:p-8 md:p-10 flex flex-col gap-8">
        {/* Top Workstation Header Bar */}
        <div className="sticky top-4 z-40 bg-neutral-900/90 border border-neutral-800 backdrop-blur-xl rounded-2xl p-4 sm:px-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 hover:text-white text-neutral-400 transition-all flex items-center gap-2 cursor-pointer text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">BACK TO CATALOG</span>
            </button>

            <div className="h-6 w-[1px] bg-neutral-800 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <h1 className="font-pixel-custom text-lg sm:text-xl text-white tracking-wide">
                  {project ? 'EDIT PROJECT SPECIFICATION' : 'NEW PROJECT CAD SPECIFICATION'}
                </h1>
              </div>
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest mt-0.5">
                [ ARCHIVE_ID: <span className="text-blue-400 font-bold">{formData.id}</span> ] //{' '}
                {formData.title ? formData.title.toUpperCase() : 'UNTITLED SPECIFICATION'}
              </p>
            </div>
          </div>

          {/* Action Tabs & Save Button */}
          <div className="flex items-center gap-3">
            <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'editor'
                    ? 'bg-neutral-800 text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>SPEC EDITOR</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'preview'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>LIVE PREVIEW</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-blue-600/30 flex items-center gap-2 disabled:opacity-50"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>SAVED!</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>SAVE PROJECT</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Workstation View Area */}
        {activeTab === 'editor' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Sections (8 Cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* 1. PRIMARY METADATA & TELEMETRY */}
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    <h2 className="text-xs uppercase tracking-widest text-white font-bold">
                      [ SECTION 01: PROJECT METADATA & IDENTITY ]
                    </h2>
                  </div>
                  <span className="text-[10px] text-neutral-500 uppercase">
                    DETAIL PAGE TOP SIDEBAR
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 text-xs">
                  {/* Archive ID */}
                  <div className="sm:col-span-3">
                    <label className="block text-neutral-400 uppercase tracking-widest mb-1.5 text-[11px]">
                      ARCHIVE ID *
                    </label>
                    <input
                      type="text"
                      name="id"
                      value={formData.id}
                      onChange={handleChange}
                      placeholder="e.g. 07"
                      required
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-blue-400 font-bold focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Project Title */}
                  <div className="sm:col-span-9">
                    <label className="block text-neutral-400 uppercase tracking-widest mb-1.5 text-[11px]">
                      PROJECT TITLE *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Afkit.ng Commerce Platform"
                      required
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-white focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Category */}
                  <div className="sm:col-span-6">
                    <label className="block text-neutral-400 uppercase tracking-widest mb-1.5 text-[11px]">
                      CATEGORY & DOMAIN *
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="e.g. E-Commerce & Digital Systems"
                      required
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-white focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Timeline / Year */}
                  <div className="sm:col-span-3">
                    <label className="block text-neutral-400 uppercase tracking-widest mb-1.5 text-[11px]">
                      YEAR / TIMELINE
                    </label>
                    <input
                      type="text"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      placeholder="2026"
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-white focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Card Ratio */}
                  <div className="sm:col-span-3">
                    <label className="block text-neutral-400 uppercase tracking-widest mb-1.5 text-[11px]">
                      ARCHIVE RATIO
                    </label>
                    <select
                      name="aspectRatio"
                      value={formData.aspectRatio || '16/9'}
                      onChange={handleChange}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-lg px-2.5 py-2.5 text-white focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value="16/9">Landscape (16:9)</option>
                      <option value="1/1">Square (1:1)</option>
                      <option value="4/5">Portrait (4:5)</option>
                      <option value="21/9">Ultrawide (21:9)</option>
                    </select>
                  </div>

                  {/* Client Name */}
                  <div className="sm:col-span-6">
                    <label className="block text-neutral-400 uppercase tracking-widest mb-1.5 text-[11px]">
                      CLIENT OR ORGANIZATION
                    </label>
                    <input
                      type="text"
                      name="client"
                      value={formData.client}
                      onChange={handleChange}
                      placeholder="e.g. Afkit Commerce Ltd"
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-white focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Role & Responsibility */}
                  <div className="sm:col-span-6">
                    <label className="block text-neutral-400 uppercase tracking-widest mb-1.5 text-[11px]">
                      YOUR ROLE & RESPONSIBILITY
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      placeholder="e.g. Lead Product & Systems Designer"
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-white focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Live URL */}
                  <div className="sm:col-span-12">
                    <label className="block text-neutral-400 uppercase tracking-widest mb-1.5 text-[11px]">
                      LIVE DEMO OR CASE STUDY URL
                    </label>
                    <input
                      type="text"
                      name="liveUrl"
                      value={formData.liveUrl}
                      onChange={handleChange}
                      placeholder="https://afkit.ng or https://github.com/..."
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Tech Stack Tags Manager */}
                <div className="pt-4 border-t border-neutral-800">
                  <label className="block text-neutral-400 uppercase tracking-widest mb-2 text-[11px]">
                    TECH STACK & TOOLS (TAGS)
                  </label>

                  {/* Active Tags Chips */}
                  <div className="flex flex-wrap gap-2 mb-3 min-h-[32px] p-2 bg-neutral-950/60 border border-neutral-800 rounded-lg">
                    {formData.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 text-xs text-neutral-200"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-400 text-neutral-400 cursor-pointer p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {formData.tags.length === 0 && (
                      <span className="text-neutral-600 text-xs py-0.5">
                        No tags added. Type below or click popular tools.
                      </span>
                    )}
                  </div>

                  {/* Tag Input */}
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                      placeholder="Type tool name and press Enter (e.g. Next.js, WebGL)..."
                      className="flex-1 bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddTag()}
                      className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>ADD</span>
                    </button>
                  </div>

                  {/* Quick Select Popular Tags */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] text-neutral-500 uppercase mr-1">QUICK ADD:</span>
                    {POPULAR_TAGS.map((popTag) => (
                      <button
                        key={popTag}
                        type="button"
                        onClick={() => handleAddTag(popTag)}
                        disabled={formData.tags.includes(popTag)}
                        className="px-2 py-0.5 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800/80 text-[10px] text-neutral-400 hover:text-blue-400 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                      >
                        +{popTag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. CASE STUDY & SYNOPSIS */}
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <h2 className="text-xs uppercase tracking-widest text-white font-bold">
                      [ SECTION 02: CASE STUDY & DESIGN RATIONALE ]
                    </h2>
                  </div>
                  <span className="text-[10px] text-neutral-500 uppercase">
                    DETAIL PAGE RIGHT CARD
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Short Overview Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-neutral-400 uppercase tracking-widest text-[11px]">
                        OVERVIEW & SYNOPSIS (SHORT SUMMARY) *
                      </label>
                      <span className="text-[10px] text-neutral-500">
                        Shown in Catalog & Overview Card
                      </span>
                    </div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Brief synopsis highlighting the core problem, engineering solution, and impact..."
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-lg p-3.5 text-white focus:outline-none transition-colors leading-relaxed font-sans text-xs"
                    />
                  </div>

                  {/* Long Form Case Study (Optional) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <label className="block text-neutral-400 uppercase tracking-widest text-[11px]">
                          FULL CASE STUDY & DESIGN RATIONALE
                        </label>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-950 border border-neutral-800 text-neutral-400 font-bold uppercase">
                          OPTIONAL
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-500">
                        Leave blank if not needed (won't show on site)
                      </span>
                    </div>
                    <textarea
                      name="longDescription"
                      value={formData.longDescription}
                      onChange={handleChange}
                      rows={8}
                      placeholder={`Optional extended case study breakdown (leave empty to omit):

• Architectural Challenge & Context
• Engineering and Interaction Design Strategy
• Quantified Results & Metrics`}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-lg p-3.5 text-white focus:outline-none transition-colors leading-relaxed font-sans text-xs whitespace-pre-wrap"
                    />
                  </div>
                </div>
              </div>

              {/* 3. MAIN SHOWCASE MEDIA (LANDSCAPE 16:9 HERO) */}
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-400" />
                    <h2 className="text-xs uppercase tracking-widest text-white font-bold">
                      [ SECTION 03: PRIMARY HERO SHOWCASE ASSET (16:9) ]
                    </h2>
                  </div>
                  <span className="text-[10px] text-blue-400 font-bold uppercase">
                    MAIN DETAIL HERO
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  {/* Image Asset */}
                  <div className="space-y-2">
                    <label className="block text-neutral-400 uppercase tracking-widest text-[11px]">
                      MAIN IMAGE ASSET *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="Image URL or upload local file..."
                        className="flex-1 bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-white focus:outline-none transition-colors text-xs"
                      />
                      <label className="px-3.5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                        <ImageIcon className="w-4 h-4 text-blue-400" />
                        <span className="text-[10px] font-bold">UPLOAD</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'image')}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-[10px] text-neutral-500">
                      Recommended: High resolution 16:9 (1920x1080) landscape visual.
                    </p>
                  </div>

                  {/* Video Asset */}
                  <div className="space-y-2">
                    <label className="block text-neutral-400 uppercase tracking-widest text-[11px]">
                      OPTIONAL VIDEO CLIP (.MP4)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="video"
                        value={formData.video}
                        onChange={handleChange}
                        placeholder="Video URL or upload MP4..."
                        className="flex-1 bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-white focus:outline-none transition-colors text-xs"
                      />
                      <label className="px-3.5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                        <Video className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] font-bold">UPLOAD</span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleFileUpload(e, 'video')}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-[10px] text-neutral-500">
                      Optional: Autoplaying muted ambient video loop.
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. DETAIL GALLERY GRID (4 SQUARE 1:1 ASSETS - PICTURES OR VIDEOS) */}
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <h2 className="text-xs uppercase tracking-widest text-white font-bold">
                      [ SECTION 04: PROJECT DETAIL GALLERY (4 SQUARE SHOTS 1:1 — IMAGES OR VIDEOS) ]
                    </h2>
                  </div>
                  <span className="text-[10px] text-amber-400 uppercase font-bold">
                    PHOTO / MP4 VIDEO SUPPORT
                  </span>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  These 4 square (1:1) dimension assets appear directly under the main landscape
                  hero on the Project Detail page. You can upload photos (.png, .jpg, .webp, .gif) or looping videos (.mp4, .webm).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[0, 1, 2, 3].map((slotIdx) => {
                    const currentVal = formData.gallery?.[slotIdx] || '';
                    const resolvedVal = resolvedGallery[slotIdx] || currentVal;
                    const isVid = isVideoMedia(resolvedVal) || isVideoMedia(currentVal);

                    return (
                      <div
                        key={slotIdx}
                        className="bg-neutral-950/80 border border-neutral-800/90 rounded-xl p-4 flex flex-col gap-3 font-mono text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                              [ GALLERY SHOT #{slotIdx + 1} - 1:1 ]
                            </span>
                            {currentVal && (
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded border font-bold ${
                                  isVid
                                    ? 'bg-emerald-950/80 border-emerald-700 text-emerald-400'
                                    : 'bg-blue-950/80 border-blue-700 text-blue-400'
                                }`}
                              >
                                {isVid ? 'VIDEO' : 'IMAGE'}
                              </span>
                            )}
                          </div>
                          {currentVal && (
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryItem(slotIdx)}
                              className="text-neutral-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                              title="Clear asset"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Thumbnail Preview Box */}
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                          {resolvedVal ? (
                            isVid ? (
                              <video
                                src={resolvedVal}
                                muted
                                loop
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <img
                                src={resolvedVal}
                                alt={`Gallery slot ${slotIdx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            )
                          ) : (
                            <div className="flex flex-col items-center justify-center text-neutral-600 p-4 text-center">
                              <div className="flex items-center gap-2 mb-2 opacity-40">
                                <ImageIcon className="w-6 h-6" />
                                <span className="text-xs">/</span>
                                <Video className="w-6 h-6" />
                              </div>
                              <span className="text-[10px] uppercase">
                                [ EMPTY SLOT // USES FALLBACK ]
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Inputs: URL & Separate File Upload Buttons */}
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            value={currentVal}
                            onChange={(e) => handleGalleryUrlChange(slotIdx, e.target.value)}
                            placeholder="Image or Video (.mp4) URL or upload..."
                            className="w-full bg-neutral-900 border border-neutral-800 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-white focus:outline-none transition-colors text-[11px]"
                          />
                          <div className="flex gap-2">
                            <label className="flex-1 px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-colors">
                              <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                              <span className="text-[10px] font-bold">PHOTO</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleGalleryUpload(e, slotIdx)}
                                className="hidden"
                              />
                            </label>
                            <label className="flex-1 px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-colors">
                              <Video className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-[10px] font-bold">VIDEO</span>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => handleGalleryUpload(e, slotIdx)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Live WebGL Shader & Summary Panel (4 Cols Sticky) */}
            <div className="lg:col-span-4 space-y-6 sticky top-28">
              {/* WebGL Warp Preview Tile */}
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span className="text-xs uppercase tracking-widest text-white font-bold">
                      WEBGL SHADER PREVIEW
                    </span>
                  </div>
                  <span className="text-[9px] text-blue-400 font-bold uppercase">[ WARP TEST ]</span>
                </div>

                <div
                  onMouseEnter={() => setPreviewHover(true)}
                  onMouseLeave={() => setPreviewHover(false)}
                  className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-neutral-800 cursor-pointer group bg-neutral-950"
                >
                  {resolvedHeroImg || resolvedHeroVid ? (
                    <WorkImageCanvas
                      imageUrl={resolvedHeroImg}
                      videoUrl={resolvedHeroVid}
                      velocity={0}
                      isHovered={previewHover}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 p-6 text-center">
                      <Upload className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-xs">[ INPUT HERO IMAGE OR VIDEO ]</span>
                    </div>
                  )}

                  <div className="absolute top-2 left-2 z-20 font-mono text-[9px] text-blue-400 uppercase bg-neutral-950/85 px-2 py-0.5 rounded border border-neutral-800">
                    [ HOVER TO TEST WARP ]
                  </div>
                </div>

                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Hover over the canvas above to preview the custom displacement shader physics
                  active on the main portfolio grid.
                </p>
              </div>

              {/* Project Card Specs Summary Tile */}
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 backdrop-blur-md space-y-4 text-xs">
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest block border-b border-neutral-800 pb-2">
                  TELEMETRY SUMMARY
                </span>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>TITLE:</span>
                    <span className="text-white font-bold truncate max-w-[180px]">
                      {formData.title || '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>CATEGORY:</span>
                    <span className="text-neutral-200 truncate max-w-[180px]">
                      {formData.category || '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>CLIENT:</span>
                    <span className="text-neutral-200 truncate max-w-[180px]">
                      {formData.client || 'Internal Project'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>ROLE:</span>
                    <span className="text-neutral-200 truncate max-w-[180px]">
                      {formData.role || '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>TIMELINE:</span>
                    <span className="text-neutral-200">{formData.date}</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>TAGS COUNT:</span>
                    <span className="text-blue-400 font-bold">{formData.tags.length} TAGS</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>GALLERY ASSETS:</span>
                    <span className="text-amber-400 font-bold">
                      {formData.gallery.filter((g) => g && g.trim() !== '').length} OF 4 CUSTOM
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 text-xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>SAVE & PUBLISH TO ARCHIVE</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Live Full Project Detail Page Mockup Preview */
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl space-y-12">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4 text-xs">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-bold uppercase tracking-widest">
                    [ LIVE SIMULATION: PROJECT DETAIL PAGE VIEW ]
                  </span>
                </div>
                <span className="text-neutral-500 uppercase">FIGMA NODE 512:164 ACCURACY</span>
              </div>

              {/* Mock Nav Bar */}
              <div className="flex items-center justify-between font-departure text-sm text-[#a8a8a8]">
                <div className="flex items-center gap-3">
                  <ArrowLeft className="w-5 h-5 text-[#a8a8a8]" />
                  <span>GO BACK HOME [or press ESC]</span>
                </div>
                <div className="flex items-center gap-2 text-right">
                  <span className="text-[#3d75d1] font-bold">[ ID: {formData.id} ]</span>
                  <span className="text-[#a8a8a8] uppercase">{formData.title || 'UNTITLED'}</span>
                  <span className="text-[#a8a8a8]">[{formData.date}]</span>
                </div>
              </div>

              {/* Dual Cards with Parallel CAD Connector Lines */}
              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Metadata Card */}
                <div className="lg:col-span-4 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest block mb-1">
                      PROJECT METADATA
                    </span>
                    <h3 className="font-pixel-custom text-2xl text-white tracking-wide leading-tight">
                      {formData.title || 'Project Title'}
                    </h3>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-neutral-800/80">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">
                          CLIENT
                        </span>
                        <span className="text-neutral-200">
                          {formData.client || 'Internal Project'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <User className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">
                          ROLE & RESPONSIBILITY
                        </span>
                        <span className="text-neutral-200">
                          {formData.role || 'Lead Product & Systems Designer'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">
                          TIMELINE / YEAR
                        </span>
                        <span className="text-neutral-200">{formData.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="pt-4 border-t border-neutral-800/80">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest block mb-2.5 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-blue-400" />
                      <span>TECH STACK & TOOLS</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {formData.liveUrl && (
                    <div className="pt-4 border-t border-neutral-800/80">
                      <a
                        href={formData.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <span>VISIT LIVE PROJECT</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Right Case Study Card with Connector Lines */}
                <div className="relative lg:col-span-8 bg-neutral-950/60 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
                  {/* Dual Connector lines */}
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
                      {formData.description || 'Project synopsis will appear here...'}
                    </p>
                  </div>

                  {formData.longDescription && formData.longDescription.trim() !== '' && (
                    <div className="pt-6 border-t border-neutral-800/80 space-y-3">
                      <div className="font-mono text-xs text-neutral-400 uppercase tracking-widest mb-1">
                        [ CASE STUDY & DESIGN RATIONALE ]
                      </div>
                      <div className="font-departure text-sm text-neutral-400 leading-relaxed whitespace-pre-wrap">
                        {formData.longDescription}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Media Showcase (Hero + 4 Square Gallery Grid) */}
              <div className="space-y-8">
                {/* Hero Asset (Strict 16:9 Landscape Aspect Ratio) */}
                <div className="relative w-full aspect-[16/9] rounded-sm overflow-hidden bg-neutral-950 border border-neutral-800 shadow-2xl flex items-center justify-center">
                  {resolvedHeroVid ? (
                    <video
                      src={resolvedHeroVid}
                      muted
                      loop
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  ) : resolvedHeroImg ? (
                    <img
                      src={resolvedHeroImg}
                      alt={formData.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600 text-sm">
                      [ MAIN SHOWCASE HERO ASSET ]
                    </div>
                  )}
                </div>

                {/* 2-Column Square Gallery Grid (Pictures or Videos) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  {[0, 1, 2, 3].map((idx) => {
                    const src =
                      resolvedGallery[idx] ||
                      resolvedHeroImg ||
                      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1400&auto=format&fit=crop';
                    const isVid = isVideoMedia(src);
                    return (
                      <div
                        key={idx}
                        className="relative w-full aspect-square rounded-sm overflow-hidden bg-neutral-950 border border-neutral-800 shadow-xl"
                      >
                        {isVid ? (
                          <video
                            src={src}
                            muted
                            loop
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={src}
                            alt={`Gallery Asset ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-neutral-950/80 border border-neutral-800 text-[10px] text-neutral-400">
                          [ SHOT #{idx + 1} - 1:1 {isVid ? 'VIDEO' : 'IMAGE'} ]
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
