import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstant } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();
  categoryForm:any=FormGroup;
  dialogAction :any ="Add";
  action: any ="Add";
  responsemessage:any



  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    private formBuilder:FormBuilder,
    // private route:Router,
    private categoryService:CategoryService,
    private snackbarService:SnackbarService,
    private dialogRef:MatDialogRef<CategoryComponent>
    
  ) { }

  ngOnInit(): void { 
    this.categoryForm=this.formBuilder.group({
      name:[null,[Validators.required]],
    })


    if(this.dialogData.action=='Edit' ){
      this.dialogAction="Edit";
      this.action="Update"
      this.categoryForm.patchValue(this.dialogData.data) ;
    }
  }
  handleSubmit(){
    if(this.dialogData.action=='Edit' ){
      this.edit();

    }else{
      
      this.add()
    }
  }
  edit(){
    var formData=this.categoryForm.value;
    var data ={
      id:this.dialogData.data.id,
      name:formData.name,
    }
    this.categoryService.update(data).subscribe((response:any)=>{
      this.dialogRef.close() ;
      this.onEditCategory.emit( ) ;
      this.responsemessage = response.message;
      this.snackbarService.openSnackBar( this.responsemessage," success " ) ;
    },(error:any)=>{
      this.dialogRef.close() ;
      if(error.error?.message){
        this.responsemessage=error.error?.message;}
      else{
        this.responsemessage= GlobalConstant.genericError
      }
      this.snackbarService.openSnackBar(this.responsemessage,GlobalConstant.genericError)
    })
  }
  add(){
    var formData=this.categoryForm.value;
    var data ={
      name:formData.name,
    }
    this.categoryService.add(data).subscribe((response:any)=>{
      this.dialogRef.close() ;
      this.onAddCategory.emit() ;
      this.responsemessage = response.message;
      this.snackbarService.openSnackBar( this.responsemessage," success " ) ;
    },(error)=>{
      //working 7.14.00

      this.dialogRef.close() ;
      if(error.error?.message){
        this.responsemessage=error.error?.message;}
      else{
        this.responsemessage= GlobalConstant.genericError
      }
      this.snackbarService.openSnackBar(this.responsemessage,GlobalConstant.genericError)
    })
  }

}
