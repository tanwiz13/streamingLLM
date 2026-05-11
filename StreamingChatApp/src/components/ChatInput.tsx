import React from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onStart: () => void;
  onStop: () => void;
  isStreaming: boolean;
};

export function ChatInput({
  value,
  onChange,
  onStart,
  onStop,
  isStreaming,
}: Props) {
  const isInputEmpty = !value.trim();

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChange}
        multiline
        editable={!isStreaming}
        placeholder="Ask something..."
        placeholderTextColor="#777"
        style={[
          styles.input,
          isStreaming && styles.inputDisabled,
        ]}
      />
      <View style={styles.row}>
        <TouchableOpacity
          disabled={isStreaming || isInputEmpty}
          style={[
            styles.button,
            styles.start,
            (isStreaming || isInputEmpty) &&
              styles.buttonDisabled,
          ]}
          onPress={onStart}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!isStreaming}
          style={[
            styles.button,
            styles.stop,
            !isStreaming && styles.buttonDisabled,
          ]}
          onPress={onStop}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#1E1E1E',
    padding: 14,
    backgroundColor: '#0D0D0D',
  },
  input: {
    minHeight: 52,
    maxHeight: 120,
    backgroundColor: '#171717',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: 'white',
    fontSize: 16,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  row: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  start: {
    backgroundColor: '#2563EB',
  },
  stop: {
    backgroundColor: '#DC2626',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});