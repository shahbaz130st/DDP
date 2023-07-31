import React, { useEffect, useRef, useState } from 'react';
import { globalStyles } from '../../styles/global';
import { View, Text, Alert, Platform } from 'react-native';
import { useOnFocus } from '../../hooks/useOnFocus';
import { CameraPosition, IIVSBroadcastCameraView, IVSBroadcastCameraView } from 'amazon-ivs-react-native-broadcast';
import { AUDIO_CONFIG, VIDEO_CONFIG } from '../../models/channel.model';
import { CameraControls } from '../../components/camera/cameraControls';
import { ScreenProps } from '../../models/navigation.model';
import { StreamForm } from './streamForm';
import { useServices } from '../../hooks/useServices';
import { check, PERMISSIONS, Permission, request, RESULTS, openSettings } from 'react-native-permissions';

export function StreamScreen({ navigation }: ScreenProps) {
  const [outputUrl, setOutputUrl] = useState('');
  const [streamKey, setStreamKey] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>('back');
  const [cameraActive, setCameraActive] = useState<boolean>(true);
  const [microphoneActive, setMicrophoneActive] = useState(true);
  const cameraRef = useRef<IIVSBroadcastCameraView>(null);
  const [showForm, setShowForm] = useState(false);

  const { channelService } = useServices();

  useEffect(() => {
    checkCameraPermission();
    getUserChannel();
  }, [])

  useOnFocus((isFocused: boolean) => {
    if (streaming) {
      cameraRef.current?.stop();
      setStreaming(false);
    }
  });

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

  const getUserChannel = async () => {
    try {
      const channel = await channelService.getUserChannel();
      setOutputUrl(getOutputUrl(channel.ingestEndpoint));
      setStreamKey(channel.streamKey);
    } catch (e) {
      if (e === 'channel not found')
        await createUserChannel();
    }
  }

  const createUserChannel = async () => {
    try {
      const channel = await channelService.createUserChannel();
      setOutputUrl(getOutputUrl(channel.ingestEndpoint));
      setStreamKey(channel.streamKey);
    } catch {
      Alert.alert("Create Channel", "channel creation failed");
      navigation.goBack();
    }
  }

  const handleCameraFlip = async () => {
    setCameraPosition(cameraPosition === 'back' ? 'front' : 'back')
  };

  const handleActionPress = async () => {
    if (!streaming && !showForm) {
      setShowForm(true);
    }

    if (streaming) {
      Alert.alert(
        "Are you Sure?",
        "You are stopping the stream",
        [
          {
            text: "Stop",
            onPress: () => {
              setStreaming(false);
              cameraRef.current?.stop();
              Alert.alert("Stream Ended", 
                "Your video is being processed. It may take several minutes for your video to appear in your gallery.")
            },
          },
          {
            text: "Cancel",
            style: "cancel"
          },
        ]
      )
    }
  };

  const handleFormSubmit = async (streamData: { title: string, description: string }) => {
    const channel = await channelService.getUserChannel();
    const channel_name = channel.channelName;
    await channelService.streamInfo({
      "channel_name": channel_name,
      "title": streamData.title,
      "description": streamData.description
    })

    setStreaming(true);
    setShowForm(false)
    cameraRef.current?.start();
  }

  const getOutputUrl = (ingestEndpoint: string) => {
    return `rtmps://${ingestEndpoint}:443/app/`;
  };

  return outputUrl && streamKey && (
    <View style={[globalStyles.fill, globalStyles.black]} pointerEvents='box-none'>
      {cameraActive &&
        <IVSBroadcastCameraView
          ref={cameraRef}
          style={globalStyles.fill}
          rtmpsUrl={outputUrl}
          streamKey={streamKey}
          videoConfig={VIDEO_CONFIG}
          audioConfig={AUDIO_CONFIG}
          // isMuted={microphoneActive}
          isCameraPreviewMirrored={cameraPosition === 'front'}
          cameraPosition={cameraPosition}
          cameraPreviewAspectMode={'fill'}
        />
      }
      <CameraControls actionIcon="access-point"
        stopActionIcon="stop"
        actionActive={streaming}
        microphoneActive={microphoneActive}
        allowMute={true}
        allowFlip={true}
        streamPage={true}
        handleActionPress={handleActionPress}
        handleMutePress={() => setMicrophoneActive(!microphoneActive)}
        handleFlipPress={handleCameraFlip}
        handleClosePress={navigation.goBack}
      />
      {showForm &&
        <View style={[globalStyles.absoluteFill, { padding: 20, justifyContent: 'center' }]} pointerEvents='box-none'>
          <View style={[globalStyles.container]}>
            <StreamForm onSubmit={handleFormSubmit}></StreamForm>
          </View>
        </View>
      }
    </View>
  );
};
