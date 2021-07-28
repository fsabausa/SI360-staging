import { HttpClient } from '@angular/common/http';
import { Component, OnInit,ViewChild} from '@angular/core';
import { FormControl, FormBuilder, FormGroup, FormArray} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ICustomer } from '../../shared/customer';
import { ClockinComponent } from '../clockin/clockin.component';
import { ComingsoonComponent } from '../comingsoon/comingsoon.component';
import { CreditcardComponent } from '../creditcard/creditcard.component';
import { DiaglogChangeTableComponent } from '../diaglog-change-table/diaglog-change-table.component';
import { CheckUpdateDialogComponent } from '../check-update-dialog/check-update-dialog.component';
import { PaymentSuccessfulComponent } from '../payment-successful/payment-successful.component';
import { PinpadComponent } from '../pinpad/pinpad.component';
import { SiposService } from '../../shared/sipos.service';
import { Router} from '@angular/router';
import { UtilityService } from '../../services/utility.service';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { LoadingmodalComponent } from '../loadingmodal/loadingmodal.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

 
import {
  ChangePIN,
  AppSetting,
  LogOut,
  globalInstance
} from '../../obj-interface';

import { ModalDirective } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  myControl = new FormControl();
  filteredOptions: Observable<ICustomer[]>;
  animationState: string;
  setStatus = '';
  animateHandler = 'hideanim-msg';
  dialogLoadingRef;
  itemRows = {};
  UpdateMessage = '';
  interval;
  firstLoad : string | undefined;
  isProccessing: boolean = false;
  pdfSource = "/assets/data/revision-notes.pdf";
  @ViewChild('diaglogReleaseNotes', { static: false }) diaglogReleaseNotes: ModalDirective;
  constructor(
    private _router: Router,
    private service: SiposService,
    public utilityService: UtilityService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    public dialogUploadPhoto: MatDialog,
    public dialogChangeTable: MatDialog,
    private http: HttpClient,
    private formBuilder: FormBuilder ) {
      this.form = this.formBuilder.group({
    /*     globalInstance.SelectedTableDetail.GetSaleItems: new FormArray([]) */
     });
  }

  ngOnInit() {
     this.setTime();
     this.initiateAppSetting();
     this.setApiRoute();
     this.getVersion();
     this.checkUpdates();
     console.clear();
  }


  isServerIsOnline(){
    if(this.utilityService.isServerOnline){
      return 'ONLINE';
    } else {
      return 'OFFLINE';
    }
  }



  getVersion() {
    if (typeof require === 'function') {
      let $ = require("jquery")
      const electron = (<any>window).require('electron');
      electron.ipcRenderer.send('app_version');
      electron.ipcRenderer.on('app_version', (event, arg) => {
      electron.ipcRenderer.removeAllListeners('app_version');
      this.utilityService.appVersion = 'Version ' + arg.version;
    });
    }
  }

  async f() {
    let promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve(this.isServerIsOnline()), 1000)
    });

    let result = await promise; // wait until the promise resolves (*)

    alert(result); // "done!"
  }

  showConnectionMessage(message){
    this.utilityService.confirmMessage = message;
    this.utilityService.okButtonOnly = true;
    const dialogRef = this.dialog.open(ConfirmationComponent, {panelClass: 'remove-special'});
    dialogRef.afterClosed().subscribe(
      data => {
        // do something
      }
    );
  }

  showDiaglogReleaseNotes(){
    this.diaglogReleaseNotes.show();
  }
  hideDiaglogReleaseNotes() {
    this.diaglogReleaseNotes.hide();
  }

  refreshStoredTransactions(){
    let message:any;
    let status:any; 
    const _apiRoute = this.utilityService.getApiRoute('StoredTransaction');
    this.service.getStoredTransactions(this.utilityService.localBaseAddress + _apiRoute)
    .subscribe(data => {
      this.utilityService.storedTransactions = JSON.parse(data["result"]);
      message = data["message"];
      status = data["status-code"]
    },error=>{
     
    },()=>{
      if(status == 200) {
  
      }
    })
   }


  setStatusFunction() {
    let hasInternetConnection = window.navigator.onLine;
    if(this.isProccessing == false) {
      if(this.utilityService.serverBaseAddress!=null){
        this.isProccessing = true;
        const _apiRoute = this.utilityService.getApiRoute('GetStatus');
        this.service.getStatus(this.utilityService.serverBaseAddress + _apiRoute)
         .subscribe(data => {
           this.utilityService.isServerOnline = JSON.parse(data['IsOnline']);
         }, error => {
           this.utilityService.isServerOnline = false;
           if(hasInternetConnection == false) {
             if(this.utilityService.isServerOnline == false) {
              this.utilityService.setStatus = 'offline-server';
              this.utilityService.isServerOnline = false;
              this.utilityService.baseAddress = this.utilityService.localBaseAddress;
              this.utilityService.showSYNCSALE == false;
              this.utilityService.readyForUse = true;
             } else {
              this.utilityService.setStatus = 'noInternet';
              this.utilityService.baseAddress = this.utilityService.serverBaseAddress;
              this.utilityService.isServerOnline = true;
              this.utilityService.readyForUse = true;
             }         
           } else {
            this.utilityService.setStatus = 'offline-server';
            this.utilityService.isServerOnline = false;
            this.utilityService.baseAddress = this.utilityService.localBaseAddress;
            this.utilityService.showSYNCSALE == false;
            this.utilityService.readyForUse = true;
           }
 /*          console.clear(); */
         }, ()=> {
           if(this.utilityService.isServerOnline == true && hasInternetConnection == true) {
             this.utilityService.setStatus = 'online-server';
             this.utilityService.baseAddress = this.utilityService.serverBaseAddress;
             this.utilityService.isServerOnline = true;
             this.utilityService.readyForUse = true;
           }else if (hasInternetConnection == false && this.utilityService.isServerOnline == true) {
            this.utilityService.setStatus = 'noInternet';
            this.utilityService.baseAddress = this.utilityService.serverBaseAddress;
            this.utilityService.isServerOnline = true;
            this.utilityService.readyForUse = true;
           } else {
             this.utilityService.setStatus = 'offline-server';
             this.utilityService.isServerOnline = false;
             this.utilityService.baseAddress = this.utilityService.localBaseAddress;
           }
         })
      } else {
        if(hasInternetConnection == false) {
          this.utilityService.setStatus = 'noInternet';
          this.utilityService.isServerOnline = false;
          this.utilityService.baseAddress = this.utilityService.localBaseAddress;
          this.utilityService.readyForUse = false;
        } else {
          this.utilityService.setStatus = 'offline-server';
          this.utilityService.isServerOnline = false;
          this.utilityService.baseAddress = this.utilityService.localBaseAddress;
          this.utilityService.readyForUse = false;
        }
      }
      this.isProccessing = false;
      this.utilityService.hasInternetConnection = hasInternetConnection;
      //this.refreshStoredTransactions();
    }


    this.checkTotalSentToKitchen();

    if(this.utilityService.remindIn2Hrs == true && this.utilityService.countDown <= 9) {
      let count = this.utilityService.countDown += 1;
      console.log(count);
      if(count == 10) {
        console.log('Updates pops up');
        this.utilityService.remindIn2Hrs = false;
        this.openCheckupdateDialog();    
      }
    }
  }

  checkTotalSentToKitchen(){
    let totalSent = 0;
    const _apiRoute = this.utilityService.getApiRoute('GetTotalSentToKitchen');
    this.service.getStoreID(this.utilityService.localBaseAddress + _apiRoute)
     .subscribe(data => {
       totalSent = JSON.parse(data['Message']);
     }, error => {

     }, ()=> {
       if(this.utilityService.totalSentToKitchen != totalSent){
        this.utilityService.totalSentToKitchen = totalSent;
        if (typeof this.utilityService.globalInstance.SelectedSaleId === "undefined") {
         alert(this.utilityService.globalInstance.SelectedSaleId);
        } else {
          if(this.utilityService.globalInstance.SelectedSaleId != '00000000-0000-0000-0000-000000000000') {
            this.loadMealPlanCustomerDetail(this.utilityService.globalInstance.SelectedSaleId);
          }
        }
       }
     });
  }

  private setTime() {
    setInterval(() => {
      this.utilityService.now = Date.now();
    }, 1);
  }

  startAnimation(state) {
    console.log(state);
    if (!this.utilityService.animationState) {
      this.utilityService.animationState = state;
    }
  }

  initiateAppSetting() {
    this.service.getAppSettings().subscribe(data => {
      this.utilityService.appSetting = data as AppSetting[];
      console.log(this.utilityService.appSetting[0]);
    }, error => {
      this.toastr.error(error, 'Error', {timeOut: 2000});
    }, () => {
      this.utilityService.defaultMenu = '';
      this.utilityService.defaultMenuButtonID = '';
      this.utilityService.localBaseAddress = this.utilityService.appSetting[0].LocalBaseAddress['BaseAddress'];
      this.preLoadData();
      setInterval(async () => {
        this.setStatusFunction();
        }, 1000);
    });
    /* this.openCheckupdateDialog(); */
  }

  private checkUpdates(){
    if (typeof require === 'function') {
      let $ = require("jquery")
      const electron = (<any>window).require('electron');
      console.log('checkUpdates');
    electron.ipcRenderer.on('update_available', () => {
      electron.ipcRenderer.removeAllListeners('update_available');
      console.log('update_available');
      this.utilityService.UpdateNotificationMsg = 'A new update is available. Downloading now...';
    });

    electron.ipcRenderer.on('message', (event, text) => {
      this.utilityService.UpdateMsg = text;
    });

    electron.ipcRenderer.on('ProgressBar', (event, progressBarValue) => {
      this.utilityService.progressBarValue = progressBarValue;
    });

    electron.ipcRenderer.on('update_downloaded', () => {
      electron.ipcRenderer.removeAllListeners('update_downloaded');
      this.openCheckupdateDialog();

    });
    }
  }


  openCheckupdateDialog() {
    const dialogRef = this.dialog.open(CheckUpdateDialogComponent,{
      disableClose: true
    });
  }

  public getUpdatedItem() {
    /*   console.log("SYNC is starting.. login!"); */
    //alert('start syncItem()');
      let isSuccess: any;
      let statusCode: any;
      let message: any;
      this.utilityService.syncProccessing = true;

      const _apiRoute = this.utilityService.getApiRoute('GetLatestItem');
      this.service.getUpdatedItem(this.utilityService.localBaseAddress + _apiRoute).subscribe(data => {
      /* this.utilityService.loadingType = 'uploading'; */
        console.log("-= GetLatestItem Response =-");
        console.log(data);
        this.utilityService.itemList = data['ItemQty'];
        statusCode = data['StatusCode'];
        /*message = data['Message'];*/
      }, error => {
        this.toastr.error(error,"Error", {timeOut: 10000});
        console.log(error);
       /*  this.dialogLoadingRef.close(); */
      }, () => {
        console.log("-= itemList =-");
        console.log(this.utilityService.itemList);

        if(Object.keys(this.utilityService.subButton).length > 0){
          for (var x = 0; x < Object.keys(this.utilityService.subButton).length; x++){
            var subBtn = this.utilityService.subButton[x].Buttons;
            for(var y = 0; y < Object.keys(subBtn).length; y++){
              if(this.utilityService.itemList != null){
                for(var z = 0; z<Object.keys(this.utilityService.itemList).length; z++){
                  if(this.utilityService.subButton[x].Buttons[y].SubButtonID == this.utilityService.itemList[z].ItemID){
                    this.utilityService.subButton[x].Buttons[y].ItemCount = this.utilityService.itemList[z].ItemCount;
                  }
                }
              }
            }
          }
        }

        this.utilityService.syncProccessing = false;
      });
    }

  preLoadData(){
    this.service.preloadData(this.utilityService.localBaseAddress + 'api/v1/preloadData/fetchData')
    .subscribe(data =>
      this.utilityService.preloadData = JSON.parse(data['result'])
    , error => {
        this.toastr.error(error,'Error');
        console.log(error);
    }, () => {
      this.utilityService.storeId = this.utilityService.preloadData.StoreID;
/*       this.utilityService.appVersion = this.utilityService.preloadData.AppVersion;  */
      this.utilityService.serverBaseAddress = this.utilityService.preloadData.MasterAPI;
      this.utilityService._navigationEntries = this.utilityService.preloadData.NavigationButtons;
      this.utilityService.mealTypes = this.utilityService.preloadData.MealTypeList;
      this.utilityService.roomList = this.utilityService.preloadData.Rooms;
      this.utilityService._buttons = this.utilityService.preloadData.Buttons;

      this.utilityService.defaultMenu = this.utilityService._buttons[0].ButtonText ;
      this.utilityService.defaultMenuButtonID = this.utilityService._buttons[0].ButtonID;
      this.utilityService._menuName = this.utilityService.defaultMenu;
      this.utilityService.voidReasonList = this.utilityService.preloadData.Reasons;
     
      this.utilityService.serviceTypeDesc = this.utilityService.preloadData.ServiceTypeDesc;
      /* this.utilityService.customerList = this.utilityService.preloadData.CustomerList; */
      this.utilityService.screen = 'signOn';
     /*  console.log(this.utilityService.customerList); */
    });
  }


  getState(outlet) {
    return outlet.activatedRouteData.state;
  }

  resetAnimationState() {
    this.utilityService.animationState = '';
  }

  startScreen() {
    if (localStorage.getItem('args') === 'restaurant') {
      this.utilityService.screen = 'payAtTableGuestCheckSearch';
    } else {
      this.utilityService.screen = 'signOn';
    }
  this.GetSignOnSettings();
  }

