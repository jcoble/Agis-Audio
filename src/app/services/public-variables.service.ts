import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PublicVariablesService {
  apiUrl: string = 'https://www.agisaudio.com/api2/api/';
  // apiUrlTest: string = 'http://localhost:57717/api/';
  apiUrlTest: string ='https://www.agisaudio.com/api2/api/';

  apiUrlAuth: string = 'https://www.agisaudio.com/api2/';
  // apiUrlTestAuth: string = 'http://localhost:57717/';
  apiUrlTestAuth: string = 'https://www.agisaudio.com/api2/';

  constructor() { }

  public getApiUrl() {
    if (isDevMode()) {
      return this.apiUrlTest;
    }else {
      return this.apiUrl; 
    }
  }

  public getAuthApiUrl () {
    if (isDevMode()) {
      return this.apiUrlTestAuth; 
    }else {
      return this.apiUrlAuth;
    }
  }
}
