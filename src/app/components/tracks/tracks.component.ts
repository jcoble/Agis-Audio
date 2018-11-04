import { UserService } from "./../../services/user.service";
import { DialogComponent } from "./../dialog/dialog.component";
import { Router, ActivatedRoute, Params, Scroll } from "@angular/router";
import { FilesService } from "./../../services/files.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Track } from "../../models/tracks";
import { CommonServiceService } from "../../services/common-service.service";
import { Folder } from "../../models/folder";
import { ToastrService } from "ngx-toastr";
import { MatDialogModule, MatDialogConfig } from "@angular/material/dialog";
import { MatDialog } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import {
  MatIconModule,
  MatSnackBar,
  MatMenuTrigger
} from "../../../../node_modules/@angular/material";
import { PlaylistDialogComponent } from "../playlist-dialog/playlist-dialog.component";
import { YoutubeDialogComponent } from "../youtube-dialog/youtube-dialog.component";
import { ViewportScroller } from "@angular/common";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-tracks",
  templateUrl: "./tracks.component.html",
  styleUrls: ["./tracks.component.scss"]
})
export class TracksComponent implements OnInit {
  tracks: Track[];
  id: string;
  currentTrack: Track;
  paused: boolean = true;
  currentFolderName: string;
  isLoading: boolean = false;
  fromUploads: boolean = false;
  fU: string;
  @ViewChild(MatMenuTrigger)
  trigger: MatMenuTrigger;

  scrollPosition: [number, number];
  
  constructor(
    private filesService: FilesService,
    private commonService: CommonServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private userService: UserService,
    public snackbar: MatSnackBar,
    private viewportScroller: ViewportScroller
  ) {
    
  }

  ngOnInit() {
    // Get id from url
    
    this.id = this.route.snapshot.params["id"];

    this.route.queryParams.subscribe(params => {
      this.currentFolderName = params["folder_name"] || "";

      if (params["fromUploads"] == "true") { 
        this.fromUploads = true;
      }
    });

    if(this.id){
      this.isLoading = true;
      this.filesService.getTracks(this.id).subscribe(tracks => {
        this.isLoading = false;
        this.tracks = this.removeMp3(tracks);
        //set each isPlaying to false for each track
        this.tracks.forEach(track => {
          
          // is the track playing the same as this track?
          if (CommonServiceService.currentTrack != null) {
            if (track.url != CommonServiceService.currentTrack.url) {
              track.isPlaying = false;
            } else {
              track.isPlaying = CommonServiceService.currentTrack.isPlaying;
              this.commonService.changeTrack(track);
              // this.commonService.setCurrentTrack(track);
              // track.isPlaying = true;
            }
          } else {
            // if not then make all tracks set to not playing
            track.isPlaying = false;
          }
  
          //Set isLiked nulls to false
          if (track.isLiked == null) {
            track.isLiked = false;
          }
        });
      });
    }

    this.commonService.events$.forEach(track => {
      this.currentTrack = track;
    });

    this.commonService.trackLikedEvents$.subscribe(track => {
      if (track) {
        this.tracks.forEach(trackInList => {
          if(trackInList.id == track.id) {
            trackInList.isLiked = track.isLiked;
            // trackInList.likes += 1;
          }
        })
      }
    });

    this.commonService.trackAddedToPlaylistEvents$.subscribe(track => {
      if(track){
        if(track.folder_id == this.id){
          this.tracks.push(track);
        }
      }
    });
  }

  removeMp3(tracks: Track[]): Track[] {
    tracks.forEach(track => {
      track.track_name = track.track_name.replace(".mp3", "");
    });
    return tracks;
  }

  playPause(track) {
    if (track != null) {
      if (this.currentTrack != track) {
        track.isPlaying = true;
        if (this.currentTrack != null) {
          this.currentTrack.isPlaying = false;
        }
      } else {
        track.isPlaying = !this.currentTrack.isPlaying;
      }

      this.currentTrack = track;
      this.commonService.setCurrentTrackList(this.tracks);
      this.commonService.changeTrack(track);
    }
  }

  getTrendingGenre(genre: string) {
    this.isLoading = true;
    this.filesService.getTrendingTracks(genre).subscribe(tracks => {
      this.isLoading = false;
      this.tracks = this.removeMp3(tracks);
      //set each isPlaying to false for each track
      this.tracks.forEach(track => {
        
        // is the track playing the same as this track?
        if (CommonServiceService.currentTrack != null) {
          if (track.url != CommonServiceService.currentTrack.url) {
            track.isPlaying = false;
          } else {
            track.isPlaying = CommonServiceService.currentTrack.isPlaying;
            this.commonService.changeTrack(track);
          }
        } else {
          // if not then make all tracks set to not playing
          track.isPlaying = false;
        }

        //Set isLiked nulls to false
        if (track.isLiked == null) {
          track.isLiked = false;
        }
      });
    });
  }

  addToPlaylist(track: Track) {
    let userID = localStorage.getItem("Id");
    this.filesService.getAllUserFolders(userID).subscribe(folders => {
      const dialogRef = this.dialog.open(PlaylistDialogComponent, {
        data: folders
      });

      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.filesService.addToPlaylist(track, data).subscribe(() => {
            this.snackbar.open("Tracks Added to Playlist(s)", "Ok", {
              duration: 3000
            });
          });
        }
      });
    });
  }

  deleteTrack(trackToBeDeleted: Track) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { message: "Are you sure you want to delete this track!" }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data == true) {
        this.filesService.deleteTrack(trackToBeDeleted, this.id).subscribe(data => {
          if (data == true) {
            this.tracks = this.tracks.filter(
              track => track.id !== trackToBeDeleted.id
            );
            this.snackbar.open("Track Deleted", "Ok", {
              duration: 3000
            });
          }
        });
      }
    });
  }

  moveTrackUp(track: Track) {

    const i = this.tracks.findIndex(x => x.track_order === track.track_order);
    if(i == 0) {
      return;
    }
    this.filesService.putTrackOrderUp(track).subscribe(() => {
    })
    this.array_move(this.tracks, i,i -1);
  }

  moveTrackDown(track: Track) {
    const i = this.tracks.findIndex(x => x.track_order === track.track_order);
    if(i == this.tracks.length - 1) {
      return;
    }
    this.filesService.putTrackOrderDown(track).subscribe(() => {
    })
    this.array_move(this.tracks, i,i + 1);
  }

  array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
};

  likeTrack(track: Track) {
    if (track != null) {
      if (track.isLiked == false) {
        track.isLiked = true;
        track.likes += 1;
        this.userService
          .likeTrack(track)
          .subscribe(error => console.log(error));
      } else {
        track.isLiked = false;
        track.likes -= 1;
        this.userService
          .removeLike(track)
          .subscribe(error => console.log(error));
      }
    } else {
      track.isLiked = true;
      track.likes += 1;
      this.userService.likeTrack(track).subscribe(error => console.log(error));
    }
  }

  addYouTubeVideo() {
    const dialogRef = this.dialog.open(YoutubeDialogComponent, {
      width: "300px",
      data: { track_name: "Link", link: "", genre: "" }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        let userID = localStorage.getItem('Id');
        let folder_id = this.id;
        this.commonService.notifyStartYTUpload();
        let trackToUpload: Track = {
          track_name: data.track_name,
          createdDate: new Date(),
          user_id: userID,
          folder_id: +folder_id,
          youtube_link: data.link,
          genre: data.genre
        };

        this.filesService.newTrack(trackToUpload).subscribe(data => {
          if(data){
            this.filesService.getTracks(this.id).subscribe(tracks => {
              this.isLoading = false;
              this.tracks = this.removeMp3(tracks);
              //set each isPlaying to false for each track
              this.tracks.forEach(track => {
                
                // is the track playing the same as this track?
                if (CommonServiceService.currentTrack != null) {
                  if (track.url != CommonServiceService.currentTrack.url) {
                    track.isPlaying = false;
                  } else {
                    track.isPlaying = CommonServiceService.currentTrack.isPlaying;
                    this.commonService.changeTrack(track);
                  }
                } else {
                  // if not then make all tracks set to not playing
                  track.isPlaying = false;
                }
        
                //Set isLiked nulls to false
                if (track.isLiked == null) {
                  track.isLiked = false;
                }
              });
              
            });
          }else {
            this.commonService.notifyYTUploadComplete();
            this.snackbar.open("This Link can't be downloaded!", "Ok", {
              duration: 3000
            });
          }
          error => {            
            this.commonService.notifyYTUploadComplete();
            this.snackbar.open("This Link can't be downloaded!", "Ok", {
              duration: 3000
            });
          }
      
          this.commonService.events$.forEach(track => {
            this.currentTrack = track;
          });
          this.commonService.notifyYTUploadComplete();
          this.snackbar.open("Track Added!", "Ok", {
            duration: 3000
          });
        })
      } 
    });
  }
}
