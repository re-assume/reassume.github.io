export interface AIRequest {
  action: string;
  text: string;
  jobDescription?: string;
  context?: string;
}

export interface AIResponse {
  result: string;
  keywords?: string[];
  score?: number;
}

export interface AIProvider {
  generate(req: AIRequest): Promise<AIResponse>;
  isAvailable(): boolean;
}

// Mock AI provider with realistic template responses
class MockAIProvider implements AIProvider {
  isAvailable() { return true; }

  async generate(req: AIRequest): Promise<AIResponse> {
    await new Promise(r => setTimeout(r, 800));

    switch (req.action) {
      case 'generate_summary':
        return { result: this.generateSummary(req) };
      case 'improve_bullet':
        return { result: this.improveBullet(req.text) };
      case 'rewrite_professional':
        return { result: this.rewriteProfessional(req.text) };
      case 'shorten':
        return { result: this.shorten(req.text) };
      case 'suggest_keywords':
        return { result: '', keywords: this.extractKeywords(req.jobDescription || '') };
      case 'tailor_to_job':
        return { result: this.tailorToJob(req.text, req.jobDescription || '') };
      case 'ats_friendly':
        return { result: this.makeATSFriendly(req.text) };
      default:
        return { result: req.text };
    }
  }

  private generateSummary(req: AIRequest): string {
    const role = req.context || 'professional';
    return `Results-driven ${role} with proven expertise in delivering high-impact solutions. Demonstrated ability to lead cross-functional teams and drive measurable business outcomes. Strong track record of optimizing processes and implementing scalable architectures.`;
  }

  private improveBullet(text: string): string {
    if (!text.trim()) return 'Led initiative that resulted in measurable improvement to key business metrics';
    const hasMetric = /\d/.test(text);
    if (!hasMetric) {
      return text.replace(/^(.*?)$/, 'Spearheaded $1, resulting in significant improvement to team productivity');
    }
    return `Drove ${text.toLowerCase().replace(/^i /, '').replace(/^we /, '')}`;
  }

  private rewriteProfessional(text: string): string {
    if (!text.trim()) return '';
    return text
      .replace(/helped/gi, 'facilitated')
      .replace(/made/gi, 'developed')
      .replace(/worked on/gi, 'spearheaded')
      .replace(/did/gi, 'executed')
      .replace(/got/gi, 'achieved')
      .replace(/^(.)/,  (_, c) => c.toUpperCase());
  }

  private shorten(text: string): string {
    const words = text.split(' ');
    if (words.length <= 10) return text;
    return words.slice(0, Math.ceil(words.length * 0.7)).join(' ');
  }

  private extractKeywords(jd: string): string[] {
    const common = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'REST API', 'GraphQL', 'CI/CD', 'Agile', 'Git', 'MongoDB', 'PostgreSQL', 'Redis', 'Microservices', 'TDD', 'Scrum'];
    const found = common.filter(kw => jd.toLowerCase().includes(kw.toLowerCase()));
    return found.length > 0 ? found : common.slice(0, 8);
  }

  private tailorToJob(text: string, _jd: string): string {
    return `${text} — aligned with role requirements and optimized for ATS keyword matching`;
  }

  private makeATSFriendly(text: string): string {
    return text
      .replace(/[•◦▪]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

// Configurable external AI provider
class ExternalAIProvider implements AIProvider {
  private endpoint: string;
  private apiKey: string;

  constructor(endpoint: string, apiKey: string) {
    this.endpoint = endpoint;
    this.apiKey = apiKey;
  }

  isAvailable() { return !!this.endpoint && !!this.apiKey; }

  async generate(req: AIRequest): Promise<AIResponse> {
    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.apiKey}` },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error('AI request failed');
    return res.json();
  }
}

let currentProvider: AIProvider = new MockAIProvider();

export function setAIProvider(provider: AIProvider) { currentProvider = provider; }
export function getAIProvider(): AIProvider { return currentProvider; }
export function configureExternalAI(endpoint: string, apiKey: string) {
  currentProvider = new ExternalAIProvider(endpoint, apiKey);
}
export function resetToMockAI() { currentProvider = new MockAIProvider(); }
