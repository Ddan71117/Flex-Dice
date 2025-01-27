'use client';

import React, { useState } from 'react';

interface Message {
  id: number;
  text: string;
}

const LiveChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');

  const sendMessage = () => {
    if (message.trim() === '') return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: message,
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  return (
    <div className="fixed bottom-0 left-0 w-75 h-75 p-4 bg-gray-800 text-black">
      <div className="overflow-y-auto max-h-48">
        {messages.map((msg) => (
          <div key={msg.id} className="py-2 px-4 border-b border-gray-600">{msg.text}</div>
        ))}
      </div>
      <div className="flex mt-2">
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow p-2 border rounded-md"
        />
        <button
          className="ml-2 p-2 bg-blue-500 rounded-md hover:bg-blue-700"
          onClick={sendMessage}
        >
          Chat
        </button>
      </div>
    </div>
  );
};

export default LiveChat;