/*  getStoreID(localBaseAddress) {
    this.service.getStoreID(localBaseAddress + 'api/v1/store/getStoreID')
    .subscribe(data =>
      this.utilityService.appDetail = JSON.parse(data['result'])
    , error => {
        this.toastr.error(error,'Error');
    }, () => {
      this.utilityService.appVersion = this.utilityService.appDetail.AppVersion;
      this.utilityService.serverBaseAddress = this.utilityService.appDetail.MasterAPI;
      this.utilityService.screen = 'signOn';
      this.getNavigationButtons();
    });
 } */

  submit() {
    const selectedOrderIds = this.form.value.globalInstance.SelectedTableDetail.GetSaleItems
    .map((v, i, x) => v ? this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[i].MenuItemList[x].SaleItemId : null)
    .filter(v => v !== null);
    console.log(selectedOrderIds);
  }

  selectItem(value, WasPrinted, itemId) {
    console.log(itemId);
      if (WasPrinted === 0) {
          if (!this.utilityService.array.some(x => x === value)) {
            document.getElementById('itemDiv' + value).className = 'highLightItem';
            this.utilityService.array.push(value);
            console.log(this.utilityService.array);
            localStorage.setItem('SelectedItemIndex', this.utilityService.array.toString());
          } else {
            document.getElementById('itemDiv' + value).removeAttribute('class');
            const index = this.utilityService.array.indexOf(value);
            if (index !== -1) {
            this.utilityService.array.splice(index, 1);
            localStorage.setItem('SelectedItemIndex', this.utilityService.array.toString());
            }
          }
      }
  }

 async changePIN() {
    if (this.utilityService.employeeID === '') {
      this.toastr.error('Please input EmployeeID',"Error", {timeOut: 2000});
    } else if (this.utilityService.newPIN === '') {
      this.toastr.error('Please input pin',"Error", {timeOut: 2000});
    } else if (this.utilityService.confirmPIN === '') {
      this.toastr.error('Please input old pin',"Error", {timeOut: 2000});
    } else {
      const EmpID = Number(this.utilityService.employeeID);
      const NewPIN = Number(this.utilityService.newPIN);
      const ConfirmPIN = Number(this.utilityService.confirmPIN);
      const StoreNumber = this.utilityService.storeId;
      if (NewPIN === ConfirmPIN) {
        const _apiRoute = this.utilityService.getApiRoute('UpdatePin');
        let message: any;
        let response: any;
        const _changePIN: ChangePIN = { StoreNumber, NewPIN, EmpID} as ChangePIN;
        this.service.updatePIN(_changePIN, this.utilityService.localBaseAddress + _apiRoute)
        .subscribe(data => {
          response = data;
          message = response.message;
        }, error => {
          this.toastr.error(error,"Error", {timeOut: 2000});
        }, () => {
          if (response.result === 'false') {
            this.toastr.error(message,"Error", {timeOut: 2000});
            this.utilityService.newPIN = '';
            this.utilityService.confirmPIN = '';
            this.utilityService.convertedNewPIN = '';
            this.utilityService.convertedConfirmPIN = '';
          } else if (response.result === 'true') {
            this.utilityService.employeeID = '';
            this.utilityService.newPIN = '';
            this.utilityService.confirmPIN = '';
            this.utilityService.convertedNewPIN = '';
            this.utilityService.convertedConfirmPIN = '';
            this.toastr.success('Change PIN SUCCESS',"Success", {timeOut: 2000});
            document.onkeydown = function (e) {
             return true;
            };
            this.logOut();
          } else {
          /*   this.toastr.warning('ELSE'); */
          }
        });
      } else {
        this.toastr.error('New PIN did not match on the confirm PIN',"Error", {timeOut: 2000});
      }
    }
  }


  generateSiposAccessToken() {
    /* this.utilityService.globalInstance.SelectedTableName = ''; */
    const _apiRoute = this.utilityService.getApiRoute('GetSiposAccessToken');
    console.log("url: "+this.utilityService.localBaseAddress + _apiRoute);
    this.service.getSiposAccess(this.utilityService.localBaseAddress + _apiRoute + this.utilityService.storeId)
    .subscribe(data => {
      console.log(data);
      const varAccess = JSON.parse(JSON.parse(data['result']));
      this.service.updateAuthorization(varAccess['bearer']);
    }, error => {
      console.log(error);
      this.toastr.error(error,"Error", {timeOut: 3000});
    }, () => {
      console.log("end points");
      console.log(this.utilityService.api_endpoint);
      this.Authenticate();
     /*  this.getNavigationButtons(); */
    });
  }

  getNavigationButtons() {
    this.service.getNavigation(this.utilityService.localBaseAddress + 'api/v1/buttons/navButtons')
    .subscribe(data => {
      this.utilityService._navigationEntries = JSON.parse(data['result']);
    }, error => {
      this.toastr.error(error,"Error", {timeOut: 2000});
      console.log("ERROR Navigation Buttons");
      console.log(error);
    }, () => {
      console.log("Show Navigation Buttons");
      console.log(this.utilityService._navigationEntries);
    });
  }

  GetSignOnSettings(){
    let statusCode: any;
    const _apiRoute = this.utilityService.getApiRoute('GetSignOnSetting');
    this.service.getSignOnSettings(this.utilityService.baseAddress + 'api/v1/status/getSignOnSetting')
    .subscribe(data => {
    this.utilityService.EnableEmployeeNumber= JSON.parse(data['result']);
    statusCode = data['status-code'];
    alert(statusCode);
    }, error => {
      this.toastr.error(error);
    }, ()=>{
      if(statusCode == 200) {
        if(this.utilityService.EnableEmployeeNumber) {
          this.utilityService.textBoxPlaceholderSignOn = 'Enter Employee Number';
        } else {
          this.utilityService.textBoxPlaceholderSignOn = 'Enter Employee PIN';
        }
      }
      alert(this.utilityService.textBoxPlaceholderSignOn);
    });
  }


  async Authenticate() {
      if(this.utilityService.pin.length == 0) {
        this.toastr.error('Employee PIN/EmpId is required','Error',{timeOut:5000})
      } else {
        const EmployeePINLocal = Number(this.utilityService.pin);
        const _apiRouteLocal = this.utilityService.getApiRoute('SignOn');
        let statusCodeLocal = 0;
        this.service.signOnCustomer2(this.utilityService.localBaseAddress + _apiRouteLocal + '/' + EmployeePINLocal)
        .subscribe(data => {
          console.log('Tssss');
          console.log(JSON.parse(data['result']));
          this.utilityService.globalInstance = JSON.parse(data['result']);
          statusCodeLocal = JSON.parse(data['status-code']);
        }, error => {
          this.toastr.error('Invalid Input',"Error", {timeOut: 3000});
          this.utilityService.convertedpin = '';
          this.utilityService.pin = '';
        }, ()=> {
          if (statusCodeLocal === 200) {
            document.onkeydown = function (e) {
              return true;
            };
            this.utilityService.array = [];
            this.utilityService.currentUserSecurityLevel = this.utilityService.globalInstance.CurrentUser.SecurityLevel;
        /*     if(this.utilityService.isServerOnline) {
              this.uploadFposSale();
            } */
            this.clearSelectedItemIndexes();
            if(this.utilityService.serviceTypeDesc == 'Quick Service') {
              this._router.navigate(['ordering']);
            } else {
              this.GotoTableManagement1();
              this._router.navigate(['roomselection']);
            }

          } else {
            this.toastr.error('Invalid Input',"Error", {timeOut: 3000});
            this.utilityService.convertedpin = '';
            this.utilityService.pin = '';
          }
        });
      }
  }

