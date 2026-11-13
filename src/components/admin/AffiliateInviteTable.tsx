import type { AffiliateInvite, AffiliateInviteAction, AffiliateInviteStatus } from '@/types/affiliate-invite-admin';

const STATUS_LABELS: Record<AffiliateInviteStatus, string> = {
  open: 'Open',
  claimed: 'Claimed',
  expired: 'Expired',
  revoked: 'Revoked',
};

const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

const BUTTON = 'whitespace-nowrap border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold disabled:text-slate-400 rounded-lg';

interface Props {
  items: AffiliateInvite[];
  busy: ReadonlyMap<string, AffiliateInviteAction>;
  onRevoke: (invite: AffiliateInvite) => void;
  onRevokeAgain: (invite: AffiliateInvite) => void;
  onRetryPremium: (invite: AffiliateInvite) => void;
}

/** Every invite with its state; tokens never reach this table. */
export function AffiliateInviteTable({ items, busy, onRevoke, onRevokeAgain, onRetryPremium }: Props) {
  return (
    <section className="overflow-x-auto border border-slate-200 bg-white rounded-xl">
      <table className="w-full min-w-[960px] border-collapse text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Who it is for</th>
            <th className="px-4 py-3 font-semibold">Percent</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Created</th>
            <th className="px-4 py-3 font-semibold">Expires</th>
            <th className="px-4 py-3 font-semibold">Claimed by</th>
            <th className="px-4 py-3 font-semibold">Claimed</th>
            <th className="px-4 py-3 font-semibold">Premium</th>
            <th className="px-4 py-3 font-semibold">
              <span className="sr-only">Action</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((invite) => (
            <tr key={invite.id} className="border-b border-slate-200 last:border-b-0">
              <td className="px-4 py-3 font-semibold text-slate-900">{invite.label}</td>
              <td className="px-4 py-3">{invite.commission_percent}%</td>
              <td className="px-4 py-3">
                {STATUS_LABELS[invite.status]}
                {invite.status === 'revoked' && invite.revoked_at && (
                  <span className="block text-xs text-slate-500">{formatDate(invite.revoked_at)}</span>
                )}
              </td>
              <td className="px-4 py-3 text-slate-500">{formatDate(invite.created_at)}</td>
              <td className="px-4 py-3 text-slate-500">{invite.expires_at ? formatDate(invite.expires_at) : 'Never'}</td>
              <td className="px-4 py-3">
                {invite.claimed_by_user_id ? (
                  <>
                    {invite.claimed_by_email ?? 'Deleted account'}
                    <span className="block font-mono text-xs text-slate-500">{invite.claimed_by_user_id}</span>
                  </>
                ) : (
                  <span className="text-slate-500">Not claimed</span>
                )}
              </td>
              <td className="px-4 py-3 text-slate-500">{invite.claimed_at ? formatDate(invite.claimed_at) : ''}</td>
              <td className="px-4 py-3">
                {invite.claimed_by_user_id && (
                  <PremiumState
                    invite={invite}
                    action={busy.get(invite.id)}
                    onRevokeAgain={onRevokeAgain}
                    onRetryPremium={onRetryPremium}
                  />
                )}
              </td>
              <td className="px-4 py-3 text-right">
                {invite.status !== 'revoked' && (
                  <button
                    className={`${BUTTON} text-red-800 hover:border-red-300`}
                    disabled={busy.has(invite.id)}
                    onClick={() => onRevoke(invite)}
                    type="button"
                  >
                    {busy.get(invite.id) === 'revoke' ? 'Revoking...' : 'Revoke'}
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

interface PremiumStateProps {
  invite: AffiliateInvite;
  action: AffiliateInviteAction | undefined;
  onRevokeAgain: (invite: AffiliateInvite) => void;
  onRetryPremium: (invite: AffiliateInvite) => void;
}

/** The claimer's free Premium: granted or not, and taken back after a revoke. */
function PremiumState({ invite, action, onRevokeAgain, onRetryPremium }: PremiumStateProps) {
  const revoked = invite.status === 'revoked';
  return (
    <div className="grid justify-items-start gap-1 text-slate-500">
      <span>{invite.premium_granted_at ? `Granted ${formatDate(invite.premium_granted_at)}` : 'Not granted'}</span>
      {!revoked && !invite.premium_granted_at && (
        <button
          className={`${BUTTON} text-slate-900 hover:border-slate-300`}
          disabled={action !== undefined}
          onClick={() => onRetryPremium(invite)}
          type="button"
        >
          {action === 'premium' ? 'Granting...' : 'Retry Premium'}
        </button>
      )}
      {revoked && (
        <span className={invite.premium_revoked_at ? undefined : 'text-red-800'}>
          {invite.premium_revoked_at ? `Removed ${formatDate(invite.premium_revoked_at)}` : 'Not removed'}
        </span>
      )}
      {revoked && !invite.premium_revoked_at && (
        <button
          className={`${BUTTON} text-red-800 hover:border-red-300`}
          disabled={action !== undefined}
          onClick={() => onRevokeAgain(invite)}
          type="button"
        >
          {action === 'revoke' ? 'Revoking...' : 'Revoke again'}
        </button>
      )}
    </div>
  );
}

function formatDate(value: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : DATE_FORMAT.format(date);
}
