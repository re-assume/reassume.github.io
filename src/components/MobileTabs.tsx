import { useApp } from '../context/AppContext';
import { ActivePanel } from '../types/resume';

const tabs: { id: ActivePanel; label: string }[] = [
  { id: 'editor', label: 'Edit' },
  { id: 'preview', label: 'Preview' },
  { id: 'ats', label: 'ATS' },
  { id: 'ai', label: 'AI' },
];

export default function MobileTabs() {
  const { state, dispatch } = useApp();

  return (
    <div className="md:hidden flex border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => dispatch({ type: 'SET_PANEL', payload: t.id })}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            state.activePanel === t.id
              ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
              : 'text-[var(--color-text-muted)]'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
