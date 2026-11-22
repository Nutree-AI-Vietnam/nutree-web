'use client';

import { useState } from 'react';
import { AdminBanner } from '@/components/admin/AdminBanner';
import { Button, Card, CardHeader } from '@/components/admin/ui/AdminUi';
import { adminErrorMessage, type AdminSession } from '@/hooks/useAdminSession';
import { importSupplements, type SupplementImportResult } from '@/lib/supplement-admin-api';

const CHUNK = 500;

interface Props {
  admin: AdminSession;
  onImported?: () => void;
}

/** Upload the curated JSON list the seed script already accepts, in batches of 500. */
export function SupplementImportPanel({ admin, onImported }: Props) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [records, setRecords] = useState<unknown[] | null>(null);
  const [readError, setReadError] = useState<string | null>(null);
  const [result, setResult] = useState<SupplementImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const disabled = admin.isPreviewMode || !admin.session;

  const readFile = async (file: File) => {
    setReadError(null);
    setResult(null);
    setError(null);
    setFileName(file.name);
    try {
      const text = await readText(file);
      const parsed = JSON.parse(text) as unknown;
      const list = Array.isArray(parsed)
        ? parsed
        : parsed && typeof parsed === 'object' && Array.isArray((parsed as { records?: unknown }).records)
          ? (parsed as { records: unknown[] }).records
          : null;
      if (!list) {
        setRecords(null);
        setReadError('File phải là một danh sách sản phẩm, hoặc một object có khóa records.');
        return;
      }
      setRecords(list);
    } catch {
      setRecords(null);
      setReadError('Không đọc được file. Dùng JSON hoặc JSON nén gzip.');
    }
  };

  const run = async (dryRun: boolean) => {
    if (!records?.length) return;
    setIsBusy(true);
    setError(null);
    try {
      const token = await admin.getValidToken();
      let combined = emptyResult(dryRun);
      for (let index = 0; index < records.length; index += CHUNK) {
        const part = await importSupplements(records.slice(index, index + CHUNK), dryRun, token, admin.environment);
        combined = addResult(combined, part);
      }
      setResult(combined);
      if (!dryRun) onImported?.();
    } catch (requestError) {
      setError(adminErrorMessage(requestError));
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <Card>
      <CardHeader
        icon="upload"
        title="Nhập file seed"
        description="Ghi vào catalog máy chủ, không phải file điện thoại tải về. Tối đa 500 sản phẩm mỗi lần gửi; file dài hơn được chia tự động. Chạy thử trước khi ghi."
      />
      <div className="grid gap-4 px-5 py-4">
        {readError && <AdminBanner tone="error" title="File không dùng được" message={readError} />}
        {error && <AdminBanner tone="error" title="Không nhập được" message={error} />}
        <label className="text-sm text-slate-600">
          File .json hoặc .json.gz
          <input
            className="mt-1 block w-full text-sm"
            type="file"
            accept=".json,.gz,application/json,application/gzip"
            disabled={disabled || isBusy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void readFile(file);
            }}
          />
        </label>
        {records && (
          <p className="text-sm text-slate-700">
            {fileName}: {records.length} sản phẩm.
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" disabled={disabled || !records?.length} isBusy={isBusy} onClick={() => void run(true)}>
            Chạy thử
          </Button>
          <Button variant="primary" disabled={disabled || !records?.length} isBusy={isBusy} onClick={() => void run(false)}>
            Ghi vào catalog
          </Button>
        </div>
        {result && <ImportSummary result={result} />}
      </div>
    </Card>
  );
}

function ImportSummary({ result }: { result: SupplementImportResult }) {
  const rows = [
    ['Đã nhận', result.received],
    ['Thêm mới', result.inserted],
    ['Cập nhật', result.updated],
    ['Không đổi', result.unchanged],
    ['Giữ vì đã duyệt', result.kept_reviewed],
    ['Giữ vì đang bán', result.kept_approved],
    ['Đưa vào hàng chờ', result.held_back],
    ['Bản ghi lỗi', result.invalid.length],
    ['Mã vạch bị bỏ', result.barcode_skips.length],
  ];
  return (
    <div className="grid gap-2">
      <p className="text-sm font-medium text-slate-800">{result.applied ? 'Đã ghi.' : 'Bản chạy thử, chưa ghi gì.'}</p>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3">
        {rows.map(([label, value]) => (
          <div key={String(label)} className="flex justify-between gap-3 border-b border-slate-100 py-1">
            <dt className="text-slate-500">{label}</dt>
            <dd className="font-medium text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
      {result.invalid.slice(0, 8).map((row) => (
        <p key={`${row.record}-${row.error}`} className="text-xs text-rose-700">
          {row.record}: {row.error}
        </p>
      ))}
    </div>
  );
}

function emptyResult(dryRun: boolean): SupplementImportResult {
  return {
    applied: !dryRun,
    received: 0,
    held_back: 0,
    inserted: 0,
    updated: 0,
    unchanged: 0,
    kept_reviewed: 0,
    kept_approved: 0,
    kept_approved_keys: [],
    invalid: [],
    barcode_skips: [],
  };
}

function addResult(total: SupplementImportResult, part: SupplementImportResult): SupplementImportResult {
  return {
    applied: total.applied && part.applied,
    received: total.received + part.received,
    held_back: total.held_back + part.held_back,
    inserted: total.inserted + part.inserted,
    updated: total.updated + part.updated,
    unchanged: total.unchanged + part.unchanged,
    kept_reviewed: total.kept_reviewed + part.kept_reviewed,
    kept_approved: total.kept_approved + part.kept_approved,
    kept_approved_keys: [...total.kept_approved_keys, ...part.kept_approved_keys],
    invalid: [...total.invalid, ...part.invalid],
    barcode_skips: [...total.barcode_skips, ...part.barcode_skips],
  };
}

async function readText(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const gzip = file.name.endsWith('.gz') || (bytes[0] === 0x1f && bytes[1] === 0x8b);
  if (!gzip) return new TextDecoder().decode(bytes);
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('gzip');
  }
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Response(stream).text();
}
