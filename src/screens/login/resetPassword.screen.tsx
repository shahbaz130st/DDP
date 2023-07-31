import React, { useEffect } from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import { globalStyles } from '../../styles/global';
import { TextField } from '../../components/textField';
import { colors } from '../../styles/colors';
import { useForm } from '../../hooks/useForm';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { authFlowButtons } from '../../styles/buttons';
import { ScreenProps } from '../../models/navigation.model';
import { useRegistrationContext } from '../../hooks/useRegistrationContext';
import { ErrorStatus, FetchError } from '../../services/fetch.service';
import { useServices } from '../../hooks/useServices';
import { useLoading } from '../../hooks/useLoading';
import { useAuthContext } from '../../hooks/useAuthContext';

export function ResetPasswordScreen({ navigation, route }: ScreenProps) {
    const email = route.params?.email

    const { authenticationService } = useServices();
    const setLoading = useLoading();

    const form = useForm({
        password: {
            validator: {
                validate: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[?#$^+=!*()@%&]).{8,15}$/.test(value),
                errorMessage: 'Password is required'
            }
        },
        confirmPassword: {
            validator: {
                validate: (value, formValue) => value === formValue['password'],
                errorMessage: 'Passwords do not match'
            }
        }
    });

    const handleSubmit = async () => {
        if (!form.valid) return;
        try {
            setLoading(true);
            const authUser = await authenticationService.resetPassword(email, form.value['password']);
            setLoading(false);
            navigation.navigate('Login');
        } catch (e) {
            let message = 'An unknown error occurred'
            if (e instanceof FetchError && e.status == ErrorStatus.BadRequest)
                message = 'That email is already registered'
                
            setLoading(false);
            Alert.alert('Reset Password Failed', message);
        }
    }

    const renderPasswordDetail = (detail: string) => 
        (<Text allowFontScaling={false} style={styles.passwordDetail}>{`\u2022 ${detail}`}</Text>)
    

    return (

        <KeyboardAvoidingView
            style={[globalStyles.fill, globalStyles.column, {justifyContent: 'center', padding: 20}]}
            behavior={'padding'}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <>
                <View style={[globalStyles.fill, {justifyContent: 'center'}]}>
                    <View style={[globalStyles.container, globalStyles.column]}>
                        <View style={styles.formInput}>
                            <TextField
                                value={form.value['password']}
                                label='Password'
                                onChange={(value) => form.set('password', value)}
                                password></TextField>
                        </View>
                        <View style={{}}>
                            <TextField
                                value={form.value['confirmPassword']}
                                label='Confirm Password'
                                onChange={(value) => form.set('confirmPassword', value)}
                                password></TextField>
                            <View style={[globalStyles.column, styles.passwordDetails]}>
                                {renderPasswordDetail('MUST contain at least 8 characters (12+ recommended)')}
                                {renderPasswordDetail('MUST contain at least one uppercase character')}
                                {renderPasswordDetail('MUST contain at least on lowercase character')}
                                {renderPasswordDetail('MUST contain at least one number')}
                                {renderPasswordDetail('MUST contain at least one special character ?#$^+=!*()@%&')}
                            </View>
                        </View>
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
                </>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};


const styles = StyleSheet.create({
    formInput: {
        marginBottom: 20
    },
    passwordDetails: {
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    passwordDetail: {
        color: colors.white,
        fontSize: 12
    },   
    submitButtonContainer: {
        height: 100,
        alignItems: 'center'
    },
});