/**
 * MOCK ONLY. These providers are plain objects. This file does not import posthog-js,
 * load gtag, or open a network connection. Real TikTok traffic is checked separately
 * in the browser against a running server.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { initialGoogleTagState, optionalAnalyticsCalls, reduceGoogleTag, type AnalyticsCall } from '../src/lib/optional-analytics-gate';

function run(calls: AnalyticsCall[]) {
  const log: string[] = [];
  const posthog = {
    loaded: false,
    init() {
      log.push('posthog.init');
      this.loaded = true;
    },
    optIn() {
      log.push('posthog.optIn');
    },
    startSessionRecording() {
      log.push('posthog.startSessionRecording');
    },
    stopSessionRecording() {
      log.push('posthog.stopSessionRecording');
    },
    optOut() {
      log.push('posthog.optOut');
    },
    identify() {
      log.push('posthog.identify');
    },
  };
  const google = {
    loaded: false,
    config() {
      log.push('google.config');
      this.loaded = true;
    },
    deny() {
      log.push('google.deny');
    },
  };
  for (const call of calls) {
    if (call.provider === 'posthog') posthog[call.method]();
    else google[call.method]();
  }
  return { log, posthog, google };
}

const user = { id: 'person-1' };

test('mocked analytics stay idle before a choice and on reject when nothing is loaded', () => {
  assert.deepEqual(optionalAnalyticsCalls(null, { posthogLoaded: false, googleLoaded: false }, user), []);
  assert.deepEqual(run([]).log, []);
  const denied = optionalAnalyticsCalls('denied', { posthogLoaded: false, googleLoaded: false }, user);
  assert.deepEqual(denied, []);
  assert.equal(run(denied).log.includes('posthog.identify'), false);
  assert.equal(run(denied).log.includes('posthog.init'), false);
  assert.equal(run(denied).log.includes('google.config'), false);
});

test('mocked allow starts recording and identify, and withdraw stops them without identifying', () => {
  const allowed = optionalAnalyticsCalls('accepted', { posthogLoaded: false, googleLoaded: false }, user);
  const started = run(allowed);
  assert.deepEqual(started.log, [
    'posthog.init',
    'posthog.startSessionRecording',
    'posthog.identify',
    'google.config',
  ]);

  const withdrawn = optionalAnalyticsCalls('denied', {
    posthogLoaded: started.posthog.loaded,
    googleLoaded: started.google.loaded,
  }, user);
  const stopped = run(withdrawn);
  assert.deepEqual(stopped.log, ['posthog.stopSessionRecording', 'posthog.optOut', 'google.deny']);
  assert.equal(stopped.log.includes('posthog.identify'), false);
  assert.equal(stopped.log.includes('posthog.init'), false);
});

test('mocked PostHog does not keep a denied event to flush after a later allow', () => {
  const dropped: string[] = [];
  const remember = (choice: 'denied' | 'accepted', name: string) => {
    const calls = optionalAnalyticsCalls(choice, { posthogLoaded: false, googleLoaded: false });
    if (calls.some((call) => call.method === 'init' || call.method === 'optIn')) dropped.push(name);
  };
  remember('denied', 'pageview-while-denied');
  assert.deepEqual(dropped, []);
  const later = optionalAnalyticsCalls('accepted', { posthogLoaded: false, googleLoaded: false }, user);
  assert.equal(later.some((call) => call.method === 'identify'), true);
  assert.equal(JSON.stringify(later).includes('pageview-while-denied'), false);
});

test('mocked Google tag config waits until the script has loaded under allow', () => {
  let state = initialGoogleTagState();
  const log: string[] = [];
  const step = (event: 'allow' | 'deny' | 'script-load') => {
    const next = reduceGoogleTag(state, event);
    state = next.state;
    log.push(...next.actions);
  };
  step('allow');
  step('deny');
  step('script-load');
  assert.deepEqual(log, ['insert-script']);
  assert.equal(state.configured, false);
  step('allow');
  assert.deepEqual(log, ['insert-script', 'config']);
  assert.equal(state.configured, true);
  step('deny');
  assert.deepEqual(log.at(-1), 'deny');

  let early = initialGoogleTagState();
  const earlyLog: string[] = [];
  const earlyStep = (event: 'allow' | 'deny' | 'script-load') => {
    const next = reduceGoogleTag(early, event);
    early = next.state;
    earlyLog.push(...next.actions);
  };
  earlyStep('allow');
  earlyStep('deny');
  earlyStep('allow');
  assert.deepEqual(earlyLog, ['insert-script']);
  earlyStep('script-load');
  assert.deepEqual(earlyLog, ['insert-script', 'config']);
});
