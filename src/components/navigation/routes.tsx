import { ChatScreen } from "../../screens/chat/chat.screen";
import { FeedScreen } from "../../screens/feed/feed.screen";
import { LoginScreen } from "../../screens/login/login.screen";
import { RecordScreen } from "../../screens/record/record.screen";
import { VideoView } from "../../screens/record/videoView.screen";
import { RegisterScreen } from "../../screens/register/register.screen";
import { ReviewRegistrationScreen } from "../../screens/registration/reviewRegistration";
import { StreamScreen } from "../../screens/stream/stream.screen";
import { SubmitRecordingScreen } from "../../screens/submitRecording/submitRecordingScreen";
import { VerifyEmail } from "../../screens/verify/verifyEmail.screen";
import { VerifyIdentityScreen } from "../../screens/verify/verifyIdentity.screen";
import { VerifyImageScreen } from "../../screens/verify/verifyImage.screen";
import { VerifyLicenseScreen } from "../../screens/verify/verifyLicense.screen";
import { VerifyPhone } from "../../screens/verify/verifyPhone.screen";
import { UserProfileScreen } from "../../screens/profile/userProfile.screen";
import { CreatePost } from "../../screens/post/createPost.screen";
import { BackgroundTheme } from './screenBackground';
import { FriendsListScreen } from "../../screens/friendsList/friendsList.screen";
import { MessagesScreen } from "../../screens/messages/messages.screen";
import { GalleryScreen } from "../../screens/profile/gallery.screen";
import { ProfileImageScreen } from "../../screens/profile/updateProfileImage.screen";
import { ForgotPasswordScreen } from "../../screens/login/forgotPassword.screen"
import { ResetPasswordScreen } from "../../screens/login/resetPassword.screen";

export const AuthenticatedRoutes: AppRoute[] = [
    {
        name: 'Feed',
        title: 'Feed',
        component: FeedScreen,
        options: { 
            backgroundTheme: BackgroundTheme.Blue,
            showBottomNav: true
        }
    },{
        name: 'Chat',
        title: 'Chat',
        component: ChatScreen,
        options: { 
            backgroundTheme: BackgroundTheme.Purple,
            showBottomNav: true 
        }
    },{
        name: 'Messages',
        component: MessagesScreen,
        options: {
            backgroundTheme: BackgroundTheme.Purple,
            showBottomNav: false
        }
    },{
        name: 'Stream',
        component: StreamScreen,
        options: {
            backgroundTheme: BackgroundTheme.Blue,
        }
    },{
        name: 'Record',
        component: RecordScreen,
        options: {
        }
    },{
        name: 'SubmitRecording',
        title: '1',
        component: SubmitRecordingScreen,
        options: {
        }
    },{
        name: 'Profile',
        component: UserProfileScreen,
        options: {
            backgroundTheme: BackgroundTheme.Blue,
            showBottomNav: true,
        }
    },{
        name: 'UpdateProfileImage',
        component: ProfileImageScreen,
        options: {
            backgroundTheme: BackgroundTheme.Blue,
            showBottomNav: false,
        }
    },{
        name: 'FriendList',
        component: FriendsListScreen,
        options: {
            backgroundTheme: BackgroundTheme.Pinkish,
            showBottomNav: true,
        }
    },{
        name: 'CreatePost',
        component: CreatePost,
        options: {
            showHeader: true,
            backgroundTheme: BackgroundTheme.Blue,
        }
    },{
        name: 'VideoView',
        title: 'Video View',
        component: VideoView,
        options: {
            backgroundTheme: BackgroundTheme.Purple,
        }
    },{
        name: 'GalleryView',
        title: 'Gallery View',
        component: GalleryScreen,
        options: {
            backgroundTheme: BackgroundTheme.Blue,
        }
    },
]

export  const AnonymouseRoutes: AppRoute[] = [{
        name: 'Login',
        title: 'Log In',
        component: LoginScreen,
        options: {
            showHeader: true,
            backgroundTheme: BackgroundTheme.Green
        }
    },{
        name: 'Register',
        title: 'Register',
        component: RegisterScreen,
        options: {
            showHeader: true, 
            backgroundTheme: BackgroundTheme.Green
        }
    },{
        name: 'VerifyEmail',
        title: 'Verify Email',
        component: VerifyEmail,
        options: {
            showHeader: true,
            backgroundTheme: BackgroundTheme.Green
        }
    },{
        name: 'VerifyPhone',
        title: 'Verify Phone Number',
        component: VerifyPhone,
        options: {
            showHeader: true,
            backgroundTheme: BackgroundTheme.Green
        }
    },{
        name: 'VerifyIdentityImage',
        title: 'Verify Identity',
        component: VerifyImageScreen,
        options: {
            showHeader: true,
            backgroundTheme: BackgroundTheme.Green
        }
    },{
        name: 'VerifyIdentity',
        title: 'Verify Identity',
        component: VerifyIdentityScreen,
        options: {
            showHeader: true,
            backgroundTheme: BackgroundTheme.Green
        }
    },{
        name: 'ProfileImage',
        title: 'Profile Image',
        component: ProfileImageScreen,
        options: {
            showHeader: true,
            backgroundTheme: BackgroundTheme.Green
        }
    },{
        name: 'VerifyLicenseImage',
        title: 'Verify Medical License',
        component: VerifyImageScreen,
        options: {
            showHeader: true,
            backgroundTheme: BackgroundTheme.Green
        }
    },{
        name: 'VerifyLicense',
        title: 'Verify Medical License',
        component: VerifyLicenseScreen,
        options: {
            showHeader: true,
            backgroundTheme: BackgroundTheme.Green
        }
    },{
        name: 'ReviewRegistration',
        title: 'Review User Profile',
        component: ReviewRegistrationScreen,
        options: {
            showBackButton: false,
            showHeader: true,
            backgroundTheme: BackgroundTheme.Green
        }
    },{
        name: 'ForgotPassword',
        title: 'Forgot Password',
        component: ForgotPasswordScreen,
        options: {
            showHeader: true, 
            backgroundTheme: BackgroundTheme.Green
        }
    },{
        name: 'ResetPassword',
        title: 'Reset Password',
        component: ResetPasswordScreen,
        options: {
            showHeader: true, 
            backgroundTheme: BackgroundTheme.Green
        }
    }
];

export interface AppRoute {
    name: string;
    title?: string;
    component: any;
    options?: {
        showBackButton?: boolean;
        showHeader?: boolean;
        showBottomNav?: boolean;
        backgroundTheme?: BackgroundTheme;
    };
}