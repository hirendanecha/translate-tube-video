import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  private baseUrl = environment.apiUrl + 'channels';
  constructor(private http: HttpClient) {}

  getAllChannels(
    page: number,
    size: number,
    search: string = '',
    startDate,
    endDate
  ): Observable<any> {
    const data = {
      page: page,
      size: size,
      search: search,
      startDate: startDate,
      endDate: endDate,
    };
    return this.http.post(`${this.baseUrl}/get/`, data);
  }

  createChannel(data){
    return this.http.post(`${this.baseUrl}/create-channel`, data);
  }

  changeChannelStatus(id, feature): Observable<any> {
    return this.http.get(`${this.baseUrl}/feature/${id}?feature=${feature}`);
  }

  deleteChannel(id): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getChannelById(id): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  upload(file: File, id: any, defaultType: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('folder', defaultType);
    formData.append('file', file);
    formData.append('id', id);
    formData.append('default', defaultType);

    const req = new HttpRequest(
      'POST',
      `${environment.apiUrl}utils/upload`,
      formData,
      {
        reportProgress: true,
        responseType: 'json',
      }
    );

    return this.http.request(req);
  }
}
