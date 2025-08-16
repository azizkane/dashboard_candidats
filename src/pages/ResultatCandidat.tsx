import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import Appbar from '../components/AppbarElecteur';
import SidebarCandidat from '../components/SidebarCandidat';
import FooterCandidat from '../components/FooterCandidat';

type Election = {
  id: number;
  titre: string;
  description?: string;
  date_debut: string;
  date_fin: string;
  image?: string | null;
  image_url?: string | null;
};

type Candidat = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  profil?: string | null;
  // rempli côté front par polling “unitaire”
  votes_count?: number;
};

const ResultatsParElection: React.FC = () => {
  /* ========= STATE ========= */
  const [elections, setElections] = useState<Election[]>([]);
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);

  const [showResults, setShowResults] = useState(false);
  const [live, setLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  const token = useMemo(() => localStorage.getItem('auth_token') || '', []);
  const defaultAvatar = '/user.png';
  const defaultImage = '/default-election.jpg';

  const REFRESH_MS = 10000;
  const liveTimerRef = useRef<number | null>(null);

  /* ========= HELPERS ========= */

  // Base d’URL : même host que le front, port 8000 (comme dans ton code)
  const API_BASE = useMemo(() => {
    const proto = window?.location?.protocol || 'http:';
    const host = window?.location?.hostname || '127.0.0.1';
    return `${proto}//${host}:8000`;
  }, []);

  const setUpdatedNow = () => {
    const d = new Date();
    setLastUpdated(
      d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    );
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' });

  const storageUrl = (p?: string | null) => {
    if (!p) return null;
    if (/^https?:\/\//i.test(p)) return p;
    const clean = String(p).replace(/^\/+/, '');
    const withStorage = clean.startsWith('storage/') ? clean : `storage/${clean}`;
    return `${API_BASE}/${withStorage}`;
  };

  const getElectionImage = (e: Election) => e?.image_url || storageUrl(e?.image) || defaultImage;
  const getCandidatImage = (profil?: string | null) => storageUrl(profil) || defaultAvatar;

  const statusLabel = useMemo(() => {
    if (!selectedElection) return '';
    const now = new Date();
    const d1 = new Date(selectedElection.date_debut);
    const d2 = new Date(selectedElection.date_fin);
    if (now < d1) return 'À venir';
    if (now > d2) return 'Terminé';
    return 'En cours';
  }, [selectedElection]);

  const statusSeverity = useMemo<'success' | 'info' | 'warning' | undefined>(() => {
    if (statusLabel === 'En cours') return 'success';
    if (statusLabel === 'À venir') return 'info';
    if (statusLabel === 'Terminé') return 'warning';
    return undefined;
  }, [statusLabel]);

  const totalVotes = useMemo(
    () => candidats.reduce((sum, c) => sum + (Number(c.votes_count) || 0), 0),
    [candidats]
  );

  const rankedCandidats = useMemo(
    () => [...candidats].sort((a, b) => (b.votes_count || 0) - (a.votes_count || 0)),
    [candidats]
  );

  const leader = rankedCandidats[0] || null;

  const percent = (votes?: number) => {
    const total = totalVotes;
    if (!total) return 0;
    return Math.round(((Number(votes || 0) * 100) / total) * 100) / 100; // 2 décimales
  };

  /* ========= API CALLS ========= */

  const fetchElections = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/liste_elections`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setElections(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Erreur chargement élections', err);
    }
  }, [API_BASE, token]);

  const fetchCandidats = useCallback(async () => {
    if (!selectedElection) return;
    try {
      const res = await axios.get(`${API_BASE}/api/candidats_par_election/${selectedElection.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // logique: on conserve l’ordre, votes_count seront remplis après
      const list: Candidat[] = res.data?.data || [];
      setCandidats(list);
      setUpdatedNow();
    } catch (err) {
      console.error('Erreur chargement candidats', err);
    }
  }, [API_BASE, selectedElection, token]);

  // Route unitaire : /api/votes/{election_id}/{candidat_id}
  const getVotesForCandidate = useCallback(
    async (electionId: number, candidatId: number) => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/votes/${electionId}/${candidatId}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { _t: Date.now() }
        });
        return Number(
          data?.votes ??
          data?.total ??
          data?.count ??
          data?.data?.votes ??
          0
        );
      } catch (e) {
        console.error('Erreur getVotesForCandidate:', e);
        return 0;
      }
    },
    [API_BASE, token]
  );

  const fetchVotesCounts = useCallback(async () => {
    if (!selectedElection) return;
    if (!candidats.length) { setUpdatedNow(); return; }

    try {
      const counts = await Promise.all(
        candidats.map(c => getVotesForCandidate(selectedElection.id, c.id))
      );
      // fusion non destructive
      setCandidats(prev =>
        prev.map((c, idx) => ({ ...c, votes_count: counts[idx] ?? Number(c.votes_count || 0) }))
      );
      setUpdatedNow();
    } catch (err) {
      console.error('Erreur chargement votes par candidat (unitaire)', err);
    }
  }, [selectedElection, candidats, getVotesForCandidate]);

  const fetchNow = useCallback(async () => {
    await fetchCandidats();
    await fetchVotesCounts();
  }, [fetchCandidats, fetchVotesCounts]);

  /* ========= LIVE POLLING ========= */

  const stopLive = useCallback(() => {
    if (liveTimerRef.current) {
      window.clearInterval(liveTimerRef.current);
      liveTimerRef.current = null;
    }
  }, []);

  const startLive = useCallback(async () => {
    stopLive();
    await fetchNow(); // premier fetch complet
    liveTimerRef.current = window.setInterval(fetchVotesCounts, REFRESH_MS);
  }, [stopLive, fetchNow, fetchVotesCounts]);

  // gère l’ouverture/fermeture du modal + toggle Live
  useEffect(() => {
    if (!showResults) {
      stopLive();
      return;
    }
    if (live) startLive();
    else stopLive();
    // cleanup si on quitte la page
    return () => stopLive();
  }, [showResults, live, startLive, stopLive]);

  /* ========= LIFECYCLE ========= */

  useEffect(() => { fetchElections(); }, [fetchElections]);

  /* ========= UI ACTIONS ========= */

  const openResults = async (election: Election) => {
    setSelectedElection(election);
    setShowResults(true);
    await fetchNow(); // premier chargement
  };

  const closeResults = () => {
    setShowResults(false);
  };

  /* ========= RENDER ========= */

  return (
    <div className="page">
      <Appbar title="Résultats par Élection" />
      <div className="layout">
        <SidebarCandidat />
        <main className="main">
          <h2 className="title">Résultats par Élection</h2>

          {/* Cartes d'élections */}
          <div className="cards">
            {elections.map((e) => (
              <div
                key={e.id}
                className="election-card"
                onClick={() => openResults(e)}
                role="button"
                tabIndex={0}
              >
                <img className="election-img" src={getElectionImage(e)} alt="Election" />
                <div className="election-info">
                  <h3>{e.titre}</h3>
                  <p className="desc line-clamp">{e.description}</p>
                  <p><strong>Début :</strong> {formatDate(e.date_debut)}</p>
                  <p><strong>Fin :</strong> {formatDate(e.date_fin)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* MODAL Résultats */}
          {showResults && (
            <div
              className="modal-overlay"
              role="dialog"
              aria-modal="true"
              onClick={(e) => {
                // Clique en dehors = ne ferme pas par défaut (comme un vrai dialog),
                // si tu veux fermer sur clic overlay : dé-commente ci-dessous
                // if (e.currentTarget === e.target) closeResults();
              }}
            >
              <div className="results-dialog" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="dialog-header">
                  <h3 className="dialog-title">
                    {selectedElection ? `Résultats — ${selectedElection.titre}` : 'Résultats'}
                  </h3>

                  <button className="close-btn" onClick={closeResults} aria-label="Fermer">×</button>
                </div>

                {/* Meta + contrôles */}
                {selectedElection && (
                  <div className="results-header">
                    <div className="meta">
                      <span className={`tag ${statusSeverity || ''}`}>{statusLabel}</span>
                      <span className="sep">•</span>
                      <span className="meta-item">
                        <i className="pi pi-users" style={{ marginRight: 4 }} />
                        {candidats.length} candidats
                      </span>
                      <span className="sep">•</span>
                      <span className="meta-item">
                        <i className="pi pi-check-circle" style={{ marginRight: 4 }} />
                        {totalVotes} votes
                      </span>
                      {lastUpdated && <span className="updated">(MAJ: {lastUpdated})</span>}
                    </div>

                    <div className="controls">
                      <div className="live-toggle">
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={live}
                            onChange={(e) => setLive(e.target.checked)}
                          />
                          <span className="slider" />
                        </label>
                        <span className={`live-label ${live ? 'on' : ''}`}>Live</span>
                      </div>
                      <button className="btn btn-light" onClick={fetchNow}>
                        <i className="pi pi-refresh" style={{ marginRight: 6 }} />
                        Rafraîchir
                      </button>
                    </div>
                  </div>
                )}

                {/* Leader */}
                {leader && (
                  <div className="leader-card">
                    <img src={getCandidatImage(leader.profil)} className="leader-avatar" alt="leader" />
                    <div className="leader-info">
                      <div className="leader-top">
                        <span className="badge">En tête</span>
                        <h3>{leader.prenom} {leader.nom}</h3>
                      </div>
                      <div className="leader-stats">
                        <span className="votes">
                          {leader.votes_count ?? 0} vote{(leader.votes_count ?? 0) > 1 ? 's' : ''}
                        </span>
                        <span className="pct">{percent(leader.votes_count)}%</span>
                      </div>
                      <div className="bar">
                        <div className="bar-fill" style={{ width: `${percent(leader.votes_count)}%` }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Classement */}
                <div className="rank-list">
                  {rankedCandidats.map((c, idx) => (
                    <div key={c.id} className={`rank-row ${idx === 0 ? 'first' : ''}`}>
                      <div className="left">
                        <span className="pos">#{idx + 1}</span>
                        <img src={getCandidatImage(c.profil)} className="avatar" alt="" />
                        <div className="id">
                          <div className="name">{c.prenom} {c.nom}</div>
                          <div className="email">{c.email}</div>
                        </div>
                      </div>
                      <div className="right">
                        <div className="stat-line">
                          <span className="votes">{c.votes_count ?? 0}</span>
                          <span className="pct">{percent(c.votes_count)}%</span>
                        </div>
                        <div className="bar small">
                          <div className="bar-fill" style={{ width: `${percent(c.votes_count)}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="dialog-footer">
                  <button className="btn btn-secondary" onClick={closeResults}>
                    <i className="pi pi-times" style={{ marginRight: 6 }} />
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <FooterCandidat />

      {/* ========= STYLES ========= */}
      <style>{`
        .page { display: flex; flex-direction: column; min-height: 100vh; background: #f5f7fb; }
        .layout { display: flex; flex: 1; }
        .main { flex: 1; padding: 1.2rem; margin-left: 250px; } /* garde la place du SidebarElecteur */
        .title { font-size: 1.6rem; color: #1e3a8a; margin: 1rem 0; }

        .cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: .75rem;
        }
        .election-card {
          border: 1px solid #dbeafe;
          border-radius: 8px;
          padding: .6rem;
          background: #fff;
          cursor: pointer;
          transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
          box-shadow: 0 3px 10px rgba(37, 99, 235, 0.08);
        }
        .election-card:hover { transform: translateY(-2px); border-color: #2563eb; }
        .election-img { width: 100%; height: 110px; object-fit: cover; border-radius: 7px; margin-bottom: .4rem; }
        .election-info h3 { margin: 0 0 .15rem 0; color: #0f172a; font-size: .95rem; }
        .desc { color: #475569; margin: .15rem 0 .3rem 0; font-size: .88rem; }
        .election-info p { font-size: .85rem; margin: .12rem 0; }

        /* Modal overlay + dialog */
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(17, 24, 39, 0.45);
          backdrop-filter: blur(3px);
          display: flex; align-items: flex-start; justify-content: center;
          padding: 2rem 1rem; z-index: 1000;
        }
        .results-dialog {
          width: 100%; max-width: 900px;
          background: #fff;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(37, 99, 235, 0.15);
        }
        .dialog-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(37,99,235,.15);
          background: linear-gradient(135deg, #ffffff 0%, #f7fbff 100%);
        }
        .dialog-title { margin: 0; font-size: 1.1rem; color: #0f172a; font-weight: 800; }
        .close-btn {
          background: transparent; border: none; font-size: 1.8rem; line-height: 1;
          color: #64748b; cursor: pointer;
        }
        .close-btn:hover { color: #0f172a; }

        .results-header {
          display: flex; justify-content: space-between; align-items: center;
          gap: .75rem; flex-wrap: wrap; padding: 1rem 1.25rem;
        }
        .meta { display: flex; align-items: center; gap: .5rem; color: #334155; }
        .sep { opacity: .4; }
        .updated { margin-left: .25rem; font-size: .9rem; color: #64748b; }
        .meta-item i { color: #2563eb; }

        .tag {
          display: inline-flex; align-items: center; padding: .2rem .5rem; border-radius: 9999px;
          font-size: .8rem; font-weight: 700; background: #e5e7eb; color: #111827;
        }
        .tag.success { background: #dcfce7; color: #065f46; }
        .tag.info    { background: #dbeafe; color: #1e40af; }
        .tag.warning { background: #fef9c3; color: #92400e; }

        .controls { display: flex; align-items: center; gap: .5rem; }
        .btn {
          display: inline-flex; align-items: center; padding: .5rem .8rem; border-radius: 10px; cursor: pointer;
          border: 1px solid #e5e7eb; background: #fff; color: #111827;
        }
        .btn:hover { background: #f9fafb; }
        .btn-secondary { background: #f3f4f6; }
        .btn-light { background: #fff; }

        .live-toggle { display: flex; align-items: center; gap: .5rem; }
        .switch { position: relative; width: 42px; height: 24px; display: inline-block; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
          background-color: #e2e8f0; transition: .2s; border-radius: 9999px;
        }
        .slider:before {
          position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px;
          background-color: white; transition: .2s; border-radius: 9999px; box-shadow: 0 1px 4px rgba(0,0,0,.15);
        }
        .switch input:checked + .slider { background-color: #22c55e; }
        .switch input:checked + .slider:before { transform: translateX(18px); }
        .live-label { font-weight: 700; color: #ef4444; }
        .live-label.on { color: #22c55e; }

        .leader-card {
          display: grid; grid-template-columns: 96px 1fr; gap: .9rem;
          border: 1px solid #bbf7d0; background: #f0fdf4; border-radius: 12px; padding: .9rem 1rem; margin: 0 1.25rem .9rem;
        }
        .leader-avatar { width: 96px; height: 96px; object-fit: cover; border-radius: 10px; }
        .leader-info { display: flex; flex-direction: column; gap: .35rem; }
        .leader-top { display: flex; align-items: center; gap: .5rem; }
        .badge {
          background: #22c55e; color: #fff; border-radius: 9999px; padding: .15rem .6rem;
          font-size: .8rem; font-weight: 800;
        }
        .leader-stats { display: flex; align-items: center; gap: .6rem; font-weight: 800; color: #0f172a; }
        .leader-stats .pct { color: #16a34a; }
        .bar { width: 100%; height: 12px; background: #e2e8f0; border-radius: 9999px; overflow: hidden; }
        .bar .bar-fill { height: 100%; background: #22c55e; border-radius: 9999px; }

        .rank-list { display: flex; flex-direction: column; gap: .6rem; padding: 0 1.25rem; }
        .rank-row {
          display: grid; grid-template-columns: 1fr 200px; gap: .75rem; align-items: center;
          border: 1px solid #e2e8f0; border-radius: 10px; padding: .6rem .75rem; background: #fff;
        }
        .rank-row.first { border-color: #bfdbfe; background: #f8fbff; }
        .left { display: flex; align-items: center; gap: .6rem; min-width: 0; }
        .pos {
          display: inline-flex; align-items: center; justify-content: center;
          width: 28px; height: 28px; border-radius: 9999px; background: #2563eb; color: #fff; font-weight: 800;
        }
        .avatar { width: 40px; height: 40px; border-radius: 8px; object-fit: cover; }
        .id { min-width: 0; }
        .name { font-weight: 800; color: #0f172a; }
        .email { font-size: .85rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 320px; }

        .right .stat-line { display: flex; justify-content: space-between; font-weight: 700; color: #0f172a; }
        .bar.small { height: 10px; }
        .bar.small .bar-fill { background: #2563eb; }

        .dialog-footer { display: flex; justify-content: flex-end; padding: 1rem 1.25rem; }
      `}</style>
    </div>
  );
};

export default ResultatsParElection;
