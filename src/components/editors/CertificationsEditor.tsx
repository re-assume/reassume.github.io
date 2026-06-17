import { useApp } from '../../context/AppContext';
import { Section, Input, AddButton, RemoveButton } from '../FormControls';
import { v4 as uuid } from 'uuid';

export default function CertificationsEditor() {
  const { state, updateField } = useApp();
  const items = state.resume.certifications;

  const add = () => {
    updateField('certifications', [...items, { id: uuid(), name: '', issuer: '', date: '', url: '' }]);
  };

  const update = (id: string, field: string, value: string) => {
    updateField('certifications', items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const remove = (id: string) => {
    updateField('certifications', items.filter(i => i.id !== id));
  };

  return (
    <Section title={`Certifications (${items.length})`}>
      {items.map(cert => (
        <div key={cert.id} className="border border-[var(--color-border)] rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{cert.name || 'New Certification'}</span>
            <RemoveButton onClick={() => remove(cert.id)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input label="Name" value={cert.name} onChange={v => update(cert.id, 'name', v)} />
            <Input label="Issuer" value={cert.issuer} onChange={v => update(cert.id, 'issuer', v)} />
            <Input label="Date" value={cert.date} onChange={v => update(cert.id, 'date', v)} placeholder="2022-06" />
            <Input label="URL" value={cert.url} onChange={v => update(cert.id, 'url', v)} />
          </div>
        </div>
      ))}
      <AddButton onClick={add} label="Add Certification" />
    </Section>
  );
}
