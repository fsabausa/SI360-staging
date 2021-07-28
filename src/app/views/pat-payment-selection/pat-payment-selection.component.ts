import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PaymentSuccessfulComponent } from '../payment-successful/payment-successful.component';
import { SiposService } from '../../shared/sipos.service';
import { ToastrService } from 'ngx-toastr';
import { UtilityService } from '../../services/utility.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { 
	PayCheck,
	ResidenChargeSettleCheck,
	CreditCardTransactionDetail
} from '../../obj-interface';
declare function buildMessage() : any;

@Component({
  selector: 'app-pat-payment-selection',
  templateUrl: './pat-payment-selection.component.html',
  styleUrls: ['./pat-payment-selection.component.css']
})
export class PatPaymentSelectionComponent implements OnInit {
	paymentType = "None";
	selectedPayment = "";
	balance = 0.00;
	printReceipt : boolean = false;
	@ViewChild('diaglogCreditCard', { static: false }) diaglogCreditCard: ModalDirective;
	@ViewChild('diaglogCreditCardConfirmation', { static: false }) diaglogCreditCardConfirmation: ModalDirective;
	constructor(private _router: Router,
		private service : SiposService,
		private toastr: ToastrService,
		public utilityService: UtilityService,
		public dialog: MatDialog) { 
		this.utilityService.grandtotal = (parseFloat(this.utilityService.grandtotal.replace(/[^0-9.-]+/g,""))).toFixed(2);
		console.log("Payment_Media");
		console.log(this.utilityService._media);
		
		console.log("Utility Total Tax: "+this.utilityService.totalTax);
		this.getSettlementDetails(this.utilityService.globalInstance.SelectedSaleId);
	}

	ngOnInit() {
		if(this.utilityService.payment_Option.toLowerCase() == "entire check"){
				this.paymentType = "Single";									
			}else if(this.utilityService.payment_Option.toLowerCase() == "pay by seat"){
				this.paymentType = "SelectedSeat";
				this.balance = parseFloat(this.utilityService.balance.toString().replace(/[^0-9.-]+/g,""));
			}else if(this.utilityService.payment_Option.toLowerCase().indexOf("split by") !== -1){
				this.paymentType = "Split";
				this.balance = parseFloat(this.utilityService.balance.toString().replace(/[^0-9.-]+/g,""));
			}
	}

	findMediaType(value, indx) {

	/* 	if(value == "Meal Credits"){ */
			this.utilityService._media.forEach((item, idx) => {
				if(idx == indx){
					let btnElement = document.getElementById('payindx'+idx);
					btnElement.classList.add("selectedPaymentButton");
				}else{
					let btnElement = document.getElementById('payindx'+idx);
					btnElement.classList.remove("selectedPaymentButton");
				}
				
			});

			this.selectedPayment = value;
			switch(value.toLowerCase().trim().replace(/(\r?\n|\r)/gm, ' ')) {
				case "credit card" :
					this.showDialogCreditCardPrintReceipt();
					this.showdiaglogCreditCard();
					this.utilityService.creditCardIndex = indx;
					this.creditCard();
					break;
				case "visa" :
					this.showDialogCreditCardPrintReceipt();
					this.showdiaglogCreditCard();
					this.utilityService.creditCardIndex = indx;
					this.creditCard();
					break;
				case "mastercard" :
					this.showDialogCreditCardPrintReceipt();
					this.showdiaglogCreditCard();
					this.utilityService.creditCardIndex = indx;
					this.creditCard();
					break;
				case "discover" :
					this.showDialogCreditCardPrintReceipt();
					this.showdiaglogCreditCard();
					this.utilityService.creditCardIndex = indx;
					this.creditCard();
					break;
				case "american express" :
					this.showDialogCreditCardPrintReceipt();
					this.showdiaglogCreditCard();
					this.utilityService.creditCardIndex = indx;
					this.creditCard();
					break;	
				case "gift certificate" :
					this.showDialogCreditCardPrintReceipt();
					this.showdiaglogCreditCard();
					this.utilityService.creditCardIndex = indx;
					this.creditCard();
					break;
				case "authorization" :
					this.showDialogCreditCardPrintReceipt();
					this.showdiaglogCreditCard();
					this.utilityService.creditCardIndex = indx;
					this.initTriposAuth();
					break;
				case "meal credits" :

					break;
				default:
					break;
			}
		/* } */
		/* else if(value == "Credit Card") {
			this.toastr.success("CREDIT CARD BABY");
			this.utilityService.payment_media = "creditcard";
			this.payCheck(this.utilityService.payment_media,PaymentType,this.utilityService.globalInstance.SelectedSaleId,Total,Balance,this.utilityService.globalInstance.SelectedCustomerId); 
		} */
		/* else{
			this.toastr.info("This payment is not yet available, still under development!","Information", {timeOut: 3000});
		} */
		
	}

