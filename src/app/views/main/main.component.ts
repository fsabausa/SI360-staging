import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, FormArray, ValidatorFn} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ICustomer } from '../../shared/customer';
/* import { ITableDetail } from '../../shared/globalInstance.SelectedTableDetail'; */
import { ClockinComponent } from '../clockin/clockin.component';
import { ComingsoonComponent } from '../comingsoon/comingsoon.component';
import { CreditcardComponent } from '../creditcard/creditcard.component';
import { DiaglogChangeTableComponent } from '../diaglog-change-table/diaglog-change-table.component';
import { MealplanComponent } from '../mealplan/mealplan.component';
import { PaymentSuccessfulComponent } from '../payment-successful/payment-successful.component';
import { PinpadComponent } from '../pinpad/pinpad.component';
import { SiposService } from '../../shared/sipos.service';
import { UploadphotoComponent } from '../uploadphoto/uploadphoto.component';
import { cardAnimator } from '../../animation/card.animations';
import { Event, Router, Routes, RouterModule, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { UtilityService } from '../../services/utility.service';
import {
  SubModifierViewModel,
  SaveSeat,
  ResidenChargeSettleCheck,
  ChangePIN,
  AppSetting
} from '../../obj-interface';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [ cardAnimator ]
})
export class MainComponent {

  form: FormGroup;
  myControl = new FormControl();
  filteredOptions: Observable<ICustomer[]>;
  animationState: string;
  setStatus = '';

  constructor(
    private _router: Router,
    private service: SiposService,
    public utilityService: UtilityService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    public dialogUploadPhoto: MatDialog,
    public dialogChangeTable: MatDialog,
    private http: HttpClient,
    private formBuilder: FormBuilder) {
      this.form = this.formBuilder.group({
        mealPlanCustomerDetail: new FormArray([])
     });
    }

  ngOnInit() {
/*      this.setTime();
     this.initiateAppSetting();
     this.setApiRoute();
    setInterval(() => {
      this.setStatusFunction();
    }, 1000);
     setInterval(() => {
     if (this.utilityService.isOnline) {
        this.utilityService.localBaseAddress = this.utilityService.serverBaseAddress;
      } else {
        this.utilityService.localBaseAddress = this.utilityService.localBaseAddress;
      }
     }, 500);
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith<string | ICustomer>(''),
        map(value => typeof value === 'string' ? value : value.Name),
        map(name => name ? this._filter(name) : this.utilityService.customerList.slice())
      );
      if (this.utilityService.screen === '') {
        this.startScreen();
      } */
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
      this.toastr.error(error);
    }, () => {
      this.utilityService.appVersion = this.utilityService.appSetting[0].AppVersion['Version'];
      localStorage.setItem('IsForProduction', this.utilityService.appSetting[0].ForProduction['IsForProduction']);
      if (this.utilityService.appSetting[0].ForProduction['IsForProduction']) {
        this.utilityService.localBaseAddress = this.utilityService.appSetting[0].LocalBaseAddress['BaseAddress'];
        this.utilityService.serverBaseAddress = this.utilityService.appSetting[0].ServerBaseAddress['BaseAddress'];
      } else {
        this.utilityService.localBaseAddress = this.utilityService.appSetting[0].TestLocalBaseAddress['BaseAddress'];
        this.utilityService.serverBaseAddress = this.utilityService.appSetting[0].TestServerBaseAddress['BaseAddress'];
      }
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
  }

 getStoreID() {
   console.clear();
    const _apiRoute = this.utilityService.getApiRoute('GetStoreID');
    this.service.getStoreID(this.utilityService.localBaseAddress + _apiRoute)
    .subscribe(data => this.utilityService.storeId = JSON.parse(data['result'])
    , error => {
      console.log(error);
    }, () => {
      console.log(this.utilityService.storeId);
    });
 }

  submit() {
    const selectedOrderIds = this.form.value.mealPlanCustomerDetail
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
      this.toastr.error('Please input EmployeeID');
    } else if (this.utilityService.newPIN === '') {
      this.toastr.error('Please input pin');
    } else if (this.utilityService.confirmPIN === '') {
      this.toastr.error('Please input old pin');
    } else {
      const EmpID = Number(this.utilityService.employeeID);
      const NewPIN = Number(this.utilityService.newPIN);
      const ConfirmPIN = Number(this.utilityService.confirmPIN);
      const StoreNumber = this.utilityService.appSetting[0].SicSettings['StoreID'];
      if (NewPIN === ConfirmPIN) {
        // tslint:disable-next-line: max-line-length
        const getAccessUrl = this.utilityService.appSetting[0].SicSettings['ApiUrl'] + 'api/account/v1/access/' + this.utilityService.appSetting[0].SicSettings['StoreID'];
        const getAccess = await fetch(getAccessUrl);
        const res = await getAccess.json();
        this.utilityService.access = JSON.parse(res['result']);
        const _apiRoute = this.utilityService.getApiRoute('UpdatePin');

        let response: any;
        const _changePIN: ChangePIN = { StoreNumber, NewPIN, EmpID} as ChangePIN;
     /*    this.service.updatePIN(_changePIN, _apiRoute, this.utilityService.access.AccessToken) */
     this.service.updatePIN(_changePIN, this.utilityService.localBaseAddress + _apiRoute)
        .subscribe(data => {
          response = data;
        }, error => {
          this.toastr.error(error);
        }, () => {
          if (response.result === 'false') {
            this.toastr.error('Invalid EmpID or old pin');
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
            this.toastr.success('Change PIN SUCCESS');
            this.logOut();
          } else {
            this.toastr.warning('ELSE');
          }
        });
      } else {
        this.toastr.error('New PIN did not match on the confirm PIN');
      }
    }
  }

