import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '@/components/common/AppShell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fetchMyCandidature, deleteCandidature, getDocumentDownloadUrl, fetchCurrentUser } from '../api';
import { Edit, Trash2, Download, FileText, Mail } from 'lucide-react';

interface Candidature {
  id: number;
  election?: { titre: string };
  slogan: string;
  programme?: string;
  lettre_motivation?: string;
  date_soumission?: string;
  statut?: boolean | string | null;
}

interface CurrentUser { nom?: string; prenom?: string; email?: string }

const MaCandidature = () => {
  const [candidature, setCandidature] = useState<Candidature | null>(null);
  const [me, setMe] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [cand, user] = await Promise.all([fetchMyCandidature(), fetchCurrentUser()]);
        setCandidature(cand || null);
        setMe(user || null);
      } catch (e) {
        console.error('Erreur chargement candidature/profil:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleModifier = () => {
    if (candidature) navigate(`/candidat/modifier-candidature/${candidature.id}`);
  };

  const handleSupprimer = async () => {
    if (!candidature) return;
    const ok = window.confirm('Voulez-vous vraiment supprimer votre candidature ? Cette action est irréversible.');
    if (!ok) return;

    try {
      setDeleting(true);
      await deleteCandidature(candidature.id);
      alert('Candidature supprimée avec succès.');
      setCandidature(null);
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression de la candidature.');
    } finally {
      setDeleting(false);
    }
  };

  const renderStatutBadge = (statut?: boolean | string | null) => {
    if (statut === true || statut === 'approuvée') {
      return <Badge variant="default" className="bg-green-100 text-green-800">Approuvée</Badge>;
    }
    if (statut === false || statut === 'rejetée') {
      return <Badge variant="destructive">Rejetée</Badge>;
    }
    return <Badge variant="secondary">En attente</Badge>;
    // valeur par défaut si null/undefined/“en_attente”
  };

  if (loading) {
    return (
      <AppShell role="candidat" title="Ma Candidature">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Chargement de la candidature...</div>
        </div>
      </AppShell>
    );
  }

  if (!candidature) {
    return (
      <AppShell role="candidat" title="Ma Candidature">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Aucune candidature</h1>
            <p className="text-muted-foreground mb-6">
              Vous n'avez pas encore déposé de candidature pour une élection.
            </p>
            <Button onClick={() => navigate('/electeur/candidature')} variant="democratic">
              Déposer une candidature
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  const fullName = ((me?.prenom ? me?.prenom + ' ' : '') + (me?.nom ?? '')).trim();

  return (
    <AppShell role="candidat" title="Ma Candidature">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Ma Candidature</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Utilisateur : {fullName || me?.email || '—'}
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleModifier} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            <Button onClick={handleSupprimer} variant="destructive" disabled={deleting}>
              <Trash2 className="h-4 w-4 mr-2" />
              {deleting ? 'Suppression...' : 'Supprimer'}
            </Button>
          </div>
        </div>

        {/* Informations principales */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">Informations de la candidature</h3>

      

              <div>
                <p className="text-sm font-medium text-muted-foreground">Élection</p>
                <p className="mt-1 text-sm text-foreground">
                  {candidature.election?.titre || 'Non spécifiée'}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Slogan</p>
                <p className="mt-1 text-sm text-foreground italic">
                  "{candidature.slogan || 'Aucun slogan'}"
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Date de soumission</p>
                <p className="mt-1 text-sm text-foreground">
                  {candidature.date_soumission
                    ? new Date(candidature.date_soumission).toLocaleDateString('fr-FR')
                    : 'Non spécifiée'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">Documents</h3>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Programme électoral</p>
                {candidature.programme ? (
                  <Button variant="outline" size="sm" asChild>
                    <a href={getDocumentDownloadUrl(candidature.programme)} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger le programme
                    </a>
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucun programme joint</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Lettre de motivation</p>
                {candidature.lettre_motivation ? (
                  <Button variant="outline" size="sm" asChild>
                    <a href={getDocumentDownloadUrl(candidature.lettre_motivation)} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger la lettre
                    </a>
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucune lettre jointe</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Actions rapides</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => navigate('/candidat/elections')}>
              <FileText className="h-4 w-4 mr-2" />
              Voir les élections
            </Button>
            <Button variant="outline" onClick={() => navigate('/candidat/resultats')}>
              <Mail className="h-4 w-4 mr-2" />
              Consulter les résultats
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default MaCandidature;
