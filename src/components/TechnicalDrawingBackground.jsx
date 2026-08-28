import React from 'react';

export default function TechnicalDrawingBackground() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-[0.12] md:opacity-[0.18]"
      style={{
        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 16%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.85) 85%, rgba(0,0,0,0) 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 16%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.85) 85%, rgba(0,0,0,0) 100%)',
      }}
    >
      <svg
        className="w-full h-full text-neutral-400"
        viewBox="0 0 1400 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* High Contrast CAD Grid Pattern */}
          <pattern id="cadGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
            <circle cx="20" cy="20" r="1" fill="rgba(255, 255, 255, 0.3)" />
          </pattern>
        </defs>

        {/* Blueprint Grid Overlay */}
        <rect width="100%" height="100%" fill="url(#cadGrid)" />

        {/* ================= 1. TOP LEFT: MOUSE CURSOR & BEZIER NODE ================= */}
        <g transform="translate(100, 70)">
          {/* Dashed Bounding Box */}
          <rect x="-15" y="-15" width="110" height="130" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
          
          {/* Mouse Cursor Arrow */}
          <path
            d="M0 0 L0 52 L14 38 L26 62 L34 58 L22 34 L40 34 Z"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
          />
          {/* Center Crosshair */}
          <circle cx="0" cy="0" r="4" stroke="currentColor" strokeWidth="1" />
          <line x1="-12" y1="0" x2="12" y2="0" stroke="currentColor" strokeWidth="0.6" />
          <line x1="0" y1="-12" x2="0" y2="12" stroke="currentColor" strokeWidth="0.6" />

          {/* Coordinate Annotation */}
          <text x="45" y="-5" fill="currentColor" fontSize="9" fontFamily="monospace" opacity="0.7">
            [ CURSOR: 142.5 , 88.0 ]
          </text>
          <text x="45" y="10" fill="currentColor" fontSize="8" fontFamily="monospace" opacity="0.5">
            NODE_ID: #01
          </text>

          {/* Dimension Arc */}
          <path d="M 40 34 A 20 20 0 0 1 22 34" stroke="#3b82f6" strokeWidth="0.8" strokeDasharray="2 2" />
          <text x="35" y="26" fill="#3b82f6" fontSize="8" fontFamily="monospace" opacity="0.8">38.2°</text>
        </g>

        {/* ================= 2. TOP RIGHT: MECHANICAL DRAFTING PENCIL ================= */}
        <g transform="translate(1120, 60) rotate(-25)">
          {/* Pencil Body Outline */}
          <path d="M0 0 L180 0 L195 6 L180 12 L0 12 Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
          <line x1="20" y1="0" x2="20" y2="12" stroke="currentColor" strokeWidth="0.8" />
          <line x1="160" y1="0" x2="160" y2="12" stroke="currentColor" strokeWidth="0.8" />
          {/* Lead Tip Lead */}
          <path d="M195 6 L210 6" stroke="currentColor" strokeWidth="1.5" />

          {/* Grip Texture Lines */}
          <line x1="26" y1="2" x2="26" y2="10" stroke="currentColor" strokeWidth="0.6" />
          <line x1="32" y1="2" x2="32" y2="10" stroke="currentColor" strokeWidth="0.6" />
          <line x1="38" y1="2" x2="38" y2="10" stroke="currentColor" strokeWidth="0.6" />

          {/* Dimension Lines above Pencil */}
          <line x1="0" y1="-15" x2="180" y2="-15" stroke="currentColor" strokeWidth="0.6" strokeDasharray="4 2" />
          <line x1="0" y1="-20" x2="0" y2="-10" stroke="currentColor" strokeWidth="0.6" />
          <line x1="180" y1="-20" x2="180" y2="-10" stroke="currentColor" strokeWidth="0.6" />
          <text x="65" y="-20" fill="currentColor" fontSize="9" fontFamily="monospace" opacity="0.7">
            &lt;-- 180.0mm --&gt;
          </text>
        </g>

        {/* ================= 3. TOP RIGHT / CENTER: ARCHITECTURAL RULER & T-SQUARE ================= */}
        <g transform="translate(980, 220)">
          {/* Ruler Body */}
          <rect x="0" y="0" width="340" height="42" stroke="currentColor" strokeWidth="1.2" fill="none" />
          {/* Ruler Tick Marks */}
          {[...Array(34)].map((_, i) => (
            <line
              key={i}
              x1={i * 10}
              y1="0"
              x2={i * 10}
              y2={i % 5 === 0 ? 14 : 7}
              stroke="currentColor"
              strokeWidth={i % 5 === 0 ? 1 : 0.6}
            />
          ))}
          <text x="10" y="28" fill="currentColor" fontSize="9" fontFamily="monospace" opacity="0.6">
            0    5   10   15   20   25   30 cm
          </text>
          <text x="240" y="28" fill="#3b82f6" fontSize="8" fontFamily="monospace" opacity="0.8">
            SCALE 1:1
          </text>
        </g>

        {/* ================= 4. CENTER LEFT: BEZIER PEN TOOL & VECTOR CURVE ================= */}
        <g transform="translate(140, 340)">
          {/* Pen Tool Icon Technical Outline */}
          <path d="M0 40 L25 0 L50 40 L35 40 L35 70 L15 70 L15 40 Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
          <circle cx="25" cy="24" r="3" stroke="currentColor" strokeWidth="1" />
          
          {/* Bézier Curve Handle Line */}
          <path d="M 25 24 C 90 -40, 160 120, 260 20" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" fill="none" />
          
          {/* Control Point Node Handles */}
          <line x1="90" y1="-40" x2="160" y2="120" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
          <rect x="86" y="-44" width="8" height="8" stroke="#3b82f6" strokeWidth="1" fill="#181717" />
          <rect x="156" y="116" width="8" height="8" stroke="#3b82f6" strokeWidth="1" fill="#181717" />
          <circle cx="260" cy="20" r="4" stroke="currentColor" strokeWidth="1.2" fill="#181717" />

          <text x="180" y="30" fill="currentColor" fontSize="9" fontFamily="monospace" opacity="0.7">
            P1: (CUBIC_BEZIER)
          </text>
        </g>

        {/* ================= 5. LOWER LEFT: DESIGNER PAINTBRUSH ================= */}
        <g transform="translate(80, 540) rotate(15)">
          {/* Brush Bristles */}
          <path d="M0 0 C 4 -15, 16 -15, 20 0 Z" stroke="currentColor" strokeWidth="1" fill="none" />
          {/* Ferrule */}
          <rect x="0" y="0" width="20" height="18" stroke="currentColor" strokeWidth="1.2" fill="none" />
          {/* Handle */}
          <path d="M2 18 L18 18 L14 160 L6 160 Z" stroke="currentColor" strokeWidth="1" fill="none" />
          <circle cx="10" cy="150" r="2" fill="currentColor" />

          <text x="28" y="40" fill="currentColor" fontSize="8" fontFamily="monospace" opacity="0.5">
            BRUSH_TIP: #04
          </text>
        </g>

        {/* ================= 6. LOWER RIGHT: DRAFTING COMPASS & GEOMETRY ================= */}
        <g transform="translate(1080, 460)">
          {/* Concentric Circles */}
          <circle cx="90" cy="90" r="80" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.5" />
          <circle cx="90" cy="90" r="50" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
          <circle cx="90" cy="90" r="4" stroke="#3b82f6" strokeWidth="1" />

          {/* Compass Hinge Legs */}
          <line x1="90" y1="90" x2="20" y2="180" stroke="currentColor" strokeWidth="1.2" />
          <line x1="90" y1="90" x2="160" y2="180" stroke="currentColor" strokeWidth="1.2" />
          {/* Adjustment Dial */}
          <line x1="45" y1="125" x2="135" y2="125" stroke="currentColor" strokeWidth="1" />
          <circle cx="90" cy="125" r="4" stroke="currentColor" strokeWidth="0.8" fill="#181717" />

          {/* Degree Markings */}
          <text x="90" y="-2" fill="currentColor" fontSize="8" fontFamily="monospace" textAnchor="middle" opacity="0.6">90°</text>
          <text x="178" y="94" fill="currentColor" fontSize="8" fontFamily="monospace" opacity="0.6">0°</text>
          <text x="90" y="188" fill="currentColor" fontSize="8" fontFamily="monospace" textAnchor="middle" opacity="0.6">270°</text>
          <text x="-12" y="94" fill="currentColor" fontSize="8" fontFamily="monospace" opacity="0.6">180°</text>
        </g>

        {/* ================= 7. ARCHITECTURAL DRAFTING TARGETS & CORNER MARKS ================= */}
        {/* Top Left Target */}
        <g transform="translate(40, 40)">
          <line x1="-15" y1="0" x2="15" y2="0" stroke="currentColor" strokeWidth="0.6" />
          <line x1="0" y1="-15" x2="0" y2="15" stroke="currentColor" strokeWidth="0.6" />
          <circle cx="0" cy="0" r="8" stroke="currentColor" strokeWidth="0.6" />
        </g>

        {/* Top Right Target */}
        <g transform="translate(1360, 40)">
          <line x1="-15" y1="0" x2="15" y2="0" stroke="currentColor" strokeWidth="0.6" />
          <line x1="0" y1="-15" x2="0" y2="15" stroke="currentColor" strokeWidth="0.6" />
          <circle cx="0" cy="0" r="8" stroke="currentColor" strokeWidth="0.6" />
        </g>

        {/* Bottom Left Specs */}
        <g transform="translate(40, 750)">
          <text x="0" y="0" fill="currentColor" fontSize="9" fontFamily="monospace" opacity="0.5">
            PROJECT: PORTFOLIO_V2 // ARCHITECTURAL DRAFTING SYSTEM
          </text>
        </g>

        {/* Bottom Right Specs */}
        <g transform="translate(1180, 750)">
          <text x="0" y="0" fill="currentColor" fontSize="9" fontFamily="monospace" opacity="0.5">
            [ UNIT: MM ] [ SHEET: A1 ]
          </text>
        </g>
      </svg>
    </div>
  );
}
