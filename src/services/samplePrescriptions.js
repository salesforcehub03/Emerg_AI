/**
 * samplePrescriptions.js
 * Pre-loaded realistic clinical prescriptions:
 * 1. Lenskart / Ophthalmology Optical Power Rx
 * 2. General Physician Handwritten Prescription (URTI / Antibiotics)
 * 3. Cardiology & Diabetes Follow-up Prescription
 * 4. Pediatric Clinic Prescription
 */

// Helper to create high-resolution realistic prescription canvas images
function createPrescriptionImage({
  doctorName,
  clinicName,
  degrees,
  regNo,
  phone,
  address,
  date,
  patientName,
  ageGender,
  vitals,
  rxItems,
  adviceItems,
  checkboxItems,
  specialSection, // e.g. Optical table
  doctorNote
}) {
  const canvas = document.createElement('canvas');
  const width = 1000;
  const height = 1350;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Background - realistic prescription paper texture
  ctx.fillStyle = '#faf9f5';
  ctx.fillRect(0, 0, width, height);

  // Subtle paper grain / grid lines
  ctx.strokeStyle = 'rgba(210, 215, 225, 0.4)';
  ctx.lineWidth = 1;
  for (let y = 140; y < height - 120; y += 36) {
    ctx.beginPath();
    ctx.moveTo(60, y);
    ctx.lineTo(width - 60, y);
    ctx.stroke();
  }

  // Clinic Header Banner
  ctx.fillStyle = '#0f766e';
  ctx.fillRect(50, 40, width - 100, 6);

  // Doctor / Clinic Info
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
  ctx.fillText(clinicName, 60, 75);

  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
  ctx.fillText(doctorName, 60, 105);

  ctx.fillStyle = '#64748b';
  ctx.font = '14px "Segoe UI", Arial, sans-serif';
  ctx.fillText(`${degrees} | Reg: ${regNo}`, 60, 128);

  ctx.textAlign = 'right';
  ctx.fillText(address, width - 60, 85);
  ctx.fillText(`Ph: ${phone} | Date: ${date}`, width - 60, 108);
  ctx.textAlign = 'left';

  // Divider line
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(50, 142);
  ctx.lineTo(width - 50, 142);
  ctx.stroke();

  // Patient Info Bar
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 15px "Segoe UI", Arial, sans-serif';
  ctx.fillText(`Patient: `, 60, 172);
  ctx.font = '600 16px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#0284c7';
  ctx.fillText(patientName, 125, 172);

  ctx.fillStyle = '#334155';
  ctx.font = 'bold 15px "Segoe UI", Arial, sans-serif';
  ctx.fillText(`Age/Sex: `, 420, 172);
  ctx.font = '600 15px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#1e293b';
  ctx.fillText(ageGender, 490, 172);

  ctx.fillStyle = '#334155';
  ctx.font = 'bold 15px "Segoe UI", Arial, sans-serif';
  ctx.fillText(`Date: `, 720, 172);
  ctx.font = '15px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#1e293b';
  ctx.fillText(date, 765, 172);

  // Vitals Bar (if present)
  let currentY = 205;
  if (vitals && vitals.length > 0) {
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(55, currentY - 18, width - 110, 32);
    ctx.strokeStyle = '#e2e8f0';
    ctx.strokeRect(55, currentY - 18, width - 110, 32);

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 13px "Segoe UI", Arial, sans-serif';
    ctx.fillText('VITALS: ', 68, currentY + 3);

    ctx.font = '13px "Segoe UI", Arial, sans-serif';
    let vitalsX = 140;
    vitals.forEach((v) => {
      ctx.fillStyle = '#0f172a';
      ctx.fillText(v, vitalsX, currentY + 3);
      vitalsX += 170;
    });
    currentY += 45;
  }

  // Rx Symbol
  ctx.fillStyle = '#0f766e';
  ctx.font = 'italic bold 38px serif';
  ctx.fillText('℞', 65, currentY + 30);
  currentY += 40;

  // Optical Table (for Lenskart / Ophthalmology)
  if (specialSection && specialSection.type === 'optical') {
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 16px "Segoe UI", Arial, sans-serif';
    ctx.fillText('SPECTACLE PRESCRIPTION / REFRACTION DETAILS:', 65, currentY);
    currentY += 15;

    // Table Header
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(65, currentY, width - 130, 28);
    ctx.strokeStyle = '#0284c7';
    ctx.strokeRect(65, currentY, width - 130, 28);

    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 13px "Segoe UI", Arial, sans-serif';
    ctx.fillText('EYE', 85, currentY + 19);
    ctx.fillText('SPHERE (SPH)', 200, currentY + 19);
    ctx.fillText('CYLINDER (CYL)', 380, currentY + 19);
    ctx.fillText('AXIS', 560, currentY + 19);
    ctx.fillText('ADD (NEAR)', 700, currentY + 19);
    ctx.fillText('P.D. (mm)', 820, currentY + 19);
    currentY += 28;

    // Row 1: Right Eye (OD)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(65, currentY, width - 130, 36);
    ctx.strokeStyle = '#cbd5e1';
    ctx.strokeRect(65, currentY, width - 130, 36);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 14px "Segoe UI", Arial, sans-serif';
    ctx.fillText('OD (Right)', 85, currentY + 23);
    ctx.font = '15px "Courier New", monospace';
    ctx.fillText(specialSection.od.sph, 210, currentY + 23);
    ctx.fillText(specialSection.od.cyl, 390, currentY + 23);
    ctx.fillText(specialSection.od.axis, 570, currentY + 23);
    ctx.fillText(specialSection.od.add, 710, currentY + 23);
    ctx.fillText(specialSection.od.pd, 830, currentY + 23);
    currentY += 36;

    // Row 2: Left Eye (OS)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(65, currentY, width - 130, 36);
    ctx.strokeStyle = '#cbd5e1';
    ctx.strokeRect(65, currentY, width - 130, 36);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 14px "Segoe UI", Arial, sans-serif';
    ctx.fillText('OS (Left)', 85, currentY + 23);
    ctx.font = '15px "Courier New", monospace';
    ctx.fillText(specialSection.os.sph, 210, currentY + 23);
    ctx.fillText(specialSection.os.cyl, 390, currentY + 23);
    ctx.fillText(specialSection.os.axis, 570, currentY + 23);
    ctx.fillText(specialSection.os.add, 710, currentY + 23);
    ctx.fillText(specialSection.os.pd, 830, currentY + 23);
    currentY += 50;
  }

  // Medications Section
  if (rxItems && rxItems.length > 0) {
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 15px "Segoe UI", Arial, sans-serif';
    ctx.fillText('MEDICATIONS / TREATMENT PLAN:', 65, currentY);
    currentY += 28;

    rxItems.forEach((med, idx) => {
      // Medicine Name & Strength
      ctx.fillStyle = '#1e3a8a';
      ctx.font = 'bold 16px "Segoe UI", Arial, sans-serif';
      ctx.fillText(`${idx + 1}.  ${med.name}`, 80, currentY);

      // Dosage & Frequency (Doctor handwriting style)
      ctx.fillStyle = '#047857';
      ctx.font = 'bold 14px "Courier New", monospace';
      ctx.fillText(`[ ${med.frequency} ]`, 480, currentY);

      ctx.fillStyle = '#4b5563';
      ctx.font = '14px "Segoe UI", Arial, sans-serif';
      ctx.fillText(`Duration: ${med.duration}`, 640, currentY);
      ctx.fillText(`Qty: ${med.qty || '1 strip'}`, 810, currentY);

      currentY += 20;
      // Instructions / Timing
      ctx.fillStyle = '#6b7280';
      ctx.font = 'italic 13px "Segoe UI", Arial, sans-serif';
      ctx.fillText(`↳ ${med.instructions}`, 105, currentY);

      currentY += 34;
    });
  }

  currentY += 15;

  // Checkboxes & Clinical Advice
  if (checkboxItems && checkboxItems.length > 0) {
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 15px "Segoe UI", Arial, sans-serif';
    ctx.fillText('DIAGNOSTIC ADVICE & CHECKBOX RECOMMENDATIONS:', 65, currentY);
    currentY += 26;

    checkboxItems.forEach((cb) => {
      // Checkbox square
      ctx.strokeStyle = cb.checked ? '#0d9488' : '#94a3b8';
      ctx.lineWidth = 2;
      ctx.fillStyle = cb.checked ? '#ccfbf1' : '#ffffff';
      ctx.fillRect(80, currentY - 14, 18, 18);
      ctx.strokeRect(80, currentY - 14, 18, 18);

      if (cb.checked) {
        ctx.strokeStyle = '#0f766e';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(84, currentY - 5);
        ctx.lineTo(89, currentY);
        ctx.lineTo(95, currentY - 10);
        ctx.stroke();
      }

      ctx.fillStyle = cb.checked ? '#0f172a' : '#64748b';
      ctx.font = cb.checked ? '600 14px "Segoe UI", Arial, sans-serif' : '14px "Segoe UI", Arial, sans-serif';
      ctx.fillText(cb.label, 110, currentY);
      currentY += 30;
    });
  }

  // Doctor Handwritten Note / Signature Area
  currentY = Math.max(currentY + 20, height - 190);
  ctx.fillStyle = '#475569';
  ctx.font = 'italic 13px "Segoe UI", Arial, sans-serif';
  if (doctorNote) {
    ctx.fillText(`Special Notes: ${doctorNote}`, 65, currentY);
  }

  // Doctor Signature line & stamp
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width - 260, height - 100);
  ctx.lineTo(width - 60, height - 100);
  ctx.stroke();

  // Blue stamp ring
  ctx.save();
  ctx.translate(width - 160, height - 110);
  ctx.rotate(-0.06);
  ctx.strokeStyle = 'rgba(29, 78, 216, 0.65)';
  ctx.lineWidth = 2;
  ctx.strokeRect(-80, -25, 160, 50);
  ctx.fillStyle = 'rgba(29, 78, 216, 0.85)';
  ctx.font = 'bold 12px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CLINICALLY VERIFIED', 0, -5);
  ctx.font = '10px "Segoe UI", Arial, sans-serif';
  ctx.fillText(`MED REG: ${regNo}`, 0, 12);
  ctx.restore();

  // Footer disclaimer
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('This is a verified computer generated / clinical prescription record. Keep safely for your medical records.', width / 2, height - 25);

  return canvas.toDataURL('image/jpeg', 0.9);
}

