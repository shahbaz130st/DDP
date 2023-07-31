import React from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '../styles/colors';
import { CodeField, Cursor } from 'react-native-confirmation-code-field';

interface ShortCodeFieldProps {
    value?: string;
    characterCount?: number
    password?: boolean;
    onChange?: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
}

export const ShortCodeField = ({ value, characterCount, password, onChange, onFocus, onBlur }: ShortCodeFieldProps) => {

    const handleChangeText = (text: string) => {
        onChange?.(text) ?? [];
    };

    return (
        <View>
            <CodeField
                // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                value={value}
                secureTextEntry={password}
                onChangeText={handleChangeText}
                cellCount={characterCount ?? 4}
                rootStyle={styles.codeFieldRoot}
                keyboardType={"number-pad"}
                textContentType="oneTimeCode"
                onFocus={onFocus}
                onBlur={onBlur}
                blurOnSubmit={true}
                renderCell={({index, symbol, isFocused}) => (
                    <View>
                        <Text allowFontScaling={false} key={index} style={[styles.cell]}>
                            {symbol || (isFocused ? <Cursor /> : null)}
                        </Text>
                        <View style={[styles.borderBottom, isFocused && styles.focusCell]}></View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    codeFieldRoot: {marginTop: 20},
    cell: {
      width: 40,
      height: 50,
      lineHeight: 38,
      fontSize: 28,
      textAlign: 'center',
      color: colors.white,
    },
    borderBottom: {
        position: 'absolute',
        height: 2,
        width: 40,
        left: 0,
        top: 48,
        backgroundColor: colors.white,
    },
    focusCell: {
      backgroundColor: colors.black,
    },
  });