/*   uploadFposSale() {
    const _apiRoute = this.utilityService.getApiRoute('UploadFPOSSale');
    this.service.uploadFposSale(this.utilityService.localBaseAddress + _apiRoute).subscribe(data => {

    }, error => {

    }, () => {
      console.log('Upload FPOS Sale Success');
    });
  } */

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
			const ApiURL = this.utilityService.baseAddress + _apiRoute;

			for (const data of this.utilityService.screenLayoutArr) {
				this.service.saveScreenLayoutDetail(data,ApiURL)
				.subscribe(result=> {
					console.log(result);
				},error=>{
					console.log(error);
					this.toastr.error(error.toString());
				},()=>{
					console.log("success on saving!");
					//ctr++;
				});
			}

		}
	}

  _filter(value: string): ICustomer[] {
    const filterValue = value.toLowerCase();

    return this.utilityService.customerList.filter(option => option.FirstName.toLowerCase().includes(filterValue) ||
      option.LastName.toLowerCase().includes(filterValue) ||
      option.Name.toLocaleLowerCase().includes(filterValue));
  }
  displayFn(user?: ICustomer): string | undefined {
    return user ? user.Name : undefined;
  }
// methods that are getting data from the cloud
pullcustomerList() {
  const _apiRoute = this.utilityService.getApiRoute('GetCustomerList');
  this.service.getCustomerList(this.utilityService.baseAddress + _apiRoute)
    .subscribe(data => {
      this.utilityService.customerList = JSON.parse(data['result']);
    }, error => {
      return alert(error);
    }, () => {
/*       console.log( this.customerList); */
    });
}



