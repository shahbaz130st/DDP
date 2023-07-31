import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { ScreenProps } from '../../models/navigation.model';

import { useAuthContext } from '../../hooks/useAuthContext';

import { Config } from '../../config/config';
import { globalStyles } from '../../styles/global';
import { colors } from '../../styles/colors';

import { GradientButton } from '../../components/gradientButton';
import { UserAvatar } from '../../components/shared/userAvatar';
import { UserProfile } from '../../models/user.model';
import { useServices } from '../../hooks/useServices';
import { useLoading } from '../../hooks/useLoading';

export function UserProfileScreen({ route, navigation }: ScreenProps) {
    const authContext = useAuthContext();
    const { authenticationService, userProfileService } = useServices();
    const setLoading = useLoading();

    const profileId = route.params?.['profileId'];
    const [myProfile, setMyProfile] = React.useState<any>(authContext?.authData?.userProfile); // checks current logged in user
    const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
    const [videoArray, setVideoArray] = React.useState<any>([]);

    // React useEffect to update height and width on screen rotation
    React.useEffect(() => {
        setLoading(true);
        const getMyProfile = async () => {
            if (!myProfile) return;

            try {
                const userProfile = await authenticationService.getUserProfile();
                setMyProfile(userProfile.user);
            } catch {
                Alert.alert('Error', 'Unable to get user profile');
                setLoading(false);
                navigation.goBack();
            }
        }

        const callProfileUser = () => {
            userProfileService.get(profileId).then((userData) => {
                setVideoArray(userData.videos);
                setUserProfile(userData.profile);
                setLoading(false);
            });
        };

        getMyProfile();
        callProfileUser();
    }, []);

    const logout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [   
                {
                    text: "Cancel",
                    onPress: () => {},
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: async () => {
                        await authenticationService.logout();
                        authContext.logout();

                        navigation?.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    },
                }
            ]
        );

    };

    const videoNav = (videoUri: string) => {
        navigation.navigate('VideoView', { videoUri: videoUri });
    };

    const handleNewChatPress = () => {
        navigation.navigate("FriendList")
    }

    if (!userProfile) {
        return;
    }

    const galleryNav = () => {
        navigation.navigate('GalleryView', { profileId: userProfile?.user?.id });
    };

    // user profile matches current logged in auth user
    const sameProfile = myProfile.id === userProfile?.user?.id;
    return (
        <ScrollView style={{marginBottom: 55}}>
            <View style={[globalStyles.fill]}>
                <View style={[styles.profileContainer]}>
                    <View style={[styles.profileHeader, {alignItems:'center', alignContent:'center'}]}>
                        {sameProfile 
                            ? (
                                <>
                                    <View style={styles.backButtonContainer}>
                                        <TouchableOpacity onPress={() => navigation.goBack()}>
                                            <Icon name="chevron-left" size={40} style={{color: colors.white}}></Icon>
                                        </TouchableOpacity>
                                    </View>
                                    <Text allowFontScaling={false} style={[globalStyles.textWhite, styles.profileTitle]}>My Profile</Text>
                                    {/* <View>
                                        <TouchableWithoutFeedback onPress={()=>console.log('settings')}>
                                            <Icon name="cog" size={18} style={{color: colors.white}} />
                                        </TouchableWithoutFeedback>
                                    </View> */}
                                </>
                            )
                            : (
                                <>
                                    <View style={styles.backButtonContainer}>
                                        <TouchableOpacity onPress={() => navigation.goBack()}>
                                            <Icon name="chevron-left" size={40} style={{color: colors.white}}></Icon>
                                        </TouchableOpacity>
                                    </View>
                                    <Text allowFontScaling={false} style={[globalStyles.textWhite]}>{userProfile.user.firstName} {userProfile.user.lastName}'s Profile</Text>
                                </>
                            )
                        }
                    </View>
                </View>
                <View style={[{paddingTop:30, paddingBottom: 30, paddingLeft: 15, paddingRight: 15}]}>
                    {sameProfile
                        ? (
                            <>
                            <View style={[styles.profileData, {marginBottom: 30}]}>
                                <TouchableOpacity onPress={() => navigation.navigate('UpdateProfileImage')}>
                                    <UserAvatar size={100} user={userProfile.user} />
                                </TouchableOpacity>
                                <View style={[{paddingLeft: 30, justifyContent: 'center'}]}>
                                    {/* <GradientButton label="Create Post" onPress={()=>{navigation.navigate('CreatePost')}} style={{marginBottom: 15}}></GradientButton> */}
                                    <GradientButton label="View Friends" color={"purple"} onPress={handleNewChatPress}></GradientButton>
                                </View>
                            </View>
                            <View style={[styles.profileFooter, {justifyContent:"space-around"}]}>
                                <View style={[globalStyles.centered]}>
                                    <Text allowFontScaling={false} style={[globalStyles.textWhite]}>0</Text>
                                    <Text allowFontScaling={false} style={[globalStyles.textWhite]}>Subscribers</Text>
                                </View>
                                <View style={[styles.verticalDivider]}></View>
                                <View style={[globalStyles.centered]}>
                                    <Text allowFontScaling={false} style={[globalStyles.textWhite]}>0</Text>
                                    <Text allowFontScaling={false} style={[globalStyles.textWhite]}>Followers</Text>
                                </View>
                                <View style={[styles.verticalDivider]}></View>
                                <View style={[globalStyles.centered]}>
                                    <Text allowFontScaling={false} style={[globalStyles.textWhite]}>0</Text>
                                    <Text allowFontScaling={false} style={[globalStyles.textWhite]}>Subscriptions</Text>
                                </View>
                            </View>
                            </>
                        )
                        : (
                            <>
                            <View style={[styles.profileData, globalStyles.centered, {marginBottom: 12}]}>
                                <TouchableOpacity onPress={() => navigation.navigate('Profile', {profileId: userProfile.user.id})}>
                                    <UserAvatar size={150} user={userProfile.user}/>
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <View style={[globalStyles.centered, styles.profileFooter2]}>
                                    <View style={[globalStyles.row]}>
                                        <Text allowFontScaling={false} style={{color: colors.white}}>{userProfile.user?.firstName} {userProfile.user?.lastName}</Text>
                                    </View>
                                </View>
                            </View>
                            </>
                        )
                    }
                    <View style={[styles.profileInfo]}>
                        {sameProfile && 
                        (
                            <View style={[globalStyles.row, {marginBottom: 12}]}>
                                <Text allowFontScaling={false} style={{color: colors.black}}>Name:&nbsp;</Text>
                                <Text allowFontScaling={false} style={{color: colors.black}}>{userProfile.user?.firstName} {userProfile.user?.lastName}</Text>
                            </View>
                        )}
                        
                        <View style={[globalStyles.row, {marginBottom: 12}]}>
                            <Text allowFontScaling={false} style={{color: colors.black}}>Location:&nbsp;</Text>
                            <Text allowFontScaling={false} style={{color: colors.black}}>{[userProfile.medicalLicense?.city, userProfile.medicalLicense?.stateOfLicense].join(", ")}</Text>
                        </View>
                        <View style={[globalStyles.row]}>
                            <Text allowFontScaling={false} style={{color: colors.black}}>Specialty:&nbsp;</Text>
                            <Text allowFontScaling={false} style={{color: colors.black}}>{userProfile.medicalLicense?.title}</Text>
                        </View>
                    </View>

                    <View style={[styles.profileViewUploads, globalStyles.row]}>
                        <Text allowFontScaling={false} style={[globalStyles.textWhite, {paddingLeft:12}]}>Uploads</Text>
                        <GradientButton label="View More Uploads" onPress={()=>galleryNav()}></GradientButton>
                    </View>

                    <View style={[styles.profileVideoManagement, globalStyles.row]}>
                        {videoArray.map((video:any, index:number) => {
                            return (
                                <View style={[styles.videoCards]} key={index}>
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
                                            <View style={[styles.videoCardText]} pointerEvents="box-none">
                                                <Text allowFontScaling={false} style={[globalStyles.textWhite, {fontSize: 12, textAlign: 'center'}]}>{video.title}</Text>
                                            </View>
                                            <View style={[styles.videoCardOverlay]} pointerEvents="box-none"></View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                    </View>
                    {sameProfile && (
                        <GradientButton label="Logout" icon="logout" onPress={logout} style={{marginBottom: 15}}></GradientButton>
                    )}
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
    profileContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center'
    },
    profileTitle: {
        flex: 1,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize: 20,
        color: colors.white
    },
    profileHeader: {
        height: Platform.OS === 'ios' ? 130 : 80,
        paddingTop: Platform.OS === 'ios' ? 50 : 24,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 24,
        backgroundColor: colors.black80,
    },
    profileData: {
        paddingLeft: 50,
        paddingRight: 50,
        flexDirection: 'row',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.black10,
    },
    profileImage2: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: colors.black10,
    },
    profileFooter: {
        height: 75,
        borderRadius: 10,
        backgroundColor: colors.black80,
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 5,
        paddingRight: 5,
        marginBottom: 40,
    },
    profileFooter2: {
        borderRadius: 10,
        backgroundColor: colors.black80,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 24,
        paddingRight: 24,
        marginBottom: 12,
    },
    verticalDivider: {
        width: 1,
        borderLeftWidth: 1,
        height: '100%',
        borderColor: colors.white
    },
    profileInfo: {
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 24,
        paddingRight: 24,
        borderRadius: 10,
        backgroundColor: colors.white,
        shadowColor: colors.black60,
        marginBottom: 40,
    },
    profileViewUploads: {
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 10,
        backgroundColor: colors.black80,
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    profileVideoManagement: {
        borderRadius: 10,
        backgroundColor: colors.black80,
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        marginBottom: 40,
    },
    videoCards: {
        width: 105,
        height: 175,
        borderRadius: 10,
        backgroundColor: colors.black10,
        marginTop: 8,
        marginRight: 4,
        marginLeft: 8,
        marginBottom: 4,
        overflow: 'hidden',
    },
    videoCardText: {
        position: 'absolute',
        bottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: colors.black10,
    },
    videoCardOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        backgroundColor: colors.black10,
    },
    center: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
});