import React from "react";
import { View, Text, Button } from "react-native";
import { globalStyles } from "../../styles/global";

interface NoVideoPermissionProps {
    cameraPermission: boolean;
    microphonePermission: boolean;
    requestPermissions: () => Promise<void>;
}

export function NoVideoPermissions ({ cameraPermission, microphonePermission, requestPermissions }: NoVideoPermissionProps) {

    const getDevicesWithNoPermissions = () => {
        if (!cameraPermission)
            if (!microphonePermission) return 'camera or microphone';
            else return 'camera';

        if (!microphonePermission) return 'microphone';
        
    }

    return (
        <View style={[globalStyles.fill, globalStyles.centered]}>
            <Text>No access to {getDevicesWithNoPermissions()}</Text>
            <Button title="Request Access" onPress={requestPermissions} />
        </View>
    )
}