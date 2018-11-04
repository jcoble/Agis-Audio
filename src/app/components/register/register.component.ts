import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { User } from "../../models/user";
import { MatSnackBar } from "@angular/material";
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormGroup,
  FormBuilder,
  ValidationErrors,
  ValidatorFn,
  AbstractControl
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

export class CustomValidators {
  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }

  static passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get("password").value; // get password from our password form control
    const confirmPassword: string = control.get("confirmPassword").value; // get password from our confirmPassword form control
    // compare is the password math
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      control.get("confirmPassword").setErrors({ NoPassswordMatch: true });
    }
  }
}
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
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  };
  successfulSave: boolean;
  errors: string[];

  public frmSignup: FormGroup;
  constructor(
    private authService: AuthService,
    private router: Router,
    public snackbar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.frmSignup = this.createSignupForm();
  }

  ngOnInit() {
    this.createSignupForm();
    this.errors = [];
    this.user = {
      first_name: "",
      last_name: "",
      email: "",
      password: ""
    };
    if (this.authService.isLoggedIn()) {
      this.router.navigate(["/playlists"]);
    }
  }

  createSignupForm(): FormGroup {
    return this.fb.group(
      {
        firstName: new FormControl("", [Validators.required]),
        lastName: new FormControl("", [Validators.required]),
        // email is required and must be a valid email email
        email: [
          null,
          Validators.compose([Validators.email, Validators.required])
        ],
        password: [
          null,
          Validators.compose([
            // 1. Password Field is Required
            Validators.required,
            // 2. check whether the entered password has a number
            CustomValidators.patternValidator(/\d/, { hasNumber: true }),
            // 3. check whether the entered password has upper case letter
            CustomValidators.patternValidator(/[A-Z]/, {
              hasCapitalCase: true
            }),
            // 4. check whether the entered password has a lower-case letter
            CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
            // 5. Has a minimum length of 8 characters
            Validators.minLength(8)
          ])
        ],
        confirmPassword: [null, Validators.compose([Validators.required])]
      },
      {
        // check whether our password and confirm password match
        validator: CustomValidators.passwordMatchValidator
      }
    );
  }

  onLoginClick() {
    this.router.navigate(["/login"]);
  }

  onSubmit() {

    this.isLoggingIn = true;

    this.authService
      .registerWithEmailPass(
        this.frmSignup.value.email,
        this.frmSignup.value.password,
        this.frmSignup.value.firstName,
        this.frmSignup.value.lastName
      )
      .subscribe(
        data => {
          // Register success, now login
          this.authService
            .login(this.frmSignup.value.email, this.frmSignup.value.password)
            .subscribe(data => {
              this.isLoggingIn = false;
              this.router.navigate(["/playlists"]);
            });
        }, // success path
        error => {
          this.isLoggingIn = false;
          if (error.status == 400) {
            let errorString = "";
            for (var key in error.error.modelState) {
              for (var i = 0; i < error.error.modelState[key].length; i++) {
                this.errors.push(error.error.modelState[key][i]);
                errorString += error.error.modelState[key][i];
              }
            }
            this.snackbar.open(errorString, "Ok", {
              duration: 6000
            });
          } else {
            this.errors.push("Something went wrong");
          }
        }
      );
  }
}
