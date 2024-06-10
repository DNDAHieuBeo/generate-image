import React, { useState } from 'react';
import axios from 'axios'; // Assuming you're using an API
import ProgressBar from './Progessbar';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [progress, setProgress] = useState(0); // Track progress percentage
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateImage = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setProgress(0);

    try {
      // Replace with your image generation API call and handle response
      const response = await axios.post('http://127.0.0.1:7860', { prompt });
      const taskId = response.data.id; // Assuming the API returns a task ID

      // Start progress tracking
      await requestProgress(taskId);

      setImageUrl(response.data.imageUrl); // Update image URL (if available)
    } catch (error) {
      console.error(error); // Handle errors
    } finally {
      setIsLoading(false);
    }
  };

  // Function to call the provided `requestProgress`
  const requestProgress = async (taskId) => {
    try {
      let completed = false;

      while (!completed) {
        const progressResponse = await axios.get(`http://127.0.0.1:7860/progress/${taskId}`);
        const { progress, status } = progressResponse.data;

        setProgress(progress * 100); // Update progress percentage

        if (status === 'completed') {
          completed = true;
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before the next check
        }
      }
    } catch (error) {
      console.error('Error while tracking progress:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleGenerateImage}>
        <label htmlFor="prompt">Enter prompt:</label>
        <input
          type="text"
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Image'}
        </button>
      </form>
      {imageUrl && <img src={imageUrl} alt="Generated Image" />}
      {isLoading && <ProgressBar progress={progress} />} {/* Assuming ProgressBar component */}
    </div>
  );
};

export default ImageGenerator;
