import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, FormArray, ValidatorFn} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ICustomer } from '../../shared/customer';
import { ISeatDetailBySeatNo } from '../../shared/seatDetailBySeatNo';
import { DiaglogChangeTableComponent } from '../diaglog-change-table/diaglog-change-table.component';
import { MealplanComponent } from '../mealplan/mealplan.component';
import { SiposService } from '../../shared/sipos.service';
import { UploadphotoComponent } from '../uploadphoto/uploadphoto.component';
import { Router} from '@angular/router';
import { UtilityService } from '../../services/utility.service';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { LoadingmodalComponent } from '../loadingmodal/loadingmodal.component';
import {
  SaveSeat,
  AddSeat,
  UpdateSeat,
  UploadPhoto,
  SaveSeatLocal,
  IMealType,
  IassignSeat
} from '../../obj-interface';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import Keyboard from "simple-keyboard";
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

//import { MatKeyboardModule } from '@ngx-material-keyboard/core';

@Component({
  selector: 'app-selected-table',
  templateUrl: './selected-table.component.html',
  styleUrls: [
    "../../../../node_modules/simple-keyboard/build/css/index.css",
    './selected-table.component.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class SelectedTableComponent implements OnInit {

  form: FormGroup;
  myControl = new FormControl();
  filteredOptions: Observable<ICustomer[]>;
  animationState: string;
  setStatus = '';
  dialogLoadingRef;


  value = "";
  keyboard: Keyboard;
  //@ViewChild(MatAutocomplete, {static: false}) matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger, {static: true}) inputAutoComplit: MatAutocompleteTrigger;

  ngAfterViewInit() {
    this.keyboard = new Keyboard({
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button),
      theme: "hg-theme-default myTheme1"
    });
  }

  onChange = (input: string) => {
    this.value = input;
    console.log("Input changed", input);
    console.log('changed!');
    console.log(this.myControl);

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(input),
        map(value => this._filter(input))
      );
  };

  onKeyPress = (button: string) => {
    console.log("Button pressed", button);
    if (button === "{shift}" || button === "{lock}") this.handleShift();
  };

  onInputChange = (event: any) => {
    this.keyboard.setInput(event.target.value);

    (document.getElementById("SearchCustomerName") as HTMLInputElement).focus();  
  };

  open(){
    //trigger.openPanel();
    //debugger;
     (document.getElementById("SearchCustomerName") as HTMLInputElement).click();  
    (document.getElementById("SearchCustomerName") as HTMLInputElement).focus();  
    //this.inputAutoComplit.openPanel(); 
    console.log("focusOnInput called!");
    this.onChange((document.getElementById("SearchCustomerName") as HTMLInputElement).value);
    event.preventDefault();
  }

  handleShift = () => {
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    this.keyboard.setOptions({
      layoutName: shiftToggle
    });
  };

  onKeydown(event){
    var currentValue = (document.getElementById("SearchCustomerName") as HTMLInputElement).value;
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(currentValue),
        map(value => this._filter(currentValue))
      );
    (document.getElementById("SearchCustomerName") as HTMLInputElement).focus();
  }

  focusFunction(){
    var currentValue = (document.getElementById("SearchCustomerName") as HTMLInputElement).value;
    this.value = currentValue;
    this.keyboard.setInput(currentValue);
    console.log("currentValue: "+currentValue);
    console.log("focus !");
    document.getElementById("container-keyboard").classList.remove('hide');
    (document.getElementById("SearchCustomerName") as HTMLInputElement).focus();
    (document.getElementById("SearchCustomerName") as HTMLInputElement).click();
    //this.onChange(currentValue);
  }

  focusOutFunction(){
    /*console.log("focus OUT");
    document.getElementById("container-keyboard").classList.add('hide');*/
  }

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
       /*  globalInstance.SelectedTableDetail.GetSaleItems: new FormArray([]) */
     });
  }

  ngOnInit() {
    /* this.mealTypeList(); */
/*     this.getMealTypeFilters(); */
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith<string | ICustomer>(''),
      map(value => typeof value === 'string' ? value : value.Name),
      map(name => name ? this._filter(name) : this.utilityService.customerList.slice())
    );

    this.utilityService.showButtonAssignSeat = false;

    console.log("Taken Seats");
    console.log(this.utilityService.globalInstance.SelectedTableDetail.TakenSeats);
  }

  setDraggableRSOComponents(){
    const tempComponent = this.utilityService.draggableRSOComponents;
    var newComponent = [];
    var ctr = 0;

    for (const screenlayout of this.utilityService.screenLayoutArr){
      for (const comp of tempComponent) {
        if (comp.ControlPanel === screenlayout.ControlPanel) {
          ctr++;
          newComponent.push(screenlayout);
          if(ctr==tempComponent.length){
            this.utilityService.draggableRSOComponents = newComponent;
          }
        }
      }
    }
  }

  pullcustomerList() {
    const _apiRoute = this.utilityService.getApiRoute('GetCustomerList');
    this.service.getCustomerList(this.utilityService.localBaseAddress+ _apiRoute)
      .subscribe(data => {
        console.log(data['result']);
        this.utilityService.customerList = JSON.parse(data['result']);
      }, error => {
        return alert(error);
      }, () => {
      });
  }

  displayFn(user?: ICustomer): string | undefined {
    return user ? user.Name : undefined;
  }

  returnTotalOrderedMeal(){
    var total = 0;

    if(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems != null){
      this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems.forEach(function (meal) {
        // @ts-ignore
        total = total + 3 + meal.GetMenuItems.length;
      });
      if(total > this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems.length) {
        //console.log("returnTotalOrderedMeal = "+total);
        return total;
      }else{
        return 0;
      }
    }else{
      return total;
    }
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

	getIsChangeTable(value) {
    this.toastr.warning('Change Table function is working in progress',"Warning", {timeOut: 2000});
/*         this.utilityService.isChangeTable = value;
        if (this.utilityService.isChangeTable) {
          this.utilityService.prevTableId = this.utilityService.globalInstance.SelectedLayoutTableId;
          this.gotoSelectedRoom();
        } */
  }

  gotoSelectedRoom() {
    const _apiRoute = this.utilityService.getApiRoute('GetSelectedRoomURL');
    // tslint:disable-next-line: max-line-length
    this.service.selectedRoom(this.utilityService.localBaseAddress+ _apiRoute, this.utilityService.preSelectedRoom + '/' + this.utilityService.globalInstance.CurrentUser.EmpID)
    .subscribe(room => {
      this.utilityService.layoutTable = JSON.parse(room['result']);
    }, error => {
      this.toastr.error(error,"Error", {timeOut: 2000});
    }, () => {
      this.hideMealAndCustomerDetailDiv();
      this.utilityService.takenSeatsArray = null;
      this.utilityService._seats = null;
      this.utilityService.iterateSeat = [];
      this.utilityService.prevSelectedSeat = null;
      this.utilityService.successsAssignSeat = null;
      this.utilityService.checkNumbers = null;
      this.utilityService.isReassignSeat = false;
/*       console.clear(); */
      this.utilityService.selectedSeat = null;
      this.utilityService._selectedSeatOrderUI = null;
      this.utilityService.screen = 'rso-main';
      this._router.navigate(['roomselection']);
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

	seatStyle(seatnumber) {
		this.renderSeats(seatnumber);
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
            case 2:case 3:
             this.utilityService.seatUrl = 'assets/img/Rchair-chair-serving-01.png';
             this.utilityService.tableShape = 'diamond';
            break;
            case 5:
          /*    this.seatUrl = "assets/img/Rchair-chair-serving-01.png";
             this.tableShape = 'square'; */
             this.utilityService.seatUrl = 'assets/img/Rchair-chair-serving-01.png';
             this.utilityService.tableShape = 'rectangle';
             break;
           case 6: case 7:
             this.utilityService.seatUrl = 'assets/img/Rchair-chair-serving-01.png';
             this.utilityService.tableShape = 'rectangle';
             break;
         /*   case 7:
             this.seatUrl = "assets/img/Rchair-chair-serving-01.png";
             this.tableShape = 'rectangle7'
             break; */
           case 8: case 4:
          /*    this.seatUrl = "assets/img/Rchair-chair-serving-01.png";
             this.tableShape = 'rectangle8' */
             this.utilityService.seatUrl = 'assets/img/Rchair-chair-serving-01.png';
             this.utilityService.tableShape = 'rectangle';
             break;
            default:
             this.utilityService.seatUrl = 'assets/img/Rchair-chair-serving-01.png';
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
            case 2:case 3:
             this.utilityService.seatUrl = 'assets/img/Rchair-normal-01.png';
             this.utilityService.tableShape = 'diamond';
            break;
            case 5:
          /*    this.seatUrl = "assets/img/Rchair-normal-01.png";
             this.tableShape = 'square' */
             this.utilityService.seatUrl = 'assets/img/Rchair-normal-01.png';
             this.utilityService.tableShape = 'rectangle';
             break;
           case 6: case 7:
             this.utilityService.seatUrl = 'assets/img/Rchair-normal-01.png';
             this.utilityService.tableShape = 'rectangle';
             break;
          /*  case 7:
             this.seatUrl = "assets/img/Rchair-normal-01.png";
             this.tableShape = 'rectangle7'
             break; */
           case 8: case 4:
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

  getSeatSelected(seatnumber) {
    //console.clear();
    this.utilityService.confirmSeatnum = "";
    console.log('seatnumber: ' + seatnumber);
    if (!this.utilityService.isReassignSeat) {
      this.utilityService.selectedSeat = seatnumber;
      this.utilityService.customerUrlPhoto = 'assets/profilepic/nophoto.png';
      this.checkIfAvailable(seatnumber);
      this.utilityService.successsAssignSeat = null;
    } else {
      if (document.getElementById('Seatnumber' + seatnumber).getAttribute('src').includes('serving')) {
          this.utilityService.canUploadPhoto = true;
          this.toastr.info('Seatnumber ' + seatnumber + ' is not available.',"Information", {timeOut: 2000});
      } else {
        if (this.utilityService.prevAssignSeat === seatnumber) {
          this.toastr.info('Cannot reassign seat in prev assign seat',"Information", {timeOut: 2000});
        } else {
          this.utilityService.menuDiv = false;
          this.utilityService.showButtonReAssignSeatAndRemoveSeat = false;
          this.utilityService.showButtonMoveToSeatAndRemoveSeat = true;
          this.utilityService.selectedSeat = seatnumber;
          this.resetSeat();
          if (this.utilityService.shape === 5) {
            this.utilityService.seatUrl = 'assets/img/Rchair-waiting-01.png';
          } else if (this.utilityService.shape !== 0 && this.utilityService.shape !== 1 ) {
            this.utilityService.seatUrl = 'assets/img/Rchair-waiting-01.png';
          } else {
            this.utilityService.seatUrl = 'assets/img/Rchair-waiting-01.png';
          }
          document.getElementById('Seatnumber' + seatnumber).setAttribute('src', this.utilityService.seatUrl);
        }
      }
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

checkIfAvailable(seatnumber) {
      if (document.getElementById('Seatnumber' + seatnumber).getAttribute('src').includes('serving')) {
          const _apiRoute = this.utilityService.getApiRoute('GetSeatDetailBySeatNo');
          // tslint:disable-next-line: max-line-length
          this.service.getSeatDetailBySeatNo(this.utilityService.localBaseAddress+ _apiRoute, this.utilityService.globalInstance.SelectedSaleId, seatnumber)
          .subscribe(data => {
            this.utilityService.globalInstance.SelectedCustomerDetail = JSON.parse(data['result']);
            console.log(this.utilityService.globalInstance.SelectedCustomerDetail);
          }, error => {
            this.toastr.error(error,"Error", {timeOut: 2000});
          }, () => {
            this.utilityService.globalInstance.SelectedCustomerId = this.utilityService.globalInstance.SelectedCustomerDetail.CustomerId;
            this.utilityService.showAddOrder = true;
            this.utilityService.showCustomerSearchDiv = false;
            if (this.utilityService.globalInstance.SelectedCustomerDetail.DietaryRestriction === '') {
              this.utilityService.globalInstance.SelectedCustomerDetail.DietaryRestriction = 'No dietary preferences';
            }
            this.loadMealPlanCustomerDetail(this.utilityService.globalInstance.SelectedSaleId);
            this.resetSeatWhenGreenIsClick();
            this.MealAndCustomerDetailDiv();
            this.utilityService.showChangeMealPlanButton = true;
            if (this.utilityService.globalInstance.SelectedCustomerDetail.ProfilePicture != null) {
              this.utilityService.customerUrlPhoto = this.utilityService.globalInstance.SelectedCustomerDetail.ProfilePicture;
            } else {
              this.utilityService.customerUrlPhoto = 'assets/profilepic/nophoto.png';
            }
          });
          this.closeKeyboard();
      } else {
        if (this.utilityService.prevSelectedSeat !== null) {
          if (this.utilityService.successsAssignSeat == null) {
            this.resetSeat();
          }
        }
        if (this.utilityService.shape === 5) {
          this.utilityService.seatUrl = 'assets/img/Rchair-waiting-01.png';
        } else if (this.utilityService.shape !== 0 && this.utilityService.shape !== 1 ) {
          this.utilityService.seatUrl = 'assets/img/Rchair-waiting-01.png';
        } else {
          this.utilityService.seatUrl = 'assets/img/Rchair-waiting-01.png';
        }
        document.getElementById('Seatnumber' + seatnumber).setAttribute('src', this.utilityService.seatUrl);
        this.utilityService.prevSelectedSeat = 'Seatnumber' + seatnumber;
        this.hideMealAndCustomerDetailDiv();
        this.utilityService.showCustomerSearchDiv = true;
        var focusElem = setTimeout(() => {
          var searchElement = (document.getElementById("SearchCustomerName") as HTMLInputElement);
            if (searchElement) {
                searchElement.focus();
                this.value = "";
                (document.getElementById("SearchCustomerName") as HTMLInputElement).value = "";
                this.keyboard.setInput("");
                clearTimeout(focusElem);
            }
        }, 1);
/*         this.toastr.success('You selected seatnumber ' + seatnumber); */
      }
  }

  MealAndCustomerDetailDiv() {
    this.utilityService.showCustomerDetail2 = true;
    this.utilityService.showButtonReAssignSeatAndRemoveSeat = true;
    this.utilityService.showMealDiv = true;
    this.utilityService.showCustomerDetail = false;
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
  loadMealPlanCustomerDetail(saleid) {
      this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = null;
      const _apiRoute = this.utilityService.getApiRoute('GetCustomerMealPlanDetailURL');
      this.service.getMealPlanCustomerDetail(this.utilityService.localBaseAddress + _apiRoute, saleid, this.utilityService.globalInstance.CurrentUser.EmpID)
      .subscribe(data => {
        this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = JSON.parse(data['result']);
      }, error => {
        this.toastr.error(error,"Error", {timeOut: 2000});
      }, () => {
        if (saleid != "00000000-0000-0000-0000-000000000000") {
          this.utilityService.grandtotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].GrandTotal;
          this.utilityService.discounttotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].DiscountTotal;
          this.utilityService.totalTax = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].TaxTotal;
          this.utilityService.subTotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SubTotal;
          this.utilityService._empName = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].EmpName;
          this.utilityService.globalInstance.SelectedSaleId = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SaleId;
        }
      });
  }

onClickAssignSeat(LayoutTableId, CustomerId, Mealplan, Seatnumber, CurrentUser) {
  this.showLoadingDialog();
  this.utilityService.loadingType = 'defaultLoading';
  const _apiRoute = this.utilityService.getApiRoute('PostAssignSeatURL');
  let IsOnline = this.utilityService.isServerOnline;
  this.assignSeat(LayoutTableId, CustomerId, Mealplan, Seatnumber, CurrentUser, 0, IsOnline,null, this.utilityService.localBaseAddress + _apiRoute);
  this.utilityService.showCustomerSearchDiv = false;
  this.utilityService.showButtonAssignSeat = false;
}

assignSeat(LayoutTableId, CustomerId, Mealplan, Seatnumber, CurrentUser, Checknumber,IsOnline, d: SaveSeat , ApiURL): void {
      let statusCode;
      let EmployeeName = this.utilityService.globalInstance.CurrentUser.LastName + ' ' + this.utilityService.globalInstance.CurrentUser.FirstName;
      alert(EmployeeName);
       const assignToSeat: SaveSeat = { LayoutTableId, CustomerId, Mealplan , Seatnumber, CurrentUser, Checknumber,EmployeeName,IsOnline} as SaveSeat;
      this.service.saveAssignSeat(assignToSeat, ApiURL)
      .subscribe(seat => {
        console.log(JSON.parse(seat['result']));
        statusCode = seat['status-code'];
        this.utilityService.responseAssignSeat = JSON.parse(seat['result']);
        console.log(this.utilityService.responseAssignSeat);
      }, error => {
        this.toastr.error('Error',error, {timeOut: 2000});
        this.dialogLoadingRef.close();
      }, () => {
        if(statusCode == 201){
          this.utilityService.serverIsDone = true;
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
        if(this.utilityService.confirmSeatnum!=""){
          this.getSeatSelected(this.utilityService.confirmSeatnum);
        }
          this.dialogLoadingRef.close();
        }
      });
}

assignSeatLocal(LayoutTableId, CustomerId, Mealplan, Seatnumber, CurrentUser, Checknumber,IsOnline, d: SaveSeatLocal , ApiURL ): void {

  let NextSaleID: any;
  let TicketNumber: any;
  if(this.utilityService.responseAssignSeat != undefined){
    Checknumber = this.utilityService.responseAssignSeat.CheckNumber;
     NextSaleID = this.utilityService.responseAssignSeat.NextSaleId;
     TicketNumber = this.utilityService.responseAssignSeat.TicketNumber;
  }

   const assignToSeat: SaveSeatLocal = { LayoutTableId, CustomerId, Mealplan , Seatnumber, CurrentUser, Checknumber,IsOnline,NextSaleID,TicketNumber} as SaveSeatLocal;
  this.service.saveAssignSeatLocal(assignToSeat, ApiURL)
  .subscribe(seat => {
  }, error => {
    this.toastr.error(error,"Local Device Error", {timeOut: 2000});
    this.dialogLoadingRef.close();
  }, () => {
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
  if(this.utilityService.confirmSeatnum!=""){
    this.getSeatSelected(this.utilityService.confirmSeatnum);
  }
    this.dialogLoadingRef.close();
  });
}

  _filter(value: string): ICustomer[] {
    const filterValue = value.toLowerCase();

/*     return this.utilityService.customerList.filter(option => option.FirstName.toLowerCase().includes(filterValue) ||
      option.LastName.toLowerCase().includes(filterValue) ||
      option.Name.toLocaleLowerCase().includes(filterValue)); */

      return this.utilityService.customerList.filter(option => 
        option.Name.toLowerCase().includes(filterValue));
  }

  updateTable(PrevTableId , NewTableId , Checknumber ) {
    try {
      const _apiRoute = this.utilityService.getApiRoute('ChangeTableURL');
      // tslint:disable-next-line: max-line-length
      this.service.changeTable(this.utilityService.localBaseAddress+ _apiRoute, this.utilityService.preSelectedRoom, PrevTableId, NewTableId, Checknumber)
      .subscribe(data => {
        this.utilityService.layoutTable = JSON.parse(data['result']);
      }, error => {
        alert(error);
      }, () => {
        this.utilityService.isChangeTable = false;
        this.toastr.success('Table successfully changed',"Success", {timeOut: 2000});
      });
    } catch (err) {
      alert('changeTable ' + err.message);
    }
  }

private reloadSelectedTable() {
    //console.clear();
    const _apiRoute = this.utilityService.getApiRoute('GetSelectedTableURL');
    // tslint:disable-next-line: max-line-length
    this.service.selectedTable(this.utilityService.localBaseAddress + _apiRoute, this.utilityService.globalInstance.SelectedLayoutTableId, this.utilityService.globalInstance.CurrentUser.EmpID)
    .subscribe(data => {
        this.utilityService.globalInstance.SelectedTableDetail = JSON.parse(data['result']);
        console.log('ika duwa');
        console.log(this.utilityService.globalInstance.SelectedTableDetail);
    }, error => {
      this.toastr.error(error,'Reload Table Error');
    }, () => {
      if (this.utilityService.globalInstance.SelectedSaleId == '00000000-0000-0000-0000-000000000000') {
        this.resetTable();
      } else {
        this.loadMealPlanCustomerDetail(this.utilityService.globalInstance.SelectedSaleId);
     /*    this.utilityService._posChecknumber = this.utilityService.globalInstance.SelectedTableDetail.Checknumber; */
        this.utilityService.globalInstance.SelectedSaleId = this.utilityService.selectedSaleID;
        this.utilityService.globalInstance.SelectedSaleId = this.utilityService.globalInstance.SelectedSaleId;
      }
      this.utilityService.showButtonAssignSeat = false;
    });
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
      case 3:
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

onClickAddSeat(LayoutTableId) {
  const _apiRoute = this.utilityService.getApiRoute('PostAddSeatURL');
  this.addseat(LayoutTableId, null, this.utilityService.localBaseAddress + _apiRoute);
}
onClickMoveSeat(LayoutTableId, customerid, previousSeat, seatnumber) {
  const _apiRoute = this.utilityService.getApiRoute('UpdateSeat');
  const CurrentUser = this.utilityService.globalInstance.CurrentUser.EmpID;
  // tslint:disable-next-line: max-line-length
  this.movetoSeat(LayoutTableId, customerid, previousSeat, seatnumber, this.utilityService.globalInstance.SelectedSaleId, CurrentUser, null, this.utilityService.localBaseAddress + _apiRoute);
}

movetoSeat(LayoutTableId, customerid, previousSeat, seatnumber, SaleId, CurrentUser, d: UpdateSeat, ApiURL): void {
  try {
    let IsOnline = this.utilityService.isServerOnline;
    const _updateSeat: UpdateSeat = { LayoutTableId, customerid, previousSeat, seatnumber, SaleId, CurrentUser ,IsOnline} as UpdateSeat;
    this.service.updateSeat(_updateSeat, ApiURL)
    .subscribe(updateSeat => {
      this.utilityService.updateSeat.push(updateSeat);
    }, error => {
       this.toastr.error(error,'Error on move Seat');
    }, () => {
      this.utilityService.globalInstance.SelectedTableDetail.TakenSeats = this.utilityService.globalInstance.SelectedTableDetail.TakenSeats.filter(e => e !== previousSeat);
      this.changeSeatToGreen(this.utilityService.selectedSeat);
      this.utilityService.isReassignSeat = false;
      this.utilityService.showButtonMoveToSeatAndRemoveSeat = false;
      this.utilityService.showChangeMealPlanButton = false;
      this.utilityService.showCustomerDetail2 = false;
      this.utilityService.showCustomerDetail = false;
      this.loadMealPlanCustomerDetail(SaleId);
    });
  } catch (err) {
    alert('move Seat ' + err.message);
  }
}

addseat(LayoutTableId, d: AddSeat, ApiURL): void {
  //console.clear();
  if(this.utilityService.addSeatProccessing == false) {
    if (this.utilityService.isServerOnline) {
      if (this.utilityService.globalInstance.SelectedTableDetail.SeatCount < 8 && this.utilityService.seatCount < 8) {
        this.utilityService.seatCount = this.utilityService.globalInstance.SelectedTableDetail.SeatCount + 1;
        let IsOnline = this.utilityService.isServerOnline;
        const _addSeat: AddSeat = {LayoutTableId,IsOnline} as AddSeat;
        this.utilityService.addSeatProccessing = true;
        console.log("utilityService.SeatCount: "+this.utilityService.seatCount+" globalInstance.SelectedTableDetail.SeatCount:"+this.utilityService.globalInstance.SelectedTableDetail.SeatCount)
        this.service.addSeat(_addSeat, ApiURL).subscribe(addseat => {
          this.utilityService.addSeat.push(addseat);
        }, error => {
          this.toastr.error(error,"Error", {timeOut: 2000});
        }, () => {
          this.utilityService.iterateSeat = [];
          this.loadSelectedTable();
        });
      } else {
        this.toastr.warning('Cannot add more than 8 seats',"Warning", {timeOut: 2000});
      }
    } else {
      this.toastr.warning('Cannot add seat while offline',"Warning", {timeOut: 2000});
    }
  } else {
    this.toastr.warning('Warning','Proccessing on adding seat', {timeOut : 2000});
  }
}

private loadSelectedTable() {
    //console.clear();
    this.utilityService.iterateSeat= [];
    this.utilityService.globalInstance.SelectedTableDetail = null;
    const _apiRoute = this.utilityService.getApiRoute('GetSelectedTableURL');
    // tslint:disable-next-line: max-line-length
    this.service.selectedTable(this.utilityService.localBaseAddress+ _apiRoute, this.utilityService.globalInstance.SelectedLayoutTableId, this.utilityService.globalInstance.CurrentUser.EmpID)
    .subscribe(data => {
        this.utilityService.globalInstance.SelectedTableDetail = JSON.parse(data['result']);
        console.log('check this ' +this.utilityService.globalInstance.SelectedTableDetail);
       console.log('oy');
    }, error => {
     this.toastr.error(error,"Error", {timeOut: 2000});
    }, () => {
      this.iterateSeatFunction(this.utilityService.globalInstance.SelectedTableDetail.SeatCount);
      this.utilityService.globalInstance.SelectedSaleId = this.utilityService.globalInstance.SelectedSaleId;
  /*     this.utilityService._posChecknumber = this.utilityService.globalInstance.SelectedTableDetail.Checknumber; */
      this.utilityService.globalInstance.SelectedTableName = this.utilityService.globalInstance.SelectedTableDetail.TableName;
      this.utilityService.globalInstance.SelectedLayoutTableId = this.utilityService.globalInstance.SelectedLayoutTableId;
      this.utilityService.selectedtable = this.utilityService.globalInstance.SelectedTableDetail.TableName;
      this.utilityService.seatCount = this.utilityService.globalInstance.SelectedTableDetail.SeatCount;
      this.utilityService.globalInstance.SelectedSaleId = this.utilityService.selectedSaleID ;
      this.utilityService._empName = this.utilityService.globalInstance.SelectedTableDetail.EmpName;
      
      // tslint:disable-next-line: max-line-length
      this.utilityService.selectedtableShape = this.getTableShape(this.utilityService.chosenTableShape, this.utilityService.globalInstance.SelectedTableDetail.Checknumber);
      this.utilityService.screen = 'selectedTable';
      this.loadMealPlanCustomerDetail(this.utilityService.globalInstance.SelectedSaleId);
      this.utilityService.addSeatProccessing = false;
  /*     this.renderSeats(this.globalInstance.SelectedTableDetail.SeatCount); */
      if (this.utilityService.globalInstance.SelectedSaleId != '00000000-0000-0000-0000-000000000000') {
        const _check = this.utilityService.globalInstance.SelectedSaleId.toString();
        localStorage.setItem('tableSelectedCheckNumber', _check);
      }
    });
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
    this.utilityService.shape = shape;
     return shape = this.utilityService.tableShapeUrl;
  }

  private iterateSeatFunction(seatCount) {
    let i = 1;
    while (i <= seatCount) {
      this.utilityService.iterateSeat.push(i);
      i++;
    }
  }

reassignSeat() {
        if (this.utilityService.seatCount === 1) {
          this.utilityService.showButtonReAssignSeatAndRemoveSeat = false;
        } else {
          this.utilityService.isReassignSeat = true;
          this.utilityService.prevAssignSeat = this.utilityService.selectedSeat;
           this.resetSeatByReassignSeat();
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
        this.toastr.error(error,"Error", {timeOut: 2000});
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
        this.utilityService.selectedSeat = null;
        this.utilityService._selectedSeatOrderUI = null;    	
        this.utilityService.chosenTableShape = null;
        this.utilityService.tableShape = null;
        this.clearSelectedItemIndexes();
        this._router.navigate(['roomselection']);
      });
        break;
        case 'ADD ORDER':
          if(Array.isArray(this.utilityService.globalInstance.SelectedTableDetail.TakenSeats) 
            && this.utilityService.globalInstance.SelectedTableDetail.TakenSeats.length){
            this.utilityService._menuDescription = [];
            this.utilityService._menuItems = [];
            this.utilityService.modArray = [];
            this.utilityService.subModifierViewModel = [];
            this.utilityService.saleItemDiscountList = [];
            this.utilityService.screen = 'orderingModule';
            this.utilityService.selectedSaleID = this.utilityService.globalInstance.SelectedSaleId;
         /*    if (this.utilityService.globalInstance.SelectedSaleId != '00000000-0000-0000-0000-000000000000') { */
              console.log('table ' + this.utilityService.globalInstance.SelectedTableName);
              console.log(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SeatNumber + ' | ' + this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].CustomerId)
              this._css_Selected_table_speedBar(this.utilityService.globalInstance.SelectedTableName);
             /*  if (defaultMenu) { */
                // tslint:disable-next-line: max-line-length
                this.getSelectedSeat_OrderUI(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SeatNumber, this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].CustomerId);
            /*   } */
           /*  } */
            this._router.navigate(['ordering']);
          }else{
            this.toastr.info('Add Seat/Customer First!',"Information", {timeOut: 2000});
          }
        break;
      default:
        break;
    }
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

/* menuItemGoTo(meal, buttonId, page, defaultMenu) {
    if (defaultMenu === true) {
      this.utilityService._buttonId = this.utilityService.defaultMenuButtonID;
      this.utilityService._menuName = this.utilityService.defaultMenu;
    } else {
      this.utilityService._buttonId = buttonId;
      this.utilityService._menuName = meal;
    }
    this.getMenuItems('3', this.utilityService._menuName, this.utilityService._buttonId, page);
    this._menu_status(this.utilityService._menuName);
} */

  getOpenChecks(empid, UIType) {
    //console.clear();
    // tslint:disable-next-line: max-line-length
    this.service.getOpenChecks(this.utilityService.localBaseAddress+ 'api/openCheck/v1/getOpenChecks/' + empid, this.utilityService.storeId)
    .subscribe(data => {
      this.utilityService.openChecks = JSON.parse(data['result']);
      console.log(this.utilityService.openChecks);
    }, error => {
        this.toastr.error(error,"Error", {timeOut: 2000});
    }, () => {
        if (UIType === 'PAT') {
          this.utilityService.screen = 'payAtTableCheckSelection';
        }
    });
  }

_menu_status(value) {
    let styles;
    if (value.toString().toLowerCase() === this.utilityService._menuName.toString().toLowerCase()) {
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

 getMenuItems(screenIndex, menu, buttonId, page) {
  const _apiRoute = this.utilityService.getApiRoute('GetMenuItems');
  // tslint:disable-next-line: max-line-length
  this.service.getMenuItems(this.utilityService.localBaseAddress + _apiRoute  + menu + '/' + buttonId)
  .subscribe(data => {
    this.utilityService._menuItemButton = JSON.parse(data['result']);
/*     this.utilityService._menuItems = this.utilityService._menuItemButton.Items; */
    this.utilityService._totalItemCount = this.utilityService._menuItemButton.Total;
    this.utilityService._totalPages = this.getTotalPages(this.utilityService._totalItemCount);
    this.utilityService.hasMenuItems = true;
  }, error => {
    this.toastr.error(error,"Error", {timeOut: 2000});
  }, () => {

    this.utilityService._menuName = menu;
/*     console.log(this.utilityService._itemName); */
    this._menuItem_status(this.utilityService._itemName);
 /*    console.log(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].MenuItemList); */
  });
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
  
  getTotalPages(totalItem): number {
    const _pages = Math.round(totalItem / 28);
    const _remainder = totalItem % 28;
    const _extraPage = _remainder === 0 ? 0 : 1;
    return _pages + _extraPage;
  }

getMenu() {
  const _apiRoute = this.utilityService.getApiRoute('GetMenu');
  this.service.getMenu(this.utilityService.localBaseAddress + _apiRoute , this.utilityService.storeId)
  .subscribe(data => {
    this.utilityService._menuDescription = JSON.parse(data['result']);
  }, error => {
      this.toastr.error(error,"Error", {timeOut: 2000});
  }, () => {
    this.getOpenChecks(this.utilityService.globalInstance.CurrentUser.EmpID, null);
  });
}

removeseat(customerid, seatnumber,  d: ISeatDetailBySeatNo): void {
      let _apiRoute = this.utilityService.getApiRoute('RemoveSeat');
      this.service.removeCustomerFromSeat(this.utilityService.localBaseAddress+ _apiRoute, this.utilityService.globalInstance.SelectedSaleId, customerid, seatnumber, this.utilityService.isServerOnline)
      .subscribe(data => {
        data;
      }, error => {
        this.toastr.error(error,"Remove seat Error", {timeOut: 2000});
      }, () => {
        this.reloadSelectedTable();
        this.utilityService.globalInstance.SelectedTableDetail.TakenSeats.splice(this.utilityService.globalInstance.SelectedTableDetail.TakenSeats.indexOf(seatnumber), 1);
        this.utilityService.showMealDiv = false;
        this.utilityService.showCustomerDetail2 = false;
        this.utilityService.showButtonReAssignSeatAndRemoveSeat = false;
     /*    this.toastr.success("Customer from Seat no " + seatnumber + " has been has successfully removed"); */
      });
  }

getbuttonActionPAT(action) {
    switch (action) {
      case 'PATCheckSelection':
        this.getGuestCheckDetail(this.utilityService.globalInstance.SelectedSaleId);
        this.utilityService.screen = 'payAtTableCheckSelection';
      break;
      default:
        break;
    }
  }

 getGuestCheckDetail(saleid) {
    //console.clear();
    const _apiRoute = this.utilityService.getApiRoute('GetGuestCheckDetail');
    this.service.getGuestCheckDetail(this.utilityService.localBaseAddress+ _apiRoute + saleid, this.utilityService.storeId)
    .subscribe(data => {
      this.utilityService.guestCheck = JSON.parse(data['result']);
      console.log(this.utilityService.guestCheck);
    }, error => {
      this.toastr.error(error,"Error", {timeOut: 2000});
    }, () => {
     /*    this.utilityService.patCheckNumber = this.utilityService.guestCheck[0].CheckNumber; */
        this.utilityService.patTableName = this.utilityService.guestCheck[0].TableName;
        this.utilityService.selectedSaleID = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SaleId;
        this.utilityService.totalTax = this.utilityService.guestCheck[0].SaleSummary.TotalTax;
        this.utilityService.grandtotal = this.utilityService.guestCheck[0].SaleSummary.Total;
        this.utilityService.discounttotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].DiscountTotal;
        this.utilityService._empName = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].EmpName;
    });
  }

  private getMealTypeFilters(){
    const _apiRoute = this.utilityService.getApiRoute('GetMealTypeFilters');
    this.service.getMealTypeFilters(this.utilityService.localBaseAddress + _apiRoute)
    .subscribe(data => {
      this.utilityService.mealTypeFilters = JSON.parse(data['result']);
      console.log("MEAL tYPES " +this.utilityService.mealTypeFilters);
    }, error => {
      this.toastr.error(error,"Error", {timeOut: 2000});
    }, () => {
      if(this.utilityService.mealTypeFilters == null) {
        this.utilityService.hasMealType = false;
      } else {
        this.utilityService.hasMealType = true;
      }
      alert("MAY MEAL TYPE Ba? " + this.utilityService.hasMealType );
    })
  }

private getSelectedCustomer() {
    try {
      if (this.utilityService.selectedSeat != null) {
        document.getElementById("container-keyboard").classList.add('hide');
        const SelectedValue = this.myControl.value.CustomerId;
        const _apiRoute = this.utilityService.getApiRoute('GetCustomerDetailURL');
        this.service.getCustomerDetail(this.utilityService.localBaseAddress+ _apiRoute, SelectedValue)
          .subscribe(cus => {
            this.utilityService.customerDetail = JSON.parse(cus['result']);
            console.log(this.utilityService.customerDetail);
            if(this.utilityService.hasMealType) {
              this.openDialog(SelectedValue, false);
            }            
            this.utilityService.globalInstance.SelectedCustomerId  = SelectedValue;
        }, error => {
          this.toastr.error(error,"Error", {timeOut: 2000});
        }, () => {      
            if (this.utilityService.customerDetail.DietaryRestriction === '') {
              this.utilityService.customerDetail.DietaryRestriction = 'No dietary preferences';
            }

            if(this.utilityService.customerDetail.ProfilePicture != null){
              this.utilityService.customerUrlPhoto = this.utilityService.customerDetail.ProfilePicture;
            }else{
              this.utilityService.customerUrlPhoto = 'assets/profilepic/nophoto.png';
            }

              this.utilityService.showCustomerSearchDiv = true;
              this.utilityService.showCustomerDetail =  true;
              this.utilityService.showButtonAssignSeat = true;
              this.utilityService.showChangeMealPlanButton = false;
              this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = [];
        
              if (this.utilityService.globalInstance.SelectedTableDetail.Checknumber != null) {
                this.loadMealPlanCustomerDetail(this.utilityService.globalInstance.SelectedSaleId);
              }
              this.utilityService.showMealDiv = true;
              this.utilityService.showButtonReAssignSeatAndRemoveSeat = false;
              this.utilityService.showButtonMoveToSeatAndRemoveSeat = false;
              this.utilityService.showChangeMealPlanButton = false;
              this.utilityService.canUploadPhoto = false;
              if(!this.utilityService.hasMealType) {
                let saveSeat : SaveSeat = {} as any;
                saveSeat.CurrentUser = this.utilityService.globalInstance.CurrentUser.EmpID;
                saveSeat.CustomerId = this.utilityService.globalInstance.SelectedCustomerId ;
                saveSeat.Mealplan = this.utilityService.selectedMealPlan;
                saveSeat.Seatnumber = this.utilityService.selectedSeat;
                saveSeat.LayoutTableId = this.utilityService.globalInstance.SelectedLayoutTableId;
                saveSeat.Checknumber = 0;
                console.log(saveSeat);
                this.assignToseat_(saveSeat);
              }
        });
       } else {

       }
    } catch (err) {
    }
  }

  private getSelectedCustomer2() {
    try {
      if (this.utilityService.selectedSeat != null) {

        // var DropdownList = (document.getElementById("SelectedCustomer")) as HTMLSelectElement;
        // var SelectedValue = DropdownList.value;
        const SelectedValue = this.myControl.value.CustomerId;
        const _apiRoute = this.utilityService.getApiRoute('GetCustomerDetailURL');
        this.service.getCustomerDetail(this.utilityService.localBaseAddress+ _apiRoute, SelectedValue)
          .subscribe(cus => {
            this.utilityService.customerDetail = JSON.parse(cus['result']);
            this.utilityService.globalInstance.SelectedCustomerId  = SelectedValue;
            console.log( this.utilityService.customerDetail);
        }, error => {
          this.toastr.error(error,"Error", {timeOut: 2000});
        }, () => {
            if (this.utilityService.customerDetail.DietaryRestriction === '') {
              this.utilityService.customerDetail.DietaryRestriction = 'No dietary preferences';
            }

            if (this.utilityService.customerDetail.ProfilePicture != null) {
              this.utilityService.customerUrlPhoto = this.utilityService.customerDetail.ProfilePicture;
            } else {
              this.utilityService.customerUrlPhoto = 'assets/profilepic/nophoto.png';
            }
        });
       } else {
/*          this.toastr.error('Please select a seat first'); */
       }
    } catch (err) {
   /*    alert('getSelectedCustomer ' + err.message); */
    }
  }


  mealTypeList() {
    this.service.getMealPlanList(this.utilityService.localBaseAddress)
    .subscribe(meal=> {
      var tempMealplanList : IMealType[] = JSON.parse(meal['result']);
      for(var x=0;x<tempMealplanList.length;x++){
        var contains = "GUEST";
        for(var y=0;y<tempMealplanList.length;y++){
          var samp = JSON.stringify(tempMealplanList[y]);
          if(samp.includes(contains)
            && !this.utilityService.mealTypeList.includes(tempMealplanList[y])
            && this.utilityService.mealTypeList.length % 2 != 0){
              console.log(tempMealplanList[y]);
              this.utilityService.mealTypeList.push(tempMealplanList[y]);
            break;
          }else if(!this.utilityService.mealTypeList.includes(tempMealplanList[y])
            && this.utilityService.mealTypeList.length % 2 == 0){
              console.log(tempMealplanList[y]);
              this.utilityService.mealTypeList.push(tempMealplanList[y]);
            break;
          }else if(!this.utilityService.mealTypeList.includes(tempMealplanList[y])
            && this.utilityService.mealTypeList.length >= 6){
              this.utilityService.mealTypeList.push(tempMealplanList[y]);
            break;
          }
        }
      }
      console.log("mealplanList");
      console.log(this.utilityService.mealTypeList);
    }); 
  }

  async updateMealPlan(CustomerId, SaleId, MealTypeDesc,SeatNumber) {
      //console.clear();
  /*     await this.sleep(1000); */
      const _apiRoute = this.utilityService.getApiRoute('GetUpdatedMealPlan');
      // tslint:disable-next-line: max-line-length
      this.service.getUpdatedMealPlan(this.utilityService.localBaseAddress + _apiRoute, SaleId, CustomerId, MealTypeDesc,SeatNumber, this.utilityService.globalInstance.CurrentUser.EmpID,this.utilityService.isServerOnline)
      .subscribe(data => {
        this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = JSON.parse(data['result']);
        console.log(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems);
      }
      , error => {
        this.toastr.error(error,"Error", {timeOut: 2000});
      }, () => {
        this.utilityService.showButtonReAssignSeatAndRemoveSeat = false;
        this.utilityService.showChangeMealPlanButton = false;
        this.utilityService.showButtonAssignSeat = false;
        this.loadMealPlanCustomerDetail(SaleId);
      });
  }

  openDialog(SelectedValue, updateMealPlan) {
    console.log("openDialog called!");
    const dialogRef = this.dialog.open(MealplanComponent);
    if (updateMealPlan) {
      const customerId = this.utilityService.globalInstance.SelectedCustomerDetail.CustomerId;
      const seatnumber = this.utilityService.selectedSeat;
      dialogRef.componentInstance.params = {
        disableClose: true,
        getmealplan: (meaplan) => {
          this.updateMealPlan(customerId, this.utilityService.globalInstance.SelectedSaleId, meaplan,seatnumber);
        }
      };
    } else {
      dialogRef.componentInstance.params = {
        disableClose: true,
        getmealplan: (meaplan) => {
          this.getSelectedMealPlan(meaplan);
        }
      };
    }
    this.getSelectedCustomer2();
  }

  getProfilePic(data) {
     this.uploadPhoto(this.utilityService.globalInstance.SelectedCustomerId , data, null);
  }

  uploadPhoto(CustomerId, Data, d: UploadPhoto): void {
    try {
      const uploadPhoto: UploadPhoto = {CustomerId, Data} as UploadPhoto;
      const _apiRoute = this.utilityService.getApiRoute('UploadPhoto');
      this.service.uploadPhoto(uploadPhoto, this.utilityService.localBaseAddress+ _apiRoute)
      .subscribe(upload => {
        this.utilityService.uploadPhoto_.push(upload);
      }, error => {
        alert(error);
      }, () => {
        this.getSeatSelected(this.utilityService.selectedSeat);
      });
    } catch (error) {
      alert('uploadPhoto ' + error.message);
    }
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
        this.loadMealPlanCustomerDetail(this.utilityService.globalInstance.SelectedSaleId);
      }
      this.utilityService.showMealDiv = true;
      this.utilityService.showButtonReAssignSeatAndRemoveSeat = false;
      this.utilityService.showButtonMoveToSeatAndRemoveSeat = false;
      this.utilityService.showChangeMealPlanButton = false;
      this.utilityService.canUploadPhoto = false;

      let saveSeat : SaveSeat = {} as any;
      saveSeat.CurrentUser = this.utilityService.globalInstance.CurrentUser.EmpID;
      saveSeat.CustomerId = this.utilityService.globalInstance.SelectedCustomerId ;
      saveSeat.Mealplan = this.utilityService.selectedMealPlan;
      saveSeat.Seatnumber = this.utilityService.selectedSeat;
      saveSeat.LayoutTableId = this.utilityService.globalInstance.SelectedLayoutTableId;
      saveSeat.Checknumber = 0;
      saveSeat.EmployeeName = this.utilityService.globalInstance.CurrentUser.LastName + ' ' + this.utilityService.globalInstance.CurrentUser.LastName;
      console.log(saveSeat);
      this.assignToseat_(saveSeat);

    } catch (err) {
      alert('getSelectedMealPlan ' + err.message);
    }
  }

  assignToseat_(saveSeat: SaveSeat) {
    const _apiRoute = this.utilityService.getApiRoute('PostAssignSeatURL');
    let IsOnline = this.utilityService.isServerOnline;
    this.assignSeat_(saveSeat, this.utilityService.localBaseAddress + _apiRoute);
    this.utilityService.showCustomerSearchDiv = false;
    this.utilityService.showButtonAssignSeat = false;
  }

  assignSeat_(saveSeat: SaveSeat , ApiURL): void {
    
    let statusCode;
    let EmployeeName = this.utilityService.globalInstance.CurrentUser.LastName + ' ' + this.utilityService.globalInstance.CurrentUser.FirstName;
    
    let LayoutTableId = saveSeat.LayoutTableId;
    let CustomerId = saveSeat.CustomerId;
    let Mealplan = saveSeat.Mealplan;
    let Seatnumber = saveSeat.Seatnumber;
    let CurrentUser = saveSeat.CurrentUser;
    let Checknumber = saveSeat.Checknumber;
    let IsOnline = saveSeat.IsOnline;
     const assignToSeat: SaveSeat = { LayoutTableId, CustomerId, Mealplan , Seatnumber, CurrentUser, Checknumber,EmployeeName,IsOnline} as SaveSeat;
    this.service.saveAssignSeat(assignToSeat, ApiURL)
    .subscribe(seat => {
      console.log(JSON.parse(seat['result']));
      statusCode = seat['status-code'];
   /*    this.utilityService.responseAssignSeat = JSON.parse(seat['result']); */
      this.utilityService.globalInstance.SelectedTableDetail = JSON.parse(seat['result']);
      console.log('TEST');
      console.log(this.utilityService.globalInstance.SelectedTableDetail);
      console.log(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems);
    }, error => {
      this.toastr.error('Error',error, {timeOut: 2000});
    }, () => {
      if(statusCode == 201){
        this.utilityService.globalInstance.SelectedSaleId = this.utilityService.globalInstance.SelectedTableDetail.SaleId;
        this.changeSeatToGreen(Seatnumber);
        this.utilityService.successsAssignSeat = Seatnumber;
        if (this.utilityService.globalInstance.SelectedSaleId == '00000000-0000-0000-0000-000000000000') {
          this.resetTable();
        } else {    
          this.utilityService.grandtotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].GrandTotal;
          this.utilityService.discounttotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].DiscountTotal;
          this.utilityService.totalTax = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].TaxTotal;
          this.utilityService.subTotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SubTotal;
          this.utilityService._empName = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].EmpName;
        }
        this.utilityService.showButtonAssignSeat = false;
        this.filteredOptions = this.myControl.valueChanges  
      .pipe(
        startWith<string | ICustomer>(''),
        map(value => typeof value === 'string' ? value : value.Name),
        map(name => name ? this._filter(name) : this.utilityService.customerList.slice())
      );
      this.utilityService.canUploadPhoto = true;
      if(this.utilityService.confirmSeatnum!=""){
        this.getSeatSelected(this.utilityService.confirmSeatnum);
      }
      }
    });
}

  openUploadPhoto(SelectedValue) {
    if(this.utilityService.canUploadPhoto) {
      const dialogRef = this.dialogUploadPhoto.open(UploadphotoComponent);
      dialogRef.componentInstance.params = {
        disableClose : true,
        getProfilePic: (data) => {
          this.getProfilePic(data);
        }
      };
    } else {
      this.toastr.warning('Cannot upload photo. Assign a seat first',"Warning", {timeOut: 2000});
    }
  }

  removeResident() {
    this.utilityService.selectedSeat = null;
    this.resetSeat();
    this.utilityService.showCustomerDetail = false;
    this.utilityService.showCustomerDetail2 = false;
    this.utilityService.showButtonAssignSeat = false;
    this.utilityService.showCustomerSearchDiv = false;
    this.toastr.warning('Please select a seat',"Warning", {timeOut: 2000});
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith<string | ICustomer>(''),
        map(value => typeof value === 'string' ? value : value.Name),
        map(name => name ? this._filter(name) : this.utilityService.customerList.slice())
      );
      document.getElementById("container-keyboard").classList.add('hide');
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
    const ApiURL = this.utilityService.localBaseAddress+ _apiRoute;

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

  closeKeyboard(){
    document.getElementById("container-keyboard").classList.add('hide');
  }

  showConfirmation(seatnum){

    var htmlInput = document.getElementById("SearchCustomerName") as HTMLInputElement;
    this.utilityService.confirmSeatnum = seatnum;
    if(htmlInput != undefined && htmlInput != null){
      var custName = (htmlInput).value;
      this.utilityService.confirmMessage = "Would you like to assign this "+custName+" to Seat #"+this.utilityService.selectedSeat;
      this.utilityService.okButtonOnly = false;
      if(this.utilityService.showButtonAssignSeat){
        const dialogRef = this.dialog.open(ConfirmationComponent, {panelClass: 'remove-special'});
        dialogRef.afterClosed().subscribe(
          data => {
            if(this.utilityService.confirmResult){
              var objDiv = document.getElementById('assign-to-seat');
              objDiv.click();
            }else{
              this.getSeatSelected(this.utilityService.confirmSeatnum);
            }
          }
        );
      }else{
        this.getSeatSelected(this.utilityService.confirmSeatnum);
      }
    }else{
      this.getSeatSelected(this.utilityService.confirmSeatnum);
    }
  }

  showLoadingDialog(){
    this.dialogLoadingRef = this.dialog.open(LoadingmodalComponent, {panelClass: 'remove-special'});
    this.dialogLoadingRef.afterClosed().subscribe(
      data => {
        
      }
    );
  }
}
