import React, { useRef, useState } from 'react'
import { View, TextInput, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, StyleProp } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/global';

interface InputProps {
    value?: string;
    errors?: string[];
    label?: string;
    password?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad' | 'decimal-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    placeholder?: string;
    disabled?: boolean;
    iconButton?: IconButton;
    multiline?: boolean;
    onChange?: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    style?: any;
}

interface IconButton {
    icon: string;
    action?: () => void;
}

const defaultIconButton = {
    icon: 'close-circle-outline'
}

export const TextField = ({
    style = {},
    value,
    errors = [],
    label,
    password,
    keyboardType,
    autoCapitalize = 'none',
    placeholder = '',
    disabled,
    iconButton = defaultIconButton,
    multiline,
    onChange, onFocus, onBlur
}: InputProps) => {
    const textInputRef = useRef<TextInput>(null);
    const [passwordHide, setPasswordHide] = useState(true);

    const handleFocus = () => {
        onFocus?.();
    };

    const handleBlur = () => {
        onBlur?.();
    };

    const handleChangeText = (text: string) => {
        onChange?.(text);
    };

    const clearValue = () => {
        textInputRef.current?.clear();
        handleChangeText('')
    };

    const getErrorMessage = (): string => {
        return errors.join(', ')
    };

    const renderIconButton = () => {
        if (disabled) return null;
        return !errors.length
            ? (
                <View style={{position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center'}}>
                    <TouchableOpacity onPress={iconButton.action ?? clearValue}>
                        <Icon name={iconButton.icon} size={26} style={{color: colors.gray80}} />
                    </TouchableOpacity>
                </View>
            )
            : (
                <View style={{position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center'}}>
                    <Icon name="alert-circle" size={26} style={{color: colors.red}} />
                </View>
            )
    }

    const passwordIconButton = () => {
        if (disabled || !password) return null
        return (
            <View
                style={{
                    position: 'absolute',
                    right: 45,
                    top: 0,
                    bottom: 0,
                    justifyContent: 'center',
                }}
                >
                <TouchableOpacity onPress={() => setPasswordHide(!passwordHide)}>
                    <Icon
                    name={passwordHide ? 'eye-off' : 'eye'}
                    size={26}
                    style={{ color: colors.gray80 }}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <TouchableWithoutFeedback onPress={()=>textInputRef.current?.focus()}>
            <View style={[styles.container, !!errors.length ? styles.containerError: null, {paddingRight: password ? 80 : 40}]}>
                {label &&
                    <Text allowFontScaling={false} style={[styles.label, !!errors.length && styles.error]}>{`${label}`}</Text>
                }
                <TextInput
                    style={[styles.input, disabled ? globalStyles.disabled : null, style]}
                    allowFontScaling={false}
                    ref={textInputRef}
                    value={value}
                    placeholder={placeholder}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChangeText={handleChangeText}
                    secureTextEntry={password && passwordHide}
                    keyboardType={keyboardType ?? 'default'}
                    editable={!disabled}
                    multiline={multiline}
                    autoComplete={'off'}
                    autoCorrect={false}
                    autoCapitalize={ (password || keyboardType === 'email-address')
                                        ? 'none'
                                        : autoCapitalize
                                        ? autoCapitalize
                                        : 'sentences'}
                />
                {!!errors.length && 
                    <Text allowFontScaling={false} style={[styles.label, styles.error, styles.errorMessage]}>{getErrorMessage()}</Text>
                }
                {passwordIconButton()}
                {renderIconButton()}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingLeft: 10,
        paddingVertical: 5,
        paddingBottom: 5
    },
    containerError: {
        borderBottomWidth: 2,
        borderColor: colors.red
    },
    input: {
        padding: 0,
        color: colors.black,
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