import { ResumeData } from '../types/resume';
import { v4 as uuid } from 'uuid';

export const SCHEMA_VERSION = '1.0.0';

export const createEmptyResume = (): ResumeData => ({
  schemaVersion: SCHEMA_VERSION,
  metadata: {
    id: uuid(),
    name: 'Untitled Resume',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  personalInfo: {
    fullName: '',
    targetRole: '',
    phone: '',
    email: '',
    location: '',
    linkedin: '',
    portfolio: '',
    github: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  achievements: [],
  internships: [],
  volunteerExperience: [],
  publications: [],
  awards: [],
  customSections: [],
  templateChoice: 'classic',
});

export const sampleResume: ResumeData = {
  schemaVersion: SCHEMA_VERSION,
  metadata: {
    id: uuid(),
    name: 'Sample Resume',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  personalInfo: {
    fullName: 'Alex Johnson',
    targetRole: 'Senior Full-Stack Engineer',
    phone: '+1 (555) 123-4567',
    email: 'alex.johnson@email.com',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexjohnson',
    portfolio: 'alexjohnson.dev',
    github: 'github.com/alexjohnson',
  },
  summary: 'Senior Full-Stack Engineer with 6+ years of experience building scalable web applications. Proficient in React, Node.js, and cloud infrastructure. Led teams of 5+ engineers delivering products serving 2M+ users. Passionate about clean architecture, performance optimization, and developer experience.',
  experience: [
    {
      id: uuid(),
      company: 'TechCorp Inc.',
      role: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2021-03',
      endDate: '',
      current: true,
      bullets: [
        'Led migration of monolithic application to microservices architecture, reducing deployment time by 75%',
        'Designed and implemented real-time notification system handling 50K+ concurrent connections',
        'Mentored team of 4 junior engineers, establishing code review practices that reduced bug rate by 40%',
        'Optimized database queries resulting in 60% reduction in API response times',
      ],
    },
    {
      id: uuid(),
      company: 'StartupXYZ',
      role: 'Full-Stack Developer',
      location: 'Remote',
      startDate: '2018-06',
      endDate: '2021-02',
      current: false,
      bullets: [
        'Built customer-facing dashboard from scratch using React and TypeScript, serving 500K+ monthly users',
        'Implemented CI/CD pipeline with GitHub Actions reducing release cycle from 2 weeks to 2 days',
        'Developed RESTful APIs with Node.js and PostgreSQL handling 10K+ requests per minute',
      ],
    },
  ],
  education: [
    {
      id: uuid(),
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      location: 'Berkeley, CA',
      startDate: '2014-08',
      endDate: '2018-05',
      gpa: '3.8',
      bullets: ['Dean\'s List 2016-2018', 'Teaching Assistant for Data Structures'],
    },
  ],
  skills: [
    { id: uuid(), category: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'Go', 'SQL'] },
    { id: uuid(), category: 'Frontend', items: ['React', 'Next.js', 'Tailwind CSS', 'Redux', 'Vue.js'] },
    { id: uuid(), category: 'Backend', items: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'GraphQL'] },
    { id: uuid(), category: 'DevOps', items: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'] },
  ],
  projects: [
    {
      id: uuid(),
      name: 'OpenSource Analytics',
      description: 'Privacy-focused web analytics platform',
      technologies: ['React', 'Go', 'ClickHouse', 'Docker'],
      url: 'github.com/alexjohnson/os-analytics',
      bullets: [
        'Built open-source analytics tool with 2K+ GitHub stars',
        'Handles 1M+ events per day with sub-second query response times',
      ],
    },
  ],
  certifications: [
    { id: uuid(), name: 'AWS Solutions Architect - Associate', issuer: 'Amazon Web Services', date: '2022-06', url: '' },
  ],
  languages: [
    { id: uuid(), name: 'English', proficiency: 'Native' },
    { id: uuid(), name: 'Spanish', proficiency: 'Conversational' },
  ],
  achievements: [
    { id: uuid(), title: 'Hackathon Winner', description: 'First place at TechCrunch Disrupt Hackathon 2022', date: '2022-09' },
  ],
  internships: [],
  volunteerExperience: [],
  publications: [],
  awards: [],
  customSections: [],
  templateChoice: 'classic',
};
