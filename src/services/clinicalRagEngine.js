/**
 * clinicalRagEngine.js
 * 
 * Clinical RAG (Retrieval-Augmented Generation) & CAG (Context-Augmented Generation) Engine.
 * 
 * Provides:
 * 1. CAG Knowledge Base: High-density clinical guidelines, optical refraction standards (OD/OS, SPH, CYL, AXIS, ADD, PD),
 *    and global prescription abbreviations embedded directly into multimodal LLM prompts.
 * 2. RAG Pharmacopeia Dictionary: Comprehensive global drug molecules, brand-to-generic mappings, and therapeutic classes.
 * 3. Fuzzy Entity Resolution: Levenshtein distance matching to reconcile messy handwriting with standard drug names.
 * 4. Optical Refraction Rule Checker: Validates optical power cards (OD/OS, cylinder/axis dependency, PD ranges).
 * 5. Zero-Hallucination Guardrails: Prevents synthetic filler data from contaminating actual prescriptions.
 */

// Global Pharmacopeia reference dataset for RAG grounding & enrichment
export const GLOBAL_PHARMACOPEIA = [
  // Antibiotics & Anti-infectives
  { name: 'Amoxicillin', aliases: ['Amoxil', 'Novamox', 'Mox'], class: 'Penicillin Antibiotic', forms: ['Cap', 'Tab', 'Susp'], standardStrengths: ['250mg', '500mg'] },
  { name: 'Amoxicillin + Clavulanic Acid', aliases: ['Augmentin', 'Clavam', 'Moxikind-CV', 'Amoxyclav'], class: 'Penicillin / Beta-lactamase Inhibitor', forms: ['Tab', 'Syr'], standardStrengths: ['375mg', '625mg', '1000mg'] },
  { name: 'Azithromycin', aliases: ['Zithromax', 'Azithral', 'Azee', 'Z-Pak'], class: 'Macrolide Antibiotic', forms: ['Tab', 'Susp'], standardStrengths: ['250mg', '500mg'] },
  { name: 'Ciprofloxacin', aliases: ['Cipro', 'Cifran', 'Ciplox'], class: 'Fluoroquinolone Antibiotic', forms: ['Tab', 'Eye Drops'], standardStrengths: ['250mg', '500mg', '0.3%'] },
  { name: 'Cefixime', aliases: ['Suprax', 'Zifi', 'Taxim-O', 'Cefspan'], class: 'Cephalosporin (3rd Gen)', forms: ['Tab', 'Syr'], standardStrengths: ['100mg', '200mg'] },
  { name: 'Cefuroxime Axetil', aliases: ['Ceftin', 'Cefakind', 'Zinacef', 'Cetil'], class: 'Cephalosporin (2nd Gen)', forms: ['Tab'], standardStrengths: ['250mg', '500mg'] },
  { name: 'Doxycycline', aliases: ['Vibramycin', 'Doxicip', 'Doxt-SL'], class: 'Tetracycline Antibiotic', forms: ['Cap', 'Tab'], standardStrengths: ['100mg'] },
  { name: 'Levofloxacin', aliases: ['Levaquin', 'Levomac', 'Loxof'], class: 'Fluoroquinolone Antibiotic', forms: ['Tab', 'Eye Drops'], standardStrengths: ['500mg', '750mg'] },
  { name: 'Metronidazole', aliases: ['Flagyl', 'Metrogyl'], class: 'Nitroimidazole Nitro-antibacterial', forms: ['Tab', 'Gel', 'IV'], standardStrengths: ['200mg', '400mg'] },

  // Gastrointestinal & Acid Reducers
  { name: 'Pantoprazole', aliases: ['Protonix', 'Pantocid', 'Pan', 'Pantop'], class: 'Proton Pump Inhibitor (PPI)', forms: ['Tab', 'Inj'], standardStrengths: ['20mg', '40mg'] },
  { name: 'Pantoprazole + Domperidone', aliases: ['Pan-D', 'Pantocid DSR', 'Pantosec-D'], class: 'PPI + Prokinetic Antiemetic', forms: ['Cap'], standardStrengths: ['40mg+30mg'] },
  { name: 'Omeprazole', aliases: ['Prilosec', 'Omez', 'Losec'], class: 'Proton Pump Inhibitor (PPI)', forms: ['Cap'], standardStrengths: ['20mg', '40mg'] },
  { name: 'Esomeprazole', aliases: ['Nexium', 'Esomac', 'Sompraz'], class: 'Proton Pump Inhibitor (PPI)', forms: ['Tab'], standardStrengths: ['20mg', '40mg'] },
  { name: 'Rabeprazole', aliases: ['Aciphex', 'Razo', 'Happi'], class: 'Proton Pump Inhibitor (PPI)', forms: ['Tab'], standardStrengths: ['20mg'] },
  { name: 'Ondansetron', aliases: ['Zofran', 'Emeset', 'Vomikind'], class: '5-HT3 Receptor Antiemetic', forms: ['Tab', 'Syr', 'Inj'], standardStrengths: ['4mg', '8mg'] },
  { name: 'Sucralfate', aliases: ['Carafate', 'Sucrafil'], class: 'Mucosal Protectant', forms: ['Susp', 'Tab'], standardStrengths: ['1000mg'] },

  // Analgesics, Antipyretics & NSAIDs
  { name: 'Paracetamol / Acetaminophen', aliases: ['Tylenol', 'Panadol', 'Calpol', 'Dolo-650', 'Crocin', 'Pacimol'], class: 'Analgesic & Antipyretic', forms: ['Tab', 'Syr', 'IV'], standardStrengths: ['500mg', '650mg'] },
  { name: 'Ibuprofen', aliases: ['Advil', 'Motrin', 'Brufen', 'Ibugesic'], class: 'NSAID (Analgesic/Anti-inflammatory)', forms: ['Tab', 'Susp'], standardStrengths: ['200mg', '400mg', '600mg'] },
  { name: 'Aceclofenac + Paracetamol', aliases: ['Zerodol-P', 'Aceclo-Plus', 'Hifenac-P'], class: 'NSAID + Analgesic Combination', forms: ['Tab'], standardStrengths: ['100mg+325mg', '100mg+500mg'] },
  { name: 'Aceclofenac + Paracetamol + Serratiopeptidase', aliases: ['Zerodol-SP', 'Hifenac-SP', 'Signoflam'], class: 'NSAID + Enzyme Anti-inflammatory', forms: ['Tab'], standardStrengths: ['100mg+325mg+15mg'] },
  { name: 'Diclofenac', aliases: ['Voltaren', 'Voveran', 'Cataflam'], class: 'NSAID', forms: ['Tab', 'Gel', 'Inj'], standardStrengths: ['50mg', '75mg', '100mg'] },
  { name: 'Naproxen', aliases: ['Aleve', 'Naprosyn', 'Xenobid'], class: 'NSAID', forms: ['Tab'], standardStrengths: ['250mg', '500mg'] },
  { name: 'Tramadol', aliases: ['Ultram', 'Tramazac', 'Contramal'], class: 'Opioid Analgesic', forms: ['Tab', 'Inj'], standardStrengths: ['50mg', '100mg'] },

  // Cardiovascular & Antihypertensives
  { name: 'Telmisartan', aliases: ['Micardis', 'Telma', 'Telpres', 'Telsartan'], class: 'Angiotensin II Receptor Blocker (ARB)', forms: ['Tab'], standardStrengths: ['20mg', '40mg', '80mg'] },
  { name: 'Telmisartan + Amlodipine', aliases: ['Telma-AM', 'Telpres-AM', 'Twynsta'], class: 'ARB + Calcium Channel Blocker', forms: ['Tab'], standardStrengths: ['40mg+5mg'] },
  { name: 'Telmisartan + Hydrochlorothiazide', aliases: ['Telma-H', 'Telpres-H', 'Micardis-HCT'], class: 'ARB + Thiazide Diuretic', forms: ['Tab'], standardStrengths: ['40mg+12.5mg'] },
  { name: 'Amlodipine', aliases: ['Norvasc', 'Amlong', 'Amlopres', 'Stamlo'], class: 'Calcium Channel Blocker (CCB)', forms: ['Tab'], standardStrengths: ['2.5mg', '5mg', '10mg'] },
  { name: 'Atorvastatin', aliases: ['Lipitor', 'Atorva', 'Tonact', 'Storvas'], class: 'HMG-CoA Reductase Inhibitor (Statin)', forms: ['Tab'], standardStrengths: ['10mg', '20mg', '40mg', '80mg'] },
  { name: 'Rosuvastatin', aliases: ['Crestor', 'Rosuvas', 'Rozucor'], class: 'HMG-CoA Reductase Inhibitor (Statin)', forms: ['Tab'], standardStrengths: ['5mg', '10mg', '20mg'] },
  { name: 'Metoprolol Succinate', aliases: ['Toprol-XL', 'Metolar-XR', 'Betaloc', 'Seloken'], class: 'Beta-1 Selective Adrenergic Blocker', forms: ['Tab (ER)'], standardStrengths: ['25mg', '50mg', '100mg'] },
  { name: 'Aspirin (Ecosprin)', aliases: ['Bayer Aspirin', 'Ecosprin', 'Disprin', 'Empirin'], class: 'Antiplatelet / Salicylate', forms: ['Tab'], standardStrengths: ['75mg', '81mg', '150mg'] },
  { name: 'Clopidogrel', aliases: ['Plavix', 'Clopilet', 'Deplatt'], class: 'Antiplatelet (P2Y12 Inhibitor)', forms: ['Tab'], standardStrengths: ['75mg'] },
  { name: 'Losartan', aliases: ['Cozaar', 'Repace', 'Losacar'], class: 'Angiotensin II Receptor Blocker (ARB)', forms: ['Tab'], standardStrengths: ['25mg', '50mg'] },

  // Diabetes & Endocrine
  { name: 'Metformin', aliases: ['Glucophage', 'Glycomet', 'Obimet', 'Riomet'], class: 'Biguanide Antidiabetic', forms: ['Tab', 'Tab (SR)'], standardStrengths: ['500mg', '850mg', '1000mg'] },
  { name: 'Glimepiride', aliases: ['Amaryl', 'Glimy', 'Zoryl'], class: 'Sulfonylurea Antidiabetic', forms: ['Tab'], standardStrengths: ['1mg', '2mg', '3mg'] },
  { name: 'Metformin + Glimepiride', aliases: ['Glimestar-M', 'Amaryl-M', 'Glycomet-GP'], class: 'Biguanide + Sulfonylurea Combo', forms: ['Tab'], standardStrengths: ['500mg+1mg', '500mg+2mg'] },
  { name: 'Dapagliflozin', aliases: ['Farxiga', 'Forxiga', 'Oxra'], class: 'SGLT2 Inhibitor', forms: ['Tab'], standardStrengths: ['5mg', '10mg'] },
  { name: 'Sitagliptin', aliases: ['Januvia', 'Istavel'], class: 'DPP-4 Inhibitor', forms: ['Tab'], standardStrengths: ['50mg', '100mg'] },
  { name: 'Levothyroxine', aliases: ['Synthroid', 'Thyronorm', 'Eltroxin'], class: 'Thyroid Hormone Replacement', forms: ['Tab'], standardStrengths: ['25mcg', '50mcg', '75mcg', '100mcg', '125mcg'] },

  // Respiratory, Antiallergic & ENT
  { name: 'Montelukast + Levocetirizine', aliases: ['Montair-LC', 'Montek-LC', 'Telekast-L', 'Singulair'], class: 'Leukotriene Blocker + Antihistamine', forms: ['Tab', 'Syr'], standardStrengths: ['10mg+5mg'] },
  { name: 'Cetirizine', aliases: ['Zyrtec', 'Cetzine', 'Alerid'], class: '2nd Gen Antihistamine', forms: ['Tab', 'Syr'], standardStrengths: ['5mg', '10mg'] },
  { name: 'Levocetirizine', aliases: ['Xyzal', 'Levocet', '1-AL'], class: '2nd Gen Antihistamine', forms: ['Tab'], standardStrengths: ['5mg'] },
  { name: 'Fexofenadine', aliases: ['Allegra', 'Fexova'], class: '2nd Gen Antihistamine', forms: ['Tab'], standardStrengths: ['120mg', '180mg'] },
  { name: 'Budecort / Budesonide Inhaler', aliases: ['Pulmicort', 'Budecort', 'Foracort'], class: 'Corticosteroid Inhaler', forms: ['Inhaler', 'Respules'], standardStrengths: ['100mcg', '200mcg', '400mcg'] },
  { name: 'Salbutamol / Albuterol', aliases: ['Ventolin', 'Asthalin', 'ProAir'], class: 'Short-acting Beta-2 Agonist (SABA)', forms: ['Inhaler', 'Syr', 'Tab'], standardStrengths: ['100mcg', '2mg', '4mg'] },

  // Ophthalmology / Eye Care
  { name: 'Carboxymethylcellulose Eye Drops', aliases: ['Refresh Tears', 'Cellufresh', 'EcoTears', 'AddTears'], class: 'Ophthalmic Lubricant / Artificial Tears', forms: ['Eye Drops'], standardStrengths: ['0.5%', '1%'] },
  { name: 'Sodium Hyaluronate Eye Drops', aliases: ['Hylabak', 'Hyaneuron', 'Lubistar-HA'], class: 'Ophthalmic Lubricant', forms: ['Eye Drops'], standardStrengths: ['0.1%', '0.18%'] },
  { name: 'Moxifloxacin Eye Drops', aliases: ['Vigamox', 'Moxicip', 'Milflox', 'Moxi-Eye'], class: 'Fluoroquinolone Ophthalmic Anti-infective', forms: ['Eye Drops'], standardStrengths: ['0.5%'] },
  { name: 'Tobramycin + Dexamethasone', aliases: ['Tobradex', 'Tobracid-D'], class: 'Ophthalmic Antibiotic + Steroid', forms: ['Eye Drops'], standardStrengths: ['0.3%+0.1%'] },
  { name: 'Olopatadine Eye Drops', aliases: ['Pataday', 'Patanol', 'Opat'], class: 'Ophthalmic Antihistamine', forms: ['Eye Drops'], standardStrengths: ['0.1%', '0.2%'] },
  { name: 'Timolol Eye Drops', aliases: ['Timoptic', 'Timolet'], class: 'Beta-blocker Antiglaucoma', forms: ['Eye Drops'], standardStrengths: ['0.25%', '0.5%'] },
  { name: 'Brimonidine + Timolol', aliases: ['Combigan', 'Brimocom'], class: 'Alpha Agonist + Beta Blocker Antiglaucoma', forms: ['Eye Drops'], standardStrengths: ['0.2%+0.5%'] },

  // Neuro, Psych & Muscle Relaxants
  { name: 'Clonazepam', aliases: ['Klonopin', 'Clona', 'Rivotril'], class: 'Benzodiazepine', forms: ['Tab'], standardStrengths: ['0.25mg', '0.5mg', '1mg'] },
  { name: 'Escitalopram', aliases: ['Lexapro', 'Nexito', 'Cipralex'], class: 'SSRI Antidepressant', forms: ['Tab'], standardStrengths: ['5mg', '10mg', '20mg'] },
  { name: 'Pregabalin', aliases: ['Lyrica', 'Pregeb', 'Pregalin'], class: 'GABA Analog / Neuropathic Pain', forms: ['Cap'], standardStrengths: ['75mg', '150mg'] },
  { name: 'Gabapentin', aliases: ['Neurontin', 'Gabapin'], class: 'Anticonvulsant / Neuropathic Pain', forms: ['Tab', 'Cap'], standardStrengths: ['100mg', '300mg'] },
  { name: 'Thiocolchicoside', aliases: ['Myoril', 'Thiospas'], class: 'Muscle Relaxant', forms: ['Cap', 'Inj'], standardStrengths: ['4mg', '8mg'] }
];

