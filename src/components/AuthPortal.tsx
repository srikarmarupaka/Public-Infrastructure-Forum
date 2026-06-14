import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, LogIn, X, Mail, Lock, AlertCircle, Info } from 'lucide-react';

interface AuthPortalProps {
  onClose: () => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({ onClose }) => {
  const { googleSignIn, emailSignIn, t } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please fill in both email and password.");
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      await emailSignIn(email, password);
      onClose();
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to authenticate. Correct login required.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await googleSignIn();
      onClose();
    } catch (e: any) {
      setErrorMsg("Google login unsuccessful or closed by user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-natural-text/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-natural-border shadow-2xl rounded-2xl w-full max-w-sm overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-natural-muted rounded-lg text-natural-secondary hover:text-natural-text transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-2 text-center">
            <div className="mx-auto w-10 h-10 bg-natural-muted rounded-full flex items-center justify-center text-natural-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-sans font-extrabold text-sm md:text-base text-natural-text uppercase tracking-wide">
              {t.sign_in}
            </h3>
            <p className="text-[11px] text-natural-secondary font-light">
              Admin entry for Public Infrastructure Forum core members.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-[11px] flex items-start space-x-1.5 border border-red-100 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Core admin account info tip */}
          <div className="bg-natural-accent-light/30 border border-natural-accent/15 p-3 rounded-lg text-[10px] text-natural-accent flex items-start space-x-1.5 leading-relaxed">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-natural-accent" />
            <div>
              <span className="font-bold">Bootstrapped Administrator Email:</span>
              <p className="font-mono bg-white/70 px-1 py-0.5 rounded mt-0.5 border border-natural-accent/20 text-[9px] text-natural-text">
                srikarsharmamarupaka@gmail.com
              </p>
              <p className="mt-1">To test admin features, sign in using Google Auth with this account or use standard credentials.</p>
            </div>
          </div>

          {/* Social login option */}
          <button
            onClick={handleGoogleClick}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-2.5 bg-natural-primary text-white hover:bg-natural-primary-hover border border-natural-primary-hover rounded-lg text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <LogIn className="w-4 h-4 text-white" />
            <span>{loading ? "Authenticating..." : "Sign In with Google"}</span>
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-natural-border"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-mono text-natural-secondary">Or alternate</span>
            <div className="flex-grow border-t border-natural-border"></div>
          </div>

          {/* Traditional email/pass form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[9px] font-mono uppercase text-natural-secondary font-bold block">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pr-3 pointer-events-none text-natural-secondary">
                  <Mail className="w-3.5 h-3.5" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sec.org.in"
                  className="w-full text-xs pl-9 pr-3 py-2 border border-natural-border rounded-lg bg-white text-natural-text focus:outline-none focus:border-natural-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono uppercase text-natural-secondary font-bold block">Access Code</label>
              <div className="relative block">
                <span className="absolute inset-y-0 left-3 flex items-center pr-3 pointer-events-none text-natural-secondary">
                  <Lock className="w-3.5 h-3.5" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-9 pr-3 py-2 border border-natural-border rounded-lg bg-white text-natural-text focus:outline-none focus:border-natural-primary"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-center py-2 bg-white hover:bg-natural-muted text-natural-text border border-natural-border rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              Sign In with Email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
