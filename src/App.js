import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleLogin } from '@react-oauth/google';
import './App.css';
function App() {
  const [message, setMessage] = useState("مرحباً، يسعدني مساعدتك اليوم. كيف يمكنني مساعدتك؟");
  const [userInput, setUserInput] = useState('');

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  async function sendMessage() {
    if (userInput.trim() !== '') {
      setMessage("Loading....");
      const genAI = new GoogleGenerativeAI('AIzaSyCkM44TR33a0FomGDszGbuBnzyJL1pjg08');
      const model = genAI.getGenerativeModel({ model: "tunedModels/edarachatbot2" });
      const prompt = userInput;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setUserInput("")
      setMessage(text);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };
  const responseMessage = (response) => {
    console.log(response);
};
const errorMessage = (error) => {
    console.log(error);
};
  return (
    <div class="chat-container bg-gradient-to-r from-indigo-500 to-purple-600  max-h-full rounded-xl shadow-md flex flex-col h-screen overflow-y-auto p-10">
      <h2 class="text-5xl text-white font-bold mb-4 text-center">Chat with EdaraBot</h2>
      <div className='pt-10'>
        <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
        <div class="flex items-center justify-center ">
          <div class="message-bubble rounded-lg bg-indigo-800 px-4 py-4 text-white shadow-md text-center text-2xl">
            {message}
          </div>
        </div>
        <div class="flex items-center justify-center gap-2 py-10 w-full sm:w-1/2  m-auto ">

          <input
            type="text"
            class="rounded-md py-2 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center w-full"
            value={userInput}
            onChange={handleUserInput}
            onKeyPress={handleKeyPress}
            placeholder=""
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
