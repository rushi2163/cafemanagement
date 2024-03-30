import { Component, AfterViewInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstant } from '../shared/global-constants';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
	responseMessage:any;
	data:any;
	ngAfterViewInit() { }

	constructor(
		private snackbarService:SnackbarService,
		private dashboardService:DashboardService
		) {
			this.dashboardData()
		}
	dashboardData(){
		this.dashboardService.getDetails().subscribe((response:any)=>{
			this.data=response;
		},(error:any)=>{
			console.log("error from dashboard component",error);
			if(error.error?.message){
				this.responseMessage=error.error?.message;
			}
			else{
				this.responseMessage=GlobalConstant.genericError;
			}
			this.snackbarService.openSnackBar(this.responseMessage,GlobalConstant.genericError)
			
		})
	}
}
