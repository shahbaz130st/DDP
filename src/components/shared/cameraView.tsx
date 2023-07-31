import React, { useEffect, useRef, useState } from "react"
import { StyleSheet, Text, View, Button, Platform, Alert, Dimensions } from "react-native"
import { globalStyles } from "../../styles/global";
import { Camera, CameraDevice } from "react-native-vision-camera";
import { useOnFocus } from "../../hooks/useOnFocus";
import { CameraControls } from "../camera/cameraControls";
import { check, PERMISSIONS, Permission, request, RESULTS, openSettings } from 'react-native-permissions';
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { colors } from "../../styles/colors";
interface CameraViewProps {
  action: 'video' | 'photo';
  position?: 'front' | 'back';
  allowFlip?: boolean;
  document: string;
  navigation: NavigationProp<ParamListBase>;
  onVideoRecorded?: (path: string) => void;
  onPhotoCaptured?: (path: string) => void;
  onClosePress: () => void;
}

export function CameraView({ action, position, allowFlip = true, document, navigation, onVideoRecorded, onPhotoCaptured, onClosePress }: CameraViewProps) {
  const [loading, setLoading] = useState(true);
  const [cameraPosition, setCameraPosition] = useState(position ?? 'back');
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [device, setDevice] = useState<CameraDevice>();
  const [cameraActive, setCameraActive] = useState(true);
  const [microphoneActive, setMicrophoneActive] = useState(true);
  const [recording, setRecording] = useState(false);
  const cameraRef = useRef<Camera>(null);
  const overlayWidth = Dimensions.get('window').width; 
  const overlayHeight = Dimensions.get('window').height; 
  const idDimensionsRatio = 363 / 217; 
  const idDimensionsHeight = Math.round(Dimensions.get("window").height * 0.5);
  const idDimensionsWidth = Math.round(idDimensionsHeight / idDimensionsRatio);

  const documentString = 'Enter '+document+' details manually'

  const cameraPermission = Platform.select({
    ios: PERMISSIONS.IOS.CAMERA,
    android: PERMISSIONS.ANDROID.CAMERA,
  }) as Permission;

  const microphonePermission = Platform.select({
    ios: PERMISSIONS.IOS.MICROPHONE,
    android: PERMISSIONS.ANDROID.RECORD_AUDIO,
  }) as Permission;
  
  const checkCameraPermission = async () => {
    const status = await check(cameraPermission);
    if (status !== RESULTS.GRANTED) {
      requestPermission();
    } else {
      // Camera permission is granted, you can use the camera
    }
  };
  
  const requestPermission = async () => {
    const cameraResult = await check(cameraPermission);
    const microphoneResult = await check(microphonePermission);
  
    if (cameraResult === RESULTS.DENIED || cameraResult === RESULTS.BLOCKED || microphoneResult === RESULTS.DENIED || microphoneResult === RESULTS.BLOCKED) {
      const requestResultCamera = await request(cameraPermission);
      const requestResultMicrophone = await request(microphonePermission);
  
      if (requestResultCamera === RESULTS.GRANTED && requestResultMicrophone === RESULTS.GRANTED) {
        // console.log('Permission granted');
      } else {
        // console.log('Permission denied');

        // Show an alert that explains why we need the permission and what to do next
        Alert.alert(
          "Permission Required",
          "This app needs access to your camera and microphone. Please go to Settings and grant access.",
          [
            {
              text: "Go to Settings",
              onPress: () => openSettings().catch(() => console.warn('Cannot open settings'))
            },
            {
              text: "Cancel",
              onPress: () => navigation.navigate('Feed'),
            }
          ]
        );
      }
    }
  };
  
  // Call this function to start the permission check and request flow

  useOnFocus((isFocused: boolean) => {
    if (isFocused !== cameraActive) setCameraActive(isFocused);
    if (!isFocused && recording) cameraRef.current?.stopRecording();
  });

  useEffect(() => {
    checkCameraPermission();

    const initializeCamera = async () => {
      const devices = await Camera.getAvailableCameraDevices();
      const device = cameraPosition === 'front'
        ? devices.find(d => d.position === 'front')
        : devices.find(d => d.position === 'back');
      

      setDevices(devices);
      setDevice(device);
      setLoading(false);
    }

    initializeCamera();
  }, []);

  const handleCameraFlip = () => {
    const newCameraPosition = cameraPosition === 'front'
      ? 'back'
      : 'front';
    const newCameraDevice = newCameraPosition === 'front'
      ? devices.find(d => d.position === 'front')
      : devices.find(d => d.position === 'back');

    if (!newCameraDevice) return;
    setDevice(newCameraDevice);
    setCameraPosition(newCameraPosition);
  };

  const handleActionPress = () => {
    if (action == 'video') toggleRecording();
    else takePhoto();
  }

  const takePhoto = async () => {
    const photo = await cameraRef.current?.takePhoto();
    if (!photo) return;
    
    onPhotoCaptured?.(photo.path);
  }

  const goToNextScreen = () => {
    const nextScreen = document == 'Driver\'s License' ? 'VerifyIdentity' : 'VerifyLicense';
    navigation.navigate(nextScreen);
};

  const toggleRecording = async () => {
    const nowRecording = !recording;
    setRecording(nowRecording);

    if (nowRecording) {
      cameraRef.current?.startRecording({
        onRecordingFinished: (video) => onVideoRecorded?.(video.path),
        onRecordingError: (error) => console.error(error),
      });
    } else {
      await cameraRef.current?.stopRecording();
    }
  };

  if (loading) return (
    <View style={[globalStyles.fill, globalStyles.centered]}>
      <Text>Loading</Text>
    </View>
  )

  if (!device) return (
    <View style={[globalStyles.fill, globalStyles.centered]}>
      <Text>No Camera Found</Text>
    </View>
  )
  const overlayStyles = StyleSheet.create({
    overlay: {
      position: 'absolute',
      width: overlayWidth,
      height: overlayHeight,
      zIndex: 1, // Ensure the overlay is behind other components
    },
    idDimensions: {
      position: 'absolute',
      top: (overlayHeight - idDimensionsHeight) / 2 - (overlayHeight * 0.10),
      left: (overlayWidth - idDimensionsWidth) / 2,
      width: idDimensionsWidth,
      height: idDimensionsHeight,
      borderWidth: 2,
      borderColor: '#d6e90b',
      backgroundColor: 'transparent', // Set the background color to transparent
    },
    topOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom:  overlayHeight / 2 + idDimensionsHeight / 2 + (overlayHeight * 0.10),
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    bottomOverlay: {
      position: 'absolute',
      top: overlayHeight / 2 + idDimensionsHeight / 2 - (overlayHeight * 0.10),
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    leftOverlay: {
      position: 'absolute',
      top: overlayHeight / 2 - idDimensionsHeight / 2 - (overlayHeight * 0.10),
      left: 0,
      right: overlayWidth / 2 + idDimensionsWidth / 2,
      bottom: overlayHeight / 2 - idDimensionsHeight / 2 + (overlayHeight * 0.10),
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    rightOverlay: {
      position: 'absolute',
      top: overlayHeight / 2 - idDimensionsHeight / 2 - (overlayHeight * 0.10),
      left: overlayWidth / 2 + idDimensionsWidth / 2,
      right: 0,
      bottom: overlayHeight / 2 - idDimensionsHeight / 2 + (overlayHeight * 0.10),
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
      directionsText: {
        color: colors.white,
        textAlign: 'center',
        marginTop: '5%',
        marginLeft: '25%',
        marginRight: '10%',
        padding: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius:5
    },
    link: {
      color: colors.blueLink,
      textDecorationLine: 'underline',
      fontWeight: 'bold',
      fontSize: 20,
      textAlign: 'center'
    },
    container: {
      backgroundColor: colors.black60,
      borderRadius: 10,
      padding: 20,
      opacity:.9, 
  },
  button: {
    borderRadius: 10,
    opacity:.9, 
    marginTop: '5%',
    marginLeft: '10%',
    marginRight: '10%',
},
  });
  return (
    <View style={[globalStyles.fill]}>
      <Camera
        ref={cameraRef}
        style={[globalStyles.fill]}
        device={device}
        isActive={cameraActive}
        video={cameraActive && action == 'video'}
        audio={cameraActive && microphoneActive && action == 'video'}
        photo={cameraActive && action == 'photo'}
      />
      <CameraControls actionIcon={action === 'video' ? 'record' : 'camera'}
      stopActionIcon="stop"
			actionActive={recording}
			microphoneActive={microphoneActive}
			allowMute={action == 'video'}
			allowFlip={allowFlip}
			handleActionPress={handleActionPress}
			handleMutePress={() => setMicrophoneActive(!microphoneActive)}
			handleFlipPress={handleCameraFlip}
			handleClosePress={onClosePress}
		/>
      {document && 
      <View style={overlayStyles.overlay}>
        <View style={overlayStyles.topOverlay}>
          <Text style={overlayStyles.directionsText}>
                Verify your {document} by taking a picture.
                Press the camera button below, then line up your {document} within the frame.
            </Text>
          </View>
        <View style={overlayStyles.bottomOverlay}>
          <View style={overlayStyles.button}>
              <Button title={documentString} onPress={goToNextScreen}/>  
            </View>
        </View>
        <View style={overlayStyles.leftOverlay} />
        <View style={overlayStyles.rightOverlay} />
        <View style={overlayStyles.idDimensions} />
      </View>
}
    </View>
  );
}
