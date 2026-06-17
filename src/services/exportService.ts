import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopPosition, TabStopType } from 'docx';
import { saveAs } from 'file-saver';
import { ResumeData } from '../types/resume';

export function exportJSON(resume: ResumeData) {
  const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' });
  const name = resume.personalInfo.fullName || 'resume';
  saveAs(blob, `${name.replace(/\s+/g, '_')}_resume.json`);
}

export function exportPDF() {
  window.print();
}

export async function exportDOCX(resume: ResumeData) {
  const sections: Paragraph[] = [];
  const { personalInfo, summary, experience, education, skills, projects, certifications } = resume;

  // Header - Name
  sections.push(new Paragraph({
    children: [new TextRun({ text: personalInfo.fullName, bold: true, size: 32 })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
  }));

  // Contact line
  const contactParts = [personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin].filter(Boolean);
  if (contactParts.length) {
    sections.push(new Paragraph({
      children: [new TextRun({ text: contactParts.join(' | '), size: 20 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }));
  }

  // Target role
  if (personalInfo.targetRole) {
    sections.push(new Paragraph({
      children: [new TextRun({ text: personalInfo.targetRole, italics: true, size: 22 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    }));
  }

  // Summary
  if (summary) {
    sections.push(sectionHeading('Professional Summary'));
    sections.push(new Paragraph({ children: [new TextRun({ text: summary, size: 22 })], spacing: { after: 200 } }));
  }

  // Experience
  if (experience.length) {
    sections.push(sectionHeading('Experience'));
    experience.forEach(exp => {
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: exp.role, bold: true, size: 22 }),
          new TextRun({ text: ` — ${exp.company}`, size: 22 }),
        ],
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { before: 100 },
      }));
      sections.push(new Paragraph({
        children: [new TextRun({ text: `${exp.startDate} – ${exp.current ? 'Present' : exp.endDate} | ${exp.location}`, italics: true, size: 20 })],
        spacing: { after: 50 },
      }));
      exp.bullets.forEach(b => {
        if (b.trim()) sections.push(new Paragraph({
          children: [new TextRun({ text: b, size: 22 })],
          bullet: { level: 0 },
          spacing: { after: 30 },
        }));
      });
    });
  }

  // Education
  if (education.length) {
    sections.push(sectionHeading('Education'));
    education.forEach(edu => {
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: `${edu.degree} in ${edu.field}`, bold: true, size: 22 }),
          new TextRun({ text: ` — ${edu.institution}`, size: 22 }),
        ],
        spacing: { before: 100 },
      }));
      sections.push(new Paragraph({
        children: [new TextRun({ text: `${edu.startDate} – ${edu.endDate}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}`, italics: true, size: 20 })],
        spacing: { after: 50 },
      }));
    });
  }

  // Skills
  if (skills.length) {
    sections.push(sectionHeading('Skills'));
    skills.forEach(s => {
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: `${s.category}: `, bold: true, size: 22 }),
          new TextRun({ text: s.items.join(', '), size: 22 }),
        ],
        spacing: { after: 50 },
      }));
    });
  }

  // Projects
  if (projects.length) {
    sections.push(sectionHeading('Projects'));
    projects.forEach(p => {
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: p.name, bold: true, size: 22 }),
          new TextRun({ text: p.technologies.length ? ` (${p.technologies.join(', ')})` : '', size: 20 }),
        ],
        spacing: { before: 100 },
      }));
      p.bullets.forEach(b => {
        if (b.trim()) sections.push(new Paragraph({
          children: [new TextRun({ text: b, size: 22 })],
          bullet: { level: 0 },
          spacing: { after: 30 },
        }));
      });
    });
  }

  // Certifications
  if (certifications.length) {
    sections.push(sectionHeading('Certifications'));
    certifications.forEach(c => {
      sections.push(new Paragraph({
        children: [new TextRun({ text: `${c.name} — ${c.issuer} (${c.date})`, size: 22 })],
        spacing: { after: 50 },
      }));
    });
  }

  const doc = new Document({
    sections: [{ children: sections }],
  });

  const blob = await Packer.toBlob(doc);
  const name = personalInfo.fullName || 'resume';
  saveAs(blob, `${name.replace(/\s+/g, '_')}_resume.docx`);
}

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 24 })],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 100 },
    border: { bottom: { style: 'single' as never, size: 6, color: '999999' } },
  });
}
