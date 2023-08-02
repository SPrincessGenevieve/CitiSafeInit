import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView, PanGestureHandler, ScrollView } from 'react-native-gesture-handler';
import { View, StyleSheet, Dimensions } from 'react-native';
import React, { useRef, useState } from 'react';
import HomeStack from './src/stack/home'
import FirstPage from './src/pages/FirstPage';
import SecondPage from './src/pages/SecondPage';
import HomePage from './src/pages/HomePage';

const Stack = createNativeStackNavigator();
const { height } = Dimensions.get('window');


function App() {

  const scrollViewRef = useRef(null);
  const currentScreenIndex = useRef(0);

  const handleSwipe = (event) => {
    const offsetY = event.nativeEvent.translationY;
    scrollViewRef.current.getNode().scrollTo({ y: -currentScreenIndex.current * height - offsetY, animated: false });
  };

  const [appear, setAppear] = useState(true)
  const [appearHome, setAppearHome] = useState(false)

  return (
    <View style={styles.container}>
      {appear ? 
        <>
        <GestureHandlerRootView onGestureEvent={handleSwipe}>
        <ScrollView
          ref={scrollViewRef}
          vertical
          pagingEnabled
          showsVerticalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const offsetY = event.nativeEvent.contentOffset.y;
            currentScreenIndex.current = Math.round(offsetY / height);
          }}
          scrollEventThrottle={1}
        >
          {/* SCREEN */}
          <View style={styles.screenContainer}>
            <FirstPage />
          </View>

          <View style={styles.screenContainer}>
            <SecondPage onPress={() => setAppear(!appear) & setAppearHome(!appearHome)}/>
          </View>
          
        </ScrollView>
      </GestureHandlerRootView></>
      : null}
      {appearHome ? <HomePage onPress={() => setAppearHome(!appearHome) & setAppear(!appear)}></HomePage> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    height,
  },
});

export default App;