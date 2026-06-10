export const isGeminiConfigured = () => true;

export async function detectDemographics(manualNotes: string, cleanedMarkdown: string) {
  try {
    const response = await fetch('/api/detect-demographics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ manualNotes, cleanedMarkdown })
    });
    return await response.json();
  } catch (error: any) {
    console.error('Network Error:', error);
    return { name: "Unknown", dob: "Unspecified", gender: "Other", admissionDate: "", dischargeDate: "", isQuotaError: true, serverErrorDetails: error.message };
  }
}

export async function consolidateNotes(
  name: string,
  dob: string,
  manualNotes: string,
  cleanedMarkdown: string,
  isVulnerable?: boolean,
  isOutOfScope?: boolean,
  isDayOnly?: boolean,
  isWellBabyObstetric?: boolean,
  isCorrectional?: boolean,
  isMentalHealthDischargeNonMH?: boolean,
  hasAdditionalMedicines?: boolean
) {
  try {
    const response = await fetch('/api/consolidate-notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        dob,
        manualNotes,
        cleanedMarkdown,
        isVulnerable,
        isOutOfScope,
        isDayOnly,
        isWellBabyObstetric,
        isCorrectional,
        isMentalHealthDischargeNonMH,
        hasAdditionalMedicines
      })
    });
    return await response.json();
  } catch (error: any) {
    console.error('Network Error:', error);
    return { summary: "Error generating summary.", missingInfoAnalysis: "Error analyzing notes.", isQuotaError: true, serverErrorDetails: error.message };
  }
}

export async function generateLetters(name: string, dob: string, gender: string, summary: string, manualNotes: string, cleanedMarkdown: string) {
  try {
    const response = await fetch('/api/generate-letters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, dob, gender, summary, manualNotes, cleanedMarkdown })
    });
    return await response.json();
  } catch (error: any) {
    console.error('Network Error:', error);
    return { patientLetter: "Error generating letter.", electronicLetter: "Error generating letter.", isQuotaError: true, serverErrorDetails: error.message };
  }
}

export async function cleanDocument(content: string, fileName: string, fileType: string) {
  try {
    const response = await fetch('/api/clean-doc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, fileName, fileType })
    });
    return await response.json();
  } catch (error: any) {
    console.error('Network Error:', error);
    return { cleanedMarkdown: "Error cleaning document.", isQuotaError: true, serverErrorDetails: error.message };
  }
}
