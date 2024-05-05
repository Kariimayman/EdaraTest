import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './App.css';
function App() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  async function sendMessage() {
    if (userInput.trim() !== '') {
      // Update messages with user input
      const newMessage = {
        sender: 'user',
        text: "Loading",
      };
      setMessages([...messages, newMessage]);
      setUserInput('');
      const genAI = new GoogleGenerativeAI('AIzaSyDlAZg508ARGhDkCyIuJUu7X1AnLO8W9Rw');
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = userInput;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const botResponse = {
        sender: 'bot',
        text: text,
      };
      setUserInput("")
      setMessages([...messages, botResponse]);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div class="chat-container bg-gradient-to-r from-indigo-500 to-purple-600  max-h-full rounded-xl shadow-md p-4 flex flex-col h-screen overflow-y-auto">
      <h2 class="text-5xl text-white font-bold mb-4 text-center">Chat with EdaraBot</h2>
      <div className='w-1/2 m-auto '>
        <div class="flex flex-col gap-1 overflow-y-auto max-h-full max-w-full text-white text-xl m-auto">
          {messages.map((message) => (
            <div class="m-auto" key={message.text} className={`message ${message.sender}`}>
              {message.text}
            </div>
          ))}
        </div>
        <div class="flex items-center justify-center gap-2 pt-20">

          <input
            type="text"
            class="rounded-md px-20 py-2 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={userInput}
            onChange={handleUserInput}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
          />
          <button
            class="bg-indigo-500 text-white hover:bg-indigo-700 font-bold py-2 px-4 rounded-md shadow-sm"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
