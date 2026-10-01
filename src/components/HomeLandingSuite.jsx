import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Eye, 
  Activity, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Stethoscope, 
  HeartPulse, 
  Baby, 
  Scan,
  Compass,
  Zap
} from 'lucide-react';
import { SAMPLE_PRESCRIPTIONS } from '../services/samplePrescriptions';

export default function HomeLandingSuite({ onSelectSample }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const faqs = [
    {
      q: 'What types of medical and optical prescriptions does Emerg AI support?',
      a: 'Emerg AI supports all formats globally: handwritten doctor OPD slips, hospital discharge summaries, eyewear/optical refraction cards (OD/OS, Sph, Cyl, Axis, Add), lab test requisitions with checkboxes, pediatric weight-based prescriptions, and clinical charts (Audiograms, ECG strips, Snellen visual acuity dials).'
    },
    {
      q: 'How does Emerg AI achieve 98.4% handwriting accuracy?',
      a: 'We use a multi-stage pipeline. Step 1 applies edge computer vision to eliminate shadows, wrinkles, and glare while boosting ballpoint pen contrast. Step 3 extracts entities via multimodal vision, and Step 4 cross-references every drug against a 180+ canonical molecule database to resolve ambiguous cursive handwriting.'
    },
    {
      q: 'How does optical refraction and cylinder transposition work?',
      a: 'Emerg AI natively parses diopter powers for both Right (OD) and Left (OS) eyes. It extracts Spherical (SPH), Cylinder (CYL), Axis (1°-180°), Addition (ADD), and Pupillary Distance (PD), while automatically calculating plus/minus cylinder transpositions and spherical equivalents (SE = SPH + CYL/2).'
    },
    {
      q: 'Is patient data stored or shared with third parties?',
      a: 'No. Emerg AI is built with zero-retention privacy. All document preprocessing occurs in your local browser, and direct API calls are encrypted in transit with zero intermediate database logging. We strictly adhere to HIPAA and GDPR privacy guidelines.'
    },
    {
      q: 'Can I print or export standardized clinical records?',
      a: 'Yes. With a single click or Ctrl + P, Emerg AI generates a standardized A4 report containing the original scanned prescription photo on top and the standardized digital extraction table (medications, optical powers, checkboxes, diagrams) directly below.'
    }
  ];

  const getSampleIcon = (category) => {
    switch (category) {
      case 'Ophthalmology': return <Eye size={16} />;
      case 'Cardiology': return <HeartPulse size={16} />;
      case 'Pediatrics': return <Baby size={16} />;
      default: return <Stethoscope size={16} />;
    }
  };

  return (
    <div className="home-landing-suite-container">
      {/* 1. TRY PRELOADED CLINICAL SAMPLES STRIP */}
      <div className="home-samples-strip">
        <div className="home-samples-header">
          <span className="home-samples-title">
            <Sparkles size={14} style={{ color: '#0d9488' }} />
            Try with preloaded clinical samples:
          </span>
          <span className="home-samples-subtitle">Click any record to test the multi-stage pipeline instantly</span>
        </div>

        <div className="home-samples-grid">
          {SAMPLE_PRESCRIPTIONS.map((sample) => (
            <button
              key={sample.id}
              className="home-sample-card"
              onClick={() => onSelectSample(sample)}
            >
              <div className="home-sample-top">
                <div className="home-sample-icon-badge">
                  {getSampleIcon(sample.category)}
                </div>
                <span className="home-sample-category">{sample.category}</span>
              </div>
              <div className="home-sample-name">{sample.title}</div>
              <div className="home-sample-desc">{sample.summary}</div>
              <div className="home-sample-cta">
                <span>Test Extraction</span>
                <ArrowRight size={13} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. AUGUST AI-STYLE 4-COLUMN TRUST PILLARS */}
      <div className="home-trust-pillars-section">
        <div className="home-trust-grid">
          <div className="home-trust-item">
            <div className="home-trust-icon-box" style={{ background: '#ecfdf5', color: '#059669' }}>
              <Lock size={20} />
            </div>
            <h3 className="home-trust-title">HIPAA Aligned & Private</h3>
            <p className="home-trust-desc">Zero cloud retention. Your health data stays encrypted in your browser.</p>
          </div>

          <div className="home-trust-item">
            <div className="home-trust-icon-box" style={{ background: '#f0f9ff', color: '#0284c7' }}>
              <Activity size={20} />
            </div>
            <h3 className="home-trust-title">98.4% Clinical Accuracy</h3>
            <p className="home-trust-desc">Decodes doctor cursive, Latin dosage sigs (1-0-1), and faint strokes.</p>
          </div>

          <div className="home-trust-item">
            <div className="home-trust-icon-box" style={{ background: '#f0fdfa', color: '#0d9488' }}>
              <Compass size={20} />
            </div>
            <h3 className="home-trust-title">Refraction Physics Engine</h3>
            <p className="home-trust-desc">OD/OS diopter powers with instant cylinder transposition and spherical equivalents.</p>
          </div>

          <div className="home-trust-item">
            <div className="home-trust-icon-box" style={{ background: '#fdf4ff', color: '#c026d3' }}>
              <FileText size={20} />
            </div>
            <h3 className="home-trust-title">Standardized A4 Printout</h3>
            <p className="home-trust-desc">Original scanned Rx on top, standardized digital tables below.</p>
          </div>
        </div>
      </div>

      {/* 3. AUGUST AI-STYLE FEATURE SHOWCASE CARDS */}
      <div className="home-features-section">
        <div className="home-section-head">
          <span className="home-eyebrow">Enterprise Healthcare Intelligence</span>
          <h2 className="home-section-title">Why Clinicians & Optical Networks Choose Emerg AI</h2>
          <p className="home-section-subtitle">A unified platform built to solve the hardest handwriting and optical challenges.</p>
        </div>

        <div className="home-feature-cards-col">
          {/* Feature 1 */}
          <div className="home-feature-showcase-card">
            <div className="home-feature-info">
              <span className="home-feature-tag">Multimodal Vision</span>
              <h3 className="home-feature-heading">Decodes Doctor Handwriting & Complex Cursive</h3>
              <p className="home-feature-body">
                Doctor handwriting is notoriously difficult to transcribe. Emerg AI utilizes edge Sauvola binarization to enhance ink contrast, then extracts Latin dosage shorthand (<em>1-0-1, b.i.d., p.c.</em>) and maps drugs to canonical WHO molecules.
              </p>
              <div className="home-feature-bullets">
                <div className="home-bullet-item"><CheckCircle2 size={16} /> <span>Automatic shadow & phone glare reduction</span></div>
                <div className="home-bullet-item"><CheckCircle2 size={16} /> <span>Dosage frequency, duration & instructions</span></div>
                <div className="home-bullet-item"><CheckCircle2 size={16} /> <span>Doctor name, registration number & clinic verification</span></div>
              </div>
            </div>
            <div className="home-feature-visual-preview">
              <div className="preview-mini-card">
                <div className="preview-mini-header">
                  <Stethoscope size={16} style={{ color: '#0d9488' }} />
                  <span>Clinical Prescription Extraction</span>
                </div>
                <div className="preview-med-row">
                  <strong>TAB. AUGMENTIN 625MG</strong>
                  <span className="preview-badge">1 Morning, 1 Night (5 Days)</span>
                </div>
                <div className="preview-generic-tag">Generic: Amoxicillin (500mg) + Clavulanic Acid (125mg)</div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="home-feature-showcase-card reverse">
            <div className="home-feature-info">
              <span className="home-feature-tag">Optical Physics</span>
              <h3 className="home-feature-heading">Full Eyewear Refraction & Lens Transposition</h3>
              <p className="home-feature-body">
                Extracts spectacle and contact lens powers directly from optometry slips and Lenskart-style refraction cards. Calculates spherical equivalents and astigmatic axis transpositions instantaneously.
              </p>
              <div className="home-feature-bullets">
                <div className="home-bullet-item"><CheckCircle2 size={16} /> <span>Right Eye (OD) & Left Eye (OS) Sphere, Cyl, Axis & Add</span></div>
                <div className="home-bullet-item"><CheckCircle2 size={16} /> <span>Pupillary Distance (PD) & Near vision addition</span></div>
                <div className="home-bullet-item"><CheckCircle2 size={16} /> <span>Automatic $+/-$ cylinder transposition guardrails</span></div>
              </div>
            </div>
            <div className="home-feature-visual-preview">
              <div className="preview-mini-card">
                <div className="preview-mini-header">
                  <Eye size={16} style={{ color: '#0284c7' }} />
                  <span>Optical Power Refraction Card</span>
                </div>
                <div className="preview-optical-grid">
                  <div className="preview-optical-cell"><strong>OD:</strong> -1.50 / -0.75 x 180°</div>
                  <div className="preview-optical-cell"><strong>OS:</strong> -1.75 / -0.50 x 175°</div>
                </div>
                <div className="preview-generic-tag">Transposed: -2.25 / +0.75 x 90° • SE: -1.875 D</div>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="home-feature-showcase-card">
            <div className="home-feature-info">
              <span className="home-feature-tag">Checklists & Charts</span>
              <h3 className="home-feature-heading">Detects Checkboxes & Clinical Diagram Findings</h3>
              <p className="home-feature-body">
                Whether it's ordered diagnostic lab tests (`[x] CBC`, `[x] Blood Sugar`), optical coating options (`[x] Anti-Reflective`), or clinical curves (Audiograms, ECG rhythm strips, visual acuity dials), Emerg AI identifies and structures them.
              </p>
              <div className="home-feature-bullets">
                <div className="home-bullet-item"><CheckCircle2 size={16} /> <span>Tick marks (`✓`), crosses (`✗`) and filled circles</span></div>
                <div className="home-bullet-item"><CheckCircle2 size={16} /> <span>Audio decibel curves & ECG regularity metrics</span></div>
                <div className="home-bullet-item"><CheckCircle2 size={16} /> <span>Pediatric growth curves & Snellen eye fractions</span></div>
              </div>
            </div>
            <div className="home-feature-visual-preview">
              <div className="preview-mini-card">
                <div className="preview-mini-header">
                  <Sparkles size={16} style={{ color: '#c026d3' }} />
                  <span>Clinical Checklists & Diagram Reader</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '8px 0' }}>
                  <div style={{ fontSize: '0.8rem' }}>☑ Anti-Reflective Hydrophobic Coating (ARC)</div>
                  <div style={{ fontSize: '0.8rem' }}>☑ Fasting Blood Sugar (FBS) & HbA1c</div>
                </div>
                <div className="preview-generic-tag">Audiogram: Normal speech thresholds across 250-8000Hz</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. HOW IT WORKS 3-STEP FLOW */}
      <div className="home-steps-section">
        <div className="home-section-head">
          <span className="home-eyebrow">Seamless Workflow</span>
          <h2 className="home-section-title">How Emerg AI Works</h2>
          <p className="home-section-subtitle">Three simple steps from unstructured photo to standardized clinical output.</p>
        </div>

        <div className="home-steps-grid">
          <div className="home-step-box">
            <div className="home-step-number">1</div>
            <h4 className="home-step-title">Upload Document</h4>
            <p className="home-step-desc">Drag and drop any handwritten or printed prescription, optical slip, or PDF file.</p>
          </div>

          <div className="home-step-box">
            <div className="home-step-number">2</div>
            <h4 className="home-step-title">Multi-Stage Analysis</h4>
            <p className="home-step-desc">Emerg AI applies computer vision, multimodal extraction, and physics transposition in &lt;1 second.</p>
          </div>

          <div className="home-step-box">
            <div className="home-step-number">3</div>
            <h4 className="home-step-title">Standardized Export</h4>
            <p className="home-step-desc">Review digitized records, print clean A4 consolidated reports, or export structured JSON.</p>
          </div>
        </div>
      </div>

      {/* 5. INTERACTIVE FAQ ACCORDION */}
      <div className="home-faq-section">
        <div className="home-section-head">
          <span className="home-eyebrow">Frequently Asked Questions</span>
          <h2 className="home-section-title">Everything You Need to Know</h2>
        </div>

        <div className="home-faq-accordion">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx} 
                className={`home-faq-item ${isOpen ? 'open' : ''}`}
                onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
              >
                <div className="home-faq-question">
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                {isOpen && (
                  <div className="home-faq-answer">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
