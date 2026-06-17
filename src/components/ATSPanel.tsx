import { useApp } from '../context/AppContext';
import { analyzeATS } from '../services/atsAnalyzer';
import { TextArea } from './FormControls';

export default function ATSPanel() {
  const { state, dispatch } = useApp();
  const issues = analyzeATS(state.resume, state.jobDescription);

  const errors = issues.filter(i => i.severity === 'error');
  const warnings = issues.filter(i => i.severity === 'warning');
  const infos = issues.filter(i => i.severity === 'info');

  const score = Math.max(0, 100 - errors.length * 15 - warnings.length * 5);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-2xl font-bold ${
          score >= 80 ? 'bg-green-100 text-green-700' : score >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
        }`}>
          {score}
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-2">ATS Score</p>
      </div>

      <TextArea
        label="Job Description (paste to analyze keyword match)"
        value={state.jobDescription}
        onChange={v => dispatch({ type: 'SET_JOB_DESCRIPTION', payload: v })}
        placeholder="Paste the job description here..."
        rows={5}
      />

      {errors.length > 0 && (
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-red-600">Errors ({errors.length})</h3>
          {errors.map((issue, i) => <IssueItem key={i} issue={issue} />)}
        </div>
      )}

      {warnings.length > 0 && (
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-yellow-600">Warnings ({warnings.length})</h3>
          {warnings.map((issue, i) => <IssueItem key={i} issue={issue} />)}
        </div>
      )}

      {infos.length > 0 && (
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-blue-600">Info ({infos.length})</h3>
          {infos.map((issue, i) => <IssueItem key={i} issue={issue} />)}
        </div>
      )}
    </div>
  );
}

function IssueItem({ issue }: { issue: { severity: string; section: string; message: string } }) {
  const colors = { error: 'border-red-300 bg-red-50', warning: 'border-yellow-300 bg-yellow-50', info: 'border-blue-300 bg-blue-50' };
  return (
    <div className={`p-2 rounded border text-xs ${colors[issue.severity as keyof typeof colors] || ''}`}>
      <span className="font-medium">{issue.section}:</span> {issue.message}
    </div>
  );
}
