import React, { useRef } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { WebView } from 'react-native-webview';

export default function AuthWebView({ navigation }) {
  const webRef = useRef(null);

  return (
    <View style={styles.container}>
      <WebView
        ref={webRef}
        source={{ uri: 'http://127.0.0.1:8787/' }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
      />
      <View style={styles.footer}>
        <Button title="Open Pairing Tester" onPress={() => navigation.navigate('PairTester')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
  footer: { padding: 10 },
});
