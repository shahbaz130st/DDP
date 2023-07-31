import React from 'react';
import { View, Text, TouchableWithoutFeedback, FlatList, Dimensions, StyleSheet, Platform, ActivityIndicator, Animated } from 'react-native';
import Video, { LoadError } from "react-native-video";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused } from '@react-navigation/native';

import { UserAvatar } from '../../components/shared/userAvatar';

import { globalStyles } from '../../styles/global';
import { colors } from '../../styles/colors';

import { ScreenProps } from '../../models/navigation.model';
import { useServices } from '../../hooks/useServices';
import { useLoading } from '../../hooks/useLoading';

export interface VideoProps {
    id: number,
    user_id: number,
    profile_name: string,
    profile_first_name: string,
    profile_last_name: string,
    profile_image?: string,
    profile_title: string,
    title: string,
    content: string,
    url: string,
    followed: boolean,
    stream: number,
    video: number,
    views: number,
    date: string,
    buffering?: boolean,
}
export interface PostsProps {
    item: VideoProps;
    index: number;
    videoIndex?: number;
    pause?: boolean,
}

export function FeedScreen({ navigation }: ScreenProps) {
    const isFocused = useIsFocused();
    const { activityFeedService } = useServices();
    const setLoading = useLoading();
    // create state for height and width to calculate dimentions on screen rotation
    const [height, setHeight] = React.useState(Dimensions.get('window').height);
    const [width, setWidth] = React.useState(Dimensions.get('window').width);

    const [paused, setPaused] = React.useState(true);
    const [volume, setVolume] = React.useState(Platform.OS === 'ios' ? 0 : 1);
    const [buffering, setBuffering] = React.useState({} as any);

    const [videoChanged, setVideoChanged] = React.useState(false);
    const fadeAnim = React.useRef(new Animated.Value(1)).current; 

    const setPlayPause = (index:number) => {
        // TODO: move play/pause to inside of post
        if (buffering[index]) buffering[index] = false
        setPaused(!paused);
    };

    const setFollow = ({index}: any) => {
        if (videoData === null) return;
        videoData[index].followed = !videoData[index].followed;
        setVideoData(videoData);
        setVideoChanged(!videoChanged);
    };

    const setVolButton = (event:any) => {
        event.stopPropagation();
        setVolume(volume === 0 ? 1 : 0);
    };

    const callVideos = async () => {
        setStaterefresh(true);
        try {
            setLoading(true);
            const feed = await activityFeedService.get();
            setVideoData(feed);
            setStaterefresh(false);
            setLoading(false);
        } catch (e) { }
    };

    const profileNavigate = (item: VideoProps) => {
        navigation.navigate('Profile', {profileId: item.user_id});
    };

    // React useEffect to update height and width on screen rotation
    React.useEffect(() => {
        const updateLayout = () => {
            setHeight(Dimensions.get('window').height);
            setWidth(Dimensions.get('window').width);
        };

        Dimensions.addEventListener('change', updateLayout);
    }, []);

    React.useEffect(() => {
        if (!isFocused) {
            setPaused(true);
            setVolume(0);
        } else {
            setPaused(false);
            setVolume(Platform.OS === 'ios' ? 0 : 1);
        }
    }, [isFocused]);

    React.useEffect(() => {
        if (paused) {
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }
    }, [paused]);

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Do something when the screen is focused
            callVideos();
        });

        return unsubscribe;
    }, [navigation]);

    // create state for video data and index
    const [videoData, setVideoData] = React.useState<Array<VideoProps> | null>(null);
    const [videoIndex, setVideoIndex] = React.useState(0);
    const [staterefresh, setStaterefresh] = React.useState(false);
    const videoError = (error: LoadError) => {
        // console.log(error);
    };

    // styles for posts that require width or height variables
    const post_styles = StyleSheet.create({
        volume_container: {
            position: 'relative',
            top: 40,
            left: width-60,
            elevation: 5,
        },
        volume_icon: {
            width: 45,
            height: 45,
            borderRadius: 22.5,
            backgroundColor: colors.black60,
        },
        live_container: {
            position: 'relative',
            top: 50,
            left: width-60,
            height: 20,
            width: 45,
            elevation: 5,
        },
        post_container: {
            display: 'flex',
            flex: 1,
            height: height,
            width: width,
            backgroundColor: colors.black10,
            position: 'relative',
        },
        post_icon: {
            position: 'absolute',
            top: height/2,
            left: (width-35)/2,
            zIndex: 100
        }
    })

    const PostHeader = React.memo(({item, index}: PostsProps) => {
        const [showDescription, setShowDescription] = React.useState(false)

        return (
            <TouchableWithoutFeedback onPress={(e)=>{
                    e.stopPropagation()}
                }>
                <View style={[styles.postHeader]}>
                    <Text allowFontScaling={false} style={[globalStyles.textCenter, styles.postTitle, globalStyles.textWhite]}>
                        {item.title}
                    </Text>
                    <View style={[globalStyles.row, styles.postProfile]}>
                        <TouchableWithoutFeedback onPress={()=>profileNavigate(item)}>
                            <View style={[{marginRight: 15}]}>
                                <UserAvatar size={45} user={{firstName: item.profile_first_name, lastName: item.profile_last_name, profileImage: item.profile_image}}/>
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={[styles.postProfileDescription, globalStyles.spaceAround]}>
                            <Text allowFontScaling={false} style={[globalStyles.textWhite]}>{item.profile_name}</Text>
                            <Text allowFontScaling={false} style={[globalStyles.textWhite]}>{item.profile_title}</Text>
                        </View>
                        <View style={[styles.postFollow, globalStyles.centered]}>
                            <TouchableWithoutFeedback onPress={()=>setFollow({index})}>
                                <Icon
                                    name={item.followed ? "heart" : "cards-heart-outline"}
                                    size={35}
                                    style={[styles.profileIcon, globalStyles.textRed, {position: 'relative', top: 10}]}
                                />
                            </TouchableWithoutFeedback>
                            <Text allowFontScaling={false} style={[globalStyles.textCenter, globalStyles.textWhite]}>Friend</Text>
                        </View>
                    </View>
                    <TouchableWithoutFeedback onPress={()=>setShowDescription(!showDescription)}>
                        <View style={[{paddingTop: 10, paddingBottom: 15}, globalStyles.row, globalStyles.spaceBetween]}>
                            <Text allowFontScaling={false} style={[globalStyles.textWhite]}>
                                Description:&nbsp;
                                    <Text allowFontScaling={false} style={[globalStyles.bold]}>show more</Text>
                            </Text>
                            <Text allowFontScaling={false} style={[globalStyles.textWhite]}>{item.date.split("T")[0]}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    { 
                        showDescription 
                        ? <View style={[styles.postDescription]}><Text allowFontScaling={false} style={[globalStyles.textWhite]}>{item.content ? item.content : 'No Description'}</Text></View> 
                        : null
                    }
                </View>
            </TouchableWithoutFeedback>
        );
    });

    const VolumeButton = React.memo(({ volume_button }: { volume_button:number }) => {
        return (
            <View style={[post_styles.volume_container]}>
                <TouchableWithoutFeedback onPress={setVolButton}>
                    <View style={[globalStyles.centered, post_styles.volume_icon]}>
                        <Icon name={volume_button === 1 ? "volume-high" : "volume-off"} size={35} style={[globalStyles.textWhite]} />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    });

    const LiveTag = React.memo(({live}:{live:boolean}) => {
        if (!live) return (<></>);
        return (
        <View style={[globalStyles.row, globalStyles.centered, post_styles.live_container]}>
            <View style={[globalStyles.centered]}>
                    <Icon name="circle-medium" size={15} style={[{color: colors.red}]} />
            </View>
            <Text allowFontScaling={false} style={[{fontSize: 12, color: colors.red}]}>LIVE</Text>
        </View>
        )
    });

    const postBufferingHandler = (index: number, buffering: boolean) => {
        setBuffering((prevState: any) => ({
            ...prevState,
            [index]: buffering
        }));
    }

    const Posts = ({ item, index}: PostsProps) => {
        if (buffering[index] === undefined) {
            buffering[index] = true;
        }

        return (
        <View style={[post_styles.post_container]}>
                <TouchableWithoutFeedback onPress={()=>setPlayPause(index)}>
                    <View style={[globalStyles.fill]}>
                        <Video
                            source={{uri: item.url}}
                            style={[globalStyles.video]}
                            onError={videoError}
                            onBuffer={e => {
                                postBufferingHandler(index, e.isBuffering)
                            }}
                            onLoadStart={() => {
                                postBufferingHandler(index, true)
                            }}
                            onLoad={() => {
                                postBufferingHandler(index, false)
                            }}
                            resizeMode='cover'
                            repeat={true}
                            paused={(videoIndex != index) || (paused && videoIndex == index)}
                            volume={volume}
                        />
                        <PostHeader item={item} index={index}></PostHeader>
                        <VolumeButton volume_button={ volume } />
                        <LiveTag live={item.stream === 1}/>
                        {   buffering[index]
                            ? (
                                <View style={[post_styles.post_icon]}>
                                    <ActivityIndicator style={{ transform: [{ scale: 2 }] }} size="large" color="#FFFFFF" />
                                </View>
                            )
                            : (
                                <Animated.View style={[{ opacity: fadeAnim }, post_styles.post_icon]}>
                                    <Icon name={paused ? "play" : "pause"} size={45} style={[globalStyles.textWhite]} />
                                </Animated.View>
                            )   
                        }
                    </View>
                </TouchableWithoutFeedback>
        </View>
    )};


    const onViewableItemsChanged = React.useRef(({ viewableItems }: any) => {
        // Assuming you're using snapToInterval, there will only ever be one item in view at a time
        const firstItem = viewableItems[0];

        // check if video of viewable item is buffering
        if (firstItem) {
          // This item is in view
          setVideoIndex(firstItem.index);
          setPaused(false);
        }
    });

    const onRefresh = () => {
        callVideos()
    };

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50
    };

    return (
        <View style={[globalStyles.fill, globalStyles.centered, {backgroundColor: colors.black80}]}>
            { videoData && 
                <FlatList
                    data={videoData}
                    renderItem={Posts}
                    snapToAlignment="center"
                    decelerationRate={'fast'}
                    snapToInterval={height}
                    viewabilityConfig={viewabilityConfig}
                    onViewableItemsChanged={onViewableItemsChanged.current}
                    onRefresh={onRefresh}
                    refreshing={staterefresh}
                    initialNumToRender={5}
                    maxToRenderPerBatch={2}
                    windowSize={100} // MAXIMUM AMOUNT OF ITEMS TO RENDER
                />
            }
        </View>
    );
};

// create stylesheet
const styles = StyleSheet.create({
    postHeader: {
        postion: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: colors.black80,
        elevation: 2,
        paddingTop: Platform.OS === 'ios' ? 30 : 0,
        paddingLeft: 25,
        paddingRight: 25,
    },
    postTitle: {
        fontSize: 20,
        paddingTop: 15,
        paddingBottom: 20,
    },
    postProfile: {
        marginLeft: 0,
        marginRight: 0,
        paddingBottom: 15,
    },
    postProfileImage: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        marginRight: 15,
        backgroundColor: 'lightgray',
        justifyContent: 'center',
        alignItems: 'center',
    },
    postProfileDescription: {
        flex: 1,
        paddingRight: 15,
    },
    postFollow: {
        width: 45,
        height: 45,
    },
    profileIcon: {
        paddingBottom: 10,
    },
    postDescription: {
        paddingTop: 10,
        paddingBottom: 25,
    }
});