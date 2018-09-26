import { FilesService } from "./../../services/files.service";
import { Component, OnInit } from "@angular/core";
import { Track } from "../../models/tracks";
import { PlaylistDialogComponent } from "../playlist-dialog/playlist-dialog.component";
import { MatSnackBar, MatDialog } from "@angular/material";
import { UserService } from "../../services/user.service";
import { YoutubeDialogComponent } from "../youtube-dialog/youtube-dialog.component";
import { CommonServiceService } from "../../services/common-service.service";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";

@Component({
  selector: "app-youtube-tracks",
  templateUrl: "./youtube-tracks.component.html",
  styleUrls: ["./youtube-tracks.component.scss"]
})
export class YoutubeTracksComponent implements OnInit {
  tracks: Track[];
  isLoading: boolean = false;
  genre: string;
  constructor(
    private userService: UserService,
    public snackbar: MatSnackBar,
    public filesService: FilesService,
    private dialog: MatDialog,
    private commonService: CommonServiceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    let id = this.route.snapshot.params["id"];
    this.isLoading = true;
    let track: Track = {
      youtube_link: id
    }
    console.log(track);
    
    this.filesService.getYouTubeTracks(track).subscribe(tracks => {
      this.isLoading = false;
      this.tracks = tracks;
    });
  }

  addToPlaylist(track: Track) {
    if (this.genre == null || this.genre == "") {
      this.snackbar.open("You must choose a genre", "Ok", {
        duration: 3000
      });
      return;
    }
    let userID = localStorage.getItem("Id");
    this.filesService.getAllUserFolders(userID).subscribe(folders => {
      console.log(folders);

      const dialogRef = this.dialog.open(PlaylistDialogComponent, {
        data: folders
      });

      dialogRef.afterClosed().subscribe(folders => {
        if (folders) {
          let userID = localStorage.getItem("Id");
          this.commonService.notifyStartYTUpload();

          track.createdDate = new Date();
          track.user_id = userID;
          track.genre = this.genre;

          console.log(track);

          this.filesService.newTrack(track).subscribe(data => {
            if (data) {
              this.filesService.addToPlaylist(data, folders).subscribe(() => {
                this.snackbar.open("Tracks Added to Playlist(s)", "Ok", {
                  duration: 3000
                });
                this.commonService.notifyYTUploadComplete();
              });
            }
            
            error => {
              this.commonService.notifyYTUploadComplete();
              this.snackbar.open("This Link can't be downloaded!", "Ok", {
                duration: 3000
              });
            };
          });
        }
      });
    });
  }

  // addYouTubeVideo(track: Track): Observable<any> {
  // const dialogRef = this.dialog.open(YoutubeDialogComponent, {
  //   width: "250px",
  //   data: { track_name: "Link", link: "", genre: "" }
  // });

  // dialogRef.afterClosed().subscribe(data => {

  // this.commonService.events$.forEach(track => {
  //   this.currentTrack = track;
  // });

  // this.snackbar.open("Track Added!", "Ok", {
  //   duration: 3000
  // });

  // });
  // }
}
