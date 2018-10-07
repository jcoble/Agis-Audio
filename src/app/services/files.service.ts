import { catchError, retry, filter } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/timer';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireStorage } from "angularfire2/storage";
import { Track } from "./../models/tracks";
import { Injectable } from "@angular/core";
import { Folder } from "../models/folder";
import { PublicVariablesService } from './public-variables.service';
import { CommonServiceService } from './common-service.service';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
import polling from 'rx-polling';
import { PollProcess } from '../models/PollProcess';

const httpOptions = {
  headers: new HttpHeaders({ 'content-type': 'application/json '})
}

@Injectable()
export class FilesService {
  tracks: Observable<Track[]>;
  track: Observable<Track>;
  folders: Observable<Folder[]>;
  folder: Observable<Folder>;

  apiUrlTest: string = "http://localhost:63298/";
  //apiUrl: string = 'http://www.streamrecoveryaudio.com/api2/';
  //apiUrl: string = 'http://www.streamrecoveryaudio.com/api2/api/';
  //apiUrl: string = 'http://localhost:63298/api/';
  apiUrl: string = this.global.getApiUrl();
  private handleError: HandleError;
  
  
  // private _hubConnection: HubConnection
  constructor(
    private http: HttpClient,
    private global: PublicVariablesService,
    private commonService: CommonServiceService,
    public snackbar: MatSnackBar,  
    httpErrorHandler: HttpErrorHandler
  ) { 
    this.handleError = httpErrorHandler.createHandleError('FilesService');
  }

  getTracks(folderID: string): Observable<Track[]> {
    const url = this.apiUrl + 'Track/'+folderID;
    return this.http.get<Track[]>(url).pipe(
      retry(3),
      catchError(this.handleError('getTracks', []))
    );
  }

  getYouTubeTracks(track: Track): Observable<Track[]> {
    const url = this.apiUrl + 'YouTube';
    return this.http.post<Track[]>(url, track, httpOptions).pipe(
      retry(3),
      catchError(this.handleError('getYouTubeTracks', []))
    );
  }

  searchTracks(search_value: string): Observable<Track[]> {
    const url = this.apiUrl + 'TracksQuery/'+search_value;
    return this.http.get<Track[]>(url).pipe(
      retry(3),
      catchError(this.handleError('searchTracks', []))
    );; 
  }

  getMostRecentUploadedTracks(): Observable<Track[]> {
    const url = this.apiUrl + 'TracksQuery/Latest';
    return this.http.get<Track[]>(url).pipe(
      retry(3),
      catchError(this.handleError('getMostRecentUploadedTracks', []))
    );
  }

  getMostRecentUploadedTracksSpeakers(): Observable<Track[]> {
    const url = this.apiUrl + 'TracksQuery/LatestSpeakers';
    return this.http.get<Track[]>(url).pipe(
      retry(3),
      catchError(this.handleError('getMostRecentUploadedTracksSpeakers', []))
    ); 
  }

  getMostLikedTracks(): Observable<Track[]> {
    const url = this.apiUrl + 'TracksQuery/Top';
    return this.http.get<Track[]>(url).pipe(
      retry(3),
      catchError(this.handleError('getMostLikedTracks', []))
    ); 
  }

  getMostLikedTracksSpeakers(): Observable<Track[]> {
    const url = this.apiUrl + 'TracksQuery/TopSpeakers';
    return this.http.get<Track[]>(url).pipe(
      retry(3),
      catchError(this.handleError('getMostLikedTracksSpeakers', []))
    ); 
  }

  getTrendingTracks(genre: string): Observable<Track[]> {
    const url = this.apiUrl + 'TracksQuery/Trending/'+genre;
    return this.http.get<Track[]>(url).pipe(
      retry(3),
      catchError(this.handleError('getTrendingTracks', []))
    ); 
  }

  getFolders(folder: Folder): Observable<Folder[]> {
      const url = this.apiUrl + 'Playlist/Folder';
      return this.http.post<Folder[]>(url, folder, httpOptions).pipe(
        retry(3),
        catchError(this.handleError('getFolders', []))
      );
  }

  getAllUserFolders(userID: string) : Observable<Folder[]> {
    const url = this.apiUrl + 'User/ListAllFolders/' + userID;
    return this.http.get<Folder[]>(url).pipe(
      retry(3),
      catchError(this.handleError('getAllUserFolders', []))
    );
  }

  addToPlaylist(track: Track, folders: Folder[]) : Observable<any> {
    const url = this.apiUrl + 'Playlist/AddToPlaylist/' + track.id;
    return this.http.post(url, folders, httpOptions).catch(err => {
      this.commonService.notifyYTUploadComplete();
            this.snackbar.open("Something went wrong with adding the playlist!", "Ok", {
              duration: 3000
            });
            return err;
    });;
  }

  deleteFolder(folder: Folder): Observable<boolean> {
    const url = this.apiUrl + 'Playlist/Folder/Delete/'+folder.id;
    return this.http.delete<boolean>(url).pipe(
      retry(3),
      catchError(this.handleError('deleteFolder', null))
    ); 
  }

  newFolder(folder: Folder): Observable<Folder> {
    folder.folder_name = folder.folder_name.replace('/', ' ');
      const url = this.apiUrl + 'Playlist';
      return this.http.post<Folder>(url, folder, httpOptions).pipe(
        retry(3),
        catchError(this.handleError('newFolder', folder))
      );
  }

  newTrack(track: Track): Observable<Track> {

    const url = this.apiUrl + 'Track';
    return this.http.post<Track>(url, track, httpOptions).catch(err => {
      this.commonService.notifyYTUploadComplete();
            this.snackbar.open("This Link can't be downloaded!", "Ok", {
              duration: 3000
            });
            return err;
    });
  }

  newPlaylist(track: Track): Observable<PollProcess> {
    const url = this.apiUrl + 'Track/YTPlaylist';
    return this.http.post<PollProcess>(url, track, httpOptions).pipe(
      catchError(this.handleError('newFolder', track))
    );;
  }

  pollNewPlaylist(ID: number): Observable<PollProcess> {
    let url = this.apiUrl + 'Track/YTPoll/'+ID;
    const request$ = this.http.get(url); 
    return polling(request$, { interval: 5000 })
  }

  putTrackOrderDown(track: Track): Observable<any> {
    const url = this.apiUrl + 'Playlist/PutTrackOrderDown';
    return this.http.put(url, track, httpOptions).pipe(
      retry(3),
      catchError(this.handleError('putTrackOrderDown', null))
    );
  }

  putTrackOrderUp(track: Track): Observable<any> {
    const url = this.apiUrl + 'Playlist/PutTrackOrderUp';
    return this.http.put(url, track, httpOptions).pipe(
      retry(3),
      catchError(this.handleError('putTrackOrderUp', null))
    );
  }

  deleteTrack(track: Track, folder_id: string): Observable<boolean> {
    const url = this.apiUrl + 'Track/Delete/' + folder_id;
    return this.http.post<boolean>(url, track, httpOptions).pipe(
      retry(3),
      catchError(this.handleError('putTrackOrderUp', false))
    );
  }

}
