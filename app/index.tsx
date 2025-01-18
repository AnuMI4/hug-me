import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';

const StartPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer); // Cleanup the timer when component unmounts
  }, []);

  useEffect(() => {
    if (!isLoading) {
      router.push('/welcome');
    }
  }, [isLoading, router]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return null; // Will not render anything as we are navigating away
};

const SplashScreen = () => (
  <View style={styles.container}>
    <Image
      source={require('../assets/logo.png')} // Your logo image
      style={styles.logoImage}
      resizeMode="contain"
    />
    <ActivityIndicator size="large" color="#7912b0" style={styles.spinner} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoImage: {
    width: 200, // Adjust based on your image dimensions
    height: 200,
    marginBottom: 20,
  },
  spinner: {
    marginTop: 20,
  },
});

export default StartPage;
