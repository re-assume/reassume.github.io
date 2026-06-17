export interface PersonalInfo {
  fullName: string;
  targetRole: string;
  phone: string;
  email: string;
  location: string;
  linkedin: string;
  portfolio: string;
  github: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  bullets: string[];
}

export interface Skill {
  id: string;
  category: string;
  items: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url: string;
  bullets: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface Internship {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface VolunteerExperience {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url: string;
  description: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
  bullets: string[];
}

export interface ResumeData {
  schemaVersion: string;
  metadata: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  achievements: Achievement[];
  internships: Internship[];
  volunteerExperience: VolunteerExperience[];
  publications: Publication[];
  awards: Award[];
  customSections: CustomSection[];
  templateChoice: string;
}

export interface ATSIssue {
  severity: 'error' | 'warning' | 'info';
  section: string;
  message: string;
}

export interface AIAction {
  id: string;
  label: string;
  description: string;
  action: string;
}

export type ActivePanel = 'editor' | 'preview' | 'ats' | 'ai';
