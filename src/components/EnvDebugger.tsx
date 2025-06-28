import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Config from 'react-native-config';

const EnvDebugger = () => {
  const [envVars, setEnvVars] = useState<Record<string, string>>({});

  useEffect(() => {
    // Get all environment variables
    const vars: Record<string, string> = {};
    Object.keys(Config).forEach(key => {
      vars[key] = Config[key] || 'undefined';
    });
    setEnvVars(vars);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Environment Variables Debugger</Text>
      <ScrollView style={styles.scrollView}>
        {Object.entries(envVars).map(([key, value]) => (
          <View key={key} style={styles.row}>
            <Text style={styles.key}>{key}:</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  key: {
    fontWeight: 'bold',
    width: '40%',
  },
  value: {
    width: '60%',
  },
});

export default EnvDebugger; 