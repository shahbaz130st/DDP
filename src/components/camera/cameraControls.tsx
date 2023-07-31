import React from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import { cameraStyle } from "../../styles/camera";
import { colors } from "../../styles/colors";
import { globalStyles } from "../../styles/global";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Text } from "react-native-paper";

interface CameraControlsProps {
    actionIcon: string;
    stopActionIcon: string;
    actionActive: boolean;
    microphoneActive: boolean;
    allowMute: boolean;
    allowFlip: boolean;
    allowUpload?: boolean;
    streamPage?: boolean;
    handleActionPress: () => void;
    handleMutePress: () => void;
    handleFlipPress: () => void;
    handleUploadPress?: () => void;
    handleClosePress: () => void;
}

export function CameraControls(props: CameraControlsProps) {
    return (
        <>
            <View style={[cameraStyle.bottomButtons]} pointerEvents='box-none'>
                <TouchableOpacity 
                    style={[cameraStyle.actionButton, globalStyles.centered]}
                    onPress={props.handleActionPress}
                >
                    {/* if not streaming then show action icon else show stop action icon */}
                    <Icon name={ !props.actionActive ? props.actionIcon : props.stopActionIcon} size={40} style={[{color: colors.red}]} />
                </TouchableOpacity>
            </View>
            <View style={[cameraStyle.bottomButtons, {alignItems: 'flex-end'}]}  pointerEvents='box-none'>
                {props.allowMute &&
                    <TouchableOpacity 
                        style={[cameraStyle.button, !!props.actionActive ? globalStyles.disabled : null]}
                        onPress={() => props.handleMutePress()}
                        disabled={!!props.actionActive}
                    >
                        {/* if microphone active then show microphone icon else show microphone off icon */}
                        <Icon name={props.microphoneActive ? 'microphone' : 'microphone-off'} size={30} style={{color: props.microphoneActive ? colors.white : colors.red}} />
                    </TouchableOpacity>
                }
                {props.allowFlip && 
                    <TouchableOpacity 
                        style={[cameraStyle.button, !!props.actionActive ? globalStyles.disabled : null]}
                        onPress={props.handleFlipPress}
                        disabled={!!props.actionActive}
                    >
                        <Icon name="arrow-u-down-left" size={30} style={{color: colors.white}}/>
                    </TouchableOpacity>
                }
                {props.allowUpload && 
                    <TouchableOpacity 
                        style={[cameraStyle.button]}
                        onPress={props.handleUploadPress}
                    >
                        <Icon name="upload" size={30} style={{color: colors.white}} />
                    </TouchableOpacity>
                }
            </View>
            <View style={[cameraStyle.bottomButtons,{bottom: undefined, top: Platform.OS === 'ios' ? 20 : 0, alignItems: 'flex-start'}]} pointerEvents='box-none'>
                <TouchableOpacity 
                    style={[cameraStyle.button]}
                    onPress={props.handleClosePress}
                >
                    <Icon name="close" size={30} style={{color: colors.red}} />
                </TouchableOpacity>
            </View>
            {props.streamPage && (
                <View style={[cameraStyle.bottomButtons, { bottom: undefined, top: Platform.OS === 'ios' ? 50 : 20, flexDirection: 'row', alignItems: 'center' }]} pointerEvents='box-none'>
                    <View style={{ marginRight: 4 }}>
                        <Icon name="circle" size={8} style={{ color: props.actionActive ? colors.red : colors.gray80 }} />
                    </View>
                    <Text allowFontScaling={false} style={{ color: colors.red, fontSize: 10, fontWeight: 'bold', opacity: props.actionActive ? 1 : 0.4 }}>LIVE</Text>
                </View>
            )}
        </>
    )
}