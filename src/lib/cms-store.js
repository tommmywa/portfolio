// CMS Data Store & Persistence Engine with Supabase Cloud Sync
import { supabase, isSupabaseConfigured } from './supabase';

export const DEFAULT_PROJECTS = [
  {
    id: '01',
    title: 'Afkit.ng Commerce',
    category: 'E-Commerce & Digital Products',
    date: '2026',
    client: 'Afkit Commerce Ltd',
    role: 'Lead Product & Systems Designer',
    tags: ['Next.js', 'TailwindCSS', 'WebGL', 'Stripe API'],
    liveUrl: 'https://afkit.ng',
    aspectRatio: '16/9',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-41483-large.mp4',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1400&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1400&auto=format&fit=crop',
    ],
    link: '#',
    description: 'Next-generation commerce platform built for high-scale digital & physical inventory.',
    longDescription: `Afkit.ng is a high-throughput digital and physical commerce engine architected for seamless transactions and inventory management across emerging markets.

The challenge was to design a hyper-responsive, low-latency storefront that maintains 60 FPS visual telemetry while processing complex multi-currency transactions. We engineered a custom design system with ultra-minimalist CAD aesthetics, real-time stock sync, and instant checkout flows.

Key Impact:
• 42% increase in mobile checkout conversion rate.
• Sub-100ms client-side page transitions via edge caching.
• Custom design system utilized across web and mobile platforms.`,
  },
  {
    id: '02',
    title: 'Fintech Dashboard',
    category: 'Financial Analytics & SaaS',
    date: '2025',
    client: 'Apex Financial Technologies',
    role: 'Senior UI/UX Architect',
    tags: ['React', 'TypeScript', 'D3.js', 'Financial Telemetry'],
    liveUrl: 'https://example.com',
    aspectRatio: '16/9',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1400&auto=format&fit=crop',
    ],
    link: '#',
    description: 'Real-time financial telemetry dashboard with predictive portfolio intelligence.',
    longDescription: `Apex Fintech Dashboard is an institutional-grade financial analytics suite created for fund managers and quantitative traders.

It translates multi-layered market data feeds into real-time visual telemetry, dynamic risk charts, and automated portfolio rebalancing alerts. The dark-mode interface utilizes high-contrast data visualization palettes to reduce operator eye fatigue during extended trading sessions.

Key Features:
• Real-time WebSocket data stream integration with dynamic chart rerendering.
• Customizable telemetry widgets with drag-and-drop workspace layouts.
• Automated algorithmic risk evaluation alerts and CSV report export.`,
  },
  {
    id: '03',
    title: 'Aura Sound System',
    category: 'Audio & Spatial Experience',
    date: '2025',
    client: 'Aura Acoustic Labs',
    role: 'Creative Technologist & Spatial Audio Designer',
    tags: ['Web Audio API', 'Three.js', 'GLSL Shaders', 'React'],
    liveUrl: 'https://example.com',
    aspectRatio: '16/9',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-connection-dots-and-lines-41551-large.mp4',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1400&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1400&auto=format&fit=crop',
    ],
    link: '#',
    description: 'Spatial audio web engine rendering real-time acoustic environments.',
    longDescription: `Aura Sound System is an experimental web-based spatial audio engine that renders real-time 3D acoustic environments inside the browser.

Using the Web Audio API and custom WebGL particle shaders, user gestures generate binaural audio fields and interactive visual frequency spectra. Designed for audiophiles, sound designers, and interactive installations.

Key Technical Highlights:
• Biquad filter manipulation bound to mouse/touch spatial coordinates.
• Zero-latency audio buffer decoding with Web Workers.
• Custom GLSL audio visualizer rendering 50,000 reactive particles.`,
  },
  {
    id: '04',
    title: 'Neon Horizon OS',
    category: 'Cyberpunk Web Interface',
    date: '2024',
    client: 'CyberSystems Interactive',
    role: 'Lead UI/UX Designer',
    tags: ['Vanilla CSS', 'JavaScript', 'Node Graph', 'UX System'],
    liveUrl: 'https://example.com',
    aspectRatio: '16/9',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1400&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1400&auto=format&fit=crop',
    ],
    link: '#',
    description: 'Futuristic desktop shell interface with custom window compositor & node graph.',
    longDescription: `Neon Horizon OS is a web-based cyberpunk operating system concept featuring a custom window manager, terminal emulator, and visual node editor.

Built with a strict monospace typography system and dark glassmorphic panels, it explores new interactions for developer tools and generative content creation.`,
  },
  {
    id: '05',
    title: 'Kinetic Motion Studio',
    category: '3D Shader & Physics Engine',
    date: '2024',
    client: 'Kinetic Dynamics',
    role: '3D WebGL Developer',
    tags: ['Three.js', 'Physics Engine', 'GLSL', 'Canvas'],
    liveUrl: 'https://example.com',
    aspectRatio: '16/9',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-tunnel-of-futuristic-neon-lights-41555-large.mp4',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1400&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1400&auto=format&fit=crop',
    ],
    link: '#',
    description: 'Experimental WebGL physics environment exploring procedural particle dynamics.',
    longDescription: `Kinetic Motion Studio is a WebGL physics sandbox exploring real-time fluid dynamics, particle collisions, and procedural lighting in browser environments.`,
  },
  {
    id: '06',
    title: 'Quantum Synthesizer',
    category: 'Interactive Audio & WebGL',
    date: '2024',
    client: 'Quantum Labs',
    role: 'Audio-Visual Designer',
    tags: ['Web Audio API', 'Canvas API', 'DSP Synthesizer'],
    liveUrl: 'https://example.com',
    aspectRatio: '16/9',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1400&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1400&auto=format&fit=crop',
    ],
    link: '#',
    description: 'Generative synthesizer interface translating user gestures into generative spatial sound.',
    longDescription: `Quantum Synthesizer bridges digital signal processing with visual art, turning mouse and touch inputs into evolving ambient soundscapes and generative graphics.`,
  },
];

