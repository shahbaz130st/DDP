import React, { useEffect, useState } from "react";
import { ScreenProps } from "../../models/navigation.model";
import { User } from "../../models/user.model";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { globalStyles } from "../../styles/global";
import { colors } from "../../styles/colors";
import LinearGradient from "react-native-linear-gradient";
import { Chat } from "../../models/chat.model";
import { UserAvatar } from "../../components/shared/userAvatar";
import { useServices } from "../../hooks/useServices";
import { useLoading } from "../../hooks/useLoading";

export function FriendsListScreen({ navigation }: ScreenProps) {
    const [friends, setFriends] = useState<Partial<User>[]>([])
    const [chats, setChats] = useState<Chat[]>([])
    const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null)

    const { chatService } = useServices();
    const setLoading = useLoading();

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            const friends: Partial<User>[] = await chatService.getFriends();
            const chats = await chatService.getChats();
            setFriends(friends);
            setChats(chats);
            setLoading(false);
        }

        try {
            getData();
        } catch (e) {}
    }, []);

    const handleCreateChat = async (userId: number) => {
        setLoading(true);
        const existingChat = chats.find(c => c.userIds[0] === userId);
        if (existingChat) return navigation.navigate('Messages', { chatId: existingChat.id });
        
        const newChatId = await chatService.create([userId]);
        navigation.navigate('Messages', {chatId: newChatId});
        setLoading(false);
    };

    const renderHeader = () => (
        <View style={[globalStyles.row, globalStyles.centered, styles.container]}>
            <Text allowFontScaling={false} style={[styles.title]}>Friends List</Text>
            {/* <TouchableOpacity style={[{width: 60}]} onPress={() => {}}>
                <View style={[globalStyles.fill, globalStyles.centered]}>
                    <Icon name="magnify" size={26} style={{color: colors.white}} />
                </View>
            </TouchableOpacity> */}
            <View style={styles.backButtonContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="chevron-left" size={40} style={{color: colors.white}}></Icon>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderFriendsListItem = ({item, index}: {item: Partial<User>, index: number}) => {
        const userName = `${item.firstName} ${item.lastName}`;

        return (
            <TouchableOpacity onPress={() => setSelectedFriendId(item.id!)}>
                <View style={[styles.friendsListItem, globalStyles.row, {marginTop: index == 0 ? 20 : 0, overflow: 'hidden'}]}>
                    {selectedFriendId === item.id &&
                        <LinearGradient style={globalStyles.absoluteFill}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            colors={['#b38095','#825467']}
                        />
                    }

                    <View style={{paddingRight: 20}}>
                        <UserAvatar size={40} user={item}></UserAvatar>
                    </View>
                    <View style={[globalStyles.fill, globalStyles.column]}>
                        <Text allowFontScaling={false} style={[globalStyles.fill, {fontSize: 14, fontWeight: 'bold', textAlignVertical: 'center'}]} numberOfLines={1} ellipsizeMode='tail'>
                            {userName}
                        </Text>
                        {selectedFriendId === item.id && 
                            <View style={[globalStyles.row, {justifyContent: 'flex-end', marginTop: 10}]}>
                                <TouchableOpacity style={[styles.itemButton, {backgroundColor: '#20a0d8'}]} onPress={() => navigation.navigate('Profile', {profileId: item.id})}>
                                    <Text>View Profile</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.itemButton, {backgroundColor: '#46237a'}]} onPress={() => handleCreateChat(item.id!)}>
                                    <Text>Message</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                </View> 
            </TouchableOpacity>
        )
    };
    
    const renderFriendsList = () => (
        <View style={[globalStyles.fill]}>
            <FlatList style={[{padding: 20, paddingBottom: 0, paddingTop: 0}]} data={friends} renderItem={renderFriendsListItem}></FlatList>
        </View>
    );

    return (
        <View style={[globalStyles.fill, {paddingBottom: 60}]}>
            {renderHeader()}
            {renderFriendsList()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: Platform.OS === 'ios' ? 130 : 80,
        paddingTop: Platform.OS === 'ios' ? 50 : 0,
        paddingLeft: 80,
        paddingHorizontal: 40,
        backgroundColor: colors.black60
    },
    title: {
        flex: 1,
        textAlignVertical: 'center',
        fontSize: 20,
        color: colors.white,
        marginLeft: 10
    },
    friendsListItem: {
        borderRadius: 10,
        marginBottom: 20,
        padding: 10,
    },
    itemButton: {
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginLeft: 10
    },
    backButtonContainer: {
        position: 'absolute', 
        top: Platform.OS === 'ios' ? 50 : 0, 
        left: 20, 
        height: '100%', 
        justifyContent: 'center',
    },
})