import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import TechnicalDrawingBackground from '../TechnicalDrawingBackground';

export default function AdminLogin({ onLoginSuccess }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsAuthenticating(true);

    setTimeout(() => {
      // Default CAD admin passcode (cad2026 or admin)
      if (passcode.trim() === 'cad2026' || passcode.trim() === 'admin') {
        onLoginSuccess();
      } else {
        setError('ACCESS DENIED // INVALID DECRYPTION PASSCODE');
        setIsAuthenticating(false);
      }
    }, 600);
  };

  return (
    <div className="relative min-h-screen bg-[#181717] text-white flex flex-col items-center justify-center p-6 select-none overflow-hidden">
      <TechnicalDrawingBackground />

      <div className="relative z-10 w-full max-w-md bg-neutral-900/90 border border-neutral-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
        {/* Header Badge */}
        <div className="flex items-center gap-3 border-b border-neutral-800 pb-5 mb-6">
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-pixel-custom text-xl text-white tracking-wide">ADMIN PORTAL</h1>
            <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mt-0.5">
              [ CAD SYSTEM DECRYPTION AUTH ]
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
          <div>
            <label className="block text-neutral-400 uppercase tracking-widest mb-2">
              ENTER ACCESS PASSCODE
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Passcode (default: cad2026)"
              required
              autoFocus
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 font-mono text-[11px]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full py-3.5 px-6 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20 disabled:opacity-50"
          >
            {isAuthenticating ? (
              <span>AUTHENTICATING...</span>
            ) : (
              <>
                <span>DECRYPT PORTAL</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-4 border-t border-neutral-800/80 flex items-center justify-between font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
          <span>PORTFOLIO_V2 // CMS</span>
          <span className="flex items-center gap-1.5 text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>SECURE SESSION</span>
          </span>
        </div>
      </div>
    </div>
  );
}
