import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { DownloadIcon } from 'lucide-react';
import SidebarElecteur from '@/components/SidebarElecteur';
import Appbar from '@/components/AppbarElecteur';
import FooterElecteur from '@/components/FooterElecteur';

interface PV {
  id: number;
  titre: string;
  date_generation: string;
  statut: boolean | number | string;
  contenu_pdf: string;
  election: {
    titre: string;
  };
}

const PVList: React.FC = () => {
  const [pvs, setPvs] = useState<PV[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPVs = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError("Aucun token trouvé. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      const res = await axios.get('http://127.0.0.1:8000/api/liste_pvs_actifs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Réponse API :", res.data);

      if (Array.isArray(res.data.data)) {
        const actifs = res.data.data.filter((pv: PV) =>
          pv.statut === true || pv.statut === 1 || pv.statut === '1'
        );
        console.log("PVs actifs filtrés :", actifs);
        setPvs(actifs);
      } else {
        setError("Format inattendu de la réponse API.");
      }
    } catch (err) {
      console.error("Erreur :", err);
      setError("Erreur lors du chargement des PVs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPVs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Appbar title="Espace Électeur" />

      <div className="flex flex-1 overflow-hidden">
        <SidebarElecteur />

        <main className="flex-1 pl-4 md:pl-72 pr-6 pt-6 pb-10 bg-white dark:bg-gray-900 overflow-y-auto min-h-[calc(100vh-80px)]">
          <h1 className="text-3xl font-bold text-blue-600 mt-14 mb-8 text-center">
            Liste des Procès-Verbaux
          </h1>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {loading ? (
            <p className="text-blue-600 text-center">Chargement en cours...</p>
          ) : (
            <>
              {pvs.length === 0 ? (
                <div className="text-center text-gray-500">
                  Aucun PV actif trouvé.<br />
                  <pre className="text-xs text-left text-red-500 mt-4">
                    Debug : {JSON.stringify(pvs, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pvs.map((pv) => (
                    <Card key={pv.id} className="shadow-xl border border-blue-400">
                      <CardContent className="p-5 space-y-3">
                        <h2 className="text-xl font-semibold text-blue-700">
                          {pv.titre}
                        </h2>

                        <p className="text-sm text-gray-600">
                          Élection : <strong>{pv.election?.titre ?? 'Titre non dispo'}</strong>
                        </p>

                        <p className="text-sm text-gray-600">
                          Date : {pv.date_generation}
                        </p>

                        <div className="flex justify-center items-center mt-4">
                          <a
                            href={`http://127.0.0.1:8000/${pv.contenu_pdf}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                          >
                            <DownloadIcon size={16} /> Télécharger
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <FooterElecteur />
    </div>
  );
};

export default PVList;
