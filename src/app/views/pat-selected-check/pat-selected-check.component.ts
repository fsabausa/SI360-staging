import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ComingsoonComponent } from '../comingsoon/comingsoon.component';
import { SiposService } from '../../shared/sipos.service';
import { ToastrService } from 'ngx-toastr';
import { UtilityService } from '../../services/utility.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

export interface SampleObj{
  id: string;
  class: string;
  color: string
}

@Component({
  selector: 'app-pat-selected-check',
  templateUrl: './pat-selected-check.component.html',
  styleUrls: ['./pat-selected-check.component.css']
})
export class PatSelectedCheckComponent implements OnInit {

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

	ngOnInit() {
		this.getGuestCheckDetail(this.utilityService.globalInstance.SelectedSaleId);
		this.utilityService.inputed_tip = "0";
		this.entireCHECK();
		this.getDefaultMedia();
	}

	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	getDocHeight() {
	    var D = document;
	    return Math.max(
	        D.body.scrollHeight, D.documentElement.scrollHeight,
	        D.body.offsetHeight, D.documentElement.offsetHeight,
	        D.body.clientHeight, D.documentElement.clientHeight
	    );
	}

	getDefaultMedia() {
		let _apiRoute = this.utilityService.getApiRoute('GetDefaultMedia');
		this.service.getDefaultMedia(this.utilityService.localBaseAddress + _apiRoute).subscribe(
			data => {
				this.utilityService.defaultMedia = JSON.parse(data['result']);
				console.log("defaultMedia");
				console.log(this.utilityService.defaultMedia);
			}
		)
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
			let ssTotalTemp = item.SaleSummary.Total
            let ssTaxTemp = item.SaleSummary.TotalTax
            let ssTotal = Number(ssTotalTemp.replace(/[^0-9.-]+/g,""));
            let ssTax = Number(ssTaxTemp.replace(/[^0-9.-]+/g,""));
			let subtotal = Number(this.utilityService.subTotal.replace(/[^0-9.-]+/g,""))
			let grandtotal = Number(this.utilityService.grandtotal.replace(/[^0-9.-]+/g,""))
			let totalTax = Number(this.utilityService.totalTax.replace(/[^0-9.-]+/g,""))

			console.log('subtotal ' + subtotal + 'grandtotal ' + grandtotal + 'total tax ' + totalTax);

			if(item.PaidFlag == "0"){
				subtotal = subtotal + actualPrice;
				//grandtotal = grandtotal + (actualPrice + actualTax);
                grandtotal = grandtotal + (ssTotal + actualTax);
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

	getSelectedSeatPayment(seatNo, checkNo, paidFlag, index){
		//alert("seat #: "+seatNo+" check #: "+checkNo+" index #: "+index);
		if(paidFlag == 0){
			this.utilityService.payment_Option = 'Pay By Seat';
			this.utilityService.splitEven = 0;
			let seatPaymentID = document.getElementById('seatpaymentno'+index);

			let highlightChildNodes = true;
			let includePayment = false;
			let tempSeatNo = "";
			let tempCheckNo = "";
			let selectedStatus = false;

			this.utilityService.subTotal = "0";
			this.utilityService.grandtotal = "0";
			this.utilityService.totalTax = "0";

			if(seatNo!="" && seatNo!=null){
				const resultIndex = this.utilityService._seatPayments.findIndex(seat=> seat.seatNo === seatNo)
				selectedStatus = false;
				if (resultIndex < 0) {
					this.utilityService._seatPayments.push({'seatNo':seatNo,'checkNo':checkNo});
					seatPaymentID.style.background = 'orange';
					selectedStatus = true;
				}else{
					this.utilityService._seatPayments.splice(resultIndex, 1);
					seatPaymentID.style.background = '';
					selectedStatus = false;
				}
			}else{
				this.utilityService.guestCheck.forEach((item, idx) => {
					if(item.SeatNo != "" && item.SeatNo != null){
						tempSeatNo = item.SeatNo;
						tempCheckNo = item.SaleId;
					}else if(idx == index){
						seatNo = tempSeatNo;
						
						const resIndx = this.utilityService._seatPayments.findIndex(seat=> seat.seatNo === seatNo)
						
						if (resIndx < 0) {
							this.utilityService._seatPayments.push({'seatNo':tempSeatNo,'checkNo':tempCheckNo});
							seatPaymentID.style.background = 'orange';
							selectedStatus = true;
						}else{
							this.utilityService._seatPayments.splice(resIndx, 1);
							seatPaymentID.style.background = '';
							selectedStatus = false;
						}
						
					}
				});
			}				
				for( var i = 0; i < this.utilityService.pbsSelection.length; i++){ 
					if (this.utilityService.pbsSelection[i] == seatNo) {
						this.utilityService.pbsSelection.splice(i, 1); 
						console.log('remove seat highlight: '+seatNo);
						console.log(this.utilityService.pbsSelection);
					}
				}

				highlightChildNodes = true;
				includePayment = false;
				this.utilityService.subTotal = "0";
				this.utilityService.grandtotal = "0";
				this.utilityService.totalTax = "0";

				this.utilityService.guestCheck.forEach((item, idx) => {
					let seatPaymentIndex = this.utilityService._seatPayments.findIndex(seat=> seat.seatNo === item.SeatNo);
					if(seatPaymentIndex < 0){
						if(item.SeatNo=="" || item.SeatNo==null){
							if(includePayment){
								let strActualPrice = item.ActualPrice;
								let strTax = item.TotalTax;
								let actualPrice = Number(strActualPrice.replace(/[^0-9.-]+/g,""));
								let actualTax = Number(strTax.replace(/[^0-9.-]+/g,""));

								let subtotal = Number(this.utilityService.subTotal.replace(/[^0-9.-]+/g,""))
								let grandtotal = Number(this.utilityService.grandtotal.replace(/[^0-9.-]+/g,""))
								let totalTax = Number(this.utilityService.totalTax.replace(/[^0-9.-]+/g,""))

								subtotal = subtotal + actualPrice;
								grandtotal = grandtotal + (actualPrice + actualTax);

								if(this.utilityService.splitEven>0){
									subtotal = subtotal / this.utilityService.splitEven;
									grandtotal = grandtotal / this.utilityService.splitEven;
								}

								this.utilityService.subTotal = subtotal.toFixed(2);
								this.utilityService.grandtotal = grandtotal.toFixed(2);
								this.utilityService.totalTax = (totalTax + actualTax).toFixed(2);
							}
						}else{
							includePayment = false;
						}
					}else{
						includePayment = true;
					}

				});
				if(this.utilityService.subTotal == "0") {
					this.utilityService.payment_Option = 'Entire Check';
					this.getGuestCheckDetail(this.utilityService.globalInstance.SelectedSaleId);
				}
				this.utilityService.subTotal = "$"+this.utilityService.subTotal;
				this.utilityService.grandtotal = "$"+this.utilityService.grandtotal;
				this.utilityService.totalTax = "$"+this.utilityService.totalTax;
				this.utilityService.pbsSelection.push(seatNo);


				this.utilityService.guestCheck.forEach((item, idx) => {
					
					let childPaymentID = document.getElementById('seatpaymentno'+idx);

					const resultIndex = this.utilityService._seatPayments.findIndex(seat=> seat.seatNo === item.SeatNo)

					if(item.SeatNo=="" || item.SeatNo==null){
						if(selectedStatus){
							childPaymentID.style.background = '#20c997';
						}else{
							childPaymentID.style.background = '';
						}
					}else if(resultIndex>=0){
						console.log("found inside array seatno: "+item.SeatNo);
						childPaymentID.style.background = 'orange';
						selectedStatus = true;
					}else{
						childPaymentID.style.background = '';
						selectedStatus = false;
					}
				});
		}else{
			this.toastr.info("This Seat is already Paid!","Information", {timeOut: 2000});
		}
		
		console.log("Seatno: "+seatNo);
		console.log(this.utilityService._seatPayments);
	}

	getbuttonActionPAT(action) {
	    switch(action) {
			case "PATPaymentSelection":
			/* 	this.toastr.info('This module is working in progress','Information', {timeOut:5000})  */
  				this.utilityService.screen = "payAtTAblePaymentSelection";
				  if(this.utilityService.payment_Option == 'Entire Check') {
					this.utilityService.inputedAmount =  Number(this.utilityService.grandtotal.replace(/[^0-9.-]+/g,""));
				  } else {
					this.utilityService.inputedAmount = 0;
				  }
				localStorage.setItem("AmountPay",this.utilityService.grandtotal);
				this.getMedia();
				this._router.navigate(['patpaymentselection']);  
				break;
			case "PATResidentCharge":
				this.utilityService.screen = "payAtTableResidentCharge";
				this._router.navigate(['main']);
				break;
			case "ReturnToPOS":
				this.GotoTableManagement();
				this.utilityService.screen = "rso-main";
				this._router.navigate(['roomselection']);
				break;
			default:
				break;
	    }
	    //this.initUtility();
	 }

	GotoTableManagement() {
		this.utilityService.screen = 'rso-main';
		this.service.getroomlist(this.utilityService.localBaseAddress + 'api/v1/LayoutRoom/layoutroom')
		  .subscribe(room=> {
		    this.utilityService.roomList = JSON.parse(room['result']);
		  },error=> {
		  },()=> {
		   if(this.utilityService.preSelectedRoom == 0) {
		     this.utilityService.preSelectedRoom = this.utilityService.roomList[0].RoomIndex;
		     this.utilityService.selectedroom = this.utilityService.roomList[0].RoomName;
		   }
		   this.service.selectedRoom(this.utilityService.localBaseAddress  + 'api/v1/layouttable/SelectedRoom/',this.utilityService.preSelectedRoom + '/' + this.utilityService.globalInstance.CurrentUser.EmpID)
		   .subscribe(room => {
		     this.utilityService.layoutTable = JSON.parse(room['result']);
		   },error=> {
		     console.log(error);
		   });
		  });
	}

	public getMedia() {
		const _apiRoute = this.utilityService.getApiRoute('GetMedia');
		this.service.getMedia(this.utilityService.localBaseAddress + _apiRoute,this.utilityService.storeId)
		.subscribe(data=> {
			this.utilityService._media = JSON.parse(data['result']);
		},
		error=> {

		},()=> {

		});
		console.log("GetMedia: "+this.utilityService.localBaseAddress + _apiRoute,this.utilityService.storeId);
	}

	getbuttonActionRSO(action,tablename='',tableshape='',seatCount='',layoutTableId='',takenSeats='',checknumbers='') {
	    switch(action) {
			case 'BACK TO FLOOR PLANS' :
				this.utilityService.splitEven = 0;
				this.recomputeGrandTotal();
				this.utilityService.screen = 'orderingModule';
				this._router.navigate(['ordering']);
				break;
			case "PATResidentCharge":
		        this.utilityService.screen = "payAtTableResidentCharge";
		        break;
			default:
				//this.screen = 'signOn';
				break;
	    }
	}

	getGuestCheckDetail(saleid) {
		console.clear();
		const _apiRoute = this.utilityService.getApiRoute('GetGuestCheckDetail');
		this.service.getGuestCheckDetail(this.utilityService.localBaseAddress + _apiRoute + saleid,this.utilityService.storeId)
		.subscribe(data=>{
			this.utilityService.guestCheck = JSON.parse(data['result']);
			console.log('guestCheck');
			console.log(this.utilityService.guestCheck);
		},error=>{

		},()=>{
		    this.utilityService.patTableName = this.utilityService.guestCheck[0].TableName;
		    this.utilityService.totalTax = this.utilityService.guestCheck[0].SaleSummary.TotalTax;
		    this.utilityService.grandtotal = this.utilityService.guestCheck[0].SaleSummary.Total;
		    this.utilityService.balance = this.utilityService.guestCheck[0].SaleSummary.Total;
		    this.utilityService.subTotal = this.utilityService.guestCheck[0].SaleSummary.SubTotal;
			this.recomputeGrandTotal();
		});
	}

	getRowClassName(g) {
		if(g.SeatNo != '' && g.SeatNo != null && g.PaidFlag == 0){
			return 'parent-list-row';
		}else if(!(g.SeatNo != '' && g.SeatNo != null) && g.PaidFlag == 0){
			return 'paper-design';
		}else if(g.PaidFlag == 1) {
			return 'disable-seat';
		}
	}

	getParentSeatNo(g) {
		if(g.SeatNo != '' && g.SeatNo != null){
			this.parentSeatNo = g.SeatNo;
			console.log("parentSeatNo: "+this.parentSeatNo+" g.seatno: "+g.SeatNo);
			return this.parentSeatNo;
		} else {
			console.log("parentSeatNo: "+this.parentSeatNo+" g.seatno: "+g.SeatNo);
			return this.parentSeatNo;
		}
	}

	checkSeatComponent(comp){
		if(comp=="seat"){
			return true;
		}else{
			return false;
		}
	}

	onItemDrop(event: CdkDragDrop<any[]>) {
		console.log(event);
		console.log(event.container.data);
		
		moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    	this.saveScreenLayoutDrop(event.container.data);
	}

	saveScreenLayoutDrop(changedContainer: any[]){
		var newContainer = [];

		const _apiRoute = this.utilityService.getApiRoute('SaveScreenLayout');
		const ApiURL = this.utilityService.localBaseAddress + _apiRoute;

		var index = 0;
		for (const data of changedContainer) {
		  index++;
		  var newData = {
		    "controlPanel":data.ControlPanel,
		    "appClass":data.AppClass,
		    "backgroundColor":data.BackgroundColor,
		    "appId":data.AppID,
		    "empId":data.EmpID,
		    "position":""+index,
		    "storeId":data.StoreID
		  };
		  data.Position = ""+index;
		  this.service.saveScreenLayoutDetail(newData,ApiURL)
		  .subscribe(result=> {
		    console.log(result);
		  },error=>{
		    console.log(error);
		    this.toastr.error(error.toString(),"Error", {timeOut: 2000});
		  },()=>{
		    console.log("success on saving!");
		  });
		}
	}
}
