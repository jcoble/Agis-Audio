
import { Component, OnInit } from '@angular/core';
import { passwordReset } from './../../models/passwordReset';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ToastrService } from '../../../../node_modules/ngx-toastr';
import { MatSnackBar } from '../../../../node_modules/@angular/material';
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
import { CustomValidators } from '../register/register.component';

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
  isResetting: boolean = false;
  user: passwordReset = {
    code: '',
    confirmPassword: '',
    email: '',
    password: ''
  }
  public frmReset: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public snackbar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.frmReset = this.createResetForm();
   }

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

  createResetForm(): FormGroup {
    return this.fb.group(
      {
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

  onSubmit() {
    this.isResetting = true;
    this.errors = [];    
    this.user.confirmPassword = this.frmReset.value.confirmPassword;
    this.user.password = this.frmReset.value.password;
    this.user.email = this.frmReset.value.email;
    this.user.code = this.code;

    if (this.user.password != this.user.confirmPassword) {
      this.snackbar.open('Passwords do not match!', 'Ok', {
        duration: 4000
      })
      return;
    }

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
          this.isResetting = false;
           this.router.navigate(["/login"]);
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

  }

}
