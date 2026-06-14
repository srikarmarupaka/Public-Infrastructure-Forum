import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const { t, submitSubscriber } = useApp();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'invalid'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setStatus('invalid');
      return;
    }

    setStatus('loading');
    try {
      await submitSubscriber(email);
      setStatus('success');
      setEmail('');
    } catch (err) {
      console.error(err);
      setStatus('invalid');
    }
  };

  return (
    <section className="bg-natural-primary text-white rounded-2xl p-6 md:p-12 relative overflow-hidden border border-natural-primary-hover shadow-xs">
      <div className="absolute inset-x-0 bottom-0 top-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
      
      <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-widest bg-white/10 text-white/90 border border-white/20">
          Monthly Dispatches
        </span>
        
        <h3 className="font-sans font-extrabold text-xl md:text-3xl tracking-tight text-white">
          {t.subscribe}
        </h3>
        
        <p className="text-xs md:text-sm text-[#F5F4EF]/80 font-light max-w-xl mx-auto leading-relaxed">
          Receive localized engineering reports, municipal scorecard developments, policy briefings, and upcoming field audit announcements. Zero spam, unsubscribe with one click.
        </p>

        {status === 'success' ? (
          <div className="bg-white/10 border border-white/20 rounded-lg p-4 max-w-md mx-auto flex items-center space-x-3 text-emerald-300">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p className="text-xs text-left font-medium leading-normal">{t.subscribe_success}</p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto space-y-2">
            <div className="flex bg-white/5 p-1 rounded-lg border border-white/20 focus-within:ring-1 focus-within:ring-white/40">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'invalid') setStatus('idle');
                }}
                placeholder={t.email_placeholder}
                className="flex-1 bg-transparent text-xs text-white px-3 py-2.5 outline-none font-sans font-light placeholder-white/50"
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-4 bg-white hover:bg-natural-muted text-natural-primary rounded-md font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm"
              >
                <span>{status === 'loading' ? 'Joining...' : 'Subscribe'}</span>
                <Send className="w-3 h-3 text-natural-primary" />
              </button>
            </div>

            {status === 'invalid' && (
              <div className="flex items-center justify-center space-x-1 p-1.5 text-xs text-amber-200 font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{t.subscribe_error}</span>
              </div>
            )}
          </form>
        )}
      </div>
    </section>
  );
};
