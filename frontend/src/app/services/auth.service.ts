import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url=environment.apiUrl
  constructor(
    private httpClient:HttpClient,
    private route:Router,    
    ) { }
    public isAuthenticated():boolean {
      const token = localStorage.getItem( 'token' ) ;
      if(!token){
        this.route.navigate( ['/'])
        return false;
      }
      else{
        return true;
      }
    }
}
