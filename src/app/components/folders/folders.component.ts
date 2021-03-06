import { DialogYouTubeData } from "./../../models/DialogYouTubeData";
import { YoutubeDialogComponent } from "./../youtube-dialog/youtube-dialog.component";
import { DialogDeleteData } from "./../../models/DialogDeleteData";
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ElementRef,
  Inject
} from "@angular/core";
import { Folder } from "../../models/folder";
import { CommonServiceService } from "../../services/common-service.service";
import { FilesService } from "../../services/files.service";
import { FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { Track } from "../../models/tracks";
import { Router, ActivatedRoute, Params, NavigationEnd } from "@angular/router";
import { Location } from "@angular/common";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar,
  MatMenuTrigger,
  MatDialogConfig
} from "@angular/material";
import { ToastrService } from "../../../../node_modules/ngx-toastr";
import * as moment from "moment";
import { DialogComponent } from "./../dialog/dialog.component";
import { PollProcess } from "../../models/PollProcess";

export interface DialogFolderData {
  folder_name: string;
}

@Component({
  selector: "app-folders",
  templateUrl: "./folders.component.html",
  styleUrls: ["./folders.component.scss"]
})
export class FoldersComponent implements OnInit {
  @ViewChild("scrollMe")
  private myScrollContainer: ElementRef;
  selectedFiles: FileList;
  ref: any;
  task: any;
  uploadProgress: Observable<number>;
  downloadURL: any;
  uploadURL: any;
  fileLocation: any;
  data: any;
  isUploading: boolean;
  uploadState: Observable<string>;
  track: Track = {
    id: null,
    user_id: "",
    url: "",
    track_name: "",
    createdDate: null,
    folder_id: null,
    isPlaying: false
  };
  user_id: string;
  userName: string;
  isLoading: boolean = false;
  currentFolder: string;
  dialogFolderData: DialogFolderData;
  dialogDeleteData: DialogDeleteData;
  dialogYouTubeData: DialogYouTubeData;
  newFolderName: string;
  public isModalShown: boolean = false;
  validatingForm: FormGroup;
  files: FileList;

  folder: Folder = {
    id: null,
    folder_name: "",
    user_id: "",
    created_date: null,
    folder_type: ""
  };

  uploadFolder: Folder = {
    id: null,
    folder_name: "",
    user_id: "",
    created_date: null
  };

  @ViewChild("fileInput")
  fileInput;
  @ViewChild(MatMenuTrigger)
  trigger: MatMenuTrigger;
  folders: Folder[];
  fromUploads: string;
  navigationSubscription;
  _ruta = "";
  constructor(
    private commonService: CommonServiceService,
    private filesService: FilesService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public dialog: MatDialog,
    public toastr: ToastrService,
    public snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.dialogFolderData = {
      folder_name: ""
    };

    this.dialogYouTubeData = {
      track_name: "",
      link: ""
    };

    this.location.subscribe(x => (this.folders = []));
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });

    this.initialiseScreen();
    this._ruta = "";
    this.router.url.split("/").forEach(element => {
      if (element !== "" && this._ruta === "") this._ruta = "/" + element;
    });
  }

  initialiseScreen() {
    this.isLoading = true;
    this.isUploading = false;
    //this comes from leads or speakers - no upload option
    //this.user_id = this.route.snapshot.params["id"];
    this.user_id = this.route.snapshot.paramMap.get("id");
    this.userName = this.route.snapshot.paramMap.get("name");
    this.currentFolder = this.route.snapshot.paramMap.get("folder");
    this.fromUploads = this.route.snapshot.paramMap.get("fromUploads");

    // this.route.queryParams.subscribe(params => {
    //   this.userName = params["name"] || "";
    //   let fType = params["folder_type"] || "";
    //   if (fType) {
    //     this.folder_type = fType;

    //   }
    // });

    //if no id is passed in then from uploads - upload option
    if (this.user_id == null) {
      this.user_id = localStorage.getItem("Id");
      this.getFolders("true", this.user_id, "/");
    } else {
      this.getFolders(this.fromUploads, this.user_id, this.currentFolder);
    }

    this.commonService.uploadCompleteEvents$.forEach(data => {
      this.folders.forEach(folder => {
        if (data.id == folder.id) {
          if (folder.folder_type == "YTUPLOAD") 
          {
            folder.number_tracks = data.number_tracks;
          }else if (folder.folder_type == "DONE"){
            folder.number_tracks = data.number_tracks;
            this.isUploading = false;
          }else {
            folder.number_tracks += 1;
            this.isUploading = false;
          }
        }
      });
    });
  }

  initialiseInvites() {
    // Set default values and re-fetch any data you need.
    this.initialiseScreen();
  }

  getFolders(fromUpload: string, user_id: string, folder_path: string) {
    this.fromUploads = fromUpload;

    let folder = {
      user_id: user_id,
      folder_path: folder_path
    };

    this.filesService.getFolders(folder).subscribe(folders => {
      this.folders = folders;
      this.isLoading = false;
    }),
      error => {
        this.isLoading = false;
      };
  }

  getNewFolders(folder: Folder) {
    this.isLoading = true;
    this.folders = [];

    if (folder.folder_path == "/") {
      this.router.navigate([
        this._ruta + "/folders",
        {
          id: folder.user_id,
          folder: "/" + folder.folder_name,
          folder_type: folder.folder_type,
          name: folder.folder_name,
          fromUploads: this.fromUploads
        }
      ]);
    } else {
      this.router.navigate([
        this._ruta + "/folders",
        {
          id: folder.user_id,
          folder: folder.folder_path,
          folder_type: folder.folder_type,
          name: folder.folder_name,
          fromUploads: this.fromUploads
        }
      ]);
    }
  }

  addFiles(files: FileList) {
    this.isUploading = true;
    if (files && files[0]) {
      this.commonService.startUpload({
        files: files,
        folder: this.uploadFolder
      });
    }
  }

  openDialog(folder: Folder): void {
    const dialogRef = this.dialog.open(DialogNewFolderDialog, {
      width: "300px",
      data: { folder_name: "" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.newFolderName = result;
        let newFolderPath: string = "";
        if (folder.folder_path == "/") {
          newFolderPath = "/" + folder.folder_name + "/" + this.newFolderName;
        } else {
          newFolderPath = folder.folder_path + "/" + this.newFolderName;
        }

        let newFolder: Folder = {
          user_id: this.user_id,
          created_date: moment().toDate(),
          folder_path: newFolderPath,
          folder_name: this.newFolderName,
          id: folder.id
        };
        this.filesService.newFolder(newFolder).subscribe(
          data => {
            this.getNewFolders(folder);
          },
          error => {
            console.log(error);
          }
        );
      }
    });
  }

  addYouTubeVideo(folder: Folder) {
    const dialogRef = this.dialog.open(YoutubeDialogComponent, {
      width: "300px",
      data: { track_name: "Link", link: "", genre: "" }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.commonService.notifyStartYTUpload();
        let trackToUpload: Track = {
          track_name: data.track_name,
          createdDate: new Date(),
          user_id: folder.user_id,
          folder_id: folder.id,
          youtube_link: data.link,
          genre: data.genre
        };
        this.filesService.newTrack(trackToUpload).subscribe(data => {
          this.commonService.notifyUploadComplete(folder);
          this.commonService.notifyYTUploadComplete();
          this.snackbar.open("Track Added!", "Ok", {
            duration: 3000
          });
          error => {
            this.commonService.notifyYTUploadComplete();
            this.snackbar.open("This Link can't be downloaded!", "Ok", {
              duration: 3000
            });
          };
        });
      }
    });
  }

  addYouTubePlaylist(folder: Folder) {
    const dialogRef = this.dialog.open(YoutubeDialogComponent, {
      width: "300px",
      data: { track_name: "Link", link: "", genre: "" }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        let trackToUpload: Track = {
          track_name: data.track_name,
          createdDate: new Date(),
          user_id: folder.user_id,
          folder_id: folder.id,
          youtube_link: data.link,
          genre: data.genre
        };
        this.snackbar.open("This will probably take a long time to complete!", "Ok", {
          duration: 3000
        });
        this.isUploading = true;
        this.filesService.newPlaylist(trackToUpload).subscribe((data: PollProcess) => {
            this.startPolling(folder, data.id);
            
        }),
        error => {
          this.snackbar.open("This Link can't be downloaded!", "Ok", {
            duration: 3000
          });
        };;
      }
    });
  }

  startPolling(folder: Folder, id: number) {
    let newPoll: PollProcess = {
      status: "STARTED",
      total_tracks: 1,
      tracks_complete: 0
    };

    let numberTracksBefore = folder.number_tracks;
    this.commonService.notifyuploadYTPlaylistSubject(newPoll, folder,numberTracksBefore);
    let subscription = this.filesService
      .pollNewPlaylist(id)
      .subscribe((poll: PollProcess) => {        
        folder.folder_type = "YTUPLOAD";
        this.commonService.notifyuploadYTPlaylistSubject(poll, folder, numberTracksBefore);
        if (poll.status == "DONE") {
          this.snackbar.open("Playlist Added!", "Ok", {
            duration: 3000
          });
          subscription.unsubscribe();
        }
      });
  }

  deleteFolder(folderToBeDeleted: Folder) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { message: "This will delete all Playlist and Tracks!" }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data == true) {
        this.filesService.deleteFolder(folderToBeDeleted).subscribe(data => {
          if (data) {
            this.folders = this.folders.filter(
              folder => folder.id !== folderToBeDeleted.id
            );
            this.snackbar.open("Playlist Deleted", "Ok", {
              duration: 3000
            });
          }
        });
      }
    });
  }

  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
}

@Component({
  selector: "dialog-new-folder-dialog",
  templateUrl: "dialog-new-folder-dialog.html",
  styleUrls: ["./folders.component.scss"]
})
export class DialogNewFolderDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogNewFolderDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogFolderData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
