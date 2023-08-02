import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, Image, ActivityIndicator, ScrollView, Animated } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import TextRecognition from 'react-native-text-recognition';
import LinearGradient from 'react-native-linear-gradient';
import FirstPage from './FirstPage';
import SecondPage from './SecondPage';
import HomePage from './HomePage';

const DEFAULT_HEIGHT = 500;
const DEFAULT_WITH = 600;
const defaultPickerOptions = {
  cropping: true,
  height: DEFAULT_HEIGHT,
  width: DEFAULT_WITH,
};

function Home({ navigation }) {

  const [isVisible, setIsVisible] = useState(true);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false);
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [fadeAnim]);


 

  return (
    <View style={styles.container}>
      <HomePage></HomePage>
    </View>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
text: {
  fontSize: 24,
  fontWeight: 'bold',
},
});
export default Home;