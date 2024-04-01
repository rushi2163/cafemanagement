import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstant } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  productForm:any=FormGroup;
  dialogAction :any ="Add";
  action: any ="Add";
  responsemessage:any;
  categorys:any=[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    private formBuilder:FormBuilder,
    private ProductService:ProductService,
    private snackbarService:SnackbarService,
    private dialogRef:MatDialogRef<ProductComponent>,
    private categoryService:CategoryService,

  ) { }

  ngOnInit(): void {
    this.productForm=this.formBuilder.group({
      name:[null,[Validators.required,Validators.pattern(GlobalConstant.nameRegex)]],
      categoryId:[null,[Validators.required]],
      price:[null,[Validators.required]],
      description:[null,[Validators.required]],
    })
    if(this.dialogData.action=='Edit' ){
      this.dialogAction="Edit";
      this.action="Update"
      this.productForm.patchValue(this.dialogData.data) ;
    }
    this.getCategorys()
  }
  getCategorys(){
    this.categoryService.getCategory().subscribe((response:any)=>{
      this.categorys = response;
    },(error)=>{
      if(error.error?.message){
        this.responsemessage=error.error?.message;}
      else{
        this.responsemessage= GlobalConstant.genericError
      }
      this.snackbarService.openSnackBar(this.responsemessage,GlobalConstant.genericError)
    
    })
  }
  handleSubmit(){
    if(this.dialogData.action=='Edit' ){
      this.edit();

    }else{
      
      this.add()
    }
  }

  edit(){
    var formData=this.productForm.value;
    var data ={
      id:this.dialogData.data.id,
      name:formData.name,
      categoryId:formData.categoryId,
      price:formData.price,
      description:formData.description,
    }
    this.ProductService.update(data).subscribe((response:any)=>{
      this.dialogRef.close() ;
      this.onEditProduct.emit() ;
      this.responsemessage = response.message;
      this.snackbarService.openSnackBar( this.responsemessage," success " ) ;
    },(error)=>{
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
    var formData=this.productForm.value;
    var data ={
      name:formData.name,
      categoryId:formData.categoryId,
      price:formData.price,
      description:formData.description,
    }
    this.ProductService.add(data).subscribe((response:any)=>{
      this.dialogRef.close() ;
      this.onAddProduct.emit() ;
      this.responsemessage = response.message;
      this.snackbarService.openSnackBar( this.responsemessage," success " ) ;
    },(error)=>{
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
