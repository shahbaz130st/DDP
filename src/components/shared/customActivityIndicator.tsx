import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, Easing, StyleSheet } from 'react-native';

const CustomActivityIndicator = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startRotationAnimation();
  }, []);

  const startRotationAnimation = () => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const rotateInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        style={[styles.image, { transform: [{ rotate: rotateInterpolation }] }]}
        source={require('../../assets/custom-activity-indicator.png')} // Replace with your custom SVG or PNG image source
        resizeMode="contain"
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
  image: {
    width: 100,
    height: 100,
  },
});
export default CustomActivityIndicator;