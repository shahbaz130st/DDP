import { View, StyleSheet, Platform, Text } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator  } from '@react-navigation/native-stack';

import { useAuthContext } from '../../hooks/useAuthContext';
import { colors } from '../../styles/colors';
import { MainHeader } from './header';
import { AnonymouseRoutes, AppRoute, AuthenticatedRoutes } from './routes';
import { ScreenBackground } from './screenBackground';
import { BottomNavigation } from './bottomNavigation';
import { RegistrationContextProvider } from '../registrationContextProvider';
import { useServices } from '../../hooks/useServices';
import { globalStyles } from '../../styles/global';
import { useLoading } from '../../hooks/useLoading';
import { LoadingContextProvider } from '../loadingContextProvider';
import { LoadingIndicator } from '../shared/loadingIndicator';

const Stack = createNativeStackNavigator ();

export const Navigation = () => {
    const authContext = useAuthContext();
    const navigation = useRef<any>(null);
    const [currentRoute, setCurrentRoute] = useState<AppRoute | undefined>();
    
    const { authenticationService } = useServices();
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        if (authContext.isLoggedOut) {
            return navigation.current?.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }
        
        const { authToken, userProfile } = authContext.authData;
        if (userProfile || !authToken) return;
        const getUserProfile = async () => {
            try {
                setLoading(true)
                const userProfile = await authenticationService.getUserProfile();
                authContext.login({ authToken, userProfile });
                setLoading(false);
            } catch (e){
                // MUST logout to get rid of authToken otherwise setLoading will activate react state
                authContext.logout();
                setLoading(false);
            }
        }

        getUserProfile();
    }, [authContext]);

    useEffect(() => {

        const checkAuth = async () => {
            if (authContext.isAuthenticated) return;
            
            setLoading(true);
            const authToken = await AsyncStorage.getItem("authToken"); 
            if (!authToken) {
                setLoading(false)
                return;
            }
            
            authContext.login({ authToken });
        };

        checkAuth();
    }, []);

    const handleNavigation = (routeName: string) => {
        const newRoute = (authContext.isAuthenticated
            ? AuthenticatedRoutes
            : AnonymouseRoutes).find(r => r.name === routeName);
        setCurrentRoute(newRoute);
    };

    const renderStackNavigator = () => {
        return (
            <Stack.Navigator screenOptions={{headerShown: false, animation: 'slide_from_bottom', orientation: 'portrait_up'}}>
                {authContext.isAuthenticated
                    ? AuthenticatedRoutes.map(route =>
                        (<Stack.Screen name={route.name} component={route.component} key={route.name} />))
                
                    : AnonymouseRoutes.map(route =>
                        (<Stack.Screen name={route.name} component={route.component} key={route.name} />))
                }
            </Stack.Navigator>)
    };

    return (
        <LoadingContextProvider setLoading={setLoading}>
            <NavigationContainer ref={navigation} 
                theme={{...DefaultTheme, colors: {...DefaultTheme.colors, background: 'transparent'}}}
                onReady={() => handleNavigation(navigation.current?.getCurrentRoute().name)}
                onStateChange={async () => handleNavigation(navigation.current?.getCurrentRoute().name)}
            >

                    <ScreenBackground backgroundTheme={currentRoute?.options?.backgroundTheme}></ScreenBackground>

                    {currentRoute?.options?.showHeader &&
                        <MainHeader title={currentRoute?.title} navigation={navigation.current} showBackButton={currentRoute?.options?.showBackButton}/>
                    }
                    
                    {authContext.isAuthenticated
                    
                        ? renderStackNavigator()
                        
                        : (
                            <RegistrationContextProvider>
                                {renderStackNavigator()}    
                            </RegistrationContextProvider>
                        )
                    }

                    {currentRoute?.options?.showBottomNav && 
                        <View>
                            <BottomNavigation navigation={navigation.current} route={{}}></BottomNavigation>
                        </View>
                    }

            </NavigationContainer>
            
            {loading &&
                <LoadingIndicator />
            }
        </LoadingContextProvider>
    );
};

const styles = StyleSheet.create({
    logoutButton: {
        position: 'absolute',
        right: 10,
        top: Platform.OS === 'ios' ? 40 : 10,
        backgroundColor: colors.black60,
        padding: 10,
        borderRadius: 5
    },
    logoutIcon: {
        flex: 1,
        color: colors.white,
    },
});