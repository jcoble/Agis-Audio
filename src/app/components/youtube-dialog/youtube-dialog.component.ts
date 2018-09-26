import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DialogYouTubeData } from '../../models/DialogYouTubeData';

@Component({
  selector: 'app-youtube-dialog',
  templateUrl: './youtube-dialog.component.html',
  styleUrls: ['./youtube-dialog.component.scss']
})
export class YoutubeDialogComponent implements OnInit {
  dataOut: DialogYouTubeData;
  constructor(
    private dialogRef: MatDialogRef<YoutubeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogYouTubeData,
    public snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.dataOut = this.data;
  }

  onClose(): void {
    if(this.data.genre == "" || this.data.link == "")
    {
      this.snackbar.open("You must select enter a genre and link!", "Ok", {
        duration: 3000
      });
      return;
    }
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
