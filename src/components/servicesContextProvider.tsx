import React, { createContext, useMemo, useState } from 'react';
import { ChatService } from '../services/chat.service';
import { useAuthContext } from '../hooks/useAuthContext';
import { WebSocketService } from '../services/websocket.service';
import { FetchService } from '../services/fetch.service';
import { AuthenticationService } from '../services/authentication.service';
import { ChannelService } from '../services/channel.service';
import { UploadService } from '../services/upload.service';
import { UserProfileService } from '../services/userProfile.service';
import { ActivityFeedService } from '../services/activityFeed.service';

export const ServicesContext = createContext<Services>({} as Services);

interface ServicesContextProviderProps {
  children: any
}

export interface Services {
    fetchService: FetchService;
    webSocketService: WebSocketService;
    chatService: ChatService;
    authenticationService: AuthenticationService;
    channelService: ChannelService;
    uploadService: UploadService;
    userProfileService: UserProfileService;
    activityFeedService: ActivityFeedService;
}

export const ServicesContextProvider = ({ children }: ServicesContextProviderProps) => {
    const authContext = useAuthContext();

    const services: Services = useMemo(() => {
        services?.webSocketService?.closeConnection();

        const webSocketService = new WebSocketService(authContext);
        const fetchService = new FetchService(authContext)
        return {
            fetchService,
            webSocketService,
            chatService: new ChatService(authContext, fetchService, webSocketService),
            authenticationService: new AuthenticationService(fetchService),
            channelService: new ChannelService(authContext, fetchService),
            uploadService: new UploadService(authContext, fetchService),
            userProfileService: new UserProfileService(fetchService),
            activityFeedService: new ActivityFeedService(fetchService)
        }
    }, [authContext]);

  return (
    <ServicesContext.Provider value={services}>
      { children }
    </ServicesContext.Provider>
  );
}
