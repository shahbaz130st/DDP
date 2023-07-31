import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Platform, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native-gesture-handler';

import { ScreenProps } from '../../models/navigation.model';

import { Config } from '../../config/config';
import { globalStyles } from '../../styles/global';
import { colors } from '../../styles/colors';

import { UserAvatar } from '../../components/shared/userAvatar';
import { useServices } from '../../hooks/useServices';
import { useLoading } from '../../hooks/useLoading';

const MAX_CHARACTERS = 100;

export function GalleryScreen({ route, navigation }: ScreenProps) {
    const { userProfileService } = useServices();

    const profileId = route.params?.['profileId'];
    const [userProfile, setUserProfile] = React.useState<any>(null);
    const [videoArray, setVideoArray] = React.useState<any>([]);
    const setLoading = useLoading();

    // React useEffect to update height and width on screen rotation
    React.useEffect(() => {
        setLoading(true);
        const callProfileUser = () => {
            userProfileService.get(profileId).then((userData) => {
                setVideoArray(userData.videos);
                setUserProfile(userData.profile?.user);
                setLoading(false);
            });
    
        };

        callProfileUser();
    }, []);

    const videoNav = (videoUri: string) => {
        navigation.navigate('VideoView', { videoUri: videoUri });
    };

    if (!userProfile) {
        return;
    }
    return (
        <ScrollView style={{}}>
            <View style={[globalStyles.fill]}>
                <View style={[styles.profileHeader]}>
                    <View style={styles.backButtonContainer}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Icon name="chevron-left" size={40} style={{color: colors.white}}></Icon>
                        </TouchableOpacity>
                    </View>
                    <View style={{paddingLeft: 15}}>
                        <UserAvatar size={50} user={userProfile} />
                    </View>
                    <View style={[globalStyles.centered, {width: '70%'}]}>
                        <Text allowFontScaling={false} style={[globalStyles.textWhite, styles.profileText]}>{userProfile.firstName ? userProfile.firstName + ' ' + userProfile.lastName : 'User'}</Text>
                        <Text allowFontScaling={false} style={[globalStyles.textWhite, styles.profileText]}>Gallery</Text>
                    </View>
                </View>
                <View style={[{paddingTop:30, paddingBottom: 30, paddingLeft: 15, paddingRight: 15}]}>
                    <View style={[styles.profileVideoManagement, globalStyles.row]}>
                    {videoArray.length > 0 
                        ? (
                            <>
                            {videoArray.map((video:any, index:number) => {
                                return (
                                    <View style={[globalStyles.row, styles.galleryCards]} key={index}>
                                        <View style={[styles.galleryImage]}>
                                            <TouchableOpacity onPress={()=>videoNav(video.video_url)} >
                                                <View style={[globalStyles.centered, {position: 'relative'}]}>
                                                    <Image 
                                                        style={[{width: '100%', height: '100%'}]}
                                                        source={{
                                                            uri: video.thumbnail
                                                            ? video.thumbnail
                                                            : `${Config.IMAGE_CLOUDFRONT_URL}/dev/dummy/default-thumbnail-${Number(video.id)%7}.jpg`
                                                        }}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={[globalStyles.column, globalStyles.centered, {marginLeft:10, alignItems: "flex-start"}]}>
                                            <Text allowFontScaling={false} style={{color: colors.white, marginBottom:8}}>{video.title}</Text>
                                            <Text allowFontScaling={false} style={{color: colors.white, marginBottom:8}}>{video.created_at.split("T")[0]}</Text>
                                            {/* <Text allowFontScaling={false} style={{color: colors.white, marginBottom:8}} >20min</Text> */}
                                            <Text allowFontScaling={false} style={{color: colors.white, marginBottom:8, flexWrap: 'wrap', width: 225}}>
                                                {
                                                    video.content ? video.content.slice(0, MAX_CHARACTERS) + (video.content.length > MAX_CHARACTERS ? '...' : '')
                                                    : 'No description'
                                                }
                                            </Text>
                                        </View>
                                    </View>
                                )
                            })}
                            </>
                        ) 
                        : (
                            <View style={[globalStyles.centered, {width: '100%', padding: 20}]}>
                                <Text allowFontScaling={false} style={{color: colors.white}}>No videos</Text>
                            </View>
                        )
                    }
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    backButtonContainer: {
        height: 50,
        marginRight: 10,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    profileHeader: {
        height: Platform.OS === 'ios' ? 130 : 80,
        paddingTop: Platform.OS === 'ios' ? 50 : 24,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        backgroundColor: colors.black80,
    },
    profileText: {
        fontSize: 18,
    },
    profileVideoManagement: {
        borderRadius: 10,
        backgroundColor: colors.black80,
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        marginBottom: 40,
    },
    galleryCards: {
        backgroundColor: colors.black10,
        marginTop: 8,
        marginRight: 4,
        marginLeft: 8,
        marginBottom: 4,
    },
    galleryImage: {
        width: 105,
        height: 175,
        borderRadius: 10,
        overflow: 'hidden',
    },
});