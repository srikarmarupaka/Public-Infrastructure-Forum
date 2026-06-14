import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, Calendar, User, Tag, BookOpen, Clock } from 'lucide-react';

export const DispatchesSection: React.FC = () => {
  const { dispatches, language, isAdmin, addDispatch, deleteDispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  
  // Form fields
  const [titleEn, setTitleEn] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [author, setAuthor] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [contentHi, setContentHi] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  // Seed / fallback dispatches in case not seeded yet
  const defaultDispatches = [
    {
      id: "dispatch_1",
      title_en: "Open Letter to Municipal Commissioners on Flooding Readiness",
      title_hi: "बाढ़ तैयारी पर नगर आयुक्तों को खुला पत्र",
      content_en: "We have compiled and formally delivered comprehensive pre-monsoon drainage audit reports mapping 180 critical storm drain clogging nodes to municipal corporations. PIF urges authorities to immediate de-silt all secondary drains, remove brick dust and cement blockage residues, and make ward drainage maps publicly available.",
      content_hi: "हमने नगर निगमों को 180 महत्वपूर्ण तूफान जल निकास अवरोध नोड्स का मानचित्रण करने वाली व्यापक प्री-मानसून जल निकासी ऑडिट रिपोर्ट संकलित कर औपचारिक रूप से सौंप दी है। PIF अधिकारियों से सभी माध्यमिक नालियों को तत्काल साफ करने, मलबे और सीमेंट ब्लॉकेज को हटाने और वार्ड के जल निकासी मानचित्रों को सार्वजनिक करने का आग्रह करता है।",
      author: "PIF Secretariat",
      tags: ["Governance", "Monsoon", "Drainage"],
      publishedAt: { toDate: () => new Date() }
    },
    {
      id: "dispatch_2",
      title_en: "Citizen Audits Cross 500 Submissions Milestone",
      title_hi: "नागरिक ऑडिट ने 500 सबमिशन का मील का पत्थर पार किया",
      content_en: "Thanks to grassroots mobilization and collective citizen audits, we have now cataloged over 500 infrastructure accessibility reports across Mumbai, Delhi, Bengaluru, and Pune. This data establishes a powerful visual index mapping wheelchair blockade indexes, which our legal core will present in upcoming policy seminars.",
      content_hi: "जमीनी स्तर पर लामबंदी और नागरिक ऑडिट के लिए धन्यवाद, हमने अब मुंबई, दिल्ली, बेंगलुरु और पुणे में 500 से अधिक बुनियादी ढांचा पहुंच रिपोर्टों को सूचीबद्ध किया है। यह डेटा व्हीलचेयर ब्लॉकेड इंडेक्स को दिखाता है, जिसे हमारी कानूनी टीम आगामी नीति सेमिनार में पेश करेगी।",
      author: "PIF Tech Lead",
      tags: ["Audits", "Community", "Accessibility"],
      publishedAt: { toDate: () => new Date() }
    }
  ];

  const currentDispatches = dispatches.length > 0 ? dispatches : defaultDispatches;

  // Extract unique tags
  const allTagsSet = new Set<string>();
  currentDispatches.forEach(d => {
    if (d.tags && Array.isArray(d.tags)) {
      d.tags.forEach(tag => allTagsSet.add(tag));
    }
  });
  const allTags = ['All', ...Array.from(allTagsSet)];

  // Filter by tag
  const filteredDispatches = selectedTag === 'All' 
    ? currentDispatches 
    : currentDispatches.filter(d => d.tags && d.tags.includes(selectedTag));

  // Sort reverse-chronologically by timestamp if formatted or fallback
  const sortedDispatches = [...filteredDispatches].sort((a, b) => {
    const dateA = a.publishedAt?.toDate ? a.publishedAt.toDate() : new Date();
    const dateB = b.publishedAt?.toDate ? b.publishedAt.toDate() : new Date();
    return dateB.getTime() - dateA.getTime();
  });

  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn || !author || !contentEn) {
      alert("Please fill in required fields (Title EN, Author, Content EN).");
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload = {
      title_en: titleEn,
      title_hi: titleHi || titleEn,
      content_en: contentEn,
      content_hi: contentHi || contentEn,
      author: author,
      tags: tagsArray,
      isDraft: false
    };

    try {
      await addDispatch(payload);
      setTitleEn('');
      setTitleHi('');
      setAuthor('');
      setContentEn('');
      setContentHi('');
      setTagsInput('');
      setShowForm(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 py-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-widest uppercase text-natural-secondary bg-natural-muted border border-natural-border py-0.5 px-2 font-bold rounded">
            PIF Dispatch Editorial
          </span>
          <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-natural-text tracking-tight">
            {language === 'EN' ? 'Dispatches & News' : 'समाचार एवं प्रेषण'}
          </h2>
          <p className="text-xs text-natural-secondary font-light max-w-xl">
            {language === 'EN'
              ? 'Read official announcements, open letters to municipal bodies, community audits reports, and campaign action dispatches.'
              : 'आधिकारिक घोषणाएं, नगर निकायों को खुले पत्र, सामुदायिक ऑडिट रिपोर्ट और अभियान प्रेषण पढ़ें।'}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs bg-natural-primary text-white rounded-lg hover:bg-natural-primary-hover transition-all font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Dispatch</span>
          </button>
        )}
      </div>

      {/* Admin Publish Dispatch Form */}
      {isAdmin && showForm && (
        <form onSubmit={handlePublishSubmit} className="bg-natural-muted border border-natural-border p-6 rounded-2xl space-y-4">
          <h3 className="font-sans font-extrabold text-sm text-natural-text">Publish News Dispatch / Circular</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-natural-secondary font-bold">Dispatch Title (EN) *</label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Ward Road Audit results handed to Mayor"
                className="w-full text-xs p-2 border border-natural-border rounded-lg bg-white"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-natural-secondary font-bold">Dispatch Title (HI)</label>
              <input
                type="text"
                value={titleHi}
                onChange={(e) => setTitleHi(e.target.value)}
                placeholder="उदा. महापौर को सौंपे गए वार्ड सड़क ऑडिट के नतीजे"
                className="w-full text-xs p-2 border border-natural-border rounded-lg bg-white"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-natural-secondary font-bold">Author *</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. PIF Secretariat"
                className="w-full text-xs p-2 border border-natural-border rounded-lg bg-white"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-natural-secondary font-bold">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Audits, Governance, Mumbai"
                className="w-full text-xs p-2 border border-natural-border rounded-lg bg-white"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-natural-secondary font-bold">Content Text (EN) *</label>
              <textarea
                value={contentEn}
                onChange={(e) => setContentEn(e.target.value)}
                placeholder="Write news content in English..."
                className="w-full text-xs p-2 border border-natural-border rounded-lg bg-white h-36"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-natural-secondary font-bold">Content Text (HI)</label>
              <textarea
                value={contentHi}
                onChange={(e) => setContentHi(e.target.value)}
                placeholder="हिंदी विवरण विस्तार से..."
                className="w-full text-xs p-2 border border-natural-border rounded-lg bg-white h-36"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 text-xs text-[#44403C] hover:bg-neutral-100 border border-natural-border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs bg-natural-primary text-white font-bold rounded-lg hover:bg-natural-primary-hover"
            >
              Publish News
            </button>
          </div>
        </form>
      )}

      {/* Filter and tag selection pills */}
      <div className="flex flex-wrap items-center gap-1.5 bg-natural-muted p-2.5 rounded-2xl border border-natural-border shadow-2xs">
        <span className="text-[9px] font-mono text-natural-secondary font-bold uppercase tracking-wider px-2 shrink-0">Tags:</span>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-2.5 py-0.5 text-[10px] rounded-sm font-semibold transition-colors ${
              selectedTag === tag
                ? 'bg-natural-primary text-white font-bold'
                : 'bg-white text-natural-secondary hover:text-natural-text border border-natural-border'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Structured reverse-chronological news items feed */}
      <div className="space-y-8">
        {sortedDispatches.map((disp, index) => {
          const isHindi = language === 'HI';
          const title = isHindi ? disp.title_hi : disp.title_en;
          const content = isHindi ? disp.content_hi : disp.content_en;

          // Process timestamp safely
          const rawDate = disp.publishedAt;
          let calendarStrStr = "Recently";
          if (rawDate) {
            try {
              const d = rawDate.toDate ? rawDate.toDate() : new Date(rawDate);
              calendarStrStr = d.toLocaleDateString(language === 'EN' ? 'en-US' : 'hi-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
            } catch (_) {}
          }

          return (
            <article
              key={disp.id || index}
              className="bg-white border border-natural-border p-6 md:p-8 rounded-2xl space-y-4 hover:border-natural-secondary/30 transition-all relative block shadow-2xs"
            >
              {/* Card Meta row */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-natural-border pb-3">
                <div className="flex items-center space-x-3 text-[10px] font-mono text-natural-secondary">
                  <span className="flex items-center space-x-1">
                    <User className="w-3.5 h-3.5" />
                    <span>{disp.author}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{calendarStrStr}</span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {disp.tags && Array.isArray(disp.tags) && disp.tags.map((tg, i) => (
                    <span key={i} className="text-[9px] font-mono bg-natural-muted text-natural-secondary px-1.5 py-0.5 rounded border border-natural-border">
                      #{tg}
                    </span>
                  ))}
                </div>
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <h3 className="font-sans font-extrabold text-lg md:text-xl text-natural-text tracking-tight leading-snug">
                  {title}
                </h3>
                
                {/* Paragraph spacing */}
                <div className="text-xs md:text-sm text-natural-dark-secondary font-normal leading-relaxed whitespace-pre-wrap">
                  {content}
                </div>
              </div>

              {/* Admin Action Triggers */}
              {isAdmin && (
                <div className="flex justify-end pt-2 border-t border-natural-border">
                  <button
                    onClick={() => deleteDispatch(disp.id)}
                    className="flex items-center space-x-1 text-[10px] font-mono font-bold text-red-600 bg-red-50 hover:bg-red-100 px-2 py-1 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete News</span>
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};
