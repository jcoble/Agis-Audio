import { CommonServiceService } from './../../services/common-service.service';
import { Track } from './../../models/tracks'; 
import { FilesService } from './../../services/files.service'; 
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router,ActivatedRoute, Params } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import { UsersComponent } from '../users/users.component';
import { Observable } from '../../../../node_modules/rxjs';
import { FormControl } from '../../../../node_modules/@angular/forms';


export interface SortType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {
  folder_type: string = "playlists";

  
  sortTypes: SortType[] = [
    {value: 'recent-playlists-0', viewValue: 'Recent Uploaded Tracks'},
    {value: 'most-liked-playlists-1', viewValue: 'Most Liked Tracks'},
    {value: 'users-sorted-first-3', viewValue: 'Sort Users By First Name'}
  ]
  @ViewChild(UsersComponent) child: any;
  constructor(
    private filesService: FilesService, 
    private commonService: CommonServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
   } 

  ngOnInit() {

  }

  doSort(id: string) {
    if (id == "users-sorted-first-3") {
      this.child.sortByFirstName();
    }else {
      this.router.navigate(["playlists/search/"+id]);
    }
    
  }
 

}
