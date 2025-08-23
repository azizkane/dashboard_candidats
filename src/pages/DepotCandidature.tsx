import React, { useEffect, useState } from 'react';
import Appbar from '../components/AppbarElecteur';
import SidebarElecteur from '../components/SidebarElecteur';
import FooterElecteur from '../components/FooterElecteur';
import {
  fetchUsers,
  fetchElections,
  submitCandidature
} from '../api';

const DepotCandidature = () => {
  const [users, setUsers] = useState([]);
  const [elections, setElections] = useState([]);

  const [userId, setUserId] = useState('');
  const [electionId, setElectionId] = useState('');
  const [programmeFile, setProgrammeFile] = useState<File | null>(null);
  const [lettreMotivationFile, setLettreMotivationFile] = useState<File | null>(null);
  const [slogan, setSlogan] = useState('');
  const [dateSoumission, setDateSoumission] = useState('');

  const fetchData = async () => {
    try {
      const [usersData, electionsData] = await Promise.all([
        fetchUsers(),
        fetchElections(),
      ]);
      setUsers(usersData);
      setElections(electionsData);
    } catch (error) {
      console.error('Erreur de chargement des données :', error);
    }
  };

  const handleSubmit = async () => {
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
      setUserId('');
      setElectionId('');
      setProgrammeFile(null);
      setLettreMotivationFile(null);
      setSlogan('');
      setDateSoumission('');
    } catch (err) {
      alert('Erreur lors de la soumission.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="candidature-page">
      <Appbar title="Espace Électeur" />
      <div className="candidature-layout">
        <SidebarElecteur />
        <div className="candidature-main">
          <div className="candidature-form">
            <h2 className="candidature-title">Ajouter une candidature</h2>

            <div className="form-group-row">
              <div className="form-group">
                <label>Utilisateur</label>
                <select value={userId} onChange={(e) => setUserId(e.target.value)}>
                  <option value="">Choisir un utilisateur</option>
                  {users.map((user: any) => (
                    <option key={user.id} value={user.id}>{user.email}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Élection</label>
                <select value={electionId} onChange={(e) => setElectionId(e.target.value)}>
                  <option value="">Choisir une élection</option>
                  {elections.map((election: any) => (
                    <option key={election.id} value={election.id}>{election.titre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Programme (fichier)</label>
              <input type="file" onChange={(e) => setProgrammeFile(e.target.files?.[0] || null)} />
            </div>

            <div className="form-group">
              <label>Slogan</label>
              <input type="text" value={slogan} onChange={(e) => setSlogan(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Lettre de motivation (fichier)</label>
              <input type="file" onChange={(e) => setLettreMotivationFile(e.target.files?.[0] || null)} />
            </div>

            <div className="form-group">
              <label>Date de soumission</label>
              <input type="date" value={dateSoumission} onChange={(e) => setDateSoumission(e.target.value)} />
            </div>

            <div className="form-group">
              <button onClick={handleSubmit}>Soumettre la candidature</button>
            </div>
          </div>
        </div>
      </div>
      
        <FooterElecteur />
      

      <style>
        {`
          .candidature-page {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }

          .candidature-layout {
            display: flex;
            flex: 1;
            background-color: #f8f9fa;
          }

          .candidature-main {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding: 3rem 1rem;
          }

          .candidature-form {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
            width: 100%;
            max-width: 600px;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            border-top: 4px solid #2196f3;
          }

          .candidature-title {
            text-align: center;
            color: #03a9f4;
            font-size: 1.8rem;
            font-weight: bold;
          }

          .form-group-row {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            width: 100%;
          }

          label {
            font-weight: bold;
            margin-bottom: 0.5rem;
          }

          select,
          input[type="text"],
          input[type="file"],
          input[type="date"],
          button {
            padding: 0.7rem;
            border: 1px solid #03a9f4;
            border-radius: 6px;
            font-size: 1rem;
          }

          button {
            background-color: #03a9f4;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s;
          }

          button:hover {
            background-color: #0288d1;
          }

          .footer-container {
            margin-left: 250px; /* décalage correspondant à SidebarElecteur */
          }
        `}
      </style>
    </div>
  );
};

export default DepotCandidature;
