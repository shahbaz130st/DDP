import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/colors';
import RNPickerSelect from 'react-native-picker-select';

interface SelectionFieldProps {
    value?: string;
    errors?: string[];
    label?: string;
    options: {value: string, label: string}[];
    onChange?: (value: string) => void;
    showArrow?: boolean;
}

export const SelectionField = ({ value, errors = [], label, options, onChange, showArrow = true }: SelectionFieldProps) => {
    const [selectedValue, setSelectedValue] = useState(options.find(option => option.value === value)?.label ?? '');

    const handleValueChange = (value: string) => {
        onChange?.(value);
        // get label from options and set selectedValue
        const selectedValue = options.find(option => option.value === value)?.label ?? '';
        setSelectedValue(selectedValue);
    };

    const getErrorMessage = (): string => {
        return errors.join(', ');
    };

    const pickerStyle = {
        height: 50,
        padding: 0,
        color: colors.black,
        paddingHorizontal: 10,
        marginVertical: -10,
    };

    return (
        <View style={[styles.container, !!errors.length ? styles.containerError: null]}>
            <RNPickerSelect
                value={value}
                placeholder={{label: 'Select a item...', value: null}}
                useNativeAndroidPickerStyle={false}
                style={{inputAndroid: pickerStyle, inputIOS: pickerStyle}}
                onValueChange={handleValueChange}
                items={options}
            >
                {label && <Text allowFontScaling={false} style={[styles.label, !!errors.length && styles.error]}>{`${label}`}</Text>}
                <View style={{width: '100%', height: 30, flexDirection:'column', justifyContent: 'center'}}>
                    <Text allowFontScaling={false} style={{color: 'black'}}>{selectedValue}</Text>
                </View>
            </RNPickerSelect>
            {!!errors.length && <Text allowFontScaling={false} style={[styles.label, styles.error, styles.errorMessage]}>{getErrorMessage()}</Text>}
			{ showArrow && (
	            <View style={{position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center'}}>
	                {!errors.length
	                    ? <Icon name="menu-down" size={26} style={{color: colors.gray80}} />
	                    : <Icon name="alert-circle" size={26} style={{color: colors.red}} />
	                }
	            </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        paddingBottom: 5
    },
    containerError: {
        borderBottomWidth: 2,
        borderColor: colors.red
    },
    text: {
        padding: 0,
        color: colors.black
    },
    label: {
        fontSize: 10,
        color: colors.gray80,
    },
    errorMessage: {
        padding: 0
    },
    error: {
        color: 'red'
    },
});