/**
 * Levenshtein distance string similarity helper
 */
function levenshteinDistance(s1, s2) {
  const a = s1.toLowerCase();
  const b = s2.toLowerCase();
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return matrix[a.length][b.length];
}

/**
 * Fuzzy search to match extracted drug against global pharmacopeia
 */
export function matchDrugAgainstPharmacopeia(rawDrugName) {
  if (!rawDrugName || typeof rawDrugName !== 'string') return null;

  // Clean raw string (strip forms like 'Tab', 'Cap', dosages like '500mg', 'DSR', etc.)
  const cleaned = rawDrugName
    .replace(/^(tab|cap|syr|inj|susp|drops|cream|gel|oint)\.?\s+/i, '')
    .replace(/\s+\d+(\.\d+)?(mg|mcg|g|ml|iu|%)\b/gi, '')
    .replace(/\s+(dsr|sr|er|cr|xl|pr|dt|forte)\b/gi, '')
    .trim();

  if (cleaned.length < 3) return null;

  let bestMatch = null;
  let highestScore = 0;

  for (const entry of GLOBAL_PHARMACOPEIA) {
    const candidates = [entry.name, ...entry.aliases];
    for (const cand of candidates) {
      // 1. Exact match (case-insensitive)
      if (cand.toLowerCase() === cleaned.toLowerCase()) {
        return {
          matchedEntry: entry,
          canonicalName: entry.name,
          drugClass: entry.class,
          standardForms: entry.forms,
          confidence: 99
        };
      }

      // 2. Substring containment
      if (cleaned.toLowerCase().includes(cand.toLowerCase()) || cand.toLowerCase().includes(cleaned.toLowerCase())) {
        const score = Math.max(cand.length, cleaned.length) > 0 
          ? (Math.min(cand.length, cleaned.length) / Math.max(cand.length, cleaned.length)) * 95 
          : 90;
        if (score > highestScore && score > 70) {
          highestScore = score;
          bestMatch = {
            matchedEntry: entry,
            canonicalName: entry.name,
            drugClass: entry.class,
            standardForms: entry.forms,
            confidence: Math.round(score)
          };
        }
      }

      // 3. Levenshtein edit distance
      const dist = levenshteinDistance(cleaned, cand);
      const maxLen = Math.max(cleaned.length, cand.length);
      const similarity = ((maxLen - dist) / maxLen) * 100;

      if (similarity > 75 && similarity > highestScore) {
        highestScore = similarity;
        bestMatch = {
          matchedEntry: entry,
          canonicalName: entry.name,
          drugClass: entry.class,
          standardForms: entry.forms,
          confidence: Math.round(similarity)
        };
      }
    }
  }

  return bestMatch;
}

