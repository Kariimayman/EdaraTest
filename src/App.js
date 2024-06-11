import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios'; // Assuming you're using Axios for HTTP requests
function App() {
  const [Edaramessage, setEdaramessage] = useState("مرحباً، يسعدني مساعدتك اليوم. كيف يمكنني مساعدتك؟");
  const [Geminimessage, setGeminimessage] = useState("");

  const [userInput, setUserInput] = useState('');
  const [accessToken, setAccessToken] = useState('');

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };
  const formatText = (text) => {
    return text
      .replace(/\n/g, '<br>')          // Replace newline characters with <br>
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // Replace **bold** with <b>bold</b>
  }
  

  async function sendMessage() {
    if (userInput.trim() !== '') {
      setEdaramessage("Loading....");
      setGeminimessage("Loading....");
      var text1 = await fetchEdaraData(userInput)
      var text2 = await fetchGeminiData(userInput)
      console.log(text1)
      console.log(text2)
      const formattedText1 = formatText(text1);
      const formattedText2 = formatText(text2);
      setEdaramessage(formattedText1);
      setGeminimessage(formattedText2)
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
  const fetchEdaraData = async (prompt) => {
    console.log("fetching data for " + prompt)
    try {
      const url = 'https://generativelanguage.googleapis.com/v1beta/tunedModels/edarachatbot2:generateContent';
      const headers = {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-goog-user-project': "edarachatbot",
      };
      const data = {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ],
            role: "user"
          }
        ]
      };
      const response = await axios.post(url, data, { headers });
      console.log(response)
      const generatedText = response.data.candidates[0].content.parts[0].text;
      return generatedText;
    } catch (error) {
      console.log(error)
      return "something went wrong"
    }
  };
  const fetchGeminiData = async (prompt) => {
    console.log("fetching data for " + prompt)
    try {
      const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
      const headers = {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-goog-user-project': "edarachatbot",
      };
      const data = {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ],
            role: "user"
          }
        ]
      };
      const response = await axios.post(url, data, { headers });
      console.log(response)
      const generatedText = response.data.candidates[0].content.parts[0].text;
      return generatedText;
    } catch (error) {
      console.log(error)
      return "something went wrong"
    }
  };
  const handleLogout = async () => {
    setAccessToken(null)
    window.location.href = "https://kariimayman.github.io/EdaraTest/"
  }
  const handleClick = async () => {
    try {
      // Replace with your actual client ID and redirect URI
      const clientId = '290807565570-okgo5imjblcesi2vkcqbt13mlv44m87e.apps.googleusercontent.com';
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
      window.location.href = url.toString();

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
      {accessToken == null ? (
        <div className='pt-20 flex items-center justify-center'>
          <button className='message-bubble rounded-lg bg-indigo-800 hover:bg-white hover:text-indigo-800 px-4 py-4 text-white shadow-md text-center text-2xl' onClick={handleClick}>Sign in with Google</button>
        </div>
      ) :
        (<>

          <div className='pt-10'>
          <h1 className='px-4 py-4 text-white shadow-md text-center text-4xl'>EdaraBot</h1>

            <div class="message-bubble rounded-lg bg-indigo-800 px-4 py-4 text-white shadow-md text-center text-2xl">
            <div className="message-bubble rounded-lg bg-indigo-800 px-4 py-4 text-white shadow-md text-center text-2xl" dangerouslySetInnerHTML={{ __html: Edaramessage }}></div>            </div>

          </div>
          <div className='pt-10'>
          <h1 className=' px-4 py-4 text-white shadow-md text-center text-4xl'>Gemini Pro</h1>
            <div class="message-bubble rounded-lg bg-indigo-800 px-4 py-4 text-white shadow-md text-center text-2xl">
              {Geminimessage}
            </div>
          </div>
          <div className='pt-20 flex items-center justify-center'>  
            <button className='message-bubble rounded-lg bg-red-500 hover:bg-white hover:text-red-500 px-4 py-4 text-white shadow-md text-center text-2xl' onClick={handleLogout}>Logout in case of an error</button>
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
