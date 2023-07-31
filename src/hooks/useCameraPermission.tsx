import { useEffect, useState } from "react";
import { Camera } from "react-native-vision-camera";
import { CameraPermissionRequestResult } from "react-native-vision-camera/lib/typescript/Camera";

export const useVideoPermission = (): [boolean, boolean, () => Promise<void>] => {
    
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(false);
    const [hasMicrophonePermission, setHasMicrophonePermission] = useState<boolean>(false);

    const requestPermissions = async (): Promise<void> => {
        const cameraPermission: CameraPermissionRequestResult = await Camera.requestCameraPermission();
        setHasCameraPermission(cameraPermission === 'authorized');
        const microphonePermission: CameraPermissionRequestResult = await Camera.requestMicrophonePermission();
        setHasMicrophonePermission(microphonePermission === 'authorized');

    }

    useEffect(() => {
        requestPermissions();
    }, [])


    return [hasCameraPermission, hasMicrophonePermission, requestPermissions];
}