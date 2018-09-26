import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router } from "../../../../node_modules/@angular/router";
import { CommonServiceService } from "../../services/common-service.service";

@Component({
  selector: "app-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.scss"]
})
export class SidenavComponent implements OnInit {
  private auth: AuthService;
  isLoggedIn: boolean;
  name: string;
  playlist_id: string;
  constructor(
    private authService: AuthService,
    private router: Router,
    private commenServie: CommonServiceService
  ) {
    this.auth = authService;
    this.auth.loggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      if (this.isLoggedIn) {
        let first_name = localStorage.getItem("first_name");
        let last_name = localStorage.getItem("last_name");
        this.name = first_name + " " + last_name;
      }else {
        this.name = '';
      }
    });
  }

  ngOnInit() {}

  onLogoutClick() {
    // if (this.navbaridRef.shown) {
    //   this.navbaridRef.toggle(event);
    // }
    this.authService.logout();
    this.isLoggedIn = false;
    // this.flashMessage.show("You are now logged out", {
    //   cssClass: "alert-success",
    //   timeout: 4000
    // });
    this.toggleSideNav();
    localStorage.removeItem("tokenData");
    this.router.navigate(["/login"]);
  }

  onLoginClick() {
    this.toggleSideNav();
    this.router.navigate(["/login"]);
  }

  onRegisterClick() {
    this.toggleSideNav();
    this.router.navigate(["/register"]);
  } 

  onMyPlaylistsClick() {
    this.toggleSideNav();
    this.router.navigate(["/myplaylists"]);
  }

  onUsersClick() {
    this.toggleSideNav();
    this.router.navigate(["/playlists"]);
  }

  onTrendingClick(){
    this.toggleSideNav();
    this.router.navigate(["/trending"]);
  }

  onYouTubePlaylistLoad() {
    this.toggleSideNav();
    this.router.navigate(["/youtube/"+ this.playlist_id])
    this.playlist_id = "";
  }

  toggleSideNav() {
    this.commenServie.toggleSideNav();
  }
}
