import { ViewChild, ElementRef } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FilesService } from "./../../services/files.service";
import {
  Component,
  OnInit,
  Input,
  Output,
  AfterContentInit,
  ContentChild,
  AfterViewChecked,
  AfterViewInit,
  ViewChildren
} from "@angular/core";
import { Track } from "../../models/tracks";
import { CommonServiceService } from "../../services/common-service.service";
import { Folder } from "../../models/folder";
import { MatSelectModule } from "@angular/material/select";
import { UserService } from "../../services/user.service";

export interface SortType {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-search-tracks",
  templateUrl: "./search-tracks.component.html",
  styleUrls: ["./search-tracks.component.scss"]
})
export class SearchTracksComponent implements OnInit {
  tracks: Track[];
  search_value: string;
  search_label: string;
  currentTrack: Track;
  paused: boolean = true;
  currentFolderName: string;
  isLoading: boolean = true;

  private parametersObservable: any;

  sortTypes: SortType[] = [
    { value: "recent-0", viewValue: "Recent Uploads" },
    { value: "most-liked-1", viewValue: "Most Liked" }
  ];

  constructor(
    private filesService: FilesService,
    private commonService: CommonServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Get id from url
    this.parametersObservable = this.route.params.subscribe(params => {
      this.search_value = params["search_value"];

      if (this.search_value == "recent-playlists-0") {
        //comes from
        this.search_label = "Recent Playlists";
        this.getMostRecentUploadedTracks();
      } else if (this.search_value == "most-liked-playlists-1") {
        this.search_label = "Most Liked Tracks";
        this.getMostLikedTracks();
      } else if (this.search_value == "users-sorted-first-3") {
        
      }
       else {
        this.search_label = this.search_value;
        this.searchTracks();
      }
    });
  }

  ngAfterViewInit() {}

  getTracks(id: string) {
    this.tracks = [];
    this.isLoading = true;
    
      if (id == "recent-0") {
        this.search_label = "Recent Tracks";
        this.getMostRecentUploadedTracks();
      } else if (id == "most-liked-1") {
        this.search_label = "Most Liked Tracks";
        this.getMostLikedTracks();
      }
  }

  date_sort_desc (date1, date2) {
    // This is a comparison function that will result in dates being sorted in
    // DESCENDING order.
    if (new Date(date1) > new Date(date2)) {
      return -1;
    }
     
    if (new Date(date1) < new Date(date2)) {
      return 1;
    }
    return 0;
  };

  getMostRecentUploadedTracks() {
    this.filesService.getMostRecentUploadedTracks().subscribe(tracks => {
      this.tracks = tracks;
      this.tracks = this.removeMp3(tracks);
      this.isLoading = false;
      //   //set each isPlaying to false for each track
      this.tracks.forEach(track => {
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
      
        //Set isLiked nulls to false
        if (track.isLiked == null) {
          track.isLiked = false;
        }
      });
    });

    this.commonService.events$.forEach(track => {
      this.currentTrack = track;
    });
  }

  getMostRecentUploadedTracksSpeakers() {
    this.filesService
      .getMostRecentUploadedTracksSpeakers()
      .subscribe(tracks => {
        this.tracks = tracks;
        this.tracks = this.removeMp3(tracks);
        this.isLoading = false;
        //   //set each isPlaying to false for each track
        this.tracks.forEach(track => {
          
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
          //Set isLiked nulls to false
          if (track.isLiked == null) {
            track.isLiked = false;
          }
        });
      });

    this.commonService.events$.forEach(track => {
      this.currentTrack = track;
    });
  }

  getMostLikedTracks() {
    this.filesService.getMostLikedTracks().subscribe(tracks => {
      this.tracks = tracks;
      this.tracks = this.removeMp3(tracks);
      this.isLoading = false;
      //   //set each isPlaying to false for each track
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
        //Set isLiked nulls to false
        if (track.isLiked == null) {
          track.isLiked = false;
        }
      });
    });

    this.commonService.events$.forEach(track => {
      this.currentTrack = track;
    });
  }

  getMostLikedTracksSpeakers() {
    this.filesService.getMostLikedTracksSpeakers().subscribe(tracks => {
      this.tracks = tracks;
      this.tracks = this.removeMp3(tracks);
      this.isLoading = false;
      //   //set each isPlaying to false for each track
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
        //Set isLiked nulls to false
        if (track.isLiked == null) {
          track.isLiked = false;
        }
      });
    });

    this.commonService.events$.forEach(track => {
      this.currentTrack = track;
    });
  }

  searchTracks() {
    this.filesService.searchTracks(this.search_value).subscribe(tracks => {
      this.tracks = tracks;
      this.tracks = this.removeMp3(tracks);
      this.isLoading = false;
      //   //set each isPlaying to false for each track
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
        //Set isLiked nulls to false
        if (track.isLiked == null) {
          track.isLiked = false;
        }
      });
    });

    this.commonService.events$.forEach(track => {
      this.currentTrack = track;
    });
  }

  playPause(track) {
    if (this.currentTrack != track) {
      track.isPlaying = true;
      if (this.currentTrack != null) {
        this.currentTrack.isPlaying = false;
      }
    } else {
      track.isPlaying = !this.currentTrack.isPlaying;
    }

    this.currentTrack = track;
    this.commonService.changeTrack(track);
  }

  removeMp3(tracks: Track[]): Track[] {
    tracks.forEach(track => {
      track.track_name = track.track_name.replace(".mp3", "");
    });
    return tracks;
  }

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

  ngOnDestroy() {
    if (this.parametersObservable != null) {
      this.parametersObservable.unsubscribe();
    }
  }
}
