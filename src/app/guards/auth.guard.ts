import { Observable } from "rxjs";
import { AngularFireAuth } from "angularfire2/auth";
import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    // private afAuth: AngularFireAuth
    private authService: AuthService
  ) {}

  canActivate() {
    console.log('inside can activate');
    console.log(this.router.url);
    
    if (localStorage.getItem("tokenData")) {
      console.log(this.router.url);
      // if (this.router.url == "/") {
      //   this.router.navigate(["/playlists"])
      // }
      return true;
    }
    // console.log(this.router.url);
    // if (this.router.url == "/") {
    //   console.log('inside external link redirrect');
      
    //   window.location.href = "https://www.agisaudio.com/app/index.html"
    // }else  {
      this.router.navigate(["/login"]); 
    // }
  }
}
