import React, { useState } from 'react';
import { 
  Search, Target, TrendingUp, Megaphone, Settings, Users, Laptop,
  BookOpen, Sparkles, ShieldCheck, Check
} from 'lucide-react';

interface BookMockupProps {
  onOrderClick?: () => void;
  onPreviewClick?: () => void;
  interactive?: boolean;
}

export const BookMockup3D: React.FC<BookMockupProps> = ({
  onOrderClick,
  onPreviewClick,
  interactive = true
}) => {
  const [rotateX, setRotateX] = useState(-4);
  const [rotateY, setRotateY] = useState(14);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Smooth tilt
    setRotateY(((x - centerX) / centerX) * 18);
    setRotateX(-((y - centerY) / centerY) * 12);
  };

  const handleMouseLeave = () => {
    setRotateX(-4);
    setRotateY(14);
  };

  return (
    <div 
      className="relative group perspective-1000 py-6 px-4 flex flex-col items-center justify-center cursor-pointer select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onPreviewClick}
    >
      {/* Background warm desk lighting glow halo */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-neutral-900/60 to-emerald-950/20 rounded-full blur-3xl pointer-events-none transform scale-95 group-hover:scale-105 transition-transform duration-700 opacity-80" />

      {/* 3D Book Box */}
      <div
        className="relative transition-transform duration-300 ease-out transform-gpu"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(0deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Front Cover Container - Authentic White Paperback matching photo */}
        <div 
          className="relative w-68 sm:w-76 md:w-84 min-h-[460px] sm:min-h-[500px] md:min-h-[540px] rounded-r-md bg-white text-slate-900 p-5 sm:p-6 flex flex-col justify-between border-r-2 border-t border-b border-slate-300 shadow-2xl overflow-hidden select-none"
          style={{
            boxShadow: '20px 30px 60px -10px rgba(0, 0, 0, 0.85), -3px 0 12px rgba(0, 0, 0, 0.15) inset'
          }}
        >
          {/* Subtle paper finish sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-200/40 via-transparent to-white/90 pointer-events-none" />

          {/* Book Spine Shadow Left Edge */}
          <div className="absolute left-0 top-0 bottom-0 w-3.5 bg-gradient-to-r from-slate-400/80 via-slate-200/30 to-transparent z-20 border-r border-slate-300/60" />

          {/* Top Section: Title & Subtitle from exact photo */}
          <div className="relative z-10 text-center space-y-1 pt-1">
            <h1 className="text-3xl sm:text-4xl md:text-[2.65rem] font-black tracking-tight text-[#0F1E36] font-sans leading-none uppercase">
              SEARCH
            </h1>
            <h1 className="text-3xl sm:text-4xl md:text-[2.65rem] font-black tracking-tight text-[#1E3A8A] font-sans leading-none uppercase">
              SOCIAL
            </h1>
            <h1 className="text-2xl sm:text-3xl md:text-[2.2rem] font-black tracking-tight text-[#0F1E36] font-sans leading-none uppercase">
              AND SYSTEMS
            </h1>

            {/* Subtitle */}
            <div className="pt-2">
              <p className="text-[10px] sm:text-[11px] font-bold text-[#1E3A8A] tracking-wider uppercase leading-tight font-sans">
                A PROFESSIONAL DIGITAL MARKETING MASTER GUIDE FOR DIGITAL MARKETERS
              </p>
            </div>
          </div>

          {/* Center Flywheel Diagram matching exact book picture */}
          <div className="relative z-10 my-3 py-2 px-1 flex flex-col items-center justify-center">
            
            <div className="relative w-44 sm:w-52 h-44 sm:h-52 flex items-center justify-center">
              
              {/* Outer Dashed Orbit Circle */}
              <div className="absolute inset-2 border-2 border-dashed border-slate-400 rounded-full" />

              {/* Center Node: Laptop with Analytics */}
              <div className="relative z-10 w-22 sm:w-24 h-22 sm:h-24 rounded-full bg-gradient-to-b from-[#1E3A8A] to-[#0F172A] p-2 flex flex-col items-center justify-center shadow-lg border-2 border-blue-400 text-white">
                <Laptop className="w-6 h-6 text-blue-300" />
                <div className="flex items-end gap-0.5 mt-1">
                  <span className="w-1.5 h-3 bg-blue-400 rounded-t-sm" />
                  <span className="w-1.5 h-5 bg-emerald-400 rounded-t-sm" />
                  <span className="w-1.5 h-2 bg-amber-400 rounded-t-sm" />
                  <span className="w-1.5 h-4 bg-purple-400 rounded-t-sm" />
                </div>
              </div>

              {/* 6 Outer Nodes around orbit */}
              {/* 1. Top Center: SEARCH */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 flex flex-col items-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow border border-white">
                  <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="text-[8px] font-black text-[#0F172A] tracking-tighter leading-none mt-0.5">SEARCH</div>
                <div className="text-[7px] text-slate-600 leading-none scale-90">Get Found</div>
              </div>

              {/* 2. Top Right: STRATEGY */}
              <div className="absolute top-4 right-0 translate-x-1 flex flex-col items-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#EA580C] text-white flex items-center justify-center shadow border border-white">
                  <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="text-[8px] font-black text-[#0F172A] tracking-tighter leading-none mt-0.5">STRATEGY</div>
                <div className="text-[7px] text-slate-600 leading-none scale-90">Plan Smart</div>
              </div>

              {/* 3. Bottom Right: GROWTH */}
              <div className="absolute bottom-4 right-0 translate-x-1 flex flex-col items-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#DC2626] text-white flex items-center justify-center shadow border border-white">
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="text-[8px] font-black text-[#0F172A] tracking-tighter leading-none mt-0.5">GROWTH</div>
                <div className="text-[7px] text-slate-600 leading-none scale-90">Drive Results</div>
              </div>

              {/* 4. Bottom Center: ENGAGEMENT */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 flex flex-col items-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#D97706] text-white flex items-center justify-center shadow border border-white">
                  <Megaphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="text-[8px] font-black text-[#0F172A] tracking-tighter leading-none mt-0.5">ENGAGEMENT</div>
                <div className="text-[7px] text-slate-600 leading-none scale-90">Create Impact</div>
              </div>

              {/* 5. Bottom Left: SYSTEMS */}
              <div className="absolute bottom-4 left-0 -translate-x-1 flex flex-col items-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#7C3AED] text-white flex items-center justify-center shadow border border-white">
                  <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="text-[8px] font-black text-[#0F172A] tracking-tighter leading-none mt-0.5">SYSTEMS</div>
                <div className="text-[7px] text-slate-600 leading-none scale-90">Automate &amp; Scale</div>
              </div>

              {/* 6. Top Left: SOCIAL */}
              <div className="absolute top-4 left-0 -translate-x-1 flex flex-col items-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#16A34A] text-white flex items-center justify-center shadow border border-white">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="text-[8px] font-black text-[#0F172A] tracking-tighter leading-none mt-0.5">SOCIAL</div>
                <div className="text-[7px] text-slate-600 leading-none scale-90">Build Connections</div>
              </div>

            </div>

            {/* Bottom 3-part Action Bar matching exact photo */}
            <div className="mt-2 w-full bg-[#0F223D] rounded-md p-1.5 grid grid-cols-3 gap-1 text-[#F8FAFC]">
              <div className="flex items-center gap-1 text-[8px] border-r border-slate-700 pr-1">
                <Target className="w-3 h-3 text-blue-300 flex-shrink-0" />
                <div>
                  <div className="font-bold leading-none">STRATEGIZE</div>
                  <div className="text-[6.5px] text-slate-300 scale-90 leading-none">Plan with purpose</div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[8px] border-r border-slate-700 px-1">
                <Settings className="w-3 h-3 text-purple-300 flex-shrink-0" />
                <div>
                  <div className="font-bold leading-none">EXECUTE</div>
                  <div className="text-[6.5px] text-slate-300 scale-90 leading-none">Implement precision</div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[8px] pl-1">
                <TrendingUp className="w-3 h-3 text-emerald-300 flex-shrink-0" />
                <div>
                  <div className="font-bold leading-none">GROW</div>
                  <div className="text-[6.5px] text-slate-300 scale-90 leading-none">Scale with systems</div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Author Name matching exact photo */}
          <div className="relative z-10 pt-2 border-t-2 border-slate-900 text-center">
            <h2 className="text-base sm:text-lg font-black tracking-wider text-[#0F172A] font-sans uppercase">
              ARUN GOWTHAM PRABHUDAS
            </h2>
          </div>

        </div>

        {/* 3D Pages Thickness (Right Side of Paperback) */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-8 bg-slate-100 border-l border-r border-slate-300 transform translate-x-full origin-left rotate-y-90 flex flex-col justify-between py-2 shadow-inner overflow-hidden"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, #ffffff, #ffffff 1px, #f1f5f9 1px, #f1f5f9 2px)'
          }}
        >
          {/* Page lines texture */}
          <div className="h-full w-full opacity-40 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:4px_4px]" />
        </div>

        {/* 3D Spine (Left Side of Book) */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-8 bg-[#0F1E36] border-r border-slate-800 transform -translate-x-full origin-right -rotate-y-90 flex flex-col justify-between items-center py-8 text-white font-sans text-[10px] tracking-widest uppercase shadow-2xl"
        >
          <span className="rotate-90 origin-center whitespace-nowrap font-bold text-white tracking-widest">
            SEARCH SOCIAL AND SYSTEMS
          </span>
          <span className="rotate-90 origin-center whitespace-nowrap text-amber-300 font-bold">
            ARUN GOWTHAM PRABHUDAS
          </span>
        </div>
      </div>

      {/* Interactive Hover Prompt */}
      <div className="mt-6 flex items-center gap-3 text-xs text-neutral-400 font-mono">
        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-950/80 px-3 py-1.5 rounded-full border border-emerald-800">
          <BookOpen className="w-3.5 h-3.5" /> Official Paperback Cover • Click to Read Samples
        </span>
      </div>
    </div>
  );
};

