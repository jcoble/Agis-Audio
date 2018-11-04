import { PublicVariablesService } from './public-variables.service';
import { MatSnackBar } from '@angular/material';
import { DialogData } from './../components/login/login.component';
import { TokenData } from './../models/tokenData';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { User } from "../models/user";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { catchError, retry, map } from "rxjs/operators";
import { RegisterReturnData } from "../models/registerReturnData";
import * as moment from "moment";
import { Subject } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { passwordReset } from '../models/passwordReset';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';


const httpOptions = {
  headers: new HttpHeaders({ "content-type": "application/json " })
};

@Injectable()
export class AuthService {
  authState: any = null;
  currentUserId: string;
  users: Observable<User[]>;
  user: User;

  // apiUrlTest: string = "http://localhost:63298/";
  // apiUrl: string = 'http://www.streamrecoveryaudio.com/api2/';
  //apiUrl: string = 'http://localhost:63298/';
  apiUrl: string = this.global.getAuthApiUrl();
  client_Id: string = "ngAuthApp";
  data: Observable<any>;

  private loggedIn = new Subject<boolean>();
  loggedIn$ = this.loggedIn.asObservable();

  private handleError: HandleError;

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private snackbar: MatSnackBar,
    private global: PublicVariablesService,
    httpErrorHandler: HttpErrorHandler
  ) {
    this.handleError = httpErrorHandler.createHandleError('AuthService');
  }

  login(email: string, password: string): Observable<any> {
    let params = new HttpParams()
      .set("grant_type", "password")
      .set("username", email)
      .set("password", password)
      .set("client_id", "ngAuthApp");

    return this.http.post<TokenData>(this.apiUrl + "Token", params).pipe(map(res => {
      this.setSession(res);
      this.snackbar.open('You are now logged in, Spartan!', 'Ok',{
        duration: 3000
      })
      this.loggedIn.next(true);
    })).pipe(
      retry(3)
    );
  }

  getAuthToken() : string {
    let id_token = localStorage.getItem('id_token');
    if(id_token != null) {
      return id_token;
    }
 
    return '';
  }

  refreshToken() : Observable<TokenData> {
    let currentUser = JSON.parse(localStorage.getItem('tokenData'));
    let token = currentUser.refresh_token;
    let params = new HttpParams()
      .set("grant_type", "refresh_token")
      .set("refresh_token", token)
      .set("client_id", "ngAuthApp")

    return this.http.post<TokenData>(this.apiUrl + "Token", params)
      .pipe(
        map(user => {
 
          if (user && user.access_token) {
            localStorage.setItem("id_token", user.access_token);
            localStorage.setItem("refresh_token", user.refresh_token);
            localStorage.setItem("user_name", user.userName);
            localStorage.setItem("last_name", user.last_name);
            localStorage.setItem("first_name", user.first_name);
            localStorage.setItem("Id", user.Id);
            // localStorage.setItem("googleToken", user.googleToken);

            localStorage.setItem("tokenData", JSON.stringify(user));
          }
 
          return <TokenData>user;
      }));
  }

  registerWithEmailPass(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Observable<any> {
    let params = new HttpParams()
      .set("Email", email)
      .set("Password", password)
      .set("ConfirmPassword", password)
      .set("first_name", firstName)
      .set("last_name", lastName);

    return this.http.post<RegisterReturnData>(
      this.apiUrl + "api/Account/Register",
      params
    )
    // .pipe(
    //   retry(3),
    //   catchError(this.handleError('registerWithEmailPass', null))
    // );
  }

  // Set the logged in user's token data to local storage
  setSession(tokenData: TokenData) {
    const expiresAt = moment().add(tokenData.expires_in, "second");

    localStorage.setItem("id_token", tokenData.access_token);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
    localStorage.setItem("refresh_token", tokenData.refresh_token);
    localStorage.setItem("user_name", tokenData.userName);
    localStorage.setItem("last_name", tokenData.last_name);
    localStorage.setItem("first_name", tokenData.first_name);
    localStorage.setItem("Id", tokenData.Id);
    localStorage.setItem("tokenData", JSON.stringify(tokenData));
  }

  forgotPassword (dialogData: DialogData): Observable<any>{
    const url = this.apiUrl + 'api/Account/ForgotPassword';
    return this.http.post<DialogData>(url, dialogData, httpOptions);
  }

  resetPassword (user: passwordReset): Observable<any> {
    const url = this.apiUrl + 'api/Account/ResetPassword';
    return this.http.post<passwordReset>(url, user, httpOptions);
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("tokenData");
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  public isLoggedIn(): boolean {
    let token = localStorage.getItem('id_token');
    if(token) {
      this.loggedIn.next(true);
      return true;
    }else {
      this.loggedIn.next(false);
      return false;
    }
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }
}
