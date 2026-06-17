import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getAIProvider } from '../services/aiProvider';
import { TextArea } from './FormControls';

const AI_ACTIONS = [
  { action: 'generate_summary', label: 'Generate Summary', desc: 'Create a professional summary' },
  { action: 'improve_bullet', label: 'Improve Bullet', desc: 'Strengthen a bullet point' },
  { action: 'rewrite_professional', label: 'Professionalize', desc: 'Rewrite in professional tone' },
  { action: 'shorten', label: 'Shorten', desc: 'Make text more concise' },
  { action: 'suggest_keywords', label: 'Suggest Keywords', desc: 'Extract keywords from JD' },
  { action: 'tailor_to_job', label: 'Tailor to Job', desc: 'Align text with job description' },
  { action: 'ats_friendly', label: 'ATS Friendly', desc: 'Clean text for ATS compatibility' },
];

export default function AIPanel() {
  const { state } = useApp();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState('improve_bullet');

  const handleGenerate = async () => {
    if (!input.trim() && selectedAction !== 'suggest_keywords' && selectedAction !== 'generate_summary') return;
    setLoading(true);
    try {
      const provider = getAIProvider();
      const res = await provider.generate({
        action: selectedAction,
        text: input,
        jobDescription: state.jobDescription,
        context: state.resume.personalInfo.targetRole,
      });
      if (res.keywords) {
        setOutput(`Keywords: ${res.keywords.join(', ')}`);
      } else {
        setOutput(res.result);
      }
    } catch (err) {
      setOutput('AI generation failed. Using mock mode.');
    } finally {
      setLoading(false);
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div>
        <h2 className="text-sm font-semibold mb-2">AI Writing Assistant</h2>
        <p className="text-xs text-[var(--color-text-muted)]">Select an action and provide input text. Results can be copied into your resume.</p>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {AI_ACTIONS.map(a => (
          <button
            key={a.action}
            onClick={() => setSelectedAction(a.action)}
            className={`p-2 text-xs rounded-lg border transition-colors ${
              selectedAction === a.action
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                : 'border-[var(--color-border)] hover:bg-[var(--color-surface-alt)]'
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      <TextArea
        label="Input Text"
        value={input}
        onChange={setInput}
        placeholder="Paste or type text to improve..."
        rows={4}
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full py-2 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-50 transition-colors"
      >
        {loading ? 'Generating...' : 'Generate'}
      </button>

      {output && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-[var(--color-text-muted)]">Result</span>
            <button onClick={copyOutput} className="text-xs text-[var(--color-primary)] hover:underline">Copy</button>
          </div>
          <div className="p-3 rounded-lg bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-sm whitespace-pre-wrap">
            {output}
          </div>
        </div>
      )}

      {!state.jobDescription && (
        <p className="text-xs text-[var(--color-text-muted)] italic">
          Tip: Paste a job description in the ATS panel to enable tailored suggestions.
        </p>
      )}
    </div>
  );
}
