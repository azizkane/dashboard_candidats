// ✅ LoginTemplate.tsx
import React, { useState } from 'react';

interface LoginTemplateProps {
  handleLogin: (email: string, password: string) => void;
  loading: boolean;
  errorMessage: string;
  title: string;
  onCreateAccountClick?: () => void;
}

const LoginTemplate: React.FC<LoginTemplateProps> = ({
  handleLogin,
  loading,
  errorMessage,
  title,
  onCreateAccountClick,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE */}
      <div className="w-1/2 bg-gradient-to-br from-blue-600 to-blue-400 text-white flex flex-col justify-center items-center p-10">
        <div className="text-4xl font-bold mb-4">Bienvenue sur Votify</div>
        <p className="text-lg mb-8 text-center max-w-sm">
          Votre plateforme sécurisée pour participer aux élections démocratiques en ligne
        </p>
       
       
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 flex justify-center items-center bg-white relative">
        <form onSubmit={submit} className="w-full max-w-md px-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">{title}</h2>
          <p className="text-center text-gray-500 mb-6">Accédez à votre espace personnel</p>

          {errorMessage && (
            <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm text-center">
              {errorMessage}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 rounded-md font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          {onCreateAccountClick && (
            <div className="text-center mt-6 text-sm">
              Pas encore de compte ?{' '}
              <a onClick={onCreateAccountClick} className="text-blue-600 hover:underline cursor-pointer">
                Créer un compte
              </a>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginTemplate;