export const SAMPLE_PRESCRIPTIONS = [
  {
    id: 'lenskart-optical',
    title: 'Lenskart / Optical Spectacle Rx',
    category: 'Ophthalmology',
    summary: 'Refraction optical power prescription with OD/OS sphere, cyl, axis, add, PD and lens coating checkboxes.',
    doctor: 'Dr. Neha Malhotra, M.S. (Ophthal)',
    clinic: 'Lenskart Vision Care & Eye Clinic',
    patient: 'Vikramaditya Sharma',
    ageGender: '29 Y / Male',
    date: '14-Sep-2026',
    tokenMetrics: {
      promptTokens: 382,
      outputTokens: 184,
      totalTokens: 566,
      estimatedCostUsd: 0.000085,
      latencyMs: 640,
      tokenSavingsPercent: 71.4
    },
    overallConfidence: 98.6,
    generateImage: () => createPrescriptionImage({
      clinicName: 'LENSKART VISION CARE & OPHTHALMIC CLINIC',
      doctorName: 'Dr. Neha Malhotra, M.S. (Ophth)',
      degrees: 'Senior Consultant Refractive Specialist',
      regNo: 'DMC-68421',
      phone: '+91 98110 44321',
      address: 'Indiranagar 100ft Road, Bengaluru',
      date: '14-Sep-2026',
      patientName: 'Vikramaditya Sharma',
      ageGender: '29 Y / Male',
      vitals: ['Dist VA: 6/6 (OU)', 'Near VA: N6', 'IOP: 15 mmHg OD / 16 mmHg OS'],
      specialSection: {
        type: 'optical',
        od: { sph: '-1.50', cyl: '-0.75', axis: '180°', add: '+0.00', pd: '32.0' },
        os: { sph: '-1.75', cyl: '-0.50', axis: '175°', add: '+0.00', pd: '31.5' }
      },
      rxItems: [
        {
          name: 'Systane Ultra Eye Drops (Lubricant)',
          frequency: '1 drop QID',
          duration: '30 days',
          qty: '1 vial (10ml)',
          instructions: 'Instill 1 drop in both eyes 4 times daily for digital eye strain'
        }
      ],
      checkboxItems: [
        { label: 'Blue-Cut Digital Protection Filter', checked: true },
        { label: 'Anti-Reflective Hydrophobic Coating (ARC)', checked: true },
        { label: 'High Index Thin Lens (1.60)', checked: true },
        { label: 'Progressive Lens Fitting Required', checked: false },
        { label: 'Annual Eye Checkup Review in 6 Months', checked: true }
      ],
      doctorNote: 'Recommended 20-20-20 rule for continuous screen use.'
    }),
    extractedData: {
      patientInfo: {
        patientName: { value: 'Vikramaditya Sharma', confidence: 99.4, bbox: [160, 120, 185, 380] },
        ageGender: { value: '29 Y / Male', confidence: 98.8, bbox: [160, 480, 185, 620] },
        date: { value: '14-Sep-2026', confidence: 99.8, bbox: [160, 750, 185, 880] },
        doctorName: { value: 'Dr. Neha Malhotra, M.S. (Ophth)', confidence: 99.2, bbox: [90, 60, 120, 400] },
        clinicName: { value: 'Lenskart Vision Care & Eye Clinic', confidence: 99.5, bbox: [60, 60, 85, 450] },
        regNo: { value: 'DMC-68421', confidence: 97.9, bbox: [120, 60, 138, 250] }
      },
      vitals: [
        { name: 'Distant Visual Acuity', value: '6/6 (OU)', confidence: 98.5 },
        { name: 'Near Visual Acuity', value: 'N6', confidence: 97.8 },
        { name: 'Intraocular Pressure (IOP)', value: '15 mmHg OD / 16 mmHg OS', confidence: 96.9 }
      ],
      opticalPower: {
        isOpticalRx: true,
        pupillaryDistanceTotal: '63.5 mm',
        od: { eye: 'Right Eye (OD)', sph: '-1.50', cyl: '-0.75', axis: '180°', add: '+0.00', pd: '32.0 mm', confidence: 99.1 },
        os: { eye: 'Left Eye (OS)', sph: '-1.75', cyl: '-0.50', axis: '175°', add: '+0.00', pd: '31.5 mm', confidence: 98.9 }
      },
      diagnosis: {
        primary: 'Myopic Astigmatism (Both Eyes) with Computer Vision Syndrome',
        confidence: 97.8
      },
      medications: [
        {
          id: 'med-1',
          name: 'Systane Ultra Eye Drops (Polyethylene Glycol 400)',
          form: 'Eye Drops',
          strength: '0.4% / 0.3%',
          frequency: 'QID (4 times/day)',
          schedule: '1 - 1 - 1 - 1',
          route: 'Ophthalmic (Both Eyes)',
          duration: '30 days',
          timing: 'As needed / After screen hours',
          instructions: 'Instill 1 drop in each eye 4 times daily for digital strain',
          confidence: 99.0
        }
      ],
      checkboxes: [
        { id: 'cb-1', label: 'Blue-Cut Digital Protection Filter', checked: true, confidence: 99.2 },
        { id: 'cb-2', label: 'Anti-Reflective Hydrophobic Coating (ARC)', checked: true, confidence: 98.9 },
        { id: 'cb-3', label: 'High Index Thin Lens (1.60)', checked: true, confidence: 98.5 },
        { id: 'cb-4', label: 'Progressive Lens Fitting Required', checked: false, confidence: 99.5 },
        { id: 'cb-5', label: 'Annual Eye Checkup Review in 6 Months', checked: true, confidence: 97.4 }
      ],
      doctorNotes: 'Follow 20-20-20 rule during continuous monitor work.'
    }
  },
  {
    id: 'general-physician',
    title: 'General Physician Clinical Rx',
    category: 'Internal Medicine',
    summary: 'Handwritten prescription for Acute Bronchitis & Pharyngitis with antibiotic, antacid, cough syrup, and follow-up checkboxes.',
    doctor: 'Dr. Arvinder Singh, MD (Medicine)',
    clinic: 'Apex Multispeciality Clinic',
    patient: 'Rajesh Kumar',
    ageGender: '42 Y / Male',
    date: '15-Sep-2026',
    tokenMetrics: {
      promptTokens: 410,
      outputTokens: 215,
      totalTokens: 625,
      estimatedCostUsd: 0.000094,
      latencyMs: 720,
      tokenSavingsPercent: 68.2
    },
    overallConfidence: 96.4,
    generateImage: () => createPrescriptionImage({
      clinicName: 'APEX MULTISPECIALITY HEALTH CLINIC',
      doctorName: 'Dr. Arvinder Singh, MD (Gen Med)',
      degrees: 'Consultant Physician & Diabetologist',
      regNo: 'MCI-31298',
      phone: '+91 94120 77654',
      address: 'Sector 18, Noida, NCR',
      date: '15-Sep-2026',
      patientName: 'Rajesh Kumar',
      ageGender: '42 Y / Male',
      vitals: ['BP: 126/82 mmHg', 'Pulse: 78 bpm', 'Temp: 99.4 °F', 'SpO2: 98% on room air'],
      rxItems: [
        {
          name: 'Tab. Augmentin (Amoxyclav) 625 mg',
          frequency: '1 - 0 - 1 (BD)',
          duration: '5 days',
          qty: '10 tablets',
          instructions: 'Take 1 tablet twice daily after meals (morning and evening)'
        },
        {
          name: 'Tab. Pantocid (Pantoprazole) 40 mg',
          frequency: '1 - 0 - 0 (OD)',
          duration: '7 days',
          qty: '7 tablets',
          instructions: 'Take 1 tablet in the morning empty stomach 30 mins before breakfast'
        },
        {
          name: 'Syr. Ascoril-D (Dextromethorphan/Chlorpheniramine)',
          frequency: '10 ml TDS',
          duration: '5 days',
          qty: '1 bottle (100ml)',
          instructions: '10 ml three times daily after food for dry irritating cough'
        },
        {
          name: 'Tab. Dolo 650 (Paracetamol) 650 mg',
          frequency: 'SOS (As needed)',
          duration: '3 days',
          qty: '6 tablets',
          instructions: 'Take 1 tablet only if fever > 100°F or severe body ache (max 3/day)'
        }
      ],
      checkboxItems: [
        { label: 'Chest X-Ray PA View (if cough persists > 5 days)', checked: true },
        { label: 'Complete Blood Count (CBC) with ESR', checked: true },
        { label: 'Warm Saline Gargles (3x daily) & Steam Inhalation', checked: true },
        { label: 'Strict Avoidance of Chilled & Oily Foods', checked: true },
        { label: 'Clinical Follow-up Review in 5 Days', checked: true }
      ],
      doctorNote: 'Maintain adequate hydration. Rest voice. Return immediately if breathlessness develops.'
    }),
    extractedData: {
      patientInfo: {
        patientName: { value: 'Rajesh Kumar', confidence: 99.1, bbox: [160, 120, 185, 360] },
        ageGender: { value: '42 Y / Male', confidence: 98.4, bbox: [160, 480, 185, 610] },
        date: { value: '15-Sep-2026', confidence: 99.6, bbox: [160, 750, 185, 870] },
        doctorName: { value: 'Dr. Arvinder Singh, MD (Gen Med)', confidence: 98.9, bbox: [90, 60, 120, 420] },
        clinicName: { value: 'Apex Multispeciality Health Clinic', confidence: 99.4, bbox: [60, 60, 85, 480] },
        regNo: { value: 'MCI-31298', confidence: 97.2, bbox: [120, 60, 138, 260] }
      },
      vitals: [
        { name: 'Blood Pressure', value: '126/82 mmHg', confidence: 98.7 },
        { name: 'Pulse Rate', value: '78 bpm', confidence: 98.1 },
        { name: 'Body Temperature', value: '99.4 °F', confidence: 97.5 },
        { name: 'Oxygen Saturation (SpO2)', value: '98% (Room Air)', confidence: 99.2 }
      ],
      diagnosis: {
        primary: 'Acute Upper Respiratory Tract Infection (URTI) with Tracheobronchitis',
        confidence: 95.8
      },
      medications: [
        {
          id: 'med-1',
          name: 'Tab. Augmentin 625 (Amoxicillin + Clavulanic Acid)',
          form: 'Tablet',
          strength: '625 mg (500mg/125mg)',
          frequency: 'BD (Twice daily)',
          schedule: '1 - 0 - 1',
          route: 'Oral',
          duration: '5 days',
          timing: 'Post Meal (After food)',
          instructions: 'Take 1 tablet every 12 hours after food; complete full 5-day course',
          confidence: 97.8
        },
        {
          id: 'med-2',
          name: 'Tab. Pantocid 40 (Pantoprazole Sodium)',
          form: 'Tablet',
          strength: '40 mg',
          frequency: 'OD (Once daily)',
          schedule: '1 - 0 - 0',
          route: 'Oral',
          duration: '7 days',
          timing: 'Ante Cibum (Empty stomach)',
          instructions: 'Take 1 tablet morning 30 minutes before breakfast',
          confidence: 98.4
        },
        {
          id: 'med-3',
          name: 'Syr. Ascoril-D (Dextromethorphan + Chlorpheniramine)',
          form: 'Syrup / Suspension',
          strength: '10mg / 4mg per 5ml',
          frequency: 'TDS (Thrice daily)',
          schedule: '1 - 1 - 1 (10ml)',
          route: 'Oral',
          duration: '5 days',
          timing: 'After food',
          instructions: 'Take 10ml thrice daily for cough relief; may cause mild drowsiness',
          confidence: 96.1
        },
        {
          id: 'med-4',
          name: 'Tab. Dolo 650 (Paracetamol)',
          form: 'Tablet',
          strength: '650 mg',
          frequency: 'SOS (As needed)',
          schedule: 'As needed',
          route: 'Oral',
          duration: '3 days',
          timing: 'After food',
          instructions: 'Take 1 tablet only if body temperature exceeds 100°F or body aches',
          confidence: 97.9
        }
      ],
      checkboxes: [
        { id: 'cb-1', label: 'Chest X-Ray PA View (if cough persists > 5 days)', checked: true, confidence: 97.0 },
        { id: 'cb-2', label: 'Complete Blood Count (CBC) with ESR', checked: true, confidence: 98.3 },
        { id: 'cb-3', label: 'Warm Saline Gargles (3x daily) & Steam Inhalation', checked: true, confidence: 98.9 },
        { id: 'cb-4', label: 'Strict Avoidance of Chilled & Oily Foods', checked: true, confidence: 96.5 },
        { id: 'cb-5', label: 'Clinical Follow-up Review in 5 Days', checked: true, confidence: 98.8 }
      ],
      doctorNotes: 'Maintain adequate hydration. Rest voice. Return immediately if breathlessness develops.'
    }
  },
  {
    id: 'cardiology-rx',
    title: 'Cardiology & Hypertension Review',
    category: 'Cardiology',
    summary: 'Long-term maintenance prescription for Stage 2 Essential Hypertension and Dyslipidemia with lifestyle checkboxes.',
    doctor: 'Dr. Priya Sundaram, DM (Cardiology)',
    clinic: 'Heart Care Center & Cath Lab',
    patient: 'Sarah Jenkins',
    ageGender: '58 Y / Female',
    date: '12-Sep-2026',
    tokenMetrics: {
      promptTokens: 425,
      outputTokens: 220,
      totalTokens: 645,
      estimatedCostUsd: 0.000097,
      latencyMs: 780,
      tokenSavingsPercent: 67.5
    },
    overallConfidence: 97.2,
    generateImage: () => createPrescriptionImage({
      clinicName: 'HEART CARE INSTITUTE & CARDIOLOGY CLINIC',
      doctorName: 'Dr. Priya Sundaram, MD, DM (Cardiology)',
      degrees: 'Senior Interventional Cardiologist',
      regNo: 'KMC-89214',
      phone: '+91 80 2554 9900',
      address: 'Koramangala 4th Block, Bengaluru',
      date: '12-Sep-2026',
      patientName: 'Sarah Jenkins',
      ageGender: '58 Y / Female',
      vitals: ['BP: 142/90 mmHg', 'Pulse: 74 bpm regular', 'BMI: 27.2 kg/m²', 'HbA1c: 6.8%'],
      rxItems: [
        {
          name: 'Tab. Telmisartan + Amlodipine (Telma-AM 40/5)',
          frequency: '1 - 0 - 0 (Morning OD)',
          duration: '30 days',
          qty: '30 tablets',
          instructions: 'Take 1 tablet every morning at 8:00 AM with water'
        },
        {
          name: 'Tab. Atorvastatin 20 mg (Atorva 20)',
          frequency: '0 - 0 - 1 (Night HS)',
          duration: '30 days',
          qty: '30 tablets',
          instructions: 'Take 1 tablet every night after dinner before bedtime'
        },
        {
          name: 'Tab. Ecosprin 75 mg (Enteric Coated Aspirin)',
          frequency: '0 - 1 - 0 (After Lunch)',
          duration: '30 days',
          qty: '30 tablets',
          instructions: 'Take 1 tablet strictly after a heavy meal to avoid stomach upset'
        }
      ],
      checkboxItems: [
        { label: 'Low Sodium DASH Diet (<2g salt/day)', checked: true },
        { label: '30 Minutes Daily Aerobic Walking / Physical Exercise', checked: true },
        { label: 'Daily Morning Blood Pressure Log Monitoring', checked: true },
        { label: 'Lipid Profile & Serum Creatinine in 3 Months', checked: true },
        { label: 'ECG & 2D Echo Review in 6 Months', checked: true }
      ],
      doctorNote: 'Target BP < 130/80 mmHg. Avoid NSAID pain relievers without cardiologist consult.'
    }),
    extractedData: {
      patientInfo: {
        patientName: { value: 'Sarah Jenkins', confidence: 99.5, bbox: [160, 120, 185, 340] },
        ageGender: { value: '58 Y / Female', confidence: 98.7, bbox: [160, 480, 185, 620] },
        date: { value: '12-Sep-2026', confidence: 99.8, bbox: [160, 750, 185, 870] },
        doctorName: { value: 'Dr. Priya Sundaram, MD, DM (Cardio)', confidence: 99.2, bbox: [90, 60, 120, 450] },
        clinicName: { value: 'Heart Care Institute & Cardiology Clinic', confidence: 99.6, bbox: [60, 60, 85, 490] },
        regNo: { value: 'KMC-89214', confidence: 98.1, bbox: [120, 60, 138, 260] }
      },
      vitals: [
        { name: 'Blood Pressure', value: '142/90 mmHg', confidence: 98.9 },
        { name: 'Pulse Rate', value: '74 bpm (Regular)', confidence: 98.2 },
        { name: 'Body Mass Index (BMI)', value: '27.2 kg/m²', confidence: 96.9 },
        { name: 'HbA1c', value: '6.8%', confidence: 97.4 }
      ],
      diagnosis: {
        primary: 'Primary Essential Hypertension (Stage 2) & Mixed Dyslipidemia',
        confidence: 98.2
      },
      medications: [
        {
          id: 'med-1',
          name: 'Tab. Telma-AM (Telmisartan 40mg + Amlodipine 5mg)',
          form: 'Tablet',
          strength: '40 mg / 5 mg',
          frequency: 'OD (Once daily morning)',
          schedule: '1 - 0 - 0',
          route: 'Oral',
          duration: '30 days',
          timing: 'Morning post breakfast',
          instructions: 'Take 1 tablet every morning at 8 AM consistently',
          confidence: 98.8
        },
        {
          id: 'med-2',
          name: 'Tab. Atorva 20 (Atorvastatin Calcium)',
          form: 'Tablet',
          strength: '20 mg',
          frequency: 'HS (Bedtime once daily)',
          schedule: '0 - 0 - 1',
          route: 'Oral',
          duration: '30 days',
          timing: 'Hora Somni (Night after dinner)',
          instructions: 'Take 1 tablet at night; aids lipid synthesis regulation',
          confidence: 98.5
        },
        {
          id: 'med-3',
          name: 'Tab. Ecosprin 75 (Enteric Coated Aspirin)',
          form: 'Tablet',
          strength: '75 mg',
          frequency: 'OD (Once daily noon)',
          schedule: '0 - 1 - 0',
          route: 'Oral',
          duration: '30 days',
          timing: 'Post Lunch',
          instructions: 'Take strictly after heavy meal with plenty of water',
          confidence: 97.6
        }
      ],
      checkboxes: [
        { id: 'cb-1', label: 'Low Sodium DASH Diet (<2g salt/day)', checked: true, confidence: 99.1 },
        { id: 'cb-2', label: '30 Minutes Daily Aerobic Walking / Physical Exercise', checked: true, confidence: 98.5 },
        { id: 'cb-3', label: 'Daily Morning Blood Pressure Log Monitoring', checked: true, confidence: 98.0 },
        { id: 'cb-4', label: 'Lipid Profile & Serum Creatinine in 3 Months', checked: true, confidence: 97.5 },
        { id: 'cb-5', label: 'ECG & 2D Echo Review in 6 Months', checked: true, confidence: 96.8 }
      ],
      doctorNotes: 'Target BP < 130/80 mmHg. Avoid NSAID pain relievers without cardiologist consult.'
    }
  },
  {
    id: 'pediatric-rx',
    title: 'Pediatric Care & Fever Rx',
    category: 'Pediatrics',
    summary: 'Pediatric prescription with weight-adjusted dosage syrups, fever schedule, hydration notes, and red-flag checkboxes.',
    doctor: 'Dr. Anita Deshmukh, DCH, DNB (Pediatrics)',
    clinic: 'Little Smiles Child Care Clinic',
    patient: 'Aarav Patel',
    ageGender: '4 Y / Male',
    date: '16-Sep-2026',
    tokenMetrics: {
      promptTokens: 395,
      outputTokens: 198,
      totalTokens: 593,
      estimatedCostUsd: 0.000089,
      latencyMs: 690,
      tokenSavingsPercent: 70.1
    },
    overallConfidence: 97.9,
    generateImage: () => createPrescriptionImage({
      clinicName: 'LITTLE SMILES PEDIATRIC & CHILD CLINIC',
      doctorName: 'Dr. Anita Deshmukh, DCH, DNB (Peds)',
      degrees: 'Senior Consultant Pediatrician & Neonatologist',
      regNo: 'MMC-54109',
      phone: '+91 22 2640 8822',
      address: 'Bandra West, Mumbai',
      date: '16-Sep-2026',
      patientName: 'Master Aarav Patel',
      ageGender: '4 Y / Male',
      vitals: ['Weight: 16.2 kg', 'Temp: 101.2 °F', 'HR: 108 bpm', 'Resp Rate: 24/min'],
      rxItems: [
        {
          name: 'Syr. Calpol 250 (Paracetamol 250mg / 5ml)',
          frequency: '5 ml SOS (Max 4 times/24 hrs)',
          duration: '3 days',
          qty: '1 bottle (60ml)',
          instructions: 'Give 5 ml strictly if body temp > 100°F; maintain 4-6 hours gap'
        },
        {
          name: 'Syr. Meftal-P (Mefenamic Acid 100mg / 5ml)',
          frequency: '4 ml SOS (High fever spike only)',
          duration: '3 days',
          qty: '1 bottle (60ml)',
          instructions: 'Give 4 ml only if temperature stays above 101.5°F after Calpol'
        },
        {
          name: 'Syr. Levolin (Levosalbutamol 0.63mg / 5ml)',
          frequency: '2.5 ml BD',
          duration: '4 days',
          qty: '1 bottle (60ml)',
          instructions: 'Give 2.5 ml twice daily for chest congestion and mild wheezing'
        }
      ],
      checkboxItems: [
        { label: 'Tepid Water Sponging on Forehead and Limbs for High Fever', checked: true },
        { label: 'Oral Rehydration Salts (ORS) Sips & Coconut Water', checked: true },
        { label: 'Strict Avoidance of Aspirin or Heavy Blankets during Fever', checked: true },
        { label: 'Vaccination Schedule Review: MMR Booster Due', checked: true },
        { label: 'Immediate Clinic Review if Persistent Vomiting or Rashes Appear', checked: true }
      ],
      doctorNote: 'Maintain loose cotton clothing during fever. Continue light home-cooked meals.'
    }),
    extractedData: {
      patientInfo: {
        patientName: { value: 'Master Aarav Patel', confidence: 99.7, bbox: [160, 120, 185, 360] },
        ageGender: { value: '4 Y / Male', confidence: 99.1, bbox: [160, 480, 185, 620] },
        date: { value: '16-Sep-2026', confidence: 99.9, bbox: [160, 750, 185, 870] },
        doctorName: { value: 'Dr. Anita Deshmukh, DCH, DNB (Peds)', confidence: 99.3, bbox: [90, 60, 120, 460] },
        clinicName: { value: 'Little Smiles Pediatric & Child Clinic', confidence: 99.6, bbox: [60, 60, 85, 490] },
        regNo: { value: 'MMC-54109', confidence: 98.4, bbox: [120, 60, 138, 250] }
      },
      vitals: [
        { name: 'Patient Weight', value: '16.2 kg', confidence: 99.4 },
        { name: 'Body Temperature', value: '101.2 °F', confidence: 98.8 },
        { name: 'Heart Rate', value: '108 bpm', confidence: 97.9 },
        { name: 'Respiratory Rate', value: '24 / min', confidence: 97.2 }
      ],
      diagnosis: {
        primary: 'Acute Viral Pyrexia with Mild Reactive Bronchospasm',
        confidence: 97.1
      },
      medications: [
        {
          id: 'med-1',
          name: 'Syr. Calpol 250 (Paracetamol 250mg/5ml)',
          form: 'Oral Suspension',
          strength: '250 mg per 5 ml',
          frequency: 'SOS (Every 6 hours if fever)',
          schedule: '5 ml SOS',
          route: 'Oral',
          duration: '3 days',
          timing: 'Post feed',
          instructions: 'Give 5 ml if temp > 100°F; maintain minimum 4-6 hours interval',
          confidence: 98.9
        },
        {
          id: 'med-2',
          name: 'Syr. Meftal-P (Mefenamic Acid 100mg/5ml)',
          form: 'Oral Suspension',
          strength: '100 mg per 5 ml',
          frequency: 'SOS (High fever >101.5°F)',
          schedule: '4 ml SOS',
          route: 'Oral',
          duration: '3 days',
          timing: 'After feed with water',
          instructions: 'Give 4 ml only if fever does not subside 2 hours post Calpol',
          confidence: 97.5
        },
        {
          id: 'med-3',
          name: 'Syr. Levolin (Levosalbutamol 0.63mg/5ml)',
          form: 'Syrup',
          strength: '0.63 mg per 5 ml',
          frequency: 'BD (Twice daily)',
          schedule: '2.5 ml BD',
          route: 'Oral',
          duration: '4 days',
          timing: 'Morning and Night',
          instructions: 'Give 2.5 ml twice daily for chest congestion and mild wheezing',
          confidence: 98.2
        }
      ],
      checkboxes: [
        { id: 'cb-1', label: 'Tepid Water Sponging on Forehead and Limbs for High Fever', checked: true, confidence: 99.4 },
        { id: 'cb-2', label: 'Oral Rehydration Salts (ORS) Sips & Coconut Water', checked: true, confidence: 98.9 },
        { id: 'cb-3', label: 'Strict Avoidance of Aspirin or Heavy Blankets during Fever', checked: true, confidence: 99.2 },
        { id: 'cb-4', label: 'Vaccination Schedule Review: MMR Booster Due', checked: true, confidence: 97.8 },
        { id: 'cb-5', label: 'Immediate Clinic Review if Persistent Vomiting or Rashes Appear', checked: true, confidence: 98.5 }
      ],
      doctorNotes: 'Maintain loose cotton clothing during fever. Continue light home-cooked meals.'
    }
  }
];
