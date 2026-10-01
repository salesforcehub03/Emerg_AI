import React, { useState } from 'react';
import { X, Key, Check, ShieldCheck, AlertCircle, Loader2, Lock, Unlock, ShieldAlert } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey, getStoredModel, setStoredModel, testGeminiApiKey } from '../services/geminiService';

export default function ApiKeyModal({ isOpen, onClose, onKeyUpdated }) {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [model, setModel] = useState(getStoredModel());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [availableModels, setAvailableModels] = useState([]);

  // Security Passcode Protection: requires "00000" (5 zeros)
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  if (!isOpen) return null;

  const handleVerifyPasscode = (e) => {
    e.preventDefault();
    if (passcode === '00000') {
      setIsUnlocked(true);
      setPasscodeError(false);
      setPasscode('');
    } else {
      setPasscodeError(true);
    }
  };

  const handleTestKey = async () => {
    setIsTesting(true);
    setTestResult(null);

    const res = await testGeminiApiKey(apiKey);
    if (res.success && res.model) {
      if (res.modelsList && res.modelsList.length > 0) {
        setAvailableModels(res.modelsList);
      }
      if (!model || model.includes('1.5') || model.includes('2.0')) {
        setModel('auto');
      }
    }
    setTestResult({
      success: res.success,
      status: res.status,
      message: res.success ? 'Multi-Layer AI Engine connected & verified successfully.' : (res.message || 'Verification failed.')
    });
    setIsTesting(false);
  };

  const handleSave = () => {
    setStoredApiKey(apiKey);
    setStoredModel(model || 'auto');
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onKeyUpdated();
      onClose();
    }, 600);
  };

  const handleClear = () => {
    setApiKey('');
    setStoredApiKey('');
    setModel('auto');
    setStoredModel('auto');
    setTestResult(null);
    setAvailableModels([]);
    onKeyUpdated();
  };

  const handleModalClose = () => {
    setIsUnlocked(false);
    setPasscode('');
    setPasscodeError(false);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleModalClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: isUnlocked ? '560px' : '440px' }}>
        
        {/* STEP 1: SECURITY PIN VERIFICATION (REQUIRES 00000) */}
        {!isUnlocked ? (
          <div>
            <div className="modal-header">
              <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  color: '#f87171',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Lock size={18} />
                </div>
                <span>Administrator Access Verification</span>
              </div>
              <button className="icon-btn" onClick={handleModalClose}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '8px 0 20px', textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                margin: '0 auto 16px',
                borderRadius: '50%',
                background: 'rgba(13, 148, 136, 0.12)',
                color: 'var(--teal-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldAlert size={28} />
              </div>
              
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Protected System Settings
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', maxWidth: '340px', margin: '0 auto 20px', lineHeight: '1.45' }}>
                Enter the authorized 5-digit administrator security passcode to configure the Multi-Layer AI Engine.
              </p>

              <form onSubmit={handleVerifyPasscode} style={{ maxWidth: '280px', margin: '0 auto' }}>
                <div style={{ marginBottom: '14px' }}>
                  <input
                    type="password"
                    maxLength={5}
                    autoFocus
                    className="field-input"
                    placeholder="Enter passcode (00000)"
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      setPasscodeError(false);
                    }}
                    style={{
                      textAlign: 'center',
                      fontSize: '1.2rem',
                      letterSpacing: '0.3em',
                      fontWeight: 700,
                      padding: '10px 14px'
                    }}
                  />
                </div>

                {passcodeError && (
                  <div style={{
                    color: '#f87171',
                    fontSize: '0.8rem',
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px'
                  }}>
                    <AlertCircle size={14} />
                    <span>Invalid Passcode. Enter 00000 to unlock.</span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button
                    type="button"
                    className="header-btn"
                    onClick={handleModalClose}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="upload-file-btn"
                    style={{ flex: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Unlock size={14} />
                    <span>Unlock Settings</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* STEP 2: UNLOCKED MULTI-LAYER AI ENGINE SETTINGS */
          <div>
            <div className="modal-header">
              <div className="modal-title">
                <Key size={20} style={{ color: 'var(--teal-glow)' }} />
                <span>Multi-Layer AI Engine Configuration</span>
              </div>
              <button className="icon-btn" onClick={handleModalClose}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Configure your secure Multi-Layer Neural AI Engine key to extract 100% live clinical data from medical prescriptions and optical refraction records.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="field-label" style={{ marginBottom: '6px' }}>
                  <span>Multi-Layer AI Engine Key</span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--teal-primary)', fontWeight: 600 }}>Secure Encrypted Local Storage</span>
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="password"
                    className="field-input"
                    placeholder="Enter your Multi-Layer AI Engine key..."
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value);
                      setTestResult(null);
                    }}
                    style={{ fontFamily: 'var(--font-mono)', flex: 1 }}
                  />
                  <button
                    className="header-btn"
                    onClick={handleTestKey}
                    disabled={isTesting || !apiKey.trim()}
                    title="Verify key with Multi-Layer AI Engine"
                    style={{ minWidth: '95px' }}
                  >
                    {isTesting ? <Loader2 size={14} className="spin" /> : 'Verify Key'}
                  </button>
                </div>
                {testResult && (
                  <div style={{
                    marginTop: '8px',
                    fontSize: '0.82rem',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: testResult.success
                      ? 'rgba(52, 211, 153, 0.12)'
                      : 'rgba(239, 68, 68, 0.12)',
                    border: `1px solid ${
                      testResult.success
                        ? 'rgba(52, 211, 153, 0.3)'
                        : 'rgba(239, 68, 68, 0.3)'
                    }`,
                    color: testResult.success ? '#34d399' : '#f87171',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '6px',
                    lineHeight: '1.4'
                  }}>
                    {testResult.success ? (
                      <Check size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                    ) : (
                      <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                    )}
                    <span>{testResult.message}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="field-label" style={{ marginBottom: '6px' }}>
                  <span>Neural Pipeline Architecture</span>
                </label>
                <select
                  className="field-input"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                >
                  <option value="auto">Multi-Layer Neural Vision (Auto-Optimized Multimodal)</option>
                  <option value="gemini-3.6-flash">Multi-Layer Fast Neural Engine (Ultra-Low Latency)</option>
                  <option value="gemini-3.6-pro">Multi-Layer Deep Clinical Reasoning Engine</option>
                  <option value="gemini-2.5-flash">Multi-Layer Standard Multimodal Engine</option>
                </select>
              </div>

              <div style={{
                background: 'rgba(13, 148, 136, 0.1)',
                border: '1px solid rgba(20, 184, 166, 0.25)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <ShieldCheck size={16} style={{ color: '#34d399', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Enterprise Privacy Assurance:</strong> Credentials and encryption keys are stored strictly in client-side secure browser storage. No prescription images or patient records are stored on intermediary servers.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '22px' }}>
              {apiKey ? (
                <button
                  className="header-btn"
                  onClick={handleClear}
                  style={{ color: '#f87171' }}
                >
                  Clear Key
                </button>
              ) : <div />}

              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="header-btn" onClick={handleModalClose}>
                  Cancel
                </button>
                <button
                  className="header-btn btn-accent"
                  onClick={handleSave}
                >
                  {savedSuccess ? (
                    <>
                      <Check size={14} />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <span>Save Configuration</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
