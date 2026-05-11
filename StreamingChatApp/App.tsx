// // /**
// //  * Sample React Native App
// //  * https://github.com/facebook/react-native
// //  *
// //  * @format
// //  */

// // import { NewAppScreen } from '@react-native/new-app-screen';
// // import { StatusBar, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
// // import {
// //   SafeAreaProvider,
// //   useSafeAreaInsets,
// // } from 'react-native-safe-area-context';

// // import { streamLLM } from "./src/streamLLM";
// // import { useRef } from 'react';

// // function App() {
// //   const isDarkMode = useColorScheme() === 'dark';

// //   const controllerRef = useRef<AbortController | null>(null);

// //   const stopRef = useRef<() => void>(null);

// //   const startStreaming = () => {
// //     stopRef.current?.();

// //     stopRef.current = streamLLM({
// //       prompt: "Hello streaming test",
// //       onToken: (token) => {
// //         console.log("TOKEN:", token);
// //       },
// //       onDone: () => {
// //         console.log("DONE");
// //       },
// //     });
// //   };

// //   const stopStreaming = () => {
// //     stopRef.current?.();
// //   };

// //   // const startStreaming = async () => {
// //   //   controllerRef.current?.abort();

// //   //   const controller = new AbortController();
// //   //   controllerRef.current = controller;

// //   //   try {
// //   //     await streamLLM({
// //   //       prompt: "Say hello in a long way",
// //   //       signal: controller.signal,
// //   //       onToken: (token) => {
// //   //         console.log("TOKEN:", token);
// //   //       },
// //   //     });
// //   //   } catch (e) {
// //   //     console.log("Stream stopped", e);
// //   //   }
// //   // };

// //   return (
// //     <SafeAreaProvider>
// //       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
// //       <TouchableOpacity onPress={startStreaming}>
// //         <Text style={{alignSelf: 'center', marginTop: 200}}>Stream</Text>
// //       </TouchableOpacity>
// //     </SafeAreaProvider>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// // });

// // export default App;


// import React, { useEffect, useRef, useState } from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   ScrollView,
//   TextInput,
//   NativeScrollEvent,
//   NativeSyntheticEvent,
// } from 'react-native';

// import { streamLLM } from './src/services/streamLLM';

// function useSmoothStream() {
//   const [text, setText] = useState('');
//   const queueRef = useRef<string[]>([]);
//   const frameRef = useRef<number>(0);

//   useEffect(() => {
//     const flush = () => {
//       if (queueRef.current.length > 0) {
//         // small chunks = smooth feel
//         const chunk = queueRef.current.splice(0, 2).join('');

//         setText(prev => prev + chunk);
//       }

//       frameRef.current = requestAnimationFrame(flush);
//     };

//     frameRef.current = requestAnimationFrame(flush);

//     return () => {
//       cancelAnimationFrame(frameRef.current);
//     };
//   }, []);

//   const pushToken = (token: string) => {
//     queueRef.current.push(token);
//   };

//   const reset = () => {
//     queueRef.current = [];
//     setText('');
//   };

//   return {
//     text,
//     pushToken,
//     reset,
//   };
// }

// function useBlinkCursor(active: boolean) {
//   const [visible, setVisible] = useState(true);

//   useEffect(() => {
//     if (!active) return;

//     const id = setInterval(() => {
//       setVisible(v => !v);
//     }, 500);

//     return () => clearInterval(id);
//   }, [active]);

//   return active && visible ? '▍' : '';
// }

// export default function App() {
//   const scrollRef = useRef<ScrollView>(null);

//   const stopRef = useRef<() => void>(undefined);

//   const streamIdRef = useRef(0);

//   const isStreamingRef = useRef(false);

//   const [isStreaming, setIsStreaming] = useState(false);

//   const [input, setInput] = useState(
//     'Explain why streaming feels magical in chat apps'
//   );

//   const [userNearBottom, setUserNearBottom] = useState(true);

//   const { text, pushToken, reset } = useSmoothStream();

//   const cursor = useBlinkCursor(isStreaming);

//   const scrollToBottom = () => {
//     requestAnimationFrame(() => {
//       scrollRef.current?.scrollToEnd({ animated: true });
//     });
//   };

