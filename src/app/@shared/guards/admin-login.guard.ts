import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AdminLoginGuard implements CanActivate {
    
    constructor(
        private router: Router,
        private authService: AuthService
    ) {}

    canActivate() {
        const auth = this.authService.adminData();        
        const isLogin = auth['token'] && auth['_id'];
        
        if (isLogin) {
            this.router.navigate(['/admin']);
            return false;
        }
        
        return true;
    }
}
