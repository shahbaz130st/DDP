import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { colors } from '../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface MainHeaderProps {
    navigation: any;
    title?: string;
    showBackButton?: boolean;
}

export const MainHeader = ({ title, navigation, showBackButton=true }: MainHeaderProps) => {

    const handleBackPress = () => {
        if (navigation?.canGoBack()) navigation.goBack();
    }

    return (
        <View style={styles.container}>
            <Text allowFontScaling={false} style={styles.title}>{title}</Text>
            {(navigation?.canGoBack() && showBackButton) && 
                <View style={styles.backButtonContainer}>
                    <TouchableOpacity onPress={handleBackPress}>
                        <Icon name="chevron-left" size={40} style={{color: colors.white}}></Icon>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: Platform.OS === 'ios' ? 130 : 80,
        paddingTop: Platform.OS === 'ios' ? 50 : 0,
        backgroundColor: colors.black60
    },
    title: {
        flex: 1,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize: 20,
        color: colors.white
    },
    backButtonContainer: {
        position: 'absolute', 
        top: Platform.OS === 'ios' ? 20 : 0, 
        left: 20, 
        height: '100%', 
        justifyContent: 'center'
    }
})