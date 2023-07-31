import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const cameraStyle = StyleSheet.create({
    topButtons: {
        position: 'absolute',
        top: 0,
        width: '100%',
        zIndex: 2,
    },
    bottomButtons: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 20,
        pointerEvents: 'box-none',
        zIndex: 2,
    },
    button: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: colors.black60,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    top: {
        top: 40,
    },
    bottom: {
        bottom: 40,
    },
    right: {
        right: 30,
    },
    left: {
        left: 30,
    },
    actionButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: '#CCCCCC',
    },
    white: {
        backgroundColor: 'white',
    }
})