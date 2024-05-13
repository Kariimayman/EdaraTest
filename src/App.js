import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleLogin } from '@react-oauth/google';
import './App.css';
import axios from 'axios'; // Assuming you're using Axios for HTTP requests
function App() {
  const [message, setMessage] = useState("مرحباً، يسعدني مساعدتك اليوم. كيف يمكنني مساعدتك؟");
  const [userInput, setUserInput] = useState('');
  const [accessToken, setAccessToken] = useState('');

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  async function sendMessage() {
    if (userInput.trim() !== '') {
      setMessage("Loading....");
      var text = fetchData(userInput)
      setUserInput("")
      setMessage(text);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };
  function getAccessTokenFromUrl(url) {
    console.log(url)
    const params = new URLSearchParams(url.split('#')[1]); // Split URL to access query string after #
    console.log(params.get('access_token'))
    setAccessToken(params.get('access_token'));
  }
  const fetchData = async (prompt) => {
    console.log("fetching data")
    try {
      const url = "https://generativelanguage.googleapis.com/v1beta//tunedModels/edarachatbot2";
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'x-goog-user-project': "arctic-cursor-422617-e0",
        };

        const response = await axios.get(url, { headers });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      console.log(data)
      console.log(data.candidates.content.parts.text)
      return data.candidates.content.parts.text
    } catch (error) {
      console.log(error)
      return "something went wrong"
    }
  };
  const handleClick = async () => {
    try {
      // Replace with your actual client ID and redirect URI
      const clientId = '468949745626-6ie6hru117829vti5f59hpt8rl3tsveu.apps.googleusercontent.com';
      const redirectUri = 'https://kariimayman.github.io/EdaraTest';

      // Ensure client ID and redirect URI are valid
      if (!clientId || !redirectUri) {
        throw new Error('Missing client ID or redirect URI');
      }

      // Create the OAuth 2.0 authorization URL with secure parameters
      const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      url.searchParams.set('client_id', clientId);
      url.searchParams.set('redirect_uri', redirectUri);
      url.searchParams.set('response_type', 'token');
      url.searchParams.set('scope', 'https://www.googleapis.com/auth/generative-language.tuning'); // Adjust scope as needed
      url.searchParams.set('include_granted_scopes', 'true');
      url.searchParams.set('state', 'pass-through-value'); // Optional state parameter

      // Open the authorization URL in a new window
      window.open(url.toString(), '_blank');

      // **Handle redirect in your backend (cannot access token in frontend):**
      // Your server-side code should handle the redirect URI and extract the access token from the URL parameters.
      // You can't securely access the token in the frontend due to cross-origin restrictions.

    } catch (error) {
      console.error('OAuth sign-in error:', error);
      // Handle errors gracefully, e.g., display an error message to the user
    }
  };
  useEffect(() => {
    getAccessTokenFromUrl(window.location.href);
  }, []);
  return (
    <div class="chat-container bg-gradient-to-r from-indigo-500 to-purple-600  max-h-full rounded-xl shadow-md flex flex-col h-screen overflow-y-auto p-10">
      <h2 class="text-5xl text-white font-bold mb-4 text-center">Chat with EdaraBot</h2>
      {accessToken == null ? (<button onClick={handleClick}>Sign in with Google</button>) : (<><div className='pt-10'>
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
        </div></>)}

    </div>
  );
}

export default App;
