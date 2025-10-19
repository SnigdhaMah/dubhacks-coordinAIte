import React, { useState } from "react";
import { FeatureType, Recommendation } from "../types/featureType";
import { ChatMessage } from "../types/chatType";
import Chat from "./Chat";

type SpecificFeatureProps = {
  feature: FeatureType | null;
  onSelectedRecommneded: (rec: Recommendation) => void;
  messages: ChatMessage[];
  onSendMessage: (message: ChatMessage) => void;
  onConfirm: () => void;
};

export default function SpecificFeature({
  feature,
  onSelectedRecommneded,
  messages,
  onSendMessage,
  onConfirm,
}: SpecificFeatureProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  if (!feature) {
    return <div className="specific-feature-empty">No feature selected</div>;
  }

  const handleRecommendationClick = (rec: Recommendation) => {
    const itemKey = rec.title;

    if (selectedItem === itemKey) {
      // Deselect if clicking the same item
      setSelectedItem(null);
    } else {
      // Select the new item (replacing any previous selection)
      setSelectedItem(itemKey);
    }
    onSelectedRecommneded(rec);
  };

  const isSelected = (rec: Recommendation) => {
    return selectedItem === rec.title;
  };

  // Check if recommendations are still loading (empty array means loading)
  const isLoading = feature.recommended.length === 0;

  return (
    <div className="specific-feature-container">
      <div className="specific-feature-content">
        <h1 className="feature-heading">{feature.featureTitle}</h1>

        {isLoading ? (
          // Loading State
          <div className="recommendations-loading">
            <div className="loading-animation">
              <div className="loading-spinner"></div>
              <div className="loading-dots">
                <span className="dot dot-1"></span>
                <span className="dot dot-2"></span>
                <span className="dot dot-3"></span>
              </div>
            </div>
            <h2 className="loading-title">Finding the best options for you...</h2>
            <p className="loading-subtitle">
              Our AI is searching for personalized recommendations based on your event details
            </p>
            <div className="loading-progress">
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
            </div>
          </div>
        ) : (
          // Loaded State with Recommendations
          <>
            <div className="recommendations-list">
              {feature.recommended.map((rec, index) => (
                <div
                  key={index}
                  className={`recommendation-card ${
                    isSelected(rec) ? "selected" : ""
                  }`}
                  onClick={() => handleRecommendationClick(rec)}
                >
                  <div className="recommendation-content">
                    <div className="recommendation-main">
                      <h3 className="recommendation-title">{rec.title}</h3>
                      {rec.description && (
                        <p className="recommendation-description">
                          {rec.description}
                        </p>
                      )}
                      {rec.justification && (
                        <p className="recommendation-justification">
                          <strong>Why recommended:</strong> {rec.justification}
                        </p>
                      )}
                    </div>

                    <div className="recommendation-details">
                      {rec.price && (
                        <div className="detail-item">
                          <span className="detail-label">Price:</span>
                          <span className="detail-value">
                            {typeof rec.price === "number"
                              ? `$${rec.price}`
                              : rec.price}
                          </span>
                        </div>
                      )}

                      {rec.date && (
                        <div className="detail-item">
                          <span className="detail-label">Date:</span>
                          <span className="detail-value">
                            {new Date(rec.date).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {rec.contactInfo && (
                        <div className="detail-item contact-info">
                          {rec.contactInfo.name && (
                            <span>{rec.contactInfo.name}</span>
                          )}
                          {rec.contactInfo.phone && (
                            <span>{rec.contactInfo.phone}</span>
                          )}
                          {rec.contactInfo.email && (
                            <span>{rec.contactInfo.email}</span>
                          )}
                          {rec.contactInfo.website && (
                            <a
                              href={rec.contactInfo.website}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Visit Website
                            </a>
                          )}
                        </div>
                      )}

                      {rec.bookingLink && (
                        <a
                          href={rec.bookingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="booking-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Book Now
                        </a>
                      )}
                    </div>

                    {rec.images && rec.images.length > 0 && (
                      <div className="recommendation-images">
                        {rec.images.map((img, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={img}
                            alt={`${rec.title} ${imgIndex + 1}`}
                            className="recommendation-image"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button className="confirm-button" onClick={onConfirm}>
              Confirm Selection
            </button>
          </>
        )}
      </div>

      <div className="chat-section">
        <Chat messages={messages} onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}
