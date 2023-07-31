import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/colors';
import DatePicker from 'react-native-date-picker';
import { FormatDate, FormatTime } from '../utils/datetime';

interface DateTimeFieldProps {
    value?: string;
    errors?: string[];
    label?: string;
    mode?: 'date' | 'time' | 'datetime';
    onChange?: (value: string) => void;
}

export const DateTimeField = ({ value, errors = [], label, mode, onChange }: DateTimeFieldProps) => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(value ? new Date(value) : null)

    const handleDateConfirm = (date: Date) => {
        setDate(date);
        onChange?.(date.toISOString());
    };

    const getValueDisplay = (): string => {
        if (!date) return '';
        if (mode == 'date') return FormatDate(date);
        if (mode == 'time') return FormatTime(date);
        return `${FormatDate(date)} ${FormatTime(date)}`;
    }

    const getErrorMessage = (): string => {
        return errors.join(', ')
    };

    return (
        <>
            <View style={[styles.container, !!errors.length ? styles.containerError: null]}>
                {label && <Text allowFontScaling={false} style={[styles.label, !!errors.length && styles.error]}>{`${label}`}</Text>}
                <TouchableOpacity style={{paddingVertical: 2}} onPress={() => setOpen(true)}>
                    <Text allowFontScaling={false} style={styles.text}>
                        {getValueDisplay()}
                    </Text>
                    {!!errors.length && <Text allowFontScaling={false} style={[styles.label, styles.error, styles.errorMessage]}>{getErrorMessage()}</Text>}
                </TouchableOpacity>
                <View style={{position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center'}}>
                    {!errors.length 
                        ? <Icon name="calendar-blank" size={26} style={{color: colors.gray80}} />
                        : <Icon name="alert-circle" size={26} style={{color: colors.red}} />
                    }
                </View>
            </View>
            <DatePicker
                modal
                open={open}
                mode={mode}
                date={value ? new Date(value) : new Date()}
                onConfirm={(date: any) => {
                    setOpen(false)
                    handleDateConfirm(date)
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            />
        </>
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
    }
});