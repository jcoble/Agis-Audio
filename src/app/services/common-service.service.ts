import { PollProcess } from './../models/PollProcess';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Track } from '../models/tracks';
import { Subject } from 'rxjs';
import { Folder } from '../models/folder';

@Injectable()
export class CommonServiceService {
/*   private trackSource = new BehaviorSubject<Track>(null);
  currentTrack = this.trackSource.asObservable(); */
  static currentTrack: Track;
  static currentTrackList: Track[];

  private _subject = new Subject<any>();
  private uploadSubject = new Subject<any>();
  private fromUploadSubject = new Subject<any>();
  private uploadComplete = new Subject<any>();
  private toggleSideNavSubject = new Subject<any>();
  private startYTUpload = new Subject<any>();
  private yTUploadComplete = new Subject<any>();
  private nextTrackSubject = new Subject<any>();
  private previousTrackSubject = new Subject<any>();
  private trackLikedSubject = new Subject<any>();
  private trackAddedToPlaylistSubject = new Subject<any>();
  private nextSongLoadedSubject = new Subject<any>();
  private getYTTracksSubject = new Subject<any>();
  private uploadYTPlaylistSubject = new Subject<any>();

  constructor() { }

  setCurrentTrack(track: Track) {
    CommonServiceService.currentTrack = track;
  }

  setCurrentTrackList(trackList: Track[]) {
    CommonServiceService.currentTrackList = trackList;
  }

  getCurrentTrackList() {
    return CommonServiceService.currentTrackList;
  }

  changeTrack(track) {
    CommonServiceService.currentTrack = track; 
    this._subject.next(track);
  }

  startUpload(fileAndFolder: any) {
    this.uploadSubject.next(fileAndFolder);
  }

  notifyFromUpload(fromUpload: boolean) { 
    this.fromUploadSubject.next(fromUpload);
  }

  notifyUploadComplete(folder: Folder) {
    this.uploadComplete.next(folder);
  }

  notifyStartYTUpload() {
    this.startYTUpload.next();
  }

  notifyYTUploadComplete() {
    this.yTUploadComplete.next();
  }

  notifyNextTrack() {
    this.nextTrackSubject.next();
  }

  notifyPreviousTrack() {
    this.previousTrackSubject.next();
  }

  notifyTrackLiked(track: Track) {
    this.trackLikedSubject.next(track);
  }

  notifyTrackAddedToPlaylist(track: Track) {
    this.trackAddedToPlaylistSubject.next(track);
  }

  notifyNextSongLoaded(track: Track) {
    this.nextSongLoadedSubject.next(track);
  }
 
  notifygetYTTracksSubject(playlistURL: string) {
    this.getYTTracksSubject.next(playlistURL);
  }

  notifyuploadYTPlaylistSubject(pollProcess: PollProcess,folder: Folder) {
    this.uploadYTPlaylistSubject.next({pollProcess,folder});
  }

  toggleSideNav() {
    this.toggleSideNavSubject.next();
  }

  get events$ () {
    return this._subject.asObservable();
  }

  get uploadEvents$ () {
    return this.uploadSubject.asObservable();
  }

  get fromUploadEvents$ () {
    return this.fromUploadSubject.asObservable();
  }

  get uploadCompleteEvents$ () {
    return this.uploadComplete.asObservable();
  }

  get toggleSideNameEvents$ () {
    return this.toggleSideNavSubject.asObservable();
  }

  get startYTUploadEvents$ () {
    return this.startYTUpload.asObservable();
  }

  get yTUploadCompleteEvents$ () {
    return this.yTUploadComplete.asObservable();
  }

  get nextTrackEvents$ () {
    return this.nextTrackSubject.asObservable();
  }

  get previousTrackEvents$ () {
    return this.previousTrackSubject.asObservable();
  }

  get trackLikedEvents$ () {
    return this.trackLikedSubject.asObservable();
  }

  get trackAddedToPlaylistEvents$ () {
    return this.trackAddedToPlaylistSubject.asObservable();
  }

  get nextSongLoadedEvents$ () {
    return this.nextSongLoadedSubject.asObservable();
  }

  get getYTTracksEvents$ () {
    return this.getYTTracksSubject.asObservable();
  }

  get UploadYTPlaylistEvents$ () {
    return this.uploadYTPlaylistSubject.asObservable();
  }

  // This goes form the footer to the leads component when the audio is played or paused
  playPause(paused: boolean) {
    this._subject.next(paused);
  }

  getCurrentTrack() {
    return CommonServiceService.currentTrack;
  }

}
