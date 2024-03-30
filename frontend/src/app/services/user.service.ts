import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  url=environment.apiUrl
  constructor(private httpClient:HttpClient) { }
  signup(data:any){
    return this.httpClient.post(this.url+"/user/signup",data,{headers:new HttpHeaders().set('content-Type',"application/json")})
  }
  forgotpassword(data:any){
    return this.httpClient.post(this.url+"/user/forgotpassword",data,{headers:new HttpHeaders().set('content-Type',"application/json")})
  }
 
  login(data:any){
    return this.httpClient.post(this.url+"/user/login",data,{headers:new HttpHeaders().set('content-Type',"application/json")})
  }

  checkToken(){
    return this.httpClient.get(this.url+"/user/checkToken")
  }

  changePassword(data:any){
    return this.httpClient.post(this.url+"/user/changePassword",data,{headers:new HttpHeaders().set('content-Type',"application/json")})
  }


    
}
