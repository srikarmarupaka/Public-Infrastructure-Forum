import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Menu, X, Globe, LogIn, LogOut, Shield } from 'lucide-react';

interface HeaderProps {
  onOpenPortal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPortal }) => {
  const { language, setLanguage, activeTab, setActiveTab, user, isAdmin, logOut, t } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'home', label: t.home },
    { id: 'agendas', label: t.agendas },
    { id: 'research', label: t.research },
    { id: 'dispatches', label: t.dispatches },
    { id: 'audits', label: t.citizen_audits },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FDFCF9] border-b border-natural-border backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="flex-shrink-0 bg-natural-primary text-white rounded-sm p-2 flex items-center justify-center font-mono text-sm tracking-widest font-bold">
              P
            </div>
            <div>
              <span className="font-sans font-bold text-sm tracking-tight text-natural-text block sm:inline uppercase">
                PIF <span className="font-normal text-natural-secondary">FORUM</span>
              </span>
              <span className="text-[10px] text-natural-secondary font-mono uppercase block tracking-wider">
                Civic Accountability Collective
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 items-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-natural-primary text-white shadow-xs'
                    : 'text-natural-secondary hover:text-natural-text hover:bg-natural-muted'
                }`}
              >
                {tab.label}
              </button>
            ))}

            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center space-x-1 px-3 py-2 rounded text-xs font-semibold ${
                  activeTab === 'admin'
                    ? 'bg-red-700 text-white shadow-sm'
                    : 'text-red-700 hover:text-red-900 hover:bg-red-50'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{t.admin_panel}</span>
              </button>
            )}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language toggle button */}
            <div className="flex bg-natural-muted p-0.5 rounded border border-natural-border">
              <button
                onClick={() => setLanguage('EN')}
                className={`px-2 py-1 text-[10px] rounded font-mono font-bold transition-all ${
                  language === 'EN' ? 'bg-white text-natural-text shadow-xs' : 'text-natural-secondary hover:text-natural-text'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('HI')}
                className={`px-2 py-1 text-[10px] rounded font-semibold transition-all ${
                  language === 'HI' ? 'bg-white text-natural-text shadow-xs' : 'text-natural-secondary hover:text-natural-text'
                }`}
              >
                हिं
              </button>
            </div>

            {/* Authentication state */}
            {user ? (
              <div className="flex items-center space-x-2">
                {user.isAnonymous ? (
                  <span className="text-[10px] font-mono text-natural-secondary bg-natural-muted px-2 py-1 rounded border border-natural-border">
                    Guest
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-medium text-natural-primary bg-[#F0F2EE] px-2 py-1 rounded max-w-[124px] truncate border border-natural-border">
                    {user.email}
                  </span>
                )}
                <button
                  onClick={logOut}
                  className="p-1.5 hover:bg-natural-muted rounded text-natural-secondary hover:text-natural-text transition-colors"
                  title={t.sign_out}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenPortal}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-natural-dark-secondary hover:text-natural-text border border-natural-border rounded bg-white hover:bg-natural-muted transition-all font-medium"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t.sign_in}</span>
              </button>
            )}
          </div>

          {/* Mobile menu Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <div className="flex bg-natural-muted p-0.5 rounded border border-natural-border">
              <button
                onClick={() => setLanguage('EN')}
                className={`px-1.5 py-0.5 text-[9px] rounded font-mono font-bold ${
                  language === 'EN' ? 'bg-white text-natural-text' : 'text-natural-secondary'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('HI')}
                className={`px-1.5 py-0.5 text-[9px] rounded font-semibold ${
                  language === 'HI' ? 'bg-white text-natural-text' : 'text-natural-secondary'
                }`}
              >
                हिं
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border border-natural-border rounded bg-white hover:bg-natural-muted text-natural-dark-secondary focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-natural-border bg-[#FDFCF9] py-3 px-4">
          <div className="flex flex-col space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded text-xs transition-colors ${
                  activeTab === tab.id
                    ? 'bg-natural-primary text-white font-medium'
                    : 'text-natural-secondary hover:bg-natural-muted'
                }`}
              >
                {tab.label}
              </button>
            ))}

            {isAdmin && (
              <button
                onClick={() => {
                  setActiveTab('admin');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100`}
              >
                🛡️ {t.admin_panel}
              </button>
            )}

            <div className="pt-2 border-t border-natural-border mt-2 flex items-center justify-between">
              {user ? (
                <div className="flex items-center space-x-2 w-full justify-between">
                  <span className="text-[10px] font-mono text-natural-secondary truncate max-w-[200px]">
                    {user.isAnonymous ? 'Guest User' : user.email}
                  </span>
                  <button
                    onClick={() => {
                      logOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-1 text-xs text-red-600 font-medium py-1 px-3 border border-red-200 rounded bg-red-50"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onOpenPortal();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center space-x-1 w-full py-1.5 border border-natural-border rounded text-xs font-medium text-natural-dark-secondary bg-white hover:bg-natural-muted"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t.sign_in}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
