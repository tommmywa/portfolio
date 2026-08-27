import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const VERTEX_SHADER = `
  uniform float uTime;
  uniform float uVelocity;
  uniform float uHover;
  varying vec2 vUv;
  varying float vWave;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Curved parabolic warping along scroll velocity (uVelocity)
    float bend = sin(uv.y * 3.14159265) * uVelocity * 0.12;
    
    // Interactive mouse hover sine wave ripple
    float wave = sin(uv.x * 8.0 + uTime * 3.0) * cos(uv.y * 8.0 + uTime * 2.5) * uHover * 0.07;
    
    vWave = bend + wave;
    pos.z += vWave;
    pos.x += bend * 0.25;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uVelocity;
  uniform float uHover;
  varying vec2 vUv;
  varying float vWave;

  void main() {
    vec2 uv = vUv;

    // Center distortion based on wave
    vec2 center = uv - 0.5;
    uv += center * vWave * 0.25;

    // Chromatic Aberration (RGB Split) proportional to velocity and hover wave
    float shift = (abs(uVelocity) * 0.02 + uHover * 0.012) + abs(vWave) * 0.08;
    
    float r = texture2D(uTexture, uv + vec2(shift, 0.0)).r;
    float g = texture2D(uTexture, uv).g;
    float b = texture2D(uTexture, uv - vec2(shift, 0.0)).b;
    float a = texture2D(uTexture, uv).a;

    // Subtle scanlines for digital aesthetic
    float scanline = sin(uv.y * 240.0) * 0.025;

    vec3 color = vec3(r, g, b) - scanline;

    gl_FragColor = vec4(color, a);
  }
`;

export default function WorkImageCanvas({ imageUrl, videoUrl, velocity = 0, isHovered = false }) {
  const containerRef = useRef(null);
  const velocityRef = useRef(0);
  const hoverRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup (FOV 45 deg, z = 2.4)
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 2.4;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Compute plane dimensions to fill viewport
    const vFOV = (camera.fov * Math.PI) / 180;
    const visibleHeight = 2 * Math.tan(vFOV / 2) * camera.position.z;
    const visibleWidth = visibleHeight * camera.aspect;

    // Geometry & Material
    const geometry = new THREE.PlaneGeometry(visibleWidth, visibleHeight, 48, 48);

    let texture;
    let videoElement;

    if (videoUrl) {
      videoElement = document.createElement('video');
      videoElement.src = videoUrl;
      videoElement.crossOrigin = 'anonymous';
      videoElement.loop = true;
      videoElement.muted = true;
      videoElement.playsInline = true;
      videoElement.autoplay = true;
      videoElement.play().catch(() => {});

      texture = new THREE.VideoTexture(videoElement);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.colorSpace = THREE.SRGBColorSpace;
    } else {
      const textureLoader = new THREE.TextureLoader();
      texture = textureLoader.load(imageUrl, (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.colorSpace = THREE.SRGBColorSpace;
      });
    }

    const uniforms = {
      uTexture: { value: texture },
      uTime: { value: 0 },
      uVelocity: { value: 0 },
      uHover: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: uniforms,
      side: THREE.DoubleSide,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation Loop
    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smoothly lerp uniforms
      uniforms.uTime.value = elapsedTime;
      
      const targetVel = velocityRef.current;
      uniforms.uVelocity.value += (targetVel - uniforms.uVelocity.value) * 0.1;

      const targetHover = hoverRef.current ? 1.0 : 0.0;
      uniforms.uHover.value += (targetHover - uniforms.uHover.value) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth > 0 && newHeight > 0) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();

        const newVisibleHeight = 2 * Math.tan(vFOV / 2) * camera.position.z;
        const newVisibleWidth = newVisibleHeight * camera.aspect;
        mesh.geometry.dispose();
        mesh.geometry = new THREE.PlaneGeometry(newVisibleWidth, newVisibleHeight, 48, 48);

        renderer.setSize(newWidth, newHeight);
      }
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      if (videoElement) {
        videoElement.pause();
        videoElement.remove();
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [imageUrl, videoUrl]);

  // Update refs when props change
  useEffect(() => {
    velocityRef.current = velocity;
  }, [velocity]);

  useEffect(() => {
    hoverRef.current = isHovered;
  }, [isHovered]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden pointer-events-none"
    />
  );
}
