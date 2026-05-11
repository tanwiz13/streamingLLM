import React from 'react';

import { ChatBubble } from './ChatBubble';

type Props = {
  text: string;
  cursor: string;
};

export function StreamingText({ text, cursor }: Props) {
  return <ChatBubble text={`${text}${cursor}`} />;
}