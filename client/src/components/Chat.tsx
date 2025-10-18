import React from 'react';
import { ChatMessage } from '../types/chatType';

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

export default function Chat({ messages, onSendMessage }: ChatProps) {
  return (
    <div>
      Chat Component
    </div>
  )
}
