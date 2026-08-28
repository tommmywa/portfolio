// CMS Data Store & Persistence Engine for Portfolio Works

const DEFAULT_PROJECTS = [
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
    link: '#',
    description: 'Generative synthesizer interface translating user gestures into generative spatial sound.',
    longDescription: `Quantum Synthesizer bridges digital signal processing with visual art, turning mouse and touch inputs into evolving ambient soundscapes and generative graphics.`,
  },
];

const STORAGE_KEY = 'portfolio_cms_projects_v1';
const listeners = new Set();

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

  saveProjects(projects) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      listeners.forEach((listener) => listener(projects));
    } catch (e) {
      console.error('Failed to save to CMS store', e);
    }
  },

  saveProject(project) {
    const projects = this.getProjects();
    const existingIndex = projects.findIndex((p) => p.id === project.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...projects];
      updated[existingIndex] = { ...updated[existingIndex], ...project };
    } else {
      updated = [...projects, project];
    }
    this.saveProjects(updated);
  },

  deleteProject(id) {
    const projects = this.getProjects();
    const updated = projects.filter((p) => p.id !== id);
    this.saveProjects(updated);
  },

  resetToDefaults() {
    this.saveProjects(DEFAULT_PROJECTS);
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
