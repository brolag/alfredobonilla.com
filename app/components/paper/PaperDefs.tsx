// Reusable paper cut-outs for the scene. All silhouettes; color comes from the
// parent layer's fill so the same shape works on any sheet.

export function PaperDefs() {
  return (
    <defs>
      <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#f8edca" stopOpacity="0.75" />
        <stop offset="0.45" stopColor="#e8bd74" stopOpacity="0.25" />
        <stop offset="1" stopColor="#e8bd74" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="moonGlow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#dce9df" stopOpacity="0.5" />
        <stop offset="1" stopColor="#dce9df" stopOpacity="0" />
      </radialGradient>
      <mask id="crescent">
        <rect x="0" y="0" width="1600" height="900" fill="#fff" />
        <circle cx="1362" cy="120" r="48" fill="#000" />
      </mask>

      {/* pine: stacked triangles + trunk, origin at the base */}
      <g id="pine">
        <path d="M0 -130 L30 -70 L16 -70 L46 -20 L26 -20 L58 34 L-58 34 L-26 -20 L-46 -20 L-16 -70 L-30 -70 Z" />
        <rect x="-6" y="34" width="12" height="24" rx="2" />
      </g>

      {/* palm: leaning trunk + six fronds, origin at the base */}
      <g id="palm">
        <path d="M-7 0 C -12 -60 -2 -120 14 -168 L 24 -164 C 10 -118 2 -60 8 0 Z" />
        <g transform="translate(19 -166)">
          <path d="M0 0 C 30 -46 84 -52 122 -30 C 84 -34 44 -18 0 0 Z" />
          <path d="M0 0 C 46 -18 96 -2 118 34 C 84 16 40 8 0 0 Z" />
          <path d="M0 0 C 38 12 66 46 70 90 C 48 54 22 26 0 0 Z" />
          <path d="M0 0 C -34 -42 -86 -46 -120 -22 C -84 -28 -40 -14 0 0 Z" />
          <path d="M0 0 C -48 -12 -94 6 -112 44 C -80 22 -38 10 0 0 Z" />
          <path d="M0 0 C -30 20 -50 56 -46 96 C -32 58 -14 26 0 0 Z" />
          <circle cx="-4" cy="6" r="8" />
          <circle cx="8" cy="8" r="7" />
        </g>
      </g>

      {/* toucan on a branch, facing right, origin at the branch's left end */}
      <g id="toucan">
        <path d="M0 96 C 60 90 140 92 220 88 C 250 86 270 90 290 96 L 290 104 C 250 100 200 100 140 102 C 90 104 40 104 0 104 Z" />
        <ellipse cx="128" cy="52" rx="30" ry="42" />
        <circle cx="132" cy="6" r="24" />
        <path d="M150 -4 C 190 -12 232 0 244 26 C 232 28 210 22 190 20 C 176 20 162 16 152 12 Z" />
        <path d="M104 72 C 88 88 82 98 84 108 L 100 100 L 108 84 Z" />
        <path d="M118 92 L 116 100 M 136 92 L 138 100" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* small house with two windows and a chimney, origin top-left of the walls */}
      <g id="casita">
        <rect x="0" y="30" width="120" height="70" rx="2" />
        <path d="M-14 34 L60 -12 L134 34 Z" />
        <rect x="88" y="-2" width="16" height="30" />
        <rect className="window-pane" x="26" y="52" width="24" height="24" rx="2" />
        <rect className="window-pane" x="70" y="52" width="24" height="24" rx="2" />
        <rect x="53" y="66" width="14" height="34" fill="rgba(0,0,0,0.35)" />
      </g>
    </defs>
  );
}
