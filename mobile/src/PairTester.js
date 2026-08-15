import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';

export default function PairTester() {
  const [host, setHost] = useState('http://127.0.0.1:8787');
  const [expires, setExpires] = useState('24');
  const [lastResult, setLastResult] = useState(null);

  async function createPair() {
    try {
      const resp = await axios.post(`${host}/api/local/pair`, { expiresHours: Number(expires) }, { withCredentials: true });
      setLastResult(resp.data);
      Alert.alert('Pair created', JSON.stringify(resp.data));
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.error || err.message);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>SavelyCLOUD host</Text>
      <TextInput style={styles.input} value={host} onChangeText={setHost} autoCapitalize="none" />
      <Text style={styles.label}>Expires (hours)</Text>
      <TextInput style={styles.input} value={expires} onChangeText={setExpires} keyboardType="numeric" />
      <Button title="Create pairing link (requires login in WebView)" onPress={createPair} />
      {lastResult && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>Last result</Text>
          <Text>Token: {lastResult.token}</Text>
          <Text>Upload URL: {lastResult.uploadUrl}</Text>
        </View>
      )}
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
