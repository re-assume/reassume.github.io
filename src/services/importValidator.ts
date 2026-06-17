import { ResumeData } from '../types/resume';
import { SCHEMA_VERSION } from '../data/sampleResume';

export interface ValidationResult {
  valid: boolean;
  data?: ResumeData;
  errors: string[];
}

export function validateResumeJSON(input: unknown): ValidationResult {
  const errors: string[] = [];

  if (!input || typeof input !== 'object') {
    return { valid: false, errors: ['Input is not a valid JSON object'] };
  }

  const data = input as Record<string, unknown>;

  if (!data.schemaVersion) errors.push('Missing schemaVersion field');
  if (!data.personalInfo || typeof data.personalInfo !== 'object') errors.push('Missing or invalid personalInfo');
  if (!data.metadata || typeof data.metadata !== 'object') errors.push('Missing metadata');

  if (errors.length > 0) return { valid: false, errors };

  // Migrate older schemas if needed
  const resume = migrateSchema(data as unknown as ResumeData);

  return { valid: true, data: resume, errors: [] };
}

function migrateSchema(data: ResumeData): ResumeData {
  return {
    schemaVersion: SCHEMA_VERSION,
    metadata: data.metadata || { id: crypto.randomUUID(), name: 'Imported Resume', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    personalInfo: data.personalInfo || { fullName: '', targetRole: '', phone: '', email: '', location: '', linkedin: '', portfolio: '', github: '' },
    summary: data.summary || '',
    experience: data.experience || [],
    education: data.education || [],
    skills: data.skills || [],
    projects: data.projects || [],
    certifications: data.certifications || [],
    languages: data.languages || [],
    achievements: data.achievements || [],
    internships: data.internships || [],
    volunteerExperience: data.volunteerExperience || [],
    publications: data.publications || [],
    awards: data.awards || [],
    customSections: data.customSections || [],
    templateChoice: data.templateChoice || 'classic',
  };
}
