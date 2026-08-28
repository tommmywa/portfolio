import React, { useState, useEffect } from 'react';
import { X, Upload, Video, Image as ImageIcon, Check } from 'lucide-react';
import WorkImageCanvas from '../WorkImageCanvas';
import { assetDB } from '../../lib/asset-db';

export default function ProjectModal({ project, onSave, onClose }) {
  const [formData, setFormData] = useState({
    id: String(Date.now()).slice(-2),
    title: '',
    category: '',
    date: new Date().getFullYear().toString(),
    client: '',
    role: '',
    tags: '',
    liveUrl: '#',
    aspectRatio: '16/9',
    image: '',
    video: '',
    description: '',
    longDescription: '',
  });

  const [previewHover, setPreviewHover] = useState(false);

  useEffect(() => {
    if (project) {
      const tagsStr = Array.isArray(project.tags) ? project.tags.join(', ') : project.tags || '';
      setFormData((prev) => ({ ...prev, aspectRatio: '16/9', ...project, tags: tagsStr }));
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const assetId = `asset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    await assetDB.saveAsset(assetId, file);
    setFormData((prev) => ({ ...prev, [field]: assetId }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category) return;
    onSave(formData);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[20000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl my-auto text-left font-mono"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
          <div>
            <h2 className="font-pixel-custom text-xl sm:text-2xl text-white tracking-wide">
              {project ? 'EDIT PROJECT & CASE STUDY' : 'ADD NEW PROJECT'}
            </h2>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest mt-0.5">
              [ ARCHIVE_ID: {formData.id} ]
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Grid: Left Form, Right Live WebGL Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4 text-xs">
            <div>
              <label className="block text-neutral-400 uppercase tracking-widest mb-1.5">
                PROJECT TITLE *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Afkit.ng Commerce"
                required
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-white focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-neutral-400 uppercase tracking-widest mb-1.5">
                  CATEGORY *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. E-Commerce"
                  required
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-white focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-neutral-400 uppercase tracking-widest mb-1.5">
                  YEAR / DATE
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
              <div>
                <label className="block text-neutral-400 uppercase tracking-widest mb-1.5">
                  CARD RATIO
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-400 uppercase tracking-widest mb-1.5">
                  CLIENT NAME
                </label>
                <input
                  type="text"
                  name="client"
                  value={formData.client || ''}
                  onChange={handleChange}
                  placeholder="e.g. Afkit Commerce Ltd"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-white focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-neutral-400 uppercase tracking-widest mb-1.5">
                  YOUR ROLE
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role || ''}
                  onChange={handleChange}
                  placeholder="e.g. Lead Designer & Developer"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-400 uppercase tracking-widest mb-1.5">
                  TECH STACK (COMMA SEPARATED)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags || ''}
                  onChange={handleChange}
                  placeholder="React, WebGL, TailwindCSS"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-white focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-neutral-400 uppercase tracking-widest mb-1.5">
                  LIVE DEMO URL
                </label>
                <input
                  type="text"
                  name="liveUrl"
                  value={formData.liveUrl || ''}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 uppercase tracking-widest mb-1.5">
                IMAGE ASSET URL / UPLOAD *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://... or upload file"
                  required
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-white focus:outline-none transition-colors"
                />
                <label className="px-3 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                  <ImageIcon className="w-4 h-4 text-blue-400" />
                  <span className="text-[10px]">FILE</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'image')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 uppercase tracking-widest mb-1.5">
                OPTIONAL VIDEO ASSET (.MP4)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="video"
                  value={formData.video}
                  onChange={handleChange}
                  placeholder="https://... .mp4 or upload clip"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-white focus:outline-none transition-colors"
                />
                <label className="px-3 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                  <Video className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px]">FILE</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileUpload(e, 'video')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 uppercase tracking-widest mb-1.5">
                SHORT SUMMARY / CARD OVERVIEW
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                placeholder="Brief project summary for cards..."
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-white focus:outline-none transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-neutral-400 uppercase tracking-widest mb-1.5">
                FULL CASE STUDY & DESIGN RATIONALE (DETAIL PAGE)
              </label>
              <textarea
                name="longDescription"
                value={formData.longDescription || ''}
                onChange={handleChange}
                rows={4}
                placeholder="Long-form case study details, design rationale, and technical challenges solved..."
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-white focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-blue-600/20 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>SAVE PROJECT</span>
              </button>
            </div>
          </form>

          {/* Right Live Shader Preview Tile */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <label className="block text-neutral-400 uppercase tracking-widest mb-2 w-full text-center">
              LIVE WEBGL SHADER PREVIEW
            </label>

            <div
              onMouseEnter={() => setPreviewHover(true)}
              onMouseLeave={() => setPreviewHover(false)}
              className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 cursor-pointer group"
            >
              {formData.image || formData.video ? (
                <WorkImageCanvas
                  imageUrl={formData.image}
                  videoUrl={formData.video}
                  velocity={0}
                  isHovered={previewHover}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 p-6 text-center border-2 border-dashed border-neutral-800 rounded-2xl">
                  <Upload className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-xs">[ UPLOAD OR INPUT IMAGE/VIDEO URL ]</span>
                </div>
              )}

              <div className="absolute top-3 left-3 z-20 font-mono text-[9px] text-blue-400 uppercase bg-neutral-950/80 px-2 py-1 rounded border border-neutral-800">
                [ HOVER TO TEST WARP ]
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
