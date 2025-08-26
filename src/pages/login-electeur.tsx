import { useState } from 'react';
import LoginTemplate from '@/components/Logintemplate';
import { loginElector } from '@/api';
import { useNavigate } from 'react-router-dom';

const LoginElecteur = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    setErrorMessage('');
    setLoading(true);
    try {
      const data = await loginElector(email, password);
      const token: string = data?.token ?? '';
      if (!token) throw new Error('Token manquant');
      localStorage.setItem('auth_token', token);
      sessionStorage.setItem('auth_token', token);
      navigate('/dashbord-electeur');
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
      title="Connexion Électeur"
      onCreateAccountClick={() => navigate('/register')}
    />
  );
};

export default LoginElecteur;
