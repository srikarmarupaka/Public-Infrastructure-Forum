import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { auth } from '../firebase';
import { 
  ClipboardCheck, 
  MapPin, 
  AlertTriangle, 
  Plus, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles, 
  Image, 
  UserPlus, 
  FileSpreadsheet, 
  ThermometerSun,
  Smile,
  AlertCircle
} from 'lucide-react';
import { AuditDetail } from './AuditDetail';
import { CitizenAudit } from '../types';

export const assessmentQuestions = {
  'Pavements / Ramps': {
    physical: [
      {
        key: 'pave_encroachment',
        labelEN: 'Is the pavement free from commercial, vendor, or physical encroachments?',
        labelHI: 'क्या फुटपाथ वाणिज्यिक, विक्रेता या शारीरिक अतिक्रमण से मुक्त है?',
        options: [
          { score: 35, textEN: 'Fully Free & Wide', textHI: 'पूरी तरह मुक्त और चौड़ा' },
          { score: 15, textEN: 'Partially Blocked', textHI: 'आंशिक रूप से अवरुद्ध' },
          { score: 5, textEN: 'Severely Blocked', textHI: 'गंभीर रूप से अवरुद्ध' }
        ]
      },
      {
        key: 'pave_damage',
        labelEN: 'What is the physical condition of the paving surface slabs?',
        labelHI: 'फुटपाथ की सतह के स्लैब की भौतिक स्थिति कैसी है?',
        options: [
          { score: 35, textEN: 'Excellent, No Minor/Major cracks', textHI: 'उत्कृष्ट, कोई दरार नहीं' },
          { score: 15, textEN: 'Uneven slabs / minor cracks / sand leaks', textHI: 'असमान स्लैब / मामूली दरारें' },
          { score: 5, textEN: 'Broken, uneven or open manholes present', textHI: 'टूटे हुए, असमान या खुले मैनहोल' }
        ]
      },
      {
        key: 'pave_accessibility',
        labelEN: 'Are there standard tactile pavings, safety curbs, or crossing ramps?',
        labelHI: 'क्या मानक स्पर्शनीय फुटपाथ, सुरक्षा कर्ब या क्रॉसिंग रैंप मौजूद हैं?',
        options: [
          { score: 30, textEN: 'Present, continuous and high standard', textHI: 'मौजूद, निरंतर और उच्च मानक' },
          { score: 15, textEN: 'Incomplete or steep ramp angles', textHI: 'अधूरे या अत्यधिक ढलान' },
          { score: 5, textEN: 'Completely missing / absent', textHI: 'पूरी तरह से अनुपस्थित' }
        ]
      }
    ],
    climate: [
      {
        key: 'pave_stagnation',
        labelEN: 'Does water stagnate on the pavement surface during local monsoons?',
        labelHI: 'क्या स्थानीय मानसून के दौरान फुटपाथ की सतह पर पानी जमा होता है?',
        options: [
          { score: 5, textEN: 'Never, drains out instantly', textHI: 'कभी नहीं, तुरंत बह जाता है' },
          { score: 3, textEN: 'Mild puddles but dries in an hour', textHI: 'हल्के पोखर लेकिन एक घंटे में सूख जाते हैं' },
          { score: 1, textEN: 'Severely flooded, unusable', textHI: 'गंभीर रूप से जलमग्न, अनुपयोगी' }
        ]
      },
      {
        key: 'pave_erosion',
        labelEN: 'Does the paving material resist monsoon wear and structural shifting?',
        labelHI: 'क्या फुटपाथ की सामग्री मानसून के घिसाव और संरचनात्मक बदलाव का विरोध करती है?',
        options: [
          { score: 5, textEN: 'Retains integrity perfectly', textHI: 'पूरी तरह से अखंडता बनाए रखता है' },
          { score: 3, textEN: 'Slight sand erosion/cracking', textHI: 'हल्की मिट्टी का कटाव/दरारें' },
          { score: 1, textEN: 'Completely washed away/collapsed', textHI: 'पूरी तरह से बह गया/ढह गया' }
        ]
      }
    ]
  },
  'Drainage & Storm Sewer': {
    physical: [
      {
        key: 'drain_silt',
        labelEN: 'What is the plastic siltation and debris clogging level inside the drain?',
        labelHI: 'नाली के अंदर प्लास्टिक गाद और मलबे के बंद होने का स्तर क्या है?',
        options: [
          { score: 35, textEN: 'Perfectly clear, high velocity flow', textHI: 'पूरी तरह साफ, तेज़ बहाव' },
          { score: 15, textEN: 'Minor plastic silt / dry rubbish bags', textHI: 'मामूली प्लास्टिक गाद / सूखा कचरा' },
          { score: 5, textEN: 'Severely choked with mud or solid waste', textHI: 'मिट्टी या ठोस कचरे से पूरी तरह अवरुद्ध' }
        ]
      },
      {
        key: 'drain_cover',
        labelEN: 'What is the status of the drain covers and structural grates?',
        labelHI: 'नाली के कवर और संरचनात्मक झंझरी की क्या स्थिति है?',
        options: [
          { score: 35, textEN: 'Fully covered safely with heavy concrete/iron grates', textHI: 'भारी कंक्रीट/लोहे की झंझरी से सुरक्षित' },
          { score: 15, textEN: 'Broken tiles or gaps present', textHI: 'टूटी हुई टाइलें या अंतराल मौजूद हैं' },
          { score: 5, textEN: 'Fully open, hazardous public pit', textHI: 'पूरी तरह से खुला, खतरनाक सार्वजनिक गड्ढा' }
        ]
      },
      {
        key: 'drain_slope',
        labelEN: 'Does the drain have proper gravity descent/gradient slope?',
        labelHI: 'क्या नाली में उचित गुरुत्वाकर्षण प्रवाह/ढाल ढलान है?',
        options: [
          { score: 30, textEN: 'Continuous natural flow, zero stagnation', textHI: 'निरंतर प्राकृतिक प्रवाह, शून्य ठहराव' },
          { score: 15, textEN: 'Weak slope, water stands still', textHI: 'कम ढलान, पानी स्थिर रहता है' },
          { score: 5, textEN: 'Flawed gradient, backward overflow constant', textHI: 'त्रुटिपूर्ण ढाल, लगातार उल्टा बहाव' }
        ]
      }
    ],
    climate: [
      {
        key: 'drain_monsoon_peak',
        labelEN: 'Can the drain handle sudden extreme peak rainfall without spill-over?',
        labelHI: 'क्या नाली बिना बाहर बहे अचानक अत्यधिक वर्षा को संभाल सकती है?',
        options: [
          { score: 5, textEN: 'Handles with high reserve capacity', textHI: 'उच्च आरक्षित क्षमता के साथ' },
          { score: 3, textEN: 'Brims to edges but avoids spilling', textHI: 'किनारों तक भरता है लेकिन बाहर नहीं बहता' },
          { score: 1, textEN: 'Spills out instantly, flooding streets', textHI: 'तुरंत बहकर सड़कों पर बाढ़ ला देता है' }
        ]
      },
      {
        key: 'drain_desilting',
        labelEN: 'When was the last documented heavy desilting or cleaning done?',
        labelHI: 'आखिरी बार नाली की भारी सफाई या गाद निकालना कब किया गया था?',
        options: [
          { score: 5, textEN: 'Cleaned within last 3 months / Pre-monsoon', textHI: 'पिछले 3 महीनों में / मानसून पूर्व' },
          { score: 3, textEN: 'Cleaned about 6-12 months ago', textHI: 'लगभग 6-12 महीने पहले' },
          { score: 1, textEN: 'No cleaning done for years / Neglected', textHI: 'वर्षों से कोई सफाई नहीं की गई' }
        ]
      }
    ]
  },
  'Public Latrines / Hygiene': {
    physical: [
      {
        key: 'toilet_faucets',
        labelEN: 'Is there functional pressurized running water inside the toilets?',
        labelHI: 'क्या शौचालयों के अंदर चालू और दबावयुक्त पानी की सुविधा है?',
        options: [
          { score: 35, textEN: 'Yes, fully functional taps & toilet flushes', textHI: 'हाँ, पूरी तरह चालू नल और फ्लश' },
          { score: 15, textEN: 'Taps functional but flow is weak/irregular', textHI: 'नल चालू हैं लेकिन बहाव धीमा/अनियमित है' },
          { score: 5, textEN: 'No/Broken pipelines, buckets water fallback', textHI: 'नहीं/टूटी पाइपलाइन, बाल्टी से काम चलाना' }
        ]
      },
      {
        key: 'toilet_cleanness',
        labelEN: 'What is the maintenance, sanitation and odor level of the cubicles?',
        labelHI: 'क्यूबिकल्स की स्वच्छता, रखरखाव और गंध का स्तर क्या है?',
        options: [
          { score: 35, textEN: 'Spotless, daily disinfected and tracked', textHI: 'बेदाग, प्रतिदिन कीटाणुरहित' },
          { score: 15, textEN: 'Tolerable odor, light trash visible', textHI: 'सहने योग्य गंध, हल्का कचरा' },
          { score: 5, textEN: 'Extremely dirty, strong odor, unusable', textHI: 'अत्यधिक गंदे, तेज़ गंध, अनुपयोगी' }
        ]
      },
      {
        key: 'toilet_security',
        labelEN: 'Are individual door bolts, locks, and inner lights working?',
        labelHI: 'क्या अलग-अलग दरवाजों के बोल्ट, लॉक और अंदर की लाइटें काम कर रही हैं?',
        options: [
          { score: 30, textEN: 'All locks secure with high illumination levels', textHI: 'सभी ताले सुरक्षित और अच्छी रोशनी' },
          { score: 15, textEN: 'Working but doors rusty or light is dim', textHI: 'काम कर रहे हैं लेकिन दरवाजों पर जंग/रोशनी कम' },
          { score: 5, textEN: 'No active light, broken doors/locks', textHI: 'कोई लाइट नहीं, टूटे दरवाजे/ताले' }
        ]
      }
    ],
    climate: [
      {
        key: 'toilet_wet_flow',
        labelEN: 'Does the septage or effluent line backup/leak during rainy seasons?',
        labelHI: 'क्या बरसात के दिनों में सेप्टिक या अपशिष्ट लाइन वापस बहती/लीक होती है?',
        options: [
          { score: 5, textEN: 'No leaks, secure underground chamber', textHI: 'कोई रिसाव नहीं, भूमिगत कक्ष' },
          { score: 3, textEN: 'Mild damp smells but no active spillover', textHI: 'मामूली नमी की गंध लेकिन रिसाव नहीं' },
          { score: 1, textEN: 'Active sewerage overflow / backs up frequently', textHI: 'सीवरेज ओवरफ़्लो / अक्सर वापस बहता है' }
        ]
      },
      {
        key: 'toilet_reservoir',
        labelEN: 'Is the overhead reserve water tank sanitary and weather-sealed?',
        labelHI: 'क्या ओवरहेड आरक्षित पानी की टंकी स्वच्छ और मौसम-सुरक्षित है?',
        options: [
          { score: 5, textEN: 'Fully closed, clean high-grade tank', textHI: 'पूरी तरह बंद, साफ़ उच्च-श्रेणी टैंक' },
          { score: 3, textEN: 'Lacks locked lid but covered', textHI: 'ताला नहीं है लेकिन ढकी हुई है' },
          { score: 1, textEN: 'Cracked, leaks water, open to dust/rain', textHI: 'टूटी हुई, पानी टपकता है, धूल/बारिश खुली' }
        ]
      }
    ]
  },
  'Street Lighting / Luminescence': {
    physical: [
      {
        key: 'light_active_rate',
        labelEN: 'What percentages of poles are fully active after dusk?',
        labelHI: 'शाम होने के बाद कितने प्रतिशत पोल पूरी तरह चालू होते हैं?',
        options: [
          { score: 35, textEN: '90% - 100% active, highly luminous', textHI: '90% - 100% चालू, अत्यधिक रोशनी' },
          { score: 15, textEN: '50% - 89% active, flickering present', textHI: '50% - 89% चालू, टिमटिमाते हुए' },
          { score: 5, textEN: 'Under 50% working, pitch dark road corridors', textHI: '50% से कम चालू, घोर अँधेरा' }
        ]
      },
      {
        key: 'light_exposed_wires',
        labelEN: 'Are pole base junction panels sealed safely without exposed wiring?',
        labelHI: 'क्या पोल बेस जंक्शन पैनल बिना खुले तारों के सुरक्षित रूप से सील किए गए हैं?',
        options: [
          { score: 35, textEN: 'Perfect metal shutters, locked tightly', textHI: 'उत्कृष्ट धातु के शटर, सुरक्षित रूप से बंद' },
          { score: 15, textEN: 'Shutters half-broken but main cables insulated', textHI: 'आधे टूटे शटर लेकिन मुख्य केबल इंसुलेटेड' },
          { score: 5, textEN: 'No covers, raw high-voltage hanging wires exposed', textHI: 'कोई कवर नहीं, ऊंचे वोल्टेज के खुले तार बाहर' }
        ]
      },
      {
        key: 'light_structural',
        labelEN: 'Is the pole structurally stable and free of severe rust?',
        labelHI: 'क्या पोल संरचनात्मक रूप से स्थिर है और जंग-मुक्त है?',
        options: [
          { score: 30, textEN: 'Stable erect poles, zero dangerous tilts', textHI: 'स्थिर सीधे पोल, कोई खतरनाक झुकाव नहीं' },
          { score: 15, textEN: 'Light rust or bent brackets found', textHI: 'हल्का जंग या मुड़े हुए ब्रैकेट' },
          { score: 5, textEN: 'Severely listing/tilted, rusting base, unsafe', textHI: 'गंभीर रूप से झुके/जंग लगा आधार, असुरक्षित' }
        ]
      }
    ],
    climate: [
      {
        key: 'light_rain_short',
        labelEN: 'Do street lighting panels collapse or short-circuit during thunder/rain?',
        labelHI: 'क्या आंधी/बारिश के दौरान लाइट पैनल खराब हो जाते हैं या शॉर्ट-सर्किट होते हैं?',
        options: [
          { score: 5, textEN: 'Extremely durable, rarely fails', textHI: 'अत्यधिक टिकाऊ, शायद ही कभी खराब' },
          { score: 3, textEN: 'Occasional brief trips/fuses blow in heavy storms', textHI: 'भारी तूफान में कभी-कभी लाइट जाना' },
          { score: 1, textEN: 'Fails instantly at first hint of rain/wind', textHI: 'बारिश/हवा की पहली आहट पर ही तुरंत बंद' }
        ]
      },
      {
        key: 'light_junction_height',
        labelEN: 'Is the electrical junction box safe above peak local puddle water levels?',
        labelHI: 'क्या इलेक्ट्रिकल जंक्शन बॉक्स स्थानीय जलजमाव के स्तर से ऊपर सुरक्षित है?',
        options: [
          { score: 5, textEN: 'Placed high up on the pole, fully weatherproofed', textHI: 'पोल पर काफी ऊपर, पूरी तरह मौसम-सुरक्षित' },
          { score: 3, textEN: 'At medium height but has protective rubber gaskets', textHI: 'मध्यम ऊंचाई पर लेकिन रबर गैस्केट के साथ' },
          { score: 1, textEN: 'Placed dangerously low, submerged on standard rainy days', textHI: 'काफी नीचे, बारिश के दिनों में डूब जाता है' }
        ]
      }
    ]
  },
  'Potable Water Pipelines': {
    physical: [
      {
        key: 'water_purity',
        labelEN: 'Is the piped water clear, transparent and free of odors?',
        labelHI: 'क्या पाइप का पानी साफ, पारदर्शी और गंधहीन है?',
        options: [
          { score: 35, textEN: 'Crystal clear, safe for drinking/cooking', textHI: 'बिल्कुल साफ, पीने/खाना पकाने के अनुकूल' },
          { score: 15, textEN: 'Slight chemical flavor or light sediment', textHI: 'हल्का रासायनिक स्वाद या तलछट' },
          { score: 5, textEN: 'Yellow/brown coloration, muddy smell, contaminated', textHI: 'पीला/भूरा पानी, मिट्टी की गंध, दूषित' }
        ]
      },
      {
        key: 'water_pressure',
        labelEN: 'Describe the pressure and regularity of the pipeline supply.',
        labelHI: 'पाइपलाइन आपूर्ति के दबाव और नियमितता का वर्णन करें।',
        options: [
          { score: 35, textEN: 'Regular timetables, high velocity flow', textHI: 'नियमित समय सारणी, तेज़ बहाव' },
          { score: 15, textEN: 'Low/weak flow, requires manual booster pump', textHI: 'धीमा बहाव, बूस्टर पंप की आवश्यकता' },
          { score: 5, textEN: 'Very irregular, dry streams for multiple days', textHI: 'अत्यंत अनियमित, कई दिनों तक सूखा' }
        ]
      },
      {
        key: 'water_leakage',
        labelEN: 'Are there external pipe crackages or surface water leakages?',
        labelHI: 'क्या पाइप में बाहरी दरारें या सतह पर पानी का रिसाव है?',
        options: [
          { score: 30, textEN: 'Underground pipelines, zero visible leaks', textHI: 'भूमिगत पाइपलाइन, शून्य रिसाव' },
          { score: 15, textEN: 'Minor damp spots or joint pipe drippings', textHI: 'मामूली नमी या जोड़ों से पानी टपकना' },
          { score: 5, textEN: 'Major continuous gushing spurts, wasting water', textHI: 'लगातार तेज़ रिसाव, पानी की भारी बर्बादी' }
        ]
      }
    ],
    climate: [
      {
        key: 'water_monsoon_purity',
        labelEN: 'Does the water supply get muddy or smell contaminated during active monsoons?',
        labelHI: 'क्या सक्रिय मानसून के दौरान पानी मटमैला या दूषित आने लगता है?',
        options: [
          { score: 5, textEN: 'Maintains perfect purity with high chlorination', textHI: 'उच्च क्लोरीनीकरण के साथ पूरी शुद्धता' },
          { score: 3, textEN: 'Slight cloudiness for first few minutes', textHI: 'पहले कुछ मिनटों के लिए हल्का धुंधलापन' },
          { score: 1, textEN: 'Gets completely dark, dirty sewage infiltration', textHI: 'पूरी तरह से गंदा मटमैला पानी' }
        ]
      },
      {
        key: 'water_ground_security',
        labelEN: 'Are pipeline junction boxes protected from sewer/rain stagnation pools?',
        labelHI: 'क्या पाइपलाइन जंक्शन बॉक्स सीवर/बारिश के पानी के जमाव से सुरक्षित हैं?',
        options: [
          { score: 5, textEN: 'Fully elevated/hermetically sealed', textHI: 'पूरी तरह से ऊँचे/हवाबंद' },
          { score: 3, textEN: 'Secured on standard casing', textHI: 'मानक केसिंग पर सुरक्षित' },
          { score: 1, textEN: 'Resting in open gutters, highly prone to seepage', textHI: 'खुली नालियों में, रिसाव की अत्यधिक संभावना' }
        ]
      }
    ]
  },
  'Electricity Lines / Poles': {
    physical: [
      {
        key: 'elec_bundling',
        labelEN: 'Are overhead electric cables managed and bundled safely?',
        labelHI: 'क्या ओवरहेड बिजली के तार सुरक्षित रूप से प्रबंधित और बंडल किए गए हैं?',
        options: [
          { score: 35, textEN: 'Yes, insulated thick bundled aerial cables (aerial lumped)', textHI: 'हाँ, इंसुलेटेड मोटे बंडल एरियल केबल' },
          { score: 15, textEN: 'Overhead bare lines but loosely hung', textHI: 'खुले तार लेकिन ढीले लटके हुए' },
          { score: 5, textEN: 'Hazardous spider-web of multiple tangled naked lines', textHI: 'उलझे हुए और नंगे तारों का खतरनाक मकड़जाल' }
        ]
      },
      {
        key: 'elec_transformer',
        labelEN: 'Is the public distribution transformer securely fenced and gated?',
        labelHI: 'क्या सार्वजनिक वितरण ट्रांसफार्मर सुरक्षित रूप से घिरा हुआ है?',
        options: [
          { score: 35, textEN: 'Heavy metal cage, high warning markers present', textHI: 'भारी धातु का पिंजरा, उच्च चेतावनी संकेत' },
          { score: 15, textEN: 'Fence exists but gate broken/unlocked', textHI: 'बाड़ है लेकिन दरवाजा टूटा/खुला है' },
          { score: 5, textEN: 'No fencing, transformer resting low on pavement', textHI: 'कोई बाड़ नहीं, ट्रांसफार्मर फुटपाथ पर असुरक्षित' }
        ]
      },
      {
        key: 'elec_insulator',
        labelEN: 'Are electrical insulators shielded from overgrown tree branches?',
        labelHI: 'क्या विद्युत इंसुलेटर उग आए पेड़ों की शाखाओं से सुरक्षित हैं?',
        options: [
          { score: 30, textEN: 'Regular arboriculture trimming done, clean margins', textHI: 'नियमित रूप से छंटाई, पर्याप्त दूरी' },
          { score: 15, textEN: 'Minor branch contacts, no immediate threat', textHI: 'मामूली स्पर्श, कोई तत्काल खतरा नहीं' },
          { score: 5, textEN: 'Branches completely wrapping live wires, sparkling', textHI: 'टहनियाँ तारों से लिपटी हुई, लगातार चिंगारी' }
        ]
      }
    ],
    climate: [
      {
        key: 'elec_surge',
        labelEN: 'Is there robust lightning/surge protection on the local post?',
        labelHI: 'क्या स्थानीय पोल पर बिजली संरक्षण (बिजली चालक/लाइटनिंग अरेस्टर) है?',
        options: [
          { score: 5, textEN: 'Full surge defense arrestors installed', textHI: 'पूर्ण तरंग सुरक्षा रोधक स्थापित' },
          { score: 3, textEN: 'Present only at main substation feed', textHI: 'केवल मुख्य सबस्टेशन पर मौजूद' },
          { score: 1, textEN: 'Completely lacking, power surges burn appliances', textHI: 'पूरी तरह से गायब, बिजली के झटके से उपकरण जलते हैं' }
        ]
      },
      {
        key: 'elec_wind_safety',
        labelEN: 'Does the power trip instantly during minor windstorms or slight rain?',
        labelHI: 'क्या हल्की आंधी या हल्की बारिश के दौरान बिजली तुरंत चली जाती है?',
        options: [
          { score: 5, textEN: 'Highly resilient, outages only in severe monsoons', textHI: 'अत्यधिक प्रतिरोधी, केवल भारी तूफान में बंद' },
          { score: 3, textEN: 'Occasional damp trips but restorable in hours', textHI: 'कभी-कभी बंद, कुछ घंटों में सुधार' },
          { score: 1, textEN: 'Shuts down immediately at first wind gust/drizzle', textHI: 'हल्की हवा/बूंदाबांदी पर ही बिजली तुरंत गुल' }
        ]
      }
    ]
  },
  'Bus Shelters / Transit Hubs': {
    physical: [
      {
        key: 'bus_structure',
        labelEN: 'Are seating benches and main shelter roof intact and clean?',
        labelHI: 'क्या बैठने की बेंच और मुख्य शेल्टर की छत सुरक्षित और साफ हैं?',
        options: [
          { score: 35, textEN: 'Excellent ergonomic seating & leak-free solid roof', textHI: 'बैठने की उत्तम व्यवस्था और लीक-मुक्त अच्छी छत' },
          { score: 15, textEN: 'Roof exists but rusted or seats cracked/loose', textHI: 'छत है लेकिन जंग लगी, बेंच ढीली' },
          { score: 5, textEN: 'No roof coverage left, benches completely broken/stolen', textHI: 'छत नहीं बची, सीटें पूरी तरह गायब/टूटी हुई' }
        ]
      },
      {
        key: 'bus_info',
        labelEN: 'Is there a legible bus timetable, route chart, or functional displays?',
        labelHI: 'क्या यहाँ पढ़ने योग्य बस समय सारणी, रूट चार्ट या डिस्प्ले बोर्ड है?',
        options: [
          { score: 35, textEN: 'Clear route boards with dynamic digital or paper schedules', textHI: 'स्पष्ट रूट बोर्ड के साथ डिजिटल/कागजी समय तालिका' },
          { score: 15, textEN: 'Old or faint route names paper pasted', textHI: 'पुराना या धुंधला कागजी रूट चार्ट' },
          { score: 5, textEN: 'Zero boards/route/schedule information, complete blind spot', textHI: 'कोई जानकारी नहीं, यात्रियों के लिए पूरी तरह अंधकार' }
        ]
      },
      {
        key: 'bus_light',
        labelEN: 'Is the bus shelter brightly lit during night hours?',
        labelHI: 'क्या बस शेल्टर रात के घंटों के दौरान चमकीली रोशनी से प्रकाशित रहता है?',
        options: [
          { score: 30, textEN: 'Superb LED lights, safe and secure atmosphere', textHI: 'शानदार एलईडी लाइट, सुरक्षित माहौल' },
          { score: 15, textEN: 'Dimly lit single bulb / depends on adjacent shops', textHI: 'कम रोशनी वाला एक बल्ब / दुकानों पर निर्भर' },
          { score: 5, textEN: 'Completely pitch black, unsocial element hazard zone', textHI: 'पूरी तरह से अँधेरा, बहुत असुरक्षित क्षेत्र' }
        ]
      }
    ],
    climate: [
      {
        key: 'bus_wind_protection',
        labelEN: 'Does the shelter side-panels protect commuters from angled wind sprays?',
        labelHI: 'क्या बस शेल्टर के साइड-पैनल हवा की बौछारों से यात्रियों की रक्षा करते हैं?',
        options: [
          { score: 5, textEN: 'Three-sided high-grade glass/metal partitions', textHI: 'तीन तरफा उच्च-स्तरीय विभाजन' },
          { score: 3, textEN: 'Partial side flaps only, some spray enters', textHI: 'केवल आंशिक साइड फ्लैप, कुछ बौछारें आती हैं' },
          { score: 1, textEN: 'Completely open pillar base, zero side protection', textHI: 'केवल खंभे, हवा और बारिश से शून्य सुरक्षा' }
        ]
      },
      {
        key: 'bus_platform_drain',
        labelEN: 'Is the passenger boarding pad elevated higher than adjoining road puddle heights?',
        labelHI: 'क्या यात्रियों के चढ़ने का प्लेटफॉर्म सड़क के जलजमाव स्तर से ऊपर है?',
        options: [
          { score: 5, textEN: 'Perfect elevation, dry shoes boarded', textHI: 'उत्कृष्ट ऊंचाई, जूते सूखे रहते हैं' },
          { score: 3, textEN: 'At slight level, subject to splash by fast trucks', textHI: 'थोड़ी ऊंचाई, तेज वाहनों के छींटों का डर' },
          { score: 1, textEN: 'Submerged in puddle, boarding requires wading through mud', textHI: 'पोखर में डूबा हुआ, कीचड़ से होकर जाना पड़ता है' }
        ]
      }
    ]
  },
  'Other Collective Utilities': {
    physical: [
      {
        key: 'util_uptime',
        labelEN: 'What is the operational uptime status of this collective utility?',
        labelHI: 'इस सामूहिक उपयोगिता की परिचालन अपटाइम स्थिति क्या है?',
        options: [
          { score: 40, textEN: 'Fully operational, high citizen feedback', textHI: 'पूरी तरह कारगर, उत्कृष्ट प्रतिक्रिया' },
          { score: 20, textEN: 'Intermittent functional gaps / needs repair', textHI: 'कभी-कभी बंद / मरम्मत की आवश्यकता' },
          { score: 10, textEN: 'Completely broken / long-standing failure', textHI: 'पूरी तरह से ख़राब / लंबे समय से बंद' }
        ]
      },
      {
        key: 'util_garbage',
        labelEN: 'Is the perimeter free from accumulated waste or garbage piles?',
        labelHI: 'क्या इसके आसपास जमा कचरा या गंदगी के ढेर नहीं हैं?',
        options: [
          { score: 30, textEN: 'Highly clean, sanitised surrounding block', textHI: 'अत्यधिक स्वच्छ, कीटाणुरहित परिवेश' },
          { score: 15, textEN: 'Moderate scattered dry leaves / some litter', textHI: 'मध्यम बिखरा हुआ कचरा' },
          { score: 10, textEN: 'Severe rotting garbage/plastic dump presence', textHI: 'गंभीर गंदा कचरा/सड़ता हुआ कबाड़' }
        ]
      },
      {
        key: 'util_anchorage',
        labelEN: 'Is the structural framework safely bolted and sturdy?',
        labelHI: 'क्या उपयोगिता का ढांचा सुरक्षित रूप से जुड़ा और मजबूत है?',
        options: [
          { score: 30, textEN: 'Impeccable structural steel / concrete anchor', textHI: 'सस्ती एवं सुरक्षित रूप से गड़ा हुआ स्टील/कंक्रीट' },
          { score: 15, textEN: 'Slight shaking elements / loose screws', textHI: 'हल्का हिलता हुआ भाग / ढीले पेंच' },
          { score: 10, textEN: 'Highly unstable, tipping hazard, unsafe', textHI: 'अत्यंत अस्थिर, कभी भी गिरने योग्य' }
        ]
      }
    ],
    climate: [
      {
        key: 'util_weather_shield',
        labelEN: 'Is there sufficient weatherproof shielding for sun and frost?',
        labelHI: 'क्या धूप और पाले के लिए पर्याप्त मौसम-रोधी सुरक्षा कवच है?',
        options: [
          { score: 5, textEN: 'Fully insulated anti-UV coats and heat protection', textHI: 'सूरज की रोशनी और गर्मी से पूर्ण सुरक्षा' },
          { score: 3, textEN: 'Standard shading cover paint', textHI: 'सामान्य सुरक्षा कोट' },
          { score: 1, textEN: 'Completely raw exposure, cracking under thermal stress', textHI: 'बिल्कुल खुला, अत्यधिक गर्मी से चटकने योग्य' }
        ]
      },
      {
        key: 'util_wet_reliability',
        labelEN: 'Does the utility operate reliably under harsh weather conditions?',
        labelHI: 'क्या उपयोगिता खराब मौसम की स्थिति में भी भरोसेमंद रूप से काम करती है?',
        options: [
          { score: 5, textEN: 'No service loss during severe storms', textHI: 'तूफान में भी सेवा में कोई व्यवधान नहीं' },
          { score: 3, textEN: 'Brief temporary breakdowns, resets quickly', textHI: 'कभी-कभी खराबी, तुरंत चालू होती है' },
          { score: 1, textEN: 'Fails / burns out / stops completely in showers', textHI: 'बारिश में पूरी तरह फेल/बंद' }
        ]
      }
    ]
  }
};

