import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { globalStyles } from '../../styles/global';
import { Channel } from '../../models/channel.model';
import { useOnFocus } from '../../hooks/useOnFocus';
import IVSPlayer from 'amazon-ivs-react-native-player';
import { cameraStyle } from '../../styles/camera';
import { useServices } from '../../hooks/useServices';

export function HomeScreen() {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [viewChannelUrl, setViewChannelUrl] = useState<string>('');

    const { channelService } = useServices();

    const getLiveChannels = async () => {
        const liveChannels = await channelService.getLive();
        setChannels(liveChannels);
    }

    useOnFocus((isFocused: boolean) => {
        if(isFocused) getLiveChannels();
    });

    const handleView = (url: string) => {
        setViewChannelUrl(url);
    };

    const handleBack = () => {
        setViewChannelUrl('');
    };

    return viewChannelUrl 
        ? (
            <View style={[globalStyles.fill, globalStyles.black]}>
                <IVSPlayer 
                    streamUrl={viewChannelUrl}
                    resizeMode="aspectFill"
                    autoplay
                />
                <View style={[cameraStyle.topButtons]}>
                    <TouchableOpacity
                        style={[cameraStyle.button, cameraStyle.top, cameraStyle.left]}
                        onPress={handleBack}
                    />
                </View>
            </View>
        )
        : (
            <View style={[globalStyles.fill, style.streamList, globalStyles.column]}>
                {channels.map(c => (
                    <Button key={c.channelName}
                        title={c.channelName}
                        onPress={() => handleView(c.playbackUrl!)}
                    />
                ))}

                {!channels.length &&
                    <View style={[globalStyles.fill, globalStyles.centered]}>
                        <Text>No Live Streams</Text>
                    </View>}
            </View>
        );
};

const style = StyleSheet.create({
    streamList: {
        padding: 40,
        justifyContent: 'center'
    },
    streamButton: {
        width: '100%'
    }
})
