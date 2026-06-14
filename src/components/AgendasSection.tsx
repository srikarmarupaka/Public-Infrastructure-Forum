import React from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, ShieldAlert, CloudRain, BookOpen, Layers, Milestone, Activity, Lightbulb } from 'lucide-react';

export const AgendasSection: React.FC = () => {
  const { agendas, language } = useApp();

  // Mapping string names of icons to Lucide components safely
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5" />;
      case 'CloudRain':
        return <CloudRain className="w-5 h-5" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5" />;
      case 'Layers':
        return <Layers className="w-5 h-5" />;
      case 'Milestone':
        return <Milestone className="w-5 h-5" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-neutral-800" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  // Fallback list to display in case collection is empty
  const defaultAgendas = [
    {
      id: "agenda_fair_resource",
      title_en: "Fair Resource Allocation",
      title_hi: "समान संसाधन आवंटन",
      body_en: "Advocating for municipal policies that ensure low-income and peripheral neighborhoods receive equitable funding for pavement improvements, safety grids, drainage, and sustainable street lighting.",
      body_hi: "यह सुनिश्चित करने के लिए नगर निगम की नीतियों की वकालत करना कि कम आय वाले और बाहरी क्षेत्रों को फुटपाथ सुधार, सुरक्षा ग्रिड, जल निकासी और टिकाऊ सड़क प्रकाश व्यवस्था के लिए समान धन प्राप्त हो।",
      icon: "TrendingUp"
    },
    {
      id: "agenda_universal_design",
      title_en: "Public Safety & Universal Design",
      title_hi: "सार्वजनिक सुरक्षा और सार्वभौमिक डिजाइन",
      body_en: "Auditing and mapping pedestrian networks. Advocating for wheelchair ramps, continuous obstacle-free pathways, tactile tiles for blind citizens, and sufficient illumination across all city corridors.",
      body_hi: "पैदल यात्री नेटवर्कों का ऑडिट और मानचित्रण करना। व्हीलचेयर रैंप, निरंतर बाधा मुक्त रास्तों, दृष्टिबाधित नागरिकों के लिए स्पर्श टाइलें और सभी शहर गलियारों में पर्याप्त रोशनी की वकालत करना।",
      icon: "ShieldAlert"
    },
    {
      id: "agenda_climate_utilities",
      title_en: "Climate-Resilient Utilities",
      title_hi: "जलवायु-सहनशील उपयोगिताएँ",
      body_en: "Redesigning stormwater drainage networks, primary water supply channels, and electricity routing configurations to withstand devastating monsoon flooding, urban heat expansion, and cloudburst events.",
      body_hi: "मानसून की विनाशकारी बाढ़, शहरी गर्मी के विस्तार और मूसलाधार बारिश की घटनाओं का सामना करने के लिए वर्षा जल निकासी नेटवर्क, बुनियादी जल आपूर्ति चैनलों और बिजली मार्गों को नया स्वरूप देना।",
      icon: "CloudRain"
    },
    {
      id: "agenda_governance_policy",
      title_en: "Open Governance & Policy Accountability",
      title_hi: "खुला शासन और नीति जवाबदेही",
      body_en: "Democratizing urban research, contract compliance databases, and capital expenditure registers. Empowering communities to audit municipal budgets, work schedules, and public declarations.",
      body_hi: "शहरी अनुसंधान, अनुबंध अनुपालन डेटाबेस और पूंजीगत व्यय रजिश्टरों का लोकतंत्रीकरण। नागरिक समुदायों को नगर निगम के बजट, कार्य योजनाओं और सार्वजनिक घोषणाओं के ऑडिट के लिए सशक्त बनाना।",
      icon: "BookOpen"
    }
  ];

  const agendasList = agendas.length > 0 ? agendas : defaultAgendas;

  return (
    <div className="space-y-10 py-6">
      {/* Intro Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <span className="text-[10px] font-mono tracking-widest uppercase text-natural-secondary bg-natural-muted border border-natural-border py-0.5 px-2.5 rounded font-bold">
          Civic Vision
        </span>
        <h2 className="font-sans font-extrabold text-2xl md:text-3.5xl text-natural-text tracking-tight leading-none">
          {language === 'EN' ? 'Strategic Campaign Agendas' : 'रणनीतिक अभियान एजेंडा'}
        </h2>
        <p className="text-xs md:text-sm text-natural-secondary max-w-xl mx-auto font-light leading-relaxed">
          {language === 'EN' 
            ? 'We focus our advocacy, crowdsourced monitoring audits, and litigation briefs across four absolute systemic dimensions of urban equity.' 
            : 'हम चार पूर्ण प्रणालीगत आयामों के तहत अपनी वकालत और नागरिक ऑडिट केंद्रित करते हैं।'}
        </p>
      </div>

      {/* Grid displays */}
      <div className="grid md:grid-cols-2 gap-6 items-stretch">
        {agendasList.map((agenda, index) => {
          const isHindi = language === 'HI';
          const title = isHindi ? agenda.title_hi : agenda.title_en;
          const body = isHindi ? agenda.body_hi : agenda.body_en;

          return (
            <div 
              key={agenda.id || index} 
              className="bg-white border border-natural-border p-6 md:p-8 rounded-2xl shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-6 relative group"
            >
              <div className="space-y-4">
                <div className="inline-flex w-10 h-10 rounded-lg bg-natural-primary text-white items-center justify-center transition-all group-hover:scale-105">
                  {getIcon(agenda.icon)}
                </div>
                
                <h3 className="font-sans font-extrabold text-lg md:text-xl text-natural-text tracking-tight leading-snug">
                  {title}
                </h3>
                
                <p className="text-xs md:text-sm text-natural-dark-secondary font-light leading-relaxed">
                  {body}
                </p>
              </div>

              {/* Decorative Anchor */}
              <div className="border-t border-natural-border pt-4 flex justify-between items-center text-[10px] font-mono text-natural-secondary hover:text-natural-primary cursor-pointer">
                <span>{language === 'EN' ? 'ACTIVE FRAMEWORK' : 'सक्रिय ढांचा'}</span>
                <span className="font-bold underline tracking-wider text-natural-primary hover:text-natural-primary-hover">
                  {language === 'EN' ? 'READ AUDIT GUIDES' : 'ऑडिट गाइड पढ़ें'} →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subtext Action Block */}
      <div className="bg-natural-muted border border-natural-border p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="font-sans font-bold text-sm text-natural-text">
            {language === 'EN' ? 'Infrastructure Equity is a Legal Standard' : 'बुनियादी ढांचा समानता एक कानूनी मानक है'}
          </h4>
          <p className="text-xs text-natural-secondary max-w-xl leading-relaxed">
            {language === 'EN'
              ? 'PIF works directly with state high courts to mandate the execution of Indian Road Congress (IRC) street accessibility statutes.'
              : 'PIF सड़क पहुंच कानूनों को प्रभावी ढंग से लागू करने के लिए राज्य उच्च न्यायालयों के साथ सीधे मिलकर काम करता है।'}
          </p>
        </div>
      </div>
    </div>
  );
};
