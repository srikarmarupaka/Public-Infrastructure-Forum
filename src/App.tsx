import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { AboutSection } from './components/AboutSection';
import { AgendasSection } from './components/AgendasSection';
import { ResearchSection } from './components/ResearchSection';
import { DispatchesSection } from './components/DispatchesSection';
import { AuditsSection } from './components/AuditsSection';
import { AdminPanel } from './components/AdminPanel';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { AuthPortal } from './components/AuthPortal';
import { motion, AnimatePresence } from 'motion/react';

function DashboardLayout() {
  const { activeTab, isLoading, t } = useApp();
  const [showAuthPortal, setShowAuthPortal] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-natural-bg flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-natural-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-mono text-xs text-natural-secondary tracking-wider font-semibold">
          {t.loading}
        </p>
      </div>
    );
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <AboutSection />;
      case 'agendas':
        return <AgendasSection />;
      case 'research':
        return <ResearchSection />;
      case 'dispatches':
        return <DispatchesSection />;
      case 'audits':
        return <AuditsSection />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <AboutSection />;
    }
  };

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text font-sans selection:bg-natural-primary selection:text-white flex flex-col justify-between">
      <div>
        {/* Core navbar navigation */}
        <Header onOpenPortal={() => setShowAuthPortal(true)} />

        {/* Transitional Active Workspace Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {renderActiveScreen()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Footer Block */}
      <div>
        {activeTab === 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
            <NewsletterSection />
          </div>
        )}
        <Footer />
      </div>

      {/* Authentication Gateway dialog modal */}
      {showAuthPortal && (
        <AuthPortal onClose={() => setShowAuthPortal(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <DashboardLayout />
    </AppProvider>
  );
}
