import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { User } from "../../models/user.model";
import { globalStyles } from "../../styles/global";
import { Config } from "../../config/config";

const TotalDefaultImage = 11;
export function UserAvatar({size, user}: {size: number, user: Partial<User>}) {
    return (
        <>
        {user.profileImage
            ? (
            <Image 
                style={[styles.imageContainer, {width: size, height: size, borderRadius: size / 2}]}
                source={{
                    uri: user.profileImage
                }}
            />
            )
            : (
            <View style={[styles.container, {width: size, height: size, borderRadius: size / 2}]}>
                <View style={[globalStyles.fill, globalStyles.centered]}>
                    <Text allowFontScaling={false} style={[{fontSize: size * 0.35}]}>
                        {user.firstName?.[0]} {user.lastName?.[0]}
                    </Text>
                </View>
            </View>
            )
        }
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#999'
    },
    imageContainer: {
        backgroundColor: '#999',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
})
