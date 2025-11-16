import React from 'react';

interface ChronologyEvent {
  era: string;
  events: {
    title: string;
    reference: string;
  }[];
}

const chronologicalData: ChronologyEvent[] = [
    {
        era: 'O Princípio',
        events: [
            { title: 'A Criação', reference: 'Gênesis 1-2' },
            { title: 'A Queda do Homem', reference: 'Gênesis 3' },
            { title: 'Caim e Abel', reference: 'Gênesis 4' },
            { title: 'O Dilúvio', reference: 'Gênesis 6-9' },
            { title: 'A Torre de Babel', reference: 'Gênesis 11' },
        ],
    },
    {
        era: 'Os Patriarcas',
        events: [
            { title: 'O Chamado de Abrão', reference: 'Gênesis 12' },
            { title: 'Nascimento de Isaque', reference: 'Gênesis 21' },
            { title: 'Jacó e Esaú', reference: 'Gênesis 25-27' },
            { title: 'José no Egito', reference: 'Gênesis 37-50' },
        ],
    },
    {
        era: 'Êxodo e Conquista',
        events: [
            { title: 'O Nascimento de Moisés', reference: 'Êxodo 2' },
            { title: 'As Dez Pragas', reference: 'Êxodo 7-12' },
            { title: 'A Travessia do Mar Vermelho', reference: 'Êxodo 14' },
            { title: 'Os Dez Mandamentos', reference: 'Êxodo 20' },
            { title: 'A Conquista de Jericó', reference: 'Josué 6' },
        ],
    },
    {
        era: 'Juízes e Reino Unido',
        events: [
            { title: 'Gideão', reference: 'Juízes 6-8' },
            { title: 'Sansão', reference: 'Juízes 13-16' },
            { title: 'O Rei Saul', reference: '1 Samuel 9-10' },
            { title: 'Davi e Golias', reference: '1 Samuel 17' },
            { title: 'Reinado de Salomão', reference: '1 Reis 1-11' },
        ],
    },
    {
        era: 'Reino Dividido e Exílio',
        events: [
            { title: 'A Divisão do Reino', reference: '1 Reis 12' },
            { title: 'O Profeta Elias', reference: '1 Reis 17 - 2 Reis 2' },
            { title: 'A Queda de Israel (Norte)', reference: '2 Reis 17' },
            { title: 'O Exílio na Babilônia', reference: '2 Reis 25' },
            { title: 'Daniel na Cova dos Leões', reference: 'Daniel 6' },
        ],
    },
     {
        era: 'A Vida de Cristo',
        events: [
            { title: 'O Nascimento de Jesus', reference: 'Lucas 2' },
            { title: 'O Batismo de Jesus', reference: 'Mateus 3' },
            { title: 'O Sermão da Montanha', reference: 'Mateus 5-7' },
            { title: 'A Crucificação', reference: 'João 19' },
            { title: 'A Ressurreição', reference: 'João 20' },
        ],
    },
    {
        era: 'A Igreja Primitiva',
        events: [
            { title: 'O Pentecostes', reference: 'Atos 2' },
            { title: 'A Conversão de Saulo (Paulo)', reference: 'Atos 9' },
            { title: 'As Viagens Missionárias de Paulo', reference: 'Atos 13-28' },
            { title: 'Visão de João em Patmos', reference: 'Apocalipse 1' },
        ],
    },
];

interface ChronologyProps {
  onSelectEvent: (title: string, reference: string) => void;
}

const Chronology: React.FC<ChronologyProps> = ({ onSelectEvent }) => {
  return (
    <div className="max-w-3xl mx-auto w-full space-y-6">
        {chronologicalData.map((eraData) => (
            <div key={eraData.era}>
                <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3 sticky top-[92px] bg-gray-100 dark:bg-gray-900 py-2 -mx-4 px-4">{eraData.era}</h2>
                <div className="space-y-2">
                    {eraData.events.map((event, index) => (
                        <button
                            key={index}
                            onClick={() => onSelectEvent(event.title, event.reference)}
                            className="w-full text-left p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-[1.02]"
                        >
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{event.title}</p>
                            <p className="text-sm text-blue-500 dark:text-blue-400">{event.reference}</p>
                        </button>
                    ))}
                </div>
            </div>
        ))}
    </div>
  );
};

export default Chronology;
