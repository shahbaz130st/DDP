import React from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { globalStyles } from '../../styles/global';
import { TextField } from '../../components/textField';
import { colors } from '../../styles/colors';
import { useForm } from '../../hooks/useForm';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { authFlowButtons } from '../../styles/buttons';
import { ScreenProps } from '../../models/navigation.model';
import { DateTimeField } from '../../components/dateTimeField';
import { SelectionField } from '../../components/selectionField';
import { useRegistrationContext } from '../../hooks/useRegistrationContext';
import { LicenseType } from '../../models/license.model';
import { useServices } from '../../hooks/useServices';
import { useLoading } from '../../hooks/useLoading';

export function VerifyIdentityScreen({ navigation }: ScreenProps) {
    const { identityData, setIdentityData, identityDocument } = useRegistrationContext();

    const { authenticationService } = useServices();
    const setLoading = useLoading();

    const form = useForm({
        firstName: {
            value: identityData.firstName,
            validator: {
                validate: (value) => !!value,
                errorMessage: 'First name is required'
            }
        },
        lastName: {
            value: identityData.lastName,
            validator: {
                validate: (value) => !!value,
                errorMessage: 'Last name is required'
            }
        },
        dateOfBirth: {
            value: identityData.dateOfBirth,
            validator: {
                validate: (value) => !!value,
                errorMessage: 'Date of birth is required'
            }
        },
        stateOfLicense: {
            value: identityData.stateOfLicense,
            validator: {
                validate: (value) => !!value,
                errorMessage: 'State of license is required'
            }
        }
    });

    const stateOptions = [
        { "value": "AL", "label": "Alabama" },
        { "value": "AK", "label": "Alaska" },
        { "value": "AZ", "label": "Arizona" },
        { "value": "AR", "label": "Arkansas" },
        { "value": "CA", "label": "California" },
        { "value": "CO", "label": "Colorado" },
        { "value": "CT", "label": "Connecticut" },
        { "value": "DE", "label": "Delaware" },
        { "value": "FL", "label": "Florida" },
        { "value": "GA", "label": "Georgia" },
        { "value": "HI", "label": "Hawaii" },
        { "value": "ID", "label": "Idaho" },
        { "value": "IL", "label": "Illinois" },
        { "value": "IN", "label": "Indiana" },
        { "value": "IA", "label": "Iowa" },
        { "value": "KS", "label": "Kansas" },
        { "value": "KY", "label": "Kentucky" },
        { "value": "LA", "label": "Louisiana" },
        { "value": "ME", "label": "Maine" },
        { "value": "MD", "label": "Maryland" },
        { "value": "MA", "label": "Massachusetts" },
        { "value": "MI", "label": "Michigan" },
        { "value": "MN", "label": "Minnesota" },
        { "value": "MS", "label": "Mississippi" },
        { "value": "MO", "label": "Missouri" },
        { "value": "MT", "label": "Montana" },
        { "value": "NE", "label": "Nebraska" },
        { "value": "NV", "label": "Nevada" },
        { "value": "NH", "label": "New Hampshire" },
        { "value": "NJ", "label": "New Jersey" },
        { "value": "NM", "label": "New Mexico" },
        { "value": "NY", "label": "New York" },
        { "value": "NC", "label": "North Carolina" },
        { "value": "ND", "label": "North Dakota" },
        { "value": "OH", "label": "Ohio" },
        { "value": "OK", "label": "Oklahoma" },
        { "value": "OR", "label": "Oregon" },
        { "value": "PA", "label": "Pennsylvania" },
        { "value": "RI", "label": "Rhode Island" },
        { "value": "SC", "label": "South Carolina" },
        { "value": "SD", "label": "South Dakota" },
        { "value": "TN", "label": "Tennessee" },
        { "value": "TX", "label": "Texas" },
        { "value": "UT", "label": "Utah" },
        { "value": "VT", "label": "Vermont" },
        { "value": "VA", "label": "Virginia" },
        { "value": "WA", "label": "Washington" },
        { "value": "WV", "label": "West Virginia" },
        { "value": "WI", "label": "Wisconsin" },
        { "value": "WY", "label": "Wyoming" }
    ]
      

    const handleSubmit = async () => {
        if (!form.valid) return;
        try {
            setLoading(true);
            const verify = await authenticationService.verifyIdentity(form.value, identityDocument);
            setLoading(false);
            setIdentityData(form.value);
            navigation.navigate('ProfileImage', {
                nextScreen: 'VerifyLicenseImage',
                nextScreenProps: { verificationStep: LicenseType.Medical }
            });
        } catch (e) {
            Alert.alert('Verification failed', 'An error occurred');
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={[globalStyles.fill, globalStyles.column, {justifyContent: 'center', padding: 20}]}
            behavior={'padding'}
        >
            <View style={[globalStyles.fill, globalStyles.column, {justifyContent: 'center', padding: 20}]}>
                <View style={[globalStyles.fill, {justifyContent: 'center'}]}>
                    <View style={[globalStyles.container, globalStyles.column]}>
                        <View style={styles.formInput}>
                            <TextField value={form.value['firstName']}
                                errors={form.errors['firstName']}
                                label='First Name'
                                onChange={(value) => form.set('firstName', value)} 
                            />
                        </View>
                        <View style={styles.formInput}>
                            <TextField value={form.value['lastName']}
                                errors={form.errors['lastName']}
                                label='Last Name'
                                onChange={(value) => form.set('lastName', value)}
                            />
                        </View>
                        <View style={styles.formInput}>
                            <DateTimeField 
                                value={form.value['dateOfBirth']} 
                                errors={form.errors['dateOfBirth']} 
                                label='Date of Birth' 
                                mode={'date'} 
                                onChange={(value) => form.set('dateOfBirth', value)}
                            />
                        </View>
                        <View style={styles.formInput}>
                            <SelectionField 
                                value={form.value['stateOfLicense']} 
                                errors={form.errors['stateOfLicense']} 
                                label='State of License' 
                                options={stateOptions}
                                onChange={(value) => form.set('stateOfLicense', value)}
                            />
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
            </View>
        </KeyboardAvoidingView>
    );
};


const styles = StyleSheet.create({
    formInput: {
        marginBottom: 20
    },
    submitButtonContainer: {
        height: 100,
        alignItems: 'center'
    },
});