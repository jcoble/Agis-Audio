import { FoldersComponent, DialogFolderData, DialogNewFolderDialog } from './../folders/folders.component';
import { CommonServiceService } from "./../../services/common-service.service";
import { Folder } from "./../../models/folder";
import { FilesService } from "./../../services/files.service";
import { Component, ViewChild, OnInit, Output, Input } from "@angular/core";
import * as _ from "lodash";
import { AngularFireStorage } from "angularfire2/storage";
import { Track } from "../../models/tracks";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { EventEmitter } from "events";
import * as moment from "moment";
import { Router } from "@angular/router";
import { MatDialog } from '../../../../node_modules/@angular/material';
//import { ModalDirective } from '@angular/core';
// import { map } from 'rxjs/operators';

@Component({
  selector: "app-upload",
  templateUrl: "./upload.component.html",
  styleUrls: ["./upload.component.css"]
})
export class UploadComponent implements OnInit {
  selectedFiles: FileList;
  ref: any;
  task: any;
  uploadProgress: Observable<number>;
  downloadURL: any;
  uploadURL: any;
  fileLocation: any;
  data: any;
  uploadState: Observable<string>;
  dialogFolderData: DialogFolderData;
  newFolderName: string;
  track: Track = {
    id: null,
    user_id: "",
    url: "",
    track_name: "",
    createdDate: null,
    folder_id: null,
    isPlaying: false
  };


  public isModalShown: boolean = false;
  validatingForm: FormGroup;
  files: FileList;

  folder: Folder = {
    id: null,
    folder_name: "",
    user_id: "",
    created_date: null,
    folder_type: ''
  };

  folders: Folder[];
  modalMessage: string;

  @ViewChild(FoldersComponent) child: any;
  @Output() uploadClicked = new EventEmitter();

  constructor(
    private filesService: FilesService,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.validatingForm = fb.group({
      minlength: [null, Validators.minLength(5)],
      required: [null, Validators.required]
    });
  }

  ngOnInit() {
    // Get folders belonging to user
    this.dialogFolderData = {
      folder_name: ''
    }
  }

  onSubmit({ value, valid }: { value: Folder; valid: boolean }) {
    if (!valid) {
      this.modalMessage = "Please fill in the folder name correctly!";
      this.isModalShown = true;
    } else {
      let userId = localStorage.getItem("Id");
      let newFolder: Folder = {
        user_id: userId,
        created_date: moment().toDate(),
        folder_path: '/',
        folder_name: value.folder_name
      }
      this.filesService.newFolder(newFolder).subscribe(
        data => {
          this.child.getFolders('true', newFolder.user_id, '/'); 
        },
        error => {
          console.log(error);
        }
      );
    }
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogNewFolderDialog, {
      width: '250px',
      data: {folder_name: ''}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.newFolderName = result;
        let userId = localStorage.getItem("Id");
        let newFolder: Folder = {
          user_id: userId,
          created_date: moment().toDate(),
          folder_path: '/',
          folder_name: this.newFolderName
        }
        this.filesService.newFolder(newFolder).subscribe(
          data => {            
            this.child.getFolders('true', newFolder.user_id, '/'); 
          },
          error => {
            console.log(error);
          }
        );
      }
      
    });
  }

  // upload(file: File, folder: Folder) {
  //   this.track.directory = 'leads';
  //   this.track.track_name = file.name;
  //   this.track.createdDate = new Date();
  //   this.track.file_location = 'leads/' + this.track.track_name;
  //   this.ref = this.afStorage.ref(this.track.file_location);

  //   this.task = this.ref.put(file);
  //   //this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
  //   this.uploadProgress = this.task.percentageChanges();

  //   this.downloadURL = this.task.downloadURL();

  //   this.task.then(snapshot => {
  //     this.track.url = snapshot.downloadURL;
  //     this.filesService.newTrack(this.track, folder);
  //     this.modalMessage = 'File(s) Uploaded';
  //     this.isModalShown = true;
  //   });
  // }

  public hideModal(): void {
    this.isModalShown = false;
  }
}
