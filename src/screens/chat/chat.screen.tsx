import React, { useEffect, useState } from 'react';
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { globalStyles } from '../../styles/global';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Chat, ChatMessage } from '../../models/chat.model';
import { colors } from '../../styles/colors';
import { User } from '../../models/user.model';
import { FormatDateShortMonthDate } from '../../utils/datetime';
import LinearGradient from 'react-native-linear-gradient';
import { ScreenProps } from '../../models/navigation.model';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { UserAvatar } from '../../components/shared/userAvatar';
import { useServices } from '../../hooks/useServices';
import { useLoading } from '../../hooks/useLoading';

export function ChatScreen({ navigation }: ScreenProps) {
    const authContext = useAuthContext(); 
    const { chatService } = useServices();
    const setLoading = useLoading();

    const [chats, setChats] = useState<Chat[]>([]);
    const [chatMessages, setChatMessages] = useState<{[chatId: number]: ChatMessage}>([]);
    const [friends, setFriends] = useState<{[id: number]: Partial<User>}>({});

    const sortChats = (a: Chat, b: Chat) => {
        const aDate = chatMessages[a.id]?.createdAt.getTime() ?? 0;
        const bDate = chatMessages[b.id]?.createdAt.getTime() ?? 0;
        return bDate - aDate;
    }

    useEffect(() => {
        const refreshAndSortChats = async () => {
            let newChats = [...chats];

            if (Object.keys(chatMessages).map(Number).some(chatId => !chats.find(c => c.id === chatId)))
                newChats = await chatService.getChats();

            setChats(newChats.sort(sortChats));
        }

        refreshAndSortChats();
    }, [chatMessages])

    const handleNewMessage = async (message: ChatMessage) => {
        setChatMessages((current) => ({...current, [message.chatId]: message}));
    };

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true);
                const chatsList = await chatService.getChats();
                const messages: {[id: number]: ChatMessage} = {};
                let promises: Promise<any>[] = [chatService.getFriends()];
                promises = promises.concat(chatsList.map(async c => {
                    const chatMessages = await chatService.getMessages(c.id, 1, 1);
                    if (chatMessages?.length) messages[c.id] = chatMessages[0];
                }));

                const friendsList: Partial<User>[] = (await Promise.all(promises))[0];
                const friendsMap = friendsList.reduce<{[id: number]: Partial<User>}>((result, item) => {
                    if (!!item.id) result[item.id] = item;
                    return result;
                }, {});
                
                setFriends(friendsMap);
                setChatMessages(messages)
                setChats(chatsList);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        };

        const messageSub = chatService.subscribeToMessages((message) => handleNewMessage(message));
        const chatSub = chatService.subscribeToChats((chat) => getData());
        getData();
        
        return () => {
            messageSub?.unsubscribe();
            chatSub?.unsubscribe();
        }
    }, []);

    // const handleSearchPress = () => {
        
    // }

    const handleNewChatPress = () => {
        navigation.navigate("FriendList")
    }

    const handleChatPress = (chatId: number) => {
        navigation.navigate('Messages', { chatId });
    }

    const renderHeader = () => (
        <View style={[globalStyles.row, globalStyles.centered, styles.container]}>
            <Text allowFontScaling={false} style={[styles.title]}>Messaging</Text>
            {/* <TouchableOpacity style={[{width: 60}]} onPress={handleSearchPress}>
                <View style={[globalStyles.fill, globalStyles.centered]}>
                    <Icon name="magnify" size={26} style={{color: colors.white}} />
                </View>
            </TouchableOpacity> */}
            <TouchableOpacity style={[{width: 60}]} onPress={handleNewChatPress}>
                <View style={[globalStyles.fill, globalStyles.centered]}>
                    <Icon name="message-plus-outline" size={26} style={{color: colors.white}} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={[{width: 60}]} onPress={() => navigation.navigate('Profile', {profileId: authContext.authData.userProfile!.user.id})}>
                <View style={[globalStyles.fill, globalStyles.centered]}>
                    <UserAvatar user={authContext.authData.userProfile!.user} size={40} />
                </View>
            </TouchableOpacity>
        </View>
    );

    const renderChatListItem = ({item, index}: {item: Chat, index: number}) => {
        const userIds = item.userIds?.filter(userId => userId !== authContext.authData.userProfile?.user.id)
        if (!userIds || !friends[userIds[0]]) return null;

        const userNames = userIds
            ?.map(userId => `${friends[userId]?.firstName} ${friends[userId]?.lastName}`)
            .join(', ');

        return (
            <TouchableOpacity onPress={() => handleChatPress(item.id)}>
                <View style={[styles.chatListItem, globalStyles.row, {marginTop: index == 0 ? 20 : 0, overflow: 'hidden'}]}>
                    <LinearGradient style={globalStyles.absoluteFill}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        colors={['#9d81ae','#7d5a95']}
                    />

                    <View style={{paddingHorizontal: 10}}>
                        <UserAvatar size={40} user={friends[userIds[0]]}></UserAvatar>
                    </View>
                    <View style={[globalStyles.fill, globalStyles.column]}>
                        <Text allowFontScaling={false} style={{fontSize: 14, fontWeight: 'bold'}} numberOfLines={1} ellipsizeMode='tail'>
                            {userNames}
                        </Text>
                        <Text allowFontScaling={false} style={globalStyles.fill} numberOfLines={1} ellipsizeMode='tail'>
                            {chatMessages[item.id]?.text}
                        </Text>
                    </View>
                    <View style={[{width: 60, justifyContent: 'flex-end'}]}>
                        <Text allowFontScaling={false} style={{textAlign: 'right'}}>
                            {chatMessages[item.id] && FormatDateShortMonthDate(chatMessages[item.id].createdAt)}
                        </Text>
                    </View>
                </View> 
            </TouchableOpacity>
        )
    };

    const renderChatList = () => (
        <View style={[globalStyles.fill]}>
            <FlatList style={[{padding: 20, paddingBottom: 0, paddingTop: 0}]} data={chats} renderItem={renderChatListItem}></FlatList>
        </View>
    );

    return (
        <View style={[globalStyles.fill, {paddingBottom: 60}]}>
            {renderHeader()}
            {renderChatList()}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        height: Platform.OS === 'ios' ? 130 : 80,
        paddingTop: Platform.OS === 'ios' ? 50 : 0,
        paddingHorizontal: 40,
        backgroundColor: colors.black60
    },
    title: {
        flex: 1,
        textAlignVertical: 'center',
        textAlign: 'left',
        fontSize: 20,
        color: colors.white
    },
    chatListItem: {
        borderRadius: 10,
        marginBottom: 20,
        padding: 10,
    },
})