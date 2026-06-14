import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Download, Search, Plus, Trash2, Calendar, MapPin, Layers, ExternalLink } from 'lucide-react';

export const ResearchSection: React.FC = () => {
  const { researchDocs, language, isAdmin, addResearchDoc, deleteResearchDoc } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  
  // State for Admin Upload form
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [titleEn, setTitleEn] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [docType, setDocType] = useState('Report');
  const [docYear, setDocYear] = useState<number>(2025);
  const [docRegion, setDocRegion] = useState('');
  const [summaryEn, setSummaryEn] = useState('');
  const [summaryHi, setSummaryHi] = useState('');
  const [docUrl, setDocUrl] = useState('');

  const docTypes = ['All', 'Dashboard', 'Report', 'Policy Document', 'Workshop', 'Podcast'];

  // Seed / fallback docs if Db has not been seeded
  const defaultResearchDocs = [
    {
      id: "doc_1",
      title_en: "Delhi Master Plan 2041 Pedestrian Infrastructure Review",
      title_hi: "दिल्ली मास्टर प्लान 2041 पैदल यात्री बुनियादी ढांचा समीक्षा",
      type: "Report",
      year: 2024,
      region: "Delhi",
      summary_en: "A detailed engineering audit examining compliance with IRC code guidelines across 15 high-density arterial segments in Delhi. Documents severe blockages, discontinuous curbcuts, and high-risk pedestrian crossings.",
      summary_hi: "दिल्ली में 15 उच्च-घनत्व वाले धमनी क्षेत्रों में आईआरसी कोड दिशानिर्देशों के अनुपालन की जांच करने वाला एक विस्तृत इंजीनियरिंग ऑडिट। गंभीर रुकावटों, टूटे फुटपाथों और उच्च जोखिम वाले क्रॉसिंग को प्रलेखित करता है।",
      url: "#"
    },
    {
      id: "doc_2",
      title_en: "Bengaluru Climate Resilient Drainage Dashboard",
      title_hi: "बेंगलुरु जलवायु लचीला जल निकासी डैशबोर्ड",
      type: "Dashboard",
      year: 2025,
      region: "Bengaluru",
      summary_en: "An interactive spatial analysis modeling natural stormwater water flow, storm-pipe capacities, and active flooding nodes within outer Bangalore municipal limits. Incorporates user-submitted waterlogging points.",
      summary_hi: "बाहरी बैंगलोर नगर निगम सीमाओं के भीतर प्राकृतिक वर्षा जल प्रवाह, तूफान-पाइप क्षमताओं और सक्रिय बाढ़ नोड्स को मॉडल करने वाला एक इंटरैक्टिव स्थानिक विश्लेषण। इसमें उपयोगकर्ताओं द्वारा प्रस्तुत किए गए जलभराव बिंदु शामिल हैं।",
      url: "#"
    },
    {
      id: "doc_3",
      title_en: "Mumbai Ward-Level Infrastructure Equity Audit",
      title_hi: "मुंबई वार्ड-स्तरीय बुनियादी ढांचा समानता ऑडिट",
      type: "Policy Document",
      year: 2025,
      region: "Mumbai",
      summary_en: "Spatial overlay analyzing ward-level municipal capital spending against multi-dimensional poverty indices. Highlights major public-toilet deficits and drainage gaps within formal vs informal housing sectors.",
      summary_hi: "बहु-आयामी गरीबी सूचकांकों के खिलाफ वार्ड-स्तरीय नगर निगम पूंजी खर्च का विश्लेषण करने वाला स्थानिक ओवरले। औपचारिक बनाम अनौपचारिक आवास क्षेत्रों के भीतर प्रमुख सार्वजनिक शौचालय घाटे और जल निकासी अंतराल को उजागर करता है।",
      url: "#"
    }
  ];

  const currentDocs = researchDocs.length > 0 ? researchDocs : defaultResearchDocs;

  // Filter logic
  const filteredDocs = currentDocs.filter((doc) => {
    const matchesSearch =
      doc.title_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.title_hi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.region.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'All' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn || !docRegion || !summaryEn) {
      alert("Please fill in the required fields (Title EN, Region, Summary EN).");
      return;
    }

    const payload = {
      title_en: titleEn,
      title_hi: titleHi || titleEn,
      type: docType,
      year: Number(docYear),
      region: docRegion,
      summary_en: summaryEn,
      summary_hi: summaryHi || summaryEn,
      url: docUrl || '#'
    };

    try {
      await addResearchDoc(payload);
      // reset
      setTitleEn('');
      setTitleHi('');
      setDocRegion('');
      setSummaryEn('');
      setSummaryHi('');
      setDocUrl('');
      setShowUploadForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 py-6">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-widest uppercase text-natural-secondary bg-natural-muted border border-natural-border py-0.5 px-2 font-bold rounded">
            PIF Research Core
          </span>
          <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-natural-text tracking-tight">
            {language === 'EN' ? 'Research & Action Repository' : 'अनुसंधान एवं कार्य संग्रह'}
          </h2>
          <p className="text-xs text-natural-secondary font-light max-w-xl">
            {language === 'EN'
              ? 'Browse, filter, and inspect peer-reviewed reports, geographic dashboards, and independent civic audits compiled by PIF engineers.'
              : 'पीआईएफ इंजीनियरों द्वारा संकलित पीअर-रिव्यू रिपोर्ट, भौगोलिक डैशबोर्ड और स्वतंत्र नागरिक ऑडिट ब्राउज़ करें।'}
          </p>
        </div>

        {/* Admin Form Trigger */}
        {isAdmin && (
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs bg-natural-primary text-white rounded-lg hover:bg-natural-primary-hover transition-all font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Document</span>
          </button>
        )}
      </div>

      {/* Admin Add Document Form Block */}
      {isAdmin && showUploadForm && (
        <form onSubmit={handleUploadSubmit} className="bg-natural-muted border border-natural-border p-6 rounded-2xl space-y-4">
          <h3 className="font-sans font-extrabold text-sm text-natural-text">Add Research Artifact / Document</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-natural-secondary font-bold">Document Title (EN) *</label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Ward 42 Flood Inundation Analysis"
                className="w-full text-xs p-2 border border-natural-border rounded-lg bg-white"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-natural-secondary font-bold">Document Title (HI)</label>
              <input
                type="text"
                value={titleHi}
                onChange={(e) => setTitleHi(e.target.value)}
                placeholder="उदा. वार्ड 42 बाढ़ जलभराव विश्लेषण"
                className="w-full text-xs p-2 border border-natural-border rounded-lg bg-white"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-natural-secondary font-bold">Type</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full text-xs p-2 border border-natural-border rounded-lg bg-white"
              >
                {docTypes.filter(t => t !== 'All').map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-natural-secondary font-bold">Year</label>
              <input
                type="number"
                value={docYear}
                onChange={(e) => setDocYear(Number(e.target.value))}
                className="w-full text-xs p-2 border border-natural-border rounded-lg bg-white"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-natural-secondary font-bold">Region/City *</label>
              <input
                type="text"
                value={docRegion}
                onChange={(e) => setDocRegion(e.target.value)}
                placeholder="e.g. Bengaluru"
                className="w-full text-xs p-2 border border-natural-border rounded-lg bg-white"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-natural-secondary font-bold">External URL</label>
              <input
                type="text"
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs p-2 border border-natural-border rounded-lg bg-white"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-natural-secondary font-bold">Summary (EN) *</label>
              <textarea
                value={summaryEn}
                onChange={(e) => setSummaryEn(e.target.value)}
                placeholder="Summary description in English..."
                className="w-full text-xs p-2 border border-natural-border rounded-lg bg-white h-24"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-natural-secondary font-bold">Summary (HI)</label>
              <textarea
                value={summaryHi}
                onChange={(e) => setSummaryHi(e.target.value)}
                placeholder="हिंदी विवरण संक्षेप..."
                className="w-full text-xs p-2 border border-natural-border rounded-lg bg-white h-24"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setShowUploadForm(false)}
              className="px-3 py-1.5 text-xs text-[#44403C] hover:bg-neutral-100 border border-natural-border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs bg-[#4B5E40] text-white font-bold rounded-lg hover:bg-[#3E4E35]"
            >
              Submit Artifact
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Panel */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-natural-muted p-3.5 rounded-2xl border border-natural-border shadow-2xs">
        {/* Search */}
        <div className="relative w-full sm:flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center pr-3 pointer-events-none text-natural-secondary">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'EN' ? "Search by title, location..." : "शीर्षक, स्थान खोजें..."}
            className="w-full text-xs pl-9 pr-4 py-2 border border-natural-border rounded-lg bg-white focus:outline-none"
          />
        </div>

        {/* Filter Type */}
        <div className="flex w-full sm:w-auto items-center space-x-2">
          <label className="hidden sm:inline text-[10px] font-mono uppercase text-natural-secondary font-bold shrink-0">Filter:</label>
          <div className="flex flex-wrap gap-1">
            {docTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 text-[10px] rounded font-semibold transition-all ${
                  filterType === type
                    ? 'bg-natural-primary text-white shadow-xs'
                    : 'bg-white text-natural-secondary border border-natural-border hover:text-natural-text hover:bg-natural-muted'
                }`}
              >
                {type === 'All' ? (language === 'EN' ? 'All' : 'सभी') : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredDocs.length === 0 ? (
          <div className="md:col-span-2 text-center py-12 border border-dashed border-natural-border rounded-2xl bg-white">
            <Layers className="w-8 h-8 text-natural-secondary mx-auto" />
            <p className="text-xs text-natural-secondary mt-2 font-mono">
              {language === 'EN' ? 'No research papers match the selected query.' : 'कोई दस्तावेज़ मापदंडों से मेल नहीं खाता।'}
            </p>
          </div>
        ) : (
          filteredDocs.map((docItem) => {
            const isHindi = language === 'HI';
            const title = isHindi ? docItem.title_hi : docItem.title_en;
            const summary = isHindi ? docItem.summary_hi : docItem.summary_en;

            return (
              <div
                key={docItem.id}
                className="bg-white border border-natural-border hover:border-natural-secondary/30 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-xs transition-all relative group"
              >
                {/* Meta Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-natural-accent-light text-natural-accent border border-natural-accent/25">
                      {docItem.type}
                    </span>
                    <div className="flex items-center space-x-2 text-[10px] font-mono text-natural-secondary">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{docItem.year}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{docItem.region}</span>
                      </span>
                    </div>
                  </div>

                  {/* Title & summary */}
                  <h3 className="font-sans font-bold text-sm text-natural-text group-hover:text-natural-primary transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-natural-dark-secondary leading-relaxed font-light">
                    {summary}
                  </p>
                </div>

                {/* Footer Buttons */}
                <div className="border-t border-natural-border pt-3 flex items-center justify-between">
                  <a
                    href={docItem.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1 text-[11px] font-bold text-natural-primary hover:text-natural-primary-hover group/link"
                  >
                    <span>{docItem.type === 'Dashboard' ? 'Open Dashboard' : 'Download Document'}</span>
                    <ExternalLink className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5" />
                  </a>

                  {isAdmin && (
                    <button
                      onClick={() => deleteResearchDoc(docItem.id)}
                      className="p-1 text-red-650 hover:bg-neutral-100 rounded transition-all"
                      title="Delete Artifact"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
