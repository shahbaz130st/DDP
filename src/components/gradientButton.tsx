import React from "react";
import { View, TouchableHighlight, Text, StyleSheet, StyleProp, ViewProps } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { globalStyles } from "../styles/global"
import { colors } from "../styles/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface GradientButtonProps {
    label: string,
    icon?: string,
    color?: 'red' | 'orange' | 'purple' | 'green',
    disabled?: boolean;
    style?: any;
    onPress: () => void;
}

const gradients = {
    red: ["#850303", "#BF1616", "#BF1616", "#850303"],
    orange: ["#795215", "#E89636", "#E89636", "#795215"],
    purple: ["#753A88", "#46237A"],
    green: ["#06272a", "#065760", "#06272a"],

}

export const GradientButton = ({ label, icon, color = 'red', disabled, onPress, style = {} }: GradientButtonProps) => {
    return (
        <View style={{height: 40, ...style}}>
            <TouchableHighlight style={[globalStyles.fill, styles.button]} onPress={onPress} disabled={disabled}>
                <LinearGradient start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 0 }}
                    colors={gradients[color]}
                    style={[globalStyles.verticalCenter, styles.gradient, disabled ? globalStyles.disabled : null]}
                >
                    {icon && 
                        <Icon name={icon} size={25} style={[globalStyles.textWhite, styles.icon]}/>
                    }
                    <Text allowFontScaling={false} style={globalStyles.textWhite}>
                        {label}
                    </Text>
                </LinearGradient>
            </TouchableHighlight>
        </View> 
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
        overflow: 'hidden',
    },
    gradient: {
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 20
        // paddingLeft: 18,
        // paddingRight: 24
    },
    icon: {
        paddingRight: 10
    },
})