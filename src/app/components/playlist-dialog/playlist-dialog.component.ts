import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Folder } from '../../models/folder';

@Component({
  selector: 'app-playlist-dialog',
  templateUrl: './playlist-dialog.component.html',
  styleUrls: ['./playlist-dialog.component.scss']
})
export class PlaylistDialogComponent implements OnInit {
  playlistFormGroup : FormGroup
  selected: Folder[];
  folders: Folder[];
  folderNames: any;
  constructor(
    private dialogRef: MatDialogRef<PlaylistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Folder[],
    private formBuilder: FormBuilder,
    public snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.folders = this.data;
    this.folderNames = this.folders.map(function (obj) {
      return obj.folder_name;
    })
    
    this.playlistFormGroup = this.formBuilder.group({
      folders: this.formBuilder.array([])
    });

    this.selected = []
  }

  onChange(event) {

    
    const folders = <FormArray>this.playlistFormGroup.get('folders') as FormArray;

    if(event.checked) {
      folders.push(new FormControl(event.source.value))
      this.selected.push(event.source.value)
    } else {
      const i = folders.controls.findIndex(x => x.value === event.source.value);
      folders.removeAt(i);
      const a = this.selected.findIndex(x => x.folder_name === event.source.value);
      this.selected.splice(a);
    }    
  }

  onClose(): void {
    let addFolders: Folder[];
    // this.selected = this.playlistFormGroup.value;
    // console.log(this.selected);
    
    // this.folders.forEach(folder => {
    //   if (this.selected.includes(folder.folder_name)) {
    //     addFolders.push(folder);
    //   }
    // });
    if(this.selected.length == 0) {
      this.snackbar.open("You must select at least one playlist!", "Ok", {
        duration: 3000
      });
      return;
    }
    this.dialogRef.close(this.selected);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