showLoadingDialog(){
  this.dialogLoadingRef = this.dialog.open(LoadingmodalComponent, {panelClass: 'remove-special'});
  this.dialogLoadingRef.afterClosed().subscribe(
    data => {

    }
  );
}




getCheckNumber(StoreId) {
  //console.clear();
  const _apiRoute = this.utilityService.getApiRoute('GenerateCheckNumber');
  this.service.getCheckNumberFromMaster(_apiRoute, StoreId)
  .subscribe(data => {
    this.utilityService._checknumber = JSON.parse(data['result']);
    console.log(this.utilityService._checknumber);
  }, error => {
    alert(error);
  }, () => {
    alert('success');
  });
}



  loadMealPlanCustomerDetail(saleid) {
      this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = null;
      const _apiRoute = this.utilityService.getApiRoute('GetCustomerMealPlanDetailURL');
      this.service.getMealPlanCustomerDetail(this.utilityService.localBaseAddress + _apiRoute, saleid, this.utilityService.globalInstance.CurrentUser.EmpID)
      .subscribe(data => {
        this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = JSON.parse(data['result']);
      }, error => {
        return alert(error);
      }, () => {
        if (saleid != '00000000-0000-0000-0000-000000000000') {
          this.utilityService.grandtotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].GrandTotal;
          this.utilityService.totalTax = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].TaxTotal;
          this.utilityService.subTotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SubTotal;
        }
      });
  }


