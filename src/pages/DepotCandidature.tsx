import React, { useEffect, useState } from 'react';
import AppShell from '@/components/common/AppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { fetchElections, submitCandidature, fetchCurrentUser } from '../api';
import { Upload } from 'lucide-react';

interface ElectionOption { id: number; titre: string }
interface Me { id: number; nom: string; prenom: string; email: string }

const DepotCandidature = () => {
  const [elections, setElections] = useState<ElectionOption[]>([]);
  const [me, setMe] = useState<Me | null>(null);

  // gérés par le back : user_id & date_soumission
  const [electionId, setElectionId] = useState('');
  const [programmeFile, setProgrammeFile] = useState<File | null>(null);
  const [lettreMotivationFile, setLettreMotivationFile] = useState<File | null>(null);
  const [slogan, setSlogan] = useState('');

  const [submitted, setSubmitted] = useState<null | {
    userEmail: string; // on y met "Prénom Nom" pour ne pas toucher à ton JSX
    electionTitre: string;
    date: string;
    slogan: string;
    programme?: string;
    lettre?: string;
  }>(null);

  useEffect(() => {
    (async () => {
      const [elecRes, meRes] = await Promise.allSettled([
        fetchElections(),
        fetchCurrentUser(),
      ]);

      if (elecRes.status === 'fulfilled') setElections(elecRes.value as ElectionOption[]);
      else {
        console.error('Erreur de chargement des élections :', elecRes.reason);
        setElections([]);
      }

      if (meRes.status === 'fulfilled') setMe(meRes.value as Me);
      else console.warn('Profil non disponible :', meRes.reason);
    })();
  }, []);

  // Si le profil arrive après la soumission, on met à jour l’affichage du nom
  useEffect(() => {
    if (submitted && me && (!submitted.userEmail || submitted.userEmail === '—')) {
      setSubmitted(s => s ? { ...s, userEmail: `${me.prenom} ${me.nom}` } : s);
    }
  }, [me, submitted]);

  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    // Validation minimale (back gère user/date)
    if (!electionId || !slogan) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    // programme est requis côté back et limité à 2 Mo
    if (!programmeFile) {
      alert('Le fichier "Programme" est obligatoire.');
      return;
    }
    if (programmeFile.size > 2 * 1024 * 1024) {
      alert('Le fichier "Programme" dépasse 2 Mo.');
      return;
    }
    if (lettreMotivationFile && lettreMotivationFile.size > 2 * 1024 * 1024) {
      alert('La "Lettre de motivation" dépasse 2 Mo.');
      return;
    }

    const formData = new FormData();
    formData.append('election_id', electionId);
    formData.append('programme', programmeFile);
    if (lettreMotivationFile) formData.append('lettre_motivation', lettreMotivationFile);
    formData.append('slogan', slogan);

    try {
      await submitCandidature(formData);
      alert('Candidature soumise avec succès !');

      const selectedElection = elections.find(e => String(e.id) === electionId);
      setSubmitted({
        userEmail: me ? `${me.prenom} ${me.nom}` : '—', // ← affiche Prénom Nom
        electionTitre: selectedElection?.titre ?? '',
        // Date indicative ; la vraie vient du serveur
        date: new Date().toISOString().split('T')[0],
        slogan,
        programme: programmeFile?.name,
        lettre: lettreMotivationFile?.name,
      });

      // reset
      setElectionId('');
      setProgrammeFile(null);
      setLettreMotivationFile(null);
      setSlogan('');
      setOpen(false);
    } catch (err: any) {
      // Essaye de lire les erreurs Laravel si 422
      if (err?.status === 422 && err?.errors) {
        const lines = Object.entries(err.errors).map(([f, msgs]: any) =>
          `${f}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`
        );
        alert(lines.join('\n') || 'Erreur de validation (422).');
      } else {
        alert(err?.message || 'Erreur lors de la soumission.');
      }
      console.error('Soumission KO:', err);
    }
  };

  return (
    <AppShell role="electeur" title="Espace Électeur">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Déposer une candidature</h1>
          <Button variant="democratic" onClick={() => setOpen(true)}>Nouvelle candidature</Button>
        </div>

        {submitted && (
          <div className="border rounded-2xl p-4 md:p-6 bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Candidature soumise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div><span className="text-muted-foreground">Utilisateur:</span> {submitted.userEmail || '—'}</div>
                <div><span className="text-muted-foreground">Élection:</span> {submitted.electionTitre || '—'}</div>
                <div><span className="text-muted-foreground">Date de soumission:</span> {submitted.date || '—'}</div>
              </div>
              <div className="space-y-1">
                <div><span className="text-muted-foreground">Slogan:</span> {submitted.slogan || '—'}</div>
                <div><span className="text-muted-foreground">Programme:</span> {submitted.programme || '—'}</div>
                <div><span className="text-muted-foreground">Lettre:</span> {submitted.lettre || '—'}</div>
              </div>
            </div>
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Formulaire de candidature</DialogTitle>
              <DialogDescription>Renseignez les informations et joignez vos documents.</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Colonne gauche : (utilisateur & date gérés par le back) */}
              <div className="space-y-4">
                <div>
                  <Label>Élection *</Label>
                  <Select value={electionId} onValueChange={setElectionId}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Choisir une élection" /></SelectTrigger>
                    <SelectContent>
                      {elections.length > 0 ? (
                        elections.map((e) => (
                          <SelectItem key={e.id} value={String(e.id)}>{e.titre}</SelectItem>
                        ))
                      ) : (
                        <SelectItem value="__none" disabled>Aucune élection disponible</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Colonne droite */}
              <div className="space-y-4">
                <div>
                  <Label>Programme (fichier) *</Label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => setProgrammeFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border file:border-gray-200 file:text-sm file:font-semibold file:bg-white hover:file:bg-gray-50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Formats acceptés : PDF, DOC, DOCX, TXT (max 2 Mo)
                  </p>
                </div>

                <div>
                  <Label>Lettre de motivation (fichier)</Label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => setLettreMotivationFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border file:border-gray-200 file:text-sm file:font-semibold file:bg-white hover:file:bg-gray-50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Formats acceptés : PDF, DOC, DOCX, TXT (max 2 Mo) - Optionnel
                  </p>
                </div>

                <div>
                  <Label>Slogan *</Label>
                  <Input value={slogan} onChange={(e) => setSlogan(e.target.value)} placeholder="Votre slogan" />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
              <Button onClick={handleSubmit}>
                <Upload className="h-4 w-4 mr-2" />
                Soumettre
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
};

export default DepotCandidature;
