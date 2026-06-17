import { useApp } from '../../context/AppContext';
import { Education } from '../../types/resume';
import { Section, Input, AddButton, RemoveButton } from '../FormControls';
import { v4 as uuid } from 'uuid';

export default function EducationEditor() {
  const { state, updateField } = useApp();
  const items = state.resume.education;

  const add = () => {
    updateField('education', [...items, { id: uuid(), institution: '', degree: '', field: '', location: '', startDate: '', endDate: '', gpa: '', bullets: [] }]);
  };

  const update = (id: string, field: keyof Education, value: unknown) => {
    updateField('education', items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const remove = (id: string) => {
    updateField('education', items.filter(i => i.id !== id));
  };

  return (
    <Section title={`Education (${items.length})`}>
      {items.map(edu => (
        <div key={edu.id} className="border border-[var(--color-border)] rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{edu.institution || 'New Entry'}</span>
            <RemoveButton onClick={() => remove(edu.id)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input label="Institution" value={edu.institution} onChange={v => update(edu.id, 'institution', v)} />
            <Input label="Degree" value={edu.degree} onChange={v => update(edu.id, 'degree', v)} placeholder="Bachelor of Science" />
            <Input label="Field of Study" value={edu.field} onChange={v => update(edu.id, 'field', v)} placeholder="Computer Science" />
            <Input label="Location" value={edu.location} onChange={v => update(edu.id, 'location', v)} />
            <Input label="Start Date" value={edu.startDate} onChange={v => update(edu.id, 'startDate', v)} placeholder="2014-08" />
            <Input label="End Date" value={edu.endDate} onChange={v => update(edu.id, 'endDate', v)} placeholder="2018-05" />
            <Input label="GPA" value={edu.gpa} onChange={v => update(edu.id, 'gpa', v)} placeholder="3.8" />
          </div>
        </div>
      ))}
      <AddButton onClick={add} label="Add Education" />
    </Section>
  );
}
