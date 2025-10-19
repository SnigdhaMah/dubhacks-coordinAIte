import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { generateImage } from '../utils/apis'; API call for generate image stubbed cuz of paywall
import { FeatureType } from '../types/featureType';

interface GeneratedImagePageProps {
  featureIndex: FeatureType[];
}


export const generateImage = async (): Promise<string> => {
  // STUB: Return a placeholder image instead of calling the API
  // Remove this when you're ready to use the real Gemini API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Your custom stub image
      resolve('https://i.programmerhumor.io/2024/04/programmerhumor-io-python-memes-programming-memes-4a152803067626f.png');
    }, 2000); // Simulate 2 second loading time
  });
}

export default function GeneratedImagePage({ featureIndex }: GeneratedImagePageProps) {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = await generateImage();
        setImageUrl(url);
      } catch (err) {
        console.error('Error generating image:', err);
        setError('Failed to generate image. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [featureIndex]);

  const handleBackToMain = () => {
    navigate('/main');
  };

  return (
    <div className="generated-image-page">
      <div className="image-page-header">
        <button onClick={handleBackToMain} className="back-button">
          ← Back to Event Planning
        </button>
        <h1>Your Event Preview</h1>
      </div>

      <div className="image-content">
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Generating your event preview image...</p>
            <p className="loading-subtext">This may take a few moments</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={() => window.location.reload()} className="retry-button">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && imageUrl && (
          <div className="image-display">
            <img src={imageUrl} alt="Generated event preview" className="generated-image" />
            <div className="image-actions">
              <button onClick={() => {
                const link = document.createElement('a');
                link.href = imageUrl;
                link.download = 'event-preview.png';
                link.click();
              }} className="download-button">
                Download Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