openComingSoon() {
  this.dialog.open(ComingsoonComponent);
}

openNumberPad() {
  const dialogRef = this.dialog.open(PinpadComponent);
      dialogRef.componentInstance.params = {
      disableClose : true,
      getInputedAmount: (data) => {
        this.getInputedAmount(data);
        this.utilityService.inputed_amount = data;
      }
    };
}

openDiaglogPaymentSuccessful() {
  this.dialog.open(PaymentSuccessfulComponent);
}

getInputedAmount(value) {
/*   alert(value); */
}


openCreditCard() {
  this.dialog.open(CreditcardComponent);
}

openDialogForClockin() {
  this.dialog.open(ClockinComponent);
}

openDialogForChangeTable() {
  if (this.utilityService.globalInstance.SelectedTableDetail.Checknumber != null) {
    const dialogRef = this.dialog.open(DiaglogChangeTableComponent);
      dialogRef.componentInstance.params = {
      disableClose : true,
      ChangeTable: (data) => {
        this.getIsChangeTable(data);
      }
    };
  } else {
/*     this.toastr.error("Cannot change table"); */
  }
}
openNumericPad() {

}

  getIsChangeTable(value) {
/*     this.toastr.warning('Change Table function is working in progress'); */
        this.utilityService.isChangeTable = value;
        if (this.utilityService.isChangeTable) {
          this.utilityService.prevTableId = this.utilityService.globalInstance.SelectedLayoutTableId;
          this.gotoSelectedRoom();
        }
  }

  gotoSelectedRoom() {
    const _apiRoute = this.utilityService.getApiRoute('GetSelectedRoomURL');
    // tslint:disable-next-line: max-line-length
    this.service.selectedRoom(this.utilityService.baseAddress + _apiRoute, this.utilityService.preSelectedRoom + '/' + this.utilityService.globalInstance.CurrentUser.EmpID)
    .subscribe(room => {
      this.utilityService.layoutTable = JSON.parse(room['result']);
    }, error => {
      return alert(error);
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
/*       console.clear(); */
      this.utilityService.selectedSeat = null;
      this.utilityService._selectedSeatOrderUI = null;
    });
  }

  GotoTableManagement() {
    this.utilityService.screen = 'rso-main';
    this.service.getroomlist(this.utilityService.baseAddress + 'api/v1/LayoutRoom/layoutroom')
      .subscribe(room => {
        this.utilityService.roomList = JSON.parse(room['result']);
      }, error => {
      }, () => {
       if (this.utilityService.preSelectedRoom == 0) {
         this.utilityService.preSelectedRoom = this.utilityService.roomList[0].RoomIndex;
         this.utilityService.selectedroom = this.utilityService.roomList[0].RoomName;
       }
       // tslint:disable-next-line: max-line-length
       this.service.selectedRoom(this.utilityService.baseAddress  + 'api/v1/layouttable/SelectedRoom/', this.utilityService.preSelectedRoom + '/' + this.utilityService.globalInstance.CurrentUser.EmpID)
       .subscribe(room => {
         this.utilityService.layoutTable = JSON.parse(room['result']);
       }, error => {
         this.utilityService.toast.error(error);
       });
      });
  }

  GotoTableManagement1() {
    if (this.utilityService.preSelectedRoom == 0) {
      this.utilityService.preSelectedRoom = this.utilityService.roomList[0].RoomIndex;
      this.utilityService.selectedroom = this.utilityService.roomList[0].RoomName;
    }
  this.getroomName();
  }

  hideMealAndCustomerDetailDiv() {
    this.utilityService.showButtonReAssignSeatAndRemoveSeat = false;
    this.utilityService.showMealDiv = false;
    this.utilityService.showCustomerDetail = false;
    this.utilityService.showCustomerDetail2 = false;
    this.utilityService.showButtonAssignSeat = false;
    this.utilityService.showCustomerSearchDiv = false;
  }


  MealAndCustomerDetailDiv() {
    this.utilityService.showCustomerDetail2 = true;
    this.utilityService.showButtonReAssignSeatAndRemoveSeat = true;
    this.utilityService.showMealDiv = true;
    this.utilityService.showCustomerDetail = false;
  }



  getbuttonValue(value) {
    this.utilityService.error = '';
  /*   this.checkStatus(); */
    switch (value) {
      case 'DEL' :
        this.utilityService.pin = this.utilityService.pin.substring(0, this.utilityService.pin.length - 1);
        break;
      case 'SIGN ON' :
        this.generateSiposAccessToken();
        break;
      case 'CLOCK IN' :
        this.openDialogForClockin();
        break;
      case 'CLOCK OUT' :
        break;
      case 'SIGN OUT' :
        break;
      case 'CHANGE PIN' :

        this.utilityService.screen = 'changePin';
        var myVar = setInterval(() => {
          var objDiv = document.getElementById("EmpIDTextBox");
          if(objDiv != undefined){
            document.getElementById("EmpIDTextBox").focus();
            this.textInputActive('employeeID','EmpIDTextBox');
            clearInterval(myVar);
          }
        }, 1);

        break;
      case 'SIPOS SETTING':
        this.utilityService.screen = 'siposSetting';
        break;
      default:
        this.utilityService.pin += value;
        break;
    }
    this.utilityService.convertedpin = this.utilityService.pin.replace(/./g, '*');
  }
