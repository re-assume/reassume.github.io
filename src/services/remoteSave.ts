/**
 * Remote Save Architecture
 *
 * This module provides an OPTIONAL mechanism for saving resume JSON to a GitHub repository.
 * It is NOT active by default. The user must explicitly consent and configure it.
 *
 * ARCHITECTURE OPTIONS:
 * 1. GitHub Issue-based: Submit resume as a GitHub Issue (requires user's PAT or OAuth)
 * 2. Webhook-based: POST to a serverless function that commits to repo
 * 3. GitHub Actions dispatch: Trigger a workflow that writes the file
 *
 * SECURITY:
 * - No secrets are stored in the frontend code
 * - User must provide their own token or consent to OAuth
 * - Privacy notice is shown before any upload
 * - Resume data is only transmitted after explicit consent
 */

import { ResumeData } from '../types/resume';

export interface RemoteSaveConfig {
  enabled: boolean;
  method: 'webhook' | 'github-issue' | 'github-dispatch';
  endpoint?: string;
  token?: string;
}

let config: RemoteSaveConfig = { enabled: false, method: 'webhook' };

export function configureRemoteSave(cfg: RemoteSaveConfig) {
  config = cfg;
}

export function isRemoteSaveEnabled(): boolean {
  return config.enabled && !!config.endpoint;
}

export async function saveResumeRemotely(resume: ResumeData, consent: boolean): Promise<boolean> {
  if (!consent) {
    console.warn('Remote save requires explicit user consent.');
    return false;
  }
  if (!config.enabled || !config.endpoint) return false;

  const filename = `${resume.personalInfo.fullName.replace(/\s+/g, '_') || 'anonymous'}_${Date.now()}.json`;

  try {
    const res = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.token ? { Authorization: `Bearer ${config.token}` } : {}),
      },
      body: JSON.stringify({ filename, data: resume }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
