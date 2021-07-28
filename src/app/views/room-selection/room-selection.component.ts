import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,ViewChild} from '@angular/core';
import { FormControl, FormBuilder, FormGroup} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ICustomer } from '../../shared/customer';
import { SiposService } from '../../shared/sipos.service';
import { Router} from '@angular/router';
import { UtilityService } from '../../services/utility.service';
import { LoadingmodalComponent } from '../loadingmodal/loadingmodal.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TableinfoComponent } from '../tableinfo/tableinfo.component';
import { LongPress } from '../../events/long-press';
import {
  LogOut,
  IEmployeeCheck,
  IEmployee
} from '../../obj-interface';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalDirective } from 'ngx-bootstrap/modal';
export interface SampleObj{
  id: string;
  class: string;
  color: string
}

@Component({
  selector: 'app-room-selection',
  templateUrl: './room-selection.component.html',
  styleUrls: ['./room-selection.component.css']
})
export class RoomSelectionComponent implements OnInit {

	form: FormGroup;
	myControl = new FormControl();
	filteredOptions: Observable<ICustomer[]>;
	animationState: string;
	setStatus = '';
	redirect = false;
	dialogLoadingRef;
	startTime;
	endTime;
	idleState = 'Not started.';
	timedOut = false;
	lastPing?: Date = null;
	title = 'angular-idle-timeout';
	selectedModalEmployeeNumber = 0;
	public modalRef: BsModalRef;
  
	@ViewChild('childModal', { static: false }) childModal: ModalDirective;
	@ViewChild('openEmployeeCheckList', { static: false }) openEmployeeCheckList: ModalDirective;
	@ViewChild('openEmployeeStatusCheckList', { static: false }) openEmployeeStatusCheckList: ModalDirective;
	@ViewChild('diagloNotAuthorized', { static: false }) diagloNotAuthorized: ModalDirective;
	constructor(
		private _router: Router,
	    private service: SiposService,
	    public utilityService: UtilityService,
	    private toastr: ToastrService,
	    public dialog: MatDialog,
	    public dialogUploadPhoto: MatDialog,
	    public dialogChangeTable: MatDialog,
		private http: HttpClient,
		private idle: Idle, private keepalive: Keepalive,
		private modalService: BsModalService,
	    private formBuilder: FormBuilder) {
			this.getEmployeeCheckList();
			this.getEmployeeStatusCheckList();
    }

	ngOnInit() {
	/* 	console.clear(); */
	}

	saveScreenLayoutDetails(){

		if(this.utilityService.showHandler){
			this.utilityService.screenLayoutArr = [
				{"appId":"","empId":this.utilityService.globalInstance.CurrentUser.EmpID,"controlPanel":"signOnHead","position":"1","appClass":"row","backgroundColor":"","storeId":this.utilityService.storeId},
			    {"appId":"","empId":this.utilityService.globalInstance.CurrentUser.EmpID,"controlPanel":"signOnDetail","position":"2","appClass":"row","backgroundColor":"","storeId":this.utilityService.storeId},
			    {"appId":"","empId":this.utilityService.globalInstance.CurrentUser.EmpID,"controlPanel":"signOnNumpad","position":"1","appClass":"col-sm-5","backgroundColor":"","storeId":this.utilityService.storeId},
			    {"appId":"","empId":this.utilityService.globalInstance.CurrentUser.EmpID,"controlPanel":"signOnControlBtn","position":"2","appClass":"col-sm-3","backgroundColor":"","storeId":this.utilityService.storeId},
			    {"appId":"","empId":this.utilityService.globalInstance.CurrentUser.EmpID,"controlPanel":"roomlist","position":"1","appClass":"col-sm-3","backgroundColor":"#343B45","storeId":this.utilityService.storeId},
			    {"appId":"","empId":this.utilityService.globalInstance.CurrentUser.EmpID,"controlPanel":"tablelist","position":"2","appClass":"col-sm-9","backgroundColor":"#D2D3D4","storeId":this.utilityService.storeId},
			    {"appId":"","empId":this.utilityService.globalInstance.CurrentUser.EmpID,"controlPanel":"rsoimagediv","position":"1","appClass":"col-sm-3","backgroundColor":"","storeId":this.utilityService.storeId},
			    {"appId":"","empId":this.utilityService.globalInstance.CurrentUser.EmpID,"controlPanel":"rsodetaildiv","position":"2","appClass":"col-sm-9","backgroundColor":"","storeId":this.utilityService.storeId},
			    {"appId":"","empId":this.utilityService.globalInstance.CurrentUser.EmpID,"controlPanel":"orderbuttoncontrol","position":"1","appClass":"row","backgroundColor":"#343B45","storeId":this.utilityService.storeId},
			    {"appId":"","empId":this.utilityService.globalInstance.CurrentUser.EmpID,"controlPanel":"orderdetailcontrol","position":"2","appClass":"row","backgroundColor":"#343B45","storeId":this.utilityService.storeId},
			    {"appId":"","empId":this.utilityService.globalInstance.CurrentUser.EmpID,"controlPanel":"orderguestcheckdiv","position":"1","appClass":"col-sm-3","backgroundColor":"#343B45","storeId":this.utilityService.storeId},
			    {"appId":"","empId":this.utilityService.globalInstance.CurrentUser.EmpID,"controlPanel":"ordertablediv","position":"2","appClass":"col-sm-2","backgroundColor":"#343B45","storeId":this.utilityService.storeId},
			    {"appId":"","empId":this.utilityService.globalInstance.CurrentUser.EmpID,"controlPanel":"ordermenuitemdiv","position":"3","appClass":"col-sm-7","backgroundColor":"#343B45","storeId":this.utilityService.storeId},
			    {"appId":"","empId":this.utilityService.globalInstance.CurrentUser.EmpID,"controlPanel":"split","position":"1","appClass":"col-sm-4","backgroundColor":"#343B45","storeId":this.utilityService.storeId},
			    {"appId":"","empId":this.utilityService.globalInstance.CurrentUser.EmpID,"controlPanel":"seat","position":"2","appClass":"col-sm-8","backgroundColor":"#D2D3D4","storeId":this.utilityService.storeId},
			    {"appId":"","empId":this.utilityService.globalInstance.CurrentUser.EmpID,"controlPanel":"checkdetaildiv","position":"1","appClass":"row","backgroundColor":"#343B45","storeId":this.utilityService.storeId},
			    {"appId":"","empId":this.utilityService.globalInstance.CurrentUser.EmpID,"controlPanel":"checkbuttondiv","position":"2","appClass":"row","backgroundColor":"#343B45","storeId":this.utilityService.storeId}
			];
			//var ctr = 0;

			const _apiRoute = this.utilityService.getApiRoute('SaveScreenLayout');
			const ApiURL = this.utilityService.localBaseAddress + _apiRoute;

			for (const data of this.utilityService.screenLayoutArr) {
				this.service.saveScreenLayoutDetail(data,ApiURL)
				.subscribe(result=> {
					console.log(result);
				},error=>{
					console.log(error);
					this.toastr.error(error.toString(),"Error", {timeOut: 2000});
				},()=>{
					console.log("success on saving!");
					//ctr++;
				});
			}

		}

		/*if(ctr==this.utilityService.screenLayoutArr.length){
			this.getScreenLayoutDetail();
		}*/
	}

	setSelectedEmployeeCheckList(saleid,empid,checkNumber){
		console.log('1' + this.utilityService.selectedEmployeeCheckList.length);
		if(this.utilityService.selectedEmployeeCheckList.length > 0){
		  document.getElementById('EmployeeCheckListID-' + this.utilityService.selectedEmployeeCheckList).removeAttribute('class');
		  this.utilityService.selectedEmployeeCheckList = '';
		} 
		this.selectedModalEmployeeNumber=empid;
		this.utilityService.selectedEmployeeCheckList=saleid;
		document.getElementById('EmployeeCheckListID-' + saleid).className = 'highLightItem';
		this.utilityService.selectedEmployeeCheckListMsg = 'Check Number: ' + checkNumber;
	}

	getEmployeeCheckList() {
		console.log("sulod sa getEmployeeCheckList");
		let message: string;
		let statusCode: number;
		const _apiRoute = this.utilityService.getApiRoute('EmployeeCheckList');
		this.service.getEmployeeCheck(this.utilityService.localBaseAddress + _apiRoute + this.utilityService.globalInstance.CurrentUser.EmpID)
		.subscribe(data => {
		  console.log(data);
		  message = data['message'];
		  statusCode = data['status-code'];
		  this.utilityService.employeeCheckList = JSON.parse(data['result']);
		}, error => {
		  console.log(error);
		  this.toastr.error('Error',error,{timeOut:3000})
		}, () => {
		  console.log("EmployeeCheckList");
		  console.log(this.utilityService.employeeCheckList);
		  if(this.utilityService.employeeCheckList.length > 0){
		  	this.openEmployeeCheckListModal();
		  }
		});
	}

	getEmployeeStatusCheckList() {
		console.log("sulod sa getEmployeeStatusCheckList");
		let message: string;
		let statusCode: number;
		const _apiRoute = this.utilityService.getApiRoute('EmployeeStatusCheckList');
		this.service.getEmployeeCheck(this.utilityService.localBaseAddress + _apiRoute + this.utilityService.globalInstance.CurrentUser.EmpID)
		.subscribe(data => {
		  console.log(data);
		  message = data['message'];
		  statusCode = data['status-code'];
		  this.utilityService.employeeStatusCheckList = JSON.parse(data['result']);
		}, error => {
		  console.log(error);
		  
		}, () => {
		  console.log("EmployeeStatusCheckList");
		  console.log(this.utilityService.employeeStatusCheckList);
		  if(this.utilityService.employeeStatusCheckList.length > 0){
		  	this.openEmployeeStatusCheckListModal();
		  }
		});
	}

	openEmployeeStatusCheckListModal(){
		this.openEmployeeStatusCheckList.show();
	}

	closeOpenEmployeeStatusCheckListModal(){
		this.openEmployeeStatusCheckList.hide();
	}

	openEmployeeCheckListModal(){
		console.log("sulod sa openEmployeeCheckListModal");
		if(this.utilityService.selectedEmployeeCheckList != ''){
		  console.log('EmployeeCheckListID-' + this.utilityService.selectedEmployeeCheckList);
		  document.getElementById('EmployeeCheckListID-' + this.utilityService.selectedEmployeeCheckList).removeAttribute('class');
		  this.utilityService.selectedEmployeeCheckList = '';
		  this.utilityService.selectedEmployeeCheckListMsg = '';
		}
		this.openEmployeeCheckList.show();
	}

	closeOpenEmployeeCheckListModal(){
		if(this.utilityService.selectedEmployeeCheckList != ''){
		  document.getElementById('EmployeeCheckListID-' + this.utilityService.selectedEmployeeCheckList).removeAttribute('class');
		  this.utilityService.selectedEmployeeCheckList='';
		} 
		this.selectedModalEmployeeNumber = 0;
		this.openEmployeeCheckList.hide();
	}

	openDialogNotAuthorized(){
		this.diagloNotAuthorized.show();
	}
	closeDialogNotAuthorized() {
		this.diagloNotAuthorized.hide();
	}

