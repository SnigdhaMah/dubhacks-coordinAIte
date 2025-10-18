import React from 'react';
import { ChatMessage } from '../types/chatType';

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: ChatMessage) => void;
}

export default function Chat({ messages, onSendMessage }: ChatProps) {
  console.log(
    "Chat component rendered with messages:",
    messages,
    onSendMessage
  );
  return <div>Chat Component</div>;
}
