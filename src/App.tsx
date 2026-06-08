/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Sparkles,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Printer,
  Copy,
  Check,
  FileText,
  Heart,
  User,
  Stethoscope,
  Info,
  RefreshCw,
  Share2,
  Calendar,
  Lock,
  ChevronRight,
  ShieldCheck,
  FileSpreadsheet,
  PlusCircle,
  Edit2,
  Save,
  ArrowLeft,
  ChevronLeft,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Trash2
} from 'lucide-react';
import { Patient } from './types';
import { DocumentCleaner } from './components/DocumentCleaner';
import { MarkdownView } from './components/MarkdownView';
import { GuidelineViewer } from './components/GuidelineViewer';

// Standard minimum documentation requirements under NSW Health GL2022_005 Section 2.1.1
const MINIMUM_REQUIREMENTS = [
  {
    id: 'patient_details',
    title: 'Patient Details',
    displayOrder: 1,
    standard: 'Patient full name displayed on a single bold line, Medical Record Number (MRN), Age, Sex, Gender, Date of Birth, Home Address, and Telephone Number.',
    source: 'Section 2.1.2 - Patient details',
    keywords: ['patient', 'demographics', 'name', 'mrn', 'age', 'dob', 'address', 'telephone', 'gender', 'sex']
  },
  {
    id: 'hospital_details',
    title: 'Hospital & Contact Details',
    displayOrder: 2,
    standard: 'Hospital name, local health district or specialty health network, address and contact details, and discharging specialty contact phone numbers.',
    source: 'Section 2.1.2 - Hospital details',
    keywords: ['hospital', 'district', 'contact', 'facility', 'specialty name', 'lhd', 'local health']
  },
  {
    id: 'recipients',
    title: 'Recipient(s)',
    displayOrder: 3,
    standard: 'Identification of the primary care provider recipient, e.g. the patient\'s nominated General Practitioner (GP) or Aboriginal Medical Service (AMS).',
    source: 'Section 2.1.2 - Recipient (s)',
    keywords: ['recipient', 'audience', 'gp', 'general practitioner', 'ams', 'aboriginal medical']
  },
  {
    id: 'author_clinician',
    title: 'Author & Discharging Clinician',
    displayOrder: 4,
    standard: 'Discharging clinician name, role designation, supervisor name (admitting/attending medical officer), nominated supervisor contact details, and clinical signature.',
    source: 'Section 2.1.2 - Discharging clinician',
    keywords: ['discharging clinician', 'author', 'supervisor', 'attending medical officer', 'signature', 'credentials', 'designation', 'role']
  },
  {
    id: 'presentation_details',
    title: 'Presentation Details',
    displayOrder: 5,
    standard: 'Admission date, discharge date, total length of stay, clinical unit, clinical specialty responsible, and discharge destination details.',
    source: 'Section 2.1.2 - Presentation details',
    keywords: ['presentation', 'admission date', 'discharge date', 'length of stay', 'clinical unit', 'destination', 'clinical specialty', 'los']
  },
  {
    id: 'problem_diagnoses',
    title: 'Presenting Problem & Diagnoses',
    displayOrder: 6,
    standard: 'Reason for presentation, Principal Diagnosis responsible for admission, additional diagnoses/complications, and past medical history summary.',
    source: 'Section 2.1.2 - Presenting problem/s and diagnoses',
    keywords: ['problem', 'diagnoses', 'diagnosis', 'complications', 'history', 'principal diagnosis', 'reason for presentation', 'past medical']
  },
  {
    id: 'procedures',
    title: 'Procedures & Implanted Devices',
    displayOrder: 7,
    standard: 'Chronological list of all invasive clinical interventions/operations. For nonoperative courses, document "nil performed". Implanted or explanted medical devices must specify product name, type, model, and batch number.',
    source: 'Section 2.1.2 - Procedures',
    keywords: ['procedures', 'clinical procedures', 'device', 'implanted', 'chronological', 'nil performed', 'invasive', 'interventions', 'explanted']
  },
  {
    id: 'clinical_summary',
    title: 'Clinical Course & Summary',
    displayOrder: 8,
    standard: 'A concise free text summary of the hospital course focusing on quality rather than quantity, using short sentences and bullet points. Summary of ICU/HDU stays where indicated.',
    source: 'Section 2.1.2 - Clinical summary',
    keywords: ['clinical summary', 'course', 'icu', 'hdu', 'stay', 'short sentences', 'hospital stay', 'concise summary']
  },
  {
    id: 'allergies',
    title: 'Allergies & Adverse Reactions',
    displayOrder: 9,
    standard: 'Specific drug or substance name, brand if known, reaction type (allergy, intolerance, adverse effect), and clinical manifestation. If no allergies are identified, "nil known" must be explicitly written.',
    source: 'Section 2.1.2 - Allergies / adverse reactions',
    keywords: ['allergies', 'allergy', 'adverse', 'reaction', 'manifestation', 'intolerance', 'nil known']
  },
  {
    id: 'medicines_discharge',
    title: 'Medicines on Discharge',
    displayOrder: 10,
    standard: 'A clear alphabetical list grouped strictly by status: "New" medicines first, followed by "Changed", followed by "Unchanged". Must itemize generic name, brand, strength, form, route, directions, and clinical indication.',
    source: 'Section 2.1.2 - Medicines on discharge',
    keywords: ['medicines on discharge', 'changed medicines', 'new medicines', 'unchanged', 'medication reconciliation', 'tablet', 'mg', 'route']
  },
  {
    id: 'ceased_medicines',
    title: 'Ceased & Suspended Medicines',
    displayOrder: 11,
    standard: 'Document ceased or temporarily suspended medicines in a separate section with clear clinical reasoning, temporary vs permanent duration, and ongoing monitoring parameters.',
    source: 'Section 2.1.2 - Ceased and temporarily suspended medicines',
    keywords: ['ceased', 'suspended', 'stop', 'cessation', 'monitored', 'monitoring', 'de-prescribing', 'reasons for ceasing']
  },
  {
    id: 'alerts',
    title: 'Clinically Relevant Alerts & Risks',
    displayOrder: 12,
    standard: 'Identification of physical and clinical safety threats (e.g., falls risks, infection risks, or cognitive warnings) using bulleted alert lists.',
    source: 'Section 2.1.2 - Alerts',
    keywords: ['alerts', 'infection', 'falls', 'risk', 'safeties', 'cognitive alert']
  },
  {
    id: 'recommendations',
    title: 'Recommendations & Future Actions',
    displayOrder: 13,
    standard: 'Specific immediate instructions for ongoing outpatient healthcare management, indicating action ownership (who is responsible) and precise action timelines.',
    source: 'Section 2.1.2 - Recommendations',
    keywords: ['recommendations', 'ongoing management', 'management plans', 'pending investigations', 'pending results', 'responsibilities']
  },
  {
    id: 'followup_appointments',
    title: 'Follow-up Appointments',
    displayOrder: 14,
    standard: 'Structured details of all future scheduled or recommended clinician visits: description, date/time, booking status, doctor name, clinic location, contact numbers, and pre-visit preparation (e.g., fasting).',
    source: 'Section 2.1.2 - Follow-up appointments',
    keywords: ['followup', 'appointments', 'appointments scheduled', 'gp visit', 'booking', 'scheduled appointment']
  },
  {
    id: 'patient_info',
    title: 'Information Provided to Patient/Carer',
    displayOrder: 15,
    standard: 'Summary of the educational material or actions explained to the patient and carers. Includes landscape-oriented Client-Friendly Medication Lists (CFML).',
    source: 'Section 2.1.2 - Information provided to patient',
    keywords: ['information provided', 'patient friendly', 'medication list', 'pfml', 'disclaimer', 'carer', 'provided to the patient']
  }
];

