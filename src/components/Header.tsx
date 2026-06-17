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
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-xl">
      <div className="flex items-center gap-2.5">
        <img src="/logo.svg" alt="Reassume" className="w-7 h-7" />
        <div>
          <h1 className="text-base font-bold tracking-tight bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
            Reassume
          </h1>
        </div>
      </div>

      <nav className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        <Btn onClick={() => dispatch({ type: 'NEW_RESUME' })}>New</Btn>
        <Btn onClick={() => dispatch({ type: 'LOAD_SAMPLE' })}>Sample</Btn>
        <Btn onClick={() => fileRef.current?.click()}>Import</Btn>
        <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />

        <div className="relative">
          <Btn onClick={() => setShowExport(!showExport)} accent>Export ▾</Btn>
          {showExport && (
            <div className="absolute right-0 mt-2 w-44 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl shadow-[var(--color-primary)]/5 py-1 z-50 glow-border">
              <DropItem onClick={() => { exportPDF(); setShowExport(false); }}>📄 Export PDF</DropItem>
              <DropItem onClick={() => { exportDOCX(state.resume); setShowExport(false); }}>📝 Export DOCX</DropItem>
              <DropItem onClick={() => { exportJSON(state.resume); setShowExport(false); }}>💾 Export JSON</DropItem>
            </div>
          )}
        </div>

        <Btn onClick={() => dispatch({ type: 'CLONE_RESUME' })}>Clone</Btn>

        <button
          onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
          className="p-2 rounded-lg hover:bg-[var(--color-surface-alt)] transition-all duration-200 text-sm"
          aria-label="Toggle theme"
        >
          {state.isDark ? '☀️' : '🌙'}
        </button>
      </nav>
    </header>
  );
}

function Btn({ children, onClick, accent }: { children: React.ReactNode; onClick: () => void; accent?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
        accent
          ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-md shadow-[var(--color-primary)]/20 hover:shadow-lg hover:shadow-[var(--color-primary)]/30 hover:scale-[1.02]'
          : 'border border-[var(--color-border)] hover:bg-[var(--color-surface-alt)] hover:border-[var(--color-primary)]/30'
      }`}
    >
      {children}
    </button>
  );
}

function DropItem({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--color-surface-alt)] transition-colors">
      {children}
    </button>
  );
}
