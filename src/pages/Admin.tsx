import { useState, useEffect, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://stayfind-api.onrender.com';
const STORAGE_KEY = 'stayfind_admin_key';

interface Stats {
  mode: string;
  sandbox: boolean;
  uptime: number;
  total: number;
  todayTotal: number;
  completed: number;
  pending: number;
  errors: number;
}

interface Payment {
  paymentId: string;
  action: string;
  status: string;
  amount?: number;
  txid?: string;
  timestamp: string;
  mock?: boolean;
  manual?: boolean;
  completedAt?: string;
  error?: unknown;
}

const STATUS_COLOR: Record<string, string> = {
  approved: '#f59e0b',
  completed: '#10b981',
  cancelled: '#6b7280',
  error: '#ef4444',
};

function fmt(ts: string) {
  return new Date(ts).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' });
}

function uptime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}ч ${m}м` : `${m}м`;
}

export default function Admin() {
  const [key, setKey] = useState(() => localStorage.getItem(STORAGE_KEY) || '');
  const [input, setInput] = useState('');
  const [authed, setAuthed] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [manualId, setManualId] = useState('');
  const [manualTxid, setManualTxid] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const headers = { 'x-admin-key': key, 'Content-Type': 'application/json' };

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [sRes, pRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/stats`, { headers }),
        fetch(`${API_URL}/api/admin/payments?limit=100`, { headers }),
      ]);
      if (sRes.status === 403) { setError('Неверный ключ'); setAuthed(false); return; }
      setStats(await sRes.json());
      setPayments(await pRes.json());
      setAuthed(true);
    } catch {
      setError('Нет связи с бэкендом');
    } finally {
      setLoading(false);
    }
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  function login() {
    const k = input.trim() || key;
    if (!k) return;
    localStorage.setItem(STORAGE_KEY, k);
    if (k !== key) {
      setKey(k); // change triggers useEffect → load()
    } else {
      load(); // key unchanged — retry manually
    }
  }

  useEffect(() => {
    if (key) load();
  }, [key, load]);

  async function action(url: string, body?: object) {
    setActionMsg('');
    const r = await fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const d = await r.json();
    setActionMsg(r.ok ? '✓ Готово' : `✗ ${JSON.stringify(d)}`);
    load();
  }

  const filtered = filterStatus ? payments.filter(p => p.status === filterStatus) : payments;

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={styles.page}>
        <div style={styles.loginBox}>
          <div style={styles.logo}>🔐</div>
          <h2 style={styles.loginTitle}>StayFind Admin</h2>
          <p style={styles.loginSub}>Только для разработчика</p>
          {error && <p style={styles.err}>{error}</p>}
          <input
            style={styles.input}
            type="password"
            placeholder="Admin key"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            autoFocus
          />
          <button style={styles.btn} onClick={login}>Войти</button>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>StayFind Admin</h1>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {stats && (
            <span style={{ ...styles.badge, background: stats.mode === 'REAL' ? '#10b981' : '#f59e0b' }}>
              {stats.mode}
            </span>
          )}
          <button style={styles.btnSm} onClick={load} disabled={loading}>
            {loading ? '…' : '↻ Обновить'}
          </button>
          <button style={{ ...styles.btnSm, background: '#374151' }} onClick={() => { setAuthed(false); localStorage.removeItem(STORAGE_KEY); }}>
            Выйти
          </button>
        </div>
      </div>

      {error && <p style={styles.err}>{error}</p>}

      {/* Stats */}
      {stats && (
        <div style={styles.statsGrid}>
          <StatCard label="Всего платежей" value={stats.total} />
          <StatCard label="Сегодня" value={stats.todayTotal} />
          <StatCard label="Завершено" value={stats.completed} color="#10b981" />
          <StatCard label="Ожидают" value={stats.pending} color="#f59e0b" />
          <StatCard label="Ошибки" value={stats.errors} color="#ef4444" />
          <StatCard label="Uptime" value={uptime(stats.uptime)} />
        </div>
      )}

      {/* Manual operations */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Ручные операции</h3>
        <div style={styles.row}>
          <input
            style={{ ...styles.input, flex: 2 }}
            placeholder="Payment ID"
            value={manualId}
            onChange={e => setManualId(e.target.value)}
          />
          <input
            style={{ ...styles.input, flex: 2 }}
            placeholder="txid (для complete)"
            value={manualTxid}
            onChange={e => setManualTxid(e.target.value)}
          />
          <button style={styles.btnSm} onClick={() => action(`/api/admin/payments/${manualId}/approve`)}>
            Approve
          </button>
          <button style={{ ...styles.btnSm, background: '#10b981' }} onClick={() => action(`/api/admin/payments/${manualId}/complete`, { txid: manualTxid })}>
            Complete
          </button>
          <button style={{ ...styles.btnSm, background: '#6b7280' }} onClick={() => action(`/api/admin/payments/${manualId}/cancel`)}>
            Cancel
          </button>
        </div>
        {actionMsg && <p style={{ marginTop: 8, color: actionMsg.startsWith('✓') ? '#10b981' : '#ef4444', fontSize: 14 }}>{actionMsg}</p>}
      </div>

      {/* Payments table */}
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ ...styles.cardTitle, marginBottom: 0 }}>Платежи ({filtered.length})</h3>
          <select
            style={{ ...styles.input, width: 160, marginBottom: 0 }}
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">Все статусы</option>
            <option value="approved">approved</option>
            <option value="completed">completed</option>
            <option value="cancelled">cancelled</option>
            <option value="error">error</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: '24px 0' }}>Платежей нет</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Время', 'Payment ID', 'Статус', 'Сумма π', 'txid', 'Mock', 'Manual', ''].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #1f2937' }}>
                    <td style={styles.td}>{fmt(p.timestamp)}</td>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: 11, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' }} title={p.paymentId}>
                      {p.paymentId}
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: STATUS_COLOR[p.status] || '#6b7280' }}>
                        {p.status}
                      </span>
                    </td>
                    <td style={styles.td}>{p.amount ?? '—'}</td>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: 10, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }} title={p.txid}>
                      {p.txid ?? '—'}
                    </td>
                    <td style={styles.td}>{p.mock ? '✓' : '—'}</td>
                    <td style={styles.td}>{p.manual ? '✓' : '—'}</td>
                    <td style={styles.td}>
                      {p.status === 'approved' && (
                        <button style={{ ...styles.btnSm, fontSize: 11, padding: '2px 8px', background: '#6b7280' }}
                          onClick={() => action(`/api/admin/payments/${p.paymentId}/cancel`)}>
                          Отмена
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div style={styles.statCard}>
      <div style={{ fontSize: 28, fontWeight: 700, color: color || '#f9fafb' }}>{value}</div>
      <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>{label}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#0f172a', color: '#f9fafb', padding: '24px 16px', fontFamily: 'Inter, sans-serif' },
  loginBox: { maxWidth: 360, margin: '120px auto', background: '#1e293b', borderRadius: 16, padding: 32, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' },
  logo: { fontSize: 48 },
  loginTitle: { margin: 0, fontSize: 24, fontWeight: 700 },
  loginSub: { margin: 0, color: '#9ca3af', fontSize: 14 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, maxWidth: 1100, margin: '0 auto 24px' },
  title: { margin: 0, fontSize: 22, fontWeight: 700 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, maxWidth: 1100, margin: '0 auto 16px' },
  statCard: { background: '#1e293b', borderRadius: 12, padding: '16px 20px' },
  card: { background: '#1e293b', borderRadius: 12, padding: 20, maxWidth: 1100, margin: '0 auto 16px' },
  cardTitle: { margin: '0 0 12px', fontSize: 16, fontWeight: 600 },
  row: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' },
  input: { background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#f9fafb', padding: '8px 12px', fontSize: 14, marginBottom: 0, outline: 'none' },
  btn: { background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 15, fontWeight: 600, cursor: 'pointer', width: '100%' },
  btnSm: { background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' },
  badge: { borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 600, color: '#fff' },
  err: { color: '#ef4444', textAlign: 'center', fontSize: 14 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', padding: '8px 12px', color: '#9ca3af', fontWeight: 500, borderBottom: '1px solid #334155' },
  td: { padding: '10px 12px', verticalAlign: 'middle' },
};
