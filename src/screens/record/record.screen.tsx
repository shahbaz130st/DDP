import React from 'react';
import { CameraView } from '../../components/shared/cameraView';
import { ScreenProps } from '../../models/navigation.model';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fs from 'react-native-fs';

export function RecordScreen({ navigation } : ScreenProps) {

    const handleVideoRecorded = async (filePath: string) => {
        const tempVideoKey = 'TempVideo'
        const existingFile = await AsyncStorage.getItem(tempVideoKey);
        if (existingFile) fs.unlink(existingFile);

        AsyncStorage.setItem(tempVideoKey, filePath);
        navigation.navigate('SubmitRecording', { filePath })
    };

    return (
        <CameraView action='video' onVideoRecorded={handleVideoRecorded} onClosePress={navigation.goBack} navigation={navigation}/>
    );
};
