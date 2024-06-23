import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [loras, setLoras] = useState([]);
  const [selectedLora, setSelectedLora] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLoras = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:7861/sdapi/v1/loras"
        );
        setLoras(response.data);
      } catch (error) {
        console.error("Failed to fetch LORAs:", error);
        setError("Failed to fetch data. Please try again.");
      }
    };
    fetchLoras();
  }, []);

  const handleDropdownChange = (e) => {
    setSelectedLora(e.target.value);
  };

  const handleButtonClick = async () => {
    if (!selectedLora) {
      setError("Please select a hero before generating an image.");
      return;
    }

    setLoading(true);
    setError("");

    const loraHero = loras.find((lora) => lora.name === selectedLora);
    const prompt = `${selectedLora} <lora:${loraHero.alias}:1>`;

    try {
      const response = await axios.post(
        "http://127.0.0.1:7861/sdapi/v1/txt2img",
        {
          prompt: prompt,
          styles: ["realistic photo"],
          seed: -1,
          steps: 20,
          width: 512,
          height: 512,
        }
      );
      const base64Image = response.data.images[0];
      setImage(base64Image);
    } catch (error) {
      console.error("Error fetching the image:", error);
      setError("Failed to fetch image. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <div className="leftPanel">
        <h1>Image Generator</h1>
        <p className="description">
          Explore historical brilliance with our Image Generator! Select a
          historical hero from the dropdown menu, and let our AI craft a
          visually stunning image.
        </p>
        <select
          value={selectedLora}
          onChange={handleDropdownChange}
          className="dropdown"
        >
          {selectedLora === "" && (
            <option value=""></option>
          )}
          {loras.map((lora) => (
            <option key={lora.name} value={lora.name}>
              {lora.name.replace(/_/g, " ")}
            </option>
          ))}
        </select>

        {loading ? (
          <div className="spinner"></div>
        ) : (
          <button onClick={handleButtonClick} className="button">
            Generate Image
          </button>
        )}
        {error && <p className="error">{error}</p>}
      </div>
      <div className="rightPanel">
        {image && (
          <div className="imageContainer">
            <img
              src={`data:image/png;base64,${image}`}
              alt="Generated"
              className="image"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
