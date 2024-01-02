import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError, of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { Globals } from '../constant/globals';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  //public loginUser = localStorage.getItem('loginUser');
  public config = {};
  public userData: any = {};
  public loading: any;
  private apiUrl = environment.apiUrl
  constructor(public http: HttpClient, public router: Router) { }

  getHtml(api: string, reqBody: any = {}): Observable<any> {
    let contentHeaders = new HttpHeaders();
    contentHeaders.append('Accept', 'html/text');
    contentHeaders.append('Content-Type', 'html/text');

    const queryParam = Globals.jsonToQueryString(reqBody);
    return this.http.get(api + '?' + queryParam, {
      headers: contentHeaders,
      responseType: 'text',
    });
  }

  upload(
    files: File,
  ): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', files);
    console.log(formData);
    const req =
      new HttpRequest(
        'POST',
        `${this.apiUrl}posts/upload`,
        formData,
        {
          reportProgress: true,
          responseType: 'json',
        }
      );
    return this.http.request(req);
  }

  getAll(api: string, reqBody: any = {}): Observable<any> {
    return this.http.post(api, reqBody);
  }

  insert(api: string, reqBody: any = {}): Observable<any> {
    return this.http.post(api, reqBody);
  }

  post(api: string, reqBody: any = {}): Observable<any> {
    return this.insert(api, reqBody);
  }

  insertWithProgress(api: string, reqBody: any): Observable<any> {
    return this.http
      .post(api, reqBody, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(catchError(this.errorMsg));
  }

  update(api: string, reqBody: any = {}): Observable<any> {
    return this.http.put(api, reqBody);
  }

  // getById(api: string, reqBody: any = {}): Observable<any> {
  //   const queryParam = Globals.jsonToQueryString(reqBody);
  //   return this.http.get(api + '?' + queryParam);
  // }

  getById(api: string, reqBody: any = {}): Observable<any> {
    return this.http.get(api + '/' + reqBody.id);
  }

  get(api: string, options: any = {}): Observable<any> {
    return this.http.get(api, options);
  }

  put(api: string, reqBody: any = {}): Observable<any> {
    return this.update(api, reqBody);
  }

  delete(api: string): Observable<any> {
    return this.http.delete(api);
  }

  insertOrUpdate(api: string, reqBody: any = {}): Observable<any> {
    return reqBody?._id ? this.update(api, reqBody) : this.insert(api, reqBody);
  }

  insertOrUpdateFormData(
    api: string,
    reqBody: FormData,
    id: string
  ): Observable<any> {
    return id ? this.update(api, reqBody) : this.insert(api, reqBody);
  }

  download(api: string, reqBody: any = {}): Observable<any> {
    const queryParam = Globals.jsonToQueryString(reqBody);
    console.log('URL : ', api + '?' + queryParam);

    window.open(api + '?' + queryParam);

    return of(true);
  }

  patch(api: string, reqBody: any = {}): Observable<any> {
    return this.http.patch(api, reqBody);
  }

  errorMsg(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  getImageUrl(url: string): Observable<Blob> {
    return this.http.get(url, {
      responseType: "blob",
    });
  }

  deleteComments() { }

  getNotificationList(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}customers/get-notification/${id}`);
  }

  deleteNotification(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}customers/notification/${id}`, {
      responseType: 'text',
    });
  }

  readUnreadNotification(id: number, isRead: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}customers/edit-notification/${id}?isRead=${isRead}`
    );
  }

  getMetaData(url) {
    return this.http.post(`${this.apiUrl}posts/get-meta`, url);
  }

  getNotification(id): Observable<any> {
    return this.http.get(
      `${this.apiUrl}customers/notification/${id}`
    );
  }
}
