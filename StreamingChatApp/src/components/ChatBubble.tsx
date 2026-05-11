import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  text: string;
};

export function ChatBubble({ text }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 18,
    alignSelf: 'flex-start',
    maxWidth: '95%',
  },
  text: {
    color: '#F5F5F5',
    fontSize: 17,
    lineHeight: 28,
  },
});