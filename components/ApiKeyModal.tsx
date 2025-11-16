import React, { useState } from 'react';

interface ApiKeyModalProps {
  onKeySubmit: (key: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onKeySubmit(apiKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 font-sans">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full m-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Chave de API do Gemini</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Para usar o assistente, por favor, insira sua chave de API do Google Gemini. Sua chave é armazenada de forma segura apenas no seu navegador.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Cole sua Chave de API aqui"
            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <div className="text-sm text-gray-500 mt-2">
            Não tem uma chave? Obtenha uma gratuitamente no{' '}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Google AI Studio
            </a>.
          </div>
          <button
            type="submit"
            disabled={!apiKey.trim()}
            className="w-full mt-6 bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            Salvar e Iniciar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApiKeyModal;
