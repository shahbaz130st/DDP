import React from "react";
import { View, TouchableWithoutFeedback, Dimensions, Platform, Alert, ActivityIndicator } from "react-native";
import Video, { LoadError } from "react-native-video";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { globalStyles } from "../../styles/global";
import { colors } from "../../styles/colors";
import { useLoading } from '../../hooks/useLoading';
import { OnBufferData } from "react-native-video";

export function VideoView({ route, navigation }: any) {
    const { videoUri } = route.params;
    const [pause, setPause] = React.useState(false);
    const [volume, setVolume] = React.useState(1);
    const [buffering, setBuffering] = React.useState(true);


    const setPlayPause = () => {
        setPause(!pause);
    }

    const handleBuffer = (meta: OnBufferData) => {
        meta.isBuffering ? setBuffering(true) : setBuffering(false);
    };

    const videoError = (e: LoadError) => {
        console.log(e);
        Alert.alert(
            "Video Error",
            "We're Sorry but this video cannot be played. Please try again later.",
            [
              {
                text: "OK",
                onPress: () => navigation.navigate('Feed'),
              }
            ]
        );
    }

    const { width, height } = Dimensions.get('window');

    const VolumeButton = () => {
        return (
        <View style={[{
            position: 'relative',
            top: Platform.OS === 'ios' ? 50 : 20,
            left: width-60,
            elevation: 5,
        }]}>
            <TouchableWithoutFeedback onPress={setVolButton}>
                <View style={[globalStyles.centered, 
                    {
                        width: 45,
                        height: 45,
                        borderRadius: 22.5,
                        backgroundColor: colors.black60,
                    }]}>
                    <Icon name={volume === 1 ? "volume-high" : "volume-off"} size={35} style={[globalStyles.textWhite]} />
                </View>
            </TouchableWithoutFeedback>
        </View>
    )};

    const BackButton = () => {
        return (
            <View style={[{
                position: 'absolute',
                top: Platform.OS === 'ios' ? 50 : 20,
                left: 20,
                elevation: 10,
            }]}>
                <TouchableWithoutFeedback onPress={handleBackPress}>
                    <View style={[globalStyles.centered, 
                        {
                            width: 45,
                            height: 45,
                            backgroundColor: colors.black60,
                        }]}>
                        <Icon name='chevron-left' size={35} style={[globalStyles.textWhite]} />
                    </View>
                </TouchableWithoutFeedback>
            </View>
    )};

    const setVolButton = () => {
        setVolume(volume === 1 ? 0 : 1);
    }

    const handleBackPress = () => {
        if (navigation?.canGoBack()) navigation.goBack();
    }

    React.useEffect(() => {
        navigation.addListener('beforeRemove', (e: any) => {
            if (pause) {
                e.preventDefault();
                Alert.alert(
                    "Exit Video",
                    "Are you sure you want to exit the video?",
                    [   
                        {
                            text: "Cancel",
                            onPress: () => {},
                            style: "cancel"
                        },
                        {
                            text: "OK",
                            onPress: () => navigation.dispatch(e.data.action),
                        }
                    ]
                );
            }
        });
    }, [navigation, pause]);

    return (
        <View style={[
            {
                display: 'flex',
                flex: 1,
                height: height,
                width: width,
                backgroundColor: colors.black10,
                position: 'relative',
            },
        ]}>
            <TouchableWithoutFeedback onPress={setPlayPause}>
                <View style={[globalStyles.fill]}>
                    <Video
                        source={{uri: videoUri}}
                        style={[globalStyles.video]}
                        onError={videoError}
                        onBuffer={handleBuffer}
                        onLoadStart={() => setBuffering(true)}
                        onLoad={() => setBuffering(false)}
                        resizeMode='cover'
                        repeat={true}
                        paused={pause}
                        volume={volume}
                    />
                    <VolumeButton/>
                    <BackButton/>
                    
                    
                    {buffering 
                        ? (
                            <View style={{position: 'absolute', top: height/2, left: (width-35)/2, zIndex: 102}}>
                                <ActivityIndicator style={{ transform: [{ scale: 2 }] }} size="large" color="#FFFFFF" />
                            </View>
                        )
                        : (
                            <Icon name={pause ? "play" : "pause"} size={35} style={[globalStyles.textWhite, {position: 'absolute', top: height/2, left: (width-35)/2, zIndex: 100}]} />
                        )   
                    }
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}