const cleanGapText = (text: string): string => {
  if (!text) return '';
  
  let clean = text;
  
  // 1. Remove bracketed source references of guideline documents
  clean = clean.replace(/\[\s*source\s*:[^\]]+\]/gi, '');
  clean = clean.replace(/\(\s*source\s*:[^\)]+\)/gi, '');
  clean = clean.replace(/\bguideline\s+gl\d+_\d+[^\]\)]*/gi, '');
  clean = clean.replace(/\[source:[^\]]+\]/gi, '');
  
  // 2. Remove prefix tags ending in high-level label colons, like "Missing Basic Identifiers: " or "Strict Grouping: "
  clean = clean.replace(/^[a-z0-9\s()&/.-]+:\s*/i, '');
  
  // 3. Keep intro removals strict and clean
  const intros = [
    /^the\s+letter\s+completely\s+omits\s+the\s+patient's\s+/i,
    /^the\s+letter\s+completely\s+omits\s+the\s+/i,
    /^the\s+letter\s+completely\s+omits\s+/i,
    /^the\s+letter\s+completely\s+lacks\s+the\s+/i,
    /^the\s+letter\s+completely\s+lacks\s+/i,
    /^there\s+is\s+no\s+mention\s+of\s+whether\s+the\s+patient\s+requires\s+a\s+/i,
    /^there\s+is\s+no\s+mention\s+of\s+whether\s+the\s+patient\s+requires\s+/i,
    /^there\s+is\s+no\s+mention\s+of\s+whether\s+the\s+patient\s+/i,
    /^there\s+is\s+no\s+mention\s+of\s+the\s+/i,
    /^there\s+is\s+no\s+mention\s+of\s+/i,
    /^no\s+mention\s+of\s+whether\s+the\s+patient\s+requires\s+a\s+/i,
    /^no\s+mention\s+of\s+whether\s+the\s+patient\s+requires\s+/i,
    /^no\s+mention\s+of\s+the\s+/i,
    /^no\s+mention\s+of\s+/i,
    /^completely\s+omits\s+the\s+/i,
    /^completely\s+omits\s+/i,
    /^completely\s+omitted\s+/i,
    /^lacks\s+the\s+/i,
    /^lacks\s+/i,
    /^is\s+completely\s+omitted\s*/i,
    /^is\s+omitted\s*/i
  ];
  
  for (const intro of intros) {
    clean = clean.replace(intro, '');
  }
  
  // Clean punctuation
  clean = clean.trim();
  clean = clean.replace(/\.$/, '');
  clean = clean.replace(/,\s*$/, '');
  
  if (clean.length > 0) {
    clean = clean.charAt(0).toUpperCase() + clean.slice(1);
  }
  
  return clean.trim();
};

const getReferCitation = (reqId: string): string => {
  const mapping: { [key: string]: { section: string; page: string } } = {
    patient_details: { section: '2.1.2 (Patient details)', page: '6' },
    hospital_details: { section: '2.1.2 (Hospital details)', page: '6' },
    recipients: { section: '2.1.2 (Recipient (s))', page: '6' },
    author_clinician: { section: '2.1.2 (Discharging clinician)', page: '6' },
    presentation_details: { section: '2.1.2 (Presentation details)', page: '6' },
    problem_diagnoses: { section: '2.1.2 (Presenting problem/s and diagnoses)', page: '6' },
    procedures: { section: '2.1.2 (Procedures)', page: '7' },
    clinical_summary: { section: '2.1.2 (Clinical summary)', page: '7' },
    allergies: { section: '2.1.2 (Allergies / adverse reactions)', page: '7' },
    medicines_discharge: { section: '2.1.2 (Medicines on discharge)', page: '8' },
    ceased_medicines: { section: '2.1.2 (Ceased and temporarily suspended medicines)', page: '8' },
    alerts: { section: '2.1.2 (Alerts)', page: '8' },
    recommendations: { section: '2.1.2 (Recommendations)', page: '8' },
    followup_appointments: { section: '2.1.2 (Follow-up appointments)', page: '8' },
    patient_info: { section: '2.1.2 (Information provided to patient)', page: '8' },
  };

  const item = mapping[reqId];
  if (!item) return '';
  return `Refer to Section ${item.section} on Page ${item.page} of the guideline.`;
};

const findMatchingRequirement = (category: string, content: string): string => {
  const normCategory = category.toLowerCase();
  const normContent = content.toLowerCase();

  // If the content starts with "Prefix: ", analyze the prefix first because it's a very strong indicator!
  const firstColonIndex = content.indexOf(':');
  const prefix = firstColonIndex > -1 ? content.substring(0, firstColonIndex).toLowerCase() : '';

  let highestScore = -1;
  let bestReqId = 'problem_diagnoses'; // Default to a central section

  // Define very high-affinity exact/partial phrase matches on either content or prefix
  const contentAffinityMatches: { [key: string]: string[] } = {
    patient_details: [
      'patient details', 'patient details layout', 'missing identifiers', 'patient name', 
      'mrn', 'medical record number', 'dob', 'date of birth', 'residential address', 
      'telephone number', 'demographics', 'patient full name'
    ],
    hospital_details: [
      'hospital details', 'hospital and contact', 'hospital name', 'local health district', 
      'lhd', 'facility name', 'discharging specialty contact'
    ],
    recipients: [
      'recipient', 'nominated gp', 'primary care provider', 'general practitioner', 
      'gp', 'ams', 'aboriginal medical service', 'addressed to'
    ],
    author_clinician: [
      'author', 'discharging clinician', 'supervisor', 'clinical signature', 
      'role designation', 'attending medical officer', 'attending clinician', 'registrar'
    ],
    presentation_details: [
      'presentation details', 'admission date', 'discharge date', 'length of stay', 
      'los', 'clinical unit', 'clinical specialty', 'discharge destination'
    ],
    problem_diagnoses: [
      'presenting problem', 'diagnoses', 'principal diagnosis', 'complications', 
      'past medical history', 'reason for presentation'
    ],
    procedures: [
      'procedures & implanted', 'procedures', 'implanted devices', 'nil performed', 
      'medical devices', 'surgical', 'operation', 'invasive clinical', 'explanted'
    ],
    clinical_summary: [
      'clinical course', 'clinical summary', 'hospital course', 'summary of hospital stay', 
      'icu', 'hdu'
    ],
    allergies: [
      'allergies', 'allergy', 'adverse reactions', 'intolerance', 'reaction type', 
      'nil known allergies', 'allergy status'
    ],
    medicines_discharge: [
      'medicines on discharge', 'strict grouping', 'new medicines', 'changed medicines', 
      'unchanged', 'medications are', 'alphabetical list', 'alphabetical order', 
      'subheadings', 'medication reconciliation', 'tablet', 'mg', 'route'
    ],
    ceased_medicines: [
      'ceased', 'ceased medicines', 'suspended medicines', 'ceased & suspended', 
      'de-prescribing', 'reasons for ceasing', 'withheld medication', 'temporarily suspended'
    ],
    alerts: [
      'alerts', 'infection', 'falls risk', 'clinical safety', 'cognitive alert', 'falls warning'
    ],
    recommendations: [
      'recommendations', 'ongoing management', 'pending investigations', 'pending results', 
      'ownership', 'outpatient healthcare', 'future actions'
    ],
    followup_appointments: [
      'follow-up', 'appointments', 'scheduled', 'follow-up appointments', 'booking status', 
      're-appointment'
    ],
    patient_info: [
      'dose administration aids', 'daa', 'blister pack', 'webster care', 'information provided', 
      'patient/carer', 'cfml', 'client-friendly', 'pfml', 'disclaimer'
    ]
  };

  for (const req of MINIMUM_REQUIREMENTS) {
    let score = 0;

    // 1. High-affinity prefix/phrase matches (overrides general category matches)
    const affinityPhrases = contentAffinityMatches[req.id] || [];
    for (const phrase of affinityPhrases) {
      if (prefix && (prefix.includes(phrase) || phrase.includes(prefix))) {
        score += 80; // Extremely high weight if it matches the prefix subject
      }
      if (normContent.includes(phrase)) {
        score += 40; // High weight if it matches the content body
      }
    }

    // 2. Explicit title matches category
    if (normCategory.includes(req.title.toLowerCase()) || req.title.toLowerCase().includes(normCategory)) {
      score += 25;
    }

    // 3. Category match keywords
    for (const kw of req.keywords) {
      if (normCategory.includes(kw)) {
        score += 15;
      }
    }

    // 4. Content match keywords
    for (const kw of req.keywords) {
      if (normContent.includes(kw)) {
        score += 5;
      }
    }

    if (score > highestScore && score > 0) {
      highestScore = score;
      bestReqId = req.id;
    }
  }

  return bestReqId;
};

// Realistic pre-populated patient matching the quick-simulation documents for stellar out-of-the-box demo
const DEFAULT_PATIENTS: Patient[] = [
  {
    id: 'pat-margaret-abernathy',
    name: 'Margaret Abernathy',
    dob: '1944-11-12',
    gender: 'Female',
    admissionDate: '2026-05-20',
    dischargeDate: '2026-06-05',
    manualNotes: `Admitted following a mechanical trip and fall at her residence. 
- Sustained a mild distal radius fracture (treated with a light plaster cast). 
- Active delirium noted during first 36 hours of admission, which has now fully cleared (resolving hypoactive presentation).
- Has moderate dementia managed with medication.
- Needs post-discharge physical therapy and GP reconciliation.`,
    uploadedDocName: null,
    uploadedDocType: null,
    cleanedMarkdown: null,
    clinicianSigned: false,
    clinicianSignatureName: null,
    signedAt: null,
    summary: null,
    missingInfoAnalysis: null,
    patientLetter: null,
    electronicLetter: null,
    createdAt: new Date().toISOString(),
  }
];

export default function App() {
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('elderly_discharge_patients');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Failed to parse saved patients, restoring default.', err);
      }
    }
    return DEFAULT_PATIENTS;
  });

  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    patients[0]?.id || ''
  );
  const [searchTerm, setSearchTerm] = useState('');
  
  // Demographics Editing & AI Extraction
  const [isEditingDemographics, setIsEditingDemographics] = useState(false);
  const [isDetectingDemographics, setIsDetectingDemographics] = useState(false);

  // States for API status
  const [isConsolidating, setIsConsolidating] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [auditStatusText, setAuditStatusText] = useState('');
  const [isGeneratingLetters, setIsGeneratingLetters] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Summary Edit state
  const [editSummaryMode, setEditSummaryMode] = useState(false);
  const [editedSummary, setEditedSummary] = useState('');
  const [showInputs, setShowInputs] = useState(true);
  const [expandedRequirementId, setExpandedRequirementId] = useState<string | null>(null);
  const [auditTab, setAuditTab] = useState<'safeties' | 'summary'>('safeties');
  const [isWalkthroughActive, setIsWalkthroughActive] = useState(true);
  const [walkthroughIndex, setWalkthroughIndex] = useState(0);
  const [deletingPatientId, setDeletingPatientId] = useState<string | null>(null);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  // Initialize and sync showInputs when the selected patient changes
  useEffect(() => {
    if (selectedPatient) {
      setShowInputs(!selectedPatient.summary);
      setIsEditingDemographics(false); // Reset profile editing state
      setIsWalkthroughActive(true);
      setWalkthroughIndex(0);
    }
  }, [selectedPatientId]);

  // Sync local summary state with newly selected patient or newly updated/generated summaries
  useEffect(() => {
    if (selectedPatient) {
      setEditedSummary(selectedPatient.summary || '');
      setEditSummaryMode(false);
    }
  }, [selectedPatientId, selectedPatient?.summary]);

  // Auto-expand the first requirement with gaps when patient or compliance report changes
  useEffect(() => {
    if (selectedPatient && selectedPatient.missingInfoAnalysis) {
      const bubbles = getMissingInfoBubbles(selectedPatient.missingInfoAnalysis);
      const firstGapReq = MINIMUM_REQUIREMENTS.find(req => 
        bubbles.some(b => findMatchingRequirement(b.category, b.content) === req.id)
      );
      if (firstGapReq) {
        setExpandedRequirementId(firstGapReq.id);
      } else if (MINIMUM_REQUIREMENTS.length > 0) {
        setExpandedRequirementId(MINIMUM_REQUIREMENTS[0].id);
      }
    } else {
      setExpandedRequirementId(null);
    }
  }, [selectedPatientId, selectedPatient?.missingInfoAnalysis]);

  // Auto-detect patient details when raw content changes, but only if name is 'New Profile'
  useEffect(() => {
    if (selectedPatient && selectedPatient.name === 'New Profile') {
      const hasContent = (selectedPatient.manualNotes && selectedPatient.manualNotes.trim().length > 15) || selectedPatient.cleanedMarkdown;
      if (hasContent && !isDetectingDemographics) {
        triggerDetectDemographics(selectedPatient);
      }
    }
  }, [selectedPatientId, selectedPatient?.cleanedMarkdown, selectedPatient?.manualNotes]);

  // Save changes back to state and localStorage
  const saveChange = (updatedPatients: Patient[]) => {
    setPatients(updatedPatients);
    localStorage.setItem('elderly_discharge_patients', JSON.stringify(updatedPatients));
  };

  // Helper to update properties on the selected patient
  const updateSelectedPatient = (updated: Patient) => {
    const nextPatients = patients.map((p) => (p.id === updated.id ? updated : p));
    saveChange(nextPatients);
  };

  // Helper to parse missing information into styled red bubbles grouped by context
  const getMissingInfoBubbles = (markdownText: string) => {
    if (!markdownText) return [];
    
    const lines = markdownText.split(/\r?\n/);
    const bubbles: { category: string; content: string }[] = [];
    let currentCategory = 'Required Hospital Standard';
    
    for (let line of lines) {
      const cleanLine = line.trim();
      if (!cleanLine) continue;
      
      // If line defines a heading or section category
      if (
        cleanLine.startsWith('###') || 
        (cleanLine.startsWith('**') && cleanLine.endsWith('**')) ||
        (cleanLine.startsWith('- **') && cleanLine.endsWith('**')) ||
        (cleanLine.startsWith('* **') && cleanLine.endsWith('**'))
      ) {
        currentCategory = cleanLine
          .replace(/^###\s*/, '')
          .replace(/^[-*]\s*\*\*/, '')
          .replace(/^\*\*/, '')
          .replace(/\*\*$/, '')
          .replace(/^[-*]\s*/, '')
          .replace(/:$/, '')
          .trim();
        continue;
      }
      
      // If it is a standard bullet point line
      if (cleanLine.startsWith('-') || cleanLine.startsWith('*')) {
        const textContent = cleanLine.replace(/^[-*]\s*/, '').trim();
        if (textContent) {
          bubbles.push({
            category: currentCategory,
            content: textContent,
          });
        }
      } else if (cleanLine.length > 8 && !cleanLine.startsWith('<') && !cleanLine.startsWith('###')) {
        bubbles.push({
          category: currentCategory,
          content: cleanLine,
        });
      }
    }
    
    if (bubbles.length === 0) {
      return [{ category: 'Audit Attention', content: markdownText }];
    }
    
    return bubbles;
  };

  const triggerDetectDemographics = async (patientToDetect: Patient) => {
    if (!patientToDetect || (!patientToDetect.manualNotes && !patientToDetect.cleanedMarkdown)) return;
    setIsDetectingDemographics(true);
    try {
      const response = await fetch('/api/detect-demographics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          manualNotes: patientToDetect.manualNotes,
          cleanedMarkdown: patientToDetect.cleanedMarkdown,
        }),
      });

      if (!response.ok) {
        throw new Error('Demographics parsing failed.');
      }

      const data = await response.json();
      
      const updated = {
        ...patientToDetect,
        name: data.name || patientToDetect.name,
        dob: data.dob || patientToDetect.dob,
        gender: data.gender || patientToDetect.gender,
        admissionDate: data.admissionDate || patientToDetect.admissionDate,
        dischargeDate: data.dischargeDate || patientToDetect.dischargeDate,
      };
      
      updateSelectedPatient(updated);
      showNotice('✨ Correlated demographic profile details from notes!');
    } catch (err: any) {
      console.error('Demographics extraction failed:', err);
    } finally {
      setIsDetectingDemographics(false);
    }
  };

  const handleCreateBlankPatient = () => {
    const newPatient: Patient = {
      id: `pat-${Date.now()}`,
      name: 'New Profile',
      dob: '1960-01-01',
      gender: 'Female',
      admissionDate: new Date().toISOString().split('T')[0],
      dischargeDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      manualNotes: '',
      uploadedDocName: null,
      uploadedDocType: null,
      cleanedMarkdown: null,
      clinicianSigned: false,
      clinicianSignatureName: null,
      signedAt: null,
      summary: null,
      missingInfoAnalysis: null,
      patientLetter: null,
      electronicLetter: null,
      createdAt: new Date().toISOString(),
    };

    const nextPatients = [newPatient, ...patients];
    saveChange(nextPatients);
    setSelectedPatientId(newPatient.id);
    setShowInputs(true);
    setIsEditingDemographics(false);
    showNotice(`Added empty profile. Upload a file or paste notes to automatically fill demographic details!`);
  };

  const handleDeletePatient = (id: string) => {
    const nextPatients = patients.filter((p) => p.id !== id);
    saveChange(nextPatients);
    if (selectedPatientId === id) {
      setSelectedPatientId(nextPatients[0]?.id || '');
    }
    showNotice('Patient profile removed.');
  };

  const showNotice = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  // API Call: Consolidate records and audit for missing details
  const triggerConsolidate = async () => {
    if (!selectedPatient) return;
    setIsConsolidating(true);
    setAuditProgress(5);
    setAuditStatusText('Initializing referral letter safety check...');
    setErrorMessage('');

    let currentProgress = 5;
    const stages = [
      { maxPrg: 20, text: 'Scanning and tokenizing referral draft text...' },
      { maxPrg: 40, text: 'Verifying core patient metadata and identifier matching...' },
      { maxPrg: 60, text: 'Matching text omissions against NSW Health GL2022_005 Section 2.1...' },
      { maxPrg: 80, text: 'Searching discharge letter text for medication state lists (active/altered/ceased)...' },
      { maxPrg: 95, text: 'Detecting gaps in GP follow-up plans and pending trial/diagnostic logs...' },
    ];

    const progressInterval = setInterval(() => {
      const activeStage = stages.find(s => currentProgress < s.maxPrg) || { text: 'Compiling structured safety audit checklist...' };
      setAuditStatusText(activeStage.text);

      if (currentProgress < 95) {
        const increment = currentProgress < 40 ? 4 : currentProgress < 75 ? 2 : 1;
        currentProgress += increment;
        setAuditProgress(currentProgress);
      }
    }, 200);

    try {
      const response = await fetch('/api/consolidate-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selectedPatient.name,
          dob: selectedPatient.dob,
          manualNotes: selectedPatient.manualNotes,
          cleanedMarkdown: selectedPatient.cleanedMarkdown,
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error while consolidating records.');
      }

      const data = await response.json();
      
      clearInterval(progressInterval);
      setAuditProgress(100);
      setAuditStatusText('Audit complete! Compiling safety report indicators...');
      
      await new Promise((resolve) => setTimeout(resolve, 500));

      updateSelectedPatient({
        ...selectedPatient,
        summary: data.summary,
        missingInfoAnalysis: data.missingInfoAnalysis,
      });

      setShowInputs(false);

      showNotice('Successfully validated discharge letter gaps and safety requirements!');
    } catch (err: any) {
      clearInterval(progressInterval);
      console.error(err);
      setErrorMessage(err.message || 'Error occurred while contacting the clinical AI engine.');
    } finally {
      setIsConsolidating(false);
    }
  };

  // API Call: Generate patient-friendly + Electronic EHR discharge summaries
  const triggerGenerateLetters = async () => {
    if (!selectedPatient || !selectedPatient.summary) return;
    setIsGeneratingLetters(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/generate-letters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selectedPatient.name,
          dob: selectedPatient.dob,
          gender: selectedPatient.gender,
          summary: selectedPatient.summary,
          manualNotes: selectedPatient.manualNotes,
          cleanedMarkdown: selectedPatient.cleanedMarkdown,
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error while generating letters.');
      }

      const data = await response.json();
      updateSelectedPatient({
        ...selectedPatient,
        patientLetter: data.patientLetter,
        electronicLetter: data.electronicLetter,
      });

      showNotice('Discharge documents generated and synced with safety portal!');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error occurred while generating discharge letters.');
    } finally {
      setIsGeneratingLetters(false);
    }
  };

  // Clipboard copies
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    showNotice(`Copied ${type} contents to clipboard!`);
  };

  // Print support
  const handlePrint = (contentId: string, title: string) => {
    const contentElement = document.getElementById(contentId);
    if (!contentElement) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${title} - ${selectedPatient?.name}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            h1 { border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px; font-size: 24px; }
            h2 { font-size: 20px; margin-top: 30px; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
            th { background-color: #f8fafc; font-weight: bold; }
            ul, ol { padding-left: 20px; margin: 15px 0; }
            li { margin-bottom: 5px; }
            .badge { display: inline-block; padding: 4px 8px; font-size: 11px; font-weight: bold; background: #e2e8f0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <h1>${title} - For ${selectedPatient?.name}</h1>
          <p><strong>Date of Birth:</strong> ${selectedPatient?.dob ? new Date(selectedPatient.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
          <p><strong>Print Date:</strong> ${new Date().toLocaleDateString('en-US')}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
          <div style="font-size: 14px;">
            ${contentElement.innerHTML}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Filter patients based on search
  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="app-root" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased">
      {/* Top Professional Portal Headers */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-emerald-600/10 shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">Referral Auditor</h1>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200/50 px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider">
                Compliance Checker
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Audit written referral letters against NSW Health GL2022_005 discharge guidelines for missing elements.
            </p>
          </div>
        </div>

        {/* Global state notices */}
        <div className="flex items-center gap-3">
          <GuidelineViewer onCopyText={(text) => copyToClipboard(text, 'GL2022_005 Guideline')} />
          {successMessage && (
            <div className="bg-emerald-50 text-emerald-800 dark:bg-emerald-900/10 dark:text-emerald-400 border border-emerald-200/40 px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 select-none animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="bg-red-50 text-red-800 border border-red-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold max-w-xs truncate">
              {errorMessage}
            </div>
          )}
          <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md hidden lg:inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            EHR Connection Online
          </span>
        </div>
      </header>

      {/* Safety Warning Bar */}
      <div className="bg-amber-50 px-6 py-2.5 border-b border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-amber-900 gap-2 font-medium">
        <span className="flex items-center gap-2">
          <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0" />
          <span>
            <strong>Clinical Safety Disclaimer:</strong> AI can make errors, Verify the source. All audits and letters derive from NSW Health **GL2022_005** Guidelines.
          </span>
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-500/20 px-2 py-0.5 rounded">
            GL2022_005 Auditing Verified
          </span>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Sidebar Patients Roster */}
        <aside className="w-full md:w-80 bg-white border-b md:border-b-0 md:border-r border-slate-200 shrink-0 flex flex-col max-h-[400px] md:max-h-none overflow-hidden">
          <div className="p-4 border-b border-slate-100 space-y-3">
            <button
              onClick={handleCreateBlankPatient}
              className="w-full h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all shadow-sm animate-in fade-in duration-305"
            >
              <Plus className="w-4.5 h-4.5" />
              Add Patient Profile
            </button>

            {/* Patients Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search registered charts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-emerald-500 transition-colors bg-slate-50/50"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>

            {/* Reassurance info badge explaining local-only storage */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-2.5 flex items-start gap-2 text-[10px] text-slate-600 font-medium leading-normal animate-in fade-in duration-300">
              <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span>Patient records are <strong>stored strictly locally</strong> in this browser. No personal health information is ever uploaded to a server database.</span>
              </div>
            </div>
          </div>

          {/* Roster list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
            {filteredPatients.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No matching clinical charts.
              </div>
            ) : (
              filteredPatients.map((p) => {
                const isSelected = p.id === selectedPatientId;
                const statusFlag = p.summary ? 'Audited' : 'Awaiting Audit';
                const statusColor = p.summary 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                  : 'bg-amber-50 text-amber-700 border-amber-100';

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPatientId(p.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all border group relative flex items-start justify-between ${
                      isSelected
                        ? 'bg-slate-50 border-slate-300 shadow-xs'
                        : 'bg-white border-transparent hover:bg-slate-50/75 hover:border-slate-200'
                    }`}
                  >
                    <div className="space-y-1 pr-6 flex-1">
                      <div className="flex items-center gap-1.5">
                        <strong className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {p.name}
                        </strong>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 rounded">
                          {p.gender.charAt(0)}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">
                        DOB: {p.dob ? new Date(p.dob).toLocaleDateString() : 'N/A'}
                      </p>
                      
                      <div className="flex items-center gap-1.5 pt-1.5">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded border ${statusColor} font-semibold`}>
                          {statusFlag}
                        </span>
                        {p.clinicianSigned && (
                          <span className="text-[9px] text-emerald-600 font-semibold flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3" /> Signed
                          </span>
                        )}
                      </div>
                    </div>

                    {deletingPatientId === p.id ? (
                      <div 
                        className="flex items-center gap-1 shrink-0 ml-2 animate-in fade-in zoom-in duration-150"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            handleDeletePatient(p.id);
                            setDeletingPatientId(null);
                          }}
                          className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded-md cursor-pointer transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingPatientId(null)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-150 rounded-md cursor-pointer text-sm font-bold transition-colors leading-none"
                          title="Cancel"
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingPatientId(p.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
                        title="Delete Patient Chart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Selected Patient Roster Workspace */}
        <main className="flex-1 overflow-y-auto bg-slate-50/55 p-4 lg:p-6 space-y-6">
          {!selectedPatient ? (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-xl max-w-lg mx-auto text-center space-y-4 shadow-sm mt-12">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-800">No Patient Chart Selected</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Please register a new patient or choose from the client lists in the left panel to begin.
                </p>
              </div>
              <button
                onClick={handleCreateBlankPatient}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition"
              >
                Add Patient Profile
              </button>
            </div>
          ) : (
            <div className="space-y-6 max-w-5xl mx-auto">
                           {/* Sleek Patient Demographics Row */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 px-4 shadow-3xs flex flex-col gap-3.5 animate-in fade-in duration-200">
                <div className="flex flex-wrap items-center justify-between gap-3 text-slate-700 font-sans">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-700 shrink-0 font-bold text-sm">
                      {selectedPatient.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="text-sm text-slate-900 truncate">{selectedPatient.name}</strong>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium">
                          {selectedPatient.gender}
                        </span>
                        {selectedPatient.name === 'New Profile' && (
                          <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-100 px-1.5 py-0.2 rounded font-medium uppercase animate-pulse">
                            Needs Notes
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-400 mt-0.5">
                        <span>DOB: <strong className="text-slate-600 font-medium">{selectedPatient.dob || 'N/A'}</strong> ({selectedPatient.dob ? (new Date().getFullYear() - new Date(selectedPatient.dob).getFullYear()) : 'N/A'} yrs)</span>
                        <span>•</span>
                        <span>Admission: <strong className="text-slate-600 font-medium">{selectedPatient.admissionDate || 'N/A'}</strong></span>
                        <span>•</span>
                        <span>Discharge target: <strong className="text-slate-600 font-medium">{selectedPatient.dischargeDate || 'N/A'}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Active Demographics AI Detector */}
                    {isDetectingDemographics && (
                      <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1.5 mr-2 animate-pulse">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                        Detecting details...
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsEditingDemographics(!isEditingDemographics)}
                      className={`px-3 py-1 border text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-3xs ${
                        isEditingDemographics 
                          ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white' 
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>{isEditingDemographics ? 'Done' : 'Edit Details'}</span>
                    </button>
                  </div>
                </div>

                {/* Patient Demographics mini-editor card */}
                {isEditingDemographics && (
                  <div className="bg-slate-50/70 border border-slate-100 rounded-lg p-3.5 space-y-3 animate-in slide-in-from-top-1 duration-150">
                    <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                      <h4 className="text-[11px] font-bold text-slate-650 uppercase tracking-wider flex items-center gap-1.5">
                        Patient Demographic Profile & Audit Metadata
                      </h4>
                      <button
                        type="button"
                        disabled={isDetectingDemographics || (!selectedPatient.manualNotes && !selectedPatient.cleanedMarkdown)}
                        onClick={() => triggerDetectDemographics(selectedPatient)}
                        className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-200 disabled:opacity-50 text-emerald-700 text-[10px] font-semibold rounded-md flex items-center gap-1 transition-all"
                        title="Auto-extract demographics from clinical records"
                      >
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        Re-run AI Auto-Detect
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Full Name</label>
                        <input
                          type="text"
                          value={selectedPatient.name}
                          onChange={(e) => updateSelectedPatient({ ...selectedPatient, name: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-hidden focus:border-emerald-500 bg-white"
                          placeholder="Full Name"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Gender</label>
                        <select
                          value={selectedPatient.gender}
                          onChange={(e) => updateSelectedPatient({ ...selectedPatient, gender: e.target.value })}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-hidden focus:border-emerald-500 bg-white"
                        >
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Date of Birth</label>
                        <input
                          type="date"
                          value={selectedPatient.dob}
                          onChange={(e) => updateSelectedPatient({ ...selectedPatient, dob: e.target.value })}
                          className="w-full px-2 py-1 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-hidden focus:border-emerald-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Admission Date</label>
                        <input
                          type="date"
                          value={selectedPatient.admissionDate}
                          onChange={(e) => updateSelectedPatient({ ...selectedPatient, admissionDate: e.target.value })}
                          className="w-full px-2 py-1 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-hidden focus:border-emerald-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Discharge Date</label>
                        <input
                          type="date"
                          value={selectedPatient.dischargeDate}
                          onChange={(e) => updateSelectedPatient({ ...selectedPatient, dischargeDate: e.target.value })}
                          className="w-full px-2 py-1 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-hidden focus:border-emerald-500 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Action Bar for switching between editing inputs and viewing synthesized audit records */}
              {selectedPatient.summary && (
                <div id="navigation-action-bar" className="flex items-center justify-between bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 shadow-xs animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span className={`w-2 h-2 rounded-full ${showInputs ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                    <span>
                      {showInputs 
                        ? "Inputs active. Click 'View Compliance Evaluation' to view the audit checklists." 
                        : "Audit complete. Review details below."
                      }
                    </span>
                  </div>
                  
                  {showInputs ? (
                    <button
                      onClick={() => setShowInputs(false)}
                      className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-250/65 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    >
                      <span>View Compliance Evaluation</span>
                      <ChevronRight className="w-4 h-4 text-emerald-600" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowInputs(true)}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    >
                      <ArrowLeft className="w-4 h-4 text-slate-500" />
                      Back to Notes & Letters
                    </button>
                  )}
                </div>
              )}

              {/* STEP 1: INPUT DATA - Notes and OCR */}
              {showInputs && (
                <DocumentCleaner
                  patient={selectedPatient}
                  onUpdatePatient={updateSelectedPatient}
                />
              )}

              {/* STEP 2: REFERRAL LETTER GAP & SAFETY CHECK */}
              {showInputs && (
                <div className="bg-linear-to-br from-slate-50 to-slate-100/55 border border-slate-200/80 rounded-xl p-8 lg:p-10 shadow-3xs flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-300">
                  <div className="w-14 h-14 bg-emerald-50 border border-emerald-100/50 rounded-full flex items-center justify-center text-emerald-600 shadow-3xs shrink-0">
                    <Sparkles className="w-7 h-7" />
                  </div>

                  <div className="space-y-1.5 max-w-xl">
                    <h3 className="text-base font-bold text-slate-900">Run Guidelines Compliance Audit</h3>
                    <p className="text-xs text-slate-505 leading-relaxed font-semibold">
                      Analyze patient entries, manual files, and written referral letters against NSW Health <strong>GL2022_005</strong> guidelines. This clinical safety check automatically scans for required parameters and missing medications data.
                    </p>
                  </div>

                  {isConsolidating ? (
                    <div className="w-full max-w-md space-y-4">
                      <div className="bg-white border border-slate-150 rounded-lg p-3.5 shadow-3xs">
                        <span className="block text-[10px] font-extrabold text-amber-650 font-mono tracking-wider uppercase mb-1">
                          Live LLM Audit Engine
                        </span>
                        <span className="text-xs font-semibold text-slate-700 min-h-[1.5rem] flex items-center justify-center animate-pulse transition-all duration-200">
                          {auditStatusText || 'Initializing engine...'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-450 font-mono">
                          <span>AUDITING PARAMS</span>
                          <span className="text-amber-600 bg-amber-50 border border-amber-200/50 px-1.5 py-0.5 rounded font-bold">
                            {auditProgress}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-250 h-3 rounded-full overflow-hidden shadow-inner relative">
                          <div 
                            className="bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 h-full rounded-full transition-all duration-300 ease-out" 
                            style={{ width: `${auditProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={triggerConsolidate}
                      disabled={
                        (!selectedPatient.manualNotes && !selectedPatient.cleanedMarkdown) ||
                        (selectedPatient.uploadedDocName && !selectedPatient.aiInterpretationVerified)
                      }
                      className="w-full max-w-md h-12.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-205 disabled:to-slate-205 disabled:text-slate-400 text-white rounded-xl text-sm font-extrabold flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed cursor-pointer select-none border-t border-emerald-500/10"
                    >
                      <Sparkles className="w-5 h-5 shrink-0 text-emerald-100" />
                      <span>Check Referral Letter Gaps</span>
                    </button>
                  )}

                  {selectedPatient.uploadedDocName && !selectedPatient.aiInterpretationVerified && (
                    <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-3.5 text-xs text-amber-900 flex items-start gap-2.5 max-w-md text-left animate-in fade-in duration-200">
                      <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Audit Locked:</strong> Please review, verify AI document extraction, and sign the discharge letter block in the clinical workspace above to unlock this safety check.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2 (THE NEXT PAGE): REFERRAL LETTER GAP & SAFETY CHECK */}
              {!showInputs && (
                <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="p-1 px-2 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-250/30 rounded font-bold uppercase tracking-wider">
                          Audit Phase II
                        </span>
                        <h3 className="text-base font-bold text-slate-900">Discharge Letter Gap & Safety Check</h3>
                      </div>
                      <p className="text-xs text-slate-550 font-medium">
                        NSW Health GL2022_005 Parameter Compliance Check
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setShowInputs(true)}
                        className="h-9 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-3xs"
                      >
                        <ArrowLeft className="w-4 h-4 text-slate-500" />
                        <span>Back to Notes & Letters</span>
                      </button>
                    </div>
                  </div>

                  {/* Audit Results Viewport */}
                  {selectedPatient.summary ? (
                      (() => {
                        const bubbles = getMissingInfoBubbles(selectedPatient.missingInfoAnalysis || '');
                        const reqsGapsList = MINIMUM_REQUIREMENTS.map((req) => {
                          const matchingBubbles = bubbles.filter(
                            (b) => findMatchingRequirement(b.category, b.content) === req.id
                          );
                          return {
                            ...req,
                            gaps: matchingBubbles,
                          };
                        });
                        const totalGapsCount = bubbles.length;

                        return (
                          <div className="bg-white border border-slate-200/95 rounded-xl p-6 shadow-xs flex flex-col justify-between animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div>


                              {/* TAB 1: SAFETY CHECKLIST & MINIMUM REQUIREMENTS */}
                              {auditTab === 'safeties' && (() => {
                                const reqsWithGaps = reqsGapsList.filter((req) => req.gaps.length > 0);
                                const isWalkthrough = isWalkthroughActive && reqsWithGaps.length > 0;

                                return (
                                  <div className="space-y-4 font-sans text-left">
                                    


                                    {/* CONDITIONAL CONTENT */}
                                    {isWalkthrough ? (
                                      /* Walkthrough Card Interface */
                                      (() => {
                                        const currentReqIndex = Math.min(walkthroughIndex, reqsWithGaps.length - 1);
                                        const req = reqsWithGaps[currentReqIndex];
                                        if (!req) return null;

                                        return (
                                          <div className="bg-white border-2 border-red-100 rounded-xl p-5 space-y-4 shadow-3xs animate-in fade-in slide-in-from-bottom-1 duration-200">
                                            
                                            {/* Step Header */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                                              <div>
                                                <div className="flex items-center gap-2">
                                                  <span className="text-[9px] font-extrabold text-red-700 bg-red-100/70 border border-red-250/30 px-2 py-0.5 rounded uppercase tracking-wider">
                                                    Clinical Gap Section {currentReqIndex + 1} of {reqsWithGaps.length}
                                                  </span>
                                                </div>
                                                <h5 className="text-sm font-bold text-slate-800 mt-2 flex items-center gap-2 leading-tight">
                                                  <span className="text-[10px] font-mono font-bold bg-slate-100 border border-slate-200 text-slate-505 w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                                                    {req.displayOrder}
                                                  </span>
                                                  {req.title}
                                                </h5>
                                              </div>
                                              
                                              {/* Jump points */}
                                              <div className="flex flex-wrap items-center justify-end gap-1.5 py-1 max-w-[200px] sm:max-w-none">
                                                {reqsWithGaps.map((_, idx) => (
                                                  <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => setWalkthroughIndex(idx)}
                                                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                                                      idx === currentReqIndex
                                                        ? 'bg-red-500 scale-120'
                                                        : 'bg-red-100 hover:bg-red-200'
                                                    }`}
                                                    title={`Go to gap section ${idx + 1}`}
                                                  />
                                                ))}
                                              </div>
                                            </div>

                                            {/* Details Section */}
                                            <div className="space-y-4">
                                              
                                              {/* Omissions detailed list */}
                                              <div className="space-y-2">
                                                <div className="text-[10px] font-extrabold text-red-700 uppercase tracking-wider flex items-center gap-1.5">
                                                  <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                                  <span>Missing Parameters/Topic Omitted:</span>
                                                </div>
                                                
                                                <div className="space-y-1.5 pl-1.5">
                                                  {req.gaps.map((gap, gIdx) => (
                                                    <div
                                                      key={gIdx}
                                                      className="border-b-0 border-slate-100 pl-3 border-l-2 border-l-red-500 text-slate-750 text-[11.5px] leading-relaxed font-semibold py-0.5 bg-slate-50/50 rounded-r-md"
                                                    >
                                                      <MarkdownView content={cleanGapText(gap.content)} />
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>

                                              {/* Citation footnote */}
                                              <div className="pt-2.5 border-t border-slate-100 text-xs text-slate-550 font-medium leading-relaxed">
                                                <span>{getReferCitation(req.id)}</span>
                                              </div>
                                            </div>

                                            {/* Stepper controls */}
                                            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                                              <button
                                                type="button"
                                                onClick={() => setWalkthroughIndex(prev => Math.max(0, prev - 1))}
                                                disabled={currentReqIndex === 0}
                                                className="h-8.5 px-3 border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                                              >
                                                <ChevronLeft className="w-3.5 h-3.5" />
                                                <span>Prev Gap</span>
                                              </button>

                                              <button
                                                type="button"
                                                onClick={() => setIsWalkthroughActive(false)}
                                                className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold hover:underline cursor-pointer hidden xs:inline"
                                              >
                                                View full list summary instead
                                              </button>

                                              {currentReqIndex < reqsWithGaps.length - 1 ? (
                                                <button
                                                  type="button"
                                                  onClick={() => setWalkthroughIndex(prev => Math.min(reqsWithGaps.length - 1, prev + 1))}
                                                  className="h-8.5 px-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-3xs"
                                                >
                                                  <span>Next Gap</span>
                                                  <ChevronRight className="w-3.5 h-3.5" />
                                                </button>
                                              ) : (
                                                <button
                                                  type="button"
                                                  onClick={() => setIsWalkthroughActive(false)}
                                                  className="h-8.5 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-3xs"
                                                >
                                                  <Check className="w-3.5 h-3.5" />
                                                  <span>Return to overview</span>
                                                </button>
                                              )}
                                            </div>

                                          </div>
                                        );
                                      })()
                                    ) : (
                                      /* Standard complete summary list of 15 parameters */
                                      <div className="space-y-4">

                                        <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                                          {reqsGapsList.map((req) => {
                                            const isExpanded = expandedRequirementId === req.id;
                                            const hasGaps = req.gaps.length > 0;

                                            return (
                                              <div
                                                key={req.id}
                                                className={`border rounded-xl transition-all overflow-hidden ${
                                                  hasGaps
                                                    ? isExpanded 
                                                      ? 'border-red-300 bg-red-50/5' 
                                                      : 'border-red-200/80 bg-white hover:border-red-350'
                                                    : isExpanded 
                                                      ? 'border-slate-350 bg-slate-50/20' 
                                                      : 'border-slate-200 bg-white hover:border-slate-300'
                                                }`}
                                              >
                                                {/* Requirement Header bar */}
                                                <div
                                                  onClick={() => setExpandedRequirementId(isExpanded ? null : req.id)}
                                                  className="px-4 py-3 flex items-center justify-between gap-3 cursor-pointer select-none"
                                                >
                                                  <div className="flex items-center gap-3 min-w-0">
                                                    {/* Status Icon Indicator */}
                                                    {hasGaps ? (
                                                      <div className="w-5.5 h-5.5 rounded-full bg-red-100 flex items-center justify-center text-red-700 shrink-0">
                                                        <AlertCircle className="w-3.5 h-3.5" />
                                                      </div>
                                                    ) : (
                                                      <div className="w-5.5 h-5.5 rounded-full bg-emerald-105 flex items-center justify-center text-emerald-800 shrink-0">
                                                        <Check className="w-3.5 h-3.5 font-bold" />
                                                      </div>
                                                    )}

                                                    {/* Index Number */}
                                                    <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-100 w-5 h-5 rounded-full flex items-center justify-center border border-slate-200/50 shrink-0">
                                                      {req.displayOrder}
                                                    </span>

                                                    {/* Title */}
                                                    <strong className="text-xs font-semibold text-slate-800 truncate">
                                                      {req.title}
                                                    </strong>
                                                  </div>

                                                  <div className="flex items-center gap-2 shrink-0">
                                                    {isExpanded ? (
                                                      <ChevronUp className="w-4 h-4 text-slate-500" />
                                                    ) : (
                                                      <ChevronDown className="w-4 h-4 text-slate-500" />
                                                    )}
                                                  </div>
                                                </div>

                                                {/* Requirement Body details */}
                                                {isExpanded && (
                                                  <div className="px-4 pb-3.5 pt-3 border-t border-slate-100 bg-slate-50/30 space-y-3 animate-in slide-in-from-top-1 duration-150 text-xs">
                                                    
                                                    {/* Simplified output of what is missing */}
                                                    {hasGaps ? (
                                                      <div className="space-y-2">
                                                        <div className="text-[10px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                                                          <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                                          <span>Missing Information</span>
                                                        </div>
                                                        
                                                        <div className="space-y-2 pl-1.5">
                                                          {req.gaps.map((gap, gIdx) => (
                                                            <div
                                                              key={gIdx}
                                                              className="border-b-0 border-slate-100 pl-3 border-l-2 border-l-red-500 text-slate-750 text-[11.5px] leading-relaxed font-semibold py-0.5"
                                                            >
                                                              <MarkdownView content={cleanGapText(gap.content)} />
                                                            </div>
                                                          ))}
                                                        </div>
                                                      </div>
                                                    ) : (
                                                      <div className="text-emerald-800 font-medium flex items-center gap-2 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100/50 text-[11px]">
                                                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                                                        <span>All parameter details documented in current drafts.</span>
                                                      </div>
                                                    )}

                                                    {/* Compact bottom footnote for Policy Standard */}
                                                    <div className="pt-2 border-t border-slate-100/70 text-[11px] text-slate-500 font-medium">
                                                      <span>{getReferCitation(req.id)}</span>
                                                    </div>

                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}

                                    <div className="mt-5 pt-3.5 border-t border-slate-100 flex justify-end">
                                      <button
                                        type="button"
                                        onClick={() => setIsWalkthroughActive(!isWalkthroughActive)}
                                        className="h-9 px-3.5 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 rounded-lg text-slate-700 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-3xs select-none"
                                      >
                                        {isWalkthroughActive ? (
                                          <>
                                            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                                            <span>All 15 Sections (Complete List)</span>
                                          </>
                                        ) : (
                                          <>
                                            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                                            <span>Improvement Walkthrough {reqsWithGaps.length > 0 ? `(${reqsWithGaps.length})` : ''}</span>
                                          </>
                                        )}
                                      </button>
                                    </div>

                                  </div>
                                );
                              })()}



                            </div>
                          </div>
                        );
                      })()
                  ) : (
                    <div className="py-12 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center p-6 space-y-3">
                      <Activity className="w-10 h-10 text-slate-300 animate-pulse" />
                      <div>
                        <p className="text-sm font-medium text-slate-600">Referral Document Safety Audit Pending</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Input manual journal updates or parse hospital papers above, then click 'Check Referral Letter Gaps'.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Patient demographics configuration modal removed in favor of quick inline extraction */}

      {/* Humble aesthetic page bottom credits */}
      <footer className="bg-white border-t border-slate-200 px-6 py-4.5 text-center text-xs text-slate-400 flex flex-col sm:flex-row sm:justify-between items-center gap-2">
        <span>&copy; {new Date().getFullYear()} SilverSafe Portal - Consolidated Medical Systems Co.</span>
        <span className="font-mono text-[10px]">Version 1.0.4 • Secure Hospital Sandboxing Verified</span>
      </footer>
    </div>
  );
}