//   useEffect(() => {
//     if (userNearBottom) {
//       scrollToBottom();
//     }
//   }, [text, userNearBottom]);

//   const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
//     const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;

//     const padding = 60;

//     const isNearBottom =
//       layoutMeasurement.height + contentOffset.y >=
//       contentSize.height - padding;

//     setUserNearBottom(isNearBottom);
//   };

//   const startStreaming = () => {
//     if (!input.trim()) return;

//     // stop old stream
//     stopRef.current?.();

//     // increment stream session id
//     const streamId = ++streamIdRef.current;

//     reset();

//     isStreamingRef.current = true;
//     setIsStreaming(true);

//     stopRef.current = streamLLM({
//       prompt: input,

//       onToken: token => {
//         // ignore stale stream updates
//         if (streamId !== streamIdRef.current) return;

//         pushToken(token);
//       },

//       onDone: () => {
//         if (streamId !== streamIdRef.current) return;

//         isStreamingRef.current = false;
//         setIsStreaming(false);
//       },
//     });
//   };

//   const stopStreaming = () => {
//     stopRef.current?.();

//     isStreamingRef.current = false;
//     setIsStreaming(false);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Streaming Chat</Text>

//         <View
//           style={[
//             styles.statusDot,
//             {
//               backgroundColor: isStreaming ? '#3BFF7C' : '#666',
//             },
//           ]}
//         />
//       </View>

//       {/* Chat */}
//       <ScrollView
//         ref={scrollRef}
//         style={styles.chatContainer}
//         contentContainerStyle={styles.chatContent}
//         onScroll={onScroll}
//         scrollEventThrottle={16}
//       >
//         <View style={styles.aiBubble}>
//           <Text style={styles.aiText}>
//             {text}
//             {cursor}
//           </Text>
//         </View>
//       </ScrollView>

//       {/* Input */}
//       <View style={styles.bottomContainer}>
//         <TextInput
//           value={input}
//           onChangeText={setInput}
//           multiline
//           placeholder="Ask something..."
//           placeholderTextColor="#777"
//           style={styles.input}
//         />

//         <View style={styles.buttonRow}>
//           <TouchableOpacity
//             style={[styles.button, styles.startButton]}
//             onPress={startStreaming}
//             activeOpacity={0.8}
//           >
//             <Text style={styles.buttonText}>Start</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.button, styles.stopButton]}
//             onPress={stopStreaming}
//             activeOpacity={0.8}
//           >
//             <Text style={styles.buttonText}>Stop</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0D0D0D',
//   },

//   header: {
//     height: 60,
//     borderBottomWidth: 1,
//     borderBottomColor: '#1E1E1E',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//   },

//   headerTitle: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: '600',
//   },

//   statusDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 999,
//   },

//   chatContainer: {
//     flex: 1,
//   },

//   chatContent: {
//     padding: 16,
//     paddingBottom: 40,
//   },

//   aiBubble: {
//     backgroundColor: '#1A1A1A',
//     padding: 16,
//     borderRadius: 18,
//     alignSelf: 'flex-start',
//     maxWidth: '95%',
//   },

//   aiText: {
//     color: '#F5F5F5',
//     fontSize: 17,
//     lineHeight: 28,
//   },

//   bottomContainer: {
//     borderTopWidth: 1,
//     borderTopColor: '#1E1E1E',
//     padding: 14,
//     backgroundColor: '#0D0D0D',
//   },

//   input: {
//     minHeight: 52,
//     maxHeight: 120,
//     backgroundColor: '#171717',
//     borderRadius: 14,
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     color: 'white',
//     fontSize: 16,
//   },

//   buttonRow: {
//     flexDirection: 'row',
//     marginTop: 12,
//     gap: 10,
//   },

//   button: {
//     flex: 1,
//     height: 48,
//     borderRadius: 14,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   startButton: {
//     backgroundColor: '#2563EB',
//   },

//   stopButton: {
//     backgroundColor: '#DC2626',
//   },

//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

import React from 'react';

import { ChatScreen } from './src/screens/ChatScreen';

export default function App() {
  return <ChatScreen />;
}