	clearSelectedItemIndexes() {
	    localStorage.setItem('SelectedItemIndex', null);
	    this.utilityService.array = [];
	    this.utilityService.saleItemArray = [];
	    //this.itemArray = [];
	    localStorage.setItem('SelectedItemIndexDeletable',null);
	    this.utilityService.itemsDeletable = [];

	    this.utilityService.preSelectedRoom = this.utilityService.roomList[0].RoomIndex;
	    this.utilityService.selectedroom = this.utilityService.roomList[0].RoomName;
	    const _apiRoute = this.utilityService.getApiRoute('GetSelectedRoomURL');
	    this.service.selectedRoom(this.utilityService.localBaseAddress + _apiRoute, this.utilityService.preSelectedRoom + '/' + this.utilityService.globalInstance.CurrentUser.EmpID)
	    .subscribe(room => {
	      this.utilityService.layoutTable = JSON.parse(room['result']);
	      console.log(this.utilityService.layoutTable);
	    }, error => {
	      this.toastr.error(error,"Error", {timeOut: 2000});
	    }, () => {
	      if(this.utilityService.layoutTable != null) {
	        this.utilityService.globalInstance.SelectedTableName =  this.utilityService.layoutTable[0].TableName;
	      }
	    });
	}

	setTransferTable(){
		const _apiRoute = this.utilityService.getApiRoute('TransferCheck');
		const ApiURL = this.utilityService.localBaseAddress + _apiRoute;

		var _emp = {
		      EmpNumber: this.utilityService.globalInstance.CurrentUser.EmpID.toString(),
		      EmpFrom: this.selectedModalEmployeeNumber,
		      SaleId: this.utilityService.selectedEmployeeCheckList
		    } as IEmployee;

		this.service.transferCheck(_emp, ApiURL)
		  .subscribe(result => {
		    console.log(result);
		  }, error => {
		    this.toastr.error("Error", error, {timeOut:3000})
		  }, () => {
		      //this.loadMealPlanCustomerDetail(this.utilityService._posChecknumber.toString());
		      this.closeOpenEmployeeCheckListModal();
		      this.clearSelectedItemIndexes();
		  }
		);
	}

	setCancelCheck(){
		const _apiRoute = this.utilityService.getApiRoute('CancelEmployeeCheck');
		const ApiURL = this.utilityService.localBaseAddress + _apiRoute;

		var _emp = {
		      EmpNumber: this.utilityService.globalInstance.CurrentUser.EmpID.toString(),
		      EmpFrom: this.selectedModalEmployeeNumber,
		      SaleId: this.utilityService.selectedEmployeeCheckList
		    } as IEmployee;

		this.service.transferCheck(_emp, ApiURL)
		  .subscribe(result => {
		    console.log(result);
		  }, error => {
		    this.toastr.error("Error", error, {timeOut:3000})
		  }, () => {
		      //this.loadMealPlanCustomerDetail(this.utilityService._posChecknumber.toString());
		      this.closeOpenEmployeeCheckListModal();
		      this.clearSelectedItemIndexes();
		  }
		);
	}

	showTableDetails(){
        const dialogRef = this.dialog.open(TableinfoComponent, {panelClass: 'tableinfo-dialog'});
        dialogRef.afterClosed().subscribe(
            data => {
            console.log("done showing message! This is the message: "+this.utilityService.message);
            console.log(data);
            if (this.utilityService.message == '') {
                /*    this.toastr.warning('No message'); */
            } else {
                this.utilityService.message = null;
            }   
        }
        );
    }
	onPress(event: any){
        this.startTime = new Date();
        console.log("onPress Called!");
        
    }
    onPressUp(event: any, tableID: any, tableName: any, checkNumbers: any, tableShape: any, tableSeatCount: any){
        this.endTime = new Date();
        let timeDiff = this.endTime - this.startTime; //in ms
        // strip the ms
        timeDiff /= 1000;
        // get seconds 
        let seconds = Math.round(timeDiff);
        console.log(seconds + " seconds");
        if(seconds >= 1){
            if(checkNumbers == null || checkNumbers == ""){
                this.toastr.info("Empty Table!","Information", {timeOut: 2000});
            }else{
                this.utilityService.globalInstance.SelectedLayoutTableId = tableID;
                this.utilityService.globalInstance.SelectedTableName = tableName;
                this.utilityService.selectedtableShape = tableShape;
                this.utilityService.chosenTableShape = tableShape;
                this.utilityService.menuDiv = false;
                this.utilityService.showAddOrder = false;
                this.utilityService.showMealDiv = false;
                this.utilityService.showCustomerDetail = false;
                this.utilityService.showCustomerDetail2 = false;
                this.utilityService.showButtonReAssignSeatAndRemoveSeat = false;
                this.utilityService.seatCount = tableSeatCount;
                this.showTableDetails();
            }
        }else{
            this.startTime = 0;
        }
    }

	public onClickSyncSale() {
		if (this.utilityService.isServerOnline) {
		  const _apiRoute = this.utilityService.getApiRoute('SyncSale');
		  this.syncSale(this.utilityService.localBaseAddress + _apiRoute);
		} 
	  }
	  
	  public syncSale(ApiURL) {
		this.service.syncSale(ApiURL).subscribe(data => {
		  this.utilityService.loadingType = 'uploading';
		  this.showLoadingDialog();
	  }, error => {
		this.toastr.error(error,"Error", {timeOut: 2000});
		this.dialogLoadingRef.close();
	  }, () => {
	  /*   this.toastr.success("Successfully sync to master db"); */
		this.utilityService.hasofflineOrder = false;
		this.dialogLoadingRef.close();
		this.utilityService.SyncStatus = 'DONE';

	  });
	  }
	  


