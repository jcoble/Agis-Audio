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
    if (localStorage.getItem("tokenData")) {
      // if (this.router.url == "/") {
      //   this.router.navigate(["/playlists"])
      // }
      return true;
    }
    // if (this.router.url == "/") {
      
    //   window.location.href = "https://www.agisaudio.com/app/index.html"
    // }else  {
      this.router.navigate(["/login"]); 
    // }
  }
}
