
import { Component, OnInit } from '@angular/core';
import { passwordReset } from './../../models/passwordReset';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { FlashMessagesService } from '../../../../node_modules/angular2-flash-messages';
import { FormBuilder, FormGroup } from "@angular/forms";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ToastrService } from '../../../../node_modules/ngx-toastr';
import { MatSnackBar } from '../../../../node_modules/@angular/material';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {
  email: string;
  password: string;
  confirmpassword: string;
  code: string;
  errors: string[];
  
  user: passwordReset = {
    code: '',
    confirmPassword: '',
    email: '',
    password: ''
  }

  constructor(
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private route: ActivatedRoute,
    public snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.user = {
      code: '',
      confirmPassword: '',
      email: '',
      password: ''
    }
    this.errors = [];

    this.route.queryParams.subscribe(params => {
      let code = params["code"];      
      if(code) {
        this.code = atob(code) || "";
      }
    });
  }

  onSubmit({value, valid}: {value: passwordReset, valid: boolean}) {
    this.errors = [];    
    this.user.confirmPassword = value.confirmPassword;
    this.user.password = value.password;
    this.user.email = value.email;
    this.user.code = this.code;

    if (this.user.password != this.user.confirmPassword) {
      this.snackbar.open('Passwords do not match!', 'Ok', {
        duration: 4000
      })
      return;
    }

    if (valid) {
      
      this.authService
      .resetPassword(
        this.user
      )
      .subscribe(
        data => {
          // Register success, now login
          this.snackbar.open('Password Reset!', 'Ok',{
            duration: 4000
          })
           this.router.navigate(["/"]);
        }, // success path
        error => {
          if (error.status == 400) {
            for (var key in error.error.modelState) {
              for (var i = 0; i < error.error.modelState[key].length; i++) {
                this.errors.push(error.error.modelState[key][i]);
              }
            }

          } else {
            this.errors.push("Something went wrong");
          }
        }
      );
    }else {
      this.errors.push("Please fill out the form correctly");
    }

  }

}
