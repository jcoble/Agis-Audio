import { Observable } from 'rxjs';
import { UserService } from './../../services/user.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { User } from '../../models/user';
import { FoldersComponent } from '../folders/folders.component';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[];
  isLoading: boolean = false;
  
  

  @ViewChild(FoldersComponent) child: any;  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    console.log('onOnit');
    
    this.isLoading = true;
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.isLoading = false; 
    });
  }

  getFolders(user: User) {
    
    this.child.getFolders(false, user.id, '/');
    this.users = null;
  }

  sortByFirstName() {
    this.isLoading = true;
    this.users = [];
    this.userService.getUsersSortedByFirstName().subscribe(users => {
      this.users = users;
      this.isLoading = false; 
    });
  }
}
