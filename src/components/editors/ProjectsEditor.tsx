import { useApp } from '../../context/AppContext';
import { Section, Input, AddButton, RemoveButton } from '../FormControls';
import { v4 as uuid } from 'uuid';

export default function ProjectsEditor() {
  const { state, updateField } = useApp();
  const items = state.resume.projects;

  const add = () => {
    updateField('projects', [...items, { id: uuid(), name: '', description: '', technologies: [], url: '', bullets: [''] }]);
  };

  const update = (id: string, field: string, value: unknown) => {
    updateField('projects', items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const remove = (id: string) => {
    updateField('projects', items.filter(i => i.id !== id));
  };

  const updateBullet = (id: string, idx: number, value: string) => {
    updateField('projects', items.map(i => i.id === id ? { ...i, bullets: i.bullets.map((b, j) => j === idx ? value : b) } : i));
  };

  const addBullet = (id: string) => {
    updateField('projects', items.map(i => i.id === id ? { ...i, bullets: [...i.bullets, ''] } : i));
  };

  return (
    <Section title={`Projects (${items.length})`}>
      {items.map(proj => (
        <div key={proj.id} className="border border-[var(--color-border)] rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{proj.name || 'New Project'}</span>
            <RemoveButton onClick={() => remove(proj.id)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input label="Name" value={proj.name} onChange={v => update(proj.id, 'name', v)} />
            <Input label="URL" value={proj.url} onChange={v => update(proj.id, 'url', v)} />
          </div>
          <Input label="Description" value={proj.description} onChange={v => update(proj.id, 'description', v)} />
          <Input
            label="Technologies (comma separated)"
            value={proj.technologies.join(', ')}
            onChange={v => update(proj.id, 'technologies', v.split(',').map(s => s.trim()).filter(Boolean))}
          />
          <div className="space-y-1">
            <span className="text-xs font-medium text-[var(--color-text-muted)]">Bullet Points</span>
            {proj.bullets.map((b, idx) => (
              <div key={idx} className="flex gap-1">
                <input
                  value={b}
                  onChange={e => updateBullet(proj.id, idx, e.target.value)}
                  placeholder="Describe what you built..."
                  className="flex-1 px-2 py-1.5 text-sm bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
              </div>
            ))}
            <button onClick={() => addBullet(proj.id)} className="text-xs text-[var(--color-primary)] hover:underline">+ Add bullet</button>
          </div>
        </div>
      ))}
      <AddButton onClick={add} label="Add Project" />
    </Section>
  );
}
