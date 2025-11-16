
import React from 'react';
import { type Message } from '../types';
import { BibleIcon, UserIcon } from './IconComponents';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';
  
  // Basic markdown-like formatting for bold text and lists.
  const formatContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Handle bold text **text**
      const boldedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Handle list items * item or - item
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        return (
          <li key={index} className="ml-5" dangerouslySetInnerHTML={{ __html: boldedLine.substring(2) }}></li>
        );
      }
      
      return (
        <p key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: boldedLine }}></p>
      );
    });
  };

  return (
    <div className={`flex items-start gap-3 ${isModel ? 'justify-start' : 'justify-end'}`}>
      {isModel && (
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
          <BibleIcon className="h-6 w-6" />
        </div>
      )}
      <div
        className={`rounded-2xl p-4 max-w-lg break-words shadow-md ${
          isModel
            ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none'
            : 'bg-blue-600 dark:bg-blue-500 text-white rounded-br-none'
        }`}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none text-inherit">
             {formatContent(message.content)}
        </div>
      </div>
      {!isModel && (
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 shadow-md">
          <UserIcon className="h-6 w-6" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
