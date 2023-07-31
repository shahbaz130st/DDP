import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Platform } from 'react-native';
import { ScreenProps } from '../../models/navigation.model';
import { authFlowButtons } from '../../styles/buttons';
import { globalStyles } from '../../styles/global';
import { useForm } from '../../hooks/useForm';
import { colors } from '../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextField } from '../../components/textField';
import { FormControl } from '../../models/form.model';
import { ShortCodeField } from '../../components/shortCodeField';
import { AuthenticationService } from '../../services/authentication.service';
import { useRegistrationContext } from '../../hooks/useRegistrationContext';
import { LicenseType } from '../../models/license.model';
import { useServices } from '../../hooks/useServices';
import { useLoading } from '../../hooks/useLoading';
import { SelectionField } from '../../components/selectionField';

export function VerifyPhone({ navigation }: ScreenProps) {
    const { verificationData, setVerificationData } = useRegistrationContext();

    const { authenticationService } = useServices();
    const setLoading = useLoading();
    const codeLength:number = AuthenticationService.OtpCodeLength;
    const [countryCode, setCountryCode] = React.useState<string>("+1" as string);

    const form: FormControl = useForm({
        phoneNumber: {
            value: verificationData.phoneNumber,
            validator: {
                validate: (value) => {
                    const valid = /^(?:\+1)?\s*(?:\d{3}[-\.\s]*){2}\d{4}$/.test(value);
                    return valid;
                },
                errorMessage: 'Valid phone number is required'
            }
        },
        code: {
            validator: {
                validate: (value) => value?.length === codeLength,
                errorMessage: 'Verification code required'
            }
        }
    })
    
    const handleVerifyWithEmail = () => {
        navigation.navigate('VerifyEmail');
    } 

    const handleSubmit = async () => {
        if (!form.valid) return;
        try {
            Keyboard.dismiss();
            setLoading(true);
            const verify = await authenticationService.verifyOTP(form.value['code']);
            setLoading(false);
            
            setVerificationData(form.value);
            navigation.navigate('VerifyIdentityImage', { verificationStep: LicenseType.Identity });
        } catch (e) {
            Alert.alert('Verification Failed', 'Try entering the code again, or select Resend Verification Code to have a new code sent to your phone number.', [
                {text: 'Ok', style: 'cancel'},
            ]);
            setLoading(false);
        }
    }

    const handleResendVerificationCode = () => {
        if (!form.inputValid('phoneNumber')) return;
        try {
            Keyboard.dismiss();
            setLoading(true);
            authenticationService.sendOTP('sms', form.value['phoneNumber']);
            setLoading(false);
            Alert.alert('Verification Code Sent', 'A new verification code has been sent to your phone.', [
                {text: 'Ok', style: 'cancel'},
            ]);
        } catch (e) {
            setLoading(false);
            Alert.alert('Verification Code Sent Failed', 'Try again later.', [
                {text: 'Ok', style: 'cancel'},
            ]);
        }
    }

    const countryCodeOptions = [
        { "value": "+1", "label": "+1" },
    ];

    return (
        <KeyboardAvoidingView 
            style={[globalStyles.fill, globalStyles.column, {justifyContent: 'center', padding: 20}]} behavior={'padding'}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[globalStyles.fill, globalStyles.column, {justifyContent: 'center', padding: 20}]}>
                    <View style={[globalStyles.fill, {justifyContent: 'center'}]}>
                        <View style={[globalStyles.container, globalStyles.column]}>
                            <View style={[styles.formInput, {flexDirection: 'row'}]}>
                                {/* <View style={{width: 50, marginRight: 5}}>
                                    <SelectionField
                                        value={countryCode} 
                                        label='Code' 
                                        options={countryCodeOptions}
                                        onChange={(value) => {
                                            console.log(value);
                                            // get the country code from the value
                                            // setCountryCode()
                                            return [];
                                        }}
                                        showArrow={false}
                                    />
                                </View> */}
                                <View style={{flex: 1}}>
                                    <TextField
                                        value={form.value['phoneNumber']}
                                        errors={form.errors['phoneNumber']}
                                        label='Phone Number'
                                        keyboardType='phone-pad'
                                        onChange={(value) => form.set('phoneNumber', value)} 
                                    />
                                </View>
                            </View>
                            <View style={[styles.formInput, globalStyles.centered]}>
                                <TouchableOpacity style={[authFlowButtons.submitButton, !form.inputValid('phoneNumber') && globalStyles.disabled]} 
                                    disabled={!form.inputValid('phoneNumber')} 
                                    onPress={handleResendVerificationCode}
                                >
                                    <View style={[globalStyles.absoluteFill, globalStyles.centered]}>
                                        <Text allowFontScaling={false} style={authFlowButtons.submitLabel}>Send Verification Code</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={handleVerifyWithEmail}>
                                <View style={[globalStyles.centered, {padding: 10}]}>
                                    <Text allowFontScaling={false} style={styles.link}>Verify with email</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={[globalStyles.container, globalStyles.column, {marginTop: 40}]}>
                            <Text allowFontScaling={false} style={[{color: colors.white, textAlign: 'center'}]}>Enter the verification code that was sent to your phone number</Text>
                            <View style={{paddingHorizontal: 10}}>
                                <ShortCodeField value={form.value['code']} onChange={(value) => {if (value.length == codeLength) Keyboard.dismiss(); return form.set('code', value)}} characterCount={codeLength}></ShortCodeField>
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
                                </View>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    formInput: {
        marginBottom: 20
    },
    link: {
        color: colors.blueLink
    },   
    submitButtonContainer: {
        marginTop: 30,
        alignItems: 'center'
    },
});