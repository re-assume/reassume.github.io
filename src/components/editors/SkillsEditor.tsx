import { useApp } from '../../context/AppContext';
import { Section, Input, AddButton, RemoveButton } from '../FormControls';
import { v4 as uuid } from 'uuid';

export default function SkillsEditor() {
  const { state, updateField } = useApp();
  const items = state.resume.skills;

  const add = () => {
    updateField('skills', [...items, { id: uuid(), category: '', items: [] }]);
  };

  const update = (id: string, field: string, value: unknown) => {
    updateField('skills', items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const remove = (id: string) => {
    updateField('skills', items.filter(i => i.id !== id));
  };

  return (
    <Section title={`Skills (${items.length} categories)`}>
      {items.map(skill => (
        <div key={skill.id} className="border border-[var(--color-border)] rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{skill.category || 'New Category'}</span>
            <RemoveButton onClick={() => remove(skill.id)} />
          </div>
          <Input label="Category" value={skill.category} onChange={v => update(skill.id, 'category', v)} placeholder="Frontend" />
          <Input
            label="Skills (comma separated)"
            value={skill.items.join(', ')}
            onChange={v => update(skill.id, 'items', v.split(',').map(s => s.trim()).filter(Boolean))}
            placeholder="React, TypeScript, Tailwind CSS"
          />
        </div>
      ))}
      <AddButton onClick={add} label="Add Skill Category" />
    </Section>
  );
}
