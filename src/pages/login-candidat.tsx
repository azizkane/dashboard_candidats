// src/pages/LoginCandidat.tsx
import { useState } from 'react';
import LoginTemplate from '@/components/Logintemplate';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginCandidat = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    setErrorMessage('');
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login-candidat', { email, password });
      localStorage.setItem('auth_token', response.data.token);
      navigate('/dashbord-candidat');
    } catch {
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
