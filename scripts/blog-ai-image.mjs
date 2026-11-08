// Generate a Nutree blog food photo via Cloudflare Workers AI (Flux), then crop/compress with blog:image.
//
//   npm run blog:ai-image -- --subject "One bowl of phở bò…" --out /blog/<slug>/<name>.jpg
//
// Requires CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN (Workers AI Edit) in the Nutree cloud env.

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';

const MODEL = '@cf/black-forest-labs/flux-1-schnell';
const ASPECTS = ['16:9', '3:2', '4:3'];
const OUT_PATTERN = /^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*\.jpg$/;
const MAX_SUBJECT_CHARS = 500;
const PROMPT_PREFIX = 'Photorealistic food photograph for a Vietnamese nutrition brand. ';
const PROMPT_SUFFIX =
  ' Shot at a 45-degree angle on a plain warm cream tabletop, soft natural daylight from the left, shallow depth of field, true-to-life single portion as sold in Vietnam, appetizing but honest, no styling props. No people, no hands, no text, no letters, no labels, no logos, no brand packaging, no watermark.';

const USAGE = `Usage:
  npm run blog:ai-image -- --subject "<English dish description>" --out /blog/<slug>/<name>.jpg [--aspect 16:9]

  --subject  Concrete English description of the food in the frame (required)
  --out      Where to save under public/: lowercase words and hyphens, ending in .jpg
  --aspect   ${ASPECTS.join(', ')} (default 16:9; covers must use 16:9)
  --width    Passed through to blog:image (optional)

Environment (Nutree cloud only — never print or commit):
  CLOUDFLARE_ACCOUNT_ID   Cloudflare account id
  CLOUDFLARE_API_TOKEN    API token with Workers AI Edit (and Read)`;

class UsageError extends Error {}

async function main() {
  const { values } = parseArgs({
    options: {
      subject: { type: 'string' },
      out: { type: 'string' },
      aspect: { type: 'string', default: '16:9' },
      width: { type: 'string' },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });

  if (values.help) {
    console.log(USAGE);
    return;
  }

  const subject = values.subject?.trim().replace(/\s+/g, ' ');
  if (!subject) throw new UsageError('--subject is required');
  if (subject.length > MAX_SUBJECT_CHARS) {
    throw new UsageError(`--subject must be at most ${MAX_SUBJECT_CHARS} characters`);
  }
  if (!values.out || !OUT_PATTERN.test(values.out)) {
    throw new UsageError(`--out must look like /blog/<slug>/<name>.jpg`);
  }
  if (!ASPECTS.includes(values.aspect ?? '')) {
    throw new UsageError(`--aspect must be one of ${ASPECTS.join(', ')}`);
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const token = process.env.CLOUDFLARE_API_TOKEN?.trim();
  if (!accountId) throw new UsageError('Set CLOUDFLARE_ACCOUNT_ID');
  if (!token) throw new UsageError('Set CLOUDFLARE_API_TOKEN');

  const prompt = `${PROMPT_PREFIX}${subject}${PROMPT_SUFFIX}`;
  if (prompt.length > 2000) {
    throw new UsageError('Subject makes the Flux prompt too long');
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${MODEL}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, steps: 8 }),
  });

  const rawText = await response.text();
  if (!response.ok) {
    throw new Error(
      `Workers AI ${response.status} ${response.statusText}: ${rawText.slice(0, 400)}`,
    );
  }

  let payload;
  try {
    payload = JSON.parse(rawText);
  } catch {
    throw new Error(`Workers AI returned non-JSON: ${rawText.slice(0, 400)}`);
  }

  const imageB64 = extractImageBase64(payload);
  if (!imageB64) {
    throw new Error(`Workers AI returned no image field: ${rawText.slice(0, 400)}`);
  }

  const buffer = Buffer.from(imageB64, 'base64');
  if (buffer.byteLength < 1024) {
    throw new Error(`Workers AI returned a suspiciously small image (${buffer.byteLength} bytes)`);
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nutree-blog-ai-'));
  const tmpFile = path.join(tmpDir, 'source.jpg');
  fs.writeFileSync(tmpFile, buffer);

  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const args = [
    path.join(root, 'scripts/blog-image.mjs'),
    '--input',
    tmpFile,
    '--out',
    values.out,
    '--aspect',
    values.aspect,
    '--ai',
  ];
  if (values.width) {
    args.push('--width', values.width);
  }

  const run = spawnSync(process.execPath, args, {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  });

  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {
    // temp cleanup is best-effort
  }

  if (run.status !== 0) {
    process.exit(run.status ?? 1);
  }
}

function extractImageBase64(payload) {
  const candidates = [
    payload?.result?.image,
    payload?.result?.b64_json,
    payload?.image,
    payload?.b64_json,
  ];
  for (const value of candidates) {
    if (typeof value === 'string' && value.length > 0) {
      return value.includes(',') ? value.split(',').pop() : value;
    }
  }
  return null;
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  if (error instanceof UsageError) {
    console.error(message);
    console.error(USAGE);
    process.exit(2);
  }
  console.error(`blog:ai-image failed: ${message}`);
  process.exit(1);
});
