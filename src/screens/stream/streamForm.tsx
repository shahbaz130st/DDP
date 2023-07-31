import React from 'react';
import { Alert } from 'react-native';
import { useForm } from "../../hooks/useForm";
import { TextField } from '../../components/textField';
import { StyleSheet, View } from 'react-native';
import { globalStyles } from '../../styles/global';
import { GradientButton } from '../../components/gradientButton';

interface StreamFormProps {
    onSubmit: (formData: {title: string, description: string}) => Promise<void>
}

export function StreamForm({ onSubmit }: StreamFormProps) {
    const form = useForm({
        title: {
            validator: {
                validate: (value) => !!value,
                errorMessage: 'Stream title is required'
            }
        },
        description: {
            validator: {
                validate: (value) => !!value,
                errorMessage: 'Stream description is required'
            }
        }
    });

    const verityStartStream = () => {
        Alert.alert(
            'Start Stream with this info?',
            `${form.value['title']}\n\n${form.value['description']}
            `,
            [
              {
                text: "Confirm",
                onPress: () => {
                    onSubmit(form.value as {title: string, description: string})
                },
              },
              {
                text: "Cancel",
                style: "cancel"
            }
            ]
        );
    }

    return (
        <>
            <View style={styles.formInput}>
                <TextField value={form.value['title']} 
                    errors={form.errors['title']}
                    label='Title' 
                    onChange={(value) => form.set('title', value)} 
                />
            </View>
            <View style={styles.formInput}>
                <TextField value={form.value['description']}
                    errors={form.errors['description']}
                    label='Description'
                    multiline
                    style={{maxHeight: 60}}
                    onChange={(value) => form.set('description', value)}
                />
            </View>
            <View style={globalStyles.centered}>
                <GradientButton label="Start Stream" 
                    icon="access-point" 
                    onPress={verityStartStream}
                    disabled={!form.valid}
                ></GradientButton>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    formInput: {
        marginBottom: 20
    }
})