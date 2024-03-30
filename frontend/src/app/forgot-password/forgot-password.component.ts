import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalConstant } from '../shared/global-constants';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotpasswordForm:any=FormGroup;
  responsemessage:any;

  constructor(private formBuilder:FormBuilder,
    private route:Router,
    private userService:UserService,
    private snackbarService:SnackbarService,
    private dialogRef:MatDialogRef<ForgotPasswordComponent>) { }

  ngOnInit(): void { 
    this.forgotpasswordForm=this.formBuilder.group({
      email:[null,[Validators.required,Validators.pattern(GlobalConstant.emailRegex)]],
    })
  } 

  
  handleSubmit(){
    var formData=this.forgotpasswordForm.value;
    var data ={
      email:formData.email,
      
    }
    this.userService.forgotpassword(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.responsemessage =response?.message;
      this.snackbarService.openSnackBar(this.responsemessage,"");
      this.route.navigate(['/']);

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
