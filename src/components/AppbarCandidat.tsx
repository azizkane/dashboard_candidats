// src/components/AppBarCandidat.tsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bell, User } from 'lucide-react';

interface AppBarCandidatProps {
  title: string;
}

type Notif = {
  id: string;
  type: string;
  data: { election_id?: number; titre?: string; message?: string; jour_vote?: string };
  created_at: string;
};

const API_BASE = (import.meta as any).env?.VITE_API_BASE ?? 'http://127.0.0.1:8000';

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

const AppBarCandidat = ({ title }: AppBarCandidatProps) => {
  const [open, setOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [items, setItems] = useState<Notif[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  const bellRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const userBtnRef = useRef<HTMLButtonElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t = getAuthToken();
    setToken(t);
    if (t) axios.defaults.headers.common.Authorization = `Bearer ${t}`;
  }, []);

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const refresh = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/notifications`, { headers });
      const list: Notif[] = res.data || [];
      setItems(list);
      setCount(list.length);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    if (!token || items.length === 0) return;
    await axios.post(`${API_BASE}/api/notifications/read`, { ids: items.map(n => n.id) }, { headers });
    setItems([]);
    setCount(0);
    setOpen(false);
  };

  const markOneRead = async (id: string) => {
    if (!token) return;
    await axios.post(`${API_BASE}/api/notifications/${id}/read`, {}, { headers });
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
      if (userOpen && !(userMenuRef.current?.contains(t) || userBtnRef.current?.contains(t))) setUserOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open, userOpen]);

  const fmt = (iso: string) => {
    try { return new Date(iso).toLocaleString(); } catch { return iso; }
  };

  const onBellClick = async () => {
    if (!token) {
      navigate('/login-candidat');
      return;
    }
    if (!open) await refresh();
    setOpen(o => !o);
  };

  const handleLogout = async () => {
    try {
      const anyToken =
        token ||
        localStorage.getItem('token') ||
        localStorage.getItem('auth_token') ||
        sessionStorage.getItem('token') ||
        sessionStorage.getItem('auth_token');

      if (anyToken) {
        await axios.post(
          `${API_BASE}/api/logout`,
          {},
          { headers: { Authorization: `Bearer ${anyToken}`, Accept: 'application/json' } }
        );
      }
    } catch {} finally {
      localStorage.removeItem('token');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('auth_token');
      if (axios.defaults.headers?.common?.Authorization) {
        delete axios.defaults.headers.common.Authorization;
      }
      setToken(null);
      setUserOpen(false);
      navigate('/');
    }
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white shadow-md px-6 flex items-center justify-between z-40">
      <h1 className="text-xl font-semibold text-blue-600">{title}</h1>

      <div className="flex items-center gap-4 relative">
        <button
          ref={bellRef}
          onClick={onBellClick}
          className="relative text-gray-600 hover:text-blue-600 transition rounded-full p-2"
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
            className="absolute right-28 top-10 w-80 bg-white border rounded-xl shadow-lg p-2 z-50"
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
                <button onClick={markAllRead} className="text-sm text-blue-600 hover:underline">
                  Tout marquer comme lu
                </button>
              </div>
            )}
          </div>
        )}

        <button
          ref={userBtnRef}
          onClick={() => setUserOpen(o => !o)}
          className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-90"
          title="Compte"
          type="button"
        >
          <User size={18} />
        </button>

        {userOpen && (
          <div
            ref={userMenuRef}
            className="absolute right-0 top-10 w-48 bg-white border rounded-xl shadow-lg py-2 z-50"
          >
            <button
              onClick={() => { setUserOpen(false); navigate('/candidat/profil'); }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              type="button"
            >
              Mon profil
            </button>
            <div className="my-1 h-px bg-gray-100" />
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              type="button"
            >
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppBarCandidat;