/**
**Button Click Events
*/

  getChangePinButtonValue(value) {
    switch (value) {
      case 'DEL' :
          if (this.utilityService.inputActive === 'employeeID') {
            this.utilityService.employeeID = this.utilityService.employeeID.substring(0, this.utilityService.employeeID.length - 1);
          } else if (this.utilityService.inputActive === 'newPIN') {
            this.utilityService.newPIN = this.utilityService.newPIN.substring(0, this.utilityService.newPIN.length - 1);
            this.utilityService.convertedNewPIN = this.utilityService.newPIN.replace(/./g, '*');
          } else if (this.utilityService.inputActive === 'confirmPIN') {
            this.utilityService.confirmPIN = this.utilityService.confirmPIN.substring(0, this.utilityService.confirmPIN.length - 1);
            this.utilityService.convertedConfirmPIN = this.utilityService.confirmPIN.replace(/./g, '*');
          }
        break;
      default :
        if (this.utilityService.inputActive === 'employeeID') {
          this.utilityService.employeeID += value;
        } else if (this.utilityService.inputActive === 'newPIN') {
          this.utilityService.newPIN += value;
          this.utilityService.convertedNewPIN = this.utilityService.newPIN.replace(/./g, '*');
        } else if (this.utilityService.inputActive === 'confirmPIN') {
          this.utilityService.confirmPIN += value;
          this.utilityService.convertedConfirmPIN = this.utilityService.confirmPIN.replace(/./g, '*');
        }
      break;
    }
  }
  textInputActiveSignON(value, id) {
    document.getElementById('EmpIDSignON').removeAttribute('style');
    document.getElementById('PinSignON').removeAttribute('style');
    this.utilityService.inputActiveSignON = value;
    document.getElementById(id).setAttribute('style', 'background-color :#BCED91;');
    console.log(value);
  }
  textInputActive(value, id) {
    document.getElementById('EmpIDTextBox').removeAttribute('style');
    document.getElementById('newPINTextBox').removeAttribute('style');
    document.getElementById('confirmPINTextBox').removeAttribute('style');
    this.utilityService.inputActive = value;
    document.getElementById(id).setAttribute('style', 'background-color :#BCED91;');
    console.log(value);
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
 /*    this.utilityService.screen = 'signOn'; */
    this._router.navigate(['login']);
    localStorage.clear();
    // console.clear();
    // no function yet , just a switch to sign on screen
    this.utilityService.loadingType = 'loggingOut';
    this.showLoadingDialog();
    const _apiRoute = this.utilityService.getApiRoute('LogOut');
    const EmpID = this.utilityService.globalInstance.CurrentUser.EmpID;
    const _logOut :LogOut = { EmpID } as LogOut;
    this.service.logOut(_logOut,this.utilityService.baseAddress + _apiRoute)
    .subscribe(data => {

    }, error =>{
      this.toastr.error(error, 'Error' , {timeOut: 1000});
    }, ()=>{


    });
    this.dialogLoadingRef.close();
  }

  returnToSignON(){
    this.utilityService.screen = 'signOn';
  }

  clearSelectedItemIndexes() {
    localStorage.setItem('SelectedItemIndex', null);
    this.utilityService.array = [];
  }



  getroomName() {
        const _apiRoute = this.utilityService.getApiRoute('GetSelectedRoomURL');
        this.service.selectedRoom(this.utilityService.localBaseAddress + _apiRoute, this.utilityService.preSelectedRoom + '/' + this.utilityService.globalInstance.CurrentUser.EmpID)
        .subscribe(room => {
          this.utilityService.layoutTable = JSON.parse(room['result']);
          console.log(this.utilityService.layoutTable);
        }, error => {
          this.toastr.error(error,"Error getroomName", {timeOut: 2000});
        }, () => {
          this.utilityService.globalInstance.SelectedTableName =  this.utilityService.layoutTable[0].TableName;
        });
  }





