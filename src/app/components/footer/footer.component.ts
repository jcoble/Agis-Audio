import { PollProcess } from "./../../models/PollProcess";

import { Injectable, OnDestroy, Output, EventEmitter } from "@angular/core";
import { FilesService } from "./../../services/files.service";
import { CommonServiceService } from "./../../services/common-service.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Track } from "../../models/tracks";
import { Observable } from "rxjs";
import { Folder } from "../../models/folder";
import { finalize, map } from "rxjs/operators";
import { MatSnackBar } from "../../../../node_modules/@angular/material";
import "rxjs/add/observable/interval";
import "rxjs/add/operator/takeWhile";
import { MediaMeta } from "../../models/MediaMeta";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"]
})
@Injectable({
  providedIn: "root"
})
export class FooterComponent implements OnInit, OnDestroy {
  @Output()
  notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  footerOpened: boolean = false;
  audio = new Audio();
  currentTime: number;
  value = 0;
  testvalue = 50;
  track: Track = {
    id: null,
    user_id: "",
    url: "",
    track_name: "Spartan! Click here for more player controls",
    createdDate: null,
    folder_id: null,
    isPlaying: false
  };

  //Youtube
  id = "";
  private player: YT.Player;
  private ytEvent;
  playerEventID: number;
  videoCued: boolean = false;
  youtubeUrl: string = "";

  audioDuration: number = 0;
  audioCurrentTime: number = 100;

  ref: any;
  task: any;
  uploadProgress: number;
  maxValue: number;
  isUploading: boolean;
  downloadURL: Observable<string>;
  uploadURL: any;
  fileLocation: any;
  data: any;
  uploadState: Observable<string>;
  file: File;
  folder: Folder;

  newVariable: any;

  trackPlayingID: number;

  isDeterminate: string = "determinate";

  wasPlaying: boolean = false;
  trackLoading: boolean = false;
  secondsMinutes: string = "00:00:00";
  totalNumberUploads: number;
  constructor(
    private commonService: CommonServiceService,
    private filesService: FilesService,
    public snackbar: MatSnackBar
  ) {
    this.isUploading = false;
  }

  ngOnInit() {
    this.commonService.events$.forEach(track => {
      this.track = track;
      this.playPause();
    });

    // this.commonService.uploadEvents$.forEach(data => {
    //   this.uploadFiles(data.files, data.folder);
    // });

    this.commonService.startYTUploadEvents$.forEach(() => {
      this.isUploading = true;
      this.isDeterminate = "indeterminate";
    });

    this.commonService.yTUploadCompleteEvents$.forEach(() => {
      this.isUploading = false;
      this.isDeterminate = "determinate";
    });

    this.audio.ontimeupdate = () => {
      this.secondsMinutes = this.secondsToHms(this.audio.currentTime);
      this.audioCurrentTime = this.audio.currentTime;
    };

    this.commonService.nextTrackEvents$.forEach(() => {
      this.skipNextTrack();
    });

    this.commonService.previousTrackEvents$.forEach(() => {
      this.skipPreviousTrack();
    });

    this.commonService.UploadYTPlaylistEvents$.forEach(data => {      
      this.uploadProgressYTPlaylist(data.pollProcess, data.folder, data.numberTracksBefore);
    });

    try {
      this.newVariable = window.navigator;

      this.newVariable.mediaSession.setActionHandler("previoustrack", () => {
        this.skipPreviousTrack();
      });

      this.newVariable.mediaSession.setActionHandler("nexttrack", () => {
        this.skipNextTrack();
      });

      this.newVariable.mediaSession.setActionHandler("play", () => {
        this.triggerPlayPause();
      });

      this.newVariable.mediaSession.setActionHandler("pause", () => {
        this.triggerPlayPause();
      });
      let skipTime = 10; /* Time to skip in seconds */
      this.newVariable.mediaSession.setActionHandler("seekbackward", () => {
        this.audio.currentTime = Math.max(this.audio.currentTime - skipTime, 0);
        this.audioCurrentTime = this.audio.currentTime;
      });

      this.newVariable.mediaSession.setActionHandler("seekforward", () => {
        this.audio.currentTime = Math.min(
          this.audio.currentTime + skipTime,
          this.audio.duration
        );
        this.audioCurrentTime = this.audio.currentTime;
      });
    } catch {}
  }

  skipPreviousTrack(): void {
    let currentTrackList = this.commonService.getCurrentTrackList();
    let currentTrackIndex = currentTrackList.findIndex(
      x => x.id === this.track.id
    );
    if (currentTrackIndex > 0) {
      this.triggerPlayPause();
      this.track = currentTrackList[currentTrackIndex - 1];
      this.track.isPlaying = true;
      this.commonService.changeTrack(this.track);
    }
  }

  skipNextTrack(): void {
    let currentTrackList = this.commonService.getCurrentTrackList();
    let currentTrackIndex = currentTrackList.findIndex(
      x => x.id === this.track.id
    );

    if (
      currentTrackIndex >= 0 &&
      currentTrackIndex < currentTrackList.length - 1
    ) {
      this.triggerPlayPause();
      this.track = currentTrackList[currentTrackIndex + 1];
      this.track.isPlaying = true;
      this.commonService.changeTrack(this.track);

      // this.LoadAudio();
      // this.PlayAudio();
    }
  }

