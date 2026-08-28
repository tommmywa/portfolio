// IndexedDB Media Asset Storage Engine
// Solves localStorage 5MB quota errors for high-resolution images & MP4 videos

const DB_NAME = 'PortfolioMediaAssetsDB';
const STORE_NAME = 'media_assets';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const assetDB = {
  async saveAsset(id, fileOrBlob) {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(fileOrBlob, id);
        req.onsuccess = () => resolve(id);
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.error('Failed to save asset to IndexedDB', e);
      return null;
    }
  },

  async getAssetUrl(id) {
    if (!id || typeof id !== 'string') return '';
    if (id.startsWith('http') || id.startsWith('data:') || id.startsWith('blob:')) {
      return id;
    }
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);
        req.onsuccess = () => {
          const blob = req.result;
          if (blob instanceof Blob || blob instanceof File) {
            resolve(URL.createObjectURL(blob));
          } else {
            resolve(id);
          }
        };
        req.onerror = () => resolve(id);
      });
    } catch (e) {
      return id;
    }
  },
};

export function isVideoMedia(url) {
  if (!url || typeof url !== 'string') return false;
  const clean = url.toLowerCase().split('?')[0].split('#')[0];
  return (
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.mov') ||
    clean.endsWith('.ogg') ||
    clean.endsWith('.m4v') ||
    url.startsWith('data:video') ||
    url.includes('mixkit.co/videos') ||
    url.includes('_vid_') ||
    url.includes('video')
  );
}
