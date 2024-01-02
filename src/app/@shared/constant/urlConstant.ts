import { environment } from 'src/environments/environment';

export const urlConstant = {
    Auth: {
        AdminLogin: environment.apiUrl + 'auth/adminLogin',
        AdminLogout: environment.apiUrl + 'auth/adminLogout',
        Login: environment.apiUrl + 'auth/login',
        Signup: environment.apiUrl + 'auth/signup',
        Logout: environment.apiUrl + 'auth/logout',
        EmailExists: environment.apiUrl + 'auth/emailExists',
        ForgotPassword: environment.apiUrl + 'auth/forgotPassword',
        SendOtp: environment.apiUrl + 'auth/sendOtp',
        VerifyOtp: environment.apiUrl + 'auth/verifyOtp',
        ChangePassword: environment.apiUrl + 'auth/changePassword',
        ContactUs: environment.apiUrl + 'auth/contactUs',
    },
    Task: {
        Insert: environment.apiUrl + 'task/insert',
        Update: environment.apiUrl + 'task/update',
        Delete: environment.apiUrl + 'task/delete',
        Get: environment.apiUrl + 'task/get',
        Ids: environment.apiUrl + 'task/ids',
        Take: environment.apiUrl + 'task/take',
        ScreenShot: environment.apiUrl + 'task/screenShot',
        Download: environment.apiUrl + 'task/download',
        Payment: environment.apiUrl + 'task/payment',
    },
    User: {
        Insert: environment.apiUrl + 'user/insert',
        Update: environment.apiUrl + 'user/update',
        Delete: environment.apiUrl + 'user/delete',
        GetByToken: environment.apiUrl + 'user/getByToken',
        GetById: environment.apiUrl + 'user/getById',
        Get: environment.apiUrl + 'user/get',
        Ids: environment.apiUrl + 'user/ids',
    }, 
    Payment: {
        Insert: environment.apiUrl + 'payment/insert',
        Get: environment.apiUrl + 'payment/get',
    },
    Shop: {
        Insert: environment.apiUrl + 'shop/insert',
        Update: environment.apiUrl + 'shop/update',
        Delete: environment.apiUrl + 'shop/delete',
        Get: environment.apiUrl + 'shop/get',
        GetAll: environment.apiUrl + 'shop/getAll'        
    },
    Shared: {
        GetConstants: environment.apiUrl + 'shared/getConstants',
        GetInterests: environment.apiUrl + 'shared/getInterests',
    },
    Instagram: {
        url: "https://www.instagram.com",
        code: "?__a=1"
    }
};