/*   deleteItem() {
      const ss = localStorage.getItem('SelectedItemIndex');
      const _apiRoute = this.utilityService.getApiRoute('DeleteItem');
        // tslint:disable-next-line: max-line-length
        this.service.deleteItem(this.utilityService.localBaseAddress + _apiRoute + this.utilityService._posChecknumber + '/' + ss).subscribe(data => {
        }, error => {
          this.toastr.error(error);
        }, () => {
          this.getCheckDetails(this.utilityService._posChecknumber, this.utilityService.globalInstance.SelectedTableName);
          this.toastr.success('menu item removed');
          this.clearSelectedItemIndexes();
        });
  } */

setStatusFunction() {
/*   const _apiRoute = this.utilityService.getApiRoute('GetStatus');
  this.service.getStatus(this.utilityService.appSetting[0].ServerBaseAddress['BaseAddress'] + _apiRoute).subscribe(data=> {
  },error => {
    this.utilityService.setStatus = 'offline-status';
    this.utilityService.isOnline = false;
    this.utilityService.hasofflineOrder = false;
    console.log('OFFFLINE');
  }, () => {
    this.utilityService.setStatus = 'online-status';
    this.utilityService.isOnline = true;
    console.log('ONLLLLLLINEEE');
  }); */
  if (navigator.onLine) {
    this.utilityService.setStatus = 'online-status';
    this.utilityService.isServerOnline = true;
  } else {
    this.utilityService.setStatus = 'offline-status';
    this.utilityService.isServerOnline = false;
    this.utilityService.hasofflineOrder = false;
  }
}

getMenu() {
  const _apiRoute = this.utilityService.getApiRoute('GetMenu');
  this.service.getMenu(this.utilityService.localBaseAddress + _apiRoute , this.utilityService.storeId)
  .subscribe(data => {
    this.utilityService._menuDescription = JSON.parse(data['result']);
  }, error => {
      this.toastr.error(error);
  }, () => {
    this.getOpenChecks(this.utilityService.globalInstance.CurrentUser.EmpID, null);
  });
}
  getTotalPages(totalItem): number {
    const _pages = Math.round(totalItem / 28);
    const _remainder = totalItem % 28;
    const _extraPage = _remainder === 0 ? 0 : 1;
    return _pages + _extraPage;
  }

  getMenuItems(screenIndex, menu, buttonId, page) {
  const _apiRoute = this.utilityService.getApiRoute('GetMenuItems');
  // tslint:disable-next-line: max-line-length
  this.service.getMenuItems(this.utilityService.localBaseAddress + _apiRoute + screenIndex + '/' + menu + '/' + buttonId + '/' + page)
  .subscribe(data => {
    this.utilityService._menuItemButton = JSON.parse(data['result']);
/*     this.utilityService._menuItems = this.utilityService._menuItemButton.Items; */
    this.utilityService._totalItemCount = this.utilityService._menuItemButton.Total;
    this.utilityService._totalPages = this.getTotalPages(this.utilityService._totalItemCount);
    this.utilityService.hasMenuItems = true;
  }, error => {
    this.toastr.error(error);
  }, () => {
    this.utilityService._menuName = menu;
    console.log(this.utilityService._itemName);
    this._menuItem_status(this.utilityService._itemName);
  });
}

  menuItemGoTo(meal, buttonId, page, defaultMenu) {
    if (defaultMenu) {
      this.utilityService._buttonId = '7E8F895C-11FC-E011-8C66-000C4125CACB';
      this.utilityService._menuName = 'BEVERAGE';
    } else {
      this.utilityService._buttonId = buttonId;
      this.utilityService._menuName = meal;
    }
    this.getMenuItems('3', this.utilityService._menuName, this.utilityService._buttonId, page);
    this._menu_status(this.utilityService._menuName);
}
  onClickPrevButton() {
    if (this.utilityService._itemPageNumber > 1) {
      const pageNumber = this.utilityService._itemPageNumber - 1;
      this.getMenuItems('3', this.utilityService._menuAction, this.utilityService._buttonId, pageNumber);
      this.utilityService._itemPageNumber = pageNumber;
    }
  }

  onClickNextButton() {
    const pageNumber = this.utilityService._itemPageNumber + 1;
    if (pageNumber <= this.utilityService._totalPages) {
      this.getMenuItems('3', this.utilityService._menuAction, this.utilityService._buttonId, pageNumber);
      this.utilityService._itemPageNumber = pageNumber;
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
  this.service.getCustomerList(this.utilityService.localBaseAddress + _apiRoute)
    .subscribe(data => {
      this.utilityService.customerList = JSON.parse(data['result']);
    }, error => {
      return alert(error);
    }, () => {
/*       console.log( this.customerList); */
    });
}
// end methods that are getting data from the cloud

onClickSyncSale() {
  if (this.utilityService.isServerOnline) {
    const _apiRoute = this.utilityService.getApiRoute('SyncSale');
    this.syncSale(this.utilityService.localBaseAddress + _apiRoute);
  } else {
  /*   this.toastr.error("Status is offline. Unable to push offline order."); */
  }
}


/* assignSeat(LayoutTableId, CustomerId, Mealplan, Seatnumber, CurrentUser, Checknumber, d: SaveSeat , ApiURL, ): void {
      console.clear();
      const assignToSeat: SaveSeat = { LayoutTableId, CustomerId, Mealplan , Seatnumber, CurrentUser, Checknumber} as SaveSeat;
      this.service.saveAssignSeat(assignToSeat, ApiURL)
      .subscribe(seat => {
      }, error => {
        this.toastr.error(error);
      }, () => {
        console.clear();
        this.changeSeatToGreen(Seatnumber);
        this.utilityService.successsAssignSeat = Seatnumber;
        this.reloadSelectedTable();
         this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith<string | ICustomer>(''),
        map(value => typeof value === 'string' ? value : value.Name),
        map(name => name ? this._filter(name) : this.utilityService.customerList.slice())
      );
      this.utilityService.canUploadPhoto = true;
      });
} */

checkOfflineOrder() {
  console.clear();
  const _apiRoute = this.utilityService.getApiRoute('CheckOfflineOrder');
  this.service.checkOfflineOrder(this.utilityService.localBaseAddress + _apiRoute, 32704).subscribe(data => {
    this.utilityService._hasOffLineOrder = JSON.parse(data['result']);
    console.log(this.utilityService._hasOffLineOrder);
  }, error => {
      this.toastr.error(error);
  }, () => {
    if (this.utilityService._hasOffLineOrder) {
      this.utilityService.hasofflineOrder = true;
    } else {
      this.utilityService.hasofflineOrder = false;
    }
  });
}


syncSale(ApiURL) {
  console.clear();
  this.service.syncSale(ApiURL).subscribe(data => {
  }, error => {
    this.toastr.error(error);
  }, () => {
/*     this.toastr.success("Successfully sync to master db"); */
    this.utilityService.hasofflineOrder = false;
  });
}

getCheckNumber(StoreId) {
  console.clear();
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






  loadMealPlanCustomerDetail(Checknumber) {
      this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = null;
      const _apiRoute = this.utilityService.getApiRoute('GetCustomerMealPlanDetailURL');
      this.service.getMealPlanCustomerDetail(this.utilityService.localBaseAddress + _apiRoute, Checknumber, this.utilityService.globalInstance.CurrentUser.EmpID)
      .subscribe(data => {
        this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = JSON.parse(data['result']);
      }, error => {
        return alert(error);
      }, () => {
        if (this.utilityService.globalInstance.SelectedTableDetail.Checknumber != null) {
         /*  this.subTotal = this.mealPlanCustomerDetail[0].SubTotal; */
          this.utilityService.grandtotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].GrandTotal;
          this.utilityService.totalTax = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].TaxTotal;
          this.utilityService.subTotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SubTotal;
          console.log(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SeatNumber);
        }
      });
  }


/* CRUD Functions */

/* Dialogs */


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
    this.service.selectedRoom(this.utilityService.localBaseAddress + _apiRoute, this.utilityService.preSelectedRoom + '/' + this.utilityService.globalInstance.CurrentUser.EmpID)
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

  GotoTableManagement1() {
       console.clear();
      this.utilityService.screen = 'rso-main';
      const _apiRoute = this.utilityService.getApiRoute('GetRoomListURL');
      this.service.getroomlist(this.utilityService.localBaseAddress + _apiRoute)
        .subscribe(room => {
          this.utilityService.roomList = JSON.parse(room['result']);
          console.log(this.utilityService.roomList);
        }, error => {
         this.toastr.error(error);
         console.log(error);
        }, () => {
           if (this.utilityService.preSelectedRoom == 0) {
               this.utilityService.preSelectedRoom = this.utilityService.roomList[0].RoomIndex;
               this.utilityService.selectedroom = this.utilityService.roomList[0].RoomName;
           }
         /*   this.getroomName(this.utilityService.selectedroom, this.utilityService.preSelectedRoom, this.utilityService.globalInstance.CurrentUser.EmpID); */
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

  hideCustomerDetailDiv() {
    this.utilityService.showButtonReAssignSeatAndRemoveSeat = false;
    this.utilityService.showMealDiv = true;
    this.utilityService.showCustomerDetail = false;
    this.utilityService.showCustomerDetail2 = false;
    this.utilityService.showButtonAssignSeat = false;
    this.utilityService.showCustomerSearchDiv = false;
    this.utilityService.menuDiv = true;
    this.getMenu();
  }

  MealAndCustomerDetailDiv() {
    this.utilityService.showCustomerDetail2 = true;
    this.utilityService.showButtonReAssignSeatAndRemoveSeat = true;
    this.utilityService.showMealDiv = true;
    this.utilityService.showCustomerDetail = false;
  }
  private getSelectedMealPlan(value) {
    try {
      this.utilityService.selectedMealPlan = value;
      this.utilityService.showCustomerSearchDiv = true;
      this.utilityService.showCustomerDetail =  true;
      this.utilityService.showButtonAssignSeat = true;
      this.utilityService.showChangeMealPlanButton = false;
      this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = [];

      if (this.utilityService.globalInstance.SelectedTableDetail.Checknumber != null) {
        this.loadMealPlanCustomerDetail(this.utilityService.globalInstance.SelectedTableDetail.Checknumber);
      }
      this.utilityService.showMealDiv = true;
      this.utilityService.showButtonReAssignSeatAndRemoveSeat = false;
      this.utilityService.showButtonMoveToSeatAndRemoveSeat = false;
      this.utilityService.showChangeMealPlanButton = false;
      this.utilityService.canUploadPhoto = false;
    } catch (err) {
      alert('getSelectedMealPlan ' + err.message);
    }
  }

/**
**Button Click Events
*/
  getbuttonValue(value) {
    this.utilityService.error = '';
    switch (value) {
      case 'DEL' :
      this.utilityService.pin = this.utilityService.pin.substring(0, this.utilityService.pin.length - 1);
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
    this.utilityService.screen = 'signOn';
    localStorage.clear();
    console.clear();

    
    /* this.service. */
    // no function yet , just a switch to sign on screen
  }

  clearSelectedItemIndexes() {
    localStorage.setItem('SelectedItemIndex', null);
    this.utilityService.array = [];
  }

  getbuttonActionRSO(action, tablename, tableshape, seatCount, layoutTableId, takenSeats, checknumbers, defaultMenu) {
    switch (action) {
      case 'BACK TO FLOOR PLANS' :
      const _apiRoute = this.utilityService.getApiRoute('GetSelectedRoomURL');
      // tslint:disable-next-line: max-line-length
      this.service.selectedRoom(this.utilityService.localBaseAddress + _apiRoute, this.utilityService.preSelectedRoom + '/' + this.utilityService.globalInstance.CurrentUser.EmpID)
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
/*         console.clear(); */
        this.utilityService.selectedSeat = null;
        this.utilityService._selectedSeatOrderUI = null;
        this.clearSelectedItemIndexes();
        this._router.navigate(['roomselection']);
      });
        break;
      case 'Table Selected' :
        this.utilityService.globalInstance.SelectedLayoutTableId = layoutTableId;
        this.utilityService.selectedtableShape = tableshape;
        this.utilityService.chosenTableShape = tableshape;
        this.utilityService.menuDiv = false;
        this.utilityService.showAddOrder = false;
        this.utilityService.showMealDiv = false;
        this.utilityService.showCustomerDetail = false;
        this.utilityService.showCustomerDetail2 = false;
        this.utilityService.showButtonReAssignSeatAndRemoveSeat = false;
    /*     this.selectedTable(checknumbers, seatCount, layoutTableId); */
        this.utilityService.globalInstance.SelectedTableName = tablename;
        break;
      default:
          this.utilityService.screen = 'signOn';
        break;
    }
}

public getMedia() {
    const _apiRoute = this.utilityService.getApiRoute('GetMedia');
    this.service.getMedia(this.utilityService.localBaseAddress + _apiRoute, this.utilityService.storeId)
    .subscribe(data => {
      this.utilityService._media = JSON.parse(data['result']);
    },
    error => {

    }, () => {

    });
    console.log('GetMedia: ' + this.utilityService.localBaseAddress + _apiRoute, this.utilityService.storeId);
  }



  /*   Button Click Events */

   getbuttonActionPAT(action) {
    switch (action) {
      case 'PATCheckSelected':
         this.getGuestCheckDetailPassParams(this.utilityService.globalInstance.SelectedSaleId);
      break;
      case 'PATCheckSelection':
        this.getGuestCheckDetail(this.utilityService.globalInstance.SelectedSaleId);
        this.utilityService.screen = 'payAtTableCheckSelection';
      break;
      case 'PATPaymentSelection':
        this.utilityService.screen = 'payAtTAblePaymentSelection';
        localStorage.setItem('AmountPay', this.utilityService.grandtotal);
        this.getMedia();
        this._router.navigate(['patpaymentselection']);
        break;
      case 'PATResidentCharge':
        this.utilityService.screen = 'payAtTableResidentCharge';
        break;
      case 'ReturnToPOS':
        this.GotoTableManagement();
        this.utilityService.screen = 'rso-main';
        break;
      default:
        break;
    }
  }

  getGuestCheckDetailPassParams(saleid) {
    console.clear();
    const _apiRoute = this.utilityService.getApiRoute('GetGuestCheckDetail');
    this.service.getGuestCheckDetail(this.utilityService.localBaseAddress + _apiRoute + saleid, this.utilityService.storeId)
    .subscribe(data => {
      this.utilityService.guestCheck = JSON.parse(data['result']);
      console.log(this.utilityService.guestCheck );
    }, error => {
        this.toastr.error(error);
    }, () => {
        this.utilityService.patTableName = this.utilityService.guestCheck[0].TableName;
        this.utilityService.totalTax = this.utilityService.guestCheck[0].SaleSummary.TotalTax;
        this.utilityService.grandtotal = this.utilityService.guestCheck[0].SaleSummary.Total;
        this._router.navigate(['patselectedcheck']);
    });
  }

  getGuestCheckDetail(saleid) {
    console.clear();
    const _apiRoute = this.utilityService.getApiRoute('GetGuestCheckDetail');
    this.service.getGuestCheckDetail(this.utilityService.localBaseAddress + _apiRoute + saleid, this.utilityService.storeId)
    .subscribe(data => {
      this.utilityService.guestCheck = JSON.parse(data['result']);
      console.log(this.utilityService.guestCheck);
    }, error => {
      this.toastr.error(error);
    }, () => {
        this.utilityService.patTableName = this.utilityService.guestCheck[0].TableName;
        this.utilityService.totalTax = this.utilityService.guestCheck[0].SaleSummary.TotalTax;
        this.utilityService.grandtotal = this.utilityService.guestCheck[0].SaleSummary.Total;
    });
  }

  gettakenSeatsArray(takenSeats) {
    if (takenSeats != null) {
      const res = takenSeats.split('|').slice(0, -1);
      const takenSeatsArray = JSON.parse('[' + res + ']');
      this.utilityService.takenSeatsArray =  takenSeatsArray;
    } else {
      this.utilityService.takenSeatsArray = [0];
    }
  }
  getCheckNumbersArray(checknumbers) {
    if (checknumbers != null) {
      this.utilityService.checkNumbers = null;
      const res = checknumbers.split('|').slice(0, -1);
      const CheckNumbersArray = JSON.parse('[' + res + ']');
      this.utilityService.checkNumbers =  CheckNumbersArray;
    }
  }
  getCustomerIdsArray(customerIds) {
    if (customerIds != null) {
      const res = customerIds.split('|').slice(0, -1);
      const CustomerIdsArray = JSON.parse('[' + res + ']');
      this.utilityService.customerIds =  CustomerIdsArray;
    }
  }


private setApiRoute() {
  console.clear();
  this.service.getapiEndPoint().subscribe(data => {
    this.utilityService.api_endpoint = data;
  }, error => {
    console.log('Error on setApiRoute');
    console.log(error);
  }, () => {
    console.log(this.utilityService.api_endpoint);
  });
}

  private iterateSeatFunction(seatCount) {
    let i = 1;
    while (i <= seatCount) {
      this.utilityService.iterateSeat.push(i);
      i++;
    }
  }

  private clearAllFields() {
    this.utilityService._seats = null;
    this.utilityService.takenSeats = null;
    this.utilityService.seatCount = null;
    this.utilityService.selectedtable = null;
    this.utilityService.selectedtableShape = null;
  }

  private seatPush(seatCount) {
    let i = 1;
    while (i <= seatCount) {
      this.utilityService._seats.push(i);
      i++;
    }
  }
 

/*   Private Methods */

  

  reassignSeat() {
      if (this.utilityService.isServerOnline) {
        if (this.utilityService.seatCount === 1) {
          this.utilityService.showButtonReAssignSeatAndRemoveSeat = false;
        } else {
          this.utilityService.isReassignSeat = true;
          this.utilityService.prevAssignSeat = this.utilityService.selectedSeat;
           this.resetSeatByReassignSeat();
        }
      } else {
      alert('offl');
      }
  }

  changeSeatToGreen(seatnumber) {
    if (this.utilityService.globalInstance.SelectedTableDetail.TakenSeats.includes(seatnumber)) {
    } else {
      if (this.utilityService.prevSelectedSeat != null) {
        this.resetSeat();
      }
      if (this.utilityService.shape === 5) {
        this.utilityService.seatUrl = 'assets/img/Rchair-chair-serving-01.png';
      } else if (this.utilityService.shape !== 0 && this.utilityService.shape !== 1 ) {
        this.utilityService.seatUrl = 'assets/img/Rchair-chair-serving-01.png';
      } else {
        this.utilityService.seatUrl = 'assets/img/Rchair-chair-serving-01.png';
      }
      document.getElementById('Seatnumber' + seatnumber).setAttribute('src', this.utilityService.seatUrl);
      this.utilityService.prevSelectedSeat = 'Seatnumber' + seatnumber;
      if (this.reassignSeat) {
/*         this.toastr.success('Successfully reassigned to seatnumber ' + seatnumber); */
      } else {
/*         this.toastr.success('You selected seatnumber ' + seatnumber); */
      }
    }
  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, this.utilityService.appSetting[0].TimeLimitation['ResponseTime']))
    //return new Promise(resolve => setTimeout(resolve, ms));
  }


  resetSeatWhenGreenIsClick() {
    for (let s = 1; s <= this.utilityService.seatCount; s++) {
      if (document.getElementById('Seatnumber' + s).getAttribute('src').includes('waiting')) {
        if (this.utilityService.shape === 5) {
          document.getElementById('Seatnumber' + s).setAttribute('src', 'assets/img/Rchair-normal-01.png');
        } else if (this.utilityService.shape !== 0 && this.utilityService.shape !== 1) {
          document.getElementById('Seatnumber' + s).setAttribute('src', 'assets/img/Rchair-normal-01.png');
        } else {
          document.getElementById('Seatnumber' + s).setAttribute('src', 'assets/img/Rchair-normal-01.png');
        }
      }
    }
  }

  resetSeatByReassignSeat() {
          if (this.utilityService.shape === 5) {
            document.getElementById('Seatnumber' + this.utilityService.selectedSeat).setAttribute('src', 'assets/img/Rchair-normal-01.png');
          } else if (this.utilityService.shape !== 0 && this.utilityService.shape !== 1) {
            document.getElementById('Seatnumber' + this.utilityService.selectedSeat).setAttribute('src', 'assets/img/Rchair-normal-01.png');
          } else {
            document.getElementById('Seatnumber' + this.utilityService.selectedSeat).setAttribute('src', 'assets/img/Rchair-normal-01.png');
          }
  }

  resetSeat() {
      for (let s = 1; s <= this.utilityService.seatCount; s++) {
        if (!document.getElementById('Seatnumber' + s).getAttribute('src').includes('serving')) {
          if (this.utilityService.shape === 5) {
            document.getElementById('Seatnumber' + s).setAttribute('src', 'assets/img/Rchair-normal-01.png');
          } else if (this.utilityService.shape !== 0 && this.utilityService.shape !== 1) {
            document.getElementById('Seatnumber' + s).setAttribute('src', 'assets/img/Rchair-normal-01.png');
          } else {
            document.getElementById('Seatnumber' + s).setAttribute('src', 'assets/img/Rchair-normal-01.png');
          }
        }
      }
  }

  resetTable() {
    switch (this.utilityService.chosenTableShape) {
      case 0:
      this.utilityService.selectedtableShape = 'assets/img/circle.png';
        break;
      case 1:
      this.utilityService.selectedtableShape = 'assets/img/circle.png';
        break;
      case 2:
      this.utilityService.selectedtableShape = 'assets/img/diamond.png';
      break;
      case 5:
      this.utilityService.selectedtableShape = 'assets/img/rectangle2.png';
        break;
      case 6:
      this.utilityService.selectedtableShape = 'assets/img/rectangle.png';
        break;
      case 7:
      this.utilityService.selectedtableShape = 'assets/img/rectangle.png';
        break;
      case 8:
      this.utilityService.selectedtableShape = 'assets/img/square.png';
        break;
      default:
      this.utilityService.selectedtableShape = 'assets/img/circle.png';
       break;
   }
  }

  removeResident() {
    this.utilityService.selectedSeat = null;
    this.resetSeat();
    this.utilityService.showCustomerDetail = false;
    this.utilityService.showCustomerDetail2 = false;
    this.utilityService.showButtonAssignSeat = false;
    this.utilityService.showCustomerSearchDiv = false;
    this.toastr.warning('Please select a seat');
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith<string | ICustomer>(''),
        map(value => typeof value === 'string' ? value : value.Name),
        map(name => name ? this._filter(name) : this.utilityService.customerList.slice())
      );
  }

  private renderSeats(seatnumber) {
 /*      if(this.takenSeatsArray.includes(seatnumber)){ */

        if (this.utilityService.globalInstance.SelectedTableDetail.TakenSeats.includes(seatnumber)) {
          switch (this.utilityService.shape) {
            case 0 :
             this.utilityService.seatUrl = 'assets/img/Rchair-chair-serving-01.png';
             this.utilityService.tableShape = 'circle';
             break;
            case 1 :
             this.utilityService.seatUrl = 'assets/img/Rchair-chair-serving-01.png';
             this.utilityService.tableShape = 'circle';
            break;
            case 2:
             this.utilityService.seatUrl = 'assets/img/Rchair-chair-serving-01.png';
             this.utilityService.tableShape = 'diamond';
            break;
            case 5:
          /*    this.seatUrl = "assets/img/Rchair-chair-serving-01.png";
             this.tableShape = 'square'; */
             this.utilityService.seatUrl = 'assets/img/Rchair-chair-serving-01.png';
             this.utilityService.tableShape = 'rectangle';
             break;
           case 6:
             this.utilityService.seatUrl = 'assets/img/Rchair-chair-serving-01.png';
             this.utilityService.tableShape = 'rectangle';
             break;
         /*   case 7:
             this.seatUrl = "assets/img/Rchair-chair-serving-01.png";
             this.tableShape = 'rectangle7'
             break; */
           case 8:
          /*    this.seatUrl = "assets/img/Rchair-chair-serving-01.png";
             this.tableShape = 'rectangle8' */
             this.utilityService.seatUrl = 'assets/img/Rchair-chair-serving-01.png';
             this.utilityService.tableShape = 'rectangle';
             break;
            default:
             this.utilityService.seatUrl = 'assets/img/Rchair-chair-serving-01..png';
             this.utilityService.tableShape = 'circle';
            break;
          }
        } else {
          switch (this.utilityService.shape) {
            case 0 :
             this.utilityService.seatUrl = 'assets/img/Rchair-normal-01.png';
             this.utilityService.tableShape = 'circle';
             break;
            case 1 :
             this.utilityService.seatUrl = 'assets/img/Rchair-normal-01.png';
             this.utilityService.tableShape = 'circle';
            break;
            case 2:
             this.utilityService.seatUrl = 'assets/img/Rchair-normal-01.png';
             this.utilityService.tableShape = 'diamond';
            break;
            case 5:
          /*    this.seatUrl = "assets/img/Rchair-normal-01.png";
             this.tableShape = 'square' */
             this.utilityService.seatUrl = 'assets/img/Rchair-normal-01.png';
             this.utilityService.tableShape = 'rectangle';
             break;
           case 6:
             this.utilityService.seatUrl = 'assets/img/Rchair-normal-01.png';
             this.utilityService.tableShape = 'rectangle';
             break;
          /*  case 7:
             this.seatUrl = "assets/img/Rchair-normal-01.png";
             this.tableShape = 'rectangle7'
             break; */
           case 8:
             /* this.seatUrl = "assets/img/Rchair-normal-01.png";
             this.tableShape = 'rectangle8' */
             this.utilityService.seatUrl = 'assets/img/Rchair-normal-01.png';
             this.utilityService.tableShape = 'rectangle';
             break;
            default:
             this.utilityService.seatUrl = 'assets/img/Rchair-normal-01.png';
             this.utilityService.tableShape = 'circle';
            break;
          }
        }
/*        this.seatClass = "seat" + seatnumber +"by" + this.seatCount + this.tableShape; */
       this.utilityService.seatClass = this.utilityService.tableShape + seatnumber + 'by' + this.utilityService.seatCount;
       this.utilityService.seatImageClass = 'size' + seatnumber + 'by' + this.utilityService.seatCount + this.utilityService.tableShape;
/*        this.seatLabel = "spanseat" + seatnumber + "by" + this.seatCount +this.tableShape; */
        this.utilityService.seatLabel = this.utilityService.tableShape + 'SeatNumber' + seatnumber + 'by' + this.utilityService.seatCount;
       return this.utilityService.seatUrl;
  }

  seatStyle(seatnumber) {
    this.renderSeats(seatnumber);
  }

  closeAPP() {
/*     var window = remote.getCurrentWindow();
    window.close(); */
  }
  private getTableShape(shape, checknumber) {
    if (checknumber == null) {
      switch (shape) {
        case 0:
        this.utilityService.tableShapeUrl = 'assets/img/circle.png';
          break;
        case 1:
        this.utilityService.tableShapeUrl = 'assets/img/circle.png';
          break;
        case 2:
        this.utilityService.tableShapeUrl = 'assets/img/diamond.png';
        break;
        case 5:
        this.utilityService.tableShapeUrl = 'assets/img/rectangle2.png';
          break;
        case 6:
        this.utilityService.tableShapeUrl = 'assets/img/rectangle.png';
          break;
      /*   case 7:
        this.utilityService.tableShapeUrl = 'assets/img/rectangle.png'; */
        case 8:
        this.utilityService.tableShapeUrl = 'assets/img/square.png';
          break;
        default:
        this.utilityService.tableShapeUrl = 'assets/img/circle.png';
         break;
      }
    } else {
      this.utilityService.canUploadPhoto = true;
      switch (shape) {
        case 0:
        this.utilityService.tableShapeUrl = 'assets/img/circleGreen.png';
          break;
        case 1:
        this.utilityService.tableShapeUrl = 'assets/img/circleGreen.png';
          break;
        case 2:
        this.utilityService.tableShapeUrl = 'assets/img/diamond-green.png';
        break;
        case 5:
        this.utilityService.tableShapeUrl = 'assets/img/rectangle-green2.png';
          break;
        case 6:
        this.utilityService.tableShapeUrl = 'assets/img/rectangle-green.png';
          break;
      /*   case 7:
        this.utilityService.tableShapeUrl = 'assets/img/rectangle-green.png';
        break; */
        case 8:
        this.utilityService.tableShapeUrl = 'assets/img/square-green.png';
          break;
        default:
        this.utilityService.tableShapeUrl = 'assets/img/circleGreen.png';
         break;
      }
    }
    this.utilityService.shape = shape;
     return shape = this.utilityService.tableShapeUrl;
  }
  getStyles(x, y, shape, checknumber) {
    this.getTableShape(shape, checknumber);
    const styles = {
    'position': 'absolute',
    'top' : y + 'px',
    'left' : x + 'px',
    };
  return styles;
  }

  setStyleGuestCheckWindow(seatnumber) {
    const _seatNo = seatnumber.replace('Seat', '');
    if (_seatNo % 2 == 0) {
      const styles = {
        'background-color' : '#403F99',
        'border-bottom-style': 'groove',
        'color': 'white',
        'text-transform': 'uppercase'
      };
      return styles;
    } else {
      const styles = {
        'background-color' : '#E38B25',
        'border-bottom-style': 'groove',
        'color': 'white',
        'text-transform': 'uppercase'
      };
      return styles;
   }
  }

 /*  getCheckDetails(checknumber, tablename) {
    console.clear();
    this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = null;
      const _apiRoute = this.utilityService.getApiRoute('GetCustomerMealPlanDetailURL');
      this.service.getMealPlanCustomerDetail(this.utilityService.localBaseAddress + _apiRoute, checknumber, this.utilityService.globalInstance.CurrentUser.EmpID)
      .subscribe(data => {
        this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = JSON.parse(data['result']);
        console.log(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems );
      }, error => {
        return alert(error);
      }, () => {
        if (this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems !== []) {
          this.clearSelectedItemIndexes();
          this.utilityService._posChecknumber = checknumber;
          this.utilityService.globalInstance.SelectedTableName = tablename;
          this.utilityService._selectedTableSpeerBar = tablename;
          this.utilityService.grandtotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].GrandTotal;
          this.utilityService.totalTax = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].TaxTotal;
          this.utilityService.subTotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SubTotal;
          this._css_Selected_table_speedBar(this.utilityService.globalInstance.SelectedTableName);
          localStorage.setItem('tableSelectedCheckNumber', checknumber);
          this.utilityService._selectedSeatOrderUI = Number(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SeatNumber.replace('Seat', ''));
          this.utilityService._selectedCustomerIdOrderUI = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].CustomerId;
        }
      });
  } */
  getSaleItemId(value) {
    alert(value);
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
  _css_enable_green_dot(value, remotePrns) {
    let styles;
    if (remotePrns === 0) {
      if (value === remotePrns) {
        styles = {
          'height': '15px',
          'width': '15px',
          'background-color': 'green',
          'border-radius': '50%',
          'display': 'inline-block;',
          'margin-top': '9px',
          'margin-left': '-11px'
        };
      } else {
        styles = {
          'height': '15px;',
          'width': '15px;',
          'background-color': 'red',
          'border-radius': '50%',
          'display': 'inline-block;',
          'margin-top': '9px',
          'margin-left': '-11px'
        };
      }
    }
    return styles;
  }

  _menu_status(value) {
    let styles;
    if (value == this.utilityService._menuName) {
      styles = {
        'background-color' : '#007bff',
        'font-size' : '18px',
        'white-space' : 'normal',
        'word-wrap' : 'break-word',
        'color' : '#fff',
        'background' : 'linear-gradient(to right,#000066,#1d3bb2)',
        'border-width': '3px',
        'margin-top' : '10px'
      };
    } else {
      styles = {
        'background-color' : '#80aedf',
        'font-size' : '18px',
        'white-space' : 'normal',
        'word-wrap' : 'break-word',
        'color' : '#fff',
        'background' : 'linear-gradient(135deg,#1E86FF,#8a968b)',
        'margin-top' : '10px'
      };
    }
    return styles;
  }

  activeButtonMod(value) {
    let styles ;
    if (value == this.utilityService._itemName) {
      styles = {
        'background-color' : '#007bff',
        'font-size' : '18px',
        'white-space' : 'normal',
        'word-wrap' : 'break-word',
        'color' : '#fff',
        'background' : 'linear-gradient(to right,#000066,#1d3bb2)',
        'border-width': '3px',
        'margin-top' : '10px'
/*         'width':'auto' */
      };
    }
    return styles;
  }

  _menuItem_status(value) {
    let styles;
    if (value === this.utilityService._itemName) {
      styles = {
        'background-color' : '#007bff',
        'font-size' : '18px',
        'white-space' : 'normal',
        'word-wrap' : 'break-word',
        'color' : '#fff',
        'background' : 'linear-gradient(to right,#000066,#1d3bb2)',
        'border-width': '3px',
        'margin-top' : '10px'
/*         'width':'auto' */
      };
    } else {
      styles = {
        'background-color' : '#80aedf',
        'font-size' : '18px',
        'white-space' : 'normal',
        'word-wrap' : 'break-word',
        'color' : '#fff',
        'background' : 'linear-gradient(135deg,#1E86FF,#8a968b)',
        'margin-top' : '10px'
/*         'width':'auto' */
      };
    }
    return styles;
  }
/*   PATatTable */

  entireCHECK() {
    this.utilityService.payment_Option = 'Entire Check';
  }

  getOpenChecks(empid, UIType) {
    console.clear();
    // tslint:disable-next-line: max-line-length
    this.service.getOpenChecks(this.utilityService.localBaseAddress + 'api/openCheck/v1/getOpenChecks/' + empid, this.utilityService.storeId)
    .subscribe(data => {
      this.utilityService.openChecks = JSON.parse(data['result']);
      console.log(this.utilityService.openChecks);
    }, error => {
        this.toastr.error(error);
    }, () => {
        if (UIType === 'PAT') {
          this.utilityService.screen = 'payAtTableCheckSelection';
        }
    });
  }

  displayPayAtTableScreen() {
    this.getOpenChecks(this.utilityService.globalInstance.CurrentUser.EmpID, 'PAT');
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
      if(this.utilityService.serviceTypeDesc == 'Quick Service') {
        this._router.navigate(['ordering']);
      } else {
        this.getbuttonActionRSO('BACK TO FLOOR PLANS', null, null, null, null, null, null, false);
        this.getbuttonActionRSO('BACK TO FLOOR PLANS', null, null, null, null, null, null, false);
      }    
    });
  }

  onClickSettleCheckResidentCharge() {
    if(this.utilityService.isServerOnline) {
      // tslint:disable-next-line: max-line-length
      this.settleResidentCharge(this.utilityService.globalInstance.SelectedSaleId, this.utilityService.localBaseAddress + 'api/openCheck/v1/ResidentChargeSettleCheck');
    } else {
      this.toastr.warning('Cannot settle check while offline','Warning',{timeOut:5000});
    }
  }

  splitBy(value) {
    this.utilityService.payment_Option = 'Split by ' + value;
    this.openComingSoon();
  }


  getPaymentMedia(value) {
    this.utilityService.balance = this.utilityService.grandtotal;
    if (this.utilityService.payment_Option === 'Entire Check') {
        this.utilityService.payment_type = 'single';
    }
    switch (value) {
      case 'cash' :
        this.utilityService.payment_media = 'cash';
        this.openNumberPad();
        break;
      case 'creditcardother'  :
        this.utilityService.payment_media = 'CreditOther';
        this.openNumberPad();
        break;
      case 'creditcard':
        this.utilityService.payment_media = 'creditcard';
        this.openNumberPad();
      break;
      default:
        break;
    }
  }

  removeModifierViewModel(arr, item) {
    for (let i = arr.length; i--;) {
        if (arr[i] === item) {
            arr.splice(i, 1);
        }
    }
}

  selectedMod(value, itemName, maxSelect, minSelect, UseMaxSelect, UseMinSelect, ItemID, modDesc, modIndex) {
    console.clear();
    this.utilityService.modArray.push(value);
    let _modDesc: string;
    const mod: SubModifierViewModel = {} as any;
    mod.ItemID = value;
    mod.ModifierDesc = modDesc;
    mod.ModifierIndex = modIndex;
    mod.ItemModifierID = value;
    mod.ItemName = itemName;
    const index = [];
    let result = false;
      if (maxSelect === 1 && minSelect === 1 && UseMaxSelect === true &&  UseMinSelect === true) {
        for (let i = 0; i < this.utilityService.subModifierViewModel.length; i++) {
/*           console.log(this.subModifierViewModel[i]['ModifierDesc']); */
          if ( this.utilityService.subModifierViewModel[i]['ModifierDesc'].includes(modDesc)) {
                document.getElementById(this.utilityService.subModifierViewModel[i]['ItemName']).removeAttribute('class');
              this.utilityService.subModifierViewModel.splice(i, 1);
              console.log('removed '  + this.utilityService._prevItemName);
              result = true;
              index.push(i);
              i--;
              this.utilityService._prevItemName = itemName;
              _modDesc = modDesc;
         }
        }
      } else {
        if (!this.utilityService.listItemMod.includes(itemName)) {
          this.utilityService.listItemMod.push(itemName);
          this.utilityService.subModifierViewModel.push(mod);
          document.getElementById(itemName).className = 'highLightMod';
        }
      }
      if (!this.utilityService.listItemMod.includes(itemName)) {
        document.getElementById(itemName).className = 'highLightMod';
        console.log('added ' + itemName);
        this.utilityService.subModifierViewModel.push(mod);
      }
  }




/*  private reloadGuestCheckWindow(checknumber, tablename) {
    console.clear();
    this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = null;
    const _apiRoute = this.utilityService.getApiRoute('GetCustomerMealPlanDetailURL');
    this.service.getMealPlanCustomerDetail(this.utilityService.localBaseAddress + _apiRoute, checknumber, this.utilityService.globalInstance.CurrentUser.EmpID)
    .subscribe(data => {
      this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = JSON.parse(data['result']);
      console.log(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems);
    }, error => {
      this.toastr.error(error);
    }, () => {
      this.clearSelectedItemIndexes();
      this.utilityService._posChecknumber = checknumber;
      this.utilityService.globalInstance.SelectedTableName = tablename;
      this.utilityService._selectedTableSpeerBar = tablename;
      this.utilityService.grandtotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].GrandTotal;
      this.utilityService.totalTax = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].TaxTotal;
      this.utilityService.subTotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SubTotal;
      this._css_Selected_table_speedBar(this.utilityService.globalInstance.SelectedTableName);
      localStorage.setItem('tableSelectedCheckNumber', checknumber);
    });
  } */


  GetMenuItemPrice(itemId) {
    const _apiRoute = this.utilityService.getApiRoute('GetMenuItemPrice');
    this.service.getMenuItemPrice(this.utilityService.localBaseAddress + _apiRoute + itemId, this.utilityService.storeId)
    .subscribe(data => {
      const jsonArray = JSON.parse(data['result']);
    }, error => {

    }, () => {
    });
  }

 findMediaType(value) {
  this.utilityService.balance = this.utilityService.grandtotal;
  if (this.utilityService.payment_Option === 'Entire Check') {
      this.utilityService.payment_type = 'single';
  }
  localStorage.setItem('PaymentMedia', value);
   switch (value.toLowerCase().trim().replace(/(\r?\n|\r)/gm, ' ')) {
     case 'credit card' :
       this.utilityService.payment_media = 'creditcard';
       /*  static Customer Id  */
       this.utilityService.globalInstance.SelectedCustomerId  = '562CC46A-4EF0-E511-80C9-0060EF1DBF03';
       this.getCustomerDetailCreditCard(this.utilityService.globalInstance.SelectedCustomerId );
       this.utilityService.screen = 'creditCardSale';
     break;
      case 'cash' :
      this.openComingSoon();
     break;
     case 'account charge':
     this.utilityService.payment_media = 'accountcharge';
     break;
     default:
     this.openComingSoon();
     break;
   }
 }

 getCustomerDetailCreditCard(customerId) {
  const _apiRoute = this.utilityService.getApiRoute('GetCustomerDetailCreditCard');
  this.service.getCustomerDetailCreditCard(this.utilityService.localBaseAddress + _apiRoute + customerId, this.utilityService.storeId)
  .subscribe(data => {
    this.utilityService.customerDetailCreditCard = JSON.parse(data['result']);
  }, error => {

  }, () => {

  });
 }
}
