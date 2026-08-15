import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

export default function PairTester() {
  const [host, setHost] = useState('http://127.0.0.1:8787');
  const [expires, setExpires] = useState('24');
  const [lastResult, setLastResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const webviewRef = useRef(null);
  const [payload, setPayload] = useState(null);

  function onWebViewMessage(event) {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      setLoading(false);
      if (msg.error) {
        Alert.alert('Error', msg.error);
        return;
      }
      if (!msg.ok) {
        Alert.alert('Error', msg.data?.error || `Status ${msg.status}`);
        return;
      }
      setLastResult(msg.data);
      Alert.alert('Pair created', JSON.stringify(msg.data));
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', 'Unexpected response from WebView');
    }
  }

  function createPair() {
    setLoading(true);
    // trigger hidden WebView to perform POST using its cookies
    setPayload({ host: host.replace(/\/+$/,''), expires: Number(expires) || 24 });
  }

  const hiddenHtml = payload ? `<!doctype html><html><body><script>
  (async function(){
    try{
      const host = ${JSON.stringify(payload ? payload.host : '')};
      const body = { expiresHours: ${payload ? payload.expires : 24} };
      const resp = await fetch(host + '/api/local/pair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      let data = null;
      try { data = await resp.json(); } catch(e) { data = null; }
      window.ReactNativeWebView.postMessage(JSON.stringify({ ok: resp.ok, status: resp.status, data }));
    } catch(e) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ error: e.message }));
    }
  })();
  </script></body></html>` : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>SavelyCLOUD host</Text>
      <TextInput style={styles.input} value={host} onChangeText={setHost} autoCapitalize="none" />
      <Text style={styles.label}>Expires (hours)</Text>
      <TextInput style={styles.input} value={expires} onChangeText={setExpires} keyboardType="numeric" />
      <View style={{ marginTop: 12 }}>{loading ? <ActivityIndicator /> : null}</View>
      <Button title="Create pairing link (requires login in WebView)" onPress={createPair} />
      {lastResult && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>Last result</Text>
          <Text>Token: {lastResult.token}</Text>
          <Text>Upload URL: {lastResult.uploadUrl}</Text>
        </View>
      )}

      {payload && hiddenHtml ? (
        <WebView
          ref={webviewRef}
          originWhitelist={["*"]}
          source={{ html: hiddenHtml }}
          onMessage={onWebViewMessage}
          style={{ height: 0, width: 0 }}
        />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { marginTop: 12, marginBottom: 6, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10 },
  result: { marginTop: 16, padding: 12, backgroundColor: '#f6f6f6', borderRadius: 6 },
  resultTitle: { fontWeight: '700', marginBottom: 6 },
});
