import React from 'react';
import { useForm } from "../../hooks/useForm";
import { TextField } from '../../components/textField';
import { StyleSheet, View } from 'react-native';
import { globalStyles } from '../../styles/global';
import { GradientButton } from '../../components/gradientButton';

interface RecordFormProps {
    onSubmit: (formData: {title: string, description: string}) => Promise<void>
}

export function RecordForm({ onSubmit }: RecordFormProps) {
    const form = useForm({
        title: {},
        description: {}
    });

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
                    onChange={(value) => form.set('description', value)} 
                />
            </View>
            <View style={globalStyles.centered}>
                <GradientButton label="Save Video" 
                    icon="content-save" 
                    onPress={() => onSubmit(form.value as {title: string, description: string})}
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