import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { FlashMessagesService } from "angular2-flash-messages";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { User } from "../../models/user";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  email: string; 
  password: string;
  firstName: string;
  lastName: string;
  isLoggingIn: boolean;

  user: User = {
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  }
  successfulSave: boolean;
  errors: string[]; 

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) {}

  ngOnInit() {
    this.errors = [];
    this.user = {
      first_name: '',
      last_name: '',
      email: '',
      password: ''
    }
    if (this.authService.isLoggedIn()) {
      this.router.navigate(["/playlists"]);
    }
  }

  signUpWithGoogle() {
    // this.authService
    //   .socialSignIn()
    //   .then(res => {
    //     this.flashMessage.show("You are now registered and logged in", {
    //       cssClass: "alert-success",
    //       timeout: 4000
    //     });
    //     this.router.navigate(["/"]);
    //   })
    //   .catch(err => {
    //     this.flashMessage.show(err.message, {
    //       cssClass: "alert-danger",
    //       timeout: 4000
    //     });
    //   });
  }

  onLoginClick(){
    this.router.navigate(['/login']);
  }

  onSubmit({value, valid}: {value: User, valid: boolean}) {
    this.errors = [];
    this.isLoggingIn = true;
    if (valid) {
      
      this.authService
      .registerWithEmailPass(
        value.email,
        value.password,
        value.first_name,
        value.last_name
      )
      .subscribe(
        data => {
          // Register success, now login
          this.authService.login(value.email, value.password).subscribe(data => {
            this.isLoggingIn = false;
            this.router.navigate(["/"]);
          });
        }, // success path
        error => {
          this.isLoggingIn = false;
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
      this.isLoggingIn = false;
      this.errors.push("Please fill out the form correctly");
    }
    
  }
}
