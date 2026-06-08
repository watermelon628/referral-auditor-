/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

// Ensure the Gemini API key is configured
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("Warning: GEMINI_API_KEY environment variable is not set. API calls will fail.");
}

const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload size limit to support file/image uploads encoded in base64
  app.use(express.json({ limit: '30mb' }));
  app.use(express.urlencoded({ limit: '30mb', extended: true }));

  // --- API Routes ---

  // API 1: Data Cleaner - Convert file into clean word-for-word Markdown text
  app.post('/api/clean-doc', async (req, res) => {
    try {
      const { content, fileName, fileType } = req.body;

      if (!content) {
        return res.status(400).json({ error: 'Missing document content' });
      }

      console.log(`Cleaning document: ${fileName} (${fileType})`);

      let response;
      const isImage = fileType.startsWith('image/');
      const isPdf = fileType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf');

      if (isImage || isPdf) {
        // Base64 image or PDF document
        const mappedMimeType = isPdf ? 'application/pdf' : fileType;
        const imagePart = {
          inlineData: {
            mimeType: mappedMimeType,
            data: content, // base64 representation without prefix
          },
        };
        const textPart = {
          text: "You are a professional medical record data cleaner and OCR transcriber. Transcribe the provided medical document (image or PDF) into clean Markdown text. You must transcribe it EXACTLY word-for-word from what is visible in the physical record. You must REMOVE all page numbers, headers, and footers. Ensure all tables, grids, or clinical measurements arrays are cleanly formatted as Markdown tables. Do NOT add any introduction, headers/footers, metadata lines, or outer block wrapping like (```markdown). Provide only the word-for-word cleaned text content.",
        };

        response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: { parts: [imagePart, textPart] },
        });
      } else {
        // Plain text content
        const prompt = `You are a professional medical record data cleaner. Clean up the medical document provided below.
Rules:
1. Re-format the entire document into clear Markdown text.
2. The transcript must be word-for-word matching the relevant clinical instructions and information.
3. REMOVE all repetitive headers, footers, and page numbers (e.g., 'Page 1 of 5', 'Page 2', running header notes, branding block titles, page dividers, 'NSW Health Guideline').
4. Ensure all tables, medications lists, or vitals are cleanly formatted as active Markdown tables (e.g., | Medication | Dose | Frequency |).
5. Do NOT include any conversation, introduction, comments, or conversational filler. Return ONLY the polished, clinical, word-for-word markdown transcription.

Here is the document content:
${content}`;

        response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
        });
      }

      const cleanedMarkdown = response.text || '';
      res.json({ cleanedMarkdown });
    } catch (error: any) {
      console.error('Error in /api/clean-doc:', error);
      res.status(500).json({ error: error.message || 'Failed to clean and process patient document.' });
    }
  });

  // API: Detect Demographics from raw patient notes/files
  app.post('/api/detect-demographics', async (req, res) => {
    try {
      const { manualNotes, cleanedMarkdown } = req.body;

      console.log(`Detecting demographics from uploaded/entered text`);

      const systemInstruction = `You are an expert clinical database analyst.
Your task is to analyze raw handwritten notes and/or medical records to identify patient demographic information.
Extract the patient name, date of birth (DOB), gender, admission date, and target discharge date.

If a field is not found, leave it as empty/blank, but make a best guess based on references (e.g. if age is mentioned, compute DOB or approximate; if gender is 'she/her', select 'Female').
Always return YYYY-MM-DD date formats where possible. Ensure Gender is strictly "Female", "Male", or "Other".`;

      const prompt = `Extract demographic details from these records:
--- MANUAL NOTES ---
${manualNotes || ''}

--- UPLOADED FILE ---
${cleanedMarkdown || ''}

Please extract:
1. Patient Name (Full)
2. Date of Birth (DOB) (in YYYY-MM-DD format)
3. Gender (exactly "Female", "Male", or "Other")
4. Admission Date (in YYYY-MM-DD format)
5. Target Discharge Date (in YYYY-MM-DD format)`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              dob: { type: Type.STRING },
              gender: { type: Type.STRING },
              admissionDate: { type: Type.STRING },
              dischargeDate: { type: Type.STRING }
            },
            required: ['name', 'dob', 'gender', 'admissionDate', 'dischargeDate']
          }
        }
      });

      const responseText = response.text || '{}';
      const parsedData = JSON.parse(responseText.trim());
      res.json(parsedData);
    } catch (error: any) {
      console.error('Error in /api/detect-demographics:', error);
      res.status(500).json({ error: error.message || 'Failed to detect patient demographics.' });
    }
  });

  // API 2: Consolidate & Analyze Notes (and check for missing elderly discharge information against GL2022_005)
  app.post('/api/consolidate-notes', async (req, res) => {
    try {
      const { manualNotes, cleanedMarkdown, name, dob } = req.body;

      console.log(`Consolidating data for patient: ${name}`);

      const systemInstruction = `You are an expert clinical compliance auditor helping clinicians check written referral or discharge letters in accordance with NSW Health Guideline GL2022_005 standards.
Your goal is to parse and evaluate the provided clinical letter (either submitted as manual text or parsed via OCR scan) to see where it fails to fulfill standard minimum discharge or referral details.
You must construct a clinical summary of the details that ARE represented, and compile a rigorous bulleted checklist of any missing minimum information elements.

CRITICAL FORMATTING GUIDELINES:
- For the "summary" property, write a professional evaluation detailing the clinical course, diagnoses, medications, and recommendations represented in the provided draft. Organize this into clean, scannable dot points under clear markdown section headers. CITE where in GL2022_005 each field is outlined (e.g. "[source: Guideline GL2022_005 Page 7, Section 2.1.2]"). Do NOT use generic banners or decorative separators.
- For the "missingInfoAnalysis" property, you must assemble a clear audit checklist of specifically what clinical parameters are completely omitted, unmentioned, or missing from the letter. Organize by category. Each entry MUST be listed extremely simply and directly, specifying ONLY the raw missing fields or topics (e.g., "MRN, Age, Sex, Gender, Address, and Telephone number"), with no verbose intro phrases, no conversational sentences, and no narrative fluff. Just list exactly what is missing. All direct source page/section citations should be appended in bracket style at the very end.

NSW Health Guideline GL2022_005 Minimum Information Specifications (use to audit):
1. Patient Details: Name on a single bold line, MRN, Age, Sex, Gender, DOB, Address, Telephone.
2. Hospital/Clinician Details: Hospital name/address, specialty, discharging clinician designation, supervisor/admitting supervisor, signature or electronic credentials.
3. Presentation Details: Admission/discharge dates, length of stay, clinical unit, clinical specialty, discharge destination.
4. Problem/s: Reason for presentation, principal diagnosis, additional diagnoses, complications, past medical history.
5. Procedures: Chronological invasive clinical interventions or 'nil performed'. Implanted/explanted medical device product name, type, model, batch number.
6. Clinical Summary: Concise summary of hospital stay using short sentences, bullet points. ICU/HDU summary if appropriate.
7. Allergies/Adverse Reactions: Medicine name/brand, reaction type, clinical manifestations, date/duration. 'Nil known' must be documented if none.
8. Medicines on Discharge: Grouped strictly as: 'New' at top, followed by 'Changed', followed by 'Unchanged'. Ordered alphabetically.
9. Medicines directions & Ceased medicines: Generic first, then brand; strength, form, route; dosage, frequency; duration. Ceased medicines detailed with reason and duration. Ongoing monitoring requirements, de-prescribing plans, dose administration aids.
10. Alerts: Critical/Falls alerts as bullet points. Specific treatment and care recommendations with action ownership and timeframes.
11. Follow-up Appointments: Description, date/time, booking status, primary care provider, location, contact, preparation instructions.

Format your output as a JSON object with:
1. "summary": A professional clinical summary of findings represented in the letter, formatted using clean markdown with guideline citations.
2. "missingInfoAnalysis": A comprehensive structured bulleted audit listing ONLY the clinical or logistical elements that are completely unmentioned or missing in the provided letter, with precise source page/section citations.`;;

      const prompt = `Perform a compliance safety audit on the following clinical letter text:
Patient Demographics Context:
Name: ${name}
DOB: ${dob}

--- PROVIDED LETTER TEXT (MANUAL NOTES OR UPLOADED SCAN) ---
Raw Manual Entries:
${manualNotes || 'No manual notes.'}

Parsed Document Scan Content:
${cleanedMarkdown || 'No scan contents.'}

Perform the following tasks:
1. Extract and summarize the clinical details and instructions already represented in this text under coherent headers in the "summary" string, citing GL2022_005 reference locations.
2. Cross-reference the draft against all minimum information requirements in Guideline GL2022_005. Pinpoint exactly what is missing or omitted from the provided text, and return a structured checklist of gap alerts in the "missingInfoAnalysis" string with exact page and section citations.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: 'Polished markdown summary of clinical findings and elements represented in the draft, with GL2022_005 section citations.',
              },
              missingInfoAnalysis: {
                type: Type.STRING,
                description: 'Extremely simple, high-priority bulleted list of raw missing parameters or information elements (e.g. list of "(MRN), Age, Sex, Gender, Address, Telephone number"), with zero narrative, zero conversational commentary, and direct citation brackets at the end.',
              },
            },
            required: ['summary', 'missingInfoAnalysis'],
          },
        },
      });

      const responseText = response.text || '{}';
      const parsedData = JSON.parse(responseText.trim());
      res.json(parsedData);
    } catch (error: any) {
      console.error('Error in /api/consolidate-notes:', error);
      res.status(500).json({ error: error.message || 'Failed to consolidate information and check missing info.' });
    }
  });



  // --- Vite & Production static servers ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