private setApiRoute() {
  //console.clear();
  this.service.getapiEndPoint().subscribe(data => {
    this.utilityService.api_endpoint = data;
    console.log(data);
  }, error => {
    console.log('Error on setApiRoute');
    console.log(error);
    if(this.utilityService.api_endpoint == undefined){
    }
  }, () => {
    console.log(this.utilityService.api_endpoint);
  });
}


 onItemDrop(event: CdkDragDrop<any[]>) {
    console.log(event);
    console.log(event.container.data);

    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  }

  changeHandlerStatus(){
    if(this.utilityService.showHandler){
      this.utilityService.showHandler = false;
      this.utilityService.handlerStatusInfo = "hide-handler";
    }else{
      this.utilityService.showHandler = true;
      this.utilityService.handlerStatusInfo = "";
    }

  }

  showHandlerStatusText(){
    return "H";
  }

  showHandlerStatusClass(){
    if(this.utilityService.showHandler){
      return "assets/img/green-lock.png";
    }else{
      return "assets/img/red-lock.png";
    }
  }

  onKeydown(event){
    var eventKey = event.key
    var validkeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    var keynum = validkeys.indexOf(eventKey);
    if (keynum >= 0){
      this.getChangePinButtonValue(validkeys[keynum]);
    }
    if(eventKey == "Backspace"){
      console.log("backspace!");
    }else{
      event.preventDefault();
      console.log("NOT backspace!");
    }
    console.log("eventkey: "+eventKey);

  }
}
