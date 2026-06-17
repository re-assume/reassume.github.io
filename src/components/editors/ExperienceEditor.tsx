import { useApp } from '../../context/AppContext';
import { Experience } from '../../types/resume';
import { Section, Input, AddButton, RemoveButton } from '../FormControls';
import { v4 as uuid } from 'uuid';

export default function ExperienceEditor() {
  const { state, updateField } = useApp();
  const items = state.resume.experience;

  const add = () => {
    updateField('experience', [...items, { id: uuid(), company: '', role: '', location: '', startDate: '', endDate: '', current: false, bullets: [''] }]);
  };

  const update = (id: string, field: keyof Experience, value: unknown) => {
    updateField('experience', items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const remove = (id: string) => {
    updateField('experience', items.filter(i => i.id !== id));
  };

  const updateBullet = (id: string, idx: number, value: string) => {
    updateField('experience', items.map(i => i.id === id ? { ...i, bullets: i.bullets.map((b, j) => j === idx ? value : b) } : i));
  };

  const addBullet = (id: string) => {
    updateField('experience', items.map(i => i.id === id ? { ...i, bullets: [...i.bullets, ''] } : i));
  };

  const removeBullet = (id: string, idx: number) => {
    updateField('experience', items.map(i => i.id === id ? { ...i, bullets: i.bullets.filter((_, j) => j !== idx) } : i));
  };

  return (
    <Section title={`Work Experience (${items.length})`}>
      {items.map(exp => (
        <div key={exp.id} className="border border-[var(--color-border)] rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{exp.role || exp.company || 'New Entry'}</span>
            <RemoveButton onClick={() => remove(exp.id)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input label="Company" value={exp.company} onChange={v => update(exp.id, 'company', v)} />
            <Input label="Role" value={exp.role} onChange={v => update(exp.id, 'role', v)} />
            <Input label="Location" value={exp.location} onChange={v => update(exp.id, 'location', v)} />
            <Input label="Start Date" value={exp.startDate} onChange={v => update(exp.id, 'startDate', v)} placeholder="2021-03" />
            <Input label="End Date" value={exp.endDate} onChange={v => update(exp.id, 'endDate', v)} placeholder="2023-06" />
            <label className="flex items-center gap-2 text-xs pt-5">
              <input type="checkbox" checked={exp.current} onChange={e => update(exp.id, 'current', e.target.checked)} className="rounded" />
              Current position
            </label>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-medium text-[var(--color-text-muted)]">Bullet Points</span>
            {exp.bullets.map((b, idx) => (
              <div key={idx} className="flex gap-1">
                <input
                  value={b}
                  onChange={e => updateBullet(exp.id, idx, e.target.value)}
                  placeholder="Describe an achievement..."
                  className="flex-1 px-2 py-1.5 text-sm bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
                <button onClick={() => removeBullet(exp.id, idx)} className="text-red-400 hover:text-red-600 text-xs px-1">✕</button>
              </div>
            ))}
            <button onClick={() => addBullet(exp.id)} className="text-xs text-[var(--color-primary)] hover:underline">+ Add bullet</button>
          </div>
        </div>
      ))}
      <AddButton onClick={add} label="Add Experience" />
    </Section>
  );
}
