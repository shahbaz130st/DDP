import { StyleSheet, Dimensions } from 'react-native'
import { colors } from './colors';

export const globalStyles = StyleSheet.create({
    fill: {
        flex: 1,
    },
    column: {
        flexDirection: 'column'
    },
    row: {
        flexDirection: 'row'
    },
    textCenter: {
        textAlign: 'center'
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    spaceAround: {
        justifyContent: 'space-around'
    },
    spaceBetween: {
        justifyContent: 'space-between'
    },
    absoluteFill: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    video: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }, 
    black: {
        backgroundColor: '#000000'
    },
    container: {
        backgroundColor: colors.black60,
        borderRadius: 10,
        padding: 20
    },
    disabled: {
        opacity: 0.5
    },
    horizontalCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noShadow: {
        shadowColor: 'transparent',
    },
    verticalCenter: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textWhite: {
        color: colors.white
    },
    textRed: {
        color: colors.red
    },
    bold: {
        fontWeight: 'bold',
    }
});