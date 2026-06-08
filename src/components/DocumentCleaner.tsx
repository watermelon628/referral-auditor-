/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, Lock, Sparkles, FileSpreadsheet, Eye, Save, AlertTriangle, RefreshCw, Clipboard } from 'lucide-react';
import { Patient } from '../types';
import { MarkdownView } from './MarkdownView';

interface DocumentCleanerProps {
  patient: Patient;
  onUpdatePatient: (updated: Patient) => void;
}

export function DocumentCleaner({ patient, onUpdatePatient }: DocumentCleanerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorWord, setErrorWord] = useState('');
  
  // Local state for clinician checking name in signature block
  const [signerName, setSignerName] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger file selection
  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  // Process selected file
  const processFile = async (file: File) => {
    setIsProcessing(true);
    setErrorWord('');
    
    try {
      const reader = new FileReader();
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

      if (isImage || isPdf) {
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const resultString = reader.result as string;
          // Extract base64 part
          const base64Data = resultString.split(',')[1];
          const mappedType = isPdf ? 'application/pdf' : file.type;
          await sendToCleanApi(base64Data, file.name, mappedType);
        };
      } else {
        reader.readAsText(file);
        reader.onload = async () => {
          const fileText = reader.result as string;
          await sendToCleanApi(fileText, file.name, file.type);
        };
      }
    } catch (err: any) {
      console.error(err);
      setErrorWord('Error reading file contents. Please try again.');
      setIsProcessing(false);
    }
  };

  const sendToCleanApi = async (content: string, fileName: string, fileType: string) => {
    try {
      const response = await fetch('/api/clean-doc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, fileName, fileType }),
      });

      if (!response.ok) {
        let errorMsg = 'Server responded with an error during clinical cleaning.';
        try {
          const errData = await response.json();
          if (errData && errData.error) {
            errorMsg = `Clinical cleaning error: ${errData.error}`;
          }
        } catch (e) {
          // Fallback if not JSON or parsing fails
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      
      onUpdatePatient({
        ...patient,
        uploadedDocName: fileName,
        uploadedDocType: fileType,
        cleanedMarkdown: data.cleanedMarkdown,
        // Set manualNotes to the cleaned text as well so the user can review/edit it in the unified box!
        manualNotes: data.cleanedMarkdown,
        aiInterpretationVerified: false, // Mark for mandatory clinician verification
        // Reset old signature if any
        clinicianSigned: false,
        clinicianSignatureName: null,
        signedAt: null,
      });

    } catch (err: any) {
      console.error(err);
      setErrorWord(err.message || 'Service unreachable. Failed to clean medical record files.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Trigger clinician verification of uploaded AI-translated text
  const handleVerifyInterpretation = (verified: boolean) => {
    onUpdatePatient({
      ...patient,
      aiInterpretationVerified: verified,
    });
  };

  // Handle direct edits in the unified textbox
  const handleTextareaChange = (text: string) => {
    onUpdatePatient({
      ...patient,
      manualNotes: text,
      // If we are currently verified, editing is allowed but does not reset verification unless name changed.
      // Keeping cleanedMarkdown and manualNotes in sync so compliance checking works flawlessly.
      cleanedMarkdown: text,
    });
  };

  // Clinical samples preset loader
  const loadPresetDoc = async (type: 'vitals' | 'medication') => {
    setIsProcessing(true);
    let sampleText = '';
    let sampleName = '';
    
    if (type === 'vitals') {
      sampleName = 'discharge_summary_ward_notes.txt';
      sampleText = `
--------------------------------------------------
ST VINCENT'S IN-PATIENT RECONCILIATION SUMMARY
CONFIDENTIAL MEDICAL DISCHARGE SUMMARY
--------------------------------------------------

Patient Name: Abernathy, Margaret  DOB: 11/12/1944
Admission Date: 05/20/2026

PRINCIPAL DIAGNOSIS:
Mild distal radius fracture right wrist, sustained during mechanical trip at residence. Pre-existing moderate dementia.

HOSPITAL COURSE:
Patient progress was complicated by brief hypoactive delirium in the initial 36 hours of admission, resolving spontaneously. Normal clinical observations at discharge. Post-fracture orthopaedic follow-up scheduled.

DISCHARGE MEDICATION CHANGES:
Metoprolol Succinate 25mg once daily in morning (Unchanged)
Apixaban 2.5mg twice daily (Started for newly diagnosed atrial fibrillation, risk-checked)
Amlodipine 5mg once daily (Stopped due to severe ankle oedema)
Paracetamol 1g every 6 hours PRN (Modified - increased for hip discomfort)
Donepezil 10mg at bedtime (Unchanged)

ALLERGIES:
Penicillin - anaphylaxis severe reaction (documented).
`;
    } else {
      sampleName = 'reconciliation_med_charts.csv';
      sampleText = `
Medication,Dose,Frequency,Status,Indication
Metoprolol Succinate,25mg,Once daily in morning,Unchanged,Hypertension / AFib
Apixaban,2.5mg,Twice daily,Started,Stroke prevention
Amlodipine,5mg,Once daily at bedtime,Stopped,Ankle swelling side effects
Paracetamol,1g,Every 6 hours PRN,Modified (increased frequency),Chronic pain
Donepezil,10mg,At bedtime,Unchanged,Moderate Dementia
`;
    }

    await sendToCleanApi(sampleText, sampleName, 'text/plain');
  };

  // Clinician signature sign-off sub-workflow
  const handleSignOff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerName.trim() || !termsAccepted) return;

    onUpdatePatient({
      ...patient,
      clinicianSigned: true,
      clinicianSignatureName: signerName.trim(),
      signedAt: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      // Automatically verify AI interpretation upon clinician signature
      aiInterpretationVerified: true,
    });
  };

  return (
    <div id="unified-discharge-letter-input" className="space-y-6">
      
      {/* Consolidated Master Card */}
      <div className="bg-white border border-slate-200/95 rounded-xl p-6 shadow-xs flex flex-col space-y-5">
        
        {/* Header Title with Dynamic Mode Badging */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">Patient Referral & Discharge Document Input</h3>
            </div>
            <p className="text-xs text-slate-500">
              Paste the finalized discharge/referral draft below directly, or upload a document file to extract and import its text.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {patient.uploadedDocName ? (
              <span className="text-[10px] bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-1 rounded-md font-bold font-mono uppercase flex items-center gap-1 animate-pulse">
                <Eye className="w-3.5 h-3.5" /> File: {patient.uploadedDocName}
              </span>
            ) : (
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-mono uppercase font-semibold">
                ✍️ Paste / Typing Mode
              </span>
            )}

            {patient.uploadedDocName && (
              <span className={`text-[10px] border px-2.5 py-1 rounded-md font-bold uppercase ${
                patient.aiInterpretationVerified 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-250' 
                  : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
              }`}>
                {patient.aiInterpretationVerified ? '✓ Verified' : '⚠️ Unverified'}
              </span>
            )}
          </div>
        </div>

        {/* 1. Drag & Drop File Selector (Sleek horizontal ribbon) */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-5 text-center transition-all relative overflow-hidden ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/50'
              : 'border-slate-200 bg-slate-50/30 hover:border-slate-350 hover:bg-slate-50/60'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,text/*,.csv,.md,.txt,.pdf"
            className="hidden"
          />

          {isProcessing ? (
            <div className="space-y-2 py-2 flex flex-col items-center justify-center">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
              <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
                Gemini OCR: Reading tables, medications and notes...
              </p>
              <p className="text-xs text-slate-400">Removing headers & standardizing spacing.</p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleSelectFileClick}
                    className="text-sm font-bold text-emerald-600 hover:underline inline-flex items-center gap-1"
                  >
                    Click to upload document
                  </button>
                  <span className="text-xs text-slate-500 font-medium"> or drag and drop here</span>
                  <p className="text-[10px] text-slate-400">Supports PDFs, Images (JPG/PNG), clinical CSVs, and plain text letters.</p>
                </div>
              </div>

              {/* Try Clinical Demo Preloads */}
              <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold hidden xl:inline">Demo Presets:</span>
                <button
                  type="button"
                  onClick={() => loadPresetDoc('vitals')}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs rounded-lg font-medium flex items-center gap-1 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-500" />
                  St Vin Summary
                </button>
                <button
                  type="button"
                  onClick={() => loadPresetDoc('medication')}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs rounded-lg font-medium flex items-center gap-1 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                  Meds CSV
                </button>
              </div>
            </div>
          )}
        </div>

        {errorWord && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-3 text-xs rounded-lg animate-bounce flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorWord}</span>
          </div>
        )}

        {/* 3. The One Unified Text Editor Box */}
        <div className="space-y-1.5 relative">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              Letter Workspace & Active Text Content
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {patient.manualNotes?.length || 0} characters
            </span>
          </div>

          <textarea
            value={patient.manualNotes || ''}
            onChange={(e) => handleTextareaChange(e.target.value)}
            placeholder="Paste your finished discharge letter draft here directly, or write clinical ward diaries, medication reports to be validated..."
            className="w-full h-80 p-4 border border-slate-250 rounded-xl text-sm font-mono bg-slate-50/5 hover:bg-slate-50/30 focus:bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-y shadow-inner leading-relaxed"
          />

          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
            <span className="flex items-center gap-1 font-medium text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Direct auto-save enabled
            </span>
            <span>
              Press <kbd className="bg-slate-100 border border-slate-200 rounded px-1 text-[9px] font-bold">Ctrl</kbd> + <kbd className="bg-slate-100 border border-slate-200 rounded px-1 text-[9px] font-bold">V</kbd> inside the box to paste
            </span>
          </div>
        </div>

        {/* 4. Professional Clinician Signature Confirmation Block */}
        {(patient.manualNotes && patient.manualNotes.trim().length > 10) && (
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-slate-50/20">
            {patient.uploadedDocName && !patient.clinicianSigned && (
              <div className="px-4 py-2.5 bg-amber-500/5 text-amber-900 border-b border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-semibold text-slate-700">
                    <strong>Review Mode:</strong> Edit any errors above, then sign below to verify AI copy & sign-off.
                  </span>
                </div>
              </div>
            )}
            
            <div className="p-3.5 space-y-2.5">
              {patient.clinicianSigned ? (
                <div className="flex items-center gap-3 bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Discharge Document Signed
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Clinician: <strong className="text-slate-900 font-semibold">{patient.clinicianSignatureName}</strong> — confirmed on {patient.signedAt} 
                      {patient.uploadedDocName && <span className="ml-1.5 text-emerald-650 font-bold">(AI Extracted Text Verified)</span>}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSignOff} className="space-y-3">
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="confirm-terms"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                    />
                    <label htmlFor="confirm-terms" className="text-xs text-slate-500 leading-relaxed select-none cursor-pointer text-left">
                      {patient.uploadedDocName ? (
                        <>
                          I verify the AI-extracted details against <strong>"{patient.uploadedDocName}"</strong> and confirm clinical sign-off of this letter for <strong>{patient.name}</strong>.
                        </>
                      ) : (
                        <>
                          I audit and confirm clinical sign-off of this discharge letter safety check for <strong>{patient.name}</strong>.
                        </>
                      )}
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Type your Name & Credentials (e.g. Dr. Alexander Fox, FRACP)"
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-slate-250 rounded-lg text-slate-800 text-xs focus:outline-hidden focus:border-emerald-500 bg-white shadow-3xs"
                    />
                    <button
                      type="submit"
                      disabled={!termsAccepted || !signerName.trim()}
                      className="h-8.5 px-4 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black disabled:from-slate-100 disabled:to-slate-100 disabled:text-slate-400 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-3xs hover:shadow-2xs cursor-pointer select-none border-t border-slate-700/25 shrink-0"
                    >
                      <Lock className="w-3.5 h-3.5 text-slate-300" />
                      <span>{patient.uploadedDocName ? 'Verify AI & Sign' : 'Sign Confirmed Letter'}</span>
                      <kbd className="bg-slate-700 text-slate-200 border border-slate-600 rounded px-1 text-[9px] font-semibold ml-1.5 font-mono">Enter ↵</kbd>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