  showLoadingDialog(){
	this.dialogLoadingRef = this.dialog.open(LoadingmodalComponent, {panelClass: 'remove-special'});
	this.dialogLoadingRef.afterClosed().subscribe(
	  data => {
		
	  }
	);
  }

/* 	getStoreID() {
		//console.clear();
		const _apiRoute = this.utilityService.getApiRoute('GetStoreID');
		this.service.getStoreID(this.utilityService.localBaseAddress + _apiRoute)
		.subscribe(data => this.utilityService.storeId = JSON.parse(data['result'])
		, error => {
			console.log(error);
		}, () => {
			console.log("storeId: "+this.utilityService.storeId);
		});
	} */

	getScreenLayoutDetail() {
		console.log("GetScreenLayoutDetail Information!");
		const _apiRoute = this.utilityService.getApiRoute('GetScreenLayoutDetail');
		this.service.getScreenLayoutDetail(this.utilityService.localBaseAddress + _apiRoute + "0/" + this.utilityService.globalInstance.CurrentUser.EmpID)
		.subscribe(data => {
			this.utilityService.screenLayoutArr = JSON.parse(data['result']);
		}, error => {
			this.toastr.info("Fetching ScreenLayout Data!","Information", {timeOut: 2000});
			this.saveScreenLayoutDetails();
		}, () => {
			console.log('This is screenlayout data');
			console.log(this.utilityService.screenLayoutArr);

			if(this.utilityService.screenLayoutArr.length == 0){
				this.saveScreenLayoutDetails();
			}else{
				this.setDraggable();
			}
		});
	}

	setDraggable(){
		this.setDraggableRSComponents();
		this.setDraggableRSOComponents();
		this.setDCOrderingTB();
		this.setDCOrderingLR();
		this.setDraggablePATComponentsLR();
		this.setDraggablePATComponentsTB();
	}

	setDraggablePATComponentsTB(){
		console.clear();
		const tempComponent = this.utilityService.draggablePATComponentsTB;
		var newComponent = [];
		var ctr = 0;

		console.log('draggablePATComponentsTB');
		console.log(this.utilityService.draggablePATComponentsTB);

		this.utilityService.draggablePATComponentsTB = [];

		for (const screenlayout of this.utilityService.screenLayoutArr){
			for (const comp of tempComponent) {
				if (comp.ControlPanel === screenlayout.ControlPanel) {
					ctr++;
					newComponent.push(screenlayout);
					if(ctr==tempComponent.length){
						this.utilityService.draggablePATComponentsTB = newComponent;
						console.log("newComponent");
						console.log(this.utilityService.draggablePATComponentsTB);
					}
					console.log("ctr: "+ctr);
				}
			}
		}
	}

	setDraggablePATComponentsLR(){
		console.clear();
		const tempComponent = this.utilityService.draggablePATComponentsLR;
		var newComponent = [];
		var ctr = 0;

		console.log('draggablePATComponentsLR');
		console.log(this.utilityService.draggablePATComponentsLR);

		this.utilityService.draggablePATComponentsLR = [];

		for (const screenlayout of this.utilityService.screenLayoutArr){
			for (const comp of tempComponent) {
				if (comp.ControlPanel === screenlayout.ControlPanel) {
					ctr++;
					newComponent.push(screenlayout);
					if(ctr==tempComponent.length){
						this.utilityService.draggablePATComponentsLR = newComponent;
						console.log("newComponent");
						console.log(this.utilityService.draggablePATComponentsLR);
					}
					console.log("ctr: "+ctr);
				}
			}
		}
	}

	setDCOrderingLR(){
		console.clear();
		const tempComponent = this.utilityService.dcOrderingLR;
		var newComponent = [];
		var ctr = 0;

		console.log('dcOrderingLR');
		console.log(this.utilityService.dcOrderingLR);

		this.utilityService.dcOrderingLR = [];

		for (const screenlayout of this.utilityService.screenLayoutArr){
			for (const comp of tempComponent) {
				if (comp.ControlPanel === screenlayout.ControlPanel) {
					ctr++;
					newComponent.push(screenlayout);
					if(ctr==tempComponent.length){
						this.utilityService.dcOrderingLR = newComponent;
						console.log("newComponent");
						console.log(this.utilityService.dcOrderingLR);
					}
					console.log("ctr: "+ctr);
				}
			}
		}
	}

	setDCOrderingTB(){
		console.clear();
		const tempComponent = this.utilityService.dcOrderingTB;
		var newComponent = [];
		var ctr = 0;

		console.log('dcOrderingTB');
		console.log(this.utilityService.dcOrderingTB);

		this.utilityService.dcOrderingTB = [];

		for (const screenlayout of this.utilityService.screenLayoutArr){
			for (const comp of tempComponent) {
				if (comp.ControlPanel === screenlayout.ControlPanel) {
					ctr++;
					newComponent.push(screenlayout);
					if(ctr==tempComponent.length){
						this.utilityService.dcOrderingTB = newComponent;
						console.log("newComponent");
						console.log(this.utilityService.dcOrderingTB);
					}
					console.log("ctr: "+ctr);
				}
			}
		}
	}

	setDraggableRSOComponents(){
		console.clear();
		const tempComponent = this.utilityService.draggableRSOComponents;
		var newComponent = [];
		var ctr = 0;

		console.log('draggableRSOComponents');
		console.log(this.utilityService.draggableRSOComponents);

		this.utilityService.draggableRSOComponents = [];

		for (const screenlayout of this.utilityService.screenLayoutArr){
			for (const comp of tempComponent) {
				if (comp.ControlPanel === screenlayout.ControlPanel) {
					ctr++;
					newComponent.push(screenlayout);
					if(ctr==tempComponent.length){
						this.utilityService.draggableRSOComponents = newComponent;
						console.log("newComponent");
						console.log(this.utilityService.draggableRSOComponents);
					}
					console.log("ctr: "+ctr);
				}
			}
		}
	}

	setDraggableRSComponents(){
		console.clear();
		const tempComponent = this.utilityService.draggableRSComponents;
		var newComponent = [];
		var ctr = 0;

		console.log('draggableRSComponents');
		console.log(this.utilityService.draggableRSComponents);

		this.utilityService.draggableRSComponents = [];

		for (const screenlayout of this.utilityService.screenLayoutArr){
			for (const comp of tempComponent) {
				if (comp.ControlPanel === screenlayout.ControlPanel) {
					ctr++;
					newComponent.push(screenlayout);
					if(ctr==tempComponent.length){
						this.utilityService.draggableRSComponents = newComponent;
						console.log("newComponent");
						console.log(this.utilityService.draggableRSComponents);
					}
					console.log("ctr: "+ctr);
				}
			}
		}
	}

	getbuttonActionRSO(action, tablename, tableshape, seatCount, layoutTableId, takenSeats, saleid,CheckCreatedByCurrentUser,fromSi360) {
        switch (action) {
            case 'Table Selected' :
				if(fromSi360 == false && saleid != '00000000-0000-0000-0000-000000000000') {
					this.toastr.info('This check is generated from FPOS','Information', {timeOut:3000});
				} else {
					if(this.utilityService.globalInstance.CurrentUser.SecurityLevel >= 10) {
						this.endTime = new Date();
						let timeDiff = this.endTime - this.startTime; //in ms
						// strip the ms
						timeDiff /= 1000;
						// get seconds 
						let seconds = Math.round(timeDiff);
						console.log(seconds + " seconds || startTime: "+this.startTime);
						if(seconds < 1 || this.startTime == 0 || this.startTime == undefined){
							this.toastr.clear()
							  this.redirect = true;
							this.utilityService.globalInstance.SelectedLayoutTableId = layoutTableId;
							this.utilityService.globalInstance.SelectedSaleId = saleid;
							this.utilityService.selectedtableShape = tableshape;
							this.utilityService.chosenTableShape = tableshape;
							this.utilityService.menuDiv = false;
							this.utilityService.showAddOrder = false;
							this.utilityService.showMealDiv = false;
							this.utilityService.showCustomerDetail = false;
							this.utilityService.showCustomerDetail2 = false;
							this.utilityService.showButtonReAssignSeatAndRemoveSeat = false;
							this.selectedTable(seatCount);
							this.utilityService.globalInstance.SelectedTableName = tablename;
						}
					} else {
						if(CheckCreatedByCurrentUser == false) {
							this.openDialogNotAuthorized();
						} else {
							this.endTime = new Date();
								let timeDiff = this.endTime - this.startTime; //in ms
								// strip the ms
								timeDiff /= 1000;
								// get seconds 
								let seconds = Math.round(timeDiff);
								console.log(seconds + " seconds || startTime: "+this.startTime);
								if(seconds < 1 || this.startTime == 0 || this.startTime == undefined){
									this.toastr.clear()
									  this.redirect = true;
									this.utilityService.globalInstance.SelectedLayoutTableId = layoutTableId;
									this.utilityService.globalInstance.SelectedSaleId = saleid;
									this.utilityService.selectedtableShape = tableshape;
									this.utilityService.chosenTableShape = tableshape;
									this.utilityService.menuDiv = false;
									this.utilityService.showAddOrder = false;
									this.utilityService.showMealDiv = false;
									this.utilityService.showCustomerDetail = false;
									this.utilityService.showCustomerDetail2 = false;
									this.utilityService.showButtonReAssignSeatAndRemoveSeat = false;
									this.selectedTable(seatCount);
									this.utilityService.globalInstance.SelectedTableName = tablename;
								}
						}  
					}				  
				}        
            break;
			case 'ADD ORDER':
				  this._router.navigate(['ordering']);
			  break;
          default:
              this.utilityService.screen = 'signOn';
              this._router.navigate(['login']);
            break;
        }
    }

	_css_selectedSeatOrderUI_Highlight(value) {
		let styles;
		if (value.includes(this.utilityService._selectedSeatOrderUI)) {
		  styles = {
			'color': 'black',
			'font-size' : '25px',
			 'background-color' : '#ADD8E6',
			 'border-bottom-style': 'groove'
	/*         'text-align' : 'center' */
			};
		} else {
		  styles = {
			'color': 'black',
			'font-size' : '22px',
			'border-bottom-style': 'groove'
			};
		}
		return styles;
	  }

	getSelectedSeat_OrderUI(_selectedSeat, _customerId) {
		this.utilityService._selectedSeatOrderUI = _selectedSeat;
		this.utilityService._selectedCustomerIdOrderUI = _customerId;
		this._css_selectedSeatOrderUI_Highlight(_selectedSeat);
		this.toastr.success('You selected seat number ', _selectedSeat);
		for (let i = 0; this.utilityService.array.length > i ; i++) {
		 document.getElementById('itemDiv' + this.utilityService.array[i]).removeAttribute('class');
		}
		this.clearSelectedItemIndexes();
		}

	_css_Selected_table_speedBar(value) {
		/*     console.log(value); */
			let styles;
			if (value === this.utilityService.globalInstance.SelectedTableName) {
			  styles = {
				'background-color' : 'midnightblue',
				'color' : 'white'
			  };
			} else {
			  styles = {
				'color' : 'gray'
			  };
			}
			return styles;
		  }

	selectedTable(seatCount): void {
	    if (this.utilityService.isChangeTable) {
	      if (this.utilityService.globalInstance.SelectedSaleId != '00000000-0000-0000-0000-000000000000') {
	        this.toastr.error('Table is not available',"Error", {timeOut: 2000});
	      } else {
	        const largest = Math.max.apply(Math, this.utilityService.globalInstance.SelectedTableDetail.TakenSeats);
	        if (largest > seatCount) {
	           this.toastr.error('Cannot Change Table with less seat',"Error", {timeOut: 2000});
	           this.utilityService.isChangeTable = false;
	        } else {
	          this.updateTable(this.utilityService.prevTableId,this.utilityService.globalInstance.SelectedLayoutTableId, this.utilityService.globalInstance.SelectedSaleId);
	        }
	      }
	    } else {
		   this.loadSelectedTable();
	       this.pullcustomerList();
	    }
	  }

  private loadSelectedTable() {
	console.clear();
	this.utilityService.iterateSeat= [];
	let message: string;
	let statuscode: number;
    this.utilityService.globalInstance.SelectedTableDetail = null;
    const _apiRoute = this.utilityService.getApiRoute('GetSelectedTableURL');
	// tslint:disable-next-line: max-line-length
    this.service.selectedTable(this.utilityService.localBaseAddress + _apiRoute, this.utilityService.globalInstance.SelectedLayoutTableId, this.utilityService.globalInstance.CurrentUser.EmpID)
    .subscribe(data => {
		this.utilityService.globalInstance.SelectedTableDetail = JSON.parse(data['result']);
		message = data['message'];
		statuscode = data['status-code'];
		console.log('BELOW THIS LOG')
		console.log(this.utilityService.globalInstance.SelectedTableDetail);
    }, error => {
     this.toastr.error(error,"Load Table Error", {timeOut: 2000});
    }, () => {
		if(statuscode == 202){
			this.toastr.warning('Selected table transaction from FPOS. Cannot assign seat in this table.','Warning', {timeOut : 5000});
		} else if(statuscode == 200) {
			this.iterateSeatFunction(this.utilityService.globalInstance.SelectedTableDetail.SeatCount);
			this.utilityService.globalInstance.SelectedSaleId = this.utilityService.globalInstance.SelectedSaleId;
			this.utilityService.globalInstance.SelectedTableName = this.utilityService.globalInstance.SelectedTableDetail.TableName;
			this.utilityService.globalInstance.SelectedLayoutTableId = this.utilityService.globalInstance.SelectedLayoutTableId;
			this.utilityService.selectedtable = this.utilityService.globalInstance.SelectedTableDetail.TableName;
			this.utilityService.seatCount = this.utilityService.globalInstance.SelectedTableDetail.SeatCount;
			this.utilityService.selectedSaleID = this.utilityService.globalInstance.SelectedSaleId
			this.utilityService.globalInstance.SelectedCheckNumber = this.utilityService.globalInstance.SelectedTableDetail.Checknumber;
		
			// tslint:disable-next-line: max-line-length
			this.utilityService.selectedtableShape = this.getTableShape(this.utilityService.chosenTableShape, this.utilityService.globalInstance.SelectedSaleId,true,null);
			this.utilityService.screen = 'selectedTable';
			this.utilityService._empName = this.utilityService.globalInstance.SelectedTableDetail.EmpName;
			this.loadMealPlanCustomerDetail(this.utilityService.globalInstance.SelectedSaleId);
		/*     this.renderSeats(this.globalInstance.SelectedTableDetail.SeatCount); */
			if (this.utilityService.globalInstance.SelectedSaleId != '00000000-0000-0000-0000-000000000000') {
			  const _check = this.utilityService.globalInstance.SelectedSaleId.toString();
			  localStorage.setItem('tableSelectedCheckNumber', _check);
			}
			if(this.redirect) this._router.navigate(['selectedtable']);
		}
    });
  }

