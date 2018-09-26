import { Injectable } from '@angular/core';
import { Observable } from "rxjs/observable";
import { User } from "../models/user";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Track } from '../models/tracks';
import { PublicVariablesService } from './public-variables.service';

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
  constructor(
    private http: HttpClient,
    private global: PublicVariablesService
  ) { }


  getUsers(): Observable<User[]> {
    const url = this.apiUrl + 'User/';
    return this.http.get<User[]>(url); 
  }

  getUsersSortedByFirstName(): Observable<User[]> {
    const url = this.apiUrl + 'User/FirstNameSort/';
    return this.http.get<User[]>(url); 
  }

  //When user likes a track
  likeTrack(track: Track): Observable<any> {
    const url = this.apiUrl + 'User/LikeTrack';
    return this.http.post<Track>(url, track, httpOptions);
  }

  //When user likes a track
  removeLike(track: Track): Observable<any> {
    const url = this.apiUrl + 'User/RemoveLike';
    return this.http.post<Track>(url, track, httpOptions);
  }

}