const STORAGE_KEY = 'portfolio_cms_projects_v1';
const listeners = new Set();

const mapFromDb = (row) => ({
  id: String(row.id),
  title: row.title || '',
  category: row.category || '',
  date: row.date || '',
  client: row.client || '',
  role: row.role || '',
  tags: Array.isArray(row.tags)
    ? row.tags
    : typeof row.tags === 'string'
    ? JSON.parse(row.tags || '[]')
    : [],
  liveUrl: row.live_url || '#',
  aspectRatio: row.aspect_ratio || '16/9',
  image: row.image || '',
  video: row.video || '',
  gallery: Array.isArray(row.gallery)
    ? row.gallery
    : typeof row.gallery === 'string'
    ? JSON.parse(row.gallery || '[]')
    : [],
  link: row.link || '#',
  description: row.description || '',
  longDescription: row.long_description || '',
  sortOrder: typeof row.sort_order === 'number' ? row.sort_order : 0,
});

const mapToDb = (project, index = 0) => ({
  id: String(project.id),
  title: project.title || '',
  category: project.category || '',
  date: project.date || '',
  client: project.client || '',
  role: project.role || '',
  tags: Array.isArray(project.tags) ? project.tags : [],
  live_url: project.liveUrl || '#',
  aspect_ratio: project.aspectRatio || '16/9',
  image: project.image || '',
  video: project.video || '',
  gallery: Array.isArray(project.gallery) ? project.gallery : [],
  link: project.link || '#',
  description: project.description || '',
  long_description: project.longDescription || '',
  sort_order: typeof project.sortOrder === 'number' ? project.sortOrder : index,
  updated_at: new Date().toISOString(),
});

export const cmsStore = {
  getProjects() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return DEFAULT_PROJECTS;
  },

  saveLocal(projects) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      listeners.forEach((listener) => listener(projects));
    } catch (e) {
      console.error('Failed to save to local CMS store', e);
    }
  },

  async fetchFromSupabase() {
    if (!isSupabaseConfigured() || !supabase) {
      return this.getProjects();
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.warn('Supabase fetch warning:', error.message);
        return this.getProjects();
      }

      if (data && data.length > 0) {
        const mapped = data.map(mapFromDb);
        this.saveLocal(mapped);
        return mapped;
      } else {
        // If Supabase table is completely empty, seed with DEFAULT_PROJECTS
        console.log('Supabase projects table is empty, seeding defaults...');
        await this.syncDefaultsToSupabase();
        return this.getProjects();
      }
    } catch (e) {
      console.error('Error fetching from Supabase:', e);
      return this.getProjects();
    }
  },

  async saveProjects(projects) {
    this.saveLocal(projects);

    if (isSupabaseConfigured() && supabase) {
      try {
        const rows = projects.map((p, idx) => mapToDb(p, idx));
        const { error } = await supabase.from('projects').upsert(rows, { onConflict: 'id' });
        if (error) {
          console.error('Supabase bulk upsert error:', error);
        }
      } catch (err) {
        console.error('Failed to sync projects to Supabase:', err);
      }
    }
  },

  async saveProject(project) {
    const projects = this.getProjects();
    const existingIndex = projects.findIndex((p) => p.id === project.id);
    let updated;
    let targetIndex = existingIndex;

    if (existingIndex >= 0) {
      updated = [...projects];
      updated[existingIndex] = { ...updated[existingIndex], ...project };
    } else {
      targetIndex = projects.length;
      updated = [...projects, project];
    }
    this.saveLocal(updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        const row = mapToDb(project, targetIndex);
        const { error } = await supabase.from('projects').upsert(row, { onConflict: 'id' });
        if (error) {
          console.error('Supabase project upsert error:', error);
        }
      } catch (err) {
        console.error('Failed to save project to Supabase:', err);
      }
    }
  },

  async deleteProject(id) {
    const projects = this.getProjects();
    const updated = projects.filter((p) => p.id !== id);
    this.saveLocal(updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) {
          console.error('Supabase delete error:', error);
        }
      } catch (err) {
        console.error('Failed to delete project from Supabase:', err);
      }
    }
  },

  async syncProjectsToSupabase(projectsToSync = null) {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase is not configured');
    }
    const projects = projectsToSync || this.getProjects();
    const rows = projects.map((p, idx) => mapToDb(p, idx));
    const { error } = await supabase.from('projects').upsert(rows, { onConflict: 'id' });
    if (error) {
      console.error('Failed to sync projects to Supabase:', error);
      throw error;
    }
    this.saveLocal(projects);
    return projects;
  },

  async syncDefaultsToSupabase() {
    return this.syncProjectsToSupabase(DEFAULT_PROJECTS);
  },

  resetToDefaults() {
    this.saveProjects(DEFAULT_PROJECTS);
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

// Initiate background fetch on module load
if (typeof window !== 'undefined') {
  cmsStore.fetchFromSupabase();

  // Setup Realtime listener if Supabase is configured
  if (isSupabaseConfigured() && supabase) {
    supabase
      .channel('public:projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        cmsStore.fetchFromSupabase();
      })
      .subscribe();
  }
}