  loadMealPlanCustomerDetail(saleid) {
      this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = null;
      const _apiRoute = this.utilityService.getApiRoute('GetCustomerMealPlanDetailURL');
      this.service.getMealPlanCustomerDetail(this.utilityService.localBaseAddress + _apiRoute, saleid, this.utilityService.globalInstance.CurrentUser.EmpID)
      .subscribe(data => {
        this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = JSON.parse(data['result']);
      }, error => {
      /*   return alert(error); */
      }, () => {
        if (this.utilityService.globalInstance.SelectedSaleId != '00000000-0000-0000-0000-000000000000') {
          this.utilityService.grandtotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].GrandTotal;
          this.utilityService.totalTax = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].TaxTotal;
          this.utilityService.subTotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SubTotal;
		  console.log(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SeatNumber);
		  this.utilityService.discounttotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].DiscountTotal;
        }
      });
  }

  private iterateSeatFunction(seatCount) {
    let i = 1;
    while (i <= seatCount) {
      this.utilityService.iterateSeat.push(i);
      i++;
    }
  }

	updateTable(PrevTableId , NewTableId , saleid ) {
	  try {
	    const _apiRoute = this.utilityService.getApiRoute('ChangeTableURL');
	    // tslint:disable-next-line: max-line-length
	    this.service.changeTable(this.utilityService.localBaseAddress + _apiRoute, this.utilityService.preSelectedRoom, PrevTableId, NewTableId, saleid)
	    .subscribe(data => {
	      this.utilityService.layoutTable = JSON.parse(data['result']);
	    }, error => {
	   /*    alert(error); */
	    }, () => {
	      this.utilityService.isChangeTable = false;
	      this.toastr.success('Table successfully changed',"Success", {timeOut: 2000});
	      if(this.redirect) this._router.navigate(['selectedtable']);
	    });
	  } catch (err) {
	/*     alert('changeTable ' + err.message); */
	  }
	}

	pullcustomerList() {
	  const _apiRoute = this.utilityService.getApiRoute('GetCustomerList');
	  this.service.getCustomerList(this.utilityService.localBaseAddress + _apiRoute)
	    .subscribe(data => {
			console.log(JSON.parse(data['result']));
	      this.utilityService.customerList = JSON.parse(data['result']);
	    }, error => {
		  /* return alert(error); */
		  this.toastr.error(error,'Customer pull error');
	    }, () => {
	/*       console.log( this.customerList); */
	    });
	}

	logOut( ) {
		this.utilityService.iterateSeat = [];
		this.utilityService.convertedpin = null;
		this.utilityService.employeeID = '';
		this.utilityService.newPIN = '';
		this.utilityService.confirmPIN = '';
		this.utilityService.convertedNewPIN = '';
		this.utilityService.convertedConfirmPIN = '';
		this.utilityService.pin = '';
	/* 	localStorage.clear(); */
	/* 	this.checkStatus(); */
		this._router.navigate(['login']);

		//console.clear();
/* 
		this._router.navigate(['login']); */
		// no function yet , just a switch to sign on screen
		this.utilityService.loadingType = 'loggingOut';
		this.showLoadingDialog();
		const _apiRoute = this.utilityService.getApiRoute('LogOut');
		const EmpID = this.utilityService.globalInstance.CurrentUser.EmpID;
		const _logOut :LogOut = { EmpID } as LogOut;
		this.service.logOut(_logOut,this.utilityService.localBaseAddress + _apiRoute)
		.subscribe(data => {

		}, error =>{
		  this.toastr.error(error);
		}, ()=>{
			
		 /*  this._router.navigate(['login']); */
		});
		this.dialogLoadingRef.close();
	}

	GotoTableManagement() {
		this.utilityService.screen = 'rso-main';
		this.service.getroomlist(this.utilityService.localBaseAddress + 'api/v1/LayoutRoom/layoutroom')
		.subscribe(room => {
			this.utilityService.roomList = JSON.parse(room['result']);
		}, error => {
		}, () => {
			if (this.utilityService.preSelectedRoom == 0) {
				this.utilityService.preSelectedRoom = this.utilityService.roomList[0].RoomIndex;
				this.utilityService.selectedroom = this.utilityService.roomList[0].RoomName;
			}
			// tslint:disable-next-line: max-line-length
			this.service.selectedRoom(this.utilityService.localBaseAddress  + 'api/v1/layouttable/SelectedRoom/', this.utilityService.preSelectedRoom + '/' + this.utilityService.globalInstance.CurrentUser.EmpID)
			.subscribe(room => {
				this.utilityService.layoutTable = JSON.parse(room['result']);
			}, error => {
				this.utilityService.toast.error(error);
			});
		});
	}

	_css_Selected_room(value) {
		let styles;
		if (value === this.utilityService.selectedroom) {
		  styles = {
		    'background-color' : '#007bff',
		    'white-space' : 'normal',
		    'word-wrap' : 'break-word',
		    'color' : '#fff',
		    'background' : 'linear-gradient(to right,#000066,#1d3bb2)',
		    'border-width': '3px',
		    'margin-top' : '10px',
		    'text-transform' : 'uppercase'
		  };
		} else {
		  styles = {
		    'background-color' : '#80aedf',
		    'white-space' : 'normal',
		    'word-wrap' : 'break-word',
		    'color' : '#fff',
		    'background' : 'linear-gradient(135deg,#1E86FF,#8a968b)',
		    'margin-top' : '10px',
		    'text-transform' : 'uppercase'
		  };
		}
		return styles;
	}

	/* GotoTableManagement1() {
		//console.clear();
		this.utilityService.screen = 'rso-main';
		const _apiRoute = this.utilityService.getApiRoute('GetRoomListURL');
		this.service.getroomlist(this.utilityService.localBaseAddress  + _apiRoute + this.utilityService.isOnline)
		.subscribe(room => {
			this.utilityService.roomList = JSON.parse(room['result']);
			console.log(this.utilityService.roomList);
		}, error => {
			this.toastr.error(error,"Error", {timeOut: 2000});
			console.log(error);
		}, () => {
			if (this.utilityService.preSelectedRoom == null) {
				this.utilityService.preSelectedRoom = this.utilityService.roomList[0].RoomId;
				this.utilityService.selectedroom = this.utilityService.roomList[0].RoomName;
			}
			this.getroomName(this.utilityService.selectedroom, this.utilityService.preSelectedRoom, this.utilityService.globalInstance.CurrentUser.EmpID);
		});
	}
 */
	private  gotoSignOnScreen() {
		this.utilityService.screen = 'signOn';
	}

	getroomName(roomName, roomIndex, empid) {
	/* 	this.checkStatus(); */
		switch (roomName) {
			case 'GO BACK TO POS':
				this.gotoSignOnScreen();
				break;
			default:
				//console.clear();
				this.utilityService.preSelectedRoom = roomIndex;
				this.utilityService.selectedroom = roomName;
				/* this.utilityService.selectedRoomId = roomId; */
				const _apiRoute = this.utilityService.getApiRoute('GetSelectedRoomURL');
				this.service.selectedRoom(this.utilityService.localBaseAddress + _apiRoute, this.utilityService.preSelectedRoom + '/' + empid)
				.subscribe(room => {
					this.utilityService.layoutTable = JSON.parse(room['result']);
					console.log(this.utilityService.layoutTable);
				}, error => {
					this.toastr.error(error,"Error", {timeOut: 2000});
				}, () => {
					if(this.utilityService.layoutTable != null) {
						this.utilityService.globalInstance.SelectedTableName =  this.utilityService.layoutTable[0].TableName;
					}
				});
			break;
		}
	}

	getStyles(x, y, shape, saleid,CheckCreatedByCurrentUser,fromSi360) {
	    this.getTableShape(shape, saleid,CheckCreatedByCurrentUser,fromSi360);
	    const styles = {
	    'position': 'absolute',
	    'top' : y + 'px',
	    'left' : x + 'px',
	    };
	  return styles;
	}

	private getTableShape(shape, saleid,CheckCreatedByCurrentUser,fromSi360) {
    if (saleid == '00000000-0000-0000-0000-000000000000') {
      switch (shape) {
        case 0:
        this.utilityService.tableShapeUrl = 'assets/img/circle.png';
          break;
        case 1:
        this.utilityService.tableShapeUrl = 'assets/img/circle.png';
          break;
        case 2:case 3:
        this.utilityService.tableShapeUrl = 'assets/img/diamond.png';
        break;
        case 5:
        this.utilityService.tableShapeUrl = 'assets/img/rectangle2.png';
          break;
        case 6: case 7:
        this.utilityService.tableShapeUrl = 'assets/img/rectangle.png';
          break;
      /*   case 7:
        this.utilityService.tableShapeUrl = 'assets/img/rectangle.png'; */
        case 8: case 4:
        this.utilityService.tableShapeUrl = 'assets/img/square.png';
          break;
        default:
        this.utilityService.tableShapeUrl = 'assets/img/circle.png';
         break;
      }
    } else {
		if(this.utilityService.globalInstance.CurrentUser.SecurityLevel >= 10) {
			switch (shape) {
				case 0:
				this.utilityService.tableShapeUrl = 'assets/img/circleGreen.png';
				  break;
				case 1:
				this.utilityService.tableShapeUrl = 'assets/img/circleGreen.png';
				  break;
				case 2:case 3:
				this.utilityService.tableShapeUrl = 'assets/img/diamond-green.png';
				break;
				case 5:
				this.utilityService.tableShapeUrl = 'assets/img/rectangle-green2.png';
				  break;
				case 6: case 7:
				this.utilityService.tableShapeUrl = 'assets/img/rectangle-green.png';
				  break;
			  /*   case 7:
				this.utilityService.tableShapeUrl = 'assets/img/rectangle-green.png';
				break; */
				case 8: case 4:
				this.utilityService.tableShapeUrl = 'assets/img/square-green.png';
				  break;
				default:
				this.utilityService.tableShapeUrl = 'assets/img/circleGreen.png';
				 break;
			  }
		} else {
			if(CheckCreatedByCurrentUser == false) {
				switch (shape) {
					case 0:
					this.utilityService.tableShapeUrl = 'assets/img/NotCreatedByCurrentUser/other-circle.png';
					  break;
					case 1:
					this.utilityService.tableShapeUrl = 'assets/img/NotCreatedByCurrentUser/other-circle.png';
					  break;
					case 2:case 3:
					this.utilityService.tableShapeUrl = 'assets/img/NotCreatedByCurrentUser/other-diamond.png';
					break;
					case 5:
					this.utilityService.tableShapeUrl = 'assets/img/rectangle-green2.png';
					  break;
					case 6: case 7:
					this.utilityService.tableShapeUrl = 'assets/img/NotCreatedByCurrentUser/other-rectangle.png';
					  break;
				  /*   case 7:
					this.utilityService.tableShapeUrl = 'assets/img/rectangle-green.png';
					break; */
					case 8: case 4:
					this.utilityService.tableShapeUrl = 'assets/img/NotCreatedByCurrentUser/other-square.png';
					  break;
					default:
					this.utilityService.tableShapeUrl = 'assets/img/NotCreatedByCurrentUser/other-circle.png';
					 break;
				  }
	
			} else {
				if(CheckCreatedByCurrentUser == true && fromSi360 == false) {
					switch (shape) {
						case 0:
						this.utilityService.tableShapeUrl = 'assets/img/NotCreatedByCurrentUser/other-circle.png';
						  break;
						case 1:
						this.utilityService.tableShapeUrl = 'assets/img/NotCreatedByCurrentUser/other-circle.png';
						  break;
						case 2:case 3:
						this.utilityService.tableShapeUrl = 'assets/img/NotCreatedByCurrentUser/other-diamond.png';
						break;
						case 5:
						this.utilityService.tableShapeUrl = 'assets/img/rectangle-green2.png';
						  break;
						case 6: case 7:
						this.utilityService.tableShapeUrl = 'assets/img/NotCreatedByCurrentUser/other-rectangle.png';
						  break;
					  /*   case 7:
						this.utilityService.tableShapeUrl = 'assets/img/rectangle-green.png';
						break; */
						case 8: case 4:
						this.utilityService.tableShapeUrl = 'assets/img/NotCreatedByCurrentUser/other-square.png';
						  break;
						default:
						this.utilityService.tableShapeUrl = 'assets/img/NotCreatedByCurrentUser/other-circle.png';
						 break;
					  }
				} else {
					switch (shape) {
						case 0:
						this.utilityService.tableShapeUrl = 'assets/img/circleGreen.png';
						  break;
						case 1:
						this.utilityService.tableShapeUrl = 'assets/img/circleGreen.png';
						  break;
						case 2:case 3:
						this.utilityService.tableShapeUrl = 'assets/img/diamond-green.png';
						break;
						case 5:
						this.utilityService.tableShapeUrl = 'assets/img/rectangle-green2.png';
						  break;
						case 6: case 7:
						this.utilityService.tableShapeUrl = 'assets/img/rectangle-green.png';
						  break;
					  /*   case 7:
						this.utilityService.tableShapeUrl = 'assets/img/rectangle-green.png';
						break; */
						case 8: case 4:
						this.utilityService.tableShapeUrl = 'assets/img/square-green.png';
						  break;
						default:
						this.utilityService.tableShapeUrl = 'assets/img/circleGreen.png';
						 break;
					  }
				}			
			}   
		}
		
    }
    this.utilityService.shape = shape;
     return shape = this.utilityService.tableShapeUrl;
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
