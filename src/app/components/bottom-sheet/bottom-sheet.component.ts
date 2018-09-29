import { Component, OnInit, OnChanges } from "@angular/core";
import { MatBottomSheetRef, MatSnackBar, MatDialog } from "@angular/material";
import { Track } from "../../models/tracks";
import { CommonServiceService } from "../../services/common-service.service";
import { FilesService } from "../../services/files.service";
import { UserService } from "../../services/user.service";
import { PlaylistDialogComponent } from "../playlist-dialog/playlist-dialog.component";

@Component({
  selector: "app-bottom-sheet",
  templateUrl: "./bottom-sheet.component.html",
  styleUrls: ["./bottom-sheet.component.scss"]
})
export class BottomSheetComponent implements OnInit {
  track: Track = {
    id: null,
    user_id: "",
    url: "",
    track_name: "Agis Audio",
    createdDate: null,
    folder_id: null,
    isPlaying: false,
    thumbnail: '/assets/bottompic.jpg'
  };
  wasPlaying: boolean = false;
  trackLoading: boolean = false;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,
    private commonService: CommonServiceService,
    private filesService: FilesService,
    private userService: UserService,
    public snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    if (this.commonService.getCurrentTrack() != null) {
      this.track = this.commonService.getCurrentTrack();
    }

    this.commonService.nextSongLoadedEvents$.subscribe(track => {
      this.getNextTrack(track);
    });
  }

  getNextTrack(track) {
    this.track = track;
  }

  playPause(track) {
      this.track.isPlaying = !this.track.isPlaying;
      this.commonService.changeTrack(track);
  }

  triggerPreviousTrack(track: Track): void {
      this.commonService.notifyPreviousTrack();
      this.track = this.commonService.getCurrentTrack();
  }

  triggerNextTrack(track: Track): void {
    this.commonService.notifyNextTrack();
    this.track = this.commonService.getCurrentTrack();
  }

  likeTrack(track: Track) {
    if (track.id != null) {
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
      this.commonService.notifyTrackLiked(track);
    }
  }

  addToPlaylist(track: Track) {
    if (track.id != null) {
      let userID = localStorage.getItem("Id");
      this.filesService.getAllUserFolders(userID).subscribe(folders => {
        const dialogRef = this.dialog.open(PlaylistDialogComponent, {
          data: folders
        });

        dialogRef.afterClosed().subscribe(data => {
          if (data) {
            this.filesService.addToPlaylist(track, data).subscribe(() => {
              this.commonService.notifyTrackAddedToPlaylist(track);
              this.snackbar.open("Tracks Added to Playlist(s)", "Ok", {
                duration: 3000
              });
            });
          }
        });
      });
    }
  }
}
