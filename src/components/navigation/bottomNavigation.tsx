import React from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableHighlight, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { globalStyles } from '../../styles/global';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScreenProps } from '../../models/navigation.model';
import { GradientButton } from '../gradientButton';
import { colors } from '../../styles/colors';

export const BottomNavigation = ({ navigation }: ScreenProps) => {
    const [showMenu, setShowMenu] = React.useState(false);

    return (
        <View style={[globalStyles.fill, globalStyles.centered]}>
            <View style={[styles.tabBarStyles]}>
                <TouchableHighlight 
                    style={[styles.navButtons]}
                    onPress={() => navigation.navigate('Feed')}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={["#123034", "#09616a"]}
                        style={[styles.linearGradient, globalStyles.verticalCenter]}
                    >
                        <Icon
                            name="pulse"
                            size={35}
                            style={[styles.tabIcons, {position: 'relative', top: 10, right: 10}]}
                        />
                    </LinearGradient>
                </TouchableHighlight >
                <TouchableHighlight 
                    style={[styles.navButtons, {justifyContent: 'flex-end'}]}
                    onPress={() => navigation.navigate('Chat')}
                >
                    <LinearGradient
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        colors={["#123034", "#09616a"]}
                        style={[styles.linearGradient, globalStyles.verticalCenter]}
                    >
                        <Icon
                            name="comment-multiple-outline"
                            size={30}
                            style={[styles.tabIcons, {position: 'relative', top: 15, left: 5}]}
                        />
                    </LinearGradient>
                </TouchableHighlight >
                <View style={styles.verticalLine}/>
            </View>
            
            <View style={[globalStyles.horizontalCenter, styles.circle]}>
                <TouchableOpacity
                    onPress={() => {
                        setShowMenu(!showMenu);
                    }}
                >
                    <View style={[styles.circleButton, globalStyles.noShadow]}>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={["#123034", "#09616a", "#123034"]}
                            style={styles.linearGradientCircle}
                        >
                            <Icon
                                name="plus"
                                size={46}
                                style={[styles.tabIcons, globalStyles.verticalCenter, globalStyles.horizontalCenter, {position: 'relative', left: 3, top: 3}]}
                            />
                        </LinearGradient>
                    </View>
                </TouchableOpacity>
            </View>

            {showMenu && (
                <View style={[globalStyles.container, globalStyles.centered, styles.menuContainer]}>
                    <GradientButton label="Start a Live Stream" icon="access-point" onPress={() => navigation?.navigate('Stream')}></GradientButton>
                    {/* <View style={[globalStyles.row, {marginVertical: 20}]}> 
                        <View style={[globalStyles.fill, globalStyles.column, {marginLeft: -20}]}>
                            <View style={[globalStyles.fill, {borderBottomWidth: 1, borderBottomColor: colors.white }]}></View>
                            <View style={[globalStyles.fill]}></View>
                        </View>
                        <Text allowFontScaling={false} style={{color: colors.white, marginHorizontal: 20}}>
                            Or
                        </Text>
                        <View style={[globalStyles.fill, globalStyles.column, {marginRight: -20}]}>
                            <View style={[globalStyles.fill, {borderBottomWidth: 1, borderBottomColor: colors.white }]}></View>
                            <View style={[globalStyles.fill]}></View>
                        </View>
                    </View>
                    <GradientButton label="Record a Video" icon="camera" color="orange" onPress={() => navigation?.navigate('Record')}></GradientButton> */}
                </View>
            )}
            
        </View>
    );
};

var styles = StyleSheet.create({
    tabBarStyles: {
        position: 'absolute',
        bottom: 0,
        display: 'flex',
        flexDirection: 'row',
        height: 60,
        width: '100%',
    },
    navButtons: {
        position: 'relative',
        width: '50%',
        elevation: 2,
    },
    linearGradient: {
        height: '100%',
        width: '100%',
        position: 'relative',
    },
    verticalLine:{ 
        position: 'absolute',
        bottom: 0,
        left: '50%',
        height: '50%',
        width: 1,
        backgroundColor: '#FFFFFF',
        elevation: 10,
    },

    tabIcons: {
        flex: 1,
        color: "#FFFFFF",
    },
    circle: {
        position: "absolute",
        width: 72,
        height: 72,
        borderRadius: 36,
        shadowColor: 'transparent',
        bottom: 20,
        overflow: 'hidden',
        elevation: 10,
    },
    circleButton: {
        width: 56,
        height: 56,
        borderRadius: 30,
        backgroundColor: 'transparent',
        alignSelf: 'center',
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        elevation: 5,
    },
    linearGradientCircle: {
        backgroundColor: 'transparent',
        height: 56,
        width: 56,
    },
    menuContainer: {
        position: 'absolute',
        bottom: 130,
        width: 250,
    }
});