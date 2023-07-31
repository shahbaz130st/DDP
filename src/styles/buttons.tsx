import { StyleSheet } from 'react-native'
import { colors } from './colors';

export const authFlowButtons = StyleSheet.create({
    submitButton: {
        backgroundColor: colors.blueButton,
        width: 240,
        height: 45,
        borderRadius: 5,
    },
    submitLabel: {
        textAlign: 'center',
        color: colors.white,
        fontSize: 16
    },
    submitIcon: {
        position: 'absolute', 
        right: 10,
        bottom: 0,
        top: 0,
        justifyContent: 'center'
    }
})