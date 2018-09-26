import { CommonServiceService } from './services/common-service.service';
import { PlaylistsComponent } from "./components/playlists/playlists.component";
import { Component, OnInit, ViewChild, HostListener, Directive, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from './services/auth.service';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material';
import { BottomSheetComponent } from './components/bottom-sheet/bottom-sheet.component';
// @Directive({ selector: '[scroll]' })

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
    
    this.authService.isLoggedIn();
    this.auth = authService;
    this.auth.loggedIn$.subscribe(
      status => { 
        this.isLoggedIn = status;
      });

  }

  ngOnInit() {
    this.commonService.toggleSideNameEvents$.forEach(data => {
      this.sideNave.toggle();
      // this.sideNavOpen = !this.sideNavOpen;
    });

    console.log(this.router.url);
  }

  onNotifyClicked(message: boolean): void {
    //this.showFullFooter = message;
    this.bottomSheet.open(BottomSheetComponent);
  }
  // @HostListener('document:scroll', [])
  //   onScroll(): void {
  //     console.log('scroll');
      
  //   }

  getUsers(){
    console.log('tab1');
    
  }

  // @HostListener('mat-sidenav-content:scroll', ['$event'])
  //   checkScroll() {
  //     const componentPosition = this.el.nativeElement.offsetTop
  //     const scrollPosition = window.pageYOffset

  //     console.log('scroll');
      

  //   }

  openedd() {
    console.log('open');
    
    this.sideNavOpen = true;
  }

  closedd() {
    console.log('closed');
    
    this.sideNavOpen = false;
  }
}
