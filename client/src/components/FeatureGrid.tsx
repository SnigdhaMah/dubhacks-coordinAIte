import React from 'react';
import { FeatureType } from '../types/featureType';


interface FeatureGridProps {
  featureIndex: FeatureType[];
  onClickFeature: (feature: FeatureType) => void;
}

export default function FeatureGrid({
  featureIndex,
  onClickFeature,
}: FeatureGridProps) {

  console.log("FeatureGrid props:", { featureIndex, onClickFeature });

  return (
    <div className="feature-grid-container">
      <h1 className="features-heading">Features</h1>
      <div className="feature-grid">
        {featureIndex.map((feature) => (
        <div
          key={feature.uid}
          className="feature-card"
          onClick={() => onClickFeature(feature)}
        >
          {feature.selected && <button className="remove-button">×</button>}
          
          <div className="feature-image-section">
            {feature.selected?.images && feature.selected.images.length > 0 ? (
              <img
                src={feature.selected.images[0]}
                alt={feature.featureTitle}
                className="feature-image"
              />
            ) : (
              <div className="feature-image-placeholder"></div>
            )}
          </div>
          
          <div className="feature-title-section">
            <h3 className="feature-title">{feature.featureTitle}</h3>
          </div>
          
          <div className="feature-action-section">
            <p className="action-text">click here to choose a selection</p>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}