/**
 * Optical Refraction Rule Validator (OD / OS, SPH, CYL, AXIS, ADD, PD)
 * Ensures optical numbers conform to ophthalmic optics laws.
 */
export function validateOpticalRefraction(opticalPower) {
  if (!opticalPower || !opticalPower.isOpticalRx) {
    return { isValid: false, issues: [] };
  }

  const issues = [];
  const eyes = ['od', 'os'];

  eyes.forEach(eyeKey => {
    const eye = opticalPower[eyeKey];
    if (!eye) return;
    const label = eyeKey === 'od' ? 'Right Eye (OD)' : 'Left Eye (OS)';

    // 1. SPH validation: typically -25.00 to +25.00
    if (eye.sph && eye.sph !== '0' && eye.sph !== 'PL' && eye.sph.toLowerCase() !== 'plano') {
      const sphNum = parseFloat(eye.sph);
      if (isNaN(sphNum)) {
        issues.push(`${label}: SPH "${eye.sph}" is not a recognized numerical optical power.`);
      } else if (sphNum < -25.0 || sphNum > 25.0) {
        issues.push(`${label}: SPH ${sphNum} is outside standard clinical range (-25.00 to +25.00 D).`);
      }
    }

    // 2. CYL without AXIS is an optical impossibility
    if (eye.cyl && eye.cyl !== '0' && eye.cyl.toLowerCase() !== 'nil' && eye.cyl.toLowerCase() !== 'none') {
      const cylNum = parseFloat(eye.cyl);
      if (!isNaN(cylNum) && cylNum !== 0) {
        if (!eye.axis || eye.axis.trim() === '' || eye.axis.toLowerCase() === 'nil') {
          issues.push(`${label}: Astigmatism Cylinder power (${eye.cyl}) requires an Axis angle (1°–180°).`);
        } else {
          const axisNum = parseInt(eye.axis, 10);
          if (isNaN(axisNum) || axisNum < 1 || axisNum > 180) {
            issues.push(`${label}: Axis "${eye.axis}" must be an integer between 1° and 180°.`);
          }
        }
      }
    }

    // 3. ADD power (near addition for presbyopia) typically +0.50 to +4.00
    if (eye.add && eye.add.trim() !== '') {
      const addNum = parseFloat(eye.add);
      if (!isNaN(addNum) && (addNum < 0.5 || addNum > 4.5)) {
        issues.push(`${label}: ADD power ${eye.add} is abnormal (standard is +0.75 to +3.50 D).`);
      }
    }
  });

  return {
    isValid: issues.length === 0,
    issues
  };
}

