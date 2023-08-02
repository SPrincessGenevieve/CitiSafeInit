




import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, Image, ActivityIndicator, ScrollView, Animated } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import TextRecognition from 'react-native-text-recognition';
import LinearGradient from 'react-native-linear-gradient';

const DEFAULT_HEIGHT = 500;
const DEFAULT_WITH = 600;
const defaultPickerOptions = {
  cropping: true,
  height: DEFAULT_HEIGHT,
  width: DEFAULT_WITH,
};

function FirstPage({ navigation }) {

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
    <Image
      source={require('./../assets/images/BGPhoto.png')}
      style={{ position: 'absolute', height: '100%', opacity: 0.7 }}
    />
    <LinearGradient
      colors={['rgba(45, 82, 178, 0.3)', 'rgba(45, 82, 178, 1)']}
      style={{ height: '100%', width: '100%', position: 'absolute' }}

    />
    <View
      style={{
        width: '80%',
        height: '30%',
        position: 'absolute',
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '35%',
      }}
    >
      <Image
        style={{
          height: 260,
          width: 260,
        }}
        source={require('./../assets/images/logo.png')}
      />
    </View>
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        height: '20%',
        position: 'absolute',
        marginTop: '40%',
      }}
    >
      <Text
        style={{
          color: 'white',
          alignItems: 'center',
          fontSize: 51,
          justifyContent: 'center',
          marginTop: '20%'
        }}
      >
        CITISAFE
      </Text>
    </View>

    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        height: '40%',
        width: '80%',
        position: 'relative',
        marginTop: '90%',
      }}
    >
      {isVisible && (
        <>
          <Animated.Image
            style={{
              opacity: 0.2,
              opacity: fadeAnim, // Apply fade animation to the image
            }}
            source={require('./../assets/images/up.gif')}
          />
          <Animated.Text
            style={{
              fontSize: 30,
              opacity: 0.2,
              color: 'white',
              position: 'absolute',
              top: 0,
              bottom: 0,
              marginTop: '92%',
              opacity: fadeAnim, // Apply fade animation to the text
            }}
          >
            Swipe
          </Animated.Text>
        </>
      )}
    </View>
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
export default FirstPage;