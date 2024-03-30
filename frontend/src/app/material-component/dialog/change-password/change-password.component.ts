import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstant } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm:any=FormGroup;
  responsemessage:any
  constructor(private formBuilder:FormBuilder,
    // private route:Router,
    private userService:UserService,
    private snackbarService:SnackbarService,
    private dialogRef:MatDialogRef<ChangePasswordComponent>) { }

  ngOnInit(): void {
    this.changePasswordForm=this.formBuilder.group({
      oldPassword:[null,[Validators.required]],
      newPassword:[null,[Validators.required]],
      confirmpassword:[null,[Validators.required]],
    })
  }

  validateSubmit(){
    if(this.changePasswordForm.controls['newPassword'].value!=(this.changePasswordForm.controls['confirmpassword'].value))
    {
      return true;
    }else{
      return false
    }
  }

    handleChangePasswordSubmit(){
    var formData=this.changePasswordForm.value;
    var data ={
      oldPassword:formData.oldPassword,
      newPassword:formData.newPassword,
      confirmpassword:formData.confirmpassword
    }
    this.userService.changePassword(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.responsemessage =response?.message;
      localStorage.setItem('token',response.token)
      this.snackbarService.openSnackBar(this.responsemessage,"success");
      // this.route.navigate(['/cafe/dashboard']);

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
 