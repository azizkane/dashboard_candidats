import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { fetchNotifications, markNotificationRead, markNotificationsRead, type NotificationItem } from '@/api';

type Notif = NotificationItem & { data?: { election_id?: number; titre?: string; message?: string; jour_vote?: string } };

function getAuthToken(): string | null {
  const tryKeys = ['token', 'auth_token', 'access_token'];
  for (const k of tryKeys) {
    const v = localStorage.getItem(k) || sessionStorage.getItem(k);
    if (v) return v;
  }
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user?.token) return user.token;
  } catch {}
  return null;
}

interface NotificationsBellProps {
  loginRoute: string;
}

export const NotificationsBell = ({ loginRoute }: NotificationsBellProps) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notif[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  const bellRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t = getAuthToken();
    setToken(t);
  }, []);

  const refresh = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const list: Notif[] = await fetchNotifications();
      setItems(list);
      setCount(list.length);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    if (!token || items.length === 0) return;
    await markNotificationsRead(items.map(n => n.id));
    setItems([]);
    setCount(0);
    setOpen(false);
  };

  const markOneRead = async (id: string) => {
    if (!token) return;
    await markNotificationRead(id);
    setItems(prev => prev.filter(n => n.id !== id));
    setCount(c => Math.max(0, c - 1));
  };

  useEffect(() => {
    if (!token) return;
    refresh();
    const id = window.setInterval(refresh, 60_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (open && !(panelRef.current?.contains(t) || bellRef.current?.contains(t))) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const fmt = (iso: string) => {
    try { return new Date(iso).toLocaleString(); } catch { return iso; }
  };

  const onBellClick = async () => {
    if (!token) {
      navigate(loginRoute);
      return;
    }
    if (!open) await refresh();
    setOpen(o => !o);
  };

  return (
    <div className="relative">
      <button
        ref={bellRef}
        onClick={onBellClick}
        className="relative text-gray-600 hover:text-primary transition rounded-full p-2"
        aria-label="Notifications"
        title="Notifications"
        type="button"
      >
        <Bell size={20} />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 top-10 w-80 bg-white border rounded-xl shadow-lg p-2 z-50"
        >
          <div className="flex items-center justify-between px-2 py-1">
            <div className="font-semibold">Notifications</div>
            <div className="text-xs text-gray-500">{loading ? 'Chargement…' : null}</div>
          </div>

          <div className="max-h-72 overflow-auto divide-y">
            {items.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">Aucune notification</div>
            ) : (
              items.map(n => (
                <button
                  key={n.id}
                  onClick={() => markOneRead(n.id)}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg"
                  title="Cliquer pour marquer comme lue"
                >
                  <div className="text-sm font-medium">{n.data?.titre ?? 'Notification'}</div>
                  <div className="text-sm text-gray-700">{n.data?.message ?? '—'}</div>
                  <div className="text-xs text-gray-500 mt-1">{fmt(n.created_at)}</div>
                </button>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="px-2 pt-2">
              <button onClick={markAllRead} className="text-sm text-primary hover:underline">
                Tout marquer comme lu
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsBell;


