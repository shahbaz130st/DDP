import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { CameraView } from "../../components/shared/cameraView";
import { UserAvatar } from "../../components/shared/userAvatar";

import { useLoading } from "../../hooks/useLoading";
import { useServices } from "../../hooks/useServices";

import { colors } from "../../styles/colors";
import { authFlowButtons } from "../../styles/buttons";
import { globalStyles } from "../../styles/global";

import { ScreenProps } from "../../models/navigation.model";
import { LicenseType } from '../../models/license.model';

export function ProfileImageScreen({ navigation, route }: ScreenProps) {
    const setLoading = useLoading();
    const [loading, setIsLoading] = useState(false);
    const [imagePath, setImagePath] = useState('');
    const { userProfileService, uploadService } = useServices();

    const { nextScreen, nextScreenParams } = route.params ?? {};

    const handlePhotoCaptured = (path: string) => {
        setImagePath(path)
    };

    const handleSubmit = async () => {
        if (!imagePath || loading) return;
        try {
            setLoading(true);
            setIsLoading(true);
            await userProfileService.setProfileImage(imagePath);
            await uploadService.uploadFile('', '', imagePath, 'image', () => {}, 'profile-image');
            setLoading(false);
            setIsLoading(false);
            if (nextScreen) navigation.navigate(nextScreen, nextScreenParams);
            else navigation.goBack();
        } catch (e) {
            setLoading(false);
            setIsLoading(false);
            Alert.alert('Update profile image failed', 'Matching profile image to user license failed');
        }
    }

    return (
        !imagePath
            ? <View style={globalStyles.absoluteFill}>
                <CameraView action={'photo'}
                    onPhotoCaptured={handlePhotoCaptured}
                    onClosePress={() => navigation.goBack()}
                    navigation={navigation}
                />
            </View>
            : <View style={[globalStyles.fill, globalStyles.centered, {padding: 20}]}>
                <View style={[globalStyles.fill, styles.imageContainer]}>
                    <TouchableOpacity onPress={() => {
                        setImagePath('')
                        if (nextScreen) {
                            navigation.navigate("ProfileImage",{
                                nextScreen: 'VerifyLicenseImage',
                                nextScreenProps: { verificationStep: LicenseType.Medical }
                            })
                        } else {
                            navigation.navigate("UpdateProfileImage")
                        }
                    }}>
                        <View style={[globalStyles.centered, {padding: 20}]}>
                            <UserAvatar user={{profileImage: `file://${imagePath}`}} size={260} />
                            <View style={[{flexDirection: 'row', marginTop: 15}]}>
                                <Icon name="pencil" size={16} style={{color:colors.white, marginRight: 5}}></Icon>
                                <Text allowFontScaling={false} style={{color: 'white'}}>Edit</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.submitButtonContainer}>
                    <TouchableOpacity style={[authFlowButtons.submitButton]} 
                        onPress={handleSubmit}
                    >
                        <View style={[globalStyles.absoluteFill, globalStyles.centered]}>
                            <Text allowFontScaling={false} style={authFlowButtons.submitLabel}>Submit</Text>
                        </View>
                    </TouchableOpacity>
                </View> 
            </View>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 10,
    },
    submitButtonContainer: {
        height: 120,
        alignItems: 'center',
    },
});
