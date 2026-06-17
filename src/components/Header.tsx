import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { exportJSON, exportPDF, exportDOCX } from '../services/exportService';
import { validateResumeJSON } from '../services/importValidator';

export default function Header() {
  const { state, dispatch } = useApp();
  const [showExport, setShowExport] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target?.result as string);
        const result = validateResumeJSON(json);
        if (result.valid && result.data) {
          dispatch({ type: 'SET_RESUME', payload: result.data });
        } else {
          alert('Invalid resume file:\n' + result.errors.join('\n'));
        }
      } catch { alert('Failed to parse JSON file'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-surface)] backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-bold tracking-tight text-[var(--color-primary)]">Reassume</h1>
        <span className="hidden sm:inline text-xs text-[var(--color-text-muted)]">ATS Resume Builder</span>
      </div>

      <nav className="flex items-center gap-1 sm:gap-2 flex-wrap">
        <Btn onClick={() => dispatch({ type: 'NEW_RESUME' })}>New</Btn>
        <Btn onClick={() => dispatch({ type: 'LOAD_SAMPLE' })}>Sample</Btn>
        <Btn onClick={() => fileRef.current?.click()}>Import</Btn>
        <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />

        <div className="relative">
          <Btn onClick={() => setShowExport(!showExport)}>Export ▾</Btn>
          {showExport && (
            <div className="absolute right-0 mt-1 w-40 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-lg py-1 z-50">
              <DropItem onClick={() => { exportPDF(); setShowExport(false); }}>Export PDF</DropItem>
              <DropItem onClick={() => { exportDOCX(state.resume); setShowExport(false); }}>Export DOCX</DropItem>
              <DropItem onClick={() => { exportJSON(state.resume); setShowExport(false); }}>Export JSON</DropItem>
            </div>
          )}
        </div>

        <Btn onClick={() => dispatch({ type: 'CLONE_RESUME' })}>Clone</Btn>

        <button
          onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
          className="p-2 rounded-lg hover:bg-[var(--color-surface-alt)] transition-colors text-sm"
          aria-label="Toggle theme"
        >
          {state.isDark ? '☀️' : '🌙'}
        </button>
      </nav>
    </header>
  );
}

function Btn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-alt)] transition-colors"
    >
      {children}
    </button>
  );
}

function DropItem({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--color-surface-alt)] transition-colors">
      {children}
    </button>
  );
}
