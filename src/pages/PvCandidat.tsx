import React, { useEffect, useState } from 'react';
import AppShell from '@/components/common/AppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { fetchActivePVs, getPvDownloadProps } from '../api';
import { FileText, Download, Calendar, Search } from 'lucide-react';

interface PV {
  id: number;
  titre: string;
  date_generation: string;
  statut: boolean | number | string;
  contenu_pdf: string;
  election?: { titre?: string };
}

const PvCandidat = () => {
  const [pvs, setPvs] = useState<PV[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPvList();
  }, []);

  const loadPvList = async () => {
    try {
      setLoading(true);
      const data = await fetchActivePVs();
      const actifs = data.filter(
        (pv: PV) => pv.statut === true || pv.statut === 1 || pv.statut === '1'
      );
      setPvs(actifs);
    } catch (error) {
      console.error('Erreur lors du chargement des PVs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatutBadge = (statut: boolean | number | string) => {
    if (statut === true || statut === 1 || statut === '1') {
      return <Badge variant="default" className="bg-green-100 text-green-800">Actif</Badge>;
    }
    return <Badge variant="secondary">Inactif</Badge>;
  };

  const filteredPvs = pvs.filter(pv =>
    pv.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pv.election?.titre?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <AppShell role="candidat" title="Procès-verbaux">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Chargement des procès-verbaux...</div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell role="candidat" title="Procès-verbaux">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Procès-verbaux</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un PV..."
              className="pl-10 w-full md:w-72"
            />
          </div>
        </div>

        {filteredPvs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun procès-verbal trouvé</h3>
            <p className="text-gray-500">
              {searchQuery ? 'Aucun PV ne correspond à votre recherche.' : 'Aucun procès-verbal disponible pour le moment.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPvs.map((pv) => {
              const { href, download } = getPvDownloadProps(pv);
              
              return (
                <div key={pv.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-2">
                          {pv.titre}
                        </h3>
                        {pv.election?.titre && (
                          <p className="text-sm text-muted-foreground mb-3">
                            Élection : {pv.election.titre}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(pv.date_generation).toLocaleDateString('fr-FR')}
                        </div>
                        {getStatutBadge(pv.statut)}
                      </div>

                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={href} download={download}>
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger le PV
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default PvCandidat;
