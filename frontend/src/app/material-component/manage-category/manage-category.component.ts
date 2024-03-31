import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstant } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit {
  displayedColumns:string[]= ['name' , 'edit' ];
  dataSource : any ;
  responsemessage : any;
  constructor(
    private CategoryService:CategoryService,
    private SnackbarService:SnackbarService,
    private router:Router ,
    private dialog:MatDialog
  ) { }

  ngOnInit(): void {
    this.tableData()
  }
  tableData(){
    this.CategoryService.getCategory().subscribe((response:any)=>{
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
  handleAddAction(){}
  handleEditAction(value:any){}
} 
