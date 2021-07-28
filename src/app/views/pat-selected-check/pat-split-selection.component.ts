import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ComingsoonComponent } from '../comingsoon/comingsoon.component';
import { PinpadDialogComponent } from '../pinpad/pinpad-dialog.component';
import { SiposService } from '../../shared/sipos.service';
import { ToastrService } from 'ngx-toastr';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'pat-split-selection',
  templateUrl: './pat-split-selection.component.html',
  styleUrls: ['./pat-split-selection.component.css']
})
export class PatSplitSelectionComponent {

	parentSeatNo = "";

	constructor(
	    private _router: Router,
	    private service : SiposService,
	    private toastr: ToastrService,
	    public utilityService: UtilityService,
	    public dialog: MatDialog) 
	{ 
		//this.fetchUtility();
	}

	recomputeGrandTotal() {
		this.utilityService.subTotal = "0";
		this.utilityService.grandtotal = "0";
		this.utilityService.totalTax = "0";
		this.utilityService.guestCheck.forEach((item, idx) => {
			let strActualPrice = item.ActualPrice;
			let strTax = item.TotalTax;

			let actualPrice = Number(strActualPrice.replace(/[^0-9.-]+/g,""));
			let actualTax = Number(strTax.replace(/[^0-9.-]+/g,""));

			let subtotal = Number(this.utilityService.subTotal.replace(/[^0-9.-]+/g,""))
			let grandtotal = Number(this.utilityService.grandtotal.replace(/[^0-9.-]+/g,""))
			let totalTax = Number(this.utilityService.totalTax.replace(/[^0-9.-]+/g,""))

			console.log('subtotal ' + subtotal + 'grandtotal ' + grandtotal + 'total tax ' + totalTax);

			if(item.PaidFlag == "0"){
				subtotal = subtotal + actualPrice;
				grandtotal = grandtotal + (actualPrice + actualTax);
			}

			this.utilityService.subTotal = subtotal.toFixed(2);
			this.utilityService.grandtotal = grandtotal.toFixed(2);
			this.utilityService.balance = grandtotal.toFixed(2);
			this.utilityService.totalTax = (totalTax + actualTax).toFixed(2);
		});
		
		if(this.utilityService.subTotal.trim()!="" 
			&& this.utilityService.grandtotal.trim()!=""
			&& this.utilityService.splitEven > 0){
			let subtotal = parseFloat(this.utilityService.subTotal);
			let grandtotal = parseFloat(this.utilityService.grandtotal);
			let totalTax = Number(this.utilityService.totalTax.replace(/[^0-9.-]+/g,""))

			subtotal = (subtotal / this.utilityService.splitEven);
			grandtotal = (grandtotal / this.utilityService.splitEven);
			totalTax = (totalTax / this.utilityService.splitEven);

			this.utilityService.subTotal = subtotal.toFixed(2);
			this.utilityService.grandtotal = grandtotal.toFixed(2);
			this.utilityService.totalTax = totalTax.toFixed(2);
		}

		this.utilityService.subTotal = "$"+this.utilityService.subTotal;
		this.utilityService.grandtotal = "$"+this.utilityService.grandtotal;
		this.utilityService.totalTax = "$"+this.utilityService.totalTax;
	}

	entireCHECK(userClick=false) {
		this.utilityService.payment_Option = 'Entire Check';
		this.utilityService.splitEven = 0;
		this.utilityService._seatPayments = [];
		if(userClick){
			this.recomputeGrandTotal();
			this.refreshSeatSelection();
		}
	}

	openComingSoon(){
		let diaglogRef = this.dialog.open(ComingsoonComponent);
	}

	refreshSeatSelection(){
		this.utilityService.guestCheck.forEach((item, idx) => {
			let childPaymentID = document.getElementById('seatpaymentno'+idx);
			if(childPaymentID!=null) childPaymentID.style.background = '';
		});
	}

	splitBy(value) {
		this.utilityService.payment_Option = 'Split by ' + value;
		this.utilityService.splitEven = value;
		this.recomputeGrandTotal();
	}

	splitByDialog() {
		this.utilityService.splitEven = 0;
		const dialogConfig = new MatDialogConfig();
		const dialogRef = this.dialog.open(PinpadDialogComponent, dialogConfig);

	    dialogRef.afterClosed().subscribe(
	        data => {
	        	this.recomputeGrandTotal();
	        }
	    );  
	}

}
