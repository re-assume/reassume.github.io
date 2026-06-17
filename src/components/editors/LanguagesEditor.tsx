import { useApp } from '../../context/AppContext';
import { Section, Input, AddButton, RemoveButton } from '../FormControls';
import { v4 as uuid } from 'uuid';

export default function LanguagesEditor() {
  const { state, updateField } = useApp();
  const items = state.resume.languages;

  const add = () => {
    updateField('languages', [...items, { id: uuid(), name: '', proficiency: '' }]);
  };

  const update = (id: string, field: string, value: string) => {
    updateField('languages', items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const remove = (id: string) => {
    updateField('languages', items.filter(i => i.id !== id));
  };

  return (
    <Section title={`Languages (${items.length})`}>
      {items.map(lang => (
        <div key={lang.id} className="border border-[var(--color-border)] rounded-lg p-3 flex gap-2 items-end">
          <div className="flex-1"><Input label="Language" value={lang.name} onChange={v => update(lang.id, 'name', v)} /></div>
          <div className="flex-1"><Input label="Proficiency" value={lang.proficiency} onChange={v => update(lang.id, 'proficiency', v)} placeholder="Native / Fluent / Conversational" /></div>
          <RemoveButton onClick={() => remove(lang.id)} />
        </div>
      ))}
      <AddButton onClick={add} label="Add Language" />
    </Section>
  );
}
