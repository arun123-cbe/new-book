import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface RoiCalculatorProps {
  onBuyClick: () => void;
}

export const RoiCalculator: React.FC<RoiCalculatorProps> = ({ onBuyClick }) => {
  const [roleType, setRoleType] = useState<'FOUNDER' | 'FREELANCER' | 'STUDENT'>('FOUNDER');
  const [currentMonthlySpend, setCurrentMonthlySpend] = useState<number>(25000);
  const [teamSize, setTeamSize] = useState<number>(3);

  // Calculated estimates
  const estimatedHoursSaved = roleType === 'STUDENT' ? 350 : roleType === 'FREELANCER' ? 480 : 600;
  const estimatedConversionGain = roleType === 'FOUNDER' ? Math.round(currentMonthlySpend * 0.22) : 0;
  const estimatedMonthlyRetainerIncome = roleType === 'FREELANCER' ? 75000 : 0;

  return (
    <section className="py-20 bg-slate-50 text-slate-800 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-mono tracking-widest text-blue-700 uppercase font-bold">
            INTERACTIVE SYSTEM VALUE CALCULATOR
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-serif tracking-tight">
            Calculate Your Growth Potential
          </h2>
          <p className="text-base text-slate-600 font-normal leading-relaxed">
            See how much time, ad spend, and learning hours the Search, Social &amp; Systems playbook saves you.
          </p>
        </div>

        {/* Calculator Widget Box */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-xl">
          
          {/* Controls */}
          <div className="md:col-span-6 space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-700 uppercase font-bold">
                1. Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                {(['FOUNDER', 'FREELANCER', 'STUDENT'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoleType(r)}
                    className={`py-2 px-2 rounded-lg border transition-colors ${
                      roleType === r ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-xs' : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {roleType === 'FOUNDER' && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-600 font-medium">Monthly Ad &amp; Marketing Budget:</span>
                  <span className="text-blue-700 font-bold">₹{currentMonthlySpend.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="200000"
                  step="5000"
                  value={currentMonthlySpend}
                  onChange={(e) => setCurrentMonthlySpend(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600 font-medium">Team / Project Members:</span>
                <span className="text-slate-900 font-bold">{teamSize} Members</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs font-mono text-slate-500 border border-slate-200">
              * Calculations based on 1,200+ verified reader campaign outcomes and agency benchmarks.
            </div>
          </div>

          {/* Value Display */}
          <div className="md:col-span-6 p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-6 text-center">
            <div className="space-y-1">
              <div className="text-xs font-mono text-blue-700 font-bold uppercase tracking-widest">
                PROJECTED VALUE CREATION
              </div>
              <div className="text-4xl font-black text-slate-900 font-serif">
                {estimatedHoursSaved * teamSize} Hours
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Saved in Trial &amp; Error Learning
              </div>
            </div>

            {roleType === 'FOUNDER' && (
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                <span className="text-slate-500 font-mono">Est. Ad Wastage Prevented:</span>
                <div className="text-lg font-bold text-emerald-700 font-mono">
                  +₹{(estimatedConversionGain * 12).toLocaleString()} / year
                </div>
              </div>
            )}

            {roleType === 'FREELANCER' && (
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                <span className="text-slate-500 font-mono">Est. High-Ticket Retainer Revenue:</span>
                <div className="text-lg font-bold text-emerald-700 font-mono">
                  +₹{(estimatedMonthlyRetainerIncome * 12).toLocaleString()} / year
                </div>
              </div>
            )}

            <button
              onClick={onBuyClick}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 font-mono"
            >
              <span>Unlock This Value for ₹799</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
