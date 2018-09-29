import { Injectable } from '@angular/core';
import { Observable } from "rxjs/observable";
import { User } from "../models/user";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Track } from '../models/tracks';
import { PublicVariablesService } from './public-variables.service';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
import { catchError, retry } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'content-type': 'application/json '})
}

@Injectable()
export class UserService {
  users: Observable<User[]>;
  //apiUrlTest: string = "http://localhost:63298/";
  //apiUrl: string = 'http://www.streamrecoveryaudio.com/api2/api/';
  //apiUrl: string = 'http://localhost:63298/api/';
  apiUrl: string = this.global.getApiUrl();
  private handleError: HandleError;
  
  constructor(
    private http: HttpClient,
    private global: PublicVariablesService,
    httpErrorHandler: HttpErrorHandler
  ) {this.handleError = httpErrorHandler.createHandleError('UserService'); }


  getUsers(): Observable<User[]> {
    const url = this.apiUrl + 'User/';
    return this.http.get<User[]>(url).pipe(
      retry(3),
      catchError(this.handleError('getUsers', []))
    ); 
  }

  getUsersSortedByFirstName(): Observable<User[]> {
    const url = this.apiUrl + 'User/FirstNameSort/';
    return this.http.get<User[]>(url).pipe(
      retry(3),
      catchError(this.handleError('getUsersSortedByFirstName', []))
    ); 
  }

  //When user likes a track
  likeTrack(track: Track): Observable<any> {
    const url = this.apiUrl + 'User/LikeTrack';
    return this.http.post<Track>(url, track, httpOptions).pipe(
      retry(3),
      catchError(this.handleError('likeTrack', null))
    );
  }

  //When user likes a track
  removeLike(track: Track): Observable<any> {
    const url = this.apiUrl + 'User/RemoveLike';
    return this.http.post<Track>(url, track, httpOptions).pipe(
      retry(3),
      catchError(this.handleError('removeLike', null))
    );
  }

}
