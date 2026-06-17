import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import MobileTabs from './components/MobileTabs';
import EditorPanel from './components/EditorPanel';
import PreviewPanel from './components/PreviewPanel';
import ATSPanel from './components/ATSPanel';
import AIPanel from './components/AIPanel';

function AppContent() {
  const { state } = useApp();

  return (
    <div className="h-screen flex flex-col bg-[var(--color-surface)] text-[var(--color-text)]">
      <Header />
      <MobileTabs />
      <main className="flex-1 flex overflow-hidden">
        {/* Desktop: side by side. Mobile: toggled panels */}
        <div className={`md:w-[45%] md:border-r md:border-[var(--color-border)] md:block ${state.activePanel === 'editor' ? 'block w-full' : 'hidden'}`}>
          <EditorPanel />
        </div>
        <div className={`md:flex-1 md:block ${state.activePanel === 'preview' ? 'block w-full' : 'hidden md:block'}`}>
          <PreviewPanel />
        </div>
        <div className={`md:hidden ${state.activePanel === 'ats' ? 'block w-full' : 'hidden'}`}>
          <ATSPanel />
        </div>
        <div className={`md:hidden ${state.activePanel === 'ai' ? 'block w-full' : 'hidden'}`}>
          <AIPanel />
        </div>
      </main>

      {/* Desktop sidebar toggles for ATS and AI */}
      <DesktopSidePanels />
    </div>
  );
}

function DesktopSidePanels() {
  const { state, dispatch } = useApp();

  return (
    <div className="hidden md:flex fixed right-0 top-12 bottom-0 z-40">
      {/* Side toggle buttons */}
      <div className="flex flex-col gap-1 p-1">
        <SideBtn active={state.activePanel === 'ats'} onClick={() => dispatch({ type: 'SET_PANEL', payload: state.activePanel === 'ats' ? 'preview' : 'ats' })} label="ATS" />
        <SideBtn active={state.activePanel === 'ai'} onClick={() => dispatch({ type: 'SET_PANEL', payload: state.activePanel === 'ai' ? 'preview' : 'ai' })} label="AI" />
      </div>

      {/* Panel drawer */}
      {(state.activePanel === 'ats' || state.activePanel === 'ai') && (
        <div className="w-80 border-l border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg">
          {state.activePanel === 'ats' && <ATSPanel />}
          {state.activePanel === 'ai' && <AIPanel />}
        </div>
      )}
    </div>
  );
}

function SideBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-3 text-xs font-medium rounded-l-lg border border-r-0 border-[var(--color-border)] transition-colors writing-mode-vertical ${
        active ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface)] hover:bg-[var(--color-surface-alt)]'
      }`}
      style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
    >
      {label}
    </button>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
