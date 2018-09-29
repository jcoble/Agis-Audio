import { CommonServiceService } from './../../services/common-service.service';
import { element } from 'protractor';
import { AuthService } from "./../../services/auth.service";
import { Component, OnInit,ViewChild, ElementRef, AfterViewInit, HostListener, Input } from "@angular/core";
import { Router } from "@angular/router";
import { FlashMessagesService } from "angular2-flash-messages";
import { FilesService } from "../../services/files.service";
import { Track } from "../../models/tracks";
import { Observable } from "rxjs";
import {Location} from '@angular/common';
import { NavbarComponent as navmdb } from "../../../../node_modules/angular-bootstrap-md/navbars";

@Component({
  selector: "app-navbor",
  templateUrl: "./navbor.component.html",
  styleUrls: ["./navbor.component.scss"]
})

export class NavborComponent implements OnInit, AfterViewInit {
  @ViewChild('search') searchInput: ElementRef;
  // @ViewChild('navMain')
  // private navbaridRef: navmdb;

  private wasInside = false;
  isLoggedIn: boolean;
  loggedInUser: string;
  searchValue: string;
  tracks: Track[];
  private auth: AuthService;
  isSearching: boolean = false;
  value = '';
  depth: string = 'z-depth-1';
  

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private filesServie: FilesService,
    private _location: Location,
    private eRef: ElementRef,
    private commenServie: CommonServiceService
  ) {
    this.auth = authService;
    this.auth.loggedIn$.subscribe(
      status => { 
        this.isLoggedIn = status;
      }); 

      
  }


  ngOnInit() {
    this.authService.isLoggedIn();
  }

  ngAfterViewInit() {

  }

  toggleSideNav() {
    this.commenServie.toggleSideNav();
  }

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
    localStorage.removeItem('tokenData');
    this.router.navigate(["/login"]);
  }

  onSubmit(value) {
    if (value) {
      this.router.navigate(["/search/"+value]);
      this.searchInput.nativeElement.blur();
      this.value = '';
    }
    
  }

  keydown($event) {
    if ($event.keyCode == 13) {
      $event.target.blur();
    }
  }

  focusInput() {
    this.searchInput.nativeElement.focus();
  }


  back() {
    this._location.back();
  }
}
