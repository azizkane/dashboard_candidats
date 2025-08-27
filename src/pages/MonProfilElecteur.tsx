import React, { useEffect, useState } from 'react';
import AppShell from '@/components/common/AppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { fetchUserProfile, updateUserProfile, getProfileAvatarUrl } from '../api';

interface UserProfile {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  date_naissance?: string;
  profil?: string;
  niveau?: string;
}

const MonProfilElecteur = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await fetchUserProfile();
      setProfile(data);
      setFormData(data);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    try {
      setSaving(true);
      await updateUserProfile(profile.id, formData);
      setProfile({ ...profile, ...formData });
      setEditing(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile || {});
    setEditing(false);
  };

  if (loading) {
    return (
      <AppShell role="electeur" title="Mon Profil">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600"></div>
        </div>
      </AppShell>
    );
  }

  if (!profile) {
    return (
      <AppShell role="electeur" title="Mon Profil">
        <div className="text-center text-red-600">Erreur lors du chargement du profil</div>
      </AppShell>
    );
  }

  return (
    <AppShell role="electeur" title="Mon Profil">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Mon Profil Électeur</h1>
          {!editing && (
            <Button onClick={() => setEditing(true)} variant="democratic">
              Modifier le profil
            </Button>
          )}
        </div>

        {/* Photo de profil et niveau */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={profile.profil ? getProfileAvatarUrl(profile.profil) : '/user.png'}
                alt="Photo de profil"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 shadow-lg"
              />
              {editing && (
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </Button>
              )}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-foreground">
                {profile.prenom} {profile.nom}
              </h2>
              {profile.niveau && (
                <div className="mt-2">
                  <Badge variant="secondary" className="text-sm">
                    Niveau : {profile.niveau}
                  </Badge>
                </div>
              )}
              <p className="text-muted-foreground mt-1">{profile.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations personnelles */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">Informations personnelles</h3>
              
              <div>
                <Label>Prénom</Label>
                {editing ? (
                  <Input
                    value={formData.prenom || ''}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">{profile.prenom}</p>
                )}
              </div>

              <div>
                <Label>Nom</Label>
                {editing ? (
                  <Input
                    value={formData.nom || ''}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">{profile.nom}</p>
                )}
              </div>

              <div>
                <Label>Email</Label>
                {editing ? (
                  <Input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">{profile.email}</p>
                )}
              </div>

              <div>
                <Label>Téléphone</Label>
                {editing ? (
                  <Input
                    value={formData.telephone || ''}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="mt-1"
                    placeholder="+33 6 12 34 56 78"
                  />
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">{profile.telephone || 'Non renseigné'}</p>
                )}
              </div>
            </div>

            {/* Informations complémentaires */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">Informations complémentaires</h3>
              
              <div>
                <Label>Date de naissance</Label>
                {editing ? (
                  <Input
                    type="date"
                    value={formData.date_naissance || ''}
                    onChange={(e) => setFormData({ ...formData, date_naissance: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {profile.date_naissance ? new Date(profile.date_naissance).toLocaleDateString('fr-FR') : 'Non renseignée'}
                  </p>
                )}
              </div>

              <div>
                <Label>Adresse</Label>
                {editing ? (
                  <Input
                    value={formData.adresse || ''}
                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                    className="mt-1"
                    placeholder="123 Rue de la République, 75001 Paris"
                  />
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">{profile.adresse || 'Non renseignée'}</p>
                )}
              </div>

              <div>
                <Label>Niveau</Label>
                {editing ? (
                  <Input
                    value={formData.niveau || ''}
                    onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}
                    className="mt-1"
                    placeholder="Débutant, Intermédiaire, Avancé..."
                  />
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">{profile.niveau || 'Non renseigné'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          {editing && (
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default MonProfilElecteur;