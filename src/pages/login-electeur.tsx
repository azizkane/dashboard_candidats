import { useState } from 'react';
import LoginTemplate from '@/components/Logintemplate';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginElecteur = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    setErrorMessage('');
    setLoading(true);
    try {
      const response = await axios.post(
        'https://02d6a7afd014.ngrok-free.app/api/login-electeur',
        {
          email,
          password,
        },
        {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );
      localStorage.setItem('auth_token', response.data.token);
      navigate('/dashbord-electeur');
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
      title="Connexion Électeur"
      onCreateAccountClick={() => navigate('/register')}
    />
  );
};

export default LoginElecteur;
