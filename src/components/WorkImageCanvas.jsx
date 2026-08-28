import React, { useState, useEffect } from 'react';
import { assetDB } from '../lib/asset-db';

export default function WorkImageCanvas({ imageUrl, videoUrl, isHovered = false }) {
  const [resolvedImage, setResolvedImage] = useState(imageUrl);
  const [resolvedVideo, setResolvedVideo] = useState(videoUrl);

  // Resolve IndexedDB asset URLs if stored as asset keys
  useEffect(() => {
    let isMounted = true;
    assetDB.getAssetUrl(imageUrl).then((url) => {
      if (isMounted) setResolvedImage(url || imageUrl);
    });
    assetDB.getAssetUrl(videoUrl).then((url) => {
      if (isMounted) setResolvedVideo(url || videoUrl);
    });
    return () => {
      isMounted = false;
    };
  }, [imageUrl, videoUrl]);

  const activeImg = resolvedImage || imageUrl;
  const activeVid = resolvedVideo || videoUrl;

  return (
    <div className="relative w-full h-full min-h-[340px] sm:min-h-[440px] md:min-h-[500px] overflow-hidden bg-[#181717] group">
      {activeVid ? (
        <video
          src={activeVid}
          muted
          loop
          autoPlay
          playsInline
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        />
      ) : activeImg ? (
        <img
          src={activeImg}
          alt="Project Preview"
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-neutral-600 font-mono text-xs border border-dashed border-neutral-800">
          [ NO ASSET PREVIEW ]
        </div>
      )}
    </div>
  );
}
