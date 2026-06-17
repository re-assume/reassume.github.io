import { useApp } from '../context/AppContext';

export default function PreviewPanel() {
  const { state, dispatch } = useApp();
  const { resume, zoom } = state;
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, achievements } = resume;

  return (
    <div className="h-full flex flex-col bg-[var(--color-surface-alt)]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <span className="text-xs font-medium text-[var(--color-text-muted)]">Preview</span>
        <div className="flex items-center gap-2">
          <button onClick={() => dispatch({ type: 'SET_ZOOM', payload: Math.max(50, zoom - 10) })} className="text-xs px-2 py-1 rounded border border-[var(--color-border)]">−</button>
          <span className="text-xs w-10 text-center">{zoom}%</span>
          <button onClick={() => dispatch({ type: 'SET_ZOOM', payload: Math.min(150, zoom + 10) })} className="text-xs px-2 py-1 rounded border border-[var(--color-border)]">+</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 flex justify-center">
        <div
          id="resume-preview"
          className="bg-white text-black shadow-lg w-[210mm] min-h-[297mm] px-[12mm] py-[10mm] origin-top"
          style={{ transform: `scale(${zoom / 100})`, fontFamily: "'Aptos', 'Calibri', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", fontSize: '10.5pt', lineHeight: '1.3' }}
        >
          {/* Name */}
          {personalInfo.fullName && (
            <h1 style={{ fontSize: '20pt', fontWeight: 700, textAlign: 'center', margin: '0 0 4px' }}>{personalInfo.fullName}</h1>
          )}

          {/* Target role */}
          {personalInfo.targetRole && (
            <p style={{ textAlign: 'center', fontSize: '11pt', color: '#444', margin: '0 0 6px' }}>{personalInfo.targetRole}</p>
          )}

          {/* Contact */}
          <ContactLine info={personalInfo} />

          {/* Summary */}
          {summary && (
            <>
              <SectionTitle>Professional Summary</SectionTitle>
              <p style={{ margin: '4px 0' }}>{summary}</p>
            </>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <>
              <SectionTitle>Experience</SectionTitle>
              {experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{exp.role}</strong>
                    <span style={{ fontSize: '10pt', color: '#555' }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div style={{ color: '#444' }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
                  <ul style={{ margin: '4px 0', paddingLeft: '18px' }}>
                    {exp.bullets.filter(b => b.trim()).map((b, i) => <li key={i} style={{ marginBottom: '2px' }}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </>
          )}

          {/* Education */}
          {education.length > 0 && (
            <>
              <SectionTitle>Education</SectionTitle>
              {education.map(edu => (
                <div key={edu.id} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{edu.degree} in {edu.field}</strong>
                    <span style={{ fontSize: '10pt', color: '#555' }}>{edu.startDate} – {edu.endDate}</span>
                  </div>
                  <div style={{ color: '#444' }}>{edu.institution}{edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</div>
                </div>
              ))}
            </>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <>
              <SectionTitle>Skills</SectionTitle>
              {skills.map(s => (
                <p key={s.id} style={{ margin: '2px 0' }}><strong>{s.category}:</strong> {s.items.join(', ')}</p>
              ))}
            </>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <>
              <SectionTitle>Projects</SectionTitle>
              {projects.map(p => (
                <div key={p.id} style={{ marginBottom: '8px' }}>
                  <strong>{p.name}</strong>{p.technologies.length > 0 && <span style={{ color: '#555' }}> ({p.technologies.join(', ')})</span>}
                  {p.description && <p style={{ margin: '2px 0', color: '#444' }}>{p.description}</p>}
                  <ul style={{ margin: '2px 0', paddingLeft: '18px' }}>
                    {p.bullets.filter(b => b.trim()).map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <>
              <SectionTitle>Certifications</SectionTitle>
              {certifications.map(c => (
                <p key={c.id} style={{ margin: '2px 0' }}>{c.name} — {c.issuer} ({c.date})</p>
              ))}
            </>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <>
              <SectionTitle>Languages</SectionTitle>
              <p>{languages.map(l => `${l.name} (${l.proficiency})`).join(' | ')}</p>
            </>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <>
              <SectionTitle>Achievements</SectionTitle>
              {achievements.map(a => (
                <p key={a.id} style={{ margin: '2px 0' }}><strong>{a.title}</strong>{a.date ? ` (${a.date})` : ''} — {a.description}</p>
              ))}
            </>
          )}

          {/* Empty state */}
          {!personalInfo.fullName && !summary && experience.length === 0 && (
            <div style={{ textAlign: 'center', color: '#999', paddingTop: '40%' }}>
              <p style={{ fontSize: '14pt' }}>Your resume preview will appear here</p>
              <p style={{ fontSize: '10pt' }}>Start editing on the left panel or load a sample</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: '12pt', fontWeight: 700, borderBottom: '1px solid #ccc', paddingBottom: '2px', margin: '14px 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {children}
    </h2>
  );
}

function ContactLine({ info }: { info: { email: string; phone: string; location: string; linkedin: string; portfolio: string; github: string } }) {
  const parts = [info.email, info.phone, info.location, info.linkedin, info.github, info.portfolio].filter(Boolean);
  if (!parts.length) return null;
  return <p style={{ textAlign: 'center', fontSize: '9.5pt', color: '#555', margin: '0 0 10px' }}>{parts.join(' | ')}</p>;
}