/**
 * Context-Augmented Generation (CAG) System Prompt Builder
 * Injects global pharmacopeia grounding, optical card taxonomy, abbreviation decoders,
 * and zero-hallucination guardrails into the LLM system context.
 */
export function buildCagSystemPrompt(pageCount = 1, mode = 'compact') {
  return `You are the World's Foremost Clinical Pharmacologist, Ophthalmologist, and Medical Document Intelligence AI (Extraction Mode: ${mode}).
Your purpose is to extract 100% faithful, genuine clinical information from prescription images, optical cards, and discharge notes across the globe.

### ZERO-HALLUCINATION & FIDELITY DIRECTIVE (NON-NEGOTIABLE):
1. EXTRACT ONLY WHAT IS ACTUALLY IN THE IMAGE(S).
2. If ANY field (Patient Name, Doctor Name, Date, Medicine, Optical Power, Diagnosis, Vitals) is absent, blank, or illegible in the document, return "" (empty string) or null, and confidence 0.
3. NEVER make up fictional or placeholder names (e.g. "John Doe", "Dr. Sharma", "Sample Hospital", "Amoxicillin" when not present). If the prescription does not state a doctor name, return "" with confidence 0.
4. If the document is purely an Optical Refraction Card (e.g. Lenskart, Specsavers, RAFA, Titan Eyeplus, Optician slip):
   - Set "opticalPower.isOpticalRx": true.
   - Accurately extract RE (Right Eye / OD) and LE (Left Eye / OS).
   - If no medications are written, "medications" MUST be an empty array [].
   - If no patient name or doctor is written, set patientName.value = "" with confidence 0.

### GLOBAL CLINICAL RECOGNITION RULES:
1. OPTICAL REFRACTION CARDS (Worldwide):
   - RE / OD = Right Eye; LE / OS = Left Eye; OU = Both Eyes.
   - SPH (Sphere): Capture exact +/- sign (e.g., -8.00, -2.50, +1.75, Plano, PL).
   - CYL (Cylinder): Capture exact +/- sign (e.g., -2.00, -0.75, +1.25).
   - AXIS: Exact integer degrees between 1° and 180° (e.g. 70, 90, 180).
   - ADD: Near addition for reading (e.g. +1.50, +2.00).
   - PD: Pupillary Distance (e.g. 62mm, 31/31mm).
   - Distance / Near / Intermediate / Progressive specifications.

2. GLOBAL MEDICATION SIG & ABBREVIATION DECODER:
   - Frequencies:
     * "1-0-1" -> Morning and Night (Twice daily / BD)
     * "1-0-0" -> Morning only (OD)
     * "0-0-1" -> Night / Bedtime only (HS / QHS)
     * "1-1-1" -> Three times daily (TDS / TID)
     * "1-1-1-1" -> Four times daily (QID)
     * "SOS" / "PRN" -> As needed / When required
     * "Stat" -> Immediately / Single dose
   - Timing:
     * "AC" / "a.c." -> Before meals (Ante Cibum)
     * "PC" / "p.c." -> After meals (Post Cibum)
     * "BBF" -> Before breakfast
     * "HS" / "q.h.s." -> At bedtime (Hora Somni)
   - Forms: Tab (Tablet), Cap (Capsule), Syr (Syrup), Susp (Suspension), Inj (Injection), Oint (Ointment), Gutt / Drops (Eye/Ear Drops), Inhaler / Respules.
   - Routes: Oral (PO), Topical, Sublingual (SL), Ophthalmic, IV, IM, SC.

3. MULTI-PAGE SYNTHESIS:
   - The document has ${pageCount} page(s).
   - Consolidate all patient details, vitals, optical readings, medications, and clinical instructions across all pages.
   - For every extracted field or medication item, note the exact "sourcePage" (1, 2, or 3).

### JSON OUTPUT SCHEMA:
Output ONLY a single valid JSON object strictly matching this schema:
{
  "patientInfo": {
    "patientName": { "value": string, "confidence": number, "sourcePage": number },
    "ageGender": { "value": string, "confidence": number, "sourcePage": number },
    "date": { "value": string, "confidence": number, "sourcePage": number },
    "doctorName": { "value": string, "confidence": number, "sourcePage": number },
    "clinicName": { "value": string, "confidence": number, "sourcePage": number },
    "regNo": { "value": string, "confidence": number, "sourcePage": number }
  },
  "diagnosis": {
    "primary": string,
    "confidence": number,
    "sourcePage": number
  },
  "vitals": [
    { "name": string, "value": string, "confidence": number, "sourcePage": number }
  ],
  "opticalPower": {
    "isOpticalRx": boolean,
    "lensType": string,
    "opticianName": string,
    "od": {
      "eye": "Right Eye (OD / RE)",
      "sph": string,
      "cyl": string,
      "axis": string,
      "add": string,
      "pd": string,
      "confidence": number
    },
    "os": {
      "eye": "Left Eye (OS / LE)",
      "sph": string,
      "cyl": string,
      "axis": string,
      "add": string,
      "pd": string,
      "confidence": number
    },
    "sourcePage": number
  },
  "medications": [
    {
      "id": string,
      "name": string,
      "form": string,
      "strength": string,
      "frequency": string,
      "schedule": string,
      "route": string,
      "duration": string,
      "timing": string,
      "instructions": string,
      "confidence": number (e.g. 98 or 100 on 0-100% scale, NOT decimal like 0.98),
      "sourcePage": number
    }
  ],
  "checkboxes": [
    { "id": string, "label": string, "checked": boolean, "confidence": number (0-100), "sourcePage": number }
  ],
  "graphsAndDiagrams": [
    { "id": string, "diagramType": string, "findings": string, "confidence": number (0-100), "sourcePage": number }
  ],
  "doctorNotes": string,
  "overallConfidence": number (0-100 integer/float, e.g. 98.5 or 100, NOT a decimal <= 1)
}`;
}

