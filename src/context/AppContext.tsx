import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInAnonymously, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  addDoc,
  setDoc,
  doc,
  getDocs,
  getDoc,
  deleteDoc,
  updateDoc,
  getDocFromServer,
  Timestamp
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { Language, Agenda, ResearchDoc, Dispatch, CitizenAudit, Subscriber } from '../types';

export interface TranslationSet {
  app_title: string;
  app_tagline: string;
  home: string;
  agendas: string;
  research: string;
  dispatches: string;
  citizen_audits: string;
  admin_panel: string;
  language: string;
  sign_in: string;
  sign_out: string;
  loading: string;
  subscribe: string;
  email_placeholder: string;
  subscribe_success: string;
  subscribe_error: string;
  submit_audit: string;
  my_contributions: string;
  all_audits: string;
  about_mission: string;
  about_p1: string;
  about_p2: string;
  about_p3: string;
  contact_us: string;
  contact_p: string;
}

const translations: Record<Language, TranslationSet> = {
  EN: {
    app_title: "Public Infrastructure Forum",
    app_tagline: "Citizen collective for urban infrastructure justice, accountability, and accessibility in Indian cities.",
    home: "Home",
    agendas: "Agendas",
    research: "Research Hub",
    dispatches: "Dispatches & News",
    citizen_audits: "Citizen Audits",
    admin_panel: "Dashboard",
    language: "Language",
    sign_in: "Admin Portal",
    sign_out: "Sign Out",
    loading: "Loading platform assets...",
    subscribe: "Subscribe to Newsletter",
    email_placeholder: "Enter your email address...",
    subscribe_success: "Thank you! You have been subscribed to our Monthly Dispatch.",
    subscribe_error: "Please enter a valid email address.",
    submit_audit: "Submit Infrastructure Audit",
    my_contributions: "My Reports",
    all_audits: "Public Infrastructure Index",
    about_mission: "Our Mission",
    about_p1: "The Public Infrastructure Forum (PIF) is a civic tech collective of civil engineers, urban planners, public policy researchers, and regular citizens advocating for infrastructure justice within Indian cities.",
    about_p2: "Inspired by grassroots urban mobility movements, we build open-access software, conduct independent spatial and engineering audits, and provide municipalities with granular, crowdsourced datasets.",
    about_p3: "We believe that footpaths, clean water lines, storm drains, and accessible public toilets are not luxuries, but fundamental human rights of every urban resident.",
    contact_us: "Connect With Us",
    contact_p: "Have a local issue, or want to contribute to our research? Join the open platform."
  },
  HI: {
    app_title: "सार्वजनिक बुनियादी ढांचा मंच",
    app_tagline: "भारतीय शहरों में शहरी बुनियादी ढांचे के न्याय, जवाबदेही और पहुंच के लिए नागरिक सामूहिक।",
    home: "मुख्य पृष्ठ",
    agendas: "एजेंडा",
    research: "अनुसंधान केंद्र",
    dispatches: "समाचार और प्रेषण",
    citizen_audits: "नागरिक ऑडिट",
    admin_panel: "डैशबोर्ड",
    language: "भाषा",
    sign_in: "प्रशासक द्वार",
    sign_out: "लॉग आउट",
    loading: "प्लेटफ़ॉर्म संपत्ति लोड हो रही है...",
    subscribe: "मासिक समाचार पत्र प्राप्त करें",
    email_placeholder: "अपना ईमेल पता दर्ज करें...",
    subscribe_success: "धन्यवाद! आप हमारे मासिक प्रेषण के ग्राहक बन गए हैं।",
    subscribe_error: "कृपया एक वैध ईमेल दर्ज करें।",
    submit_audit: "बुनियादी ढांचा ऑडिट सबमिट करें",
    my_contributions: "मेरी रिपोर्ट",
    all_audits: "सार्वजनिक बुनियादी ढांचा सूचकांक",
    about_mission: "हमारा उद्देश्य",
    about_p1: "सार्वजनिक बुनियादी ढांचा मंच (PIF) भारतीय शहरों में बुनियादी ढांचा न्याय की वकालत करने वाले सिविल इंजीनियरों, शहरी योजनाकारों, सार्वजनिक नीति शोधकर्ताओं और आम नागरिकों का एक नागरिक मंच है।",
    about_p2: "बुनियादी शहरी गतिशीलता आंदोलनों से प्रेरित होकर, हम ओपन-एक्सेस सॉफ्टवेयर बनाते हैं, स्वतंत्र स्थानिक और इंजीनियरिंग ऑडिट करते हैं, और नगर पालिकाओं को व्यापक डेटासेट प्रदान करते हैं।",
    about_p3: "हमारा मानना है कि फुटपाथ, स्वच्छ पानी की लाइनें, तूफान जल निकासी नाले, और सुलभ सार्वजनिक शौचालय विलासिता नहीं हैं, बल्कि हर शहरी निवासी के मौलिक मानवाधिकार हैं।",
    contact_us: "हमसे जुड़ें",
    contact_p: "कोई स्थानीय समस्या है, या हमारे शोध में योगदान देना चाहते हैं? हमारे खुले मंच से जुड़ें।"
  }
};

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  agendas: Agenda[];
  researchDocs: ResearchDoc[];
  dispatches: Dispatch[];
  audits: CitizenAudit[];
  subscribersCount: number;
  t: TranslationSet;
  anonymousSignIn: () => Promise<void>;
  googleSignIn: () => Promise<void>;
  emailSignIn: (e: string, p: string) => Promise<void>;
  logOut: () => Promise<void>;
  submitAudit: (audit: Omit<CitizenAudit, 'id' | 'createdAt' | 'approvedByAdmin'>) => Promise<string>;
  submitSubscriber: (email: string) => Promise<void>;
  approveAudit: (auditId: string) => Promise<void>;
  deleteAudit: (auditId: string) => Promise<void>;
  addResearchDoc: (doc: Omit<ResearchDoc, 'id' | 'timestamp'>) => Promise<void>;
  deleteResearchDoc: (docId: string) => Promise<void>;
  addDispatch: (disp: Omit<Dispatch, 'id' | 'publishedAt'>) => Promise<void>;
  deleteDispatch: (dispId: string) => Promise<void>;
  seedInitialData: () => Promise<void>;
  likeAudit: (auditId: string) => Promise<void>;
  dislikeAudit: (auditId: string) => Promise<void>;
  reportAudit: (auditId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('EN');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Firestore DB status collections state
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [researchDocs, setResearchDocs] = useState<ResearchDoc[]>([]);
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [audits, setAudits] = useState<CitizenAudit[]>([]);
  const [subscribersCount, setSubscribersCount] = useState<number>(0);

  // 1. Connection Test Guideline
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test_connection', 'ping'));
        console.log("Firebase connection verified successfully from server.");
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Firebase connection check: Client offline. Check network configuration.");
        } else {
          console.log("Firebase initialized correctly (ping completed).");
        }
      }
    }
    testConnection();
  }, []);

  // 2. Load Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Enforce admin bootstrap
        const isUserAdmin = currentUser.email === 'srikarsharmamarupaka@gmail.com';
        setIsAdmin(isUserAdmin);
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 3. Real-Time Syncing of Collections
  useEffect(() => {
    // Agendas Sync
    const agendasPath = 'agendas';
    const unsubAgendas = onSnapshot(collection(db, agendasPath), (snapshot) => {
      const list: Agenda[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Agenda);
      });
      list.sort((a, b) => a.order - b.order);
      setAgendas(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, agendasPath);
    });

    // Research Docs Sync
    const researchPath = 'research_docs';
    const unsubResearch = onSnapshot(collection(db, researchPath), (snapshot) => {
      const list: ResearchDoc[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as ResearchDoc);
      });
      setResearchDocs(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, researchPath);
    });

    // Dispatches Sync
    const dispatchesPath = 'dispatches';
    const unsubDispatches = onSnapshot(collection(db, dispatchesPath), (snapshot) => {
      const list: Dispatch[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Dispatch);
      });
      setDispatches(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, dispatchesPath);
    });

    // Citizen Audits Sync
    const auditsPath = 'citizen_audits';
    const unsubAudits = onSnapshot(collection(db, auditsPath), (snapshot) => {
      const list: CitizenAudit[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as CitizenAudit);
      });
      setAudits(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, auditsPath);
    });

    return () => {
      unsubAgendas();
      unsubResearch();
      unsubDispatches();
      unsubAudits();
    };
  }, []);

  // Subscribers Count Sync (Only for Admin to avoid Permission Denied errors for regular public users)
  useEffect(() => {
    if (!isAdmin) {
      setSubscribersCount(0);
      return;
    }

    const subsPath = 'subscribers';
    const unsubSubs = onSnapshot(collection(db, subsPath), (snapshot) => {
      setSubscribersCount(snapshot.size);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, subsPath);
    });

    return () => {
      unsubSubs();
    };
  }, [isAdmin]);

  const anonymousSignIn = async () => {
    try {
      await signInAnonymously(auth);
    } catch (e) {
      console.error("Anonymous authentication problem:", e);
    }
  };

  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error("Google authentication problem:", e);
    }
  };

  const emailSignIn = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (e) {
      console.error("Email authentication problem:", e);
      throw e;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Sign out problem:", e);
    }
  };

  const submitAudit = async (auditData: Omit<CitizenAudit, 'id' | 'createdAt' | 'approvedByAdmin'>) => {
    const auditsPath = 'citizen_audits';
    try {
      const finalAudit = {
        ...auditData,
        approvedByAdmin: false,
        createdAt: Timestamp.now(),
        likesCount: 0,
        dislikesCount: 0,
        reportsCount: 0
      };
      // We generate a custom ID first
      const collectionRef = collection(db, auditsPath);
      const docRef = doc(collectionRef);
      const id = docRef.id;
      
      const payload = {
        id,
        ...finalAudit
      };

      await setDoc(docRef, payload);
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, auditsPath);
      return '';
    }
  };

  const submitSubscriber = async (email: string) => {
    const subsPath = 'subscribers';
    const cleanEmail = email.trim().toLowerCase();
    const emailHash = cleanEmail.replace(/[^a-zA-Z0-9]/g, '_'); // safe firestore id keys
    try {
      const subRef = doc(db, subsPath, emailHash);
      const docSnap = await getDoc(subRef);
      if (docSnap.exists()) {
        return; // already exists, deduplicate
      }

      const subscriberData: Subscriber = {
        email: cleanEmail,
        subscribedAt: Timestamp.now(),
        sourcePlatform: "Web Interface"
      };

      await setDoc(subRef, subscriberData);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${subsPath}/${emailHash}`);
    }
  };

  const approveAudit = async (auditId: string) => {
    const auditsPath = 'citizen_audits';
    try {
      const docRef = doc(db, auditsPath, auditId);
      await updateDoc(docRef, { approvedByAdmin: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${auditsPath}/${auditId}`);
    }
  };

  const deleteAudit = async (auditId: string) => {
    const auditsPath = 'citizen_audits';
    try {
      const docRef = doc(db, auditsPath, auditId);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${auditsPath}/${auditId}`);
    }
  };

  const likeAudit = async (auditId: string) => {
    const auditsPath = 'citizen_audits';
    try {
      const docRef = doc(db, auditsPath, auditId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const currentLikes = docSnap.data().likesCount || 0;
        await updateDoc(docRef, { likesCount: currentLikes + 1 });
      }
    } catch (error) {
      console.error("Failed to like audit:", error);
    }
  };

  const dislikeAudit = async (auditId: string) => {
    const auditsPath = 'citizen_audits';
    try {
      const docRef = doc(db, auditsPath, auditId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const currentDislikes = docSnap.data().dislikesCount || 0;
        await updateDoc(docRef, { dislikesCount: currentDislikes + 1 });
      }
    } catch (error) {
      console.error("Failed to dislike audit:", error);
    }
  };

  const reportAudit = async (auditId: string) => {
    const auditsPath = 'citizen_audits';
    try {
      const docRef = doc(db, auditsPath, auditId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const currentReports = docSnap.data().reportsCount || 0;
        await updateDoc(docRef, { reportsCount: currentReports + 1 });
      }
    } catch (error) {
      console.error("Failed to report audit:", error);
    }
  };

  const addResearchDoc = async (docData: Omit<ResearchDoc, 'id' | 'timestamp'>) => {
    const researchPath = 'research_docs';
    try {
      const collectionRef = collection(db, researchPath);
      const docRef = doc(collectionRef);
      const id = docRef.id;
      const payload: ResearchDoc = {
        id,
        ...docData,
        timestamp: Timestamp.now()
      };
      await setDoc(docRef, payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, researchPath);
    }
  };

  const deleteResearchDoc = async (docId: string) => {
    const researchPath = 'research_docs';
    try {
      const docRef = doc(db, researchPath, docId);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${researchPath}/${docId}`);
    }
  };

  const addDispatch = async (dispData: Omit<Dispatch, 'id' | 'publishedAt'>) => {
    const dispatchesPath = 'dispatches';
    try {
      const collectionRef = collection(db, dispatchesPath);
      const docRef = doc(collectionRef);
      const id = docRef.id;
      const payload: Dispatch = {
        id,
        ...dispData,
        publishedAt: Timestamp.now()
      };
      await setDoc(docRef, payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, dispatchesPath);
    }
  };

  const deleteDispatch = async (dispId: string) => {
    const dispatchesPath = 'dispatches';
    try {
      const docRef = doc(db, dispatchesPath, dispId);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${dispatchesPath}/${dispId}`);
    }
  };

  // Seeding baseline structure
  const seedInitialData = async () => {
    const seedsAgendas = [
      {
        id: "agenda_fair_resource",
        title_en: "Fair Resource Allocation",
        title_hi: "समान संसाधन आवंटन",
        body_en: "Advocating for municipal policies that ensure low-income and peripheral neighborhoods receive equitable funding for pavement improvements, safety grids, drainage, and sustainable street lighting.",
        body_hi: "यह सुनिश्चित करने के लिए नगर निगम की नीतियों की वकालत करना कि कम आय वाले और बाहरी क्षेत्रों को फुटपाथ सुधार, सुरक्षा ग्रिड, जल निकासी और टिकाऊ सड़क प्रकाश व्यवस्था के लिए समान धन प्राप्त हो।",
        icon: "TrendingUp",
        order: 1
      },
      {
        id: "agenda_universal_design",
        title_en: "Public Safety & Universal Design",
        title_hi: "सार्वजनिक सुरक्षा और सार्वभौमिक डिजाइन",
        body_en: "Auditing and mapping pedestrian networks. Advocating for wheelchair ramps, continuous obstacle-free pathways, tactile tiles for blind citizens, and sufficient illumination across all city corridors.",
        body_hi: "पैदल यात्री नेटवर्कों का ऑडिट और मानचित्रण करना। व्हीलचेयर रैंप, निरंतर बाधा मुक्त रास्तों, दृष्टिबाधित नागरिकों के लिए स्पर्श टाइलें और सभी शहर गलियारों में पर्याप्त रोशनी की वकालत करना।",
        icon: "ShieldAlert",
        order: 2
      },
      {
        id: "agenda_climate_utilities",
        title_en: "Climate-Resilient Utilities",
        title_hi: "जलवायु-सहनशील उपयोगिताएँ",
        body_en: "Redesigning stormwater drainage networks, primary water supply channels, and electricity routing configurations to withstand devastating monsoon flooding, urban heat expansion, and cloudburst events.",
        body_hi: "मानसून की विनाशकारी बाढ़, शहरी गर्मी के विस्तार और मूसलाधार बारिश की घटनाओं का सामना करने के लिए वर्षा जल निकासी नेटवर्क, बुनियादी जल आपूर्ति चैनलों और बिजली मार्गों को नया स्वरूप देना।",
        icon: "CloudRain",
        order: 3
      },
      {
        id: "agenda_governance_policy",
        title_en: "Open Governance & Policy Accountability",
        title_hi: "खुला शासन और नीति जवाबदेही",
        body_en: "Democratizing urban research, contract compliance databases, and capital expenditure registers. Empowering communities to audit municipal budgets, work schedules, and public declarations.",
        body_hi: "शहरी अनुसंधान, अनुबंध अनुपालन डेटाबेस और पूंजीगत व्यय रजिश्टरों का लोकतंत्रीकरण। नागरिक समुदायों को नगर निगम के बजट, कार्य योजनाओं और सार्वजनिक घोषणाओं के ऑडिट के लिए सशक्त बनाना।",
        icon: "BookOpen",
        order: 4
      }
    ];

    const seedsDocs = [
      {
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

    const seedsDispatches = [
      {
        title_en: "Open Letter to Municipal Commissioners on Flooding Readiness",
        title_hi: "बाढ़ तैयारी पर नगर आयुक्तों को खुला पत्र",
        content_en: "We have compiled and formally delivered comprehensive pre-monsoon drainage audit reports mapping 180 critical storm drain clogging nodes to municipal corporations. PIF urges authorities to immediate de-silt all secondary drains, remove brick dust and cement blockage residues, and make ward drainage maps publicly available.",
        content_hi: "हमने नगर निगमों को 180 महत्वपूर्ण तूफान जल निकास अवरोध नोड्स का मानचित्रण करने वाली व्यापक प्री-मानसून जल निकासी ऑडिट रिपोर्ट संकलित कर औपचारिक रूप से सौंप दी है। PIF अधिकारियों से सभी माध्यमिक नालियों को तत्काल साफ करने, मलबे और सीमेंट ब्लॉकेज को हटाने और वार्ड के जल निकासी मानचित्रों को सार्वजनिक करने का आग्रह करता है।",
        author: "PIF Secretariat",
        tags: ["Governance", "Monsoon", "Drainage"],
        isDraft: false
      },
      {
        title_en: "Citizen Audits Cross 500 Submissions Milestone",
        title_hi: "नागरिक ऑडिट ने 500 सबमिशन का मील का पत्थर पार किया",
        content_en: "Thanks to grassroots mobilization and collective citizen audits, we have now cataloged over 500 infrastructure accessibility reports across Mumbai, Delhi, Bengaluru, and Pune. This data establishes a powerful visual index mapping wheelchair blockade indexes, which our legal core will present in upcoming policy seminars.",
        content_hi: "जमीनी स्तर पर लामबंदी और नागरिक ऑडिट के लिए धन्यवाद, हमने अब मुंबई, दिल्ली, बेंगलुरु और पुणे में 500 से अधिक बुनियादी ढांचा पहुंच रिपोर्टों को सूचीबद्ध किया है। यह डेटा व्हीलचेयर ब्लॉकेड इंडेक्स को दिखाता है, जिसे हमारी कानूनी टीम आगामी नीति सेमिनार में पेश करेगी।",
        author: "PIF Tech Lead",
        tags: ["Audits", "Community", "Accessibility"],
        isDraft: false
      }
    ];

    try {
      // Seed agendas
      for (const a of seedsAgendas) {
        await setDoc(doc(db, 'agendas', a.id), a);
      }
      // Seed doc
      for (const d of seedsDocs) {
        const id = "doc_" + d.title_en.toLowerCase().replace(/[^a-z0-9]/g, '_');
        await setDoc(doc(db, 'research_docs', id), {
          id,
          ...d,
          timestamp: Timestamp.now()
        });
      }
      // Seed dispatches
      for (const disp of seedsDispatches) {
        const id = "dispatch_" + disp.title_en.toLowerCase().replace(/[^a-z0-9]/g, '_');
        await setDoc(doc(db, 'dispatches', id), {
          id,
          ...disp,
          publishedAt: Timestamp.now()
        });
      }
      console.log("Database seeded successfully!");
    } catch (e) {
      console.error("Failed to seed initial data:", e);
    }
  };

  const t = translations[language];

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      activeTab,
      setActiveTab,
      user,
      isAdmin,
      isLoading,
      agendas,
      researchDocs,
      dispatches,
      audits,
      subscribersCount,
      t,
      anonymousSignIn,
      googleSignIn,
      emailSignIn,
      logOut,
      submitAudit,
      submitSubscriber,
      approveAudit,
      deleteAudit,
      addResearchDoc,
      deleteResearchDoc,
      addDispatch,
      deleteDispatch,
      seedInitialData,
      likeAudit,
      dislikeAudit,
      reportAudit
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
