/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Patient } from '../types';
import { ShieldAlert, AlertTriangle, AlertCircle, CheckSquare, Square, Info, ShieldCheck, HelpCircle } from 'lucide-react';

interface CohortVerificationProps {
  patient: Patient;
  onUpdatePatient: (updated: Patient) => void;
}

export function CohortVerification({ patient, onUpdatePatient }: CohortVerificationProps) {
  const toggleCohort = (field: keyof Pick<Patient, 
    'isMentalHealthInpatient' | 'isEmergencyDepartment' | 'isOutpatientClinic' | 'isWellBabyObstetric' | 
    'isDayOnly' | 'isVulnerable' | 'isCorrectional' | 'hasAdditionalMedicines'
  >) => {
    // If we toggle on an excluded option, we can make sure any conflict is resolved safely
    onUpdatePatient({
      ...patient,
      [field]: !patient[field]
    });
  };

  const blockingCount = [
    patient.isMentalHealthInpatient,
    patient.isEmergencyDepartment,
    patient.isOutpatientClinic,
    patient.isWellBabyObstetric
  ].filter(Boolean).length;

  const adaptiveCount = [
    patient.isDayOnly,
    patient.isVulnerable,
    patient.isCorrectional,
    patient.hasAdditionalMedicines
  ].filter(Boolean).length;

  return (
    <div id="cohort-exceptions-verification" className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">Cohort Exceptions & Special Discharges</h3>
          </div>
          <p className="text-xs text-slate-500">
            Select patient classifications to apply active safety checks or verify mandatory guideline exclusions.
          </p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {blockingCount > 0 && (
            <span className="text-[9px] bg-rose-50 text-rose-700 border border-rose-200 px-2.0 py-0.5 rounded-md font-bold uppercase tracking-wider animate-pulse">
              {blockingCount} Scope Exclusion{blockingCount > 1 ? 's' : ''}
            </span>
          )}
          {adaptiveCount > 0 && (
            <span className="text-[9px] bg-blue-50 text-blue-700 border border-blue-200 px-2.0 py-0.5 rounded-md font-bold uppercase tracking-wider">
              {adaptiveCount} Adaptive Path{adaptiveCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* CATEGORY 1: PRECLUDED COHORTS */}
      <div className="space-y-2.5">
        <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50/70 py-0.5 px-2 rounded uppercase tracking-wider border border-rose-100/50">
          Guideline Out-of-Scope Exclusions & Redirection (Do Not Continue)
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Mental Health Inpatient */}
          <button
            type="button"
            onClick={() => toggleCohort('isMentalHealthInpatient')}
            className={`flex items-start text-left gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
              patient.isMentalHealthInpatient 
                ? 'bg-rose-50/20 border-rose-300 shadow-3xs' 
                : 'bg-slate-50/40 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {patient.isMentalHealthInpatient ? (
                <CheckSquare className="w-4 h-4 text-rose-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-800 block">Mental Health Inpatient Unit</strong>
              <span className="text-[10px] text-slate-400 mt-0.5 block leading-normal">
                Discharged from a mental health inpatient unit. Regulated under PD2019_045 focus.
              </span>
            </div>
          </button>

          {/* Emergency Department */}
          <button
            type="button"
            onClick={() => toggleCohort('isEmergencyDepartment')}
            className={`flex items-start text-left gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
              patient.isEmergencyDepartment 
                ? 'bg-rose-50/20 border-rose-300 shadow-3xs' 
                : 'bg-slate-50/40 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {patient.isEmergencyDepartment ? (
                <CheckSquare className="w-4 h-4 text-rose-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-800 block">Emergency Dept. Discharge</strong>
              <span className="text-[10px] text-slate-400 mt-0.5 block leading-normal">
                Discharged home directly from emergency wards. Governed under PD2014_025 rules.
              </span>
            </div>
          </button>

          {/* Outpatient Clinic Appointments */}
          <button
            type="button"
            onClick={() => toggleCohort('isOutpatientClinic')}
            className={`flex items-start text-left gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
              patient.isOutpatientClinic 
                ? 'bg-rose-50/20 border-rose-300 shadow-3xs' 
                : 'bg-slate-50/40 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {patient.isOutpatientClinic ? (
                <CheckSquare className="w-4 h-4 text-rose-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-800 block">Outpatient Clinic Appointment</strong>
              <span className="text-[10px] text-slate-400 mt-0.5 block leading-normal">
                Attending outpatient clinics. Standard discharge summaries are non-applicable.
              </span>
            </div>
          </button>

          {/* Well Mothers & Babies */}
          <button
            type="button"
            onClick={() => toggleCohort('isWellBabyObstetric')}
            className={`flex items-start text-left gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
              patient.isWellBabyObstetric 
                ? 'bg-rose-50/20 border-rose-300 shadow-3xs' 
                : 'bg-slate-50/40 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {patient.isWellBabyObstetric ? (
                <CheckSquare className="w-4 h-4 text-rose-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-800 block">Well Mothers & Babies</strong>
              <span className="text-[10px] text-slate-400 mt-0.5 block leading-normal">
                Postnatal midwives coordinate via pathways & ACM National Midwifery bounds.
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* CATEGORY 2: ADAPTIVE Pathway COHORTS */}
      <div className="mt-4 space-y-2.5">
        <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50/70 py-0.5 px-2 rounded uppercase tracking-wider border border-blue-100/50">
          Special Discharge Cohorts (Requires Guided Action/Checklist Checks)
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Day Only Admissions */}
          <button
            type="button"
            onClick={() => toggleCohort('isDayOnly')}
            className={`flex items-start text-left gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
              patient.isDayOnly 
                ? 'bg-blue-50/15 border-blue-250 shadow-3xs' 
                : 'bg-slate-50/40 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {patient.isDayOnly ? (
                <CheckSquare className="w-4 h-4 text-blue-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-800 block">Day Only Interventional Procedure</strong>
              <span className="text-[10px] text-slate-400 mt-0.5 block leading-normal">
                Subject only to Guideline Page 12 interventional metrics (Section 3.1.2 list).
              </span>
            </div>
          </button>

          {/* Vulnerable Cohorts */}
          <button
            type="button"
            onClick={() => toggleCohort('isVulnerable')}
            className={`flex items-start text-left gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
              patient.isVulnerable 
                ? 'bg-blue-50/15 border-blue-250 shadow-3xs' 
                : 'bg-slate-50/40 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {patient.isVulnerable ? (
                <CheckSquare className="w-4 h-4 text-blue-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-800 block">Vulnerable Patients Group</strong>
              <span className="text-[10px] text-slate-400 mt-0.5 block leading-normal">
                High hazard, cognitive issue, or readmission risk. Suggests 4 custom relapse/preventative fields.
              </span>
            </div>
          </button>

          {/* Return to Correctional/Justice */}
          <button
            type="button"
            onClick={() => toggleCohort('isCorrectional')}
            className={`flex items-start text-left gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
              patient.isCorrectional 
                ? 'bg-blue-50/15 border-blue-250 shadow-3xs' 
                : 'bg-slate-50/40 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {patient.isCorrectional ? (
                <CheckSquare className="w-4 h-4 text-blue-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-800 block">Correctional Custody Discharge</strong>
              <span className="text-[10px] text-slate-400 mt-0.5 block leading-normal">
                Returning to Justice Health. Redact timings, secure documents in sealed envelopes.
              </span>
            </div>
          </button>

          {/* Additional Medicine Instructions */}
          <button
            type="button"
            onClick={() => toggleCohort('hasAdditionalMedicines')}
            className={`flex items-start text-left gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
              patient.hasAdditionalMedicines 
                ? 'bg-blue-50/15 border-blue-250 shadow-3xs' 
                : 'bg-slate-50/40 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {patient.hasAdditionalMedicines ? (
                <CheckSquare className="w-4 h-4 text-blue-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-800 block">Additional Medicine Instructions</strong>
              <span className="text-[10px] text-slate-400 mt-0.5 block leading-normal">
                Post-discharge dose plan adjustments, weaning schedules, and therapeutic drug monitoring.
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Success reassurance if everything is checked and nothing flag-alerted */}
      {blockingCount === 0 && adaptiveCount === 0 && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg p-3 text-xs flex items-center gap-2 font-medium mt-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>This patient is classified under standard inpatient discharge. No out-of-scope exceptions or special cohorts are active.</span>
        </div>
      )}
    </div>
  );
}
