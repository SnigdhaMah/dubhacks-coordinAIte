import React from 'react';
import { FeatureType } from '../types/featureType';

interface FeatureGridProps {
  featureIndex: FeatureType[];
  onClickFeature: (feature: FeatureType) => void;
}

export default function FeatureGrid({ featureIndex, onClickFeature }: FeatureGridProps) {
  console.log("FeatureGrid props:", { featureIndex, onClickFeature });
  return (
    <div>
      Feature Grid Component
    </div>
  )
}
