import React, { useEffect, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { Header } from '../components/Header';
import { ChatInput } from '../components/ChatInput';
import { StreamingText } from '../components/StreamingText';
import { useBlinkCursor } from '../hooks/useBlinkCursor';
import { useSmoothStream } from '../hooks/useSmoothStream';
import { streamLLM } from '../services/streamLLM';

export function ChatScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const stopRef = useRef<() => void>(undefined);
  const streamIdRef = useRef(0);
  const [input, setInput] = useState(
    'Explain why streaming feels magical in chat apps'
  );
  const [networkStreaming, setNetworkStreaming] = useState(false);
  const [userNearBottom, setUserNearBottom] = useState(true);
  const { text, pushToken, reset, stop, isRendering } = useSmoothStream();

  const isStreaming = networkStreaming || isRendering;
  const cursor = useBlinkCursor(isStreaming);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  };

  useEffect(() => {
    if (userNearBottom) {
      scrollToBottom();
    }
  }, [text, userNearBottom]);

  const onScroll = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const { layoutMeasurement, contentOffset, contentSize } =
      e.nativeEvent;
    const padding = 60;
    const nearBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - padding;
    setUserNearBottom(nearBottom);
  };

  const startStreaming = () => {
    const prompt = input.trim();
    if (!prompt) return;
    stopRef.current?.();
    // reset smoother state
    reset();
    setInput('');
    const streamId = ++streamIdRef.current;
    setNetworkStreaming(true);
    stopRef.current = streamLLM({
      prompt: input,
      onToken: token => {
        if (streamId !== streamIdRef.current) return;
        pushToken(token);
      },
      onDone: () => {
        if (streamId !== streamIdRef.current) return;
        setNetworkStreaming(false);
      },
    });
  };

  const stopStreaming = () => {
    stopRef.current?.();
    stop();
    setNetworkStreaming(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header isStreaming={isStreaming} />
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <StreamingText text={text} cursor={cursor} />
      </ScrollView>
      <ChatInput
        value={input}
        onChange={setInput}
        onStart={startStreaming}
        onStop={stopStreaming}
        isStreaming={isStreaming}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
});