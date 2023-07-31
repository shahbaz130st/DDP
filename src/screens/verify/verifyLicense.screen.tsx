import React, { useState } from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { globalStyles } from '../../styles/global';
import { TextField } from '../../components/textField';
import { colors } from '../../styles/colors';
import { useForm } from '../../hooks/useForm';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { authFlowButtons } from '../../styles/buttons';
import { ScreenProps } from '../../models/navigation.model';
import { useRegistrationContext } from '../../hooks/useRegistrationContext';
import { SelectionField } from '../../components/selectionField';
import { useServices } from '../../hooks/useServices';
import { useLoading } from '../../hooks/useLoading';

enum IdType {
    NpiNumber = 'npi-number',
    MedicalLicense = 'medical-license'
} 

export function VerifyLicenseScreen({ navigation }: ScreenProps) {
    const { identityData, licenseData, setLicenseData } = useRegistrationContext();
    const [idType, setIdType] = useState(IdType.MedicalLicense);

    const { authenticationService } = useServices();
    const setLoading = useLoading();

    const form = useForm({
        firstName: {
            value: licenseData.firstName ?? identityData.firstName,
            validator: {
                validate: (value) => !!value || idType == IdType.NpiNumber,
                errorMessage: 'First name is required'
            }
        },
        lastName: {
            value: licenseData.lastName ?? identityData.lastName,
            validator: {
                validate: (value) => !!value || idType == IdType.NpiNumber,
                errorMessage: 'Last name is required'
            }
        },
        licensePermitNumber: {
            value: licenseData.licensePermitNumber,
            validator: {
                validate: (value) => !!value,
                errorMessage: 'License/Permit number is required'
            }
        },
        stateOfLicense: {
            value: licenseData.stateOfLicense ?? identityData.stateOfLicense,
            validator: {
                validate: (value) => !!value || idType == IdType.NpiNumber,
                errorMessage: 'State of license is required'
            }
        },
        npiNumber: {
            value: licenseData.npiNumber,
            validator: {
                validate: (value) => !!value || idType == IdType.MedicalLicense,
                errorMessage: 'NPI number is required'
            }
        }
    });

    const handleSubmit = async () => {
        if (!form.valid) return;
        try {
            setLoading(true);
            const verify = idType === IdType.MedicalLicense
            ? await authenticationService.verifyLicense(form.value)
            : await authenticationService.verifyNpiNumber({
                ...form.value,
                firstName: identityData.firstName!,
                lastName: identityData.lastName!
            });

            setLoading(false);
            setLicenseData(form.value);
            navigation.navigate('ReviewRegistration');
        } catch (e) {
            // TODO: need a better solution. The error message is not consistent
            if (typeof e == 'object' && e !== null && 'data' in e) {
                const data = e['data'] as any;
                Alert.alert(`Verification Failed`, data['data']);
            } else {
                Alert.alert(`Verification Failed`, `We're sorry, we couldn't find a match for the information you provided. Please ensure the name, medical license number, and state you entered are correct. Also, keep in mind that recent name or address changes within the last 1-3 years may affect the search results.`);
            }
            setLoading(false);
        }
    }

    
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
    ];

    const idOptions = [{
        value: IdType.NpiNumber,
        label: 'NPI #'
    },
    {
        value: IdType.MedicalLicense,
        label: 'Medical License'
    }];

    return (
        <KeyboardAvoidingView
            style={[globalStyles.fill, globalStyles.column, {justifyContent: 'center', padding: 20}]}
            behavior={'padding'}
        >
            <View style={[globalStyles.fill, globalStyles.column, {justifyContent: 'center', padding: 20}]}>
                <View style={[globalStyles.fill, {justifyContent: 'center'}]}>
                    <View style={[globalStyles.container, globalStyles.column]}>

                        <View style={[styles.formInput, {paddingBottom: 20}]}>
                            <SelectionField 
                                value={idType} 
                                label='Select identification' 
                                options={idOptions}
                                onChange={(value) => {
                                    if (!value) value = IdType.MedicalLicense;
                                    setIdType(value as IdType); return [];
                                }}
                            />
                        </View>
                        {idType === IdType.MedicalLicense &&
                            <>
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
                            </>
                        }
                        {idType === IdType.NpiNumber &&
                            <View style={styles.formInput}>
                                <TextField value={form.value['npiNumber']} 
                                    errors={form.errors['npiNumber']} 
                                    label='NPI #'
                                    onChange={(value) => form.set('npiNumber', value)}
                                />
                            </View>
                        }
                        <View style={styles.formInput}>
                            <TextField value={form.value['licensePermitNumber']}
                                errors={form.errors['licensePermitNumber']}
                                label='License/Permit#' 
                                onChange={(value) => form.set('licensePermitNumber', value)}
                            />
                        </View>
                        {idType === IdType.MedicalLicense &&
                            <View style={[styles.formInput]}>
                                <SelectionField 
                                    value={form.value['stateOfLicense']}  
                                    errors={form.errors['stateOfLicense']}  
                                    label='State' 
                                    options={stateOptions}
                                    onChange={(value) => form.set('stateOfLicense', value)}
                                />
                            </View>
                        }
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
        paddingTop: 10,
        alignItems: 'center'
    },
});