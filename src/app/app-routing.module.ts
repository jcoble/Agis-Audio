import { TrendingComponent } from './components/trending/trending.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PlaylistsComponent } from './components/playlists/playlists.component';
import { UploadComponent } from './components/upload/upload.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';


import { AuthGuard } from './guards/auth.guard';
import { TracksComponent } from './components/tracks/tracks.component';
import { FoldersComponent } from './components/folders/folders.component';
import { UsersComponent } from './components/users/users.component';
import { SearchTracksComponent } from './components/search-tracks/search-tracks.component';
import { MyplaylistsComponent } from './components/myplaylists/myplaylists.component';
import { LandingComponent } from './components/landing/landing.component';
import { ShareComponent } from './components/share/share.component';

const routes: Routes = [
  { path: '', component:  PlaylistsComponent, canActivate:[AuthGuard]},
  { path: 'tracks/:id', component:  TracksComponent, canActivate:[AuthGuard]},
  { path: 'uploads/:id', component:  TracksComponent, canActivate:[AuthGuard]},
  { path: 'uploads', component:  UploadComponent, canActivate:[AuthGuard]},
  { path: 'login', component:  LoginComponent},
  { path: 'register', component:  RegisterComponent},
  { path: 'trending', component:  TrendingComponent, canActivate:[AuthGuard]},
  { path: 'tracks', component:  TracksComponent, canActivate:[AuthGuard]},
  { path: 'playlists/tracks/:id', component:  TracksComponent, canActivate:[AuthGuard]},
  { path: 'myplaylists/tracks/:id', component:  TracksComponent, canActivate:[AuthGuard]},
  { path: 'playlists/folders', component: FoldersComponent, canActivate:[AuthGuard], runGuardsAndResolvers: 'always'},
  { path: 'playlists', component: PlaylistsComponent, canActivate:[AuthGuard]},
  { path: 'playlists/search/:search_value', component: SearchTracksComponent, canActivate:[AuthGuard] },
  { path: 'search/:search_value', component: SearchTracksComponent, canActivate:[AuthGuard] },
  { path: 'myplaylists', component: MyplaylistsComponent, canActivate:[AuthGuard] },
  { path: 'myplaylists/folders', component: FoldersComponent, canActivate:[AuthGuard], runGuardsAndResolvers: 'always' },
  { path: 'resetpassword', component: ResetpasswordComponent } ,
  { path: 'share', component: ShareComponent } 



];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes,{useHash:true, onSameUrlNavigation: 'reload'}) ],
  providers: [AuthGuard],
  declarations: []
})
export class AppRoutingModule { }