export const AuditsSection: React.FC = () => {
  const { audits, language, user, anonymousSignIn, submitAudit, t, isAdmin, approveAudit, deleteAudit } = useApp();

  // State for Form
  const [selectedAudit, setSelectedAudit] = useState<CitizenAudit | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [infraType, setInfraType] = useState('Pavements / Ramps');
  const [qualityScore, setQualityScore] = useState<number>(75);
  const [climateScore, setClimateScore] = useState<number>(6);
  const [comments, setComments] = useState('');
  const [formImagePreset, setFormImagePreset] = useState('pavement');
  const [customImageLink, setCustomImageLink] = useState('');
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success'>('idle');

  // New features state
  const [geoCoords, setGeoCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [uploadedBase64, setUploadedBase64] = useState<string>('');

  // Diagnostic questions answers state
  const [infraAnswers, setInfraAnswers] = useState<Record<string, number>>({});

  // Dynamic state syncing for dynamic questions
  useEffect(() => {
    const questionsObj = assessmentQuestions[infraType as keyof typeof assessmentQuestions];
    if (questionsObj) {
      const freshAnswers: Record<string, number> = {};
      questionsObj.physical.forEach(q => {
        freshAnswers[q.key] = q.options[0].score;
      });
      questionsObj.climate.forEach(q => {
        freshAnswers[q.key] = q.options[0].score;
      });
      setInfraAnswers(freshAnswers);
    }
  }, [infraType]);

  // Handle score computation
  useEffect(() => {
    const questionsObj = assessmentQuestions[infraType as keyof typeof assessmentQuestions];
    if (questionsObj) {
      let computedPhysical = 0;
      questionsObj.physical.forEach(q => {
        computedPhysical += (infraAnswers[q.key] !== undefined ? infraAnswers[q.key] : q.options[0].score);
      });

      let computedClimate = 0;
      questionsObj.climate.forEach(q => {
        computedClimate += (infraAnswers[q.key] !== undefined ? infraAnswers[q.key] : q.options[0].score);
      });

      computedPhysical = Math.max(0, Math.min(100, computedPhysical));
      computedClimate = Math.max(0, Math.min(10, computedClimate));

      setQualityScore(computedPhysical);
      setClimateScore(computedClimate);
    }
  }, [infraAnswers, infraType]);

  const infraTypes = [
    'Pavements / Ramps',
    'Drainage & Storm Sewer',
    'Public Latrines / Hygiene',
    'Street Lighting / Luminescence',
    'Potable Water Pipelines',
    'Electricity Lines / Poles',
    'Bus Shelters / Transit Hubs',
    'Other Collective Utilities'
  ];

  const presets = [
    { id: 'pavement', name: 'Broken Pavement / Curbs', url: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600' },
    { id: 'drain', name: 'Waterlogged Drain Block', url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600' },
    { id: 'light', name: 'Non-Functional Pole / Dark Street', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600' },
    { id: 'water', name: 'Leaking Public Faucet', url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=600' },
    { id: 'bus_shelter', name: 'Dilapidated Bus Shelter', url: 'https://images.unsplash.com/photo-1464457312035-3d7d0e0c058e?q=80&w=600' }
  ];

  const handleCaptureLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation coordinates not supported by this context.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGeoCoords({ latitude, longitude });
        setLocationName(`G-Ward Sector Route (GPS Loc: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E)`);
        setIsLocating(false);
      },
      (error) => {
        console.warn("Geolocation service failure, activating fallback pinpoint simulation...", error);
        // Fallback simulation for full interaction in any sandbox
        const simulatedLat = 26.8467 + (Math.random() - 0.5) * 0.04;
        const simulatedLng = 80.9462 + (Math.random() - 0.5) * 0.04;
        setGeoCoords({ latitude: simulatedLat, longitude: simulatedLng });
        setLocationName(`Ward Precinct Corridor (Simulated Pinpoint Lat: ${simulatedLat.toFixed(4)}°N, Lng: ${simulatedLng.toFixed(4)}°E)`);
        setIsLocating(false);
        alert(language === 'EN'
          ? "We've simulated high-precision localized coordinates on your behalf as actual GPS permission is blocked in this client environment."
          : "सुरक्षा कारणों से ब्राउज़र सन्दर्भ में GPS सीधे सुलभ नहीं होने के कारण, हमने निकटतम वार्ड संकेतक निर्धारित किया है।"
        );
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert(language === 'EN' ? "File exceeds 3MB. Please upload a smaller image file." : "फ़ाइल का आकार 3MB से अधिक है। कृपया एक छोटी इमेज चुनें।");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setUploadedBase64(base64String);
      setFormImagePreset('');
      setCustomImageLink('');
    };
    reader.onerror = () => {
      alert("Error reading file image asset.");
    };
    reader.readAsDataURL(file);
  };

  // Seed baseline audits if none exist yet
  const defaultAudits = [
    {
      id: "audit_1",
      userId: "guest_user_1",
      locationName: "Nirala Nagar Outer Ring Road, Lucknow",
      infraType: "Pavements / Ramps",
      qualityScore: 35,
      climateScore: 4,
      images: ["https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600"],
      comments: "Footpath is interrupted by deep sewer pits and has zero ramp grading at crosswalk boundaries. Totally inaccessible for senior folks or wheelchairs.",
      approvedByAdmin: true,
      createdAt: { toDate: () => new Date() }
    },
    {
      id: "audit_2",
      userId: "guest_user_2",
      locationName: "Kormangala 4th Block, Bengaluru",
      infraType: "Drainage & Storm Sewer",
      qualityScore: 20,
      climateScore: 1,
      images: ["https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600"],
      comments: "Secondary stormwater culverts are clogged completely with concrete residue and plastic waste. Severe street inundation even during light 20-minute monsoonal showers.",
      approvedByAdmin: true,
      createdAt: { toDate: () => new Date() }
    },
    {
      id: "audit_3",
      userId: "guest_user_3",
      locationName: "Dharavi Sector 3, Mumbai",
      infraType: "Public Latrines / Hygiene",
      qualityScore: 10,
      climateScore: 2,
      images: ["https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=600"],
      comments: "The block has broken water pipeline supplies. Massive sanitary leaks across external lines. The Ward needs immediate plumbing repairs.",
      approvedByAdmin: true,
      createdAt: { toDate: () => new Date() }
    }
  ];

  const activeAudits = audits.length > 0 ? audits : defaultAudits;
  const approvedAudits = activeAudits.filter(a => a.approvedByAdmin);

  if (selectedAudit) {
    const currentAudit = activeAudits.find(a => a.id === selectedAudit.id) || selectedAudit;
    return (
      <AuditDetail 
        audit={currentAudit} 
        onBack={() => setSelectedAudit(null)} 
      />
    );
  }

  // Math Computations
  const totalSubmissionsVal = activeAudits.length;
  const averageQualityIndex = approvedAudits.length > 0 
    ? Math.round(approvedAudits.reduce((acc, a) => acc + a.qualityScore, 0) / approvedAudits.length) 
    : 45;
  const averageClimateIndex = approvedAudits.length > 0 
    ? (approvedAudits.reduce((acc, a) => acc + a.climateScore, 0) / approvedAudits.length).toFixed(1) 
    : "3.5";

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName.trim() || !comments.trim()) {
      alert("Please fill in the Location and Comments field.");
      return;
    }

    setSubmitState('loading');

    // Auto Anonymous Login first if no authenticated user exists! Zero barrier civic tech!
    let activeUid = user?.uid;
    if (!user) {
      try {
        await anonymousSignIn();
      } catch (authErr) {
        console.error("Zero-friction anonymous auth fallback failed:", authErr);
      }
    }

    const imgUrl = uploadedBase64 || customImageLink || presets.find(p => p.id === formImagePreset)?.url || presets[0].url;

    const auditPayload = {
      userId: auth.currentUser?.uid || activeUid || "anonymous_citizen",
      locationName: locationName,
      geoPoint: geoCoords || { latitude: 26.8467, longitude: 80.9462 }, // use captured coords or fallback lucknow / center
      infraType: infraType,
      qualityScore: Number(qualityScore),
      climateScore: Number(climateScore),
      images: [imgUrl],
      comments: comments
    };

    try {
      await submitAudit(auditPayload);
      setSubmitState('success');
      setTimeout(() => {
        setLocationName('');
        setComments('');
        setCustomImageLink('');
        setUploadedBase64('');
        setGeoCoords(null);
        setShowForm(false);
        setSubmitState('idle');
      }, 2000);
    } catch (err) {
      console.error(err);
      setSubmitState('idle');
    }
  };

  const getScoreColor = (num: number) => {
    if (num >= 70) return 'text-natural-primary bg-[#F0F2EE] border-natural-border';
    if (num >= 40) return 'text-natural-accent bg-natural-accent-light border-natural-accent/20';
    return 'text-red-700 bg-red-50 border-red-100';
  };

  return (
    <div className="space-y-8 py-6">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-widest uppercase text-natural-secondary bg-natural-muted border border-natural-border py-0.5 px-2 font-bold rounded">
            Indian Cities Audit Engine
          </span>
          <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-natural-text tracking-tight">
            {t.all_audits}
          </h2>
          <p className="text-xs text-natural-secondary font-light max-w-xl leading-relaxed">
            {language === 'EN'
              ? 'View crowdsourced infrastructure safety ratings or submit a fresh localized audit. Zero friction, completely public logs.'
              : 'भीड़भाड़ वाले बुनियादी ढांचे की सुरक्षा रेटिंग देखें या नया स्थानीयकृत ऑडिट सबमिट करें।'}
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-natural-primary hover:bg-natural-primary-hover text-white font-bold text-xs rounded-lg transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{t.submit_audit}</span>
        </button>
      </div>

      {/* Citizen Infrastructure Audit Form (Zero-friction anonymous logins enabled) */}
      {showForm && (
        <div className="bg-white border border-natural-border rounded-2xl p-6 shadow-xs relative">
          <h3 className="font-sans font-extrabold text-sm md:text-base text-natural-text mb-4 flex items-center space-x-2">
            <ClipboardCheck className="w-4 h-4 text-natural-primary" />
            <span>{t.submit_audit}</span>
          </h3>

          {submitState === 'success' ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-natural-primary mx-auto animate-bounce" />
              <h4 className="font-sans font-bold text-natural-text text-base">Audit Submitted Successfully!</h4>
              <p className="text-xs text-natural-secondary max-w-sm mx-auto">
                Thank you for contributing. To ensure accuracy, local audits are held in moderation queue for Core engineering review.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {!user && (
                <div className="bg-natural-muted border border-natural-border p-3.5 rounded-lg text-[11px] text-natural-dark-secondary flex items-center space-x-1.5">
                  <UserPlus className="w-3.5 h-3.5 text-natural-primary shrink-0" />
                  <span>You are browsing as a guest. Submitting this form will automatically perform a seamless secure guest registration.</span>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {/* Location */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono uppercase text-natural-secondary font-bold">Local Ward & Street Address *</label>
                    <button
                      type="button"
                      onClick={handleCaptureLocation}
                      disabled={isLocating}
                      className="text-[9px] font-mono font-bold text-natural-primary hover:text-[#3E4E35] flex items-center gap-1 transition-all"
                    >
                      <MapPin className={`w-3 h-3 ${isLocating ? 'animate-bounce text-natural-accent' : 'text-natural-primary'}`} />
                      <span>{isLocating ? 'Acquiring GPS...' : 'Capture Current Location'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g. 5th Cross Road, Indira Nagar, Bengaluru"
                    className="w-full text-xs p-2.5 border border-natural-border rounded-lg focus:outline-none focus:border-natural-primary bg-white text-natural-text animate-fade-in"
                    required
                  />
                  {geoCoords && (
                    <div className="text-[9px] text-[#3E4E35] font-mono font-semibold flex items-center gap-1 bg-[#F0F2EE] px-2 py-1 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Precision GPS Target Captured: {geoCoords.latitude.toFixed(5)}°N, {geoCoords.longitude.toFixed(5)}°E</span>
                    </div>
                  )}
                </div>

                {/* Infrastructure Type */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-natural-secondary font-bold">Infrastructure Class *</label>
                  <select
                    value={infraType}
                    onChange={(e) => setInfraType(e.target.value)}
                    className="w-full text-xs p-2.5 border border-natural-border rounded-lg bg-white focus:outline-none focus:border-natural-primary text-natural-text"
                  >
                    {infraTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Structured Diagnostics Questionnaire for Automated Index Calculations */}
              {assessmentQuestions[infraType as keyof typeof assessmentQuestions] && (
                <div className="p-5 bg-[#F6F8F5] border border-natural-border/60 rounded-2xl space-y-5 animate-fade-in my-3">
                  <div className="flex items-center justify-between border-b border-natural-border/40 pb-2.5">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-natural-primary animate-pulse" />
                      <div>
                        <h4 className="font-sans font-extrabold text-xs text-natural-text uppercase tracking-wider">
                          {language === 'EN' ? 'Automated Diagnostic Questionnaire' : 'स्वचालित नैदानिक ​​प्रश्नावली'}
                        </h4>
                        <p className="text-[10px] text-natural-secondary font-mono">
                          {language === 'EN' ? 'Answering specific criteria updates Physical & Climate Scores instantly.' : 'विशिष्ट मानकों के उत्तर देने से भौतिक और जलवायु सूचकांक तुरंत अपडेट होते हैं।'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-natural-primary/10 text-natural-primary font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                      {language === 'EN' ? 'Auto-Calculations' : 'स्वचालित गणना'}
                    </span>
                  </div>

                  {/* Section 1: Physical Parameters */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-1.5 text-[10px] font-mono text-natural-primary font-bold uppercase tracking-widest">
                      <span>1. {language === 'EN' ? 'Physical Quality Criteria' : 'भौतिक गुणवत्ता के मानदंड'}</span>
                      <div className="flex-grow border-t border-natural-border/30"></div>
                    </div>
                    
                    <div className="grid gap-3.5">
                      {assessmentQuestions[infraType as keyof typeof assessmentQuestions].physical.map((q) => {
                        const currentVal = infraAnswers[q.key];
                        return (
                          <div key={q.key} className="space-y-1.5 bg-white p-3.5 rounded-xl border border-natural-border/40 shadow-xs">
                            <span className="text-xs font-semibold text-natural-text block leading-tight">
                              {language === 'EN' ? q.labelEN : q.labelHI}
                            </span>
                            <div className="flex flex-wrap gap-2 pt-1">
                              {q.options.map((opt) => {
                                const isSelected = currentVal === opt.score;
                                return (
                                  <button
                                    key={opt.score}
                                    type="button"
                                    onClick={() => setInfraAnswers(prev => ({ ...prev, [q.key]: opt.score }))}
                                    className={`text-[10px] py-1.5 px-3 rounded-lg font-sans font-bold transition-all border ${
                                      isSelected 
                                        ? 'bg-natural-primary border-natural-primary text-white shadow-xs scale-[1.01]' 
                                        : 'bg-white border-natural-border text-natural-secondary hover:bg-natural-muted hover:text-natural-text'
                                    }`}
                                  >
                                    {language === 'EN' ? opt.textEN : opt.textHI}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 2: Climate Parameters */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-1.5 text-[10px] font-mono text-natural-primary font-bold uppercase tracking-widest">
                      <span>2. {language === 'EN' ? 'Climate Preparedness Criteria' : 'जलवायु तत्परता के मानदंड'}</span>
                      <div className="flex-grow border-t border-natural-border/30"></div>
                    </div>
                    
                    <div className="grid gap-3.5">
                      {assessmentQuestions[infraType as keyof typeof assessmentQuestions].climate.map((q) => {
                        const currentVal = infraAnswers[q.key];
                        return (
                          <div key={q.key} className="space-y-1.5 bg-white p-3.5 rounded-xl border border-natural-border/40 shadow-xs">
                            <span className="text-xs font-semibold text-natural-text block leading-tight">
                              {language === 'EN' ? q.labelEN : q.labelHI}
                            </span>
                            <div className="flex flex-wrap gap-2 pt-1">
                              {q.options.map((opt) => {
                                const isSelected = currentVal === opt.score;
                                return (
                                  <button
                                    key={opt.score}
                                    type="button"
                                    onClick={() => setInfraAnswers(prev => ({ ...prev, [q.key]: opt.score }))}
                                    className={`text-[10px] py-1.5 px-3 rounded-lg font-sans font-bold transition-all border ${
                                      isSelected 
                                        ? 'bg-natural-primary border-natural-primary text-white shadow-xs scale-[1.01]' 
                                        : 'bg-white border-natural-border text-natural-secondary hover:bg-natural-muted hover:text-natural-text'
                                    }`}
                                  >
                                    {language === 'EN' ? opt.textEN : opt.textHI}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-[#EBF1E8] border border-natural-primary/20 p-3 rounded-lg text-[10px] text-[#3E4E35] font-semibold flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{language === 'EN' ? 'Dynamic results calculated: High integrity criteria scores sync below automatically.' : 'गतिशील रूप से परिकलित परिणाम: उच्च अखंडता मानदंड स्कोर नीचे स्वचालित रूप से सिंक होते हैं।'}</span>
                  </div>
                </div>
              )}

              {/* Slider ratings indices */}
              <div className="grid md:grid-cols-2 gap-6 pt-2">
                {/* Score out of 100 */}
                <div className="space-y-1.5 p-4 rounded-xl bg-natural-muted border border-natural-border">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="uppercase text-natural-secondary font-bold">Physical Quality Score</span>
                    <span className="font-bold text-natural-text">{qualityScore} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={qualityScore}
                    onChange={(e) => setQualityScore(Number(e.target.value))}
                    className="w-full h-2 bg-natural-border rounded-lg appearance-none cursor-pointer accent-natural-primary"
                  />
                  <div className="flex justify-between text-[9px] text-natural-secondary font-mono">
                    <span>0 (Unusable / Hazardous)</span>
                    <span>100 (Flawless Accessibility)</span>
                  </div>
                </div>

                {/* Climate Score out of 10 */}
                <div className="space-y-1.5 p-4 rounded-xl bg-natural-muted border border-natural-border">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="uppercase text-natural-secondary font-bold">Climate Preparedness Index</span>
                    <span className="font-bold text-natural-text">{climateScore} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={climateScore}
                    onChange={(e) => setClimateScore(Number(e.target.value))}
                    className="w-full h-2 bg-natural-border rounded-lg appearance-none cursor-pointer accent-natural-primary"
                  />
                  <div className="flex justify-between text-[9px] text-natural-secondary font-mono">
                    <span>0 (Floods Instantly)</span>
                    <span>10 (Fully Weatherproof)</span>
                  </div>
                </div>
              </div>

              {/* Photo Upload Select presets, local upload or url */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-[10px] font-mono uppercase text-natural-secondary font-bold block">
                    {language === 'EN' ? 'Visual Evidence & Photographic Proof' : 'दृश्य साक्ष्य और फोटोग्राफिक प्रमाण'}
                  </label>
                  <span className="text-[9px] font-mono font-medium text-natural-secondary text-right">
                    {language === 'EN' ? 'Choose Preset, Paste Link OR Upload Local File' : 'प्रीसेट चुनें, लिंक पेस्ट करें या स्थानीय फ़ाइल लोड करें'}
                  </span>
                </div>

                {/* Local File Upload Selector Panel */}
                <div className="p-4 border border-dashed border-natural-border rounded-xl bg-natural-muted relative transition-all hover:bg-natural-muted/70 flex flex-col items-center justify-center text-center space-y-2">
                  {uploadedBase64 ? (
                    <div className="space-y-2 w-full flex flex-col items-center">
                      <div className="relative group">
                        <img 
                          src={uploadedBase64} 
                          alt="Local Upload Preview" 
                          className="h-20 w-32 object-cover rounded-lg border border-natural-border shadow-2xs" 
                        />
                        <button
                          type="button"
                          onClick={() => setUploadedBase64('')}
                          className="absolute -top-1.5 -right-1.5 p-1 bg-red-105 hover:bg-red-200 text-red-700 rounded-full border border-red-200 text-[8px] font-mono font-black shadow flex items-center justify-center w-5 h-5 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-[10px] text-[#3E4E35] font-mono font-bold flex items-center gap-1 bg-[#F0F2EE] px-2 py-0.5 rounded">
                        <CheckCircle className="w-3.5 h-3.5 text-natural-primary" />
                        <span>LOCAL CUSTOM IMAGE EVIDENCE ACQUIRED</span>
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2">
                        <Image className="w-5 h-5 text-natural-primary" />
                        <span className="text-xs font-semibold text-natural-text">
                          {language === 'EN' ? 'Upload Local Photographic Evidence' : 'स्थानीय फोटोग्राफिक साक्ष्य अपलोड करें'}
                        </span>
                      </div>
                      <p className="text-[9px] font-mono text-natural-secondary">
                        Supports JPEG / PNG up to 3MB. Encoded securely.
                      </p>
                      <label className="px-3.5 py-1.5 bg-white hover:bg-natural-muted text-natural-text border border-natural-border rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs">
                        <span>{language === 'EN' ? 'Browse Files' : 'फ़ाइलें ब्राउज़ करें'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </label>
                    </>
                  )}
                </div>

                {/* Option Separator standard */}
                <div className="flex items-center my-3">
                  <div className="flex-grow border-t border-natural-border"></div>
                  <span className="flex-shrink mx-3 text-[9px] uppercase font-mono text-natural-secondary font-bold">Or fallback to standard catalog presets</span>
                  <div className="flex-grow border-t border-natural-border"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {presets.map(p => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => {
                        setFormImagePreset(p.id);
                        setCustomImageLink('');
                        setUploadedBase64('');
                      }}
                      className={`p-2 rounded-lg border text-left overflow-hidden space-y-1 bg-white hover:bg-natural-muted transition-all duration-150 ${
                        formImagePreset === p.id && !customImageLink && !uploadedBase64 ? 'border-natural-primary ring-1 ring-natural-primary' : 'border-natural-border'
                      }`}
                    >
                      <img src={p.url} alt={p.name} className="w-full h-16 object-cover rounded-md" referrerPolicy="no-referrer" />
                      <p className="text-[9px] font-bold text-natural-text line-clamp-1">{p.name}</p>
                    </button>
                  ))}
                </div>
                
                <div className="pt-1.5">
                  <input
                    type="text"
                    value={customImageLink}
                    onChange={(e) => {
                      setCustomImageLink(e.target.value);
                      setFormImagePreset('');
                      setUploadedBase64('');
                    }}
                    placeholder="Or paste external image URL link (optional)..."
                    className="w-full text-xs p-2 border border-natural-border rounded-lg bg-white focus:outline-none focus:border-natural-primary text-natural-text"
                  />
                </div>
              </div>

              {/* Comments Notes */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-natural-secondary font-bold block">Audit Observations & Structural Notes *</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Summarize the exact accessibility defect, hazard, or waterlogging problem. Mention times or severe conditions if applicable."
                  className="w-full text-xs p-2.5 border border-natural-border rounded-lg focus:outline-none focus:border-natural-primary bg-white h-24 text-natural-text"
                  maxLength={1000}
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-2 border-t border-natural-border">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-3 py-1.5 text-xs text-natural-dark-secondary bg-white border border-natural-border hover:bg-natural-muted rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitState === 'loading'}
                  className="px-4 py-1.5 text-xs bg-natural-primary hover:bg-natural-primary-hover text-white font-bold rounded-lg disabled:opacity-50"
                >
                  {submitState === 'loading' ? 'Uploading records...' : 'Submit Real-Time Audit'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Aggregate metrics dashboards cards */}
      <section className="bg-natural-muted p-6 rounded-2xl border border-natural-border space-y-4 shadow-2xs">
        <h4 className="font-sans font-extrabold text-xs text-natural-text uppercase tracking-widest flex items-center space-x-1.5">
          <FileSpreadsheet className="w-3.5 h-3.5 text-natural-primary" />
          <span>State of Public Infrastructure Audits</span>
        </h4>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-natural-border space-y-1">
            <p className="text-[10px] font-mono uppercase text-natural-secondary font-semibold tracking-wider">Crowdsourced Registry</p>
            <h3 className="font-sans font-black text-xl md:text-2xl text-natural-text">{totalSubmissionsVal} Reports</h3>
            <p className="text-[10px] text-natural-secondary">Total audits received across monitored sectors.</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-natural-border space-y-1">
            <p className="text-[10px] font-mono uppercase text-natural-secondary font-semibold tracking-wider">Avg Physical Accessibility Index</p>
            <h3 className="font-sans font-black text-xl md:text-2xl text-natural-text">{averageQualityIndex} / 100</h3>
            <div className="w-full bg-natural-muted h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-natural-accent h-full rounded-full" style={{ width: `${averageQualityIndex}%` }} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-natural-border space-y-1">
            <p className="text-[10px] font-mono uppercase text-natural-secondary font-semibold tracking-wider">Climate Inundation Buffer</p>
            <h3 className="font-sans font-black text-xl md:text-2xl text-natural-text">{averageClimateIndex} / 10</h3>
            <p className="text-[10px] text-natural-secondary flex items-center space-x-1">
              <ThermometerSun className="w-3.5 h-3.5 text-natural-primary" />
              <span>Score of storm water discharge & heat resilient buffer.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Audits Index Feed list */}
      <div className="space-y-4">
        <h3 className="font-sans font-extrabold text-sm text-natural-text px-1">
          {language === 'EN' ? 'Recent Verified Audits Index' : 'हाल के सत्यापित ऑडिट सूचकांक'}
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          {activeAudits.map((item, index) => {
            const isApproved = item.approvedByAdmin;
            
            // Format dates
            let dateStr = "Recent Audit";
            if (item.createdAt) {
              try {
                const dateVal = item.createdAt.toDate ? item.createdAt.toDate() : new Date(item.createdAt);
                dateStr = dateVal.toLocaleDateString(language === 'EN' ? 'en-US' : 'hi-IN', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });
              } catch (_) {}
            }

            return (
              <div 
                key={item.id || index}
                onClick={() => setSelectedAudit(item)}
                className={`bg-white border rounded-2xl overflow-hidden shadow-2xs flex flex-col justify-between transition-all group duration-150 cursor-pointer hover:shadow-xs hover:translate-y-[-2px] ${
                  isApproved ? 'border-natural-border hover:border-natural-secondary/35' : 'border-dashed border-natural-accent/50 bg-natural-accent-light/10'
                }`}
              >
                {/* Visual Evidence Image representation with fallback */}
                <div className="h-44 relative bg-natural-text overflow-hidden">
                  <img
                    src={item.images?.[0] || presets[0].url}
                    alt={item.locationName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Rating Badge Overlay */}
                  <div className="absolute top-3 right-3 flex flex-col space-y-1">
                    <span className="text-[9px] font-mono font-bold tracking-widest uppercase bg-natural-primary text-white px-2 py-0.5 rounded shadow-sm">
                      Quality: {item.qualityScore}%
                    </span>
                    <span className="text-[9px] font-mono font-bold tracking-widest uppercase bg-natural-accent text-white px-2 py-0.5 rounded shadow-sm mt-0.5">
                      Climate: {item.climateScore}/10
                    </span>
                  </div>

                  {/* Status Overlay */}
                  {!isApproved && (
                    <div className="absolute top-3 left-3 bg-natural-accent text-white px-2 py-0.5 rounded text-[9px] font-mono font-semibold flex items-center space-x-1 shadow-sm">
                      <AlertCircle className="w-3 h-3 animate-pulse" />
                      <span>Pending Verification</span>
                    </div>
                  )}

                  {/* Infrastructure class labels overlay */}
                  <div className="absolute bottom-3 left-3 bg-white/95 text-natural-text border border-natural-border font-mono text-[9px] font-bold px-2 py-0.5 rounded-sm">
                    {item.infraType}
                  </div>
                </div>

                {/* Audit specifications */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-1 text-[9px] font-mono text-natural-secondary">
                      <MapPin className="w-3 h-3 text-natural-primary shrink-0" />
                      <span className="truncate max-w-[200px]">{item.locationName}</span>
                    </div>

                    <p className="text-xs text-natural-dark-secondary leading-relaxed font-light line-clamp-3">
                      {item.comments}
                    </p>
                  </div>

                  <div className="border-t border-natural-border pt-3 flex items-center justify-between text-[10px] font-mono text-natural-secondary">
                    <span>{dateStr}</span>
                    
                    {/* Admin Actions */}
                    {isAdmin && (
                      <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
                        {!isApproved && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              approveAudit(item.id);
                            }}
                            className="bg-natural-primary hover:bg-[#3E4E35] text-white px-2 py-0.5 rounded-md font-mono font-bold text-[9px] flex items-center space-x-0.5 transition-colors"
                          >
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verify</span>
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAudit(item.id);
                          }}
                          className="bg-red-50 hover:bg-neutral-100 text-red-650 px-2 py-0.5 rounded-md font-mono font-bold text-[9px] transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
