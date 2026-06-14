import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { db, auth } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  Timestamp, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { 
  ArrowLeft, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  Download, 
  User, 
  Calendar, 
  MapPin, 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  ShieldAlert,
  Hash,
  Activity,
  Award
} from 'lucide-react';
import { CitizenAudit, AuditComment } from '../types';

interface AuditDetailProps {
  audit: CitizenAudit;
  onBack: () => void;
}

export const AuditDetail: React.FC<AuditDetailProps> = ({ audit, onBack }) => {
  const { 
    language, 
    user, 
    isAdmin, 
    likeAudit, 
    dislikeAudit, 
    reportAudit,
    t 
  } = useApp();

  // Selected state metrics
  const [likes, setLikes] = useState<number>(audit.likesCount || 0);
  const [dislikes, setDislikes] = useState<number>(audit.dislikesCount || 0);
  const [reports, setReports] = useState<number>(audit.reportsCount || 0);
  const [commentsList, setCommentsList] = useState<AuditComment[]>([]);
  
  // Interaction locks
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [hasDisliked, setHasDisliked] = useState<boolean>(false);
  const [hasReported, setHasReported] = useState<boolean>(false);

  // Form states
  const [commentText, setCommentText] = useState<string>('');
  const [commentAuthor, setCommentAuthor] = useState<string>('');
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);

  const isPresetAudit = audit.id.startsWith('audit_');

  // 1. Fetch Comments & synchronize state
  useEffect(() => {
    if (isPresetAudit) {
      // Preset fallback storage inside localStorage for seamless execution
      const storedComments = localStorage.getItem(`comments_${audit.id}`);
      if (storedComments) {
        setCommentsList(JSON.parse(storedComments));
      } else {
        // Initial mock comments for realistic interactions
        const initialMock: AuditComment[] = [
          {
            id: 'mock_c1',
            auditId: audit.id,
            authorName: language === 'EN' ? 'Meera Nair' : 'मीरा नायर',
            text: language === 'EN' 
              ? 'I transit this corridor daily. The quality index here is indeed terrible. Thank you for logging this!'
              : 'मैं रोज़ इस गलियारे से गुज़रती हूँ। यहाँ की गुणवत्ता सूचकांक वाकई ख़राब है। इसे रिकॉर्ड करने के लिए धन्यवाद!',
            createdAt: new Date(Date.now() - 3600000 * 2)
          },
          {
            id: 'mock_c2',
            auditId: audit.id,
            authorName: language === 'EN' ? 'Anupam Das' : 'अनुपम दास',
            text: language === 'EN'
              ? 'Core team should escalate this to the ward counselor. High risk of water slippage during rain.'
              : 'मुख्य टीम को इसे वार्ड पार्षद तक पहुँचाना चाहिए। बारिश के दौरान पानी जमा होने का उच्च जोखिम है।',
            createdAt: new Date(Date.now() - 3600000 * 24)
          }
        ];
        localStorage.setItem(`comments_${audit.id}`, JSON.stringify(initialMock));
        setCommentsList(initialMock);
      }

      // Also grab likes/dislikes from localStorage
      const storedLikes = localStorage.getItem(`likes_${audit.id}`);
      const storedDislikes = localStorage.getItem(`dislikes_${audit.id}`);
      const storedReports = localStorage.getItem(`reports_${audit.id}`);
      
      if (storedLikes) setLikes(Number(storedLikes));
      if (storedDislikes) setDislikes(Number(storedDislikes));
      if (storedReports) setReports(Number(storedReports));
    } else {
      // Actual Firestore Sync of comments subcollection
      const commentsPath = `/citizen_audits/${audit.id}/comments`;
      const q = query(collection(db, 'citizen_audits', audit.id, 'comments'), orderBy('createdAt', 'asc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list: AuditComment[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as AuditComment);
        });
        setCommentsList(list);
      }, (err) => {
        console.error("Failed to sync audit comments:", err);
      });

      return () => unsubscribe();
    }
  }, [audit.id, isPresetAudit, language]);

  // Update live document counts if changed in real firestore state
  useEffect(() => {
    if (!isPresetAudit) {
      setLikes(audit.likesCount || 0);
      setDislikes(audit.dislikesCount || 0);
      setReports(audit.reportsCount || 0);
    }
  }, [audit.likesCount, audit.dislikesCount, audit.reportsCount, isPresetAudit]);

  // 2. Handle Like Action
  const handleLike = async () => {
    if (hasLiked) return;
    setLikes(prev => prev + 1);
    setHasLiked(true);
    if (hasDisliked) {
      setDislikes(prev => Math.max(0, prev - 1));
      setHasDisliked(false);
    }

    if (isPresetAudit) {
      localStorage.setItem(`likes_${audit.id}`, String(likes + 1));
      if (hasDisliked) {
        localStorage.setItem(`dislikes_${audit.id}`, String(Math.max(0, dislikes - 1)));
      }
    } else {
      await likeAudit(audit.id);
    }
  };

  // 3. Handle Dislike Action
  const handleDislike = async () => {
    if (hasDisliked) return;
    setDislikes(prev => prev + 1);
    setHasDisliked(true);
    if (hasLiked) {
      setLikes(prev => Math.max(0, prev - 1));
      setHasLiked(false);
    }

    if (isPresetAudit) {
      localStorage.setItem(`dislikes_${audit.id}`, String(dislikes + 1));
      if (hasLiked) {
        localStorage.setItem(`likes_${audit.id}`, String(Math.max(0, likes - 1)));
      }
    } else {
      await dislikeAudit(audit.id);
    }
  };

  // 4. Handle Report Flagging
  const handleReport = async () => {
    if (hasReported) return;
    setReports(prev => prev + 1);
    setHasReported(true);

    if (isPresetAudit) {
      localStorage.setItem(`reports_${audit.id}`, String(reports + 1));
    } else {
      await reportAudit(audit.id);
    }
    alert(language === 'EN' ? "Audit report flagged. Thank you for reporting." : "ऑडिट रिपोर्ट को चिह्नित किया गया। रिपोर्ट करने के लिए धन्यवाद।");
  };

  // 5. Download Report Generation
  const handleDownload = () => {
    let dateStr = "Recent";
    if (audit.createdAt) {
      try {
        const dateVal = audit.createdAt.toDate ? audit.createdAt.toDate() : new Date(audit.createdAt);
        dateStr = dateVal.toLocaleDateString();
      } catch (_) {}
    }

    const reportContent = {
      pif_report_header: "PUBLIC INFRASTRUCTURE FORUM - CITIZEN AUDIT LOG REPORT",
      audit_id: audit.id,
      meta: {
        location_address: audit.locationName,
        infrastructure_class: audit.infraType,
        physical_quality_score: `${audit.qualityScore}/100`,
        climate_preparedness_index: `${audit.climateScore}/10`,
        geopoint: audit.geoPoint || "Standard Ward Center Coordinate",
        submitted_at: dateStr,
        submitted_by_uid: audit.userId,
        verification_status: audit.approvedByAdmin ? "VERIFIED / SIGNED-OFF" : "PENDING REVIEW"
      },
      citizen_observations: audit.comments,
      engagement_metrics: {
        likes_count: likes,
        dislikes_count: dislikes,
        flagged_reports: reports,
        discussion_comments_logged: commentsList.length
      },
      signature: "Generated on behalf of the Public Infrastructure Forum Citizen Network"
    };

    const fileText = JSON.stringify(reportContent, null, 2);
    const blob = new Blob([fileText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PIF_Audit_Report_${audit.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 6. Handle New Comment Submit
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    const author = commentAuthor.trim() || (language === 'EN' ? 'Anonymous Guest' : 'अनाम अतिथि');

    if (isPresetAudit) {
      const newComment: AuditComment = {
        id: `local_c_${Date.now()}`,
        auditId: audit.id,
        authorName: author,
        text: commentText.trim(),
        createdAt: new Date()
      };
      const updated = [...commentsList, newComment];
      setCommentsList(updated);
      localStorage.setItem(`comments_${audit.id}`, JSON.stringify(updated));
      setCommentText('');
      setCommentAuthor('');
      setIsSubmittingComment(false);
    } else {
      try {
        await addDoc(collection(db, 'citizen_audits', audit.id, 'comments'), {
          auditId: audit.id,
          authorName: author,
          text: commentText.trim(),
          createdAt: Timestamp.now()
        });
        setCommentText('');
        setCommentAuthor('');
      } catch (err) {
        console.error("Failed to push comment to Firestore:", err);
        alert(language === 'EN' ? "Could not publish comment. Try again." : "टिप्पणी प्रकाशित नहीं हो सकी। पुनः प्रयास करें।");
      } finally {
        setIsSubmittingComment(false);
      }
    }
  };

  // Parse Date string for display
  let dateStr = "Recent Audit";
  if (audit.createdAt) {
    try {
      const dateVal = audit.createdAt.toDate ? audit.createdAt.toDate() : new Date(audit.createdAt);
      dateStr = dateVal.toLocaleDateString(language === 'EN' ? 'en-US' : 'hi-IN', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (_) {}
  }

  // Quality score styling colors
  const getQualityColorText = (score: number) => {
    if (score >= 70) return 'text-[#3E4E35] bg-[#F0F2EE] border-natural-border';
    if (score >= 40) return 'text-natural-accent bg-natural-accent-light/30 border-natural-accent/10';
    return 'text-red-700 bg-red-50 border-red-100';
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-4">
      {/* Back Header navigation */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-xs font-mono text-natural-secondary hover:text-natural-text bg-white border border-natural-border px-3.5 py-2 rounded-lg shadow-2xs hover:bg-natural-muted transition-all duration-150 cursor-pointer font-bold"
      >
        <ArrowLeft className="w-4 h-4 text-natural-primary" />
        <span>{language === 'EN' ? 'Back to Index Registry' : 'वापस सूचकांक सूची में'}</span>
      </button>

      {/* Primary Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column - Main Details */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Visual Header Image Card */}
          <div className="bg-white border border-natural-border rounded-2xl overflow-hidden shadow-2xs">
            <div className="h-64 sm:h-96 w-full bg-natural-text relative overflow-hidden">
              <img 
                src={audit.images?.[0] || 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600'} 
                alt={audit.locationName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 flex flex-col justify-between p-6">
                
                {/* Infrastructure Type & Header tags */}
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono uppercase bg-white/95 text-natural-text px-2.5 py-1 rounded-sm border border-natural-border font-bold">
                    {audit.infraType}
                  </span>
                  
                  {/* Status Overlay */}
                  <span className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-sm border flex items-center space-x-1 font-bold shadow-md ${
                    audit.approvedByAdmin 
                      ? 'bg-natural-primary text-white border-natural-primary-hover' 
                      : 'bg-natural-accent text-white border-natural-accent'
                  }`}>
                    {audit.approvedByAdmin ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                    <span>{audit.approvedByAdmin ? (language === 'EN' ? 'VERIFIED PUBLIC LOG' : 'सत्यापित सार्वजनिक लॉग') : (language === 'EN' ? 'PENDING CORE REVIEW' : 'समीक्षा लंबित')}</span>
                  </span>
                </div>

                {/* Overlaid Title Area */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs text-white/90 font-mono">
                    <MapPin className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span>{audit.locationName}</span>
                  </div>
                  <h1 className="font-sans font-black text-xl sm:text-2xl md:text-3xl text-white tracking-tight leading-tight">
                    {audit.locationName.split(',')[0]}
                  </h1>
                </div>

              </div>
            </div>

            {/* Score Indices Panel Block */}
            <div className="grid grid-cols-2 border-t border-natural-border divide-x divide-natural-border bg-natural-muted">
              
              <div className="p-4 sm:p-6 text-center space-y-1">
                <p className="text-[10px] font-mono uppercase text-natural-secondary font-bold tracking-wider">
                  Physical Quality Index
                </p>
                <div className="flex items-baseline justify-center space-x-1">
                  <b className="font-sans font-black text-2xl sm:text-4xl text-natural-text">{audit.qualityScore}</b>
                  <span className="text-xs font-mono text-natural-secondary">/100</span>
                </div>
                <div className="w-24 mx-auto bg-white/80 h-1.5 rounded-full overflow-hidden mt-1 sm:mt-2">
                  <div className="bg-natural-primary h-full" style={{ width: `${audit.qualityScore}%` }} />
                </div>
              </div>

              <div className="p-4 sm:p-6 text-center space-y-1">
                <p className="text-[10px] font-mono uppercase text-natural-secondary font-bold tracking-wider">
                  Climate Inundation Index
                </p>
                <div className="flex items-baseline justify-center space-x-1">
                  <b className="font-sans font-black text-2xl sm:text-4xl text-natural-text">{audit.climateScore}</b>
                  <span className="text-xs font-mono text-natural-secondary">/10</span>
                </div>
                <div className="w-24 mx-auto bg-white/80 h-1.5 rounded-full overflow-hidden mt-1 sm:mt-2">
                  <div className="bg-natural-accent h-full" style={{ width: `${audit.climateScore * 10}%` }} />
                </div>
              </div>

            </div>
          </div>

          {/* Observations and detailed logs */}
          <div className="bg-white border border-natural-border rounded-2xl p-6 space-y-4 shadow-2xs">
            <h3 className="font-sans font-extrabold text-sm uppercase text-natural-text tracking-wider border-b border-natural-border pb-2 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-natural-primary animate-pulse" />
              <span>{language === 'EN' ? 'Audit Observations & Assessment' : 'ऑडिट टिप्पणियां एवं मूल्यांकन'}</span>
            </h3>
            <p className="text-sm md:text-base text-natural-dark-secondary font-normal leading-relaxed whitespace-pre-wrap">
              {audit.comments}
            </p>
          </div>

          {/* Spatial Mapping Pinpoint coordinate markers map */}
          <div className="bg-white border border-natural-border rounded-2xl p-6 space-y-4 shadow-2xs">
            <h3 className="font-sans font-extrabold text-sm uppercase text-natural-text tracking-wider border-b border-natural-border pb-2 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-natural-primary animate-bounce" />
              <span>{language === 'EN' ? 'Spatio-Spatial Ward Coordinate Pinpoint' : 'स्थानिक वार्ड निर्देशांक पिनपॉइंट'}</span>
            </h3>
            
            <div className="relative border border-natural-border rounded-xl h-60 bg-[#F5F4EF]/50 overflow-hidden flex flex-col justify-between">
              {/* Simulated Map Grid Visuals */}
              <div className="absolute inset-0 bg-[radial-gradient(#2F3E2612_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
              
              {/* Street grid line renders */}
              <div className="absolute inset-0 border-y border-natural-border/20 translate-y-12 pointer-events-none"></div>
              <div className="absolute inset-0 border-y border-natural-border/20 translate-y-28 pointer-events-none"></div>
              <div className="absolute inset-0 border-y border-natural-border/20 translate-y-44 pointer-events-none"></div>
              <div className="absolute inset-0 border-x border-natural-border/20 translate-x-12 pointer-events-none"></div>
              <div className="absolute inset-0 border-x border-natural-border/20 translate-x-44 pointer-events-none"></div>
              <div className="absolute inset-0 border-x border-natural-border/20 translate-x-80 pointer-events-none"></div>

              {/* Geographic Ring/Zone boundary */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-natural-primary/5 bg-natural-primary/5 flex items-center justify-center animate-pulse">
                <div className="w-24 h-24 rounded-full border border-natural-primary/10 bg-natural-primary/5 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-natural-primary/15 bg-natural-primary/5"></div>
                </div>
              </div>

              {/* Simulated streets text indicators */}
              <div className="absolute top-4 left-6 text-[9px] font-mono font-bold text-natural-secondary uppercase tracking-widest bg-white/70 px-1.5 py-0.5 rounded border border-natural-border/50">
                Outer Ward Security Corridor
              </div>
              <div className="absolute bottom-4 right-6 text-[9px] font-mono font-bold text-natural-secondary uppercase tracking-widest bg-white/70 px-1.5 py-0.5 rounded border border-natural-border/50">
                Public Transit Link / Intersect
              </div>

              {/* Center target pinpoint identifier */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                <div className="relative">
                  <span className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-natural-accent/30 animate-ping"></span>
                  <span className="absolute -top-0.5 -left-0.5 w-4 h-4 rounded-full bg-natural-accent/40"></span>
                  <MapPin className="w-6 h-6 text-natural-accent relative z-10 drop-shadow-md" />
                </div>
                <div className="mt-1.5 bg-natural-text text-white text-[9px] font-mono font-black py-0.5 px-2 rounded-md shadow-lg border border-natural-text uppercase tracking-wider text-center max-w-[180px] truncate">
                  {audit.locationName.split(',')[0]}
                </div>
              </div>

              {/* Geo Coordinate telemetry overlay */}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs border border-natural-border p-2 rounded-lg text-[9px] font-mono text-natural-text space-y-0.5 shadow-sm max-w-[240px]">
                <div className="font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>GEOPRECISION SECURED</span>
                </div>
                <div>Lat: <span className="font-bold">{audit.geoPoint?.latitude ? audit.geoPoint.latitude.toFixed(6) : (audit.locationName.includes("Lucknow") ? "26.868012" : audit.locationName.includes("Bengaluru") ? "12.934045" : "19.038012")}° N</span></div>
                <div>Lng: <span className="font-bold">{audit.geoPoint?.longitude ? audit.geoPoint.longitude.toFixed(6) : (audit.locationName.includes("Lucknow") ? "80.938062" : audit.locationName.includes("Bengaluru") ? "77.610521" : "72.853814")}° E</span></div>
              </div>

              {/* Scaling zoom controls */}
              <div className="absolute top-3 right-3 flex flex-col gap-1 bg-white border border-natural-border rounded-lg p-1 shadow-sm">
                <button type="button" className="w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-natural-muted text-natural-text rounded transition-colors" onClick={() => alert(language === 'EN' ? "Simulated Map Zoomed In (Scale Set)" : "सफल मानचित्र ज़ूम इन")}>+</button>
                <div className="border-t border-natural-border"></div>
                <button type="button" className="w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-natural-muted text-natural-text rounded transition-colors" onClick={() => alert(language === 'EN' ? "Simulated Map Zoomed Out (Bounds Fit)" : "सफल मानचित्र ज़ूम आउट")}>-</button>
              </div>

            </div>
          </div>

          {/* Interactivity Section Box */}
          <div className="bg-natural-muted border border-natural-border rounded-2xl p-6 shadow-2xs flex flex-wrap gap-4 items-center justify-between">
            
            {/* Likes / Dislikes Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleLike}
                disabled={hasLiked}
                className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-lg border text-xs font-bold transition-all ${
                  hasLiked 
                    ? 'bg-natural-primary text-white border-natural-primary-hover shadow-xs' 
                    : 'bg-white text-natural-secondary hover:text-natural-text border-natural-border hover:bg-white/80'
                }`}
                title="Support Log"
              >
                <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'text-white' : 'text-natural-primary'}`} />
                <span>{likes}</span>
              </button>

              <button
                onClick={handleDislike}
                disabled={hasDisliked}
                className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-lg border text-xs font-bold transition-all ${
                  hasDisliked 
                    ? 'bg-natural-accent text-white border-natural-accent shadow-xs' 
                    : 'bg-white text-natural-secondary hover:text-natural-text border-natural-border hover:bg-white/80'
                }`}
                title="Dispute Log"
              >
                <ThumbsDown className={`w-4 h-4 ${hasDisliked ? 'text-white' : 'text-natural-accent'}`} />
                <span>{dislikes}</span>
              </button>
            </div>

            {/* Reports and Download */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleReport}
                className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-lg border text-xs font-bold transition-all ${
                  hasReported 
                    ? 'bg-red-100 text-red-700 border-red-200' 
                    : 'bg-white text-red-650 hover:text-red-700 border-natural-border hover:bg-red-50/50'
                }`}
                title="Report Flag Issues"
              >
                <Flag className="w-4 h-4 shrink-0" />
                <span>{hasReported ? (language === 'EN' ? 'Flagged' : 'चिह्नित किया गया') : (language === 'EN' ? 'Report Defect' : 'दोष रिपोर्ट')} ({reports})</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-white text-natural-text border border-natural-border hover:bg-natural-muted rounded-lg text-xs font-bold transition-all shadow-xs"
                title="Download JSON Report Sheet"
              >
                <Download className="w-4 h-4 text-natural-primary" />
                <span>{language === 'EN' ? 'Download PDF/JSON Log' : 'ऑडिट डाउनलोड करें'}</span>
              </button>
            </div>

          </div>

        </div>

        {/* Right Column - Sidebar (Credits & Comments) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Citizen Audit Credits Metadata Card */}
          <div className="bg-white border border-natural-border rounded-2xl p-6 space-y-4 shadow-2xs">
            <h3 className="font-sans font-extrabold text-xs uppercase text-natural-secondary tracking-widest block border-b border-natural-border pb-2">
              {language === 'EN' ? 'Audit Coordinates & Credits' : 'ऑडिट विवरण एवं श्रेय'}
            </h3>
            
            <div className="space-y-4">
              
              {/* Creator details */}
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-natural-muted rounded-lg border border-natural-border text-natural-primary shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono uppercase text-natural-secondary block">
                    Citizen Submitter Identifier
                  </span>
                  <p className="font-mono text-xs font-bold text-natural-text break-all">
                    {audit.userId.startsWith('guest_') || audit.userId === 'anonymous_citizen'
                      ? (language === 'EN' ? `Citizen Guest #${audit.userId.split('_').pop()}` : `नागरिक अतिथि #${audit.userId.split('_').pop()}`)
                      : `Member Key: ${audit.userId.substring(0, 8)}...`}
                  </p>
                </div>
              </div>

              {/* Created Time details */}
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-natural-muted rounded-lg border border-natural-border text-natural-primary shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono uppercase text-natural-secondary block">
                    Submission Timestamp
                  </span>
                  <p className="text-xs font-semibold text-natural-text">
                    {dateStr}
                  </p>
                </div>
              </div>

              {/* Geographic Coordinates details */}
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-natural-muted rounded-lg border border-natural-border text-natural-primary shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono uppercase text-natural-secondary block">
                    Spatio-Spatial Coordinates
                  </span>
                  <p className="font-mono text-xs text-natural-text">
                    {audit.geoPoint 
                      ? `${audit.geoPoint.latitude.toFixed(4)}° N, ${audit.geoPoint.longitude.toFixed(4)}° E` 
                      : (language === 'EN' ? "Dynamic Geo-Precision" : "सक्रिय भौगोलिक परिशुद्धता")}
                  </p>
                </div>
              </div>

              {/* Verification and Integrity details */}
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-natural-muted rounded-lg border border-natural-border text-natural-primary shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono uppercase text-natural-secondary block">
                    Platform Integrity Compliance
                  </span>
                  <p className="text-xs font-semibold text-natural-text flex items-center space-x-1">
                    {audit.approvedByAdmin ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 text-natural-primary inline" />
                        <span className="text-[#3E4E35]">{language === 'EN' ? "Core Council Verified" : "परिषद द्वारा सत्यापित"}</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5 text-natural-accent inline" />
                        <span className="text-[#C2410C]">{language === 'EN' ? "Pending Audit Verification" : "ऑडिट सत्यापन लंबित"}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Discussion comments stream card */}
          <div className="bg-white border border-natural-border rounded-2xl p-6 space-y-4 shadow-2xs flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-sans font-extrabold text-xs uppercase text-natural-secondary tracking-widest block border-b border-natural-border pb-2 flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4 text-natural-primary" />
                <span>{language === 'EN' ? 'Citizen Peer Collaborations' : 'नागरिक सहकर्मी चर्चा'} ({commentsList.length})</span>
              </h3>

              {/* Scrollable conversation bubble area */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {commentsList.length === 0 ? (
                  <div className="text-center py-8 bg-natural-muted border border-dashed border-natural-border rounded-xl">
                    <p className="text-[11px] font-mono text-natural-secondary">
                      {language === 'EN' ? 'No collaborations published yet. Be the first!' : 'अभी तक कोई टिप्पणी नहीं। पहले बनें!'}
                    </p>
                  </div>
                ) : (
                  commentsList.map((comm) => {
                    let commTime = "Recent";
                    if (comm.createdAt) {
                      try {
                        const cDate = comm.createdAt.toDate ? comm.createdAt.toDate() : new Date(comm.createdAt);
                        commTime = cDate.toLocaleDateString(language === 'EN' ? 'en' : 'hi', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        });
                      } catch (_) {}
                    }

                    return (
                      <div key={comm.id} className="p-3 bg-natural-muted border border-natural-border rounded-xl space-y-1 relative">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-sans font-bold text-natural-text">
                            {comm.authorName}
                          </span>
                          <span className="text-[9px] font-mono font-semibold text-natural-secondary">
                            {commTime}
                          </span>
                        </div>
                        <p className="text-xs text-natural-dark-secondary font-light leading-relaxed">
                          {comm.text}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Post comment form */}
            <form onSubmit={handleCommentSubmit} className="space-y-3 border-t border-natural-border pt-4 mt-2">
              <div className="space-y-1">
                <input 
                  type="text"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  placeholder={language === 'EN' ? 'Enter alias name / nick (optional)' : 'कौशल्या / उपनाम (वैकल्पिक)'}
                  className="w-full text-xs p-2 border border-natural-border rounded-lg bg-white text-natural-text font-semibold focus:outline-none focus:border-natural-primary"
                  maxLength={50}
                />
              </div>

              <div className="relative flex">
                <input 
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={language === 'EN' ? 'Add peer observation...' : 'सहकर्मी अवलोकन जोड़ें...'}
                  className="w-full text-xs pl-3 pr-10 py-2.5 border border-natural-border rounded-lg bg-white text-natural-text focus:outline-none focus:border-natural-primary"
                  maxLength={500}
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmittingComment}
                  className="absolute right-1 top-1 bottom-1 px-3 bg-natural-primary hover:bg-[#3E4E35] text-white rounded-md shrink-0 flex items-center justify-center transition-colors shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
};
