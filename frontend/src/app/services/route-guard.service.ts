import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';
import { jwtDecode as jwt_decode } from "jwt-decode";
import { GlobalConstant } from '../shared/global-constants';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(
    private router:Router,    
    public  auth:AuthService,
    private snackbar:SnackbarService
  ) { }
  canActivate(route:ActivatedRouteSnapshot):boolean{
    let expectedRoleArray = route.data;
    expectedRoleArray = expectedRoleArray. expectedRole;


    const token:any=localStorage.getItem('token');
    var tokenPayload:any;


    try{
      tokenPayload=jwt_decode(token)
    }
    catch(error){
      localStorage.clear();
      this.router.navigate(['/']);
    }

    let checkRole=false;
    for (let i = 0; i < expectedRoleArray.length; i++) {
        if(expectedRoleArray[i]==tokenPayload.role){
          
          checkRole=true;
        }      
    }
    if(tokenPayload.role=='user'||tokenPayload.role=='admin'){
      if (this.auth.isAuthenticated()&&checkRole) {
        
        
        return true
      }
        
        
        this.snackbar.openSnackBar(GlobalConstant.unauthroized,GlobalConstant.error);
        this.router.navigate(['/cafe/dashboard'])
        return false;
      
    }else{
      this.router.navigate(['/']);
      localStorage.clear()
      return false;
    }
  }
}
