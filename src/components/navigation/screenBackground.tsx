import React from 'react';
import { View, Image, StyleSheet } from "react-native"
import LinearGradient from 'react-native-linear-gradient';
import { globalStyles } from '../../styles/global';

export enum BackgroundTheme {
    Green = 'green',
    Blue = 'blue',
    Purple = 'purple',
    Pinkish = 'pinkish'
}

const gradientColors = {
    [BackgroundTheme.Green]: ["#06272a", "#065760", "#06272a"],
    [BackgroundTheme.Blue]: ["#074C6A", "#20A0D8", "#2192C3", "#20A0D8", "#074C6A"],
    [BackgroundTheme.Purple]: ["#46237A", "#753A88"],
    [BackgroundTheme.Pinkish]: ["#540E2B", "#8F2D56", "#540E2B"],
}

interface ScreenBackgroundProps {
    backgroundTheme?: BackgroundTheme;
}

export const ScreenBackground = ({ backgroundTheme }: ScreenBackgroundProps) => {
    return !!backgroundTheme 
        ? ( 
            <View style={[globalStyles.absoluteFill]}>
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={gradientColors[backgroundTheme]}
                    style={styles.gradient}
                >
                    <Image
                        style={styles.pattern}
                        source={require('../../assets/cube_pattern.png')}
                    />
                </LinearGradient>
            </View>
        )
        : null;
}


const styles = StyleSheet.create({ 
    gradient: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    pattern: {
        opacity: 0.1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    }
})