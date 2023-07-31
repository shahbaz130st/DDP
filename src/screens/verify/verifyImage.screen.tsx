import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { globalStyles } from "../../styles/global";
import { ScreenProps } from "../../models/navigation.model";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from "../../styles/colors";
import { authFlowButtons } from "../../styles/buttons";
import { useForm } from "../../hooks/useForm";
import { useRegistrationContext } from "../../hooks/useRegistrationContext";
import { CameraView } from "../../components/shared/cameraView";
import { useState } from "react";
import { LicenseType } from "../../models/license.model";
import { useServices } from "../../hooks/useServices";
import { useLoading } from "../../hooks/useLoading";

export function VerifyImageScreen({ navigation, route }: ScreenProps) {
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadPercentage, setUploadPercentage] = useState<any>('Uploading: 0%');
    const { setIdentityData, setIdentityDocument, setLicenseData, setLicenseDocument } = useRegistrationContext();
    const [showCamera, setShowCamera] = useState(false);
    const form = useForm({
        imagePath: {
            validator: {
                validate: (value) => !!value,
                errorMessage: 'error'
            }
        }
    });

    const { uploadService, authenticationService } = useServices();
    const setLoading = useLoading();

    const licenseType: LicenseType = route.params?.verificationStep;
    const document: string = licenseType == LicenseType.Identity ? 'Driver\'s License' : 'Medical License';
    
    const handlePhotoCaptured = (path: string) => {
        setShowCamera(false); form.set('imagePath', path)
    };

    const handleSubmit = async () => {
        if (!form.valid) return;
        try {
            setLoading(true);
            const verificationData = await authenticationService.scanLicense(form.value.imagePath, licenseType);
            if (licenseType == LicenseType.Identity) {
                setIdentityDocument(form.value.imagePath)
                if (verificationData) setIdentityData(verificationData);
            } else {
                setLicenseDocument(form.value.imagePath);
                if (verificationData) setLicenseData(verificationData);
            }
            await uploadService.uploadFile('', '', form.value.imagePath, 'image', handleUploadProgress, licenseType);
            setLoading(false);

            goToNextScreen();
        } catch (e) {
            console.log(e);
            Alert.alert('Verification failed', 'An error occurred');
            setLoading(false);
        }
    };

    const goToNextScreen = () => {
        const nextScreen = licenseType == LicenseType.Identity
            ? 'VerifyIdentity'
            : 'VerifyLicense';

        navigation.navigate(nextScreen);
    };

    const handleUploadProgress = (percentage: number) => {
        setUploadPercentage(`Uploading: ${percentage.toString()}%`);
    };
    return (
        <>
            <View style={[globalStyles.fill, globalStyles.centered, {padding: 20}]}>
                <View style={[globalStyles.container]}>
                    <Text allowFontScaling={false} style={styles.directionsText}>
                        Verify your {document} by taking a picture.
                        Press the camera button below, then line up your {document} within the frame.
                    </Text>
                </View>
                {form.value?.imagePath ?
                <View style={styles.imageContainerLicense}>
                    {form.valid &&
                        <TouchableOpacity style={[{width:'100%', height:'100%', paddingVertical: 10}, globalStyles.centered]} onPress={() => setShowCamera(true)}>
                            <Image source={{uri: `file://${form.value.imagePath}`}} style={styles.imagePreview}></Image>
                            <View style={[{flexDirection: 'row', marginTop: 10, marginBottom: 5}]}>
                                <Icon name="pencil" size={16} style={{color:colors.white, marginRight: 5}}></Icon>
                                <Text allowFontScaling={false} style={{color:colors.white}}>Edit</Text>
                            </View>
                        </TouchableOpacity>
                    }
                </View>
                :
                <View style={styles.imageContainer}>
                    <TouchableOpacity style={[styles.cameraButton, globalStyles.centered]} onPress={() => setShowCamera(true)}>
                        <Icon name="camera" size={40} style={[{color: colors.white}]}></Icon>
                    </TouchableOpacity>
                </View>
                }

                <View style={[globalStyles.container, globalStyles.centered, {width: '100%', padding: 10}]}>
                    <TouchableOpacity style={{padding: 10}} onPress={goToNextScreen}>
                        <Text allowFontScaling={false} style={styles.link}>Enter {document} details manually</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.submitButtonContainer}>
                <TouchableOpacity style={[authFlowButtons.submitButton, !form.valid && globalStyles.disabled]} 
                    disabled={!form.valid} 
                    onPress={handleSubmit}
                >
                    <View style={[globalStyles.absoluteFill, globalStyles.centered]}>
                        <Text allowFontScaling={false} style={authFlowButtons.submitLabel}>Continue</Text>
                    </View>
                    
                    { form.valid && 
                    <View style={authFlowButtons.submitIcon}>
                        <Icon style={{color: colors.white}} name="arrow-right" size={30}></Icon>
                    </View>}
                </TouchableOpacity>
            </View>
            {showCamera &&
                <View style={globalStyles.absoluteFill}>
                    <CameraView action={'photo'}
                        allowFlip={false}
                        document={document}
                        onPhotoCaptured={handlePhotoCaptured}
                        onClosePress={() => setShowCamera(false)}
                        navigation={navigation}
                    />
                </View>
            }
        </>
    );
}

const styles = StyleSheet.create({
    directionsText: {
        color: colors.white,
        textAlign: 'center'
    },
    imageContainer: {
        height: 200, 
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 20
    },
    imageContainerLicense: {
        height: 217, 
        justifyContent: 'center',
        alignItems: 'center',
        width: 327,
        padding: 10
    },
    cameraButton: {
        width: 80, 
        height: 80, 
        borderRadius: 40, 
        backgroundColor: 'red'
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    submitButtonContainer: {
        height: 120,
        alignItems: 'center',
    },
    link: {
        color: colors.blueLink
    },
});
