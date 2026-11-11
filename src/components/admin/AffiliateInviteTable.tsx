import type { AffiliateInvite, AffiliateInviteStatus } from '@/types/affiliate-invite-admin';

const STATUS_LABELS: Record<AffiliateInviteStatus, string> = {
  open: 'Open',
  claimed: 'Claimed',
  expired: 'Expired',
  revoked: 'Revoked',
};

const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

interface Props {
  items: AffiliateInvite[];
  busyIds: ReadonlySet<string>;
  onRevoke: (invite: AffiliateInvite) => void;
}

/** Every invite with its state; tokens never reach this table. */
export function AffiliateInviteTable({ items, busyIds, onRevoke }: Props) {
  return (
    <section className="overflow-x-auto border-y border-border bg-white">
      <table className="w-full min-w-[960px] border-collapse text-left text-sm">
        <thead className="border-b border-border bg-background text-xs text-muted">
          <tr>
            <th className="px-4 py-3 font-bold">Who it is for</th>
            <th className="px-4 py-3 font-bold">Percent</th>
            <th className="px-4 py-3 font-bold">Status</th>
            <th className="px-4 py-3 font-bold">Created</th>
            <th className="px-4 py-3 font-bold">Expires</th>
            <th className="px-4 py-3 font-bold">Claimed by</th>
            <th className="px-4 py-3 font-bold">Claimed</th>
            <th className="px-4 py-3 font-bold">
              <span className="sr-only">Action</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((invite) => (
            <tr key={invite.id} className="border-b border-border last:border-b-0">
              <td className="px-4 py-3 font-semibold text-foreground">{invite.label}</td>
              <td className="px-4 py-3">{invite.commission_percent}%</td>
              <td className="px-4 py-3">
                {STATUS_LABELS[invite.status]}
                {invite.status === 'revoked' && invite.revoked_at && (
                  <span className="block text-xs text-muted">{formatDate(invite.revoked_at)}</span>
                )}
              </td>
              <td className="px-4 py-3 text-muted">{formatDate(invite.created_at)}</td>
              <td className="px-4 py-3 text-muted">{invite.expires_at ? formatDate(invite.expires_at) : 'Never'}</td>
              <td className="px-4 py-3">
                {invite.claimed_by_user_id ? (
                  <>
                    {invite.claimed_by_email ?? 'Deleted account'}
                    <span className="block font-mono text-xs text-muted">{invite.claimed_by_user_id}</span>
                  </>
                ) : (
                  <span className="text-muted">Not claimed</span>
                )}
              </td>
              <td className="px-4 py-3 text-muted">{invite.claimed_at ? formatDate(invite.claimed_at) : ''}</td>
              <td className="px-4 py-3 text-right">
                {invite.status !== 'revoked' && (
                  <button
                    className="border border-border bg-white px-3 py-1.5 text-xs font-bold text-red-800 hover:border-red-300 disabled:text-muted"
                    disabled={busyIds.has(invite.id)}
                    onClick={() => onRevoke(invite)}
                    type="button"
                  >
                    {busyIds.has(invite.id) ? 'Revoking...' : 'Revoke'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function formatDate(value: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : DATE_FORMAT.format(date);
}
