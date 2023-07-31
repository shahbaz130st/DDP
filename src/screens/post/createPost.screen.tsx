import React from 'react';
import { View, StyleSheet, Text, TextInput, Alert } from 'react-native';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';

import { globalStyles } from '../../styles/global';
import { colors } from '../../styles/colors';

import { ScreenProps } from '../../models/navigation.model';

import { GradientButton } from '../../components/gradientButton';

import { useForm } from '../../hooks/useForm';
import { useServices } from '../../hooks/useServices';

export function CreatePost({ navigation }: ScreenProps) {
    const [uploading, setUploading] = React.useState<boolean>(false);
    const [uploadPercentage, setUploadPercentage] = React.useState<any>('Uploading: 0%');
    const [fileData, setFileData] = React.useState<DocumentPickerResponse|null>(null);
    const { uploadService } = useServices();

    const postData = {
        title: '',
        description: '',
        file: null,
    };

    const form = useForm({
        title: {
            value: postData.title ?? postData.title,
            validator: {
                validate: (value) => !!value,
                errorMessage: 'Title is required'
            }
        },
        description: {
            value: postData.description ?? postData.description,
            validator: {
                validate: (value) => !!value,
                errorMessage: 'Description is required'
            }
        },
    });

    const handleSubmit = async () => {
        if (!form.valid || !fileData) return;
        try {
            setUploading(true);
            // # submit post with file
            await uploadService.uploadFile(form.value['title'], form.value['description'], fileData.uri.replace('file://', ''), 'video', handleUploadProgress);
            setUploadPercentage('Uploading: 0%');
            setUploading(false);
            Alert.alert('File Upload', 'Successfully uploaded');
            // navigate back to my Profile screen
            setTimeout(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Feed' }],
                });
            }, 2000);
        } catch (e) {
            console.log(e);
            setUploading(false);
            Alert.alert('Create Post Failed', 'An error occurred');
        }
    }

    const selectFile = async () => {
        try {
        const result = await DocumentPicker.pickSingle({
            type: [DocumentPicker.types.video],
        });
        setFileData(result);
        } catch (err) {
        if (DocumentPicker.isCancel(err)) {
            // User cancelled the picker
        } else {
            // Handle other errors
            console.log(err);
        }
        }
    };

    const handleUploadProgress = (percentage: number) => {
        setUploadPercentage(`Uploading: ${percentage.toString()}%`);
    };

    return (
        <>
            <View style={[globalStyles.fill, globalStyles.centered]}>
                <View style={[styles.createContainer]}>
                    <View style={[{ justifyContent: 'center' }]}>
                        <View style={[globalStyles.column]}>
                            <View style={styles.formInput}>
                                <Text allowFontScaling={false} style={[globalStyles.textWhite, { marginBottom: 10 }]}>Title</Text>
                                <TextInput
                                    style={styles.textField}
                                    allowFontScaling={false}
                                    value={form.value['title']}
                                    onChangeText={(text: string) => form.set('title', text)}
                                    keyboardType={'default'}
                                    returnKeyType="next"
                                />
                            </View>
                            <View style={styles.formInput}>
                                <Text allowFontScaling={false} style={[globalStyles.textWhite, { marginBottom: 10 }]}>Description</Text>
                                <TextInput
                                    style={styles.textField}
                                    allowFontScaling={false}
                                    value={form.value['description']}
                                    onChangeText={(text: string) => form.set('description', text)}
                                    keyboardType={'default'}
                                    textAlignVertical='top'
                                    maxLength={200}
                                    returnKeyType="done"
                                />
                            </View>
                        </View>
                    </View>

                    <Text allowFontScaling={false} style={[globalStyles.textWhite, {textAlign: 'center', marginBottom:10}]}>{fileData ? fileData.name : ''}</Text>
                    <GradientButton color={"red"} label="Select video / picture" onPress={selectFile}></GradientButton>
                    {uploading ? (
                        <View style={[globalStyles.centered, { marginTop: 15 }]}>
                            <Text allowFontScaling={false} style={[{ color: colors.white }]}>{uploadPercentage}</Text>
                        </View>
                    ) : (
                        <></>
                    )}
                </View>
                <View style={{ position: 'relative', top: 100 }}>
                    <GradientButton style={{ width: 210, borderRadius: 5 }} color={"green"} label="Confirm" onPress={handleSubmit} disabled={uploading}></GradientButton>
                </View>
            </View>

        </>
    );
};

const styles = StyleSheet.create({
    formInput: {
        marginBottom: 20
    },
    textField: {
        fontSize: 16,
        borderRadius: 5,
        backgroundColor: colors.white,
        padding: 5,
    },
    createContainer: {
        width: 300,
        height: 300,
        paddingTop: 16,
        paddingBottom: 24,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 10,
        backgroundColor: colors.black60,
    },
});
