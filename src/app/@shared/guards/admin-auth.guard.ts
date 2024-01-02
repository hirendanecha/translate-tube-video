import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AdminAuthGuard implements CanActivate {
    
    constructor(
        private authService: AuthService
    ) {}

    canActivate() {
        const auth = this.authService.adminData();        
        const isLogin = (auth?.token && auth?._id) || false;
        
        if (isLogin) {
            return true;
        }

        window.location.href = '/auth/admin/login';  
        return false;
    }
}
