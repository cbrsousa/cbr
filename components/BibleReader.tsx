import React, { useState, useMemo } from 'react';
import { bibleBooks } from '../data/bibleBooks';

interface BibleReaderProps {
  onFetchChapter: (book: string, chapter: number) => Promise<string>;
}

const BibleReader: React.FC<BibleReaderProps> = ({ onFetchChapter }) => {
  const [selectedBook, setSelectedBook] = useState(bibleBooks[0].books[0].name);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [chapterContent, setChapterContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const currentBookData = useMemo(() => {
    for (const testament of bibleBooks) {
        const book = testament.books.find(b => b.name === selectedBook);
        if (book) return book;
    }
    return bibleBooks[0].books[0];
  }, [selectedBook]);

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBook(e.target.value);
    setSelectedChapter(1); // Reset chapter when book changes
    setChapterContent(''); // Clear content
  };

  const handleChapterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChapter(Number(e.target.value));
    setChapterContent(''); // Clear content
  };

  const fetchAndDisplayChapter = async () => {
    setIsLoading(true);
    setError(null);
    setChapterContent('');
    try {
      const content = await onFetchChapter(selectedBook, selectedChapter);
      setChapterContent(content);
    } catch (e) {
      if (e instanceof Error) {
        setError(`Erro ao carregar o capítulo: ${e.message}`);
      } else {
        setError('Ocorreu um erro desconhecido.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatVerse = (line: string) => {
    const match = line.match(/^(\d+)\.\s*(.*)/);
    if (match) {
        const [, verseNumber, verseText] = match;
        return (
            <p className="mb-2">
                <span className="font-bold text-blue-600 dark:text-blue-400 text-sm align-super mr-2">{verseNumber}</span>
                {verseText}
            </p>
        );
    }
    return <p className="mb-2">{line}</p>;
  };

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Leitura da Bíblia</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="sm:col-span-2">
                    <label htmlFor="book-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Livro</label>
                    <select
                        id="book-select"
                        value={selectedBook}
                        onChange={handleBookChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                        {bibleBooks.map(testament => (
                            <optgroup label={testament.testament} key={testament.testament}>
                                {testament.books.map(book => (
                                    <option key={book.name} value={book.name}>{book.name}</option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>
                <div>
                     <label htmlFor="chapter-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Capítulo</label>
                     <select
                        id="chapter-select"
                        value={selectedChapter}
                        onChange={handleChapterChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                        {Array.from({ length: currentBookData.chapters }, (_, i) => i + 1).map(chapNum => (
                            <option key={chapNum} value={chapNum}>{chapNum}</option>
                        ))}
                     </select>
                </div>
            </div>
            <button
                onClick={fetchAndDisplayChapter}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
                {isLoading ? 'Carregando...' : `Ler ${selectedBook} ${selectedChapter}`}
            </button>
        </div>

        {(isLoading || error || chapterContent) && (
             <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md min-h-[200px]">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 border-b pb-2 mb-4 border-gray-200 dark:border-gray-700">{selectedBook} {selectedChapter}</h3>
                {isLoading && <p className="text-gray-600 dark:text-gray-400 animate-pulse">Buscando as escrituras...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {chapterContent && (
                    <div className="text-gray-800 dark:text-gray-200 leading-relaxed bible-text">
                        {chapterContent.split('\n').map((line, index) => (
                           <React.Fragment key={index}>{formatVerse(line)}</React.Fragment>
                        ))}
                    </div>
                )}
            </div>
        )}
    </div>
  );
};

export default BibleReader;
