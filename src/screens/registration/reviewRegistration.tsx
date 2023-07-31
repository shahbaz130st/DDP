import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScreenProps, } from "../../models/navigation.model";
import { colors } from '../../styles/colors';
import { authFlowButtons } from '../../styles/buttons';
import { globalStyles } from '../../styles/global';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthContext } from '../../hooks/useAuthContext';
import { UserProfile } from '../../models/user.model';
import { useServices } from '../../hooks/useServices';

export function ReviewRegistrationScreen({}: ScreenProps) {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const authContext = useAuthContext();

    const { authenticationService } = useServices();

    useEffect(() => {
        const getUserProfile = async () => {
            const userProfile = await authenticationService.getUserProfile();
            setUserProfile(userProfile);
        };

        getUserProfile();
    }, []);

    const handleSubmit = async () => {
        try {
            const { authToken } = authContext.authData;
            if (!authToken || !userProfile) throw 'Login Failed';
            authContext.login({ authToken, userProfile });
        } catch (e) {
            Alert.alert('Login failed', 'An error occurred');
        }
    }

    const RegistrationDetail = ({label, value}: {label: string, value: string}) => {
        return (
            <View style={globalStyles.row}>
                <Text allowFontScaling={false} style={styles.registrationDetail}>{label}:</Text>
                <Text allowFontScaling={false} style={[styles.registrationDetail, {textAlign: 'right', flex: 1}]}>{value}</Text>
            </View>
        )
    }

    if (!userProfile?.medicalLicense || !userProfile.identityLicense) return null;
    const name = `${userProfile.identityLicense.firstName} ${userProfile.identityLicense.lastName}`;
    const email = userProfile.user.email;
    const phone = userProfile.user.phoneNumber || '';
    const licenseName = `${userProfile.medicalLicense.firstName} ${userProfile.medicalLicense.lastName}`;
    const title = userProfile.medicalLicense.title || '';
    const licensePermitNumber = userProfile.medicalLicense.licenseNumber || '';
    const npiNumber = userProfile.medicalLicense.npiNumber || '';
    const location = [userProfile.medicalLicense.city, userProfile.medicalLicense.stateOfLicense].filter(Boolean).join(', ');

    return (        
        <>
            <View style={[globalStyles.fill, globalStyles.column, styles.container]}>
                <View style={[globalStyles.fill, styles.registrationDetails]}>
                    <RegistrationDetail label="Name" value={name} />
                    <RegistrationDetail label="Email" value={email} />
                    <RegistrationDetail label="Phone" value={phone} />

                    <Text allowFontScaling={false} style={[styles.registrationDetail, styles.header]}>Medical License</Text>
                    <RegistrationDetail label="Name" value={licenseName} />
                    <RegistrationDetail label="Title" value={title} />
                    <RegistrationDetail label="Location" value={location} />
                    <RegistrationDetail label="License/Permit#" value={licensePermitNumber} />
                    <RegistrationDetail label="NPI#" value={npiNumber} />
                </View>
                <View style={styles.submitButtonContainer}>
                    <TouchableOpacity style={[authFlowButtons.submitButton]} 
                        onPress={handleSubmit}
                    >
                        <View style={[globalStyles.absoluteFill, globalStyles.centered]}>
                            <Text allowFontScaling={false} style={authFlowButtons.submitLabel}>Confirm</Text>
                        </View>
                        
                        <View style={authFlowButtons.submitIcon}>
                            <Icon style={{color: colors.white}} name="arrow-right" size={30}></Icon>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center', 
        padding: 20, 
        backgroundColor: colors.black60
    },
    registrationDetails: {
        justifyContent: 'center', 
        padding: 20
    },
    registrationDetail: {
        color: colors.white,
        fontSize: 16,
        paddingVertical: 5
    },
    header: {
        textDecorationLine: 'underline', 
        marginTop: 20, 
        marginBottom: 10
    },
    submitButtonContainer: {
        height: 200,
        paddingTop: 100, 
        alignItems: 'center'
    },
});