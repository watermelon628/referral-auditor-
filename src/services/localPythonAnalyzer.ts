import { loadPyodide, type PyodideInterface } from 'pyodide';

let pyodideInstance: PyodideInterface | null = null;
let isLoading = false;

export async function initPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (isLoading) {
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return pyodideInstance;
  }

  isLoading = true;
  try {
    console.log("Loading Pyodide...");
    pyodideInstance = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
    });
    console.log("Pyodide loaded successfully.");
    return pyodideInstance;
  } catch (error) {
    console.error("Failed to load Pyodide:", error);
    throw error;
  } finally {
    isLoading = false;
  }
}

export async function analyzeLocally(notes: string): Promise<string> {
  const pyodide = await initPyodide();
  if (!pyodide) throw new Error("Pyodide not initialized.");

  pyodide.globals.set("patient_notes", notes);

  const pythonScript = `
import re

notes = patient_notes.lower()
findings = []

findings.append("**Local Python Analysis Results**")

if re.search(r"\\b(follow.?up|review|opd|outpatients)\\b", notes):
    pass
else:
    findings.append("- ❌ Missing clear follow-up arrangements from local scan.")

if re.search(r"\\b(medication|medicine|prescribed|rx|started on|stopped|chart|dose)\\b", notes):
    pass
else:
    findings.append("- ❌ Missing medication continuation instructions.")

if re.search(r"\\b(diagnosis|dx|assessed as|presenting|complaint|pc|hpc)\\b", notes):
    pass
else:
    findings.append("- ❌ No clear presenting problem / diagnosis located.")

if len(findings) == 1:
    findings.append("- ✅ No obvious missing information from basic python rule scan.")

"\\n".join(findings)
`;

  const result = await pyodide.runPythonAsync(pythonScript);
  return result as string;
}
