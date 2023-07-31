import React from "react";
import { View, Text } from "react-native";
import { colors } from "../../styles/colors";
import { globalStyles } from "../../styles/global";
import CustomActivityIndicator from "./customActivityIndicator"

export function LoadingIndicator() {

    return (
        <View style={[globalStyles.absoluteFill, globalStyles.row, globalStyles.centered, {padding: 20}]}>
            <View style={[globalStyles.fill, globalStyles.container, globalStyles.centered]}>
                <View style={[globalStyles.centered, {height: 100, paddingBottom: 20}]}>
                    <CustomActivityIndicator></CustomActivityIndicator>
                </View>
                <Text allowFontScaling={false} style={{color: colors.white}}>Loading</Text>
            </View>
        </View>
    )
}