import { CommonServiceService } from './services/common-service.service';
import { PlaylistsComponent } from "./components/playlists/playlists.component";
import { Component, OnInit, ViewChild, HostListener, Directive, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from './services/auth.service';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material';
import { BottomSheetComponent } from './components/bottom-sheet/bottom-sheet.component';
// @Directive({ selector: '[scroll]' })
declare var $: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "app";
  routeLinks: any[];
  @ViewChild('sidenav') public sideNave;
  private auth: AuthService;
  isLoggedIn: boolean;
  activeLinkIndex = 0;
  sideNavOpen: boolean = false;
  navbarShown: boolean = true;
  marginTop: number =0;
  showFullFooter: boolean = false;

  constructor(
    private router: Router,
    private commonService: CommonServiceService,
    private authService: AuthService,
    public el: ElementRef,
    private bottomSheet: MatBottomSheet
) {
    this.routeLinks = [
      {
        link: "playlists",
        label: 'Users'
      },
      {
        link: "myplaylists",
        label: 'My Playlists'
      },
      {
        link: "trending",
        label: "Trending"
      }
    ];
    
    
    this.auth = authService;
    this.auth.loggedIn$.subscribe(
      status => { 
        this.isLoggedIn = status;
      });
    
      this.authService.isLoggedIn();
    if (localStorage.getItem("tokenData")) {      
      this.router.navigate(["/playlists"]);
      return;
    }

    // if(this.router.url == "/"){
    //   this.navbarShown = false;
    // }else {
    //   this.navbarShown = true;
    // }
    
    $(window).scroll(function() {
      let wScroll = $(this).scrollTop();
      $('.header-container').css({
        'transform': 'translate(0px, ' + wScroll * 1.53 + '%)'
      });
    });
  }

  ngOnInit() {
    this.commonService.toggleSideNameEvents$.forEach(data => {
      this.sideNave.toggle();
      // this.sideNavOpen = !this.sideNavOpen;
    });
  }

  onNotifyClicked(message: boolean): void {
    //this.showFullFooter = message;
    this.bottomSheet.open(BottomSheetComponent);
  }

  getUsers(){
    
  }

  openedd() {    
    this.sideNavOpen = true;
  }

  closedd() {    
    this.sideNavOpen = false;
  }

}
