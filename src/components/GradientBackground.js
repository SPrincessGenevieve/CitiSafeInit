import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

function GradientBackground(props) {
    
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(45, 82, 178, 1)', 'rgba(45, 82, 178, 0.3)']}
        style={{ height: '100%', width: '100%', position: 'absolute' }}
        
      />
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

export default GradientBackground;