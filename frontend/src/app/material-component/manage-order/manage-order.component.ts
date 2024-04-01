import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstant } from 'src/app/shared/global-constants';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {
  displayedColumns:string[]= ['name' ,'category','price','quantity','total','edit'];
  dataSource : any =[];
  manageOrderForm:any=FormGroup;
  categorys:any = [];
  products: any = []; 
  price : any;
  totalAmount: number = 0;
  responseMessage: any ;
  constructor(
    private formBuilder:FormBuilder,
    private categoryService:CategoryService,
    private snackbarService:SnackbarService,
    private ProductService:ProductService,
    private BillService:BillService



  ) { }

  ngOnInit(): void {
    this.manageOrderForm=this.formBuilder.group({
      name:[null,[Validators.required,Validators.pattern(GlobalConstant.nameRegex)]],
      email:[null,[Validators.required,Validators.pattern(GlobalConstant.emailRegex)]],
      contactNumber:[null,[Validators.required,Validators.pattern(GlobalConstant.contactNumberRegex)]],
      paymentMethod:[null,[Validators.required]],
      category:[null,[Validators.required]],
      products:[null,[Validators.required]],
      price:[null,[Validators.required]], 
      quantity:[null,[Validators.required]],
      total:[0,[Validators.required]], 

    })
    this.getCategorys ( )
  }
  getCategorys ( ) {
    this.categoryService.getCategory().subscribe((response:any)=>{
      this.categorys=response
    },(error:any)=>{
      if(error.error?.message){
        this.responseMessage=error.error?.message;}
      else{
        this.responseMessage= GlobalConstant.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstant.genericError)
    })
    }


    getProductsByCategorys (values:any ) {
      
      this.ProductService.getProductsByCategory(values.id).subscribe((response:any)=>{
        this.products=response;
        // console.log(response);
        
        this.manageOrderForm.controls['price'].setValue('');
        this.manageOrderForm.controls['quantity'].setValue('');
        this.manageOrderForm.controls['total'].setValue(0);

      },(error:any)=>{
        if(error.error?.message){
          this.responseMessage=error.error?.message;}
        else{
          this.responseMessage= GlobalConstant.genericError
        }
        this.snackbarService.openSnackBar(this.responseMessage,GlobalConstant.genericError)
      })
      }

      getProductsDetails (values:any ) {
        this.ProductService.getById(values.id).subscribe((response:any)=>{
          this.price=response.price

          this.manageOrderForm.controls['price'].setValue(response.price);
          this.manageOrderForm.controls['quantity'].setValue('1');
          this.manageOrderForm.controls['total'].setValue(this.price*1);
  
        },(error:any)=>{
          if(error.error?.message){
            this.responseMessage=error.error?.message;}
          else{
            this.responseMessage= GlobalConstant.genericError
          }
          this.snackbarService.openSnackBar(this.responseMessage,GlobalConstant.genericError)
        })
        }
  
  setQuantity(values:any){
    var temp=this.manageOrderForm.controls['quantity'].value;
    if(temp>0 ){
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value*this.manageOrderForm.controls['price'].value)
    }else if(temp!=''){
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value*this.manageOrderForm.controls['price'].value)

    }
  }

  validateProductAdd(){
    if(this.manageOrderForm.controls['total'].value===0||this.manageOrderForm.controls['total'].value===null||this.manageOrderForm.controls['quantity'].value<=0){
      return true
    }else{
      return false
    }
  }
  validateSubmit(){
    if(this.totalAmount===0||
      this.manageOrderForm.controls['name'].value===null||
      this.manageOrderForm.controls['email'].value===null||
      this.manageOrderForm.controls['contactNumber'].value===null||
      this.manageOrderForm.controls['paymentMethod'].value===null||
      !(this.manageOrderForm.controls['contactNumber'].valid)||
      !(this.manageOrderForm.controls['email'].valid))
    {
      return true
    } else{
      return false
    } 
  }

  add(){
    var formData=this.manageOrderForm.value;
    console.log(this.manageOrderForm.value);
    var productName= this.dataSource.find((e:{id:Number}) => e.id == formData.products.id);
    //  var productName;
    
    
    if(productName==undefined){
      console.log("inside prod name");
      
      this.totalAmount=this.totalAmount+formData.total;
      this.dataSource.push(
        {
          id:formData.products.id,
          name:formData.products.name,
          category:formData.category.name,
          quantity:formData.quantity,
          price:formData.price,
          total:formData.total}
        )
      this.dataSource=[...this.dataSource]
      this.snackbarService.openSnackBar(GlobalConstant.productAdded,"success")
    }
    else{
      this.snackbarService.openSnackBar(GlobalConstant.productExistError,GlobalConstant.error)
    }
  }

  handleDeleteAction(value:any,element:any){
    this.totalAmount=this.totalAmount-element.total
    this.dataSource.splice(value,1);
    this.dataSource=[...this.dataSource]

  }
  submitAction(){
    var formData=this.manageOrderForm.value
    var data={
         
          name:formData.name,
          email:formData.email,
          contactNumber:formData.contactNumber,
          paymentMethod:formData.paymentMethod,
          totalAmount:this.totalAmount,
          productDetails:JSON.stringify(this.dataSource)
          
    }
    this.BillService.generateReport(data).subscribe((response:any)=>{
      this.downloadFile(response?.uuid)
      this.manageOrderForm.reset()
      this.dataSource=[];
      this.totalAmount=0
    },
    (error:any)=>{
      if(error.error?.message){
        this.responseMessage=error.error?.message;}
      else{
        this.responseMessage= GlobalConstant.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstant.genericError)
    
    })
  }
  downloadFile(fileName:any){
    var data={
      uuid:fileName,

    }
    this.BillService.getPDF(data).subscribe((response:any)=>{
      saveAs(response,fileName+'.pdf')

    })
  }
}
