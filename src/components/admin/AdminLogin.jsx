import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck, Mail, Key, AlertTriangle, ArrowLeft } from 'lucide-react';
import TechnicalDrawingBackground from '../TechnicalDrawingBackground';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useSound } from '../../hooks/useSound';
import { click002Sound } from '../../sounds/click-002';

const ALLOWED_ADMIN_EMAILS = ['ogundipeayodeji00@gmail.com'];

export default function AdminLogin({ onLoginSuccess, onBackToPortfolio }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passcode, setPasscode] = useState(''); // Only used in local fallback mode
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [playClick] = useSound(click002Sound);

  const isConfigured = isSupabaseConfigured();

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsAuthenticating(true);
    playClick();

    // 1. Supabase Cloud Authentication Mode
    if (isConfigured && supabase) {
      try {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (authError) {
          setError(`ACCESS DENIED // ${authError.message.toUpperCase()}`);
          setIsAuthenticating(false);
          return;
        }

        if (data?.user) {
          const userEmail = data.user.email?.toLowerCase();
          if (!ALLOWED_ADMIN_EMAILS.includes(userEmail)) {
            await supabase.auth.signOut();
            setError('ACCESS DENIED // UNAUTHORIZED ADMIN ACCOUNT');
            setIsAuthenticating(false);
            return;
          }

          onLoginSuccess(data.user);
        }
      } catch (err) {
        setError(`DECRYPTION EXCEPTION // ${err.message?.toUpperCase() || 'NETWORK ERROR'}`);
        setIsAuthenticating(false);
      }
      return;
    }

    // 2. Offline / Local Fallback Mode (When Supabase is not yet configured)
    setTimeout(() => {
      if (passcode.trim() === 'cad2026' || passcode.trim() === 'admin') {
        onLoginSuccess({ email: 'local-admin@cad.system' });
      } else {
        setError('ACCESS DENIED // INVALID DECRYPTION PASSCODE');
        setIsAuthenticating(false);
      }
    }, 500);
  };

  return (
    <div className="relative min-h-screen bg-[#181717] text-white flex flex-col items-center justify-center p-4 sm:p-6 select-none overflow-hidden font-mono">
      <TechnicalDrawingBackground />

      <div className="relative z-10 w-full max-w-md bg-neutral-900/95 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        {/* Header Badge */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-pixel-custom text-xl text-white tracking-wide">ADMIN PORTAL</h1>
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest mt-0.5">
                [ SECURE CAD SYSTEM AUTH ]
              </p>
            </div>
          </div>

          {onBackToPortfolio && (
            <button
              type="button"
              onClick={() => {
                playClick();
                onBackToPortfolio();
              }}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-[10px] text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Return to Main Website"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN</span>
            </button>
          )}
        </div>

        {/* Supabase Status Indicator */}
        <div className="mb-6 flex items-center justify-between px-3.5 py-2 rounded-xl bg-neutral-950/80 border border-neutral-800 text-[10px] uppercase tracking-wider">
          <span className="text-neutral-500">AUTH PROVIDER:</span>
          {isConfigured ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SUPABASE CLOUD AUTH
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <AlertTriangle className="w-3 h-3" />
              OFFLINE / LOCAL MODE
            </span>
          )}
        </div>

        {/* Cloud Login Form: Strict Email & Password */}
        {isConfigured && (
          <form onSubmit={handlePasswordLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-400 uppercase tracking-widest text-[10px] mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-blue-400" />
                <span>ADMIN EMAIL</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ogundipeayodeji00@gmail.com"
                required
                autoFocus
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-neutral-400 uppercase tracking-widest text-[10px] mb-1.5 flex items-center gap-1.5">
                <Key className="w-3 h-3 text-blue-400" />
                <span>PASSWORD</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-[11px] leading-relaxed">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20 disabled:opacity-50 mt-2"
            >
              {isAuthenticating ? (
                <span>DECRYPTING CREDENTIALS...</span>
              ) : (
                <>
                  <span>LOGIN WITH SUPABASE</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Offline Fallback Login Form (When Supabase is not configured) */}
        {!isConfigured && (
          <form onSubmit={handlePasswordLogin} className="space-y-4 text-xs">
            <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl text-[11px] text-neutral-400 space-y-1.5 leading-relaxed">
              <p className="text-amber-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>SUPABASE KEYS NOT DETECTED</span>
              </p>
              <p>
                Add <code className="text-blue-300">VITE_SUPABASE_URL</code> & <code className="text-blue-300">VITE_SUPABASE_ANON_KEY</code> to your environment to enable real cloud auth.
              </p>
            </div>

            <div>
              <label className="block text-neutral-400 uppercase tracking-widest text-[10px] mb-1.5">
                OFFLINE EMERGENCY PASSCODE
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Passcode (default: cad2026)"
                required
                autoFocus
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-[11px]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-600/20 disabled:opacity-50"
            >
              {isAuthenticating ? (
                <span>VERIFYING PASSCODE...</span>
              ) : (
                <>
                  <span>ENTER OFFLINE PORTAL</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="mt-8 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-[10px] text-neutral-500 uppercase tracking-widest">
          <span>PORTFOLIO_V2 // CMS</span>
          <span className="flex items-center gap-1.5 text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>SESSION ENCRYPTED</span>
          </span>
        </div>
      </div>
    </div>
  );
}