	settleResidentCharge(saleid, ApiURL) {
		console.clear();
		const CurrentUser = this.utilityService.globalInstance.CurrentUser.EmpID;
		const SaleId = this.utilityService.globalInstance.SelectedSaleId;
		const _settleResidentCharge: ResidenChargeSettleCheck = { SaleId, CurrentUser} as ResidenChargeSettleCheck;
		this.service.residentChargeSettleCheck(_settleResidentCharge, ApiURL)
		.subscribe(settleCheck => {
		  this.utilityService.settleCheckResidentCharge.push(settleCheck);
		}, error => {
		  this.toastr.error(error);
		}, () => {
		  this.utilityService.guestCheck = [];
		  this.utilityService.patTableName = null;
		  this.utilityService.globalInstance.SelectedSaleId = '00000000-0000-0000-0000-000000000000';
		  this.toastr.success('Check has been successfully settled');
		  this.sleep(900);
		  this.backToFloorPlan('BACK TO FLOOR PLANS', null, null, null, null, null, null, false);
		});
	  }

	accountCharge() {
		let paymentMedia = this.utilityService.payment_media;
		let customerId = this.utilityService.globalInstance.SelectedCustomerId;
		let saleID = this.utilityService.globalInstance.SelectedSaleId;
		let paymentType = 1;
		this.payCheck(paymentMedia,paymentType,saleID,0,0,customerId,this.utilityService.creditCardIndex)	
	}  

	creditCard(){
		this.utilityService.creditCardDialogButtons = false;
		this.utilityService.payment_media = "creditcard";
		this.utilityService.globalInstance.SelectedCustomerId  = '562CC46A-4EF0-E511-80C9-0060EF1DBF03';
		this.getCustomerDetailCreditCard(this.utilityService.globalInstance.SelectedCustomerId );
		this.utilityService.creaditCardMsg = "Processing " + this.selectedPayment + " Transaction....";
		let paymentMedia = this.utilityService.payment_media;
		let customerId = this.utilityService.globalInstance.SelectedCustomerId;
		let saleID = this.utilityService.globalInstance.SelectedSaleId;
		let paymentType = 1;
		this.payCheck(paymentMedia,paymentType,saleID,0,0,customerId,this.utilityService.creditCardIndex)			
	}

	initTriposAuth(){
		this.utilityService.creditCardDialogButtons = false;
		this.utilityService.payment_media = "Authorization";
		this.utilityService.globalInstance.SelectedCustomerId  = '562CC46A-4EF0-E511-80C9-0060EF1DBF03';
		this.utilityService.creaditCardMsg = "Processing Authorization....";
		this.TriposAuth()	
	}

	getbuttonActionPAT(action) {
	    switch (action) {
	      case 'PATCheckSelected':
	         this.getGuestCheckDetailPassParams(this.utilityService.globalInstance.SelectedSaleId);
	         this.getSettlementDetails(this.utilityService.globalInstance.SelectedSaleId);
	         /*this._router.navigate(['patseatselection']);*/
	      break;
	      default:
	        break;
	    }
	}

	getSettlementDetails(saleId) {
	    //console.clear();
	    const _apiRoute = this.utilityService.getApiRoute('GetSettlement');
	    const param = "?customernumber=0&saleId=" + saleId;
	    console.log("Settlement: "+this.utilityService.localBaseAddress + _apiRoute + param);
	    this.service.getSettlement(this.utilityService.localBaseAddress + _apiRoute + param, this.utilityService.storeId)
	    .subscribe(data => {
	    	this.utilityService.settlement = JSON.parse(data['result']);
		   	this.utilityService.balance = this.utilityService.grandtotal;
	    	console.log(this.utilityService.settlement);
	    }, error => {
	        this.toastr.error(error,"Error", {timeOut: 2000});
	    }, () => {
	        this.utilityService.settlement.forEach((item, idx) => {
				let transactionAmount = Number(item.Transactionamount);

				let balance = Number(this.utilityService.balance.replace(/[^0-9.-]+/g,"")) - transactionAmount;

				this.utilityService.balance = balance.toFixed(2);
				console.log("balance: "+this.utilityService.balance);
			});

				if(this.utilityService.inputedAmount == parseFloat(this.utilityService.balance.toString().replace(/[^0-9.-]+/g,"")))
				{
					this.balance = 0.00;
				}
				else {
					this.balance = parseFloat(this.utilityService.balance.toString().replace(/[^0-9.-]+/g,""));
				}

	    });
	}

