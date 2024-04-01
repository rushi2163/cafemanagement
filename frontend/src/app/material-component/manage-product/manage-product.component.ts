import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstant } from 'src/app/shared/global-constants';
import { ProductComponent } from '../dialog/product/product.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {
  displayedColumns:string[]= ['name' , 'categoryName','description','price','edit' ];
  dataSource : any ;
  responsemessage : any;
  constructor(
    private ProductService:ProductService,
    private SnackbarService:SnackbarService,
    private router:Router ,
    private dialog:MatDialog
  ) { }

  ngOnInit(): void {
    this.tableData()
  } 
  tableData(){
    this.ProductService.getProducts().subscribe((response:any)=>{
      this.dataSource=new MatTableDataSource(response)
    },(error:any)=>{
      if(error.error?.message){
        this.responsemessage=error.error?.message;
      }
      else{
        this.responsemessage=GlobalConstant.genericError
      }
      this.SnackbarService.openSnackBar(this.responsemessage,GlobalConstant.error)
    }
    )
  }
  applyFilter(event:Event){
    const filterValue=(event.target as HTMLInputElement).value
    this.dataSource.filter=filterValue.trim().toLowerCase()
  }

  handleAddAction(){
    const dialogConfig= new MatDialogConfig();
    dialogConfig.data={
      action:'Add'
    }
    dialogConfig.width="550px";
    const dialogRef=this.dialog.open(ProductComponent,dialogConfig)
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })
    const sub=dialogRef.componentInstance.onAddProduct.subscribe(()=>{
      this.tableData()
    })
      
  }
  handleEditAction(values:any){
    console.log(values);
    
    const dialogConfig= new MatDialogConfig();
    dialogConfig.data={
      data:values,
      action:'Edit'
    }
    dialogConfig.width="550px";
    const dialogRef=this.dialog.open(ProductComponent,dialogConfig)
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })
    const sub=dialogRef.componentInstance.onEditProduct.subscribe(()=>{
      this.tableData()
    })
  }
  handleDeleteAction(values:any){
    console.log(values);
    
    const dialogConfig= new MatDialogConfig();
    dialogConfig.data={
      message:'delete '+values.name+" product",
    }
    const dialogRef=this.dialog.open(ConfirmationComponent,dialogConfig)
    
    const sub=dialogRef.componentInstance.onEmitStatusChange.subscribe((response:any)=>{
      this.tableData()
      this.deleteProduct(values.id)
      dialogRef.close()
    })
  }
  deleteProduct(id:any){
    this.ProductService.delete(id).subscribe((response:any)=>{
      this.tableData()
      this.responsemessage=response?.message;
      this.SnackbarService.openSnackBar(this.responsemessage,'success')

    },(error)=>{
      if(error.error?.message){
        this.responsemessage=error.error?.message;
      }
      else{
        this.responsemessage=GlobalConstant.genericError
      }
      this.SnackbarService.openSnackBar(this.responsemessage,GlobalConstant.error)
    })
  }
  onChange(status:any,id:any){
    let data={
      status:status.toString(),
      id:id
    }
    this.ProductService.updateStatus(data).subscribe((response:any)=>{
      this.tableData()
      this.responsemessage=response?.message;
      this.SnackbarService.openSnackBar(this.responsemessage,'success')

    },(error)=>{
      if(error.error?.message){
        this.responsemessage=error.error?.message;
      }
      else{
        this.responsemessage=GlobalConstant.genericError
      }
      this.SnackbarService.openSnackBar(this.responsemessage,GlobalConstant.error)
    })
  }

}
