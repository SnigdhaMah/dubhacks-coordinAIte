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

export const testSpecificFeatureData: FeatureType = {
  uid: "1",
  featureTitle: "Wedding Cake",
  selected: null,
  recommended: [
    {
      title: "Sweet Dreams Bakery",
      description:
        "Custom 3-tier vanilla and chocolate cake with fresh flowers",
      price: 450,
      contactInfo: {
        name: "Maria Johnson",
        phone: "(555) 123-4567",
        email: "info@sweetdreamsbakery.com",
      },
      justification:
        "Highly rated for wedding cakes, specializes in elegant designs",
    },
    {
      title: "The Cake Studio",
      description: "Modern minimalist design with buttercream frosting",
      price: "$350-500",
      bookingLink: "https://example.com/booking",
      contactInfo: {
        website: "https://thecakestudio.com",
      },
      justification: "Best pricing in your area with excellent reviews",
    },
    {
      title: "Artisan Confections",
      description: "Rustic naked cake with seasonal berries",
      price: 380,
      date: "2025-11-15",
      contactInfo: {
        name: "Chef Robert",
        phone: "(555) 987-6543",
      },
      justification:
        "Specialty in natural, organic ingredients perfect for outdoor weddings",
    },
  ],
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

  return (
    <div className="specific-feature-container">
      <div className="specific-feature-content">
        <h1 className="feature-heading">{feature.featureTitle}</h1>

        <div className="recommendations-list">
          {false ? (
            <p className="no-recommendations">No recommendations available</p>
          ) : (
            feature.recommended.map((rec, index) => (
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
            ))
          )}
        </div>

        <button className="confirm-button" onClick={onConfirm}>
          Confirm Selection
        </button>
      </div>

      <div className="chat-section">
        <Chat messages={messages} onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}
