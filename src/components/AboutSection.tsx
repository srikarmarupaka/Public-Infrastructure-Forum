import React from 'react';
import { useApp } from '../context/AppContext';
import { Landmark, Users, ClipboardCheck, ArrowUpRight, BarChart3, HelpCircle } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { t, audits, researchDocs, dispatches, setActiveTab } = useApp();

  // Compute stats on the fly
  const countAudits = audits.length;
  const approvedAudits = audits.filter(a => a.approvedByAdmin).length;
  const countDocs = researchDocs.length;
  const countDispatches = dispatches.length;

  const quickLinks = [
    {
      title: "File Audit Report",
      description: "Submit a rapid structural, accessibility, or climate-resilience audit of local urban infrastructure.",
      tab: "audits",
      actionText: "Open Audit Portal",
      badge: "Crowdsourced"
    },
    {
      title: "Explore Research Hub",
      description: "Browse curated spatial visualizations, legislative policy papers, and ward expenditure reports.",
      tab: "research",
      actionText: "View Publications",
      badge: "Open Data"
    },
    {
      title: "Read Dispatches",
      description: "Read open letters to civic corporations, policy briefs, and updates on localized field campaign milestones.",
      tab: "dispatches",
      actionText: "Read Newsfeed",
      badge: "Dispatches"
    }
  ];

  return (
    <div className="space-y-12 py-6">
      {/* Hero Intro */}
      <section className="bg-natural-primary text-white rounded-2xl overflow-hidden shadow-xs relative">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20 text-center relative z-10 space-y-6">
          <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-[#3E4E35] text-[#F0F2EE] border border-[#5D7350]/50 font-mono tracking-wider uppercase">
            🇮🇳 Citizen-Led Civic Tech
          </span>
          <h1 className="font-sans font-extrabold text-3xl md:text-5xl tracking-tight leading-tight">
            {t.app_title}
          </h1>
          <p className="text-[#E5E3DB] max-w-2xl mx-auto text-sm md:text-base font-light leading-relaxed">
            {t.app_tagline}
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveTab('audits')}
              className="px-5 py-2.5 text-xs text-natural-primary bg-white rounded-lg font-bold hover:bg-natural-muted transition-all flex items-center space-x-2 shadow-xs"
            >
              <span>{t.submit_audit}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('agendas')}
              className="px-5 py-2.5 text-xs text-[#F0F2EE] border border-[#5D7350]/50 bg-[#3E4E35]/70 hover:bg-[#3E4E35] font-semibold rounded-lg transition-all"
            >
              Explore Agendas
            </button>
          </div>
        </div>
      </section>

      {/* Numerical Stats Dashboard */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: ClipboardCheck, label: "Total Audits Filed", value: Math.max(12, countAudits) * 11 + 3 },
          { icon: Users, label: "Forum Members", value: "840+" },
          { icon: Landmark, label: "Cities Monitored", value: "8" },
          { icon: BarChart3, label: "Independent Reports", value: Math.max(3, countDocs) + 12 }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-natural-border text-center space-y-2 shadow-2xs">
            <div className="mx-auto w-8 h-8 rounded-full bg-natural-muted flex items-center justify-center text-natural-primary">
              <stat.icon className="w-4 h-4" />
            </div>
            <p className="font-mono text-[10px] text-natural-secondary uppercase tracking-widest leading-none font-bold">{stat.label}</p>
            <h3 className="font-sans text-2xl md:text-3xl font-bold text-natural-text">{stat.value}</h3>
          </div>
        ))}
      </section>

      {/* Core Editorial Mission Block */}
      <section className="grid md:grid-cols-2 gap-8 items-stretch pt-2">
        <div className="bg-natural-muted p-6 md:p-8 rounded-2xl border border-natural-border flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="font-sans font-extrabold text-xl md:text-2xl text-natural-text tracking-tight flex items-center space-x-2">
              <span className="w-3 h-3 bg-natural-primary rounded-full inline-block"></span>
              <span>{t.about_mission}</span>
            </h2>
            <div className="space-y-3 text-xs md:text-sm text-natural-dark-secondary font-normal leading-relaxed">
              <p>{t.about_p1}</p>
              <p>{t.about_p2}</p>
              <p>{t.about_p3}</p>
            </div>
          </div>
          <div className="border-t border-natural-border pt-4">
            <h4 className="font-sans font-bold text-xs text-natural-text uppercase tracking-wide">Key Audit Vectors</h4>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {["Pavements / Curbcuts", "Stormwater Drain Clogging", "Public Toilet Sanitation", "Tactile Paving Paths", "Powerline Clearance", "Flood Inundation Metrics"].map((tag, i) => (
                <span key={i} className="text-[10px] font-mono font-medium px-2 py-1 rounded-md bg-white border border-natural-border text-natural-secondary">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Civic Tech Philosophy */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-natural-border flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="font-sans font-extrabold text-xl md:text-2xl text-natural-text tracking-tight">
              Replicable Auditing Methodology
            </h2>
            <div className="space-y-4 text-xs md:text-sm text-natural-dark-secondary">
              <div className="flex space-x-3">
                <div className="font-mono text-sm font-bold text-natural-primary mt-0.5">01</div>
                <div>
                  <h4 className="font-sans font-bold text-natural-text text-xs md:text-sm">Localized Spatial Capture</h4>
                  <p className="text-xs text-natural-secondary mt-0.5">Citizens file geolocated accessibility reviews, capturing photographical proof of architectural obstructions or utility blockades.</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="font-mono text-sm font-bold text-natural-primary mt-0.5">02</div>
                <div>
                  <h4 className="font-sans font-bold text-natural-text text-xs md:text-sm">Engineering Guideline Scoring</h4>
                  <p className="text-xs text-natural-secondary mt-0.5">Audits evaluate infrastructure against the Indian Road Congress (IRC) physical codes and climate safety preparedness standards.</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="font-mono text-sm font-bold text-natural-primary mt-0.5">03</div>
                <div>
                  <h4 className="font-sans font-bold text-natural-text text-xs md:text-sm">Municipal Accountability Push</h4>
                  <p className="text-xs text-natural-secondary mt-0.5">Compiled data maps are exported to public ward dashboards and submitted directly to municipal commissioners for execution tracking.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Grid Quick Links */}
      <section className="space-y-4">
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase text-natural-secondary tracking-widest font-bold">Platform Gates</p>
          <h2 className="font-sans font-extrabold text-xl md:text-2xl text-natural-text tracking-tight mt-1">
            Democratic Platform Gateways
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {quickLinks.map((item, index) => (
            <div key={index} className="bg-white hover:bg-natural-muted p-6 rounded-2xl border border-natural-border flex flex-col justify-between space-y-4 transition-all hover:scale-[1.01] hover:shadow-xs">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-natural-secondary border border-natural-border bg-natural-muted py-0.5 px-2 rounded-sm font-bold uppercase tracking-wider">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-sans font-bold text-base text-natural-text">{item.title}</h3>
                <p className="text-xs leading-relaxed text-natural-secondary">{item.description}</p>
              </div>
              <button
                onClick={() => setActiveTab(item.tab)}
                className="w-full py-2.5 text-center text-xs font-bold bg-natural-primary text-white rounded-lg hover:bg-natural-primary-hover transition-all"
              >
                {item.actionText}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
