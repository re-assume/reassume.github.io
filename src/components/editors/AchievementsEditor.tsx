import { useApp } from '../../context/AppContext';
import { Section, Input, AddButton, RemoveButton } from '../FormControls';
import { v4 as uuid } from 'uuid';

export default function AchievementsEditor() {
  const { state, updateField } = useApp();
  const items = state.resume.achievements;

  const add = () => {
    updateField('achievements', [...items, { id: uuid(), title: '', description: '', date: '' }]);
  };

  const update = (id: string, field: string, value: string) => {
    updateField('achievements', items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const remove = (id: string) => {
    updateField('achievements', items.filter(i => i.id !== id));
  };

  return (
    <Section title={`Achievements (${items.length})`}>
      {items.map(item => (
        <div key={item.id} className="border border-[var(--color-border)] rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{item.title || 'New Achievement'}</span>
            <RemoveButton onClick={() => remove(item.id)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input label="Title" value={item.title} onChange={v => update(item.id, 'title', v)} />
            <Input label="Date" value={item.date} onChange={v => update(item.id, 'date', v)} placeholder="2022-09" />
          </div>
          <Input label="Description" value={item.description} onChange={v => update(item.id, 'description', v)} />
        </div>
      ))}
      <AddButton onClick={add} label="Add Achievement" />
    </Section>
  );
}
