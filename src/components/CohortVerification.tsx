/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Patient } from '../types';
import { ShieldAlert, AlertTriangle, AlertCircle, Bookmark, CheckSquare, Square, Info, ShieldCheck } from 'lucide-react';

interface CohortVerificationProps {
  patient: Patient;
  onUpdatePatient: (updated: Patient) => void;
}

export function CohortVerification({ patient, onUpdatePatient }: CohortVerificationProps) {
  const toggleCohort = (field: keyof Pick<Patient, 'isOutOfScope' | 'isDayOnly' | 'isWellBabyObstetric' | 'isVulnerable' | 'isCorrectional' | 'isMentalHealthDischargeNonMH' | 'hasAdditionalMedicines'>) => {
    onUpdatePatient({
      ...patient,
      [field]: !patient[field]
    });
  };

  const activeCount = [
    patient.isOutOfScope,
    patient.isDayOnly,
    patient.isWellBabyObstetric,
    patient.isVulnerable,
    patient.isCorrectional,
    patient.isMentalHealthDischargeNonMH,
    patient.hasAdditionalMedicines
  ].filter(Boolean).length;

  return (
    <div id="cohort-exceptions-verification" className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">Cohort exceptions & Special Discharges</h3>
          </div>
          <p className="text-xs text-slate-500">
            Select any special patient categories to review specific clinical safety requirements and required guideline redirections.
          </p>
        </div>
        {activeCount > 0 && (
          <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md font-bold uppercase animate-pulse">
            {activeCount} active warning{activeCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Cohort Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Callback 1: Out of scope */}
        <button
          type="button"
          onClick={() => toggleCohort('isOutOfScope')}
          className={`flex items-start text-left gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
            patient.isOutOfScope 
              ? 'bg-rose-50/40 border-rose-205 shadow-3xs' 
              : 'bg-slate-50/40 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {patient.isOutOfScope ? (
              <CheckSquare className="w-4 h-4 text-rose-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <div>
            <strong className="text-xs font-bold text-slate-800 block">Guideline Scope Exclusions</strong>
            <span className="text-[10px] text-slate-400 mt-0.5 block leading-normal">
              Mental health inpatients, emergency discharges, and outpatient clinics.
            </span>
          </div>
        </button>

        {/* Callback 2: Day Only */}
        <button
          type="button"
          onClick={() => toggleCohort('isDayOnly')}
          className={`flex items-start text-left gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
            patient.isDayOnly 
              ? 'bg-amber-50/30 border-amber-250 shadow-3xs' 
              : 'bg-slate-50/40 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {patient.isDayOnly ? (
              <CheckSquare className="w-4 h-4 text-amber-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <div>
            <strong className="text-xs font-bold text-slate-800 block">Day Only Patients</strong>
            <span className="text-[10px] text-slate-400 mt-0.5 block leading-normal">
              Exempt from standard full GL2022_005 inpatient discharge summary rules.
            </span>
          </div>
        </button>

        {/* Callback 3: Well-baby / Obstetric */}
        <button
          type="button"
          onClick={() => toggleCohort('isWellBabyObstetric')}
          className={`flex items-start text-left gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
            patient.isWellBabyObstetric 
              ? 'bg-amber-50/30 border-amber-250 shadow-3xs' 
              : 'bg-slate-50/40 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {patient.isWellBabyObstetric ? (
              <CheckSquare className="w-4 h-4 text-amber-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <div>
            <strong className="text-xs font-bold text-slate-800 block">Well-baby & Obstetric Patients</strong>
            <span className="text-[10px] text-slate-400 mt-0.5 block leading-normal">
              Exempt from standard full GL2022_005 inpatient summary templates.
            </span>
          </div>
        </button>

        {/* Callback 4: Vulnerable patients */}
        <button
          type="button"
          onClick={() => toggleCohort('isVulnerable')}
          className={`flex items-start text-left gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
            patient.isVulnerable 
              ? 'bg-amber-50/30 border-amber-250 shadow-3xs' 
              : 'bg-slate-50/40 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {patient.isVulnerable ? (
              <CheckSquare className="w-4 h-4 text-amber-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <div>
            <strong className="text-xs font-bold text-slate-800 block">Vulnerable Patients Group</strong>
            <span className="text-[10px] text-slate-400 mt-0.5 block leading-normal">
              Patients at extreme risk of rapid readmission, relapse, or cognitive challenges.
            </span>
          </div>
        </button>

        {/* Callback 5: Justice Health & Correctional Services */}
        <button
          type="button"
          onClick={() => toggleCohort('isCorrectional')}
          className={`flex items-start text-left gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
            patient.isCorrectional 
              ? 'bg-rose-50/40 border-rose-205 shadow-3xs' 
              : 'bg-slate-50/40 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {patient.isCorrectional ? (
              <CheckSquare className="w-4 h-4 text-rose-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <div>
            <strong className="text-xs font-bold text-slate-800 block">Justice Health & Correctional Services</strong>
            <span className="text-[10px] text-slate-400 mt-0.5 block leading-normal">
              Escorted patients returning to custody or correctional networks.
            </span>
          </div>
        </button>

        {/* Callback 6: Mental health from non-MH ward */}
        <button
          type="button"
          onClick={() => toggleCohort('isMentalHealthDischargeNonMH')}
          className={`flex items-start text-left gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
            patient.isMentalHealthDischargeNonMH 
              ? 'bg-amber-50/30 border-amber-250 shadow-3xs' 
              : 'bg-slate-50/40 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {patient.isMentalHealthDischargeNonMH ? (
              <CheckSquare className="w-4 h-4 text-amber-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <div>
            <strong className="text-xs font-bold text-slate-800 block">Mental Health Discharge from non-MH Ward</strong>
            <span className="text-[10px] text-slate-400 mt-0.5 block leading-normal">
              Active mental health consumers being discharged from a general physical/surgical ward.
            </span>
          </div>
        </button>

        {/* Callback 7: Additional medicine instructions post-discharge */}
        <button
          type="button"
          onClick={() => toggleCohort('hasAdditionalMedicines')}
          className={`flex items-start text-left gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
            patient.hasAdditionalMedicines 
              ? 'bg-amber-50/30 border-amber-250 shadow-3xs' 
              : 'bg-slate-50/40 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {patient.hasAdditionalMedicines ? (
              <CheckSquare className="w-4 h-4 text-amber-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <div>
            <strong className="text-xs font-bold text-slate-800 block">Additional Medicine Instructions</strong>
            <span className="text-[10px] text-slate-400 mt-0.5 block leading-normal">
              Ongoing medicine management instructions, dose administration aids, or opioid reductions.
            </span>
          </div>
        </button>
      </div>

      {/* Success reassurance if everything is checked and nothing flag-alerted */}
      {activeCount === 0 && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg p-3 text-xs flex items-center gap-2 font-medium mt-4">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>This patient is classified under standard inpatient discharge. No out-of-scope or correctional exceptions are active.</span>
        </div>
      )}
    </div>
  );
}
