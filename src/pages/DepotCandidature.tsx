import React, { useEffect, useState } from 'react';
import AppShell from '@/components/common/AppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { fetchUsers, fetchElections, submitCandidature } from '../api';
import { Upload } from 'lucide-react';

interface UserOption { id: number; email: string }
interface ElectionOption { id: number; titre: string }

const DepotCandidature = () => {
  const [users, setUsers] = useState<UserOption[]>([]);
  const [elections, setElections] = useState<ElectionOption[]>([]);

  const [userId, setUserId] = useState('');
  const [electionId, setElectionId] = useState('');
  const [programmeFile, setProgrammeFile] = useState<File | null>(null);
  const [lettreMotivationFile, setLettreMotivationFile] = useState<File | null>(null);
  const [slogan, setSlogan] = useState('');
  const [dateSoumission, setDateSoumission] = useState('');
  const [submitted, setSubmitted] = useState<null | {
    userEmail: string;
    electionTitre: string;
    date: string;
    slogan: string;
    programme?: string;
    lettre?: string;
  }>(null);

  const fetchData = async () => {
    try {
      const [usersData, electionsData] = await Promise.all([
        fetchUsers(),
        fetchElections(),
      ]);
      setUsers(usersData as UserOption[]);
      setElections(electionsData as ElectionOption[]);
    } catch (error) {
      console.error('Erreur de chargement des données :', error);
    }
  };

  const handleSubmit = async () => {
    // Validation des champs requis
    if (!userId || !electionId || !dateSoumission || !slogan) {
      alert('Veuillez remplir tous les champs obligatoires (Utilisateur, Élection, Date de soumission, Slogan)');
      return;
    }

    const formData = new FormData();

    formData.append('user_id', userId);
    formData.append('election_id', electionId);
    if (programmeFile) formData.append('programme', programmeFile);
    if (lettreMotivationFile) formData.append('lettre_motivation', lettreMotivationFile);
    formData.append('slogan', slogan);
    formData.append('date_soumission', new Date(dateSoumission).toISOString().split('T')[0]);

    try {
      await submitCandidature(formData);
      alert('Candidature soumise avec succès !');
      const selectedUser = users.find(u => String(u.id) === userId);
      const selectedElection = elections.find(e => String(e.id) === electionId);
      setSubmitted({
        userEmail: selectedUser?.email ?? '',
        electionTitre: selectedElection?.titre ?? '',
        date: dateSoumission,
        slogan,
        programme: programmeFile?.name,
        lettre: lettreMotivationFile?.name,
      });
      setUserId('');
      setElectionId('');
      setProgrammeFile(null);
      setLettreMotivationFile(null);
      setSlogan('');
      setDateSoumission('');
      setOpen(false);
    } catch (err) {
      alert('Erreur lors de la soumission.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [open, setOpen] = useState(false);

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
              {/* Colonne gauche */}
              <div className="space-y-4">
                <div>
                  <Label>Utilisateur</Label>
                  <Select value={userId} onValueChange={setUserId}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Choisir un utilisateur" /></SelectTrigger>
                    <SelectContent>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={String(u.id)}>{u.email}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Élection</Label>
                  <Select value={electionId} onValueChange={setElectionId}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Choisir une élection" /></SelectTrigger>
                    <SelectContent>
                      {elections.map((e) => (
                        <SelectItem key={e.id} value={String(e.id)}>{e.titre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Date de soumission</Label>
                  <Input type="date" value={dateSoumission} onChange={(e) => setDateSoumission(e.target.value)} />
                </div>
              </div>

              {/* Colonne droite */}
              <div className="space-y-4">
                <div>
                  <Label>Programme (fichier)</Label>
                  <input
                    type="file"
                    onChange={(e) => setProgrammeFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border file:border-gray-200 file:text-sm file:font-semibold file:bg-white hover:file:bg-gray-50"
                  />
                </div>

                <div>
                  <Label>Lettre de motivation (fichier)</Label>
                  <input
                    type="file"
                    onChange={(e) => setLettreMotivationFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border file:border-gray-200 file:text-sm file:font-semibold file:bg-white hover:file:bg-gray-50"
                  />
                </div>

                <div>
                  <Label>Slogan</Label>
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
