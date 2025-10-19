import React from 'react';
import { FeatureType } from '../types/featureType';


interface FeatureGridProps {
  featureIndex: FeatureType[];
  onClickFeature: (feature: FeatureType) => void;
}

export const testFeatureData: FeatureType[] = [
  {
    uid: "1",
    featureTitle: "User Authentication",
    selected: { title: "test" },
    recommended: [],
  },
];

export default function FeatureGrid({
  featureIndex,
  onClickFeature,
}: FeatureGridProps) {
  console.log("FeatureGrid props:", { featureIndex, onClickFeature });

  return (
    <div className="feature-grid-container">
      <div className="feature-grid">
        {testFeatureData.map((feature) => (
          <div
            key={feature.uid}
            onClick={() => onClickFeature(feature)}
            className="feature-card"
          >
            <h3 className="feature-title">{feature.featureTitle}</h3>

            <div className="feature-info">
              {feature.selected ? (
                <div className="status-wrapper">
                  <span className="status-badge selected">Selected</span>
                </div>
              ) : (
                <div className="status-wrapper">
                  <span className="status-badge unselected">No selection</span>
                </div>
              )}

              {feature.recommended.length > 0 && (
                <div className="recommendation-count">
                  {feature.recommended.length} recommendation
                  {feature.recommended.length !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


