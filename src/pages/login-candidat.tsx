// src/pages/LoginCandidat.tsx
import { useState } from 'react';
import LoginTemplate from '@/components/Logintemplate';
import { loginCandidate } from '@/api';
import { useNavigate } from 'react-router-dom';

const LoginCandidat = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    setErrorMessage('');
    setLoading(true);
    try {
      const data = await loginCandidate(email, password);
      const token: string = data?.token ?? '';
      if (!token) throw new Error('Token manquant');
      localStorage.setItem('auth_token', token);
      sessionStorage.setItem('auth_token', token);
      navigate('/dashbord-candidat');
    } catch (e) {
      setErrorMessage('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginTemplate
      handleLogin={handleLogin}
      loading={loading}
      errorMessage={errorMessage}
      title="Connexion Candidat"
      onCreateAccountClick={() => navigate('/register')}
    />
  );
};

export default LoginCandidat;