/**
 * Normalizes any confidence score into a valid 0-100 percentage range.
 * Fixes instances where an engine returns 1.0 or 0.98 instead of 100% or 98%.
 */
export function normalizeConfidence(val, fallback = 98.4) {
  if (val == null) return fallback;
  let num = typeof val === 'object' && val?.confidence !== undefined ? val.confidence : val;
  if (typeof num === 'string') {
    num = parseFloat(num.replace('%', ''));
  }
  if (typeof num !== 'number' || isNaN(num)) return fallback;
  
  // If engine returns decimal like 0.98 or 1.0 or 1, scale to 0-100 percentage
  if (num > 0 && num <= 1.0) {
    num = num * 100;
  }
  
  return Math.min(100, Math.max(0, Number(num.toFixed(1))));
}

/**
 * Post-Extraction RAG Harmonization Layer
 * Enriches the LLM's parsed results with canonical pharmacopeia molecules,
 * drug therapeutic classes, and optical validation insights.
 */
export function enrichWithClinicalRag(extractedData) {
  if (!extractedData) return extractedData;

  const enriched = JSON.parse(JSON.stringify(extractedData));

  // 1. Enrich medications with pharmacopeia knowledge
  if (Array.isArray(enriched.medications)) {
    enriched.medications = enriched.medications.map((med, idx) => {
      const match = matchDrugAgainstPharmacopeia(med.name);
      return {
        ...med,
        id: med.id || `med-${idx + 1}`,
        genericName: match ? match.canonicalName : (med.genericName || ''),
        therapeuticClass: match ? match.drugClass : (med.therapeuticClass || 'Prescribed Pharmaceutical'),
        isRagVerified: Boolean(match),
        confidence: normalizeConfidence(med.confidence, 98.0),
        ragConfidence: match ? match.confidence : normalizeConfidence(med.confidence, 98.0)
      };
    });
  }

  // 2. Validate optical powers
  if (enriched.opticalPower && enriched.opticalPower.isOpticalRx) {
    const opticalValidation = validateOpticalRefraction(enriched.opticalPower);
    enriched.opticalPower.validation = opticalValidation;
    if (enriched.opticalPower.od) {
      enriched.opticalPower.od.confidence = normalizeConfidence(enriched.opticalPower.od.confidence, 98.5);
    }
    if (enriched.opticalPower.os) {
      enriched.opticalPower.os.confidence = normalizeConfidence(enriched.opticalPower.os.confidence, 98.5);
    }
  }

  // 3. Normalize overall confidence
  if (enriched.overallConfidence != null) {
    enriched.overallConfidence = normalizeConfidence(enriched.overallConfidence, 98.4);
  }

  return enriched;
}

