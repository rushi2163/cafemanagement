import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalConstant } from '../shared/global-constants';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm:any=FormGroup;
  responsemessage:any;

  constructor(private formBuilder:FormBuilder,
    private route:Router,
    private userService:UserService,
    private snackbarService:SnackbarService,
    private dialogRef:MatDialogRef<LoginComponent>) { }

  ngOnInit(): void {
    this.loginForm=this.formBuilder.group({
      email:[null,[Validators.required,Validators.pattern(GlobalConstant.emailRegex)]],
      password:[null,[Validators.required]],
    })
  } 


  handleSubmit(){
    var formData=this.loginForm.value;
    var data ={
      email:formData.email,
      password:formData.password
    }
    this.userService.login(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.responsemessage =response?.message;
      localStorage.setItem('token',response.token)
      this.snackbarService.openSnackBar(this.responsemessage,"");
      this.route.navigate(['/cafe/dashboard']);

    },(error)=>{
      if(error.error?.message){
        this.responsemessage =error.error?.message;
      }else{
        this.responsemessage =GlobalConstant.genericError;
      }
      this.snackbarService.openSnackBar(this.responsemessage,GlobalConstant.error);
    }
    )
  }

}
