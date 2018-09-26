import { map } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AngularFireStorage } from "angularfire2/storage";
import { Track } from "./../models/tracks";
import { Injectable, Component } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "angularfire2/firestore";
import { Folder } from "../models/folder";
import { User } from "../models/user";
import { PublicVariablesService } from './public-variables.service';

const httpOptions = {
  headers: new HttpHeaders({ 'content-type': 'application/json '})
}

@Injectable()
export class FilesService {
  trackCollection: AngularFirestoreCollection<Track>;
  trackDoc: AngularFirestoreDocument<Track>;
  tracks: Observable<Track[]>;
  track: Observable<Track>;

  folderCollection: AngularFirestoreCollection<Folder>;
  folderDoc: AngularFirestoreDocument<Folder>;
  folders: Observable<Folder[]>;
  folder: Observable<Folder>;

  apiUrlTest: string = "http://localhost:63298/";
  //apiUrl: string = 'http://www.streamrecoveryaudio.com/api2/';
  //apiUrl: string = 'http://www.streamrecoveryaudio.com/api2/api/';
  //apiUrl: string = 'http://localhost:63298/api/';
  apiUrl: string = this.global.getApiUrl();

  constructor(
    private http: HttpClient,private afStorage: AngularFireStorage, 
    private global: PublicVariablesService
  ) { }

  getTracks(folderID: string): Observable<Track[]> {
    const url = this.apiUrl + 'Track/'+folderID;
    return this.http.get<Track[]>(url)
  }

  searchTracks(search_value: string): Observable<Track[]> {
    const url = this.apiUrl + 'TracksQuery/'+search_value;
    return this.http.get<Track[]>(url); 
  }

  getMostRecentUploadedTracks(): Observable<Track[]> {
    const url = this.apiUrl + 'TracksQuery/Latest';
    return this.http.get<Track[]>(url); 
  }

  getMostRecentUploadedTracksSpeakers(): Observable<Track[]> {
    const url = this.apiUrl + 'TracksQuery/LatestSpeakers';
    return this.http.get<Track[]>(url); 
  }

  getMostLikedTracks(): Observable<Track[]> {
    const url = this.apiUrl + 'TracksQuery/Top';
    return this.http.get<Track[]>(url); 
  }

  getMostLikedTracksSpeakers(): Observable<Track[]> {
    const url = this.apiUrl + 'TracksQuery/TopSpeakers';
    return this.http.get<Track[]>(url); 
  }

  getTrendingTracks(genre: string): Observable<Track[]> {
    const url = this.apiUrl + 'TracksQuery/Trending/'+genre;
    return this.http.get<Track[]>(url); 
  }

  getFolders(folder: Folder): Observable<Folder[]> {
      const url = this.apiUrl + 'Playlist/Folder';
      return this.http.post<Folder[]>(url, folder, httpOptions); 
  }

  getAllUserFolders(userID: string) : Observable<Folder[]> {
    const url = this.apiUrl + 'User/ListAllFolders/' + userID;
    return this.http.get<Folder[]>(url);
  }

  addToPlaylist(track: Track, folders: Folder[]) : Observable<any> {
    const url = this.apiUrl + 'Playlist/AddToPlaylist/' + track.id;
    return this.http.post(url, folders, httpOptions);
  }

  deleteFolder(folder: Folder): Observable<boolean> {
    const url = this.apiUrl + 'Playlist/Folder/Delete/'+folder.id;
    return this.http.delete<boolean>(url); 
  }

  newFolder(folder: Folder): Observable<Folder> {
    folder.folder_name = folder.folder_name.replace('/', ' ');
      const url = this.apiUrl + 'Playlist';
      return this.http.post<Folder>(url, folder, httpOptions);
  }

  newTrack(track: Track): Observable<Track> {
    const url = this.apiUrl + 'Track';
    return this.http.post<Track>(url, track, httpOptions);
  }

  putTrackOrderDown(track: Track): Observable<any> {
    const url = this.apiUrl + 'Playlist/PutTrackOrderDown';
    return this.http.put(url, track, httpOptions);
  }

  putTrackOrderUp(track: Track): Observable<any> {
    const url = this.apiUrl + 'Playlist/PutTrackOrderUp';
    return this.http.put(url, track, httpOptions);
  }

  deleteTrack(track: Track, folder_id: string): Observable<boolean> {
    const url = this.apiUrl + 'Track/Delete/' + folder_id;
    return this.http.post<boolean>(url, track, httpOptions);
  }
}
