import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import AppShell from '@/components/common/AppShell';
import {
  fetchCandidatesByElection,
  fetchVotesForCandidate,
  getResultElectionImage,
  getResultCandidateImage,
  // No need for getStorageUrl here directly if getResultElectionImage/CandidateImage use it
} from '../api';

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
  votes_count?: number;
};

const ResultatsParElection: React.FC = () => {
  /* ========= STATE ========= */
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);

  const [showResults, setShowResults] = useState(false);
  const [live, setLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  // Rafraîchissement à 60s pour éviter le clignotement
  const REFRESH_MS = 60000;
  const liveTimerRef = useRef<number | null>(null);

  /* ========= RESOLUTION DE L'ID ELECTION SANS FETCH LISTE ========= */
  const location = useLocation();
  const params = useParams<{ electionId?: string }>();
  const queryId = useMemo(() => new URLSearchParams(location.search).get('election'), [location.search]);
  const storedId = useMemo(() => localStorage.getItem('selected_election_id'), []);
  const fallbackId = (import.meta as any).env?.VITE_DEFAULT_ELECTION_ID ?? '1';

  const resolvedElectionId = useMemo(() => {
    const raw = params.electionId ?? queryId ?? storedId ?? String(fallbackId);
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }, [params.electionId, queryId, storedId, fallbackId]);

  /* ========= HELPERS ========= */
  // Removed local API_BASE and storageUrl definitions as they are now in api.ts

  const setUpdatedNow = () => {
    const d = new Date();
    setLastUpdated(
      d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    );
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' });

  const statusLabel = useMemo(() => {
    if (!selectedElection?.date_debut || !selectedElection?.date_fin) return '';
    const now = new Date();
    const d1 = new Date(selectedElection.date_debut);
    const d2 = new Date(selectedElection.date_fin);
    if (isNaN(+d1) || isNaN(+d2)) return '';
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

  /* ========= API CALLS (pas de fetch de LISTE d'élections) ========= */
  const fetchCandidats = useCallback(async () => {
    if (!selectedElection) return;
    try {
      const list: Candidat[] = await fetchCandidatesByElection(String(selectedElection.id));
      setCandidats(list);
      setUpdatedNow();
    } catch (err) {
      console.error('Erreur chargement candidats', err);
    }
  }, [selectedElection]);

  const getVotesForCandidate = useCallback(
    async (electionId: number, candidatId: number) => {
      try {
        return await fetchVotesForCandidate(electionId, candidatId);
      } catch (e) {
        console.error('Erreur getVotesForCandidate:', e);
        return 0;
      }
    },
    []
  );

  const fetchVotesCounts = useCallback(async () => {
    if (!selectedElection) return;
    if (!candidats.length) { setUpdatedNow(); return; }
    try {
      const counts = await Promise.all(
        candidats.map(c => getVotesForCandidate(selectedElection.id, c.id))
      );
      setCandidats(prev => {
        const next = prev.map((c, idx) => ({ ...c, votes_count: counts[idx] ?? Number(c.votes_count || 0) }));
        const changed = next.some((c, i) => Number(c.votes_count || 0) !== Number(prev[i]?.votes_count || 0));
        return changed ? next : prev;
      });
      setUpdatedNow();
    } catch (err) {
      console.error('Erreur chargement votes par candidat (unitaire)', err);
    }
  }, [selectedElection, candidats, getVotesForCandidate]);

  const fetchNow = useCallback(async () => {
    await fetchCandidats();
    // Pour éviter le flash 0→%, enchaîne immédiatement un chargement de votes
    await fetchVotesCounts();
  }, [fetchCandidats, fetchVotesCounts]);

  /* ========= LIVE POLLING ========= */
  const stopLive = useCallback(() => {
    if (liveTimerRef.current) {
      window.clearInterval(liveTimerRef.current);
      liveTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (showResults && selectedElection) {
      (async () => {
        await fetchNow();
      })();
    }
    if (showResults && live && !liveTimerRef.current) {
      liveTimerRef.current = window.setInterval(() => {
        fetchVotesCounts();
      }, REFRESH_MS);
    }
    if (!showResults || !live) {
      if (liveTimerRef.current) {
        window.clearInterval(liveTimerRef.current);
        liveTimerRef.current = null;
      }
    }
    return () => {
      if (liveTimerRef.current) {
        window.clearInterval(liveTimerRef.current);
        liveTimerRef.current = null;
      }
    };
  }, [showResults, live, selectedElection]);

  /* ========= LIFECYCLE ========= */
  // Initialise directement l'élection sélectionnée sans charger la liste
  useEffect(() => {
    if (!resolvedElectionId) return;
    setSelectedElection({
      id: resolvedElectionId,
      titre: `Élection #${resolvedElectionId}`, // titre par défaut si on ne charge pas les métadonnées
      description: '',
      date_debut: '', // si tu veux le statut, tu pourras renseigner ces dates depuis un autre endroit
      date_fin: '',
      image: null,
      image_url: null
    });
    setShowResults(true);
  }, [resolvedElectionId]);

  /* ========= UI ACTIONS ========= */
  const closeResults = () => { setShowResults(false); };

  /* ========= RENDER ========= */
  return (
    <div className="page">
      <AppShell role="electeur" title="Résultats par Élection">
        <main className="main" aria-hidden={showResults}>
          {!showResults && (
            <h2 className="title">Résultats par Élection</h2>
          )}

          {/* Cartes d'élections (removed as this page is for a single election's results) */}
          {/* Only display the modal for the selected election */}
          {showResults && selectedElection && (
            <div className="modal-overlay" role="dialog" aria-modal="true">
              <div className="results-dialog" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="dialog-header">
                  <h3 className="dialog-title">
                    {`Résultats — Élection #${selectedElection.id}`}
                  </h3>
                  <button className="close-btn" onClick={closeResults} aria-label="Fermer">×</button>
                </div>

                {/* Meta + contrôles */}
                <div className="results-header">
                  <div className="meta">
                    {statusLabel && <span className={`tag ${statusSeverity || ''}`}>{statusLabel}</span>}
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
                    <button className="btn btn-light" onClick={fetchNow} disabled={!selectedElection}>
                      <i className="pi pi-refresh" style={{ marginRight: 6 }} />
                      Rafraîchir maintenant
                    </button>
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
                  </div>
                </div>

                {/* Leader */}
                {leader && (
                  <div className="leader-card">
                    <img src={getResultCandidateImage(leader.profil)} className="leader-avatar" alt="leader" />
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
                        <img src={getResultCandidateImage(c.profil)} className="avatar" alt="" />
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
      </AppShell>

      {/* ========= STYLES ========= */}
      <style>{`
        .page { display: flex; flex-direction: column; min-height: 100vh; background: #f5f7fb; }
        .layout { display: flex; flex: 1; }
        .main { flex: 1; padding: 1.2rem; }
        .title { font-size: 1.6rem; color: #1e3a8a; margin: 1rem 0; }

        /* Removed .cards and .election-card styles as they are not needed on this page */

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
        .badge { background: #22c55e; color: #fff; border-radius: 9999px; padding: .15rem .6rem; font-size: .8rem; font-weight: 800; }
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
        .pos { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 9999px; background: #2563eb; color: #fff; font-weight: 800; }
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
