import { ResumeData, ATSIssue } from '../types/resume';

export function analyzeATS(resume: ResumeData, jobDescription: string): ATSIssue[] {
  const issues: ATSIssue[] = [];
  const { personalInfo, summary, experience, education, skills } = resume;

  // Contact completeness
  if (!personalInfo.fullName) issues.push({ severity: 'error', section: 'Personal Info', message: 'Full name is missing' });
  if (!personalInfo.email) issues.push({ severity: 'error', section: 'Personal Info', message: 'Email address is missing' });
  if (!personalInfo.phone) issues.push({ severity: 'warning', section: 'Personal Info', message: 'Phone number is missing' });
  if (!personalInfo.location) issues.push({ severity: 'warning', section: 'Personal Info', message: 'Location is missing' });
  if (!personalInfo.targetRole) issues.push({ severity: 'warning', section: 'Personal Info', message: 'Target role/headline is missing' });
  if (!personalInfo.linkedin) issues.push({ severity: 'info', section: 'Personal Info', message: 'LinkedIn profile not provided' });

  // Summary
  if (!summary) {
    issues.push({ severity: 'error', section: 'Summary', message: 'Professional summary is missing' });
  } else {
    if (summary.length < 50) issues.push({ severity: 'warning', section: 'Summary', message: 'Summary is too short — aim for 3-4 sentences' });
    if (summary.length > 500) issues.push({ severity: 'warning', section: 'Summary', message: 'Summary is too long — keep it concise' });
  }

  // Experience
  if (experience.length === 0) {
    issues.push({ severity: 'error', section: 'Experience', message: 'No work experience listed' });
  }
  experience.forEach((exp, i) => {
    if (exp.bullets.filter(b => b.trim()).length < 2) {
      issues.push({ severity: 'warning', section: 'Experience', message: `"${exp.role || `Entry ${i + 1}`}" has fewer than 2 bullet points` });
    }
    exp.bullets.forEach(bullet => {
      if (bullet && !/\d/.test(bullet)) {
        issues.push({ severity: 'info', section: 'Experience', message: `Bullet "${bullet.slice(0, 40)}..." lacks measurable results` });
      }
      if (bullet && bullet.length > 200) {
        issues.push({ severity: 'warning', section: 'Experience', message: `Bullet is too long (${bullet.length} chars): "${bullet.slice(0, 40)}..."` });
      }
    });
    if (!exp.startDate) issues.push({ severity: 'warning', section: 'Experience', message: `"${exp.role}" is missing start date` });
  });

  // Education
  if (education.length === 0) {
    issues.push({ severity: 'warning', section: 'Education', message: 'No education listed' });
  }

  // Skills
  if (skills.length === 0) {
    issues.push({ severity: 'warning', section: 'Skills', message: 'No skills section — ATS often scans for keywords here' });
  }

  // Keyword matching with JD
  if (jobDescription.trim()) {
    const jdLower = jobDescription.toLowerCase();
    const resumeText = JSON.stringify(resume).toLowerCase();
    const techKeywords = extractTechKeywords(jdLower);
    const missing = techKeywords.filter(kw => !resumeText.includes(kw.toLowerCase()));
    if (missing.length > 0) {
      issues.push({ severity: 'warning', section: 'Keywords', message: `Missing JD keywords: ${missing.slice(0, 8).join(', ')}` });
    }
    const matchRatio = techKeywords.length > 0 ? ((techKeywords.length - missing.length) / techKeywords.length * 100).toFixed(0) : '0';
    issues.push({ severity: 'info', section: 'Keywords', message: `Keyword match: ${matchRatio}% (${techKeywords.length - missing.length}/${techKeywords.length} keywords found)` });
  } else {
    issues.push({ severity: 'info', section: 'Keywords', message: 'Paste a job description to check keyword alignment' });
  }

  return issues;
}

function extractTechKeywords(text: string): string[] {
  const keywords = new Set<string>();
  const patterns = [
    'javascript', 'typescript', 'python', 'java', 'c\\+\\+', 'c#', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin',
    'react', 'angular', 'vue', 'next\\.js', 'node\\.js', 'express', 'django', 'flask', 'spring',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'ci/cd',
    'sql', 'nosql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
    'graphql', 'rest', 'microservices', 'agile', 'scrum', 'git', 'jira',
    'machine learning', 'deep learning', 'data science', 'tensorflow', 'pytorch',
    'figma', 'sketch', 'adobe', 'html', 'css', 'sass', 'tailwind',
  ];
  patterns.forEach(p => {
    if (new RegExp(`\\b${p}\\b`, 'i').test(text)) keywords.add(p.replace(/\\\+/g, '+').replace(/\\./g, '.'));
  });
  return Array.from(keywords);
}
