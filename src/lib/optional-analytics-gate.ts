import type { CookieConsentChoice } from './cookie-consent';

export type GoogleTagState = {
  scriptInserted: boolean;
  scriptLoaded: boolean;
  configured: boolean;
  consent: CookieConsentChoice | null;
};

export type GoogleTagAction = 'insert-script' | 'config' | 'deny';

const idleGoogleTag: GoogleTagState = {
  scriptInserted: false,
  scriptLoaded: false,
  configured: false,
  consent: null,
};

/** Script insertion is not configuration. Config runs only after the script has loaded and consent is still allow. */
export function reduceGoogleTag(
  state: GoogleTagState,
  event: 'allow' | 'deny' | 'script-load'
): { state: GoogleTagState; actions: GoogleTagAction[] } {
  if (event === 'deny') {
    return {
      state: { ...state, consent: 'denied' },
      actions: state.configured ? ['deny'] : [],
    };
  }
  if (event === 'script-load') {
    const loaded = { ...state, scriptLoaded: true };
    if (loaded.consent === 'accepted' && !loaded.configured) {
      return { state: { ...loaded, configured: true }, actions: ['config'] };
    }
    return { state: loaded, actions: [] };
  }
  const allowed = { ...state, consent: 'accepted' as const };
  if (!allowed.scriptInserted) {
    return { state: { ...allowed, scriptInserted: true }, actions: ['insert-script'] };
  }
  if (allowed.scriptLoaded && !allowed.configured) {
    return { state: { ...allowed, configured: true }, actions: ['config'] };
  }
  return { state: allowed, actions: [] };
}

export function initialGoogleTagState(): GoogleTagState {
  return { ...idleGoogleTag };
}

export type AnalyticsCall =
  | { provider: 'posthog'; method: 'init' | 'optIn' | 'startSessionRecording' | 'stopSessionRecording' | 'optOut' | 'identify' }
  | { provider: 'google'; method: 'config' | 'deny' };

/**
 * What optional analytics may do for a consent state. Null means no decision yet:
 * do not start, identify, or record. Denied never identifies and never starts a
 * library that is not already loaded.
 */
export function optionalAnalyticsCalls(
  choice: CookieConsentChoice | null,
  state: { posthogLoaded: boolean; googleLoaded: boolean },
  user?: { id: string }
): AnalyticsCall[] {
  if (choice === 'accepted') {
    const calls: AnalyticsCall[] = [
      state.posthogLoaded
        ? { provider: 'posthog', method: 'optIn' }
        : { provider: 'posthog', method: 'init' },
      { provider: 'posthog', method: 'startSessionRecording' },
    ];
    if (user) calls.push({ provider: 'posthog', method: 'identify' });
    if (!state.googleLoaded) calls.push({ provider: 'google', method: 'config' });
    return calls;
  }
  if (choice !== 'denied') return [];
  const calls: AnalyticsCall[] = [];
  if (state.posthogLoaded) {
    calls.push({ provider: 'posthog', method: 'stopSessionRecording' });
    calls.push({ provider: 'posthog', method: 'optOut' });
  }
  if (state.googleLoaded) calls.push({ provider: 'google', method: 'deny' });
  return calls;
}
