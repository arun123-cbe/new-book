import React, { useState } from 'react';
import { Award, CheckCircle2, BookOpen, Sparkles } from 'lucide-react';

interface AuthorPhotoCardProps {
  authorImageUrl?: string;
  authorName?: string;
  className?: string;
}

export const AuthorPhotoCard: React.FC<AuthorPhotoCardProps> = ({
  authorImageUrl,
  authorName = 'Arun Gowtham Prabhudas',
  className = ''
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      
      {/* Outer Glow Halo Frame */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600/20 via-indigo-500/10 to-amber-500/20 rounded-3xl blur-xl pointer-events-none" />

      <div className="relative w-full max-w-sm sm:max-w-md bg-stone-100/90 rounded-2xl border border-stone-300 p-4 sm:p-5 shadow-2xl space-y-4 overflow-hidden">
        
        {/* Top Header Badge */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-blue-800 font-bold bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Verified Author
          </span>
          <span className="text-stone-500 text-[11px] font-semibold">14+ Years Agency Leader</span>
        </div>

        {/* Photo Container */}
        <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-b from-stone-200 to-stone-300 border border-stone-300 shadow-inner flex flex-col items-center justify-center group">
          
          {authorImageUrl && !imgError ? (
            <img
              src={authorImageUrl}
              alt={`${authorName} holding Search Social and Systems book`}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center shadow-md"
            />
          ) : (
            /* High Precision Vector Illustration of Arun Gowtham Prabhudas holding his printed book */
            <svg
              viewBox="0 0 400 520"
              className="w-full h-full object-cover"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Warm Studio Background Gradient */}
                <linearGradient id="studioBg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d2c4b2" />
                  <stop offset="50%" stopColor="#bfae9b" />
                  <stop offset="100%" stopColor="#a3907a" />
                </linearGradient>

                {/* Skin Tones */}
                <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8d5538" />
                  <stop offset="50%" stopColor="#7a462b" />
                  <stop offset="100%" stopColor="#63361e" />
                </linearGradient>
                <linearGradient id="skinHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#a16445" />
                  <stop offset="100%" stopColor="#7a462b" />
                </linearGradient>

                {/* Shirt Cream Fabric */}
                <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#faf7f2" />
                  <stop offset="50%" stopColor="#f2ebe1" />
                  <stop offset="100%" stopColor="#e3d7c5" />
                </linearGradient>

                {/* Hair & Beard */}
                <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1a1817" />
                  <stop offset="100%" stopColor="#0d0c0c" />
                </linearGradient>

                {/* Book Shadow */}
                <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
                  <feDropShadow dx="6" dy="10" stdDeviation="8" floodColor="#000" floodOpacity="0.35" />
                </filter>
              </defs>

              {/* Background */}
              <rect width="400" height="520" fill="url(#studioBg)" />

              {/* Indoor Plant Leaves Background Detail (Left) */}
              <path d="M -20 180 Q 30 140 40 220 Q 0 260 -20 180 Z" fill="#3a5236" opacity="0.4" />
              <path d="M -10 240 Q 50 200 60 280 Q 10 320 -10 240 Z" fill="#2d422a" opacity="0.3" />

              {/* Torso - Arun's Cream Shirt */}
              <path
                d="M 60 520 C 60 400 110 350 200 340 C 290 350 340 400 340 520 Z"
                fill="url(#shirtGrad)"
              />
              {/* Shirt Collar & Placket */}
              <path d="M 160 355 L 200 395 L 240 355 L 220 340 L 200 355 L 180 340 Z" fill="#e8ded0" stroke="#d4c5b3" strokeWidth="2" />
              <path d="M 198 395 L 198 520" stroke="#d4c5b3" strokeWidth="2" strokeDasharray="12 12" />
              {/* Shirt Buttons */}
              <circle cx="198" cy="420" r="2.5" fill="#c4b5a3" />
              <circle cx="198" cy="455" r="2.5" fill="#c4b5a3" />
              <circle cx="198" cy="490" r="2.5" fill="#c4b5a3" />

              {/* Head & Neck */}
              <path d="M 170 320 C 170 360 230 360 230 320 Z" fill="#6d3c23" />
              <ellipse cx="200" cy="220" rx="65" ry="85" fill="url(#skinHighlight)" />

              {/* Ears */}
              <ellipse cx="132" cy="225" rx="10" ry="16" fill="#7a462b" />
              <ellipse cx="268" cy="225" rx="10" ry="16" fill="#7a462b" />

              {/* Hair (Arun's short dark hairstyle) */}
              <path
                d="M 130 200 C 130 120 270 120 270 200 C 265 150 250 135 200 135 C 150 135 135 150 130 200 Z"
                fill="url(#hairGrad)"
              />

              {/* Eyebrows */}
              <path d="M 155 185 Q 175 178 185 188" stroke="#1a1817" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M 215 188 Q 225 178 245 185" stroke="#1a1817" strokeWidth="4.5" strokeLinecap="round" fill="none" />

              {/* Eyes */}
              <ellipse cx="170" cy="202" rx="8" ry="6" fill="#fff" />
              <circle cx="170" cy="202" r="4.5" fill="#2c1a0e" />
              <circle cx="171.5" cy="200.5" r="1.5" fill="#fff" />

              <ellipse cx="230" cy="202" rx="8" ry="6" fill="#fff" />
              <circle cx="230" cy="202" r="4.5" fill="#2c1a0e" />
              <circle cx="231.5" cy="200.5" r="1.5" fill="#fff" />

              {/* Nose */}
              <path d="M 200 202 L 196 228 Q 200 232 204 228 Z" fill="#6d3c23" />

              {/* Beard and Mustache */}
              {/* Mustache */}
              <path d="M 178 242 Q 200 238 222 242 Q 200 252 178 242 Z" fill="#151413" />
              {/* Beard around jaw line */}
              <path
                d="M 135 220 C 135 285 170 300 200 300 C 230 300 265 285 265 220 C 265 270 230 292 200 292 C 170 292 135 270 135 220 Z"
                fill="#151413"
              />
              {/* Mouth */}
              <path d="M 186 256 Q 200 262 214 256" stroke="#522a18" strokeWidth="2.5" fill="none" />

              {/* Left Arm holding the book (Viewer's Left) */}
              <path d="M 60 460 Q 40 380 50 310 L 95 310 L 105 460 Z" fill="#7a462b" />
              {/* Black Wrist Watch */}
              <rect x="52" y="340" width="30" height="12" rx="3" fill="#1c1c1e" />
              <circle cx="67" cy="346" r="4" fill="#d1d5db" />

              {/* REAL PRINTED BOOK COVER (Held upright in hand) */}
              <g filter="url(#shadow)" transform="translate(30, 195) rotate(-2)">
                {/* Book Spine Edge (Left) */}
                <rect x="0" y="0" width="10" height="210" fill="#1e293b" rx="2" />
                {/* Book Front Cover (White Paperback) */}
                <rect x="8" y="0" width="138" height="210" fill="#ffffff" rx="3" stroke="#cbd5e1" strokeWidth="1" />

                {/* Cover Header */}
                <text x="77" y="28" textAnchor="middle" fill="#0f172a" fontFamily="serif" fontWeight="900" fontSize="11" letterSpacing="0.5">
                  SEARCH
                </text>
                <text x="77" y="41" textAnchor="middle" fill="#1e3a8a" fontFamily="serif" fontWeight="900" fontSize="12" letterSpacing="0.5">
                  SOCIAL
                </text>
                <text x="77" y="54" textAnchor="middle" fill="#0f172a" fontFamily="serif" fontWeight="900" fontSize="10" letterSpacing="0.5">
                  AND SYSTEMS
                </text>

                {/* Subtitle */}
                <text x="77" y="66" textAnchor="middle" fill="#334155" fontFamily="sans-serif" fontWeight="700" fontSize="3.5">
                  A PROFESSIONAL DIGITAL MARKETING
                </text>
                <text x="77" y="71" textAnchor="middle" fill="#334155" fontFamily="sans-serif" fontWeight="700" fontSize="3.5">
                  MASTER GUIDE FOR DIGITAL MARKETERS
                </text>

                {/* Central Flywheel Nodes Circle */}
                <circle cx="77" cy="112" r="28" fill="none" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2 2" />
                {/* Central Laptop Node */}
                <circle cx="77" cy="112" r="14" fill="#0f172a" />
                <rect x="71" y="107" width="12" height="8" rx="1" fill="#ffffff" opacity="0.9" />
                {/* 6 Peripheral Orbit Nodes */}
                <circle cx="77" cy="84" r="5" fill="#2563eb" /> {/* Search */}
                <circle cx="101" cy="98" r="5" fill="#ea580c" /> {/* Strategy */}
                <circle cx="101" cy="126" r="5" fill="#dc2626" /> {/* Growth */}
                <circle cx="77" cy="140" r="5" fill="#d97706" /> {/* Engagement */}
                <circle cx="53" cy="126" r="5" fill="#7c3aed" /> {/* Systems */}
                <circle cx="53" cy="98" r="5" fill="#16a34a" /> {/* Social */}

                {/* Lower Navy Banner */}
                <rect x="12" y="152" width="130" height="18" rx="3" fill="#0f172a" />
                <text x="77" y="163" textAnchor="middle" fill="#ffffff" fontFamily="sans-serif" fontWeight="800" fontSize="4.5" letterSpacing="0.5">
                  STRATEGIZE  •  EXECUTE  •  GROW
                </text>

                {/* Author Name */}
                <text x="77" y="186" textAnchor="middle" fill="#0f172a" fontFamily="sans-serif" fontWeight="900" fontSize="6.5" letterSpacing="0.8">
                  ARUN GOWTHAM
                </text>
                <text x="77" y="196" textAnchor="middle" fill="#0f172a" fontFamily="sans-serif" fontWeight="900" fontSize="6.5" letterSpacing="0.8">
                  PRABHUDAS
                </text>
              </g>

              {/* Hand Holding Book Fingers (Over book edge) */}
              <g fill="#7a462b">
                <rect x="25" y="310" width="18" height="10" rx="4" />
                <rect x="25" y="322" width="20" height="10" rx="4" />
                <rect x="25" y="334" width="20" height="10" rx="4" />
                <rect x="28" y="346" width="16" height="9" rx="4" />
              </g>

              {/* Right Hand Pointing at the Book (Viewer's Right) */}
              <g fill="#7a462b">
                {/* Arm / Wrist */}
                <path d="M 330 460 C 310 420 280 370 240 330 L 220 345 L 300 480 Z" />
                {/* Hand Palm */}
                <ellipse cx="230" cy="335" rx="16" ry="12" />
                {/* Index Finger pointing towards book */}
                <path d="M 230 326 C 210 320 185 315 170 310 C 165 308 165 316 170 318 C 185 324 210 332 230 336 Z" />
                {/* Folded Fingers */}
                <circle cx="234" cy="338" r="5" />
                <circle cx="238" cy="344" r="5" />
                <circle cx="242" cy="350" r="5" />
              </g>
            </svg>
          )}

          {/* Floating Badge overlay over photo */}
          <div className="absolute bottom-3 left-3 right-3 p-2.5 bg-slate-900/85 backdrop-blur-md rounded-lg text-white text-center border border-slate-700/60 shadow-lg">
            <div className="text-xs font-bold font-serif tracking-tight text-amber-300">
              {authorName}
            </div>
            <div className="text-[10px] font-mono text-slate-300 flex items-center justify-center gap-1">
              <BookOpen className="w-3 h-3 text-blue-400" /> Holding Official Paperback Edition
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="text-center space-y-1">
          <div className="text-xs font-bold text-slate-900 flex items-center justify-center gap-1.5 font-serif">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Digital Marketing Author &amp; Strategist
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            Bridging academic theories with real agency growth systems
          </p>
        </div>

      </div>

    </div>
  );
};
