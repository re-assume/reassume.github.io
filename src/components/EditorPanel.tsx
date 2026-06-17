import { useApp } from '../context/AppContext';
import { Input, TextArea, Section } from './FormControls';
import ExperienceEditor from './editors/ExperienceEditor';
import EducationEditor from './editors/EducationEditor';
import SkillsEditor from './editors/SkillsEditor';
import ProjectsEditor from './editors/ProjectsEditor';
import CertificationsEditor from './editors/CertificationsEditor';
import LanguagesEditor from './editors/LanguagesEditor';
import AchievementsEditor from './editors/AchievementsEditor';

export default function EditorPanel() {
  const { state, dispatch } = useApp();
  const { personalInfo, summary } = state.resume;

  const updatePI = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: { [field]: value } });
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-3">
      <Section title="Personal Information" defaultOpen={true}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Full Name" value={personalInfo.fullName} onChange={v => updatePI('fullName', v)} placeholder="John Doe" />
          <Input label="Target Role" value={personalInfo.targetRole} onChange={v => updatePI('targetRole', v)} placeholder="Senior Software Engineer" />
          <Input label="Email" value={personalInfo.email} onChange={v => updatePI('email', v)} placeholder="john@email.com" type="email" />
          <Input label="Phone" value={personalInfo.phone} onChange={v => updatePI('phone', v)} placeholder="+1 (555) 123-4567" />
          <Input label="Location" value={personalInfo.location} onChange={v => updatePI('location', v)} placeholder="San Francisco, CA" />
          <Input label="LinkedIn" value={personalInfo.linkedin} onChange={v => updatePI('linkedin', v)} placeholder="linkedin.com/in/johndoe" />
          <Input label="Portfolio" value={personalInfo.portfolio} onChange={v => updatePI('portfolio', v)} placeholder="johndoe.dev" />
          <Input label="GitHub" value={personalInfo.github} onChange={v => updatePI('github', v)} placeholder="github.com/johndoe" />
        </div>
      </Section>

      <Section title="Professional Summary" defaultOpen={true}>
        <TextArea
          label="Summary"
          value={summary}
          onChange={v => dispatch({ type: 'UPDATE_RESUME', payload: { summary: v } })}
          placeholder="Write a 3-4 sentence professional summary..."
          rows={4}
        />
      </Section>

      <ExperienceEditor />
      <EducationEditor />
      <SkillsEditor />
      <ProjectsEditor />
      <CertificationsEditor />
      <LanguagesEditor />
      <AchievementsEditor />
    </div>
  );
}
