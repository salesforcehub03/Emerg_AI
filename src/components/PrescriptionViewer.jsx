import React, { useState, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Upload, 
  FileText, 
  Plus, 
  CheckCircle2, 
  Grid, 
  Layout, 
  ChevronLeft, 
  ChevronRight,
  Sliders,
  Eye
} from 'lucide-react';

export default function PrescriptionViewer({
  pages = [],
  activePageIndex = 0,
  onSelectPage,
  onUploadPages,
  onAddPage,
  onRemovePage,
  isProcessing,
  processingStatus,
  activeHighlight,
  documentTitle,
  isNeuralViewActive = false,
  onToggleNeuralView
}) {

  const [zoom, setZoom] = useState(1);
  const [rotations, setRotations] = useState({}); // { [pageIndex]: deg }
  const [viewMode, setViewMode] = useState('single'); // 'single' | 'grid'
  const fileInputRef = useRef(null);
  const addPageInputRef = useRef(null);

  const activePage = pages[activePageIndex] || pages[0];
  const currentRotation = rotations[activePageIndex] || 0;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setRotations((prev) => ({ ...prev, [activePageIndex]: 0 }));
  };
  
  const handleRotate = () => {
    setRotations((prev) => ({
      ...prev,
      [activePageIndex]: ((prev[activePageIndex] || 0) + 90) % 360
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onUploadPages(files);
    }
    e.target.value = '';
  };

  const handleAddPageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onAddPage(files);
    }
    e.target.value = '';
  };

  return (
    <div className="panel-card prescription-viewer-panel">
      {/* Panel Header */}
      <div className="panel-header">
        <div className="panel-title-area">
          <FileText size={18} style={{ color: 'var(--teal-glow)' }} />
          <div>
            <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{documentTitle || 'Prescription Document'}</span>
              {pages.length > 1 && (
                <span className="conf-badge high" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                  {pages.length} Pages Multi-Rx
                </span>
              )}
            </div>
            <div className="panel-subtitle">
              {pages.length > 1
                ? `Page ${activePageIndex + 1} of ${pages.length} • Cross-page unified clinical extraction`
                : '100% Genuine Prescription Data • Auto-mapped to clinical fields'}
            </div>
          </div>
        </div>

        <div className="doc-controls">
          {onToggleNeuralView && (
            <button
              className={`icon-btn ${isNeuralViewActive ? 'active' : ''}`}
              onClick={onToggleNeuralView}
              title={isNeuralViewActive ? 'Image Enhancement Filter: Active (High Contrast)' : 'Image Enhancement Filter: Boost Handwriting Clarity'}
              style={isNeuralViewActive ? { background: 'var(--teal-primary)', color: '#ffffff', borderColor: 'var(--teal-primary)' } : {}}
            >
              <Sliders size={15} />
            </button>
          )}

          {pages.length > 1 && (
            <button
              className={`icon-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode(viewMode === 'single' ? 'grid' : 'single')}
              title={viewMode === 'single' ? 'View all pages together' : 'View single page'}
              style={viewMode === 'grid' ? { background: 'var(--teal-glow)', color: '#fff' } : {}}
            >
              {viewMode === 'single' ? <Grid size={16} /> : <Layout size={16} />}
            </button>
          )}
          <button className="icon-btn" onClick={handleZoomIn} title="Zoom In">
            <ZoomIn size={16} />
          </button>
          <button className="icon-btn" onClick={handleZoomOut} title="Zoom Out">
            <ZoomOut size={16} />
          </button>
          <button className="icon-btn" onClick={handleRotate} title="Rotate 90°">
            <RotateCcw size={16} />
          </button>
          <button className="icon-btn" onClick={handleReset} title="Reset View">
            <span style={{ fontSize: '11px', fontWeight: 'bold' }}>1:1</span>
          </button>
        </div>
      </div>



      {/* Multi-Page Navigation Bar */}
      {pages.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
          background: 'rgba(15, 23, 42, 0.4)',
          borderBottom: '1px solid var(--border-color)',
          gap: '8px',
          overflowX: 'auto'
        }}>
          {/* Page Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {pages.map((pg, idx) => (
              <button
                key={pg.id || idx}
                onClick={() => {
                  onSelectPage(idx);
                  if (viewMode === 'grid') setViewMode('single');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: activePageIndex === idx && viewMode === 'single'
                    ? '1px solid var(--teal-glow)'
                    : '1px solid rgba(148, 163, 184, 0.2)',
                  background: activePageIndex === idx && viewMode === 'single'
                    ? 'rgba(13, 148, 136, 0.25)'
                    : 'rgba(30, 41, 59, 0.6)',
                  color: activePageIndex === idx && viewMode === 'single'
                    ? 'var(--cyan-accent)'
                    : 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>Page {idx + 1}</span>
                {pages.length > 1 && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemovePage(idx);
                    }}
                    title="Remove page"
                    style={{ opacity: 0.6, fontSize: '10px', marginLeft: '2px' }}
                  >
                    ✕
                  </span>
                )}
              </button>
            ))}

            {/* Add Page Button */}
            <input
              type="file"
              ref={addPageInputRef}
              onChange={handleAddPageChange}
              accept="image/*,application/pdf"
              style={{ display: 'none' }}
              multiple
            />
            <button
              onClick={() => addPageInputRef.current?.click()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '0.76rem',
                border: '1px dashed rgba(20, 184, 166, 0.4)',
                background: 'transparent',
                color: 'var(--cyan-accent)',
                cursor: 'pointer'
              }}
              title="Add Page 2, Page 3 or lab report"
            >
              <Plus size={13} />
              <span>Add Page</span>
            </button>
          </div>

          {pages.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                className="icon-btn"
                style={{ padding: '4px 6px' }}
                onClick={() => onSelectPage(Math.max(0, activePageIndex - 1))}
                disabled={activePageIndex === 0}
                title="Previous Page"
              >
                <ChevronLeft size={14} />
              </button>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                {activePageIndex + 1} / {pages.length}
              </span>
              <button
                className="icon-btn"
                style={{ padding: '4px 6px' }}
                onClick={() => onSelectPage(Math.min(pages.length - 1, activePageIndex + 1))}
                disabled={activePageIndex === pages.length - 1}
                title="Next Page"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Viewport */}
      <div className="viewer-viewport" style={{ overflow: 'auto', position: 'relative' }}>
        {pages.length > 0 && activePage ? (

          viewMode === 'grid' ? (
            /* Multi-Page Side-by-Side / Grid View */
            <div style={{
              display: 'grid',
              gridTemplateColumns: pages.length === 2 ? '1fr 1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
              padding: '16px',
              width: '100%'
            }}>
              {pages.map((pg, idx) => (
                <div 
                  key={pg.id || idx}
                  onClick={() => {
                    onSelectPage(idx);
                    setViewMode('single');
                  }}
                  style={{
                    position: 'relative',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: activePageIndex === idx ? '2px solid var(--teal-glow)' : '1px solid var(--border-color)',
                    background: 'rgba(0,0,0,0.2)'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 'bold',
                    color: '#fff',
                    zIndex: 2
                  }}>
                    Page {idx + 1}
                  </div>
                  <img
                    src={isNeuralViewActive && pg.neuralDataUrl ? pg.neuralDataUrl : pg.dataUrl}
                    alt={`Prescription Page ${idx + 1}`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      transform: `rotate(${rotations[idx] || 0}deg)`,
                      filter: isNeuralViewActive ? 'contrast(1.45) brightness(1.06) saturate(1.1)' : 'none',
                      transition: 'filter 0.2s ease'
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Single Active Page View */
            <div 
              style={{ 
                position: 'relative', 
                display: 'inline-block',
                transform: `scale(${zoom}) rotate(${currentRotation}deg)`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease'
              }}
            >
              <img
                src={isNeuralViewActive && activePage.neuralDataUrl ? activePage.neuralDataUrl : activePage.dataUrl}
                alt={`Prescription Page ${activePageIndex + 1}`}
                className="prescription-sheet"
                style={{ 
                  maxHeight: '780px', 
                  width: 'auto', 
                  display: 'block',
                  filter: isNeuralViewActive ? 'contrast(1.45) brightness(1.06) saturate(1.1)' : 'none',
                  transition: 'filter 0.2s ease'
                }}
              />


              {/* Scanning Laser Animation during extraction */}
              {isProcessing && (
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(13, 148, 136, 0.15)',
                    pointerEvents: 'none',
                    overflow: 'hidden',
                    borderRadius: '10px'
                  }}
                >
                  <div 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: '#38bdf8',
                      boxShadow: '0 0 15px 4px #38bdf8',
                      animation: 'scanLaser 1.8s infinite linear'
                    }}
                  />
                </div>
              )}

              {/* Contextual Highlight Box */}
              {activeHighlight && (!activeHighlight.sourcePage || activeHighlight.sourcePage === activePageIndex + 1) && (
                <div
                  className="overlay-zone active"
                  style={{
                    top: `${activeHighlight.top || 20}%`,
                    left: `${activeHighlight.left || 6}%`,
                    width: `${activeHighlight.width || 88}%`,
                    height: `${activeHighlight.height || 20}%`
                  }}
                />
              )}
            </div>
          )
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 20px' }}>
            <FileText size={48} style={{ opacity: 0.4, marginBottom: '12px' }} />
            <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>
              No Prescription Document Loaded
            </p>
            <p style={{ fontSize: '0.84rem', marginTop: '6px' }}>
              Upload any single optical card, doctor prescription, or 2–3 page medical record.
            </p>
          </div>
        )}

        {/* Processing Banner overlay if active */}
        {isProcessing && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(15, 23, 42, 0.92)',
            border: '1px solid var(--teal-glow)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            padding: '8px 18px',
            borderRadius: '24px',
            color: 'var(--cyan-accent)',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 10
          }}>
            <div className="spin" style={{
              width: '14px',
              height: '14px',
              border: '2px solid var(--cyan-accent)',
              borderTopColor: 'transparent',
              borderRadius: '50%'
            }} />
            <span>{processingStatus || `Extracting live data across ${pages.length} page(s)...`}</span>
          </div>
        )}
      </div>

      {/* Footer Dropzone & Upload Button */}
      <div className="dropzone-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} style={{ color: '#34d399' }} />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Supports Multi-Page Document (JPG, PNG, PDF) • Accurate Optical & OPD Rx
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,application/pdf"
            multiple
            style={{ display: 'none' }}
          />
          <button
            className="upload-file-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
          >
            <Upload size={14} />
            <span>Upload Prescription / Document</span>
          </button>
        </div>
      </div>
    </div>

  );
}
