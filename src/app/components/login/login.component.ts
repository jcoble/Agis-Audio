import { TokenData } from "./../../models/tokenData";
import { Component, OnInit, Inject } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { ToastrService } from '../../../../node_modules/ngx-toastr';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';

export interface DialogData {
  email: string
}

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  // email: string;
  // password: string;
  errors: string[];
  dialogData: DialogData;
  isLoggingIn: boolean;

  emailToResetPass: string;
  
  public frmSignIn: FormGroup;
  constructor(
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    public toastr: ToastrService,
    public snackbar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.frmSignIn = this.createSignInForm();
  }

  ngOnInit() {
    this.errors = [];
    this.dialogData = {
      email: ''
    }
    // if (this.authService.isLoggedIn()) {
    //   this.router.navigate(["/playlists"]);
    // }
  }

  createSignInForm(): FormGroup {
    return this.fb.group(
      {
        // email is required and must be a valid email email
        email: [
          null,
          Validators.compose([Validators.email, Validators.required])
        ],
        password: [
          null,
          Validators.compose([Validators.required])
        ]
      }
    );
  }

  onSubmit() {
    this.errors = [];
    this.isLoggingIn = true;
    this.authService.login(this.frmSignIn.value.email, this.frmSignIn.value.password).subscribe(
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
      data: {email: this.frmSignIn.value.email}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.frmSignIn.value.email = result;
        this.dialogData.email = this.frmSignIn.value.email;
       
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