  uploadProgressYTPlaylist(pollProcess: PollProcess, folder: Folder, numberTracksBefore: number) {
    if (pollProcess.status == "STARTED" || pollProcess.status == "RUNNING") {
      this.isUploading = true;
      this.isDeterminate = "determinate";
      this.maxValue = pollProcess.total_tracks;
      if(pollProcess.tracks_complete > 0){
        folder.number_tracks = numberTracksBefore + pollProcess.tracks_complete;
        this.commonService.notifyUploadComplete(folder);
        this.uploadProgress = Math.floor(
          (pollProcess.tracks_complete / pollProcess.total_tracks) * 100
        );
      }else {
        this.uploadProgress = 0;
      }
      
    } else if (pollProcess.status == "DONE") {
      this.isUploading = false;
      this.maxValue = 0;
      this.isDeterminate = "indeterminate";
      this.uploadProgress = 0;
      folder.folder_type = "DONE";
      folder.number_tracks = numberTracksBefore + pollProcess.tracks_complete;
      this.commonService.notifyUploadComplete(folder);
    } 
  }

  // uploadFiles(files: FileList, folder: Folder) {
  //   this.totalNumberUploads = files.length;
  //   this.upload(files, folder);
  // }

  playPause() {
    this.trackLoading = false;
    this.htmlAudioPlayPause();
  }

  htmlAudioPlayPause() { 
    if (!this.track.isPlaying) {
      this.audio.pause();
    } else {
      if (this.trackPlayingID != this.track.id) {
        this.trackPlayingID = this.track.id;
        this.LoadAudio();
      }
      this.PlayAudio();
    }
  }

  private LoadAudio() {
    this.trackLoading = true;
    this.audio.onloadeddata = () => {
      this.trackLoading = false;
      this.audioDuration = this.audio.duration;
    };
    this.audio.src = this.track.url;
    this.audio.load();
    this.audio.onended = () => {
      this.skipNextTrack();
      this.commonService.notifyNextSongLoaded(this.track);
    };
  }

  private PlayAudio() {
    this.audio.play().catch(error => {
      this.trackLoading = false;
      this.track.isPlaying = false;
      this.audio.pause();
      this.snackbar.open("Something went wrong playing this file", "Ok", {
        duration: 4000
      });
    });
    this.track.isPlaying = true;
    // let mediaMetaData: MediaMeta = {
    //   title: this.track.track_name,
    //   album: this.track.genre
    // }
    // this.newVariable.mediaSession.metadata = mediaMetaData;
    // this.newVariable.mediaSession.metadata({
    //   title: this.track.track_name,
    //   album: this.track.genre
    // })
    // this.newVariable.mediaSession.metadata = new MediaMetadata({
    //   title: this.track.track_name
    // })
    // this.audio.title = this.track.track_name;
  }

  triggerPlayPause() {
    // if (this.track.url != "") {
    if (!this.trackLoading) {
      this.track.isPlaying = !this.track.isPlaying;
      this.commonService.changeTrack(this.track);
    } else {
      this.track.isPlaying = false;
      this.trackLoading = false;
      this.commonService.changeTrack(this.track);
    }
  }

  secondsToHms(d) {
    d = Number(d);

    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    return (
      ("0" + h).slice(-2) +
      ":" +
      ("0" + m).slice(-2) +
      ":" +
      ("0" + s).slice(-2)
    );
  }

  press(value: number) {
    this.wasPlaying = this.track.isPlaying;
    // if (this.track.youtube_link) {
    //   this.player.pauseVideo();
    // } else {
    this.audio.pause();
    // }
  }

  release(event) {
    // if (this.track.youtube_link) {
    //   this.audioCurrentTime = event.target.value;
    //   this.player.seekTo(event.target.value, true);
    //   this.secondsMinutes = this.secondsToHms(this.audioCurrentTime);
    //   if (this.wasPlaying) {
    //     this.player.playVideo();
    //   }
    // } else {
    this.audio.currentTime = event.target.value;
    this.audioCurrentTime = event.target.value;
    this.currentTime = event.target.value;

    if (this.wasPlaying) {
      this.audio.play();
    }
    // }
  }

  // upload(files: FileList, folder: Folder) {
  //   Array.from(files).forEach((file, index) => {
  //     let totalBytesAll = [];
  //     let trackToUpload: Track = {
  //       track_name: file.name,
  //       createdDate: new Date(),
  //       user_id: folder.user_id,
  //       folder_id: folder.id
  //     };
  //     this.isUploading = true;
  //     this.isDeterminate = "determinate";

  //     const fileLocation =
  //       "leads/" +
  //       trackToUpload.track_name.replace(".mp3", "") +
  //       folder.user_id +
  //       ".mp3";

  //     this.ref = this.afStorage.ref(fileLocation);
  //     this.task = this.ref.put(file);

  //     this.uploadProgress = this.task.percentageChanges();

  //     this.task
  //       .then(snapshot => {
  //         return snapshot.ref.getDownloadURL();
  //       })
  //       .then(snapshot => {
  //         trackToUpload.url = snapshot.downloadURL;
  //         this.uploadFileMeta(trackToUpload, folder, index);
  //       })

  //       .catch(error => {
  //         // Use to signal error if something goes wrong.
  //         this.snackbar.open("Something went wrong with the upload", "Ok", {
  //           duration: 4000
  //         });
  //       });
  //   });
  // }

  uploadFileMeta(trackToUpload: Track, folder: Folder, index: number) {
    this.filesService.newTrack(trackToUpload).subscribe(
      data => {
        this.commonService.notifyUploadComplete(folder);
        this.snackbar.open(trackToUpload.track_name + " Uploaded!", "Ok", {
          duration: 3000
        });
        if (index + 1 == this.totalNumberUploads) {
          this.isUploading = false;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  footerClick(): void {
    this.footerOpened = !this.footerOpened;
    this.notify.emit(this.footerOpened);
  }

  ngOnDestroy() {
    this.audio.pause();
    this.currentTime = 0;
    this.audio.src = "";
    this.audio.currentTime = 0;
    this.audio.load();
    this.commonService.changeTrack(null);
  }
}