	getGuestCheckDetailPassParams(saleid) {
	    //console.clear();
	    const _apiRoute = this.utilityService.getApiRoute('GetGuestCheckDetail');
	    this.service.getGuestCheckDetail(this.utilityService.localBaseAddress + _apiRoute + saleid, this.utilityService.storeId)
	    .subscribe(data => {
	      this.utilityService.guestCheck = JSON.parse(data['result']);
	      console.log(this.utilityService.guestCheck );
	    }, error => {
	        this.toastr.error(error,"Error", {timeOut: 2000});
	    }, () => {
	    /*     this.utilityService.patCheckNumber = this.utilityService.guestCheck[0].CheckNumber; */
			this.utilityService.patTableName = this.utilityService.guestCheck[0].TableName;
        	this.utilityService.totalTax = this.utilityService.guestCheck[0].SaleSummary.TotalTax;
        	this.utilityService.grandtotal = this.utilityService.guestCheck[0].SaleSummary.Total;
        	this.utilityService.discounttotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].DiscountTotal;
	        this._router.navigate(['patselectedcheck']);
	    });
	}

	getCustomerDetailCreditCard(customerId) {
		let _apiRoute = this.utilityService.getApiRoute('GetCustomerDetailCreditCard');
		this.service.getCustomerDetailCreditCard(this.utilityService.baseAddress + _apiRoute + customerId,this.utilityService.storeId).subscribe(data => {
			this.utilityService.customerDetailCreditCard = JSON.parse(data['result']);
		},error => {

		}, ()=> {

		})
	}

	getGuestCheckDetail(saleid) {
		const _apiRoute = this.utilityService.getApiRoute('GetGuestCheckDetail');
		this.service.getGuestCheckDetail(this.utilityService.localBaseAddress + _apiRoute + saleid,this.utilityService.storeId)
		.subscribe(data=>{
		/*this.service.sampleGuestCheckDetail()
		.subscribe(data=>{*/

			this.utilityService.guestCheck = JSON.parse(data['result']);
			//this.utilityService.sampleGuestCheck = data;
			//this.utilityService.sampleGuestCheck = data.GuestCheck;

			console.log("getGuestCheckDetail display list of guestCheck");
			console.log(this.utilityService.guestCheck); 

		},error=>{
			console.log(error);
		},()=>{
		   /*  this.utilityService.patCheckNumber = this.utilityService.guestCheck[0].CheckNumber; */
		    this.utilityService.patTableName = this.utilityService.guestCheck[0].TableName;
		/*        this.subTotal = this.guestCheck[0].SaleSummary.SubTotal; */
		    this.utilityService.totalTax = this.utilityService.guestCheck[0].SaleSummary.TotalTax;
		    this.utilityService.grandtotal = this.utilityService.guestCheck[0].SaleSummary.Total;

		    this.utilityService.balance = this.utilityService.guestCheck[0].SaleSummary.Total;
		    this.utilityService.subTotal = this.utilityService.guestCheck[0].SaleSummary.Total;

		    this.recomputeGrandTotal();
		});
		console.log('api: '+this.utilityService.baseAddress + _apiRoute + saleid);
		console.log("this.guestCheck");
		console.log(this.utilityService.guestCheck);
	}

	recomputeGrandTotal() {
		this.utilityService.subTotal = "0";
		this.utilityService.grandtotal = "0";
		this.utilityService.totalTax = "0";
		this.utilityService.guestCheck.forEach((item, idx) => {
			let strActualPrice = item.ActualPrice;
			let actualPrice = Number(strActualPrice.replace(/[^0-9.-]+/g,""));

			let subtotal = Number(this.utilityService.subTotal.replace(/[^0-9.-]+/g,""))
			let grandtotal = Number(this.utilityService.grandtotal.replace(/[^0-9.-]+/g,""))

			if(item.PaidFlag == "0"){
				subtotal = (subtotal) + actualPrice;
				grandtotal = subtotal + parseFloat(this.utilityService.totalTax);
			}

			this.utilityService.subTotal = subtotal.toFixed(2);
			this.utilityService.grandtotal = grandtotal.toFixed(2);
			this.utilityService.balance = grandtotal.toFixed(2);
		});
		
		if(this.utilityService.subTotal.trim()!="" 
			&& this.utilityService.grandtotal.trim()!=""
			&& this.utilityService.splitEven > 0){
			let subtotal = parseFloat(this.utilityService.subTotal);
			let grandtotal = parseFloat(this.utilityService.grandtotal);

			subtotal = (subtotal / this.utilityService.splitEven);
			grandtotal = (grandtotal / this.utilityService.splitEven);

			this.utilityService.subTotal = subtotal.toFixed(2);
			this.utilityService.grandtotal = grandtotal.toFixed(2);
		}

		console.log(this.utilityService.payCheck);
	}

	/*deductEntireCheck() {
		let totalPayment = this.utilityService.inputedAmount;
		this.utilityService.guestCheck.forEach((item, idx) => {
			let seatNo = this.utilityService.guestCheck[idx].SeatNo;
			if(seatNo != "" && seatNo != null && totalPayment>0){
				let strRemainingTotal = this.utilityService.guestCheck[idx].SaleSummary.SubTotal;
				let remainingTotal = Number(strRemainingTotal.replace(/[^0-9.-]+/g,""));
				let tempTotal = totalPayment - remainingTotal;
				this.utilityService.guestCheck[idx].PaidFlag = "0";
				if(tempTotal<0){
					remainingTotal = remainingTotal - totalPayment;
					totalPayment = 0;
				}else{
					totalPayment = tempTotal;
					remainingTotal = 0;
					this.utilityService.guestCheck[idx].PaidFlag = "1";
				}
				console.log("before SubTotal:"+strRemainingTotal+" tempTotal:"+tempTotal+
					" paidFlag:"+this.utilityService.guestCheck[idx].PaidFlag+
					" after SubTotal:"+remainingTotal);
				this.utilityService.guestCheck[idx].SaleSummary.SubTotal = remainingTotal.toString();
			}
		});

		let paid = "0";
		this.utilityService.guestCheck.forEach((item, idx) => {
			if(this.utilityService.guestCheck[idx].SeatNo != "" 
				&& this.utilityService.guestCheck[idx].SeatNo != null){
				paid = this.utilityService.guestCheck[idx].PaidFlag.toString();
			}else{
				this.utilityService.guestCheck[idx].PaidFlag = paid.toString();
			}
		});
		console.log("After deduction made!");
		console.log(this.utilityService.guestCheck);
	}

	deductPayBySeat() {
		let totalPayment = this.utilityService.inputedAmount;
		this.utilityService.guestCheck.forEach((item, idx) => {
			const resultIndex = this.utilityService._seatPayments.findIndex(seat=> seat.seatNo === item.SeatNo);
			if(resultIndex>=0){
				let strRemainingTotal = this.utilityService.guestCheck[idx].SaleSummary.SubTotal;
				let remainingTotal = Number(strRemainingTotal.replace(/[^0-9.-]+/g,""));
				let tempTotal = totalPayment - remainingTotal;
				let paidFlag = 0;
				if(tempTotal<0){
					remainingTotal = remainingTotal - totalPayment;
					totalPayment = 0;
				}else{
					totalPayment = tempTotal;
					remainingTotal = 0;
					paidFlag = 1;
				}

				console.log("remainingTotal: "+strRemainingTotal.toString()+" tempTotal: "+tempTotal.toString()+" PaidFlag: "+paidFlag.toString());
				
				this.utilityService.guestCheck[idx].SaleSummary.SubTotal = remainingTotal.toString();
				this.utilityService.guestCheck[idx].PaidFlag = paidFlag.toString();
			}
		});

		let paid = "0";
		this.utilityService.guestCheck.forEach((item, idx) => {
			let seatNo = this.utilityService.guestCheck[idx].SeatNo;
			if(seatNo!="" && seatNo!=null){
				paid = this.utilityService.guestCheck[idx].PaidFlag.toString();
			}else{
				this.utilityService.guestCheck[idx].PaidFlag = paid.toString();
			}
		});

		console.log(this.utilityService.guestCheck);
	}*/

	TriposAuth() {
		this.utilityService.payCheck = {
			StoreId: this.utilityService.storeId,
			TableName: Number(this.utilityService.patTableName),
			 PaymentMedia: this.selectedPayment,
			PaymentType: this.paymentType,
			SaleId: this.utilityService.globalInstance.SelectedSaleId,
			Total: this.utilityService.inputedAmount.toString(),
			Balance : this.utilityService.balance.toString().replace(/[^0-9.-]+/g,""),
			SeatNumber: 1 ,
			TotalTax: this.utilityService.totalTax.toString(),
			MediaIndex: -1,
			Tip: this.utilityService.inputed_tip.toString()
		} as PayCheck;


		let status; let message;
		this.service.savePayCheck(this.utilityService.payCheck,this.utilityService.localBaseAddress + '/api/payment/v1/PayCheck')
		.subscribe(payCheck=> {
			this.utilityService.payCheck = payCheck; 
			status = payCheck['status-code'];
			message = payCheck['message'];
		},error=>{
			console.log(error);
			/* this.toastr.error(error.toString(),"Error", {timeOut: 2000}); */
			this.utilityService.creditCardDialogButtons = true;
			this.utilityService.creaditCardMsg = 'Authorization failed!';	
		},()=>{
			if(status == 201) {				
				this.utilityService.creaditCardMsg = 'Authorization Success!';	
				this.utilityService.authorizationOkBtn = true;
			} else {
				this.utilityService.authorizationOkBtn = true;
				this.utilityService.creaditCardMsg = 'Authorization failed!';			
			}			
		});
	}

	savePayment(payCheckDetail, ApiURL) {
		let status; let message;
		this.service.savePayCheck(payCheckDetail,ApiURL)
		.subscribe(payCheck=> {
		/* 	this.utilityService.payCheck = payCheck;  */
			this.utilityService.ccTransactionDetail = payCheck["result"];
			console.log(this.utilityService.ccTransactionDetail);
			status = payCheck['status-code'];
			message = payCheck['message'];
			localStorage.setItem('ccTransDetail', JSON.stringify(this.utilityService.ccTransactionDetail));
		},error=>{
			console.log(error);
			/* this.toastr.error(error.toString(),"Error", {timeOut: 2000}); */
			this.utilityService.creditCardDialogButtons = true;
			this.utilityService.creaditCardMsg= error.substring(1, 50);	
		},()=>{
			if(status == 201) {			
				if(this.balance > 0){
					this.getGuestCheckDetail(this.utilityService.globalInstance.SelectedSaleId);
				}else{
					console.log("success on saving!");
					this.utilityService.creaditCardMsg = message;
					this.toastr.info("Transaction Approved!","Information", {timeOut: 2000});
					this.sleep(900);
					this.utilityService.inputedAmount = 0;
					this.utilityService.inputed_tip = "0";
					this.backToFloorPlan('BACK TO FLOOR PLANS', null, null, null, null, null, null, false);
				}
				if(this.printReceipt == true) {
					buildMessage();
					localStorage.setItem('ccTransDetail',null)
				}	
			} else if(status == 200) {
				this.utilityService.creditCardDialogButtons = true;
				this.utilityService.creaditCardMsg = message.substring(1, 50);	
			} else {
				this.utilityService.creditCardDialogButtons = true;
				this.utilityService.creaditCardMsg = 'Transaction failed!';			
			}			
		});
	}

	hideMealAndCustomerDetailDiv() {
		this.utilityService.showButtonReAssignSeatAndRemoveSeat = false;
		this.utilityService.showMealDiv = false;
		this.utilityService.showCustomerDetail = false;
		this.utilityService.showCustomerDetail2 = false;
		this.utilityService.showButtonAssignSeat = false;
		this.utilityService.showCustomerSearchDiv = false;
	  }
	  clearSelectedItemIndexes() {
		localStorage.setItem('SelectedItemIndex', null);
		this.utilityService.array = [];
		this.utilityService.saleItemArray = [];
	/* 	this.itemArray = []; */
		localStorage.setItem('SelectedItemIndexDeletable',null);
		this.utilityService.itemsDeletable = [];
	  }

	backToFloorPlan(action, tablename, tableshape, seatCount, layoutTableId, takenSeats, saleid, defaultMenu){
		const _apiRoute = this.utilityService.getApiRoute('GetSelectedRoomURL');
      // tslint:disable-next-line: max-line-length
      this.service.selectedRoom(this.utilityService.localBaseAddress+ _apiRoute, this.utilityService.preSelectedRoom + '/' + this.utilityService.globalInstance.CurrentUser.EmpID)
      .subscribe(room => {
        this.utilityService.layoutTable = JSON.parse(room['result']);
      }, error => {
        this.toastr.error(error,'Error', {timeOut: 3000});
      }, () => {
        this.hideMealAndCustomerDetailDiv();
        this.utilityService.takenSeatsArray = null;
        this.utilityService.screen = 'rso-main';
        this.utilityService._seats = null;
        this.utilityService.iterateSeat = [];
        this.utilityService.prevSelectedSeat = null;
        this.utilityService.successsAssignSeat = null;
        this.utilityService.checkNumbers = null;
        this.utilityService.isReassignSeat = false;
/*         console.clear(); */
        this.utilityService.selectedSeat = null;
        this.utilityService._selectedSeatOrderUI = null;
        this.clearSelectedItemIndexes();
        this._router.navigate(['roomselection']);
      });
	}

	highlightTip(){
		var element = document.getElementById("tipDiv");
		if(this.utilityService.tip_isActive == false) {
			this.utilityService.tip_isActive = true;
			this.toastr.info('Please input tip amount', 'Information', {timeOut: 3000});
			element.classList.add("box-2");
		} else {
			this.utilityService.tip_isActive = false;
			element.classList.remove("box-2");
		}

	}



	payCheck(PaymentMedia,PaymentType,saleId,Total,Balance,CustomerId,mediaIndex) {
		if(this.selectedPayment.trim() == ""){
			this.toastr.info("Please select your Payment Type!","Information", {timeOut: 2000});
		}else{

			let seatNo = 0;
			
			let storeID = (this.utilityService.storeId==null ? 0 : this.utilityService.storeId);

			this.utilityService._seatPayments.forEach((item, idx) => {
				seatNo = Number(item.seatNo.replace(/[^\d.-]/g, ''));
			});

			
			//
			this.utilityService.payCheck = {
			    StoreId: storeID,
			    TableName: Number(this.utilityService.patTableName),
			 /*    PaymentMedia: "Meal Credits",//this.selectedPayment, */
			 	PaymentMedia: this.selectedPayment,
			    PaymentType: this.paymentType,
			    SaleId: this.utilityService.globalInstance.SelectedSaleId,
			    Total: this.utilityService.inputedAmount.toString(),
			  /*   Balance: (this.getRemainingAmount()).toFixed(2).toString(), */
				Balance : this.utilityService.balance.toString().replace(/[^0-9.-]+/g,""),
				SeatNumber: seatNo ,
				TotalTax: this.utilityService.totalTax.toString(),
				MediaIndex: mediaIndex,
				Tip: this.utilityService.inputed_tip.toString(),
				IsOnline: this.utilityService.hasInternetConnection
			} as PayCheck;

			console.log("PayCheck Value");
			console.log(this.utilityService.payCheck);
			//this.deleteSampleData("http://localhost:3004/GuestCheck/");
			switch(this.utilityService.payment_Option.toLowerCase().trim()){
				case "entire check":
					//this.deductEntireCheck();
					this.savePayment(this.utilityService.payCheck,this.utilityService.localBaseAddress + 'api/payment/v1/PayCheck');	
					this.balance = (this.getRemainingAmount());			
					break;
				case "pay by seat":
					//this.deductPayBySeat();

					this.savePayment(this.utilityService.payCheck,this.utilityService.localBaseAddress + 'api/payment/v1/PayCheck');
					this.balance = (this.getRemainingAmount());
					this.utilityService.inputedAmount = 0;
					break;
				default:
					//this.deductEntireCheck();
					
					this.savePayment(this.utilityService.payCheck,this.utilityService.localBaseAddress + 'api/payment/v1/PayCheck');
					this.balance = (this.getRemainingAmount());
					break;
			}
		}
	}

	getRemainingAmount(){
		let retVal = 0;
		/*if(this.utilityService.splitEven > 0){
			retVal = parseFloat(this.utilityService.balance.toString().replace(/[^0-9.-]+/g,""));
			for(let x=0;x<this.utilityService.splitEven;x++){
				retVal = retVal - parseFloat(this.utilityService.inputedAmount.toString());
			}
		}else{
			retVal = parseFloat(this.utilityService.balance.toString().replace(/[^0-9.-]+/g,""));
			retVal = retVal - parseFloat(this.utilityService.inputedAmount.toString());
		}*/
		retVal = parseFloat(this.balance.toString().replace(/[^0-9.-]+/g,""));
		retVal = retVal - parseFloat(this.utilityService.inputedAmount.toString());
		if(retVal<0){
			retVal = 0;
		}
		retVal = Number(retVal.toFixed(2));
	/* 	alert(retVal); */
		/*console.log("grandtotal: "+parseFloat(this.utilityService.grandtotal));
		console.log("inputedAmount: "+parseFloat(this.utilityService.inputedAmount));
		console.log("return value: "+retVal);*/
		/*console.log("balance: "+parseFloat(this.balance.toString().replace(/[^0-9.-]+/g,"")));
		console.log("inputedAmount: "+parseFloat(this.utilityService.inputedAmount.toString()));
		console.log("retVal: "+retVal);*/
		return retVal;
	}

	openDiaglogPaymentSuccessful(){
		let dialog = this.dialog.open(PaymentSuccessfulComponent);
	}

	getbuttonActionRSO(action,tablename='',tableshape='',seatCount='',layoutTableId='',takenSeats='',checknumbers='') {
	    switch(action) {
			case 'BACK TO FLOOR PLANS' :
				this.utilityService.screen = 'rso-main';
				const _apiRoute = this.utilityService.getApiRoute('GetSelectedRoomURL');
				this.service.selectedRoom(this.utilityService.baseAddress + _apiRoute, this.utilityService.preSelectedRoom + '/' + this.utilityService.globalInstance.CurrentUser.EmpID)
				.subscribe(room => {
					this.utilityService.layoutTable = JSON.parse(room['result']);
				}, error => {
					/* return alert(error); */
				}, () => {
					//this.hideMealAndCustomerDetailDiv();
					this.utilityService.takenSeatsArray = null;
					this.utilityService.screen = 'rso-main';
					this.utilityService._seats = null;
					this.utilityService.iterateSeat = [];
					this.utilityService.prevSelectedSeat = null;
					this.utilityService.successsAssignSeat = null;
					this.utilityService.checkNumbers = null;
					this.utilityService.isReassignSeat = false;
					/*         console.clear(); */
					this.utilityService.selectedSeat = null;
					this.utilityService._selectedSeatOrderUI = null;
					//this.clearSelectedItemIndexes();
				});

				this._router.navigate(['roomselection']);
				break;
			default:
				//this.screen = 'signOn';
				break;
	    }
	}

	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, this.utilityService.appSetting[0].TimeLimitation['ResponseTime']))
		//return new Promise(resolve => setTimeout(resolve, ms));
	}

	updateBalance(){
		let ctr = 0;
		this.utilityService.balance = "0";
		//console.log(this.utilityService.guestCheck);
		this.utilityService.guestCheck.forEach((item, idx) => {
			let strActualPrice = item.Price;
			let subtotal = Number(strActualPrice.replace(/[^0-9.-]+/g,""));

			//let subtotal = Number(this.utilityService.subTotal.replace(/[^0-9.-]+/g,""))
			let grandtotal = Number(this.utilityService.grandtotal.replace(/[^0-9.-]+/g,""))

			if(item.PaidFlag == "0"){
				//subtotal = (subtotal) + actualPrice;
				grandtotal = subtotal + parseFloat(this.utilityService.totalTax);
				this.utilityService.balance  = (parseFloat(this.utilityService.balance) + grandtotal).toFixed(2).toString();
			}
			ctr=ctr+1;
		});
		if(ctr==this.utilityService.guestCheck.length){
			if(parseFloat(this.utilityService.balance) <= 0){
				this.sleep(1000);
				this.getbuttonActionRSO('BACK TO FLOOR PLANS');
			}	
		}	
	}

		showdiaglogCreditCard(){
		this.diaglogCreditCard.show();
	  }
	  hidediaglogCreditCard() {
		this.utilityService.creditCardDialogButtons = false;
		this.utilityService.authorizationOkBtn = false;
		this.diaglogCreditCard.hide();
	  }

	  showDialogCreditCardPrintReceipt(){
		this.diaglogCreditCardConfirmation.show();
	  }

	  hideDialogCreditCardPrintReceipt(){
		localStorage.setItem('ccTransDetail',null)
		this.diaglogCreditCardConfirmation.hide();
	  }

	  yesToPrintReceipt(){
		  this.printReceipt = true;
		  this.diaglogCreditCardConfirmation.hide();
	  }

}
