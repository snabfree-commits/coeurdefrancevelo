import React, { useState } from 'react';

interface LoginModalProps {
  onLogin: (success: boolean) => void;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Check credentials (accepting both gmail and the gmmail typo just in case)
    if (
      (cleanEmail === 'snabfree@gmail.com' || cleanEmail === 'snabfree@gmmail.com') && 
      cleanPassword === 'A123456'
    ) {
      onLogin(true);
    } else {
      setError('Identifiants incorrects. Vérifiez snabfree@gmail.com / A123456');
      onLogin(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-emerald-700 p-4 text-white flex justify-between items-center">
          <h3 className="font-bold text-lg">Connexion Admin</h3>
          <button onClick={onClose} className="text-emerald-100 hover:text-white">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="snabfree@gmail.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input 
              type="password" 
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••••"
            />
          </div>

          {error && (
            <div className="p-2 bg-red-50 text-red-600 text-sm rounded border border-red-100 text-center">
              {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow transition-colors"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;