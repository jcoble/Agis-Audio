import { TokenData } from "./../../models/tokenData";
import { Component, OnInit, Inject } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { FlashMessagesService } from "angular2-flash-messages";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { ToastrService } from '../../../../node_modules/ngx-toastr';

export interface DialogData {
  email: string
}

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  errors: string[];
  dialogData: DialogData;
  isLoggingIn: boolean;

  emailToResetPass: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    public dialog: MatDialog,
    public toastr: ToastrService,
    public snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.errors = [];
    this.dialogData = {
      email: ''
    }
    // if (this.authService.isLoggedIn()) {
    //   this.router.navigate(["/playlists"]);
    // }
  }

  onSubmit() {
    this.errors = [];
    this.isLoggingIn = true;
    this.authService.login(this.email, this.password).subscribe(
      () => {
        this.isLoggingIn = false;
        this.router.navigate(["/playlists"]);
      }, // success path
      error => {
        this.isLoggingIn = false;
        if (error.status == 400) {
          this.errors.push(error.error.error_description);
        } else {
          this.errors.push("Something went wrong");
        }
      }
    );
  }

  onRegisterClick() {
    this.router.navigate(['/register']);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogResetPassDialog, {
      width: '250px',
      data: {email: this.email}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.email = result;
        this.dialogData.email = this.email;
       
        this.authService.forgotPassword(this.dialogData).subscribe(
          () => this.snackbar.open('An email was sent to reset', 'Ok',{
            duration: 4000
          }),
          error => this.errors.push(error.error.error_description)
        )
      }
      
    });
  }
  // signInWithGoogle() {
  //   this.authService
  //     .socialSignIn()
  //     .then(res => {
  //       this.router.navigate(["/"]);
  //     })
  //     .catch(err => {
  //       this.flashMessage.show(err.message, {
  //         cssClass: "alert-danger",
  //         timeout: 4000
  //       });
  //     });
  // }
}

@Component({
  selector: 'dialog-reset-pass-dialog',
  templateUrl: 'dialog-reset-pass-dialog.html',
})
export class DialogResetPassDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogResetPassDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
