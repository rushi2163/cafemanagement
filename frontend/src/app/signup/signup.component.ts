import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalConstant } from '../shared/global-constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm:any=FormGroup;
  responsemessage:any;


  constructor(private formBuilder:FormBuilder,
    private route:Router,
    private userService:UserService,
    private snackbarService:SnackbarService,
    private dialogRef:MatDialogRef<SignupComponent>) { }

  ngOnInit(): void {
    this.signupForm=this.formBuilder.group({
      name:[null,[Validators.required,Validators.pattern(GlobalConstant.nameRegex)]],
      email:[null,[Validators.required,Validators.pattern(GlobalConstant.emailRegex)]],
      contactNumber:[null,[Validators.required,Validators.pattern(GlobalConstant.contactNumberRegex)]],
      password:[null,[Validators.required]],
    })
  }
  handleSubmit(){
    var formData=this.signupForm.value;
    var data ={
      name:formData.name,
      email:formData.email,
      contactNumber:formData.contactNumber,
      password:formData.password
    }
    this.userService.signup(data).subscribe((response:any)=>{
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
