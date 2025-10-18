import React from 'react';
import { FeatureType, Recommendation } from '../types/featureType';
import { ChatMessage } from '../types/chatType';
import Chat from "./Chat";

type SpecificFeatureProps = {
  feature: FeatureType | null;
  onSelectedRecommneded: (rec: Recommendation) => void;
  // for chatbot
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
  console.log(
    "SpecificFeature component rendered with props:",
    feature,
    onSelectedRecommneded,
    messages,
    onSendMessage
  );
  return (
    <div>
      Specific Feature Component
      <Chat messages={messages} onSendMessage={onSendMessage} />
    </div>
  );
}
