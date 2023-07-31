import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, 
    Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { ScreenProps } from "../../models/navigation.model";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { globalStyles } from "../../styles/global";
import { colors } from "../../styles/colors";
import { Chat, ChatMessage } from "../../models/chat.model";
import { useAuthContext } from "../../hooks/useAuthContext";
import { User } from "../../models/user.model";
import { UserAvatar } from "../../components/shared/userAvatar";
import { FormatTime } from "../../utils/datetime";
import { TextField } from "../../components/textField";
import { useServices } from "../../hooks/useServices";
import { useLoading } from "../../hooks/useLoading";

const pageSize: number = 20;

export function MessagesScreen({navigation, route}: ScreenProps) {
    const authContext = useAuthContext();
    const { chatService } = useServices();
    const setLoading = useLoading();
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [page, setPage] = useState<number>(1);
    const [morePages, setMorePages] = useState<boolean>(true);
    const [friends, setFriends] = useState<{[id: number]: Partial<User>}>({});
    const [messageInput, setMessageInput] = useState('');
    
    const chatId = useMemo(() => route.params?.['chatId'], []);

    const handleNewMessage = (message: ChatMessage) => {
        if (message.chatId !== chatId) return;
        setMessages((current) => [message, ...current])
    };

    useEffect(() => {
        if (!chatId) return navigation.goBack();

        const getData = async () => {
            try {
                setLoading(true);
                const chats = await chatService.getChats();
                const chat = chats.find(c => c.id === chatId);
                if (!chat) throw 'Error';
                const messages = await chatService.getMessages(chatId, pageSize, page);
                
                const friendsList = await chatService.getFriends();
                const friendsMap = friendsList.reduce<{[id: number]: Partial<User>}>((result, item) => {
                    if (!!item.id) result[item.id] = item;
                    return result;
                }, {});
                
                setFriends(friendsMap);
                setMessages(messages);
                setChat(chat);
                setLoading(false);
            } catch (e) { }
        };

        const messageSub = chatService.subscribeToMessages((message) => handleNewMessage(message));
        getData();

        return () => {
            messageSub.unsubscribe();
        };
    }, []);

    const handleSendMessage = () => {
        if (!chat || !messageInput) return;
        chatService.sendMessage(messageInput, chat.id);
        // todo get this from back end, websocket or http
        const message = {
            userId: authContext.authData.userProfile!.user.id,
            chatId: chat.id,
            text: messageInput,
            createdAt: new Date()
        };
        setMessageInput('');
        setMessages([message, ...messages]);
    }

    const loadMoreMessages = async () => {
        if (!morePages) return;
        const nextPage = page + 1;
        const pageMessages = await chatService.getMessages(chatId, pageSize, nextPage);
        setPage(nextPage);
        if (pageMessages.length < pageSize) setMorePages(false);
        if (pageMessages.length) setMessages(messages.concat(...pageMessages))
    }

    const renderHeader = () => {
        if (!chat) return null;

        const userIds = chat.userIds?.filter(userId => userId !== authContext.authData.userProfile?.user.id)
        if (!userIds) return null;

        const userNames = userIds
            ?.map(userId => `${friends[userId]?.firstName} ${friends[userId]?.lastName}`)
            .join(', ');
        return (
            <View style={[globalStyles.row, globalStyles.centered, styles.container]}>
                <View style={[{paddingLeft: 20}]}>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile', {profileId: friends[userIds[0]].id})}>
                        <UserAvatar size={40} user={friends[userIds[0]]} />
                    </TouchableOpacity>
                </View>
                <Text allowFontScaling={false} style={[styles.title]}>{userNames}</Text>
                <View style={styles.backButtonContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="chevron-left" size={40} style={{color: colors.white}}></Icon>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const renderMessageItem = ({item, index}: {item: ChatMessage, index: number}) => {
        const selfMessage = item.userId === authContext.authData.userProfile?.user.id;
        const time = FormatTime(item.createdAt)
        return (
            <View style={[globalStyles.row]} key={index}>
                {selfMessage && 
                    <View style={[globalStyles.fill, {justifyContent: 'flex-end', paddingVertical: 20, minWidth: 60}]}>
                        <Text allowFontScaling={false} style={[styles.timeStampText, {textAlign: 'right'}]}>{time}</Text>
                    </View>
                }
                <View style={[styles.messageContainer, selfMessage ? styles.selfMessage : null, {flexShrink: 1}]}>
                    <Text allowFontScaling={false} style={styles.messageText}>{item.text}</Text>
                </View>
                {!selfMessage && 
                    <View style={[globalStyles.fill, {paddingVertical: 20, justifyContent: 'flex-end', minWidth: 60}]}>
                        <Text allowFontScaling={false} style={styles.timeStampText}>{time}</Text>
                    </View>
                }
            </View>
        )
    };
    
    const renderMessages = () => (
        <View style={[globalStyles.fill]}>
            <FlatList style={[{padding: 20, paddingBottom: 0, paddingTop: 0}]}
                data={messages}
                renderItem={renderMessageItem}
                keyExtractor={(item, index) => String(index)}
                onEndReachedThreshold={0.01}
                onEndReached={() => loadMoreMessages()}
                inverted 
            />
        </View>
    );

    const renderMessageInput = () => {
        return (
            <View style={{padding: 20}}>
                <TextField
                    style={{paddingLeft: 14, paddingRight: 14, paddingTop: 8, paddingBottom: 8, fontSize: 16}}
                    placeholder="Chat here..."
                    value={messageInput} 
                    onChange={value => {setMessageInput(value); return []}}
                    iconButton={{icon: 'send-circle-outline', action: () => handleSendMessage()}}
                /> 
            </View>
        )
    };

    return (chat &&
        <KeyboardAvoidingView
            style={[globalStyles.fill, {justifyContent: 'center', paddingBottom: 0}]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <>
                    {renderHeader()}
                    {renderMessages()}
                    {renderMessageInput()}
                </>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
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
    backButtonContainer: {
        position: 'absolute', 
        top: Platform.OS === 'ios' ? 50 : 0, 
        left: 20, 
        height: '100%', 
        justifyContent: 'center',
    },
    messageContainer: {
        backgroundColor: '#d9d9d9',
        margin: 10,
        padding: 10,
        borderRadius: 10
    },
    selfMessage: {
        backgroundColor: '#93a3f6'
    },
    messageText: {
        color: colors.black
    },
    timeStampText: {
        fontSize: 12
    }
})