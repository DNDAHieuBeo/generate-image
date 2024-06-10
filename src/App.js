import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);

  const handleInputChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleButtonClick = async () => {
    try {
      const response = await axios.post('https://c8c7-116-110-75-50.ngrok-free.app/sdapi/v1/txt2img', {
        prompt: prompt,
        negative_prompt: "",
        styles: ["realistic photo"],
        seed: -1,
        steps: 20,
        width: 512,
        height: 512
      });
      const base64Image = response.data.images[0];
      setImage(base64Image);
      console.log(response)
    } catch (error) {
      console.error("Error fetching the image:", error);
    }
  };

  return (
    <div className="App">
      <h1>Image Generator</h1>
      <input
        type="text"
        value={prompt}
        onChange={handleInputChange}
        placeholder="Enter your prompt"
        className="input"
      />
      <button onClick={handleButtonClick} className="button">Generate Image</button>
      {image && <img src={`data:image/png;base64,${image}`} alt="Generated" className="image" />}
    </div>
  );
}

export default App;
