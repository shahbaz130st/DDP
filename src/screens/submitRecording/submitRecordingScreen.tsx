import React from "react";
import { View, Alert, Text, Keyboard } from "react-native";
import Video from "react-native-video";
import { useState } from "react";
import fs from 'react-native-fs';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { RecordForm } from "./recordingForm";
import { CameraControls } from "../../components/camera/cameraControls";
import { ScreenProps } from "../../models/navigation.model";

import { globalStyles } from "../../styles/global";
import { colors } from "../../styles/colors";

import { useServices } from "../../hooks/useServices";

export function SubmitRecordingScreen({ navigation, route }: ScreenProps) {
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadPercentage, setUploadPercentage] = useState<any>('Uploading: 0%');
    const filePath = route.params?.filePath;
    const [playing, setPlaying] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const { uploadService } = useServices();

    const handleActionPress = () => {
        setPlaying(!playing);
    }
    
    const handleUploadPress = async () => {
        setShowForm(true);
    };

    const handleFormSubmit = async (recordingData: {title: string, description: string}) => {
        Keyboard.dismiss();
        if (recordingData.title == '') {
            Alert.alert('Title is required');
            return;
        }

        try {
            setUploading(true);
            await uploadService.uploadFile(recordingData.title, recordingData.description,filePath, 'video', handleUploadProgress);
            setUploading(false);
            Alert.alert('Upload completed');
            deleteFileAndGoBack();
        } catch (e) {
            setUploading(false);
            Alert.alert('Upload failed');
        } 
    }

    const deleteFileAndGoBack = async () => {
        await fs.unlink(filePath);
        AsyncStorage.removeItem('TempVideo');
        navigation.goBack();
    }

    const handleClosePress = () => {
        Alert.alert('Abandon Post', 'Unsaved changes will be lost', [
            {text: 'Stay', style:'default'},
            {text: 'Leave', style: 'cancel', onPress: deleteFileAndGoBack},
        ], {cancelable: true});
    }

    const handleUploadProgress = (percentage: number) => {
        setUploadPercentage(`Uploading: ${percentage.toString()}%`);
    };

    return (
        <View style={globalStyles.absoluteFill}>
            <View style={[globalStyles.fill, globalStyles.column]}>
                <Video source={{uri: filePath}} 
                    resizeMode='stretch'
                    style={globalStyles.fill}
                    paused={!playing}
                    onEnd={() => setPlaying(false)}
                /> 
            </View>
            <CameraControls actionIcon="play"
                stopActionIcon="pause"
                actionActive={playing}
                microphoneActive={true}
                allowMute={false}
                allowFlip={false}
                allowUpload={true}
                handleActionPress={handleActionPress}
                handleMutePress={() => {}}
                handleFlipPress={() => {}}
                handleUploadPress={handleUploadPress}
                handleClosePress={handleClosePress}
            />
            {showForm && 
                <View style={[globalStyles.absoluteFill, {padding: 20, justifyContent: 'center'}]} pointerEvents='box-none'>
                    <View style={[globalStyles.container]}>
                        <RecordForm onSubmit={handleFormSubmit}></RecordForm>

                        {uploading ? (
                            <View style={[globalStyles.centered, { marginTop: 15 }]}>
                                <Text allowFontScaling={false} style={[{ color: colors.white }]}>{uploadPercentage}</Text>
                            </View>
                        ) : (
                            <></>
                        )}
                    </View>
                </View>
            }
        </View>
        
    )
}