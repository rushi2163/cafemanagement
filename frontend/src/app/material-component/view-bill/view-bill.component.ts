import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Route, Router } from '@angular/router';
import { BillService } from 'src/app/services/bill.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstant } from 'src/app/shared/global-constants';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {
  displayedColumns:string[]= ['name' ,'email','contactNumber','paymentMethod','total','view'];
  dataSource : any ;
  responseMessage: any ;

  constructor( 
    // private formBuilder:FormBuilder,
    // private categoryService:CategoryService,
    private SnackbarService:SnackbarService,
    // private ProductService:ProductService,
    private BillService:BillService,
    private dialog:MatDialog,
    private router:Router
) { }

  ngOnInit(): void { 
    this.tableData()
  }
  tableData(){
    this.BillService.getBills().subscribe((response:any)=>{
      this.dataSource=new MatTableDataSource(response)
    },(error:any)=>{
      if(error.error?.message){
        this.responseMessage=error.error?.message;
      }
      else{
        this.responseMessage=GlobalConstant.genericError
      }
      this.SnackbarService.openSnackBar(this.responseMessage,GlobalConstant.error)
    }
    )
  }

  applyFilter(event:Event){
    const filterValue=(event.target as HTMLInputElement).value
    this.dataSource.filter=filterValue.trim().toLowerCase()
  }
  handleViewAction(values:any){
    const dialogConfig= new MatDialogConfig();
    dialogConfig.data={
      data:values
    }
    dialogConfig.width="550px";
    const dialogRef=this.dialog.open(ViewBillProductsComponent,dialogConfig)
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })
    
  }
  handleDeleteAction(values:any){
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
    this.BillService.deleteBill(id).subscribe((response:any)=>{
      this.tableData()
      this.responseMessage=response?.message;
      this.SnackbarService.openSnackBar(this.responseMessage,'success')

    },(error)=>{
      if(error.error?.message){
        this.responseMessage=error.error?.message;
      }
      else{
        this.responseMessage=GlobalConstant.genericError
      }
      this.SnackbarService.openSnackBar(this.responseMessage,GlobalConstant.error)
    })
  }
  downloadReportAction(values:any){
    var data={
         
      name:values.name,
      email:values.email,
      contactNumber:values.contactNumber,
      paymentMethod:values.paymentMethod,
      totalAmount:values.totalAmount,
      productDetails:values.productDetails,
      uuid:values.uuid
    }
    this.BillService.getPDF(data).subscribe((response:any)=>{
      saveAs(response,values.uuid+'.pdf')
    })
  }
}
