import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

    constructor(private router: Router, private authService: AuthService, private toastService: ToastService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService?.getToken();

        console.log('token : ', token);

        if (token) {
            request = request.clone({ headers: request.headers.set('Authorization', token) });
        }

        if (!request.headers.has('content-type')) {
            request.headers.set('content-type', 'application/json');
            request.headers.set('accept', 'application/json, text/plain, */*');
        }

        return next.handle(request).pipe(map(event => {
            return event;
        }), catchError(err => {
            switch (err.status) {
                case 400:
                    this.toastService.error(err?.error?.message);
                    break;
                case 401:
                    localStorage.clear();
                    const url = this.router?.url.includes('admin') ? '/auth/login' : '?action=login';
                    console.log('url : ', url);
                    this.router.navigateByUrl(url);
                    break;
                case 500:
                    this.toastService.error('');
                    break;
                default:
                    break;
            }

            return throwError(err);
        }), finalize(() => {
        }));
    }
}
