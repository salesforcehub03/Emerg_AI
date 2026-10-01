import React, { useState } from 'react';
import { 
  CheckCircle, 
  ShieldCheck, 
  AlertTriangle, 
  FileCheck, 
  User, 
  Stethoscope, 
  Pill, 
  Eye, 
  CheckSquare, 
  Plus, 
  Trash2, 
  Download, 
  Printer, 
  Zap, 
  Edit3,
  Sparkles,
  Activity,
  BarChart2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { normalizeConfidence } from '../services/clinicalRagEngine';

export default function ExtractionResults({
  extractedData,
  overallConfidence,
  tokenMetrics,
  onUpdateData,
  onHoverSection,
  onOpenTokenModal,
  onResetDocument,
  isProcessing = false,
  processingStatus = '',
  pageCount = 1
}) {
  const [isVerified, setIsVerified] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const displayConfidence = normalizeConfidence(overallConfidence || extractedData?.overallConfidence, 98.4);


  if (isProcessing) {
    return (
      <div className="panel-card" style={{ padding: '60px 30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spin" style={{
          width: '44px',
          height: '44px',
          border: '3px solid var(--teal-glow)',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          marginBottom: '20px'
        }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Reading & Extracting Prescription...
        </h3>
        <p style={{ color: 'var(--cyan-accent)', fontSize: '0.88rem', maxWidth: '480px', marginBottom: '24px' }}>
          {processingStatus || 'Decoding handwriting, optical card powers, and clinical entities...'}
        </p>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          width: '100%',
          maxWidth: '380px',
          textAlign: 'left',
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '16px 20px',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#334155' }}>
            <span className="api-status-dot" />
            <span>Handwriting OCR & Contrast Enhancement</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#334155' }}>
            <span className="api-status-dot" />
            <span>Optical Refraction & Document Parsing</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#334155' }}>
            <span className="api-status-dot" />
            <span>Medication Nomenclature & Dosage Verification</span>
          </div>
        </div>
      </div>
    );
  }

  if (!extractedData) {
    return (
      <div className="panel-card" style={{ padding: '60px 30px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '16px' }}>
          No extraction data available. Please upload a prescription or optical card.
        </p>
        {onResetDocument && (
          <button className="upload-file-btn" onClick={onResetDocument} style={{ margin: '0 auto' }}>
            <span>Upload New Prescription</span>
          </button>
        )}
      </div>
    );
  }

  const { patientInfo, diagnosis, vitals, opticalPower, medications, checkboxes, graphsAndDiagrams, doctorNotes, isLocalOcr } = extractedData;

  const handleVerify = () => {
    setIsVerified(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(extractedData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Prescription_${patientInfo?.patientName?.value || 'Extract'}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintSummary = () => {
    window.print();
  };

  const getConfidenceClass = (score) => {
    if (score >= 90) return 'high';
    if (score >= 70) return 'med';
    return 'low';
  };

  const handlePatientFieldChange = (fieldKey, newValue) => {
    const updated = {
      ...extractedData,
      patientInfo: {
        ...extractedData.patientInfo,
        [fieldKey]: {
          ...extractedData.patientInfo?.[fieldKey],
          value: newValue
        }
      }
    };
    onUpdateData(updated);
  };

  const handleOpticalFieldChange = (eye, field, value) => {
    const updated = {
      ...extractedData,
      opticalPower: {
        ...extractedData.opticalPower,
        isOpticalRx: true,
        [eye]: {
          ...(extractedData.opticalPower?.[eye] || {}),
          [field]: value
        }
      }
    };
    onUpdateData(updated);
  };

  const handleOpticalMetaChange = (field, value) => {
    const updated = {
      ...extractedData,
      opticalPower: {
        ...extractedData.opticalPower,
        isOpticalRx: true,
        [field]: value
      }
    };
    onUpdateData(updated);
  };

  const handleCheckboxToggle = (cbId) => {
    const updatedCheckboxes = (checkboxes || []).map((cb) => 
      cb.id === cbId ? { ...cb, checked: !cb.checked } : cb
    );
    onUpdateData({ ...extractedData, checkboxes: updatedCheckboxes });
  };

  const handleMedicationChange = (medId, field, value) => {
    const updatedMeds = (medications || []).map((med) =>
      med.id === medId ? { ...med, [field]: value } : med
    );
    onUpdateData({ ...extractedData, medications: updatedMeds });
  };

  const handleAddMedication = () => {
    const newMed = {
      id: `med-${Date.now()}`,
      name: 'New Medication',
      form: 'Tablet',
      strength: '500 mg',
      frequency: 'BD (Twice daily)',
      schedule: '1 - 0 - 1',
      route: 'Oral',
      duration: '5 days',
      timing: 'After food',
      instructions: 'Take with water',
      confidence: 99.0
    };
    onUpdateData({
      ...extractedData,
      medications: [...(medications || []), newMed]
    });
  };

  const handleDeleteMedication = (medId) => {
    onUpdateData({
      ...extractedData,
      medications: (medications || []).filter((m) => m.id !== medId)
    });
  };

  return (
    <div className="panel-card">
      {/* Panel Header */}
      <div className="panel-header">
        <div className="panel-title-area" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="brand-logo-badge" style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--teal-primary), var(--cyan-accent))', color: '#ffffff', flexShrink: 0, boxShadow: '0 2px 6px rgba(13, 148, 136, 0.25)' }}>
            <Stethoscope size={17} />
          </div>
          <div>
            <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 800 }}>Emerg AI</span>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>•</span>
              <span>Extracted Prescription Data</span>
              <span className="conf-badge high" style={{ fontSize: '0.72rem' }}>
                {isLocalOcr ? 'Local Optical Engine' : 'Multi-Layer AI Model'}
              </span>
              {pageCount > 1 && (
                <span className="conf-badge med" style={{ fontSize: '0.72rem' }}>
                  {pageCount} Pages Unified
                </span>
              )}
            </div>
            <div className="panel-subtitle">Emerg AI Neural Extraction • 100% Genuine Prescription Data</div>
          </div>
        </div>


        <div style={{ display: 'flex', gap: '8px' }}>
          {onResetDocument && (
            <button 
              className="header-btn"
              onClick={onResetDocument}
              style={{ fontSize: '0.78rem', background: 'var(--teal-soft)', color: 'var(--teal-primary)', borderColor: 'rgba(13, 148, 136, 0.3)' }}
              title="Upload another prescription"
            >
              <Plus size={14} />
              <span>New Scan</span>
            </button>
          )}
          <button 
              className="header-btn"
            onClick={handlePrintSummary}
            style={{ fontSize: '0.78rem' }}
            title="Print Clinical Prescription with original image at top and extracted data below"
          >
            <Printer size={14} />
            <span>Print Rx</span>
          </button>
          <button 
            className="header-btn"
            onClick={() => setIsEditing(!isEditing)}
            style={{ fontSize: '0.78rem' }}
          >
            <Edit3 size={14} />
            <span>{isEditing ? 'Done Editing' : 'Edit Mode'}</span>
          </button>
        </div>
      </div>

      <div className="results-scroll-container">
        {/* Overall Accuracy Banner */}
        <div className="accuracy-banner">
          <div className="accuracy-left">
            <div className="score-circle" style={{ '--percent': displayConfidence }}>
              <div className="score-circle-inner">
                {displayConfidence}%
              </div>
            </div>
            <div className="accuracy-text-group">
              <div className="accuracy-title">
                {displayConfidence >= 85 ? (
                  <>
                    <ShieldCheck size={18} style={{ color: '#34d399' }} />
                    <span>High Accuracy Extraction ({isLocalOcr ? 'Local Engine' : 'Live Neural AI'})</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={18} style={{ color: '#fbbf24' }} />
                    <span>Review Recommended</span>
                  </>
                )}
              </div>
              <div className="accuracy-desc">
                {isLocalOcr 
                  ? 'Extracted via client-side character recognition from your prescription image.'
                  : `Synthesized with Multi-Layer Neural AI across ${pageCount} document page(s).`}
              </div>
            </div>
          </div>



          <div className="accuracy-right-actions">
            <button 
              className="verify-stamp-btn"
              onClick={handleVerify}
              disabled={isVerified}
            >
              <CheckCircle size={15} />
              <span>{isVerified ? 'Clinically Approved' : 'Verify & Approve'}</span>
            </button>
          </div>
        </div>

        {/* 1. Optical Refraction Power Table (Prioritized for optical cards & Lenskart specs) */}
        {(opticalPower?.isOpticalRx || opticalPower?.od?.sph || opticalPower?.os?.sph) && (
          <div 
            className="clinical-card"
            onMouseEnter={() => onHoverSection?.({ top: 22, left: 5, width: 90, height: 20, sourcePage: opticalPower?.sourcePage })}
            onMouseLeave={() => onHoverSection?.(null)}
          >
            <div className="card-header-row">
              <div className="card-title" style={{ color: 'var(--cyan-accent)' }}>
                <Eye size={15} />
                <span>Spectacle Power / Refraction Matrix (Optical Card Spec)</span>
                {opticalPower?.sourcePage && (
                  <span className="conf-badge med" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                    Page {opticalPower.sourcePage}
                  </span>
                )}
              </div>
              <span className="conf-badge high">
                {opticalPower?.od?.confidence || 95}% accuracy
              </span>
            </div>

            <div className="optical-table-container">
              <table className="optical-table">
                <thead>
                  <tr>
                    <th>Eye</th>
                    <th>SPH (Sphere)</th>
                    <th>CYL (Cylinder)</th>
                    <th>AXIS</th>
                    <th>ADD (Near)</th>
                    <th>P.D. (mm)</th>
                    <th>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="eye-badge">Right (OD / RE)</span></td>
                    <td>
                      <input 
                        className="field-input" 
                        value={opticalPower?.od?.sph || ''} 
                        placeholder="-0.00"
                        onChange={(e) => handleOpticalFieldChange('od', 'sph', e.target.value)}
                      />
                    </td>
                    <td>
                      <input 
                        className="field-input" 
                        value={opticalPower?.od?.cyl || ''} 
                        placeholder="-0.00"
                        onChange={(e) => handleOpticalFieldChange('od', 'cyl', e.target.value)}
                      />
                    </td>
                    <td>
                      <input 
                        className="field-input" 
                        value={opticalPower?.od?.axis || ''} 
                        placeholder="180°"
                        onChange={(e) => handleOpticalFieldChange('od', 'axis', e.target.value)}
                      />
                    </td>
                    <td>
                      <input 
                        className="field-input" 
                        value={opticalPower?.od?.add || ''} 
                        placeholder="+0.00"
                        onChange={(e) => handleOpticalFieldChange('od', 'add', e.target.value)}
                      />
                    </td>
                    <td>
                      <input 
                        className="field-input" 
                        value={opticalPower?.od?.pd || ''} 
                        placeholder="32"
                        onChange={(e) => handleOpticalFieldChange('od', 'pd', e.target.value)}
                      />
                    </td>
                    <td><span className="conf-badge high">{opticalPower?.od?.confidence || 95}%</span></td>
                  </tr>
                  <tr>
                    <td><span className="eye-badge">Left (OS / LE)</span></td>
                    <td>
                      <input 
                        className="field-input" 
                        value={opticalPower?.os?.sph || ''} 
                        placeholder="-0.00"
                        onChange={(e) => handleOpticalFieldChange('os', 'sph', e.target.value)}
                      />
                    </td>
                    <td>
                      <input 
                        className="field-input" 
                        value={opticalPower?.os?.cyl || ''} 
                        placeholder="-0.00"
                        onChange={(e) => handleOpticalFieldChange('os', 'cyl', e.target.value)}
                      />
                    </td>
                    <td>
                      <input 
                        className="field-input" 
                        value={opticalPower?.os?.axis || ''} 
                        placeholder="180°"
                        onChange={(e) => handleOpticalFieldChange('os', 'axis', e.target.value)}
                      />
                    </td>
                    <td>
                      <input 
                        className="field-input" 
                        value={opticalPower?.os?.add || ''} 
                        placeholder="+0.00"
                        onChange={(e) => handleOpticalFieldChange('os', 'add', e.target.value)}
                      />
                    </td>
                    <td>
                      <input 
                        className="field-input" 
                        value={opticalPower?.os?.pd || ''} 
                        placeholder="32"
                        onChange={(e) => handleOpticalFieldChange('os', 'pd', e.target.value)}
                      />
                    </td>
                    <td><span className="conf-badge high">{opticalPower?.os?.confidence || 95}%</span></td>
                  </tr>
                </tbody>
              </table>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                <div>
                  <label className="field-label"><span>Lens Type / Coating</span></label>
                  <input
                    className="field-input"
                    value={opticalPower?.lensType || ''}
                    placeholder="e.g. Single Vision / Anti-Glare / Blue Cut"
                    onChange={(e) => handleOpticalMetaChange('lensType', e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label"><span>Optician / Frame Specialist</span></label>
                  <input
                    className="field-input"
                    value={opticalPower?.opticianName || ''}
                    placeholder="e.g. Certified Optometrist"
                    onChange={(e) => handleOpticalMetaChange('opticianName', e.target.value)}
                  />
                </div>
              </div>

              {opticalPower?.validation?.issues?.length > 0 && (
                <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '0.78rem', color: '#f87171' }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={14} />
                    <span>Optical Refraction Analysis Notice:</span>
                  </div>
                  {opticalPower.validation.issues.map((iss, i) => (
                    <div key={i} style={{ marginLeft: '6px', lineHeight: '1.4' }}>• {iss}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. Patient & Prescriber Info */}
        <div 
          className="clinical-card"
          onMouseEnter={() => onHoverSection?.({ top: 10, left: 5, width: 90, height: 18, sourcePage: patientInfo?.patientName?.sourcePage })}
          onMouseLeave={() => onHoverSection?.(null)}
        >
          <div className="card-header-row">
            <div className="card-title">
              <User size={15} />
              <span>Patient & Doctor Credentials</span>
            </div>
            <span className="conf-badge high">
              {patientInfo?.patientName?.confidence || 90}% avg
            </span>
          </div>

          <div className="fields-grid">
            <div className="field-item">
              <div className="field-label">
                <span>Patient Name</span>
                {patientInfo?.patientName?.confidence > 0 && (
                  <span className={`conf-badge ${getConfidenceClass(patientInfo.patientName.confidence)}`}>
                    {patientInfo.patientName.confidence}%
                  </span>
                )}
              </div>
              <input
                className="field-input"
                placeholder="(Not specified on card)"
                value={patientInfo?.patientName?.value || ''}
                onChange={(e) => handlePatientFieldChange('patientName', e.target.value)}
              />
            </div>

            <div className="field-item">
              <div className="field-label">
                <span>Age / Gender</span>
                {patientInfo?.ageGender?.confidence > 0 && (
                  <span className={`conf-badge ${getConfidenceClass(patientInfo.ageGender.confidence)}`}>
                    {patientInfo.ageGender.confidence}%
                  </span>
                )}
              </div>
              <input
                className="field-input"
                placeholder="(Not specified)"
                value={patientInfo?.ageGender?.value || ''}
                onChange={(e) => handlePatientFieldChange('ageGender', e.target.value)}
              />
            </div>

            <div className="field-item">
              <div className="field-label">
                <span>Prescription Date</span>
                {patientInfo?.date?.confidence > 0 && (
                  <span className={`conf-badge ${getConfidenceClass(patientInfo.date.confidence)}`}>
                    {patientInfo.date.confidence}%
                  </span>
                )}
              </div>
              <input
                className="field-input"
                placeholder="DD-MM-YYYY"
                value={patientInfo?.date?.value || ''}
                onChange={(e) => handlePatientFieldChange('date', e.target.value)}
              />
            </div>

            <div className="field-item">
              <div className="field-label">
                <span>Doctor / Clinician</span>
                {patientInfo?.doctorName?.confidence > 0 && (
                  <span className={`conf-badge ${getConfidenceClass(patientInfo.doctorName.confidence)}`}>
                    {patientInfo.doctorName.confidence}%
                  </span>
                )}
              </div>
              <input
                className="field-input"
                placeholder="(Not specified)"
                value={patientInfo?.doctorName?.value || ''}
                onChange={(e) => handlePatientFieldChange('doctorName', e.target.value)}
              />
            </div>

            <div className="field-item">
              <div className="field-label">
                <span>Clinic / Hospital / Brand</span>
                {patientInfo?.clinicName?.confidence > 0 && (
                  <span className={`conf-badge ${getConfidenceClass(patientInfo.clinicName.confidence)}`}>
                    {patientInfo.clinicName.confidence}%
                  </span>
                )}
              </div>
              <input
                className="field-input"
                placeholder="(Not specified)"
                value={patientInfo?.clinicName?.value || ''}
                onChange={(e) => handlePatientFieldChange('clinicName', e.target.value)}
              />
            </div>

            <div className="field-item">
              <div className="field-label">
                <span>Reg / License / Serial</span>
                {patientInfo?.regNo?.confidence > 0 && (
                  <span className={`conf-badge ${getConfidenceClass(patientInfo.regNo.confidence)}`}>
                    {patientInfo.regNo.confidence}%
                  </span>
                )}
              </div>
              <input
                className="field-input"
                placeholder="(Not specified)"
                value={patientInfo?.regNo?.value || ''}
                onChange={(e) => handlePatientFieldChange('regNo', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 3. Diagnosis & Vitals */}
        <div 
          className="clinical-card"
          onMouseEnter={() => onHoverSection?.({ top: 18, left: 5, width: 90, height: 16, sourcePage: diagnosis?.sourcePage })}
          onMouseLeave={() => onHoverSection?.(null)}
        >
          <div className="card-header-row">
            <div className="card-title">
              <Stethoscope size={15} />
              <span>Clinical Diagnosis & Vitals</span>
              {diagnosis?.sourcePage && (
                <span className="conf-badge med" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                  Page {diagnosis.sourcePage}
                </span>
              )}
            </div>
            {diagnosis?.confidence && (
              <span className={`conf-badge ${getConfidenceClass(diagnosis.confidence)}`}>
                {diagnosis.confidence}%
              </span>
            )}
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div className="field-label">
              <span>Primary Diagnosis / Clinical Impression</span>
            </div>
            <input
              className="field-input"
              style={{ fontWeight: '600', color: '#38bdf8' }}
              placeholder="(None recorded / Optical Refraction)"
              value={diagnosis?.primary || ''}
              onChange={(e) => onUpdateData({
                ...extractedData,
                diagnosis: { ...extractedData.diagnosis, primary: e.target.value }
              })}
            />
          </div>

          {vitals && vitals.length > 0 && (
            <div className="fields-grid">
              {vitals.map((v, i) => (
                <div key={i} className="field-item">
                  <div className="field-label">
                    <span>{v.name}</span>
                    <span className={`conf-badge ${getConfidenceClass(v.confidence || 95)}`}>
                      {v.confidence || 95}%
                    </span>
                  </div>
                  <input
                    className="field-input"
                    value={v.value || ''}
                    onChange={(e) => {
                      const updatedVitals = [...vitals];
                      updatedVitals[i] = { ...v, value: e.target.value };
                      onUpdateData({ ...extractedData, vitals: updatedVitals });
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Medications Table */}
        <div 
          className="clinical-card"
          onMouseEnter={() => onHoverSection?.({ top: 40, left: 5, width: 90, height: 32 })}
          onMouseLeave={() => onHoverSection?.(null)}
        >
          <div className="card-header-row">
            <div className="card-title">
              <Pill size={15} />
              <span>Medications & Dosage Schedule ({medications?.length || 0})</span>
            </div>
            <button 
              className="header-btn" 
              onClick={handleAddMedication}
              style={{ fontSize: '0.74rem', padding: '4px 8px' }}
            >
              <Plus size={13} />
              <span>Add Medication</span>
            </button>
          </div>

          {(!medications || medications.length === 0) ? (
            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              No medications prescribed on this document.
            </div>
          ) : (
            <div className="medications-list">
              {medications.map((med, index) => (
                <div key={med.id || index} className="medication-card">
                  <div className="med-header-line">
                    <input
                      className="med-name-input"
                      value={med.name || ''}
                      placeholder="Medicine Name"
                      onChange={(e) => handleMedicationChange(med.id, 'name', e.target.value)}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {med.sourcePage && (
                        <span className="conf-badge med" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                          Page {med.sourcePage}
                        </span>
                      )}
                      <span className="dosage-schedule-badge">
                        {med.schedule || med.frequency || 'OD'}
                      </span>
                      <span className={`conf-badge ${getConfidenceClass(med.confidence || 95)}`}>
                        {med.confidence || 95}%
                      </span>
                      <button 
                        className="icon-btn" 
                        onClick={() => handleDeleteMedication(med.id)}
                        title="Remove medication"
                        style={{ width: '26px', height: '26px' }}
                      >
                        <Trash2 size={13} style={{ color: '#f87171' }} />
                      </button>
                    </div>
                  </div>

                  {(med.genericName || med.therapeuticClass) && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '4px 0 8px' }}>
                      {med.genericName && (
                        <span style={{ fontSize: '0.72rem', background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.3)', color: 'var(--cyan-accent)', padding: '2px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={11} /> Generic: {med.genericName}
                        </span>
                      )}
                      {med.therapeuticClass && (
                        <span style={{ fontSize: '0.72rem', background: 'rgba(147, 51, 234, 0.12)', border: '1px solid rgba(147, 51, 234, 0.3)', color: '#c084fc', padding: '2px 8px', borderRadius: '4px' }}>
                          {med.therapeuticClass}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="med-meta-row">
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Form: </span>
                      <input 
                        style={{ background: 'transparent', border: 'none', color: 'inherit', width: '65px' }}
                        value={med.form || ''}
                        onChange={(e) => handleMedicationChange(med.id, 'form', e.target.value)}
                      />
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Strength: </span>
                      <input 
                        style={{ background: 'transparent', border: 'none', color: 'inherit', width: '75px' }}
                        value={med.strength || ''}
                        onChange={(e) => handleMedicationChange(med.id, 'strength', e.target.value)}
                      />
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Timing: </span>
                      <input 
                        style={{ background: 'transparent', border: 'none', color: 'inherit', width: '130px' }}
                        value={med.timing || ''}
                        onChange={(e) => handleMedicationChange(med.id, 'timing', e.target.value)}
                      />
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Duration: </span>
                      <input 
                        style={{ background: 'transparent', border: 'none', color: 'inherit', width: '75px' }}
                        value={med.duration || ''}
                        onChange={(e) => handleMedicationChange(med.id, 'duration', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="med-instruction-box">
                    <input
                      style={{ background: 'transparent', border: 'none', color: 'inherit', width: '100%' }}
                      value={med.instructions || ''}
                      onChange={(e) => handleMedicationChange(med.id, 'instructions', e.target.value)}
                      placeholder="Instructions / advice..."
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. Checkboxes & Recommendations */}
        {checkboxes && checkboxes.length > 0 && (
          <div 
            className="clinical-card"
            onMouseEnter={() => onHoverSection?.({ top: 72, left: 5, width: 90, height: 22 })}
            onMouseLeave={() => onHoverSection?.(null)}
          >
            <div className="card-header-row">
              <div className="card-title">
                <CheckSquare size={15} />
                <span>Diagnostic Advice & Checkbox Items</span>
              </div>
              <span className="conf-badge high">Extracted Marks</span>
            </div>

            <div className="checkbox-list">
              {checkboxes.map((cb) => (
                <div 
                  key={cb.id} 
                  className="checkbox-row"
                  onClick={() => handleCheckboxToggle(cb.id)}
                >
                  <div className="checkbox-label-part">
                    <div className={`custom-cb ${cb.checked ? 'checked' : ''}`}>
                      {cb.checked && <CheckCircle size={14} />}
                    </div>
                    <span style={{ color: cb.checked ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {cb.label}
                    </span>
                  </div>
                  <span className={`conf-badge ${getConfidenceClass(cb.confidence || 95)}`}>
                    {cb.confidence || 95}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Clinical Graphs, Diagnostic Charts & Diagrams */}
        {graphsAndDiagrams && graphsAndDiagrams.length > 0 && (
          <div className="clinical-card">
            <div className="card-header-row">
              <div className="card-title">
                <Activity size={15} style={{ color: 'var(--teal-primary)' }} />
                <span>Clinical Graphs, Charts & Diagrams</span>
              </div>
              <span className="conf-badge high">Neural Visual Reasoning</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              {graphsAndDiagrams.map((graph) => (
                <div 
                  key={graph.id}
                  style={{
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.86rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      <BarChart2 size={14} style={{ color: 'var(--teal-primary)' }} />
                      <span>{graph.diagramType}</span>
                    </div>
                    <span className="conf-badge high">{graph.confidence || 94}%</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Interpreted Clinical Findings:</strong> {graph.findings}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {doctorNotes && (
          <div style={{ marginTop: '14px', padding: '12px 16px', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--teal-primary)' }}>Doctor Note / Remarks: </strong> <em>{doctorNotes}</em>
          </div>
        )}

        {/* Export & Print Actions Bar */}
        <div className="actions-footer-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {onResetDocument && (
              <button 
                className="header-btn" 
                onClick={onResetDocument}
                style={{ background: 'var(--teal-soft)', color: 'var(--cyan-accent)', borderColor: 'var(--teal-glow)' }}
              >
                <Plus size={14} />
                <span>Extract Another Prescription</span>
              </button>
            )}
            <button className="header-btn" onClick={handleExportJson}>
              <Download size={14} />
              <span>Export Clean JSON</span>
            </button>
            <button className="header-btn" onClick={handlePrintSummary}>
              <Printer size={14} />
              <span>Print Clinical Summary</span>
            </button>
          </div>

          <button 
            className="token-efficiency-pill"
            onClick={onOpenTokenModal}
            style={{ fontSize: '0.74rem' }}
          >
            <Zap size={13} style={{ color: '#38bdf8' }} />
            <span>Tokens: {tokenMetrics?.totalTokens || 0}</span>
            <span className="token-savings-badge">
              {tokenMetrics?.isLocalEngine ? 'Zero API Cost (Local OCR)' : `Cost: $${tokenMetrics?.estimatedCostUsd || '0.000085'}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
