import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { type Message } from './types';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import Chronology from './components/Chronology';
import BibleReader from './components/BibleReader';
import ApiKeyModal from './components/ApiKeyModal';
import { BookOpenIcon, ClockIcon, BibleIcon, BookTextIcon } from './components/IconComponents';

type Tab = 'chat' | 'chronology' | 'bibleReader';

const App: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [apiKey, setApiKey] = useState<string | null>(() => sessionStorage.getItem('GEMINI_API_KEY'));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, activeTab]);

  const initializeChat = useCallback((key: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: key });
      const chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: 'Você é o CBR ASSISTENTE BÍBLICO, um chatbot teológico especialista na Bíblia Sagrada sob a perspectiva Batista da Restauração e Carismática. Seu propósito é responder a perguntas de maneira respeitosa, perspicaz e bem informada, sempre baseando suas respostas nas escrituras. Forneça referências (livro, capítulo e versículo) sempre que possível. Dê ênfase a doutrinas como o batismo por imersão, o batismo no Espírito Santo, a atualidade dos dons espirituais e a restauração da igreja primitiva de Atos. Use um tom amigável e acessível. Ao ser solicitado a falar sobre um evento cronológico, explique o evento e sua importância teológica. Ao ser solicitado o texto de um capítulo da Bíblia, forneça o texto completo, com cada versículo numerado e em uma nova linha (ex: "1. No princípio..."). Comunique-se em português do Brasil.',
        },
      });
      setChat(chatSession);
      setMessages([
        {
          role: 'model',
          content: 'Paz do Senhor! Sou o CBR ASSISTENTE BÍBLICO. Como posso ajudá-lo a explorar as Escrituras hoje sob a perspectiva Batista da Restauração e Carismática?',
        },
      ]);
       setError(null);
    } catch (e) {
        if (e instanceof Error) {
            setError(`Falha ao inicializar o chat: ${e.message}. Verifique sua Chave de API.`);
        } else {
            setError("Ocorreu um erro desconhecido durante a inicialização do chat.");
        }
        // Clear the bad key
        sessionStorage.removeItem('GEMINI_API_KEY');
        setApiKey(null);
    }
  }, []);

  useEffect(() => {
    if (apiKey) {
      initializeChat(apiKey);
    }
  }, [apiKey, initializeChat]);

  const handleApiKeySubmit = (key: string) => {
    sessionStorage.setItem('GEMINI_API_KEY', key);
    setApiKey(key);
  };

  const handleSendMessage = async (userInput: string) => {
    if (!chat || isLoading || !userInput.trim()) return;

    const userMessage: Message = { role: 'user', content: userInput };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await chat.sendMessage({ message: userInput });
      const modelMessage: Message = { role: 'model', content: response.text };
      setMessages((prevMessages) => [...prevMessages, modelMessage]);
    } catch (e) {
        if (e instanceof Error) {
            setError(`Ocorreu um erro: ${e.message}`);
        } else {
            setError("Ocorreu um erro desconhecido ao enviar a mensagem.");
        }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFetchChapter = async (book: string, chapter: number) => {
    if (!chat) return "Chat não inicializado.";
    setIsLoading(true); // Set loading state for chapter fetching
    const prompt = `Por favor, forneça o texto completo do livro de ${book}, capítulo ${chapter}, com cada versículo numerado e em uma nova linha.`;
     try {
      const response = await chat.sendMessage({ message: prompt });
      return response.text;
    } catch (e) {
        if (e instanceof Error) {
            return `Ocorreu um erro ao buscar o capítulo: ${e.message}`;
        }
        return "Ocorreu um erro desconhecido ao buscar o capítulo.";
    } finally {
        setIsLoading(false);
    }
  };

  const handleChronologySelect = (title: string, reference: string) => {
    const prompt = `Por favor, fale-me sobre "${title} (${reference})" e sua importância na perspectiva Batista da Restauração e Carismática.`;
    setActiveTab('chat');
    setTimeout(() => handleSendMessage(prompt), 0);
  };
  
  const TabButton = ({ tabName, label, icon, activeTab, setActiveTab }: { tabName: Tab; label: string; icon: React.ReactNode; activeTab: Tab; setActiveTab: (tab: Tab) => void; }) => {
    const isActive = activeTab === tabName;
    return (
        <button 
            onClick={() => setActiveTab(tabName)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
            {icon}
            {label}
        </button>
    );
  };
  
  if (!apiKey) {
    return <ApiKeyModal onKeySubmit={handleApiKeySubmit} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center fixed top-0 w-full z-10">
        <div className="flex items-center space-x-3">
            <BookOpenIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">CBR ASSISTENTE BÍBLICO</h1>
        </div>
        <nav className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
            <TabButton 
                tabName="chat" 
                label="Chat" 
                icon={<BibleIcon className="h-5 w-5"/>} 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            <TabButton 
                tabName="chronology" 
                label="Cronologia" 
                icon={<ClockIcon className="h-5 w-5"/>} 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            <TabButton 
                tabName="bibleReader" 
                label="Ler Bíblia" 
                icon={<BookTextIcon className="h-5 w-5"/>} 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
        </nav>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pt-24 pb-24">
        {activeTab === 'chat' && (
            <div className="max-w-3xl mx-auto w-full space-y-6">
            {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} />
            ))}
            {isLoading && (
                <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 max-w-lg animate-pulse flex items-center space-x-2">
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
                </div>
                </div>
            )}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-bold">Erro: </strong>
                <span className="block sm:inline">{error}</span>
                </div>
            )}
            <div ref={messagesEndRef} />
            </div>
        )}
        {activeTab === 'chronology' && <Chronology onSelectEvent={handleChronologySelect} />}
        {activeTab === 'bibleReader' && <BibleReader onFetchChapter={handleFetchChapter} />}
      </main>

      {activeTab === 'chat' && (
        <footer className="fixed bottom-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2 md:p-4">
            <div className="max-w-3xl mx-auto">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
        </footer>
      )}
    </div>
  );
};

export default App;