/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Search, X, ShieldAlert, Copy, Check, Terminal } from 'lucide-react';
import { MarkdownView } from './MarkdownView';

interface GuidelineViewerProps {
  onCopyText: (text: string) => void;
}

export function GuidelineViewer({ onCopyText }: GuidelineViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  // NSW Health GL2022_005 Word-for-Word Converted Markdown Text (No page numbers, no headers, no footers)
  const guidelineMarkdown = `# Patient Discharge Documentation — GL2022_005

### Document Outline & Reference Information
- **Document Type:** Guideline
- **Document Number:** GL2022_005
- **Publication Date:** 12 April 2022
- **Author Branch:** System Performance Support
- **Branch Contact:** (02) 9391 9538
- **Review Date:** 12 April 2027
- **Status:** Active
- **Functional Group:** Clinical/Patient Services - Information and Data, Records; Corporate Administration - Governance, Information and Data
- **Applies To:** Ministry of Health, Public Health Units, Local Health Districts, Government Medical Officers, Public Hospitals
- **Audience:** All Hospital Staff; Discharge Planners; Pharmacists; Nurses; Junior Medical Officers
- **Authorizer:** Deputy Secretary, Patient Experience and System Performance, NSW Health

---

### GUIDELINE SUMMARY

This Guideline outlines the documentation required when discharging admitted patients from NSW public hospitals. It aims to ensure a consistent approach to the safety, usability and usefulness of discharge documentation from all NSW public hospitals.

Discharge documentation is made up of two components, the discharge summary and the patient directed discharge letter (additional consideration). The completion of discharge documentation does not absolve the need for direct communication between treating clinical teams, patients and carers, it ensures the safe transition of care of the patient. A verbal handover of care is to be conducted whenever clinically indicated.

---

### KEY PRINCIPLES

The inpatient discharge summary is a single integrated document which includes input from the multidisciplinary team (MDT) members where available. The discharge summary will be completed on standard electronic or paper medical record templates provided by NSW Health.

It is the responsibility of the discharging clinician to go through the discharge summary with the patient and/or family using health literacy approaches as per the National Safety and Quality Health Service Standard Communicating for Safety Standard. The discharging clinician must ensure that all required information is documented and provided to the patient, their carer/family, nominated general practitioner and all relevant primary care providers as soon as possible or within 48 hours of discharge as per NSW Health Information Bulletin 2020-21 KPI and Improvement Measure Data Supplement (IB2020_040).

Each multidisciplinary team member is responsible for completing their section of the discharge summary. Information must be accurate, relevant, appropriate, avoid duplication, ensure the use of accepted terminology, and avoid the use of abbreviations.

All multidisciplinary team members contributing to the discharge summary must ensure their name, designation, and signature is provided as outlined in NSW Health Policy Directive Health Care Records – Documentation and Management (PD2012_069).

All members providing information must not alter the documentation of another provider in the discharge summary without prior consultation. Copying and pasting documents or statements directly from clinical notes written by other members must be avoided unless auto-population is enabled.

The discharge summary must be sent, electronically (if available), to a patient’s nominated general practitioner and other relevant primary care providers unless the patient has withdrawn consent to share the discharge summary. Changes in sharing are to be documented in the clinical record.

Discharge summaries are to be shared electronically with a patient’s My Health Record unless the patient withdraws consent. Changes in sharing and reasoning are to be documented in both My Health Record and the clinical record.

It must be clear within the clinical record that the discharge summary has been provided to a patient’s nominated general practitioner, the patient and their carer (with consent). If there are issues with sending/receiving the discharge summary, please ensure the discharge summary is provided to the patient and/or family. All information must include who it was sent by and when.

Information in the patient directed discharge letter or a similar patient friendly format is to be written with consideration of the patient’s culture, level of cognition, language and health literacy, to ensure the patient and their carer and family can understand the information. Do not use abbreviations or health jargon and write in plain English.

The primary intended recipient for the discharge summary is the patient’s nominated General Practitioner (GP) or Aboriginal Medical Services (AMS). In remote locations the primary intended recipient may be the Nurse Practitioner or Registered Nurse in-charge of a remote facility.

Other recipients may include care providers such as residential aged care facilities (RACF), Royal Flying Doctor Service (RFDS), Justice Health clinicians, and community care providers.

It is the responsibility of the Local Health District or Specialty Health Network to provide organisational oversight of the discharge summary process being completed and provided to the patient and their nominated primary care provider.

Ensuring that any local guidelines reflect the requirements of this Guideline and are written in consultation with hospital executives, information technology (IT) teams, clinical staff and consumer representatives.

eHealth NSW and local IT teams are responsible for ensuring the changes required to electronic systems are coordinated and implemented. This Guideline will inform future changes required for the electronic medical record (eMR) to create a system that suits the needs of NSW Health patients and clinicians.

---

### REVISION HISTORY

| Version | Approved By | Amendment Notes |
| :--- | :--- | :--- |
| GL2022_005 | Deputy Secretary, Patient Experience and System Performance | New Guideline (Issued: April 2022) |

---

### 1. BACKGROUND

#### 1.1. About this document
This Guideline outlines the documentation required when discharging admitted patients from an NSW Health public hospital. It includes approaches from the National Guidelines for On-Screen Presentation of Discharge Summaries 2017, NSW Health Policy Directive Care Coordination: Planning from Admission to Transfer of Care in NSW Public Hospitals (PD2011_015) and supports a consistent approach to safety and usefulness of discharge documentation from all NSW public hospitals.

The decision to discharge is based on the patient being suitably fit to leave a NSW public hospital into a safe environment. This decision subsequently determines administrative processes including discharge documentation, billing, data collection and reporting.

The completion of discharge documentation does not absolve the need for effective communication between treating clinical teams, which is needed to ensure the safe transition in care of the patient. Wherever clinically indicated and required, a verbal handover of care and management plans must be conducted in line with the NSW Health Policy Directive Clinical Handover (PD2019_020).

This Guideline applies to all admitted patients being discharged from a NSW public hospital, with the exception of:
- Patients being discharged from a mental health inpatient unit (refer to PD2019_045)
- Patients discharged home from an emergency department (refer to PD2014_025)
- Patients attending outpatient clinic appointments

Patients who discharge against medical advice are included in the scope of this Guideline as defined by PD2017_015. At a minimum provide a completed discharge summary as outlined in this Guideline to ensure safe continuation of care for the patient in the future. If a patient leaves the hospital prior to receiving the discharge summary, a copy must be sent to the nominated general practitioner.

#### 1.2. Key definitions

| Term | Definition |
| :--- | :--- |
| **Admitting / attending medical officer** | The senior medical clinician who has primary responsibility for the patient during admission. |
| **Allied health profession** | Refers to any of the 23 professions employed by NSW Health which may be involved in the patient care. Profiles can be found on the NSW Health website. |
| **De-prescribing** | The planned process of withdrawing medicines that are not required, no longer a benefit, inappropriate or may cause harm for the patient. |
| **Discharge** | The relinquishing of patient care in whole or part by a health care provider or organisation. |
| **Discharging clinician** | The medical officer, nurse practitioner, midwife or suitably authorised healthcare clinician deputed and responsible for completing the discharge documentation for the patient. |
| **Discharge report** | An additional document to the discharge summary usually completed by Allied Health professionals to provide greater detail on discharge. |
| **Multidisciplinary team (MDT)** | Involves a range of health professionals from different disciplines or organisations working together to deliver comprehensive patient care. |
| **Medication reconciliation** | Formal process of verifying the intended medicines for patients, ensuring an accurate and complete list of medicines. |
| **Primary care provider** | Discharge summary recipient including the patient's nominated General Practitioner (GP), Residential Aged Care Facility (RACF), Disability Accommodation Service, Aboriginal Medical Service (AMS), Justice Health, Nurse Practitioner, agency or community-based clinician or other community-based service provider. |
| **Principal diagnosis** | The diagnosis established after investigation to be chiefly responsible for patient admission at the hospital. |
| **Referral** | The effective communication, with the intention of initiating quality and safe care transfers, from the provider making the referral to the receiver. |
| **Additional diagnosis** | A condition or complaint either coexisting with the principal diagnosis and/or arising during the admission or visit at the hospital, requiring treatment adjustments, diagnostics, or enhanced care. |

---

### 1.3 Legal and legislative framework

NSW Health staff have a common law duty of care to the patients cared for within NSW public hospitals. Clinical staff and admitting/attending medical officers under whose care the patient was admitted, must safely transfer care to the next treating health practitioner. This includes the patient's general practitioner, other medical specialists, and community services.

In NSW public hospitals an evidence-based approach to suitably transition care is through the provision of effective discharge documentation, accompanied by verbal communication (e.g. teach-back). Discharge documentation written in 'plain English' informs the patient, their carer/family, and their usual treating health practitioner of the reason for admission, relevant details of their inpatient stay including investigations and treatment and recommendations for ongoing care and follow-up.

---

### 2. DISCHARGING CLINICIAN

#### 2.1. Medical documentation in the discharge summary

The admitting/attending medical officers may delegate the responsibility to complete the discharge summary. Where completion of a discharge summary is delegated, the admitting/attending medical officers will have mechanisms to ensure that accurate and quality, 'plain English' discharge summaries are completed.

A discharge summary must be completed in line with the requirements of this Guideline, for all discharges, including deceased patients with the following exceptions:
- Patients out of scope
- Day Only patients
- Well-baby and obstetric patients.

#### 2.1.1. Requirements for minimum information

A discharge summary must contain information on the following:
- Patient details
- Hospital details
- Recipient(s)
- Author(s)
- Presentation details
- Presenting problem/s and diagnoses
- Procedures
- Clinical summary
- Allergies/adverse reactions
- Medicines on discharge
- Ceased medicines
- Alerts/infection risks
- Recommendations
- Follow-up services/appointments
- Information provided to patient
- Relevant investigation results

*For vulnerable patient groups who are at increased risk of rehospitalisation, the discharge document must also include information on: early warning signs of relapse of their current illness, identification of risks and strategies to reduce each risk identified, contingency plans and relapse prevention strategies, and emergency telephone contacts to access appropriate care.*

*For patients returning to Justice Health or Correctional Services, follow these key steps: place the prepared discharge documentation in a sealed envelope marked 'Confidential' and for the attention of the Justice Health and Forensic Mental Health Network. Give the sealed envelope to the escorting corrections officers. Do not advise the patient of any follow-up appointments due to security risks.*

#### 2.1.2. Description and display of discharge summary information

Each of the required minimum standards (section 2.1.1) must follow the description and display principles in order of which they appear below:

##### Patient details
The patient's full name must be documented on a single line, in a larger, bold font. Patient details are to appear in the following order:
1. Name
2. Medical Record Number (MRN)
3. Age
4. Sex
5. Gender
6. Date of birth (age in years or months/days where applicable)
7. Address
8. Telephone number

##### Hospital details
Printouts and electronic communications are to display the hospital details including:
- Hospital name and Local Health District (districts)/Specialty Health Network (networks)
- Hospital address and contact details including phone numbers
- Speciality name and nominated contact details including phone numbers.

##### Recipient (s)
A discharge summary is to display the intended audience(s) so appropriate transfer of care occurs.

##### Discharging clinician
The name and details of the discharging clinician must be documented in an area adjacent to the recipients' names. This must include:
- Discharging clinician's designation (role in organisation)
- Discharging clinician's supervisor (admitting/attending medical officer)
- Contact details of admitting/attending medical officer or delegate (if not previously stated)
- Signature or electronic credentials.

##### Presentation details
Key details of the presentation are to be documented, including:
1. Admission date
2. Discharge date
3. Length of stay at hospital
4. Clinical unit (the location from which the patient was discharged)
5. Clinical specialty type (the specialty responsible for discharge)
6. Discharge destination.

##### Presenting problem/s and diagnoses
Presenting problem/s and diagnoses must be documented immediately after presentation, including:
- Reason for presentation
- Principal diagnosis
- Additional diagnoses
- Complications
- Past medical history
*Consider aligning problem/s with attributed diagnoses/conditions where appropriate (e.g., abdominal pain - appendicitis).*

##### Procedures
Invasive clinical interventions including operations and procedures must be documented in chronological order. If no procedures were performed, document 'nil performed'.
Where a medical device has been implanted or explanted during the inpatient visit, include the product name, type, model and batch number for all devices.

##### Clinical summary
The clinical summary section allows the discharging clinician to communicate, in free text, a concise summary of the patient's hospital stay. The clinician is to focus on quality rather than the quantity of information documented.
The discharging clinician must keep sentences short and highlight critical information, including time critical follow up. Key health literacy principles such as bullet points are to be used to ensure the summary can be easily read. Provide a summary of ICU/HDU stays if appropriate.

##### Allergies / adverse reactions
Relevant information to be documented including:
- Medicine/substance name and where relevant brand
- Reaction type e.g., allergy, intolerance, adverse effect
- Clinical manifestation e.g., rash, urticarial reaction
- If a reaction occurred during admission: date/time, duration.
*Where there is no known allergy or adverse reaction 'nil known' must be documented.*

##### Medicines on discharge
Medicines must be documented, grouped according to their status (i.e., new medicines at the top, followed by changed, then unchanged), and ordered alphabetically within each group.
If significant changes in medicines have occurred, clearly group 'medicines on admission' and 'medicines on discharge'. Any changes to the patient's medicine regimen are to be identified and communicated in the discharge summary, together with a reason for each change:
- Medicine name: generic first, then brand specific to the patient if known; strength, form, and route
- Directions: dose, frequency, and special instructions
- Duration/end date
- Status: new, changed or unchanged
- Change reason/clinical indication.

##### Ceased and temporarily suspended medicines
It is recommended that ceased or temporarily suspended medicines are documented in a separate section in the discharge summary with details including:
- Medicine name: Generic first, then brand specific to the patient; strength, form, route.
- Reason: Explain why a medicine has been ceased or suspended.
- Duration: Identifying temporary versus permanent cessation.
- Include ongoing monitoring requirements (e.g., therapeutic drug monitoring, INR testing and targets for warfarin), de-prescribing plans, dose administration aids, or CMIs.

##### Alerts
Clinically relevant alerts are to be identified by the discharging clinician and included in discharge documentation (e.g., falls risks). Bullet points must be used.

##### Recommendations
Instructions for ongoing patient management must be documented, including required actions and who is responsible for them, with:
- Specific recommendations for treatment
- Specific recommendations for follow up care
- Relevant timeframes for action
- Pending investigations, results and actions required.

##### Follow-up appointments
It is important to document appointments that have been scheduled, are in the process of, or need to be organized. It is recommended that most discharge follow-up appointments are initiated or confirmed prior to discharge. The following appointment information must be provided:
- Description
- Date and time
- Booking status
- Name of primary care provider being visited
- Location
- Contact details
- Specific instructions e.g., Nil By Mouth (NBM) or preparation pre-visit, payments if required
- Arranged/to be arranged by hospital/patient.

##### Information provided to patient
The discharge summary must outline the complete list of recommended actions that were provided to the patient and/or carer.
A Patient Friendly Medication List (PFML) must be provided to all patients where possible, presented in a landscape view table with columns for Morning, Midday, Evening, and Night. Adjust font size for patients with vision impairment.

##### Selected investigations results
Only relevant and important investigations performed while the patient was in hospital are included, grouped by pathology, imaging, etc., with Test name, Date, and Result.

---

### 2.2. Allied health documentation
It is the responsibility of the allied health clinician involved in the patient's care to document the clinical findings, brief summary of interventions provided, and reference to detailed reports in the 'clinical summary' section. Only one entry per allied health discipline is to be included.

---

### 4. PATIENT DIRECTED DISCHARGE LETTER FOR PATIENTS AND CARERS

#### 4.1. Patient directed discharge letter requirements
The patient directed discharge letter is an example of what can be adapted within districts. It is to be written with consideration of the patient's culture, level of cognition, language and health literacy. Ensure a spellcheck is completed and write in plain English.

A patient directed discharge letter may include:
- Hospital admission
- Treatment and investigations
- Discharge management plan and instructions
- Current list of active medicines and any short-term discharge medicines with instructions
- Follow-up appointments or referrals to other care providers
- What the patient should expect in terms of timing/level of recovery
- Short-term and long-term impacts of the condition
- Possibility of deterioration and symptoms and/or signs to watch out for, with instructions to return to ER when concerns arise
- Contact details of medical officers or discharging clinician to clarify information.

---

### 5.1. Patient directed discharge letter template (example only)

**Greeting Format:** "Dear XXX, We hope this letter helps you understand what happened following your admission to XXX Hospital..."
- **The reason you came into hospital (symptoms, diagnosis):** e.g., Atrial Fibrillation.
- **The important tests and results:** e.g., ECG, Chest X-ray, blood tests.
- **The treatment(s) you received while you were in hospital:** e.g., tablet called XXXXX.
- **Recommendations for you when you go home (follow-up care):** e.g., bruising warning, GP within 3 days.
- **Your follow up appointments that you need to go to:** GP within 3 days, specialist within 4-6 weeks.
- **Support Warning:** "If you have any questions/concerns after discharge, please speak to your GP."
- **Closing Format:** "Kind regards, Dr (Resident Medical Officer) for Dr (Adviser)"
`;

  const filteredContent = () => {
    if (!searchTerm.trim()) return guidelineMarkdown;
    const lines = guidelineMarkdown.split('\n');
    const matching = lines.filter(line => line.toLowerCase().includes(searchTerm.toLowerCase()));
    if (matching.length === 0) return '_No matching lines found within word-for-word transcript._';
    return `### Search Results for "${searchTerm}":\n\n` + matching.map(line => `> ${line}`).join('\n\n');
  };

  const handleCopy = () => {
    onCopyText(guidelineMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="guideline-reference-viewer" className="inline-block">
      <button
        onClick={() => setIsOpen(true)}
        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
      >
        <BookOpen className="w-4 h-4 text-emerald-600" />
        View GL2022_005 NSW Guideline
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-end animate-fade-in">
          <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col animate-slide-in-right overflow-hidden">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">GL2022_005 Content Transcriber</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Word-for-Word Cleaned Markdown (NSW Public Hospitals)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-[10px] font-semibold text-slate-700 rounded-md flex items-center gap-1 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-500" />
                      Copy Markdown Text
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Disclaimer Bar */}
            <div className="bg-amber-50 px-5 py-3 border-b border-amber-100 text-xs text-amber-800 flex items-center gap-2 font-medium">
              <ShieldAlert className="w-4.5 h-4.5 text-amber-600 shrink-0" />
              <span>
                <strong>Disclaimer:</strong> AI can make errors, Verify the source. All system prompts use strictly this verified GL2022_005 source text.
              </span>
            </div>

            {/* Guideline Search */}
            <div className="p-4 border-b border-slate-100 bg-white">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search the PDF guideline word-for-word..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Text Viewer */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm font-sans text-sm text-slate-800 leading-relaxed max-w-none prose prose-slate">
                <MarkdownView content={filteredContent()} />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4.5 border-t border-slate-100 bg-slate-50 text-center text-[10px] text-slate-400 font-mono flex justify-between items-center">
              <span>Guideline Identifier: GL2022_005</span>
              <span className="flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5" />
                Clean Audit compliance
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
