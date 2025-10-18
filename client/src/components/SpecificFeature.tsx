import React from 'react';
import { FeatureType, Recommendation } from '../types/featureType';
import { ChatMessage } from '../types/chatType';

type SpecificFeatureProps = {
  feature: string | null;
  featureIndex: FeatureType[];
  onSelectedRecommneded: (rec: Recommendation) => void;
  // for chatbot
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

export default function SpecificFeature({ feature, featureIndex, onClickFeature , messages, onSendMessage }: SpecificFeatureProps) {
  return (
    <div>
      Specific Feature Component
      <Chat messages={messages} onSendMessage={onSendMessage} />
    </div>
  )
}
