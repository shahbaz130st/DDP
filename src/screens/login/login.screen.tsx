import React, { useEffect } from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { globalStyles } from '../../styles/global';
import { useAuthContext } from '../../hooks/useAuthContext';
import { AuthContextData } from '../../models/authContext.model';
import { TextField } from '../../components/textField';
import { colors } from '../../styles/colors';
import { useForm } from '../../hooks/useForm';
import { authFlowButtons } from '../../styles/buttons';
import { ScreenProps } from '../../models/navigation.model';
import { FetchError, ErrorStatus } from '../../services/fetch.service';
import { RegistrationContextData } from '../../models/registrationContext.model';
import { useRegistrationContext } from '../../hooks/useRegistrationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { LicenseType } from '../../models/license.model';
import { useServices } from '../../hooks/useServices';
import { useLoading } from '../../hooks/useLoading';
import { User } from '../../models/user.model';


export function LoginScreen({ navigation }: ScreenProps) {
    const authContext: AuthContextData = useAuthContext();
    const registrationContext: RegistrationContextData = useRegistrationContext();
    
    const { authenticationService } = useServices();
    const setLoading = useLoading();
    const isFocused = useIsFocused();

    const form = useForm({
        email: {
            validator: {
                validate: (value) => {
                    const valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
                    return valid;
                },
                errorMessage: 'Valid email is required'
            }
        },
        password: {
            validator: {
                validate: (value) => !!value,
                errorMessage: 'Password is required'
            }
        }
    });

    useEffect(() => {
        getLastLogginInEmail();
    }, []);

    useEffect(() => {
        if (!!authContext.isAuthenticated || !authContext.authData.userProfile || !isFocused) return;

        const { user, identityLicense, medicalLicense } = authContext.authData.userProfile;
        registrationContext.setRegistrationData({email: user.email});
        registrationContext.setVerificationData({email: user.email, phoneNumber: user.phoneNumber});
        registrationContext.setIdentityData(identityLicense ?? {});
        registrationContext.setLicenseData(medicalLicense ?? {});
        navigateToNextScreen(user, !!identityLicense, !!medicalLicense);
    }, [authContext]);
    
    const getLastLogginInEmail = async () => {
        setLoading(true);
        const lastLoggedInEmail = await AsyncStorage.getItem('userEmail');
        if (lastLoggedInEmail) form.set('email', lastLoggedInEmail);
        setLoading(false);
    }
    
    const handleLogin = async () => {
        try {
            setLoading(true);
            const loginUser = await authenticationService.login(form.value['email'], form.value['password']);
            setLoading(false);
            return authContext.login(loginUser); 
        } catch (e) {
            setLoading(false);
            console.log(e);
            let message = 'An unknown error occurred'
            if (e instanceof FetchError && e.status == ErrorStatus.BadRequest)
                message = 'Incorrect email or password'

            Alert.alert('Login Failed', message);
        }
    }

    const navigateToNextScreen = (user: User, identityVerified: boolean, medicalLicenseVerified: boolean) => {
        let nextScreen = 'Feed'; // screen after successful auth login
        const params: any = {};

        if (!user.emailVerified && !user.phoneVerified) nextScreen = 'VerifyEmail'; 
        else if (!identityVerified || !user.profileImage) {
            nextScreen = 'VerifyIdentityImage';
            params.verificationStep = LicenseType.Identity;
        } else if (!medicalLicenseVerified) {
            nextScreen = 'VerifyLicenseImage';
            params.verificationStep = LicenseType.Medical;
        }
        navigation.navigate(nextScreen, params);
    }

    return (
        <>
            <KeyboardAvoidingView
                style={[globalStyles.fill, globalStyles.column, {justifyContent: 'center', padding: 20}]}
                behavior={'padding'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <>
                    <View style={[globalStyles.fill, {justifyContent: 'center'}]}>
                        <View style={[globalStyles.container, globalStyles.column]}>
                            <View style={styles.formInput}>
                                <TextField value={form.value['email']}
                                    errors={form.errors['email']}
                                    label='Email' 
                                    keyboardType='email-address' 
                                    onChange={(value) => form.set('email', value)}
                                    autoCapitalize='none'
                                />
                            </View>
                            <View style={styles.formInput}>
                                <TextField value={form.value['password']}
                                    errors={form.errors['password']}
                                    label='Password' onChange={(value) => form.set('password', value)} 
                                    password
                                />
                            </View>
                            <View style={globalStyles.row}>
                                <View>
                                    <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Register') }>
                                        <Text allowFontScaling={false} style={styles.link}>Register</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={globalStyles.fill}></View>
                                <View>
                                    <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('ForgotPassword')} >
                                        <Text allowFontScaling={false} style={styles.link}>Forgot Password</Text> 
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.submitButtonContainer}>
                        <TouchableOpacity style={[authFlowButtons.submitButton, !form.valid && globalStyles.disabled]} 
                            disabled={!form.valid} 
                            onPress={handleLogin}
                        >
                            <View style={[globalStyles.absoluteFill, globalStyles.centered]}>
                                <Text allowFontScaling={false} style={authFlowButtons.submitLabel}>Log In</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </>
    );
};


const styles = StyleSheet.create({
    formInput: {
        marginBottom: 20
    },
    linkButton: {
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    link: {
        color: colors.blueLink
    },   
    submitButtonContainer: {
        height: 100,
        alignItems: 'center'
    },
});