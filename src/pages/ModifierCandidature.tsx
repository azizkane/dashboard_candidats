import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '@/components/common/AppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, FileText, Edit3 } from 'lucide-react';
import {
  fetchCandidatureById,
  updateCandidature
} from '../api';

const ModifierCandidature = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [slogan, setSlogan] = useState('');
  const [programme, setProgramme] = useState<File | null>(null);
  const [lettreMotivation, setLettreMotivation] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [candidatureData, setCandidatureData] = useState<any>(null);

  useEffect(() => {
    const getCandidature = async () => {
      try {
        if (id) {
          const data = await fetchCandidatureById(id);
          setCandidatureData(data);
          setSlogan(data.slogan || '');
        }
      } catch (err) {
        console.error('Erreur chargement candidature', err);
      }
    };

    getCandidature();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('slogan', slogan);
    if (programme) formData.append('programme', programme);
    if (lettreMotivation) formData.append('lettre_motivation', lettreMotivation);

    try {
      if (id) {
        await updateCandidature(id, formData);
        alert('✅ Candidature mise à jour avec succès !');
        navigate('/candidat/ma_candidature');
      }
    } catch (err: any) {
      console.error('Erreur modification', err);
      alert(`❌ Une erreur est survenue lors de la modification: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (setter: (file: File | null) => void, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setter(file);
  };

  return (
    <AppShell role="candidat" title="Modifier Candidature">
      <div className="space-y-6">
        {/* Header avec navigation */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/candidat/ma_candidature')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Modifier ma Candidature</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Mettez à jour les informations de votre candidature
            </p>
          </div>
        </div>

        {/* Informations actuelles */}
        {candidatureData && (
          <Card className="border border-blue-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Candidature actuelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Élection :</span>
                  <p className="font-medium">{candidatureData.election?.titre || 'Non spécifiée'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date de soumission :</span>
                  <p className="font-medium">
                    {candidatureData.date_soumission
                      ? new Date(candidatureData.date_soumission).toLocaleDateString('fr-FR')
                      : 'Non spécifiée'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formulaire de modification */}
        <Card className="border border-blue-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Modifier la candidature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Slogan */}
              <div className="space-y-2">
                <Label htmlFor="slogan">Slogan *</Label>
                <Input
                  id="slogan"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder="Votre nouveau slogan de campagne"
                  required
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Le slogan est obligatoire et sera visible par les électeurs
                </p>
              </div>

              {/* Programme */}
              <div className="space-y-2">
                <Label htmlFor="programme">Nouveau programme</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="programme"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(setProgramme, e)}
                    className="flex-1"
                  />
                  {programme && (
                    <Badge variant="secondary" className="text-xs">
                      {programme.name}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Formats acceptés : PDF, DOC, DOCX (max 2 Mo) - Optionnel
                </p>
              </div>

              {/* Lettre de motivation */}
              <div className="space-y-2">
                <Label htmlFor="lettre">Nouvelle lettre de motivation</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="lettre"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(setLettreMotivation, e)}
                    className="flex-1"
                  />
                  {lettreMotivation && (
                    <Badge variant="secondary" className="text-xs">
                      {lettreMotivation.name}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Formats acceptés : PDF, DOC, DOCX (max 2 Mo) - Optionnel
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/candidat/ma_candidature')}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Sauvegarder
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Aide et informations */}
        <Card className="border border-blue-100 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="space-y-2 text-sm">
                <p className="font-medium text-blue-900">Conseils pour une bonne candidature :</p>
                <ul className="text-blue-800 space-y-1">
                  <li>• Votre slogan doit être clair et mémorable</li>
                  <li>• Le programme doit détailler vos propositions concrètes</li>
                  <li>• La lettre de motivation peut renforcer votre dossier</li>
                  <li>• Tous les documents seront vérifiés par l'administration</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default ModifierCandidature;
