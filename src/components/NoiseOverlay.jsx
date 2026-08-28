import React, { useEffect, useState } from 'react';

export default function NoiseOverlay() {
  const [noiseUrl, setNoiseUrl] = useState('');

  useEffect(() => {
    // Generate a 256x256 pixel monochrome fine noise texture tile
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.createImageData(256, 256);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      // Fine-grain monochrome noise
      const val = Math.floor(Math.random() * 255);
      data[i] = val;       // R
      data[i + 1] = val;   // G
      data[i + 2] = val;   // B
      data[i + 3] = Math.floor(Math.random() * 100 + 40); // Subtle noise alpha density
    }

    ctx.putImageData(imgData, 0, 0);
    setNoiseUrl(canvas.toDataURL());
  }, []);

  return (
    <>
      <style>{`
        @keyframes noiseJitter {
          0% { transform: translate3d(0, 0, 0); }
          10% { transform: translate3d(-3%, -5%, 0); }
          20% { transform: translate3d(-8%, 4%, 0); }
          30% { transform: translate3d(5%, -10%, 0); }
          40% { transform: translate3d(-4%, 12%, 0); }
          50% { transform: translate3d(-7%, 3%, 0); }
          60% { transform: translate3d(9%, -2%, 0); }
          70% { transform: translate3d(0%, 8%, 0); }
          80% { transform: translate3d(-10%, -6%, 0); }
          90% { transform: translate3d(6%, 5%, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }

        .noise-layer {
          animation: noiseJitter 0.4s steps(6) infinite;
          will-change: transform;
        }
      `}</style>

      <div
        className="fixed top-[-50%] left-[-50%] w-[200%] h-[200vh] pointer-events-none z-[9999] opacity-[0.15] noise-layer select-none"
        style={{
          backgroundImage: noiseUrl ? `url(${noiseUrl})` : 'none',
          backgroundRepeat: 'repeat',
        }}
      />
    </>
  );
}
