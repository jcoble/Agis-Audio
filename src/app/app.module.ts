import { BottomSheetComponent } from './components/bottom-sheet/bottom-sheet.component';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from './services/user.service';
import { CommonServiceService } from './services/common-service.service';
import { AuthService } from './services/auth.service';
import { environment } from './../environments/environment';
import { FilesService } from './services/files.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule} from 'ngx-toastr';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { PlaylistsComponent } from './components/playlists/playlists.component';
import { NavborComponent } from './components/navbor/navbor.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent, DialogResetPassDialog } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UploadComponent } from './components/upload/upload.component';
import { HttpModule } from '@angular/http';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TracksComponent } from './components/tracks/tracks.component';
import { FoldersComponent, DialogNewFolderDialog } from './components/folders/folders.component';
import { UsersComponent } from './components/users/users.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { TokenInterceptor } from './interceptor/authInterceptor';
import { SearchTracksComponent } from './components/search-tracks/search-tracks.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import {MatTabsModule} from '@angular/material/tabs';
import { MyplaylistsComponent } from './components/myplaylists/myplaylists.component';
import { MatIconModule, MatSelectModule, MatBadgeModule, MatProgressBarModule, MatChipsModule, MatInputModule, MatSnackBarModule, MatMenuModule, MatSidenavModule, MatToolbarModule, MatFormFieldModule, MatListModule, MatDividerModule, MatCheckboxModule } from '../../node_modules/@angular/material';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { MatAutocompleteModule } from '@angular/material';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { LandingComponent } from './components/landing/landing.component';
// import { ParallaxModule, ParallaxConfig } from 'ngx-parallax';
import { YoutubePlayerModule } from 'ngx-youtube-player';
import { YoutubeDialogComponent } from './components/youtube-dialog/youtube-dialog.component';
import { ShareComponent } from './components/share/share.component';
import { PlaylistDialogComponent } from './components/playlist-dialog/playlist-dialog.component';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { TrendingComponent } from './components/trending/trending.component';
import { YoutubeTracksComponent } from './components/youtube-tracks/youtube-tracks.component';
import { LazyLoadImagesModule } from 'ngx-lazy-load-images';
import { HomeComponent } from './components/home/home.component';
import { ParallaxScrollModule } from 'ng2-parallaxscroll';
import { ScrollToModule } from 'ng2-scroll-to-el';
import { RedblackDirective } from './directives/redblack.directive';
import { BackgroundfadeinDirective } from './directives/backgroundfadein.directive';
import { HttpErrorHandler } from './services/http-error-handler.service';
@NgModule({
  declarations: [
    AppComponent,
    PlaylistsComponent,
    NavborComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    UploadComponent,
    FooterComponent,
    TracksComponent,
    FoldersComponent,
    UsersComponent,
    SearchTracksComponent,
    DialogComponent,
    DialogComponent,
    MyplaylistsComponent,
    ResetpasswordComponent,
    DialogResetPassDialog,
    DialogNewFolderDialog,
    SidenavComponent,
    LandingComponent,
    YoutubeDialogComponent,
    ShareComponent,
    PlaylistDialogComponent,
    BottomSheetComponent,
    TrendingComponent,
    YoutubeTracksComponent,
    HomeComponent,
    RedblackDirective,
    BackgroundfadeinDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, 'clientpanel'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FlashMessagesModule.forRoot(),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    MDBBootstrapModule.forRoot(),
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule, 
    MatProgressSpinnerModule,
    HttpClientModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    HttpClientModule,
    HttpModule,
    NgProgressModule.forRoot({
      color: '#f71cff',
      thick: true,
      spinner: false
    }),
    NgProgressHttpModule,
    environment.production ? ServiceWorkerModule.register('ngsw-worker.js') : [],
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatBadgeModule,
    MatProgressBarModule,
    MatChipsModule,
    MatInputModule,
    MatSnackBarModule,
    MatMenuModule,
    MatTabsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatListModule,
    MatDividerModule,
    YoutubePlayerModule,
    MatCheckboxModule,
    MatBottomSheetModule,
    LazyLoadImagesModule,
    ParallaxScrollModule,
    ScrollToModule.forRoot()
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [FilesService, AuthService, CommonServiceService, UserService, HttpErrorHandler,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}],
  bootstrap: [AppComponent],
  entryComponents: [DialogComponent, LoginComponent, DialogResetPassDialog, DialogNewFolderDialog, YoutubeDialogComponent, PlaylistDialogComponent, BottomSheetComponent]
})
export class AppModule { }
 