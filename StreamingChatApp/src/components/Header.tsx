import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  isStreaming: boolean;
};

export function Header({ isStreaming }: Props) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Streaming Chat</Text>
      <View
        style={[
          styles.dot,
          {
            backgroundColor: isStreaming ? '#3BFF7C' : '#666',
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
});