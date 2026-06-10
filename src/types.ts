/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Patient {
  id: string;
  name: string;
  dob: string;
  gender: string;
  admissionDate: string;
  dischargeDate: string;
  manualNotes: string;
  uploadedDocName: string | null;
  uploadedDocType: string | null;
  cleanedMarkdown: string | null;
  clinicianSigned: boolean;
  clinicianSignatureName: string | null;
  signedAt: string | null;
  summary: string | null;
  missingInfoAnalysis: string | null;
  patientLetter: string | null;
  electronicLetter: string | null;
  aiInterpretationVerified?: boolean;
  isOutOfScope?: boolean;
  isDayOnly?: boolean;
  isWellBabyObstetric?: boolean;
  isVulnerable?: boolean;
  isCorrectional?: boolean;
  isMentalHealthDischargeNonMH?: boolean;
  hasAdditionalMedicines?: boolean;
  isFollowUpSecureHandoverChecked?: boolean;
  vulnerableWarningSigns?: string;
  vulnerableMitigation?: string;
  vulnerableContingency?: string;
  vulnerableContacts?: string;
  createdAt: string;
}

export interface ApiCleanDocResponse {
  cleanedMarkdown: string;
}

export interface ApiConsolidateResponse {
  summary: string;
  missingInfoAnalysis: string;
}

export interface ApiGenerateLettersResponse {
  patientLetter: string;
  electronicLetter: string;
}
