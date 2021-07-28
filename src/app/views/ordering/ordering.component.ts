import { HttpClient } from '@angular/common/http';
import {ViewportScroller} from '@angular/common';
import { Component, OnInit , Renderer2, ViewChild, ElementRef,AfterViewInit,ViewEncapsulation} from '@angular/core';
import { FormControl, FormBuilder, FormGroup, FormArray, ValidatorFn} from '@angular/forms';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrComponentlessModule, ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { CustomerLastOrder, ICustomer ,OrderItems} from '../../shared/customer';
import { ConfirmationComponent } from '../../views/confirmation/confirmation.component'
import { SiposService } from '../../shared/sipos.service';
import { CustomerModule } from '../../shared/customerModule'
import { Router} from '@angular/router';
import { UtilityService } from '../../services/utility.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MessageComponent } from '../message/message.component';
import { LoadingmodalComponent } from '../loadingmodal/loadingmodal.component';
import { InformationMessageComponent } from '../information-message/information-message.component';
import { DiscountComponent } from '../discount/discount.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Options } from 'ng5-slider';
import { MatSort } from '@angular/material/sort';
import { MatPaginator} from '@angular/material';

import {
  SubModifierViewModel,
  FireAll,
  FireSelected,
  Order,
  Modifiers,
  GuestCheckWindow,
  ItemModifierDetails,
  PostComment,
  CancelSale,LogOut,
  PrintCheck,
  IDeleteDiscount,
  CombineCheck,
  IVoidItem,
  IReopenCheck,
  IMoveItem,
  SettleMultiple,
  IEmployee,
  ISaleDiscount,
  IItemQty,
  ItemNameData,
  ApplyCoursingObj,
  CoursingMenuItem,
  IMoveItemCourse,
  IItemPrice,
  ISplitItem,
  IDelay,
  ReprintOrder,
  ReorderItem,
  AutoPayParams,
  OrderType,
  VoidCreditCard,
  saleManualForward,
  NoSale,
  addTip,
  SaveSeat,
  ResidenChargeSettleCheck,
  dictItem
} from '../../obj-interface';
import { error } from 'selenium-webdriver';
import { map, startWith } from 'rxjs/operators';
import Keyboard from "simple-keyboard";



@Component({
  selector: 'app-ordering',
  templateUrl: './ordering.component.html',
  styleUrls: [
    "../../../../node_modules/simple-keyboard/build/css/index.css",
    './ordering.component.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class OrderingComponent implements OnInit   {
  selectOneOnly = [];
  selectAtleastOne = [];
  keyboard: Keyboard;
  filteredOptions: Observable<ICustomer[]>;
  selectedFunctionIndex:number;
  myItemName = '';
  myItemID = '';
  myHtml = '<div ><i >basic initial HTML</i></div>';
  appendedHtml = '';
  form: FormGroup;
  myControl = new FormControl();

  animationState: string;
  setStatus = '';
  @ViewChild('div', {static: false}) div: ElementRef;
  longPressing = 0;
  isLongPressed = false;
  menuDescStatus = 'btn-menu-item-small';
  menuItemStatus = 'btn-menu-item-small';
  selectedSaleItemId = '';
  selectedItemId = '';
  selectedItemPrice = '';
  selectedMenuID = '';
  scrollPosition = 0;
  PINCH_ACTION = { IN: 'pinchin', OUT: 'pinchout' };
  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };
  pinchCalled = 0;
  dialogLoadingRef;
  x: number = 0;
  title = 'Drag Me!';
  startX: number = 0;
  y: number = 0;
  startY: number = 0;
  navigationEntries = [];
  menuItemsEntries = [];
  itemRows = {};
  buttonSettings = [];
  doneLoadingItems = false;
  itemArray = [];
  defaultItemColumn = 2;
  zoomButtons = false;
  clickNewMenu = false;
  startTime;
  endTime;
  subButtonView=[];
  overallDiscount: number = 0.00;
  reasonId:number;

  tempSaleId:string;
  saleIdForTransfer = "";
  isChecked = false;
  showNumberToBePrinter= false;
  control: FormControl = new FormControl(1);
  options: Options = {
    floor: 1,
    ceil: 20,
    step: 1,
    showTicks: true,
    showTicksValues: true
  };
  inputed_numeric='';
  reasonCompId:number;
  selectedMediaIndex:number;
  public modalRef: BsModalRef;

  adjustQtyClicked = false;
  varSelectedbuttonText = "";
  resetSelection = false;
  selectedCourseNo = 0;

  forTransferSaleitem = "";
  forTransferCustomerNumber = 0;
  forTransferSaleID = 0;
  lastIndexOpenChecks = "";
  changePriceStatus = false;
  timeStatus = "";
  inputed_date='';
  coursingMenuItems: CoursingMenuItem[];
  value = "";

  customerFirstName = '';
  customerLastName = '';
  customerAddress = '';
  customerAddress2 = '';
  customerPhone = '';
  customerNumber = '';
  customerBirthdate = '';
  customerEmail = '';
  customerCity = '';
  customerZip = '';
  customerLastOrder : CustomerLastOrder[];


  customerInfoSetIndex = 0;
  customerInfoOrderDate = '';
  customerInfoCheckNumber = '';
  customerOrderList : OrderItems[];
  customerSeat = '';

  customerDinerPlan = [];
  customerDinerStatus = [];

  @ViewChild('dialogTimePicker', { static: false }) dialogTimePicker: ModalDirective;
  @ViewChild('dialogDatePicker', { static: false }) dialogDatePicker: ModalDirective;
  @ViewChild('diaglogAutopaySale', { static: false }) diaglogAutopaySale: ModalDirective;
  @ViewChild('diaglogCancelSale', { static: false }) diaglogCancelSale: ModalDirective;
  @ViewChild('dialogNumericKeyPad', { static: false }) dialogNumericKeyPad: ModalDirective;
  @ViewChild('dialogNumericKeyPad2', { static: false }) dialogNumericKeyPad2: ModalDirective;
  @ViewChild('dialogNumericKeyPad3', { static: false }) dialogNumericKeyPad3: ModalDirective;
  @ViewChild('dialogNumericKeyPad4', { static: false }) dialogNumericKeyPad4: ModalDirective;
  @ViewChild('dialogAskForSupervisor', { static: false }) dialogAskForSupervisor: ModalDirective;
  @ViewChild('dialogNotAuthorized', { static: false }) dialogNotAuthorized: ModalDirective;
  @ViewChild('openResetAllModal', { static: false }) openResetAllModal: ModalDirective;
  @ViewChild('openResetModal', { static: false }) openResetModal: ModalDirective;
  @ViewChild('openReasonCompModal', { static: false }) openReasonCompModal: ModalDirective;
  @ViewChild('openReasonModal', { static: false }) openReasonModal: ModalDirective;
  @ViewChild('openChecksModal', { static: false }) openChecksModal: ModalDirective;
  @ViewChild('openClosedChecksModal', { static: false }) openClosedChecksModal: ModalDirective;
  @ViewChild('viewAnyCheck', { static: false }) viewAnyCheck: ModalDirective;
  @ViewChild('openChecksModalMoveItem', { static: false }) openChecksModalMoveItem: ModalDirective;
  @ViewChild('settleMultipleCheck', { static: false }) settleMultipleCheck: ModalDirective;
  @ViewChild('mediaTypeList', { static: false }) mediaTypeList: ModalDirective;
  @ViewChild('confirmationPrintReceipt', { static: false }) confirmationPrintReceipt: ModalDirective;
  @ViewChild('openEmployeeList', { static: false }) openEmployeeList: ModalDirective;
  @ViewChild('openSeatList', { static: false }) openSeatList: ModalDirective;
  @ViewChild('storedTransaction', { static: false }) storedTransaction: ModalDirective;
  @ViewChild('enterChargeTip', { static: false }) enterChargeTip: ModalDirective;
  @ViewChild('pinPadTipAmount', { static: false }) pinPadTipAmount: ModalDirective;
  @ViewChild('ccprocessingDialog', { static: false }) ccprocessingDialog: ModalDirective;
  
  @ViewChild('lookUpResident', { static: false }) lookUpResident: ModalDirective;
  @ViewChild('customerInfo', { static: false }) customerInfo: ModalDirective;
  
  @ViewChild('frequentDiner', { static: false }) frequentDiner: ModalDirective;
  @ViewChild('fastCashDialog', { static: false }) fastCashDialog: ModalDirective;
  @ViewChild('assignSeatConfirmation', { static: false }) assignSeatConfirmation: ModalDirective;
  displayedColumns: string[] = ['CheckNumber', 'StartDate', 'CardNumber', 'CreditCardType','TableName','Amount','TipAmount'];
  dataSource_CcTipList = new MatTableDataSource(null);

  @ViewChild(MatSort,{static:false}) sort: MatSort;
  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
  constructor(
    private vps: ViewportScroller,
    private renderer: Renderer2,
    private _router: Router,
    private service: SiposService,
    public utilityService: UtilityService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private customerModule : CustomerModule) {
      this.form = this.formBuilder.group({
     /*    globalInstance.SelectedTableDetail.GetSaleItems: new FormArray([]) */
     });
     this.utilityService._selectedSeatOrderUI = 0;

     this.buttonSettings = [
      {
        "SeparatorID":"1",
        "RowHeight":"100",
        "ColumnCount":"9",
        "Height":"120",
        "PanelType":"navigation",
        "SortMethod":"position",
        "SortBy":"asc"
      },
      {
        "SeparatorID":"2",
        "RowHeight":"70",
        "ColumnCount":"6",
        "Height":"10px",
        "PanelType":"menu",
        "SortMethod":"position",
        "SortBy":"asc"
      },
      {
        "SeparatorID":"3",
        "RowHeight":"100",
        "ColumnCount":"6",
        "Height":"400",
        "PanelType":"item",
        "SortMethod":"position",
        "SortBy":"asc"
      }
   ]; 
    }

    ngOnInit() {

    console.clear(); 
    this.utilityService.screen = 'orderingModule';
    this.utilityService._buttonId = this.utilityService.defaultMenuButtonID;
    this.utilityService._menuName = this.utilityService.defaultMenu;


    console.log("SelectedSeat: "+this.utilityService._selectedSeatOrderUI);
    this.getOpenChecks(this.utilityService.globalInstance.CurrentUser.EmpID, null);
    this.selectedButton(this.utilityService._menuName,9);

    this.utilityService.saleItemDiscountList = [];
   
    this.getCompReasonList();
    this.getCloseChecks(this.utilityService.globalInstance.CurrentUser.EmpID,null);
    this.getPaymentMedia();
    this.getEmployeeList();

    if(this.utilityService.globalInstance.SelectedTableDetail.SaleId != '00000000-0000-0000-0000-000000000000'){
      this.getCoursingItemsList();
    }



  /*   this.refreshStoredTransactions(); */

    if(this.utilityService.serviceTypeDesc == 'Senior Living') {
      this.loadAllDiscount();
      if (this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems !== []) {
        console.log("new orderType: "+this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].OrderType);
        this.utilityService.orderType = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].OrderType;  
      }else{
        this.utilityService.orderType = 'Dine In';
      }
    } else {
      this.keyboard = new Keyboard({
        onChange: input => this.onChange(input),
        onKeyPress: button => this.onKeyPress(button),
        theme: "hg-theme-default myTheme1"
      });
      this.pullcustomerList();
      console.log(this.utilityService.globalInstance);
      this.utilityService.globalInstance.SelectedTableName = this.utilityService.globalInstance.SelectedTableDetail.TableName;
      this.utilityService.globalInstance.SelectedSaleId = this.utilityService.globalInstance.SelectedTableDetail.SaleId;
      this._css_Selected_table_speedBar( this.utilityService.globalInstance.SelectedTableName ,this.utilityService.globalInstance.SelectedSaleId,this.utilityService.globalInstance.SelectedLayoutTableId,this.utilityService.globalInstance.SelectedCheckNumber);
      this.getCheckDetails(this.utilityService.globalInstance.SelectedSaleId,this.utilityService.globalInstance.SelectedTableName,this.utilityService.globalInstance.SelectedLayoutTableId,this.utilityService.globalInstance.SelectedCheckNumber);
    }
    console.log('Selected table id ' + this.utilityService.globalInstance.SelectedTableDetail.LayoutTableId);
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
  handleShift = () => {
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    this.keyboard.setOptions({
      layoutName: shiftToggle
    });
  };

  closeKeyboard(){
  /*   document.getElementById("container-keyboard").classList.add('hide'); */
    document.getElementById("container-keyboard").style.display = "none";
  }

  focusFunction(){
    var currentValue = (document.getElementById("SearchCustomerNameOrdering") as HTMLInputElement).value;
    this.value = currentValue;
    this.keyboard.setInput(currentValue);
    console.log("currentValue: "+currentValue);
    console.log("focus !");
    document.getElementById("container-keyboard").classList.remove('hide');
    document.getElementById("container-keyboard").style.display = "block";
    (document.getElementById("SearchCustomerNameOrdering") as HTMLInputElement).focus();
    (document.getElementById("SearchCustomerNameOrdering") as HTMLInputElement).click();
  }

  open(){

     (document.getElementById("SearchCustomerNameOrdering") as HTMLInputElement).click();  
    (document.getElementById("SearchCustomerNameOrdering") as HTMLInputElement).focus();  
    console.log("focusOnInput called!");
    this.onChange((document.getElementById("SearchCustomerNameOrdering") as HTMLInputElement).value);
    event.preventDefault();
  }

  focusOutFunction(){
    /*console.log("focus OUT");
    document.getElementById("container-keyboard").classList.add('hide');*/
  }

  onKeydown(event){
    var currentValue = (document.getElementById("SearchCustomerNameOrdering") as HTMLInputElement).value;
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(currentValue),
        map(value => this._filter(currentValue))
      );
    (document.getElementById("SearchCustomerNameOrdering") as HTMLInputElement).focus();
  }

  loadCustomer(){
    console.log(this.utilityService.customerList);
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith<string | ICustomer>(''),
      map(value => typeof value === 'string' ? value : value.Name),
      map(name => name ? this._filter(name) : this.utilityService.customerList.slice())
    );
  }

  _filter(value: string): ICustomer[] {
    const filterValue = value.toLowerCase();
      return this.utilityService.customerList.filter(option => option.Name.toLowerCase().includes(filterValue));
        /* option.Name.toLowerCase().startsWith(filterValue)); */
  }

  displayFn(user?: ICustomer): string | undefined {
    return user ? user.Name : undefined;
  }

  onInputChange = (event: any) => {
    this.keyboard.setInput(event.target.value);

    (document.getElementById("SearchCustomerNameOrdering") as HTMLInputElement).focus();  
  };

  getEmployeeList() {
    let message: string;
    let statusCode: number;
    const _apiRoute = this.utilityService.getApiRoute('EmployeeList');
    this.service.getEmployeeList(this.utilityService.localBaseAddress + _apiRoute)
    .subscribe(data => {
      console.log(data);
      message = data['message'];
      statusCode = data['status-code'];
      this.utilityService.employeeList = JSON.parse(data['result']);
    }, error => {
      console.log(error);
      
    }, () => {
      console.log("EmployeeList");
      console.log(this.utilityService.employeeList);
    });
  }

  setStyleAttribute(element: HTMLElement, attrs: { [key: string]: Object }) {
    if (attrs !== undefined) {
      Object.keys(attrs).forEach((key: string) => {
        // @ts-ignore
        element.style.setProperty(key, attrs[key]);
      });
    }
  }

  hideShowContent(seatNo, courseNo){
    /*let elem: HTMLElement = document.getElementById('seat_'+seatNo+'_course_'+courseNo);
    this.setStyleAttribute(elem, {'display':'none'});*/
    if(document.getElementById('seat_'+seatNo+'_course_'+courseNo).classList.contains('hideContentElem')){
      document.getElementById('seat_'+seatNo+'_course_'+courseNo).classList.remove('hideContentElem');
    }else{
      document.getElementById('seat_'+seatNo+'_course_'+courseNo).classList.add('hideContentElem');
    }
  }

  getCourseCount(SeatNumber,index){
    let ctr = 0;
    if(this.coursingMenuItems != null){
      for(var x = 0; x < Object.keys(this.coursingMenuItems).length; x++){
        var courseItemMenu = (this.coursingMenuItems[x]);
        if(courseItemMenu.SeatNo == SeatNumber && courseItemMenu.CourseNo == index){
          ctr = courseItemMenu.Total;
        }
        
      }
    }
    return ctr;
  }

  SaveTip(tipAmount){
    let data = this.utilityService.selectedCheckChargeTip;
    console.log(data);
    let message: string;
    let statusCode: number;
    const _apiRoute = this.utilityService.getApiRoute("AddTip");
    let _addTip = {
      tipAmount : tipAmount,
      transactionId : data.TransactionId,
      saleId: data.SaleId,
      empId : this.utilityService.globalInstance.CurrentUser.EmpID,
      completionTransactionId : data.CompletionTransactionId,
      ticketNumber : data.TicketNum
    } as addTip;
    console.log(_addTip);
    console.log(this.utilityService.localBaseAddress + _apiRoute);
    this.openCCprocessingDialog();
    this.service.AddTip(_addTip,this.utilityService.localBaseAddress + _apiRoute)
    .subscribe(data => {
      console.log(data)
      this.utilityService.closedChecks = JSON.parse(data["result"]);
     
      statusCode = data['status-code'];
      message = data['message'];
    },error => {
      this.toastr.error(error,'Error', {timeOut:3000})
      this.closeCCprocessingDialog();
    }, ()=> {
      if(statusCode == 200) {    
        this.closepinPadTipDialog();
        this.clearChargeTip();
        this.toastr.success('Tip is successfully added','Tip Added',{timeOut:3000})
        this.dataSource_CcTipList = new MatTableDataSource(this.utilityService.closedChecks.filter(x=>x.IsCreditCardTransaction == true));
        this.dataSource_CcTipList.sort = this.sort;
        this.dataSource_CcTipList.paginator = this.paginator;
      }
      this.closeCCprocessingDialog();
    }) 
  }

  getCoursingItemsList() {
    let message: string;
    let statusCode: number;
    const _apiRoute = this.utilityService.getApiRoute('GetSaleCourseItems');
    this.service.getSaleCourseItems(this.utilityService.localBaseAddress + _apiRoute, this.utilityService.globalInstance.SelectedSaleId)
    .subscribe(data => {
     /*  console.log(data); */
      this.utilityService.coursingItems = JSON.parse(data['result']);
    }, error => {
      console.log("-= coursingItems ERROR =-");
      console.log(error);
    }, () => {
      /*console.log("-= coursingItems =-");
      console.log(this.utilityService.coursingItems);*/
      this.coursingMenuItems = [];
      var applyCoursing = 0;

      for (var x = 0; x < Object.keys(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems).length; x++){
        var menu = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[x];
        // @ts-ignore
        if(menu.ApplyCoursing>0){
          // @ts-ignore
          applyCoursing = menu.ApplyCoursing;
        }
        for (var y = 0; y < Object.keys(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[x].GetMenuItems).length; y++){
          var saleItemId = (menu.GetMenuItems[y].SaleItemId);
          for(var z = 0; z < Object.keys(this.utilityService.coursingItems).length; z++){
            var courseItem = (this.utilityService.coursingItems[z]);
            var courseSaleItemId = courseItem.SaleItemID;
            console.log(courseItem);
            console.log("courseSaleItemId:"+courseSaleItemId+" == saleItemId:"+saleItemId);
            if(courseSaleItemId == saleItemId){
              var checkCoursing = false;
              var searchedIndex = 0;
              for(var a=0; a<Object.keys(this.coursingMenuItems).length;a++){
                var courseValue = (this.coursingMenuItems[a]);
                if(courseValue.SeatNo == menu.SeatNumber.toString()
                  && courseValue.CourseNo == courseItem.CourseNo){
                  checkCoursing = true;
                  searchedIndex = a;
                }
              }
              if(checkCoursing){
                this.coursingMenuItems[searchedIndex].Total = this.coursingMenuItems[searchedIndex].Total + 1;
              }else{
                this.coursingMenuItems.push({
                  SeatNo: menu.SeatNumber.toString(),
                  CourseNo: courseItem.CourseNo,
                  Total: 1
                });
              }
            }
          }
        }
      }
      if(Object.keys(this.utilityService.coursingItems).length == 0 && applyCoursing > 0){
        this.getCoursingItemsList();
      }
    });
  }

  getCompReasonList(){
    let message: string;
    let statusCode: number;
    const _apiRoute = this.utilityService.getApiRoute('GetReasonList');
    this.service.getReasonList(this.utilityService.localBaseAddress + _apiRoute)
    .subscribe(data => {
      console.log(data);
      message = data['message'];
      statusCode = data['status-code'];
      this.utilityService.compReasonList = JSON.parse(data['result']);
    }, error => {
      console.log(error);
      
    }, () => {
      if(Object.keys(this.utilityService.compReasonList).length > 0){
        this.reasonCompId = this.utilityService.compReasonList[0].ReasonIndex;
      }
    });
  }

  convertTextToWholeNumber(value){
    if(value != null){
      value = value.toString().replace(/[^0-9.-]+/g,"");
      value = value.slice(0, -2);
      return value+"%";
    }else{
      return "";
    }
  }
    
  getCloseChecks(empid, UIType) {
    // console.clear();
    // tslint:disable-next-line: max-line-length
    this.service.getClosedChecks(this.utilityService.localBaseAddress+ 'api/openCheck/v1/getClosedChecks/' + empid, this.utilityService.storeId)
    .subscribe(data => {
      this.utilityService.closedChecks = JSON.parse(data['result']);
      console.log(this.utilityService.closedChecks);
    }, error => {
        this.toastr.error(error,"Error", {timeOut: 2000});
    }, () => {
        if (UIType === 'PAT') {
          this.utilityService.screen = 'payAtTableCheckSelection';
        }
      
    });
  }

  getVoidReasonList(){
    let message: string;
    let statusCode: number;
    const _apiRoute = this.utilityService.getApiRoute('GetReasonList');
    this.service.getReasonList(this.utilityService.localBaseAddress + _apiRoute,3)
    .subscribe(data => {
      console.log(data);
      message = data['message'];
      statusCode = data['status-code'];
      this.utilityService.voidReasonList = JSON.parse(data['result']);
    }, error => {
      console.log(error);
      
    }, () => {

    });
  }

  loadAllDiscount(){
    for (var x = 0; x < Object.keys(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems).length; x++){
      var menu = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[x];
      for (var y = 0; y < Object.keys(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[x].GetMenuItems).length; y++){
        var saleItemId = (menu.GetMenuItems[y].SaleItemId);
        this.loadSaleItemDiscount(saleItemId);
      }
    }
  }

  durationInSeconds = 5;

  openSnackBar(information_message,className: string) {
    this.utilityService.informationMessage = information_message;
    this._snackBar.openFromComponent(InformationMessageComponent,{
      duration: 200000,
      verticalPosition: 'top',
      panelClass: [className]
    });
  }

  onPress(event: any){
    this.startTime = new Date();
    console.log("onPress Called!");
  }

  onPressUp(event: any){
    this.endTime = new Date();
    let timeDiff = this.endTime - this.startTime; //in ms
    // strip the ms
    timeDiff /= 1000;

    // get seconds 
    let seconds = Math.round(timeDiff);
    console.log(seconds + " seconds");
    if(seconds >= 2){
      if(!this.zoomButtons){
        this.zoomButtons = true;
      }else{
        this.zoomButtons = false;
      }
    }else{
      this.startTime = 0;
    }
  }

  onPressItemCheck(event: any){
    this.startTime = new Date();
    console.log("onPress Called!");
  }

  onPressUpItemCheck(event: any, CustomerId, SaleId, courseNo){
    this.endTime = new Date();
    let timeDiff = this.endTime - this.startTime; //in ms
    // strip the ms
    timeDiff /= 1000;

    // get seconds 
    let seconds = Math.round(timeDiff);
    console.log(seconds + " seconds");
    if(seconds >= 2){

      this.forTransferCustomerNumber = CustomerId;
      this.forTransferSaleID = SaleId;
      this.selectedCourseNo = courseNo;

      this.toastr.info('Please wait, Transferring Items.','Information', {timeOut: 2000})
      
      //this.forTransferSaleitem = SaleItemId;
      this.transferItemsToOtherCheckCourseItems();

    }else{
      this.startTime = 0;
      this.forTransferSaleitem = "";
      this.forTransferCustomerNumber = 0;
      this.forTransferSaleID = 0;
    }
  }

  smallerButton(){
    if(this.defaultItemColumn > 2){
      this.defaultItemColumn = this.defaultItemColumn - 2;
    }
    this.clickNewMenu = false;
  }

  largerButton(){
    if(this.defaultItemColumn < 12){
      this.defaultItemColumn = this.defaultItemColumn + 2;
    }
    this.clickNewMenu = false;
  }

  _class_menu_item(itemID){
    let colspan;
    let classname;
/*     console.log("defaultItem: "+this.defaultItemColumn); */
    if(this.defaultItemColumn == 0){
      this.defaultItemColumn = this.buttonSettings[2].ColumnCount;
      colspan = this.defaultItemColumn;
    }else{
      let div = document.getElementById(itemID);
      if(div != null && div != undefined){
        let itemwidth = div.getAttribute('itemwidth');
        let splitted = itemwidth.split("-", 3);
        colspan = Number(splitted[2]);

        if((colspan != this.defaultItemColumn && this.zoomButtons) || this.clickNewMenu){
          colspan = this.defaultItemColumn;
        }

        var newVal = splitted[0] + "-" + splitted[1] + "-" + colspan;
        div.setAttribute('itemwidth', newVal);
      }else{
        colspan = this.defaultItemColumn;
      }
    }
    classname = "col-sm-"+colspan;
    return classname;
  }

  getNavigationButtons() {
    const _apiRoute = this.utilityService.getApiRoute('GetNavigationButtons');

    this.service.getNavigation(this.utilityService.localBaseAddress + _apiRoute)
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

  functionButtonExecute(jsonVal, value){
    let message: string;
    let statusCode: number;
    console.log('EXECUTE');
    console.log(jsonVal)
    const _apiRoute = this.utilityService.getApiRoute('GetNavigationButtonFunction');
    this.service.getNavigationFunction(this.utilityService.localBaseAddress + _apiRoute, jsonVal)
    .subscribe(data => {
      console.log(data);
      message = data['message'];
      statusCode = data['status-code'];
      if(value == "MODIFY"){
        this.utilityService.saleItemModifiers = JSON.parse(data['result']).MenuItems;
      }else if(value == "DELETE ITEM"){
        this.utilityService.openMod = JSON.parse(data['result']);
      }
    }, error => {
      console.log(error);
      if(value == "MODIFY"){
        this.toastr.info('Fetching saleItemModifiers Data!',"Information", {timeOut: 2000});
      }else{
        this.toastr.error(error,"Error", {timeOut: 2000});
      }
    }, () => {
      switch(value){
        case "LOG OUT":
          this.logOut();
          break;
        case "START TABLE":
          this.getbuttonActionRSO('BACK TO FLOOR PLANS', null, null, null, null, null, null, false);
          break;
        case "DELETE ITEM":
          //this.deleteItem();
          
          if(statusCode == 200) {
            console.log('delete item ' + this.utilityService.openMod)
            if(this.utilityService.openMod.OpenMod) {
              this.getItemName(this.utilityService.openMod.ItemName,this.utilityService.openMod.ParentItemID,'$0.00',-1,-1,2,false);
            } else {
              console.log("called deleteItem() selectedSaleItemId= " + this.selectedSaleItemId);
              this.getCheckDetails(this.utilityService.globalInstance.SelectedSaleId, this.utilityService.globalInstance.SelectedTableName,this.utilityService.globalInstance.SelectedLayoutTableId,this.utilityService.globalInstance.SelectedCheckNumber );
              this.toastr.success('menu item removed',"Success", {timeOut: 2000});
              this.clearSelectedItemIndexes();
            }
          } else {
            this.toastr.error(statusCode+"","Error", {timeOut: 2000});
          }

          var myVar = setInterval(() => {
            var objDiv = document.getElementById('newCourse');
            if (objDiv != undefined && objDiv != null) {
              var mainDiv = document.getElementById('GuestCheckDiv');
              console.log(" AFTER DELETE mainDiv scrollTop: "+this.scrollPosition);
              mainDiv.scrollTop = this.scrollPosition;
              clearInterval(myVar);
            }
          }, 1);
          break;
        case "MODIFY":
          if(statusCode == 202) {
            this.toastr.info(message);
          } else {
            console.log("selected ItemID: "+this.selectedSaleItemId);
            this.longPressing = null;
            this.isLongPressed = !this.isLongPressed;
            console.log('longpress start!');
            if (this.selectedSaleItemId != '') {
              this.utilityService.screen = 'itemModifier';
        
              this.utilityService.itemMod = {
                SaleId: this.utilityService.globalInstance.SelectedSaleId,
                CurrentUser: this.utilityService.globalInstance.CurrentUser.EmpID,
                SelectedSaleItemID: this.selectedSaleItemId,
                ItemID: [],
                ModifierGroupItem: []
              } as ItemModifierDetails;
              console.log(this.utilityService.itemMod);
            }
          }
          break;
        case "FIRE SELECTED":
          const SaleId = this.utilityService.globalInstance.SelectedSaleId;
          const ItemIndexes = localStorage.getItem('SelectedItemIndex');
          if (message === 'Success') {
            this.getCheckDetails(this.utilityService.globalInstance.SelectedSaleId, this.utilityService.globalInstance.SelectedTableName,this.utilityService.globalInstance.SelectedLayoutTableId,this.utilityService.globalInstance.SelectedCheckNumber );
            this.toastr.success('order sent to kitchen',"Success", {timeOut: 2000});
           this.clearSelectedItemIndexes();
          } else if (message === 'No orders to be print') {
            this.toastr.warning(message,"Warning", {timeOut: 2000});
          } else if (message === 'The item/s selected has no defined remote printers.') {
            this.toastr.info(message,'Information', {timeOut: 3000});
          } 
          else if (statusCode == 500) {
            this.toastr.info('Cannot send order while offline','Information', {timeOut: 3000});
          } else {
            this.toastr.warning(message,"Warning", {timeOut: 2000});
          }
          break;
        case "FIRE ALL":
          //this.fireAll(this.utilityService._posChecknumber);
          if (message === 'Success') {
            this.utilityService.fireAllList.push(this.utilityService.globalInstance.SelectedSaleId.toString());
            this.getCheckDetails(this.utilityService.globalInstance.SelectedSaleId, this.utilityService.globalInstance.SelectedTableName,this.utilityService.globalInstance.SelectedLayoutTableId,this.utilityService.globalInstance.SelectedCheckNumber );
            this.toastr.success('order sent to kitchen',"Success", {timeOut: 2000});
            this.clearSelectedItemIndexes();
          } else if (message === 'Already Sent') {''
            this.toastr.warning(message,"Warning", {timeOut: 2000});
          }
            else if (message === 'No orders to be print') {
            this.toastr.warning(message,"Warning", {timeOut: 2000});
          } else if (statusCode == 500) {
            this.toastr.info('Cannot send order while offline','Information', {timeOut: 3000});
          } else if (message === 'The item/s selected has no defined remote printers.') {
            this.toastr.info(message,'Information', {timeOut: 3000});
          }
          else {
            this.toastr.warning(message,"Warning", {timeOut: 2000});
          }
          break;
        case "LOOK UP RESIDENT":
          
          break;
        case "MESSAGE TO KITCHEN":
          
          break;
        case "PAY CHECK":
          this.getbuttonActionPAT('PATCheckSelected');
          break;
        case "SETTLE CHECK":
          this.getbuttonActionPAT('PATCheckSelected');
          break;
        case "NEW ORDER": 
          break;  
        case "FAST CASH": 
          this.fastCash();
          break;  
        default:        
          break;
      }
    });
  }

  functionCall(funcVal){
    switch(funcVal){
      case "LOG OUT":
        const jsonLogout = "{EmpID:"+this.utilityService.globalInstance.CurrentUser.EmpID+",Function:1}";
        this.functionButtonExecute(jsonLogout, funcVal);
        break;
        case "BACK":
          this.utilityService.takenSeatsArray = null;
          this.utilityService._seats = null;
          this.utilityService.iterateSeat = [];
          this.utilityService.prevSelectedSeat = null;
          this.utilityService.successsAssignSeat = null;
          this.utilityService.checkNumbers = null;
          this.utilityService.isReassignSeat = false;
          this.utilityService.selectedSeat = null;
          this.utilityService._selectedSeatOrderUI = null;
          this.clearSelectedItemIndexes();
          this.getbuttonActionRSO('Table Selected', this.utilityService.globalInstance.SelectedTableName,this.utilityService.chosenTableShape,this.utilityService.globalInstance.SelectedTableDetail.SeatCount,
          this.utilityService.globalInstance.SelectedLayoutTableId,this.utilityService.takenSeatsArray, this.utilityService.globalInstance.SelectedSaleId,true);
          break;
      case "START TABLE":
        const jsonStart = "{Function:2}";
        this.functionButtonExecute(jsonStart, funcVal);
        break;
      case "NEW ORDER" :
        this.newOrder();
        break;  
      case "ADD SEAT" :
          this.addNextSeat();
          break; 
      case "DELETE ITEM":
        //this.deleteItem();
        if(this.utilityService.isServerOnline) {
          var mainDiv = document.getElementById('GuestCheckDiv');
          this.scrollPosition = mainDiv.scrollTop;//mainDiv.scrollHeight;
          var tempDataMeal: GuestCheckWindow[] = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems;
          const ss = localStorage.getItem('SelectedItemIndexDeletable');
          let status: any;
          if (ss === 'null') {
              this.toastr.warning('Cannot delete seat number',"Warning", {timeOut: 2000});
          } else {
            const deleteItem = '{"SaleId":"'+this.utilityService.globalInstance.SelectedSaleId+'","ItemIndex":"'+ss+'","IsOnline":"'+this.utilityService.isServerOnline+'","Function":3}';
            console.log(deleteItem);
            this.functionButtonExecute(deleteItem, funcVal);
          }
         } else {
            this.toastr.info('Cannot delete item while offline.','Information', {timeOut: 3000})
         }
        break;
      case "MODIFY":
        if(this.selectedSaleItemId == "" || this.selectedSaleItemId.length == 0) {
          this.toastr.info('Please select item to add modifier');
        } else {          
          const jsonModify = '{"SelectedSaleItemId":"'+this.selectedSaleItemId+'", "Function":4}';
          this.functionButtonExecute(jsonModify, funcVal);
        }
        break;
      case "FIRE SELECTED":
        //this.fireSelected();
        const _selectedItemIndexes = localStorage.getItem('SelectedItemIndex');
        if (_selectedItemIndexes === 'null') {
          this.toastr.warning('Please select item',"Warning", {timeOut: 2000});
        } else {
          const jsonFireSelected = '{"SaleId":"'+this.utilityService.globalInstance.SelectedSaleId+'","ItemIndexes":"'+_selectedItemIndexes+'","Function":5}';
          this.functionButtonExecute(jsonFireSelected, funcVal);
        }
        break;
      case "FIRE ALL":
      /*   this.utilityService.fireAllList.push(this.utilityService._posChecknumber.toString()); */
        const jsonSend = '{"SaleId":"'+this.utilityService.globalInstance.SelectedSaleId+'","Function":6}';
        this.functionButtonExecute(jsonSend, funcVal);
        break;
      case "LOOK UP RESIDENT":
        
        break;
      case "MESSAGE TO KITCHEN":
        this.showMessage();
        break;
      case "PAY CHECK":
        const jsonPay = "{Function:8}";
        this.functionButtonExecute(jsonPay, funcVal);
        break;
      case "FAST CASH":
        const jsonPay1 = "{Function:8}";
        this.functionButtonExecute(jsonPay1, funcVal);
        break;
      case "SETTLE CHECK":
          const jsonPay_check = "{Function:8}";
          this.functionButtonExecute(jsonPay_check, funcVal);
          break; 
      default:
        
        break;
    }
  }

  _class_nav(value){
    let className = "";
    switch(value){
      case "LOG OUT":
        className = "btn-function btn-logoff btn3d borderRadius5 font-weight-bold";
        break;
      case "BACK":
        className = "btn-function btn-primary btn3d borderRadius5 font-weight-bold";
        break;
      case "START TABLE":
        className = "btn-function btn-start-table btn3d borderRadius5 font-weight-bold";
        break;
      case "DELETE ITEM":
        className = "btn-function btn-violet btn3d borderRadius5 font-weight-bold";
        break;
      case "MODIFY":
        className = "btn-function btn-primary btn3d borderRadius5 font-weight-bold";
        break;
      case "FIRE SELECTED":
        className = "btn-function btn-primary btn3d borderRadius5 font-weight-bold";
        break;
      case "SEND ORDER":
        className = "btn-function btn-primary btn3d borderRadius5 font-weight-bold";
        break;
      case "LOOK UP RESIDENT":
        className = "btn-function btn-primary btn3d borderRadius5 font-weight-bold";
        break;
      case "MESSAGE TO KITCHEN":
        className = "btn-function btn-orange btn3d borderRadius5 font-weight-bold";
        break;
      case "PAY CHECK":
        className = "btn-function btn-orange btn3d borderRadius5 font-weight-bold";
        break;
      case "disable" :
        className = "btn-function btn-gray btn3d borderRadius5 font-weight-bold";
        break;
      default:
        className = "btn-function btn-primary btn3d borderRadius5 font-weight-bold";
        break;
    }
    if(value.length > 13 && this.buttonSettings[0]['ColumnCount'] > 6){
      className = className + " long-text";
    }
    return className;
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
    this._router.navigate(['login']);
    localStorage.clear();
    // console.clear();
    // no function yet , just a switch to sign on screen
    this.utilityService.loadingType = 'loggingOut';
    this.showLoadingDialog();
    const _apiRoute = this.utilityService.getApiRoute('LogOut');
    const EmpID = this.utilityService.globalInstance.CurrentUser.EmpID;
    const _logOut :LogOut = { EmpID } as LogOut;
    this.service.logOut(_logOut,this.utilityService.localBaseAddress + _apiRoute)
    .subscribe(data => {

    }, error =>{
      this.toastr.error(error, 'Error' , {timeOut: 1000});
    }, ()=>{
     
      
    });
    this.dialogLoadingRef.close();
  }

  showLoadingDialog(){
    this.dialogLoadingRef = this.dialog.open(LoadingmodalComponent, {panelClass: 'remove-special'});
    this.dialogLoadingRef.afterClosed().subscribe(
      data => {
        
      }
    );
  }

  getFunction(value) {
    if ((value.toLowerCase().includes("course"))) {
      return true;
    } else {
      return false;
    }
  }

  showDialogNotAuthorized(){
    this.dialogNotAuthorized.show();
  }


  hideDialogNotAuthorized(){
    this.dialogNotAuthorized.hide();
  }
  showDialogAskForSupervisor(){
    this.dialogAskForSupervisor.show();
  }
  hideDialogAskForSupervisor(){
    this.utilityService.supervisorconvertedpin = '';
    this.utilityService.supervisorpin = '';
    this.dialogAskForSupervisor.hide();
  }

  showNumericKeyPad(){
    this.dialogNumericKeyPad.show();
  }
  hideNumericKeyPad(){
    this.inputed_numeric = '';
    this.dialogNumericKeyPad.hide();
  }

  showNumericKeyPad2(){
    this.dialogNumericKeyPad2.show();
  }
  hideNumericKeyPad2(){
    this.inputed_numeric = '';
    this.dialogNumericKeyPad2.hide();
  }

  showNumericKeyPad3(){
    this.dialogNumericKeyPad3.show();
  }
  hideNumericKeyPad3(){
    this.inputed_numeric = '';
    this.dialogNumericKeyPad3.hide();
  }

  showNumericKeyPad4(){
    this.dialogNumericKeyPad4.show();
  }
  hideNumericKeyPad4(){
    this.inputed_numeric = '';
    this.dialogNumericKeyPad4.hide();
  }

  showTimePicker(){
    this.dialogTimePicker.show();
  }
  hideTimePicker(){
    this.inputed_numeric = '';
    this.dialogTimePicker.hide();
  }

  showDatePicker(){
    this.dialogDatePicker.show();
  }
  hideDatePicker(){
    this.inputed_numeric = '';
    this.dialogDatePicker.hide();
  }

  executeFunctionButton(comment,isCommentBtn = false) {
   /*  if(this.utilityService.syncProccessing == false){ */
     /*  const PosCheckNumber = this.utilityService._posChecknumber; */
      const SaleId = this.utilityService.globalInstance.SelectedSaleId;
      const SelectedSeat = this.utilityService._selectedSeatOrderUI.toString().replace('Seat ', '');
      const Comment = comment.trim();
      /*var ParentItemId = this.selectedItemId;
      var PrecedingSaleItemId = this.selectedSaleItemId;*/

      var ParentItemId = this.itemArray.slice(0,1).shift();
      var PrecedingSaleItemId = this.utilityService.saleItemArray.slice(0,1).shift();

      if(isCommentBtn){
        PrecedingSaleItemId = "";
        var mainDiv = document.getElementById('GuestCheckDiv');
        this.scrollPosition = mainDiv.scrollTop;
      }

      let IsOnline = this.utilityService.isServerOnline;
      const _comment : PostComment = {SaleId, SelectedSeat, Comment, PrecedingSaleItemId, ParentItemId,IsOnline} as PostComment;
      console.log("-= _comment =-");
      console.log(_comment);
      const _apiRoute = this.utilityService.getApiRoute('PostComment');
      this.service.postComment(_comment, this.utilityService.localBaseAddress + _apiRoute)
      .subscribe(data => {

      }, error => {
        this.toastr.error(error,"Error", {timeOut: 2000});
      }, () => {
        this.reloadGuestCheckWindow(SaleId, this.utilityService.globalInstance.SelectedTableName);

        
        this.selectedMenuID = 'newCourse';
        var myVar = setInterval(() => {
          var objDiv = document.getElementById(this.selectedMenuID);
          if (this.selectedMenuID !== '' && objDiv != undefined && objDiv != null) {
            console.log(objDiv);
            this.countMenuRows();

            var mainDiv = document.getElementById('GuestCheckDiv');
            console.log(" AFTER add message mainDiv scrollTop: "+this.scrollPosition);
            mainDiv.scrollTop = this.scrollPosition;
            clearInterval(myVar);
          }
        }, 1);
      });
  }

  appendItemName() {

    // tslint:disable-next-line: max-line-length
    return '<div class="row line" ><label class="label_guestCheckWindow">' + this.myItemName + '</label></div>';
  }


  buttonTypeSelectedMod(value, itemName, maxSelect, minSelect, UseMaxSelect, UseMinSelect, modDesc, modIndex, modName) {
    console.log('modArray ' + this.utilityService.modArray);
    if (this.utilityService.modArray.includes(value)) {
      console.log('delete ito')
      let updated2 = [];
      let updated = [];
      let updated3 = [];
      let updated4 = [];
      for (let el of this.utilityService.modArray) {
        if (el !== value) {
          updated.push(el);
        }
      }

      for (let el of this.utilityService.subModifierViewModel) {
        if (el.ItemID !== value) {
          updated3.push(el);
        }
      }

       for (let el of this.utilityService.selectedmodNameArray) {
        if (el !== modName) {
          updated2.push(el);
        }
      } 

      for (let el of this.utilityService.listItemMod) {
        if (el !== itemName) {
          updated4.push(el);
        }
      }
      this.utilityService.selectedmodNameArray = updated2; 
      this.utilityService.modArray = updated;
      this.utilityService.subModifierViewModel = updated3;
      this.utilityService.listItemMod = updated4;
      console.log(this.utilityService.selectedmodNameArray);
      document.getElementById(itemName).style.backgroundColor = '#ffffff';
    } else {
      console.log('insert ito')
      this.utilityService.modArray.push(value);
      modDesc = 'ButtonType';
      let _modDesc: string;
      const mod: SubModifierViewModel = {} as any;
      mod.ItemID = value;
      mod.ModifierDesc = modDesc;
      mod.ModifierIndex = modIndex;
      mod.ItemModifierID = value;
      mod.ItemName = itemName;
      const index = [];
     
  /*     console.log(this.utilityService.subModifierViewModel); */
      let result = false;
        if (maxSelect === 1 && minSelect === 1 && UseMaxSelect === true &&  UseMinSelect === true) {
          for (let i = 0; i < this.utilityService.subModifierViewModel.length; i++) {
            if ( this.utilityService.subModifierViewModel[i]['ModifierDesc'].includes(modDesc)) {
                  document.getElementById(this.utilityService.subModifierViewModel[i]['ItemName']).style.backgroundColor = '#ffffff';
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
            this.utilityService.selectedmodNameArray.push(modName);
            document.getElementById(itemName).style.backgroundColor = '#ADD8E6';
          }
        }
         if (!this.utilityService.listItemMod.includes(itemName)) {
          this.utilityService.listItemMod.push(itemName);
          document.getElementById(itemName).style.backgroundColor = '#ADD8E6';
          console.log('added ' + itemName);
          this.utilityService.subModifierViewModel.push(mod);
          this.utilityService.selectedmodNameArray.push(modName);
        }
        console.log(this.utilityService.selectedmodNameArray);   
    }
  }

  arrayRemove(arr, value) {
    return arr.filter(function(ele){
        return ele.ItemID != value;
    });
 }

 cancelSale() {
   if(this.utilityService.isServerOnline) {
    /* this.showConfirmation(); */
      this.showDialogCancelSale();
   } else {
     this.toastr.info('Cannot cancel sale while offline','Information',{timeOut: 3000});
   }
 }
 executeCancelSale(){
  const _apiRoute = this.utilityService.getApiRoute('CancelSale');
  const SaleId = this.utilityService.globalInstance.SelectedSaleId;
  const IsOnline = this.utilityService.isServerOnline;
  const _cancelSale : CancelSale = { SaleId,IsOnline  } as CancelSale;
  this.service.cancelSale(_cancelSale, this.utilityService.localBaseAddress + _apiRoute)
    .subscribe(data => {
    console.log(JSON.parse(data['result']))
  }, error => {
    this.toastr.error(error,"Error", {timeOut: 2000});
  }, ()=> {
    this.getOpenChecks(this.utilityService.globalInstance.CurrentUser.EmpID, null);
    this.toastr.success('Guest check ' + this.utilityService.globalInstance.SelectedCheckNumber + ' cancelled.',"Succcess", {timeOut: 2000});
    this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = [];
    this.utilityService.globalInstance.SelectedTableName = null;
    if(this.utilityService.serviceTypeDesc == 'Quick Service'){
      this.hideDialogCancelSale();
    }
    else {
      this.getbuttonActionRSO('BACK TO FLOOR PLANS',null,null,null,null,null,null,null);
    }
  });
 }

 goToRoomSelection(){
    console.log('go back to room selection screen');
    this.utilityService.takenSeatsArray = null;
    this.utilityService.screen = 'rso-main';
    this.utilityService.iterateSeat = [];
    this.clearSelectedItemIndexes();
    this._router.navigate(['roomselection']);
 }

  selectedMod(value, itemName, maxSelect, minSelect, UseMaxSelect, UseMinSelect, ItemID, modDesc, modIndex, modName,itemModifiers) {
    this.utilityService.itemModv4 = itemModifiers;
    console.log(itemModifiers);
    console.log(maxSelect + '|' + minSelect + '|' + UseMaxSelect + '|' + UseMinSelect);

    let itemMods = this.utilityService.dicItemViewModel.sort( this.compare );

    let existing = itemMods.find((e) => e.ItemID == value);

    if(existing){
      console.log('deleting ' + existing.ItemName)
      let index = itemMods.findIndex((e) => e.ItemHeaderName == modName);
      this.utilityService.dicItemViewModel.sort( this.compare ).splice(index,1);
      document.getElementById(value).style.backgroundColor = '#ffffff';
    } else {
      console.log('adding ' + itemName)

      const _dicItem : dictItem = {} as any;
        _dicItem.ItemHeaderName = modName;
        _dicItem.MaxSelect = maxSelect;
        _dicItem.ItemID = value;
        _dicItem.ModifierDesc = modDesc;
        _dicItem.ModifierIndex = modIndex;
        _dicItem.ItemModifierID = value;
        _dicItem.ItemName = itemName;
        _dicItem.MinSelect = minSelect;
        _dicItem.UseMaxSelect = UseMaxSelect;
        _dicItem.UseMinSelect = UseMinSelect;
        this.utilityService.dicItemViewModel.push(_dicItem);
        document.getElementById(value).style.backgroundColor = '#ADD8E6';
    }
  }
 
  cancelButtonMultiColumn() {
    this.utilityService.modArray = [];
    this.utilityService.subModifierViewModel = [];
    this.utilityService.listItemMod = [];
    this.utilityService.selectedmodNameArray = [];
    this.getbuttonActionRSO('ADD ORDER', null, null, null, null, null, null, false);
    this.loadMealPlanCustomerDetail(this.utilityService.globalInstance.SelectedSaleId, this.utilityService._selectedSeatOrderUI);
    this.getCoursingItemsList();
  }
  compare( a, b ) {
    if ( a.ItemHeaderName < b.ItemHeaderName ){
      return -1;
    }
    if ( a.ItemHeaderName > b.ItemHeaderName ){
      return 1;
    }
    return 0;
  }


  saveAddedModifiers() {
        let selectedAllModName = [];
        let itemMods = this.utilityService.dicItemViewModel.sort( this.compare )
        console.log(itemMods);

        let counter = 1;
        let header = '';
        itemMods.forEach((e => {
          if(header == '') {
            header = e.ItemHeaderName;
            counter = 1;
          }
          else if(header == e.ItemHeaderName){
            counter++;
          } else {
            header = e.ItemHeaderName;
            counter = 1;
          }
          if((e.MaxSelect < counter) && (e.UseMaxSelect == true) && (e.UseMinSelect == true)){
            selectedAllModName.push(true);
            this.toastr.warning('Please select at least ' + e.MinSelect + " but no more than " + e.MaxSelect + " on  "+e.ItemHeaderName ,'Warning',{timeOut:3000})
          } else {
            selectedAllModName.push(false);
          }
        }));

        let hasIssue = selectedAllModName.includes(true);

        if (!hasIssue) {
          const ItemID = this.utilityService.modArray;
          const SaleId = this.utilityService.globalInstance.SelectedSaleId;
          const SelectedSeat = this.utilityService._selectedSeatOrderUI;
          const SelectedMod = this.utilityService.subModifierViewModel;
          const EmpID = this.utilityService.globalInstance.CurrentUser.EmpID;
          const DicItem = this.utilityService.dicItemViewModel;
          const ParentItemID = '';
          let IsOnline = this.utilityService.isServerOnline;
          let CourseNo = this.selectedCourseNo;
          const _addModifiers: Modifiers = { ParentItemID, ItemID, SaleId, SelectedSeat, SelectedMod, EmpID ,IsOnline, CourseNo , DicItem} as Modifiers;
          this.service.addModifiers(_addModifiers, this.utilityService.localBaseAddress + 'api/v1/saleitem/AddModifiers')
            .subscribe(data => {
        
            }, error => {
              this.toastr.error(error,"Error", {timeOut: 2000});
              this.utilityService.isproccessing = false;
            }, () => {
              this.utilityService.modArray = [];
              this.utilityService.subModifierViewModel = [];
              this.utilityService.listItemMod = [];
              this.utilityService.selectedmodNameArray = [];
              this.utilityService.dicItemViewModel = [];
              this.getbuttonActionRSO('ADD ORDER', null, null, null, null, null, null, false);
              this.loadMealPlanCustomerDetail(this.utilityService.globalInstance.SelectedSaleId, SelectedSeat);
            });
        }
        this.utilityService.isproccessing = false;
      }


  fireSelected() {
    if(this.utilityService.isServerOnline) {
      let message: string;
    const _selectedItemIndexes = localStorage.getItem('SelectedItemIndex');
    if (_selectedItemIndexes === 'null') {
      this.toastr.warning('Please select item',"Warning", {timeOut: 2000});
    } else {
      const _apiRoute = this.utilityService.getApiRoute('FireSelected');
      const SaleId = this.utilityService.globalInstance.SelectedSaleId;
      const ItemIndexes = _selectedItemIndexes;
      const _fireSelected: FireSelected = {SaleId , ItemIndexes} as FireSelected;
      this.service.fireSelected(_fireSelected, this.utilityService.localBaseAddress + _apiRoute)
      .subscribe(data => {
        console.log(JSON.parse(data['result']));
        message = data['message'];
      }, error => {
        this.toastr.error(error,"Error", {timeOut: 2000});
      }, () => {
        if (message === 'Success') {
          this.getCheckDetails(this.utilityService.globalInstance.SelectedSaleId, this.utilityService.globalInstance.SelectedTableName,this.utilityService.globalInstance.SelectedLayoutTableId,this.utilityService.globalInstance.SelectedCheckNumber );
          this.toastr.success('order sent to kitchen',"Success", {timeOut: 2000});
         this.clearSelectedItemIndexes();
        } else if (message === 'No orders to be print') {
          this.toastr.warning(message,"Warning", {timeOut: 2000});
        } else {
          this.toastr.warning(message,"Warning", {timeOut: 2000});
        }
      });
    }
    } else {
      this.toastr.info('Cannot send order while offline','Information', {timeOut: 3000});
    }
  }

  fireAll(SaleId) {
    if(this.utilityService.isServerOnline) {
      const _fireall: FireAll = { SaleId } as FireAll;
      let message: string;
      const _apiRoute = this.utilityService.getApiRoute('FireAll');
      this.service.fireAll(_fireall, this.utilityService.localBaseAddress + _apiRoute).subscribe(data => {
        console.log('dddd' + data['message']);
        message = data['message'];
      }, error => {
        this.toastr.error(error,"Error", {timeOut: 2000});
      }, () => {
        if (message === 'Success') {
          this.getCheckDetails(this.utilityService.globalInstance.SelectedSaleId, this.utilityService.globalInstance.SelectedTableName,this.utilityService.globalInstance.SelectedLayoutTableId,this.utilityService.globalInstance.SelectedCheckNumber );
          this.toastr.success('order sent to kitchen',"Success", {timeOut: 2000});
          this.clearSelectedItemIndexes();
        } else if (message === 'No orders to be print') {
          this.toastr.warning(message,"Warning", {timeOut: 2000});
        } else {
          this.toastr.warning(message,"Warning", {timeOut: 2000});
        }
      });
    } else {
      this.toastr.info('Cannot send order while offline','Information', {timeOut: 3000});
    }
  }

  getbuttonActionPAT(action) {
    switch (action) {
      case 'PATCheckSelected':
        this.getGuestCheckDetailPassParams(this.utilityService.globalInstance.SelectedSaleId);
        break;
      default:
        break;
    }
  }

  returnTotalOrderedMeal() {
    let total = 0;
    if (this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems != null) {
      this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems.forEach(function (meal) {
        // @ts-ignore
       /*  total = total + 3 + meal.GetMenuItems.length; */
      });
      if (total > this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems.length) {
        // console.log("returnTotalOrderedMeal = "+total);
        return total;
      } else {
        return 0;
      }
    } else {
      return total;
    }
  }

  returnTotalOpenChecks() {
    // @ts-ignore
    if (this.utilityService.openChecks != null) { return this.utilityService.openChecks.length; }
    else { return 0; }
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
    this.itemArray = [];
    localStorage.setItem('SelectedItemIndexDeletable',null);
    this.utilityService.itemsDeletable = [];
  }

  getMenu() {
    const _apiRoute = this.utilityService.getApiRoute('GetMenu');
    this.service.getMenu(this.utilityService.localBaseAddress + _apiRoute , this.utilityService.storeId)
    .subscribe(data => {
      this.utilityService._menuDescription = JSON.parse(data['result']);
    }, error => {
        this.toastr.error(error,"Error", {timeOut: 2000});
    }, () => {
      console.log('-= _menuDescription =-')
      console.log(this.utilityService._menuDescription);
      this.getOpenChecks(this.utilityService.globalInstance.CurrentUser.EmpID, null);
      this.getCloseChecks(this.utilityService.globalInstance.CurrentUser.EmpID,null);
      if(!this.doneLoadingItems){
        this.doneLoadingItems = true;
        this.itemRows = {};
        let firstMenu = true;
        for (const menuItem of this.utilityService._menuDescription) {
            this.itemRows[menuItem.MenuButtonID] = {
                                                    "menuItemButton":[],
                                                    "totalItemCount":0,
                                                    "hasMenuItems":false
                                                  };
          if(firstMenu){
            this.utilityService.defaultMenu = menuItem.MenuDescription;
            this.utilityService.defaultMenuButtonID = menuItem.MenuButtonID;
            this.utilityService._menuName = this.utilityService.defaultMenu;
            firstMenu = false; 
          }
        }       
        this.loadMenuItems();
      }    
    });
  }

getOpenChecks(empid, UIType) {
/*      console.clear(); */
    // tslint:disable-next-line: max-line-length
    this.service.getOpenChecks(this.utilityService.localBaseAddress+ 'api/openCheck/v1/getOpenChecks/' + empid, this.utilityService.storeId)
    .subscribe(data => {
      this.utilityService.openChecks = JSON.parse(data['result']);
      console.log('open ');
      console.log(this.utilityService.openChecks);
    }, error => {
        this.toastr.error(error,"Error1234", {timeOut: 2000});
    }, () => {
        if (UIType === 'PAT') {
          this.utilityService.screen = 'payAtTableCheckSelection';
        }
    });
  }

  getOpenChecksByManager(UIType) {
    // console.clear();
    // tslint:disable-next-line: max-line-length
    this.service.getOpenChecks(this.utilityService.localBaseAddress+ 'api/openCheck/v1/getOpenChecksByManager', this.utilityService.storeId)
    .subscribe(data => {
      this.utilityService.openChecks = [];
      this.utilityService.openChecks = JSON.parse(data['result']);
      console.log('Manager ');
      console.log(this.utilityService.openChecks);
    }, error => {
        this.toastr.error(error,"Error", {timeOut: 2000});
    }, () => {
        if (UIType === 'PAT') {
          this.utilityService.screen = 'payAtTableCheckSelection';
        }
      
    });
  }

  countMenuRows(){
    var getSeatNumber = this.utilityService._selectedSeatOrderUI.toString().replace('Seat ', '') + "";
    var tempSeat = getSeatNumber.substring(0, 4);
    var selectedSeat = '';
    var checker = false;
    var total = 50;

    console.log("Current Seat Number: "+getSeatNumber);

    if (tempSeat.trim() == "Seat"){
      selectedSeat = getSeatNumber;
    }else{
      selectedSeat = "Seat " + getSeatNumber;
    }

    for (var x = 0; x < Object.keys(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems).length; x++){

      var menu = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[x];

      if (selectedSeat.trim() == this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[x].SeatNumber.trim()){
        checker = true;
      }else{
        if (checker){
          if (selectedSeat.trim() != this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[x].SeatNumber.trim() 
            && this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[x].SeatNumber.trim() != ""){
            break;
          }
          
        }
      }

      total = total + 200;
      for (var y = 0; y < Object.keys(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[x].GetMenuItems).length; y++){
        var itemName = (menu.GetMenuItems[y].MenuItemName);
        if (itemName.length > 9){
          total = total + 60;
        }else{
          total = total + 40;
        }
        console.log("itemName: " + itemName + " total: " + total);
      }

      console.log("seat:" + ("Seat " + selectedSeat) + " == " + this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[x].SeatNumber.trim() + " checker:" + checker + " total:" + total);
      
      
    }

    var mainDiv = document.getElementById('GuestCheckDiv');
    console.log('Total:' + total + ' = ' + (total - 400) + " scrollHeight:" + (mainDiv.scrollHeight) + ' = ' + (mainDiv.scrollHeight - 400)); 
    if (total > 0){
      //total = total * 35;
      
      if (total > (mainDiv.scrollHeight - 400)){
        total = mainDiv.scrollHeight;
      }else{
        total = (total - 500);
      }
      
      if (total < 0) total = 0;
      
      mainDiv.scrollTop = total;
      console.log("current mainDiv scrolltop: " + total + " height: " + mainDiv.scrollHeight);
    }
    this.getCoursingItemsList();
  }

  openClosedChecks(){
    this.getCloseChecks(this.utilityService.globalInstance.CurrentUser.EmpID,null);
    this.openClosedChecksModal.show();
  }
  closeClosedChecks(){
  
    if(this.utilityService.selectedItemOnClosedCheck.length > 0){
      document.getElementById('ClosedCheckID-' + this.utilityService.selectedItemOnClosedCheck).removeAttribute('class');
      this.utilityService.selectedItemOnClosedCheck='';
    } 
    this.openClosedChecksModal.hide();
  }

    
selectedItemOnClosedCheck(selectedCheck,checknumber,isCreditCardTrans){
  if(this.utilityService.selectedItemOnClosedCheck.length > 0){
    document.getElementById('ClosedCheckID-' + this.utilityService.selectedItemOnClosedCheck).removeAttribute('class');
    this.utilityService.selectedItemOnClosedCheck='';
  } 
  document.getElementById('ClosedCheckID-' + selectedCheck).className = 'highLightItem';
  this.utilityService.selectedItemOnClosedCheck = selectedCheck;
  this.utilityService.selectedItemOnClosedCheckMsg = 'CHECK NUMBER : ' + checknumber;
/*   this.tempCheckNumber = checknumber; */
  this.tempSaleId = selectedCheck
  this.utilityService.isCreditCardTrans = isCreditCardTrans;
}


selectedCheckChargeTip(closedCheck){
  this.utilityService.selectedCheckChargeTipChecknum = closedCheck.CheckNumber;
  this.utilityService.selectedCheckChargeTip = closedCheck;
  console.log(this.utilityService.selectedCheckChargeTip);
  this.openpinPadTipDialog();
}

dynamicFontColor(element) {
  let style;
  if(element.IsUpdated) {
    if(element.CheckNumber == this.utilityService.selectedCheckChargeTipChecknum ) {
      style = this.greenFontHighlighted();
    } else {
      style = this.greenFontUnHighlighted();
    }
  } else {
    if(element.CheckNumber == this.utilityService.selectedCheckChargeTipChecknum ) {
      style = this.redFontHighlighted();
    } else {
      style = this.redFontUnhighligted();
    }
    /* if(element.TipAmount == '$0.00') {
      if(element.CheckNumber == this.utilityService.selectedCheckChargeTipChecknum ) {
        style = this.redFontHighlighted();
      } else {
        style = this.redFontUnhighligted();
      }
    } else {
      if(element.CheckNumber == this.utilityService.selectedCheckChargeTipChecknum ) {
        style = this.greenFontHighlighted();
      } else {
        style = this.greenFontUnHighlighted();
      }
    } */
  }
  return style;
}

redFontHighlighted(){
  let style;
  style = {
    'color' : '#8b0000',
    'background-color' : '#FAFAD2',
    'font-weight':'bold'
  }
  return style;
}

redFontUnhighligted(){
  let style;
  style = {
    'color' : '#8b0000',
  }
  return style;
}

greenFontHighlighted(){
  let style;
  style = {
    'color' : '#005800',
    'background-color' : '#FAFAD2',
    'font-weight':'bold'
  }
  return style;
}

greenFontUnHighlighted(){
  let style;
  style = {
    'color' : '#005800'
  }
  return style;
}



  reOpenClosedCheck(){
    if(this.tempSaleId == undefined){
      this.toastr.warning('No selected sale','Warning',{timeOut:3000})
    } else {
      console.log('sulod sa reOpenClosedCheck');
      const _apiRoute = this.utilityService.getApiRoute('ReopenClosedCheck');
      const _closedCheckParam: IReopenCheck = { SaleId:this.tempSaleId , EmpId : this.utilityService.globalInstance.CurrentUser.EmpID} as IReopenCheck;
      console.log("-= _closedCheckParam =-");
      console.log(_closedCheckParam);
      let message: string;
      this.service.reopenCheck(_closedCheckParam, this.utilityService.localBaseAddress + _apiRoute).subscribe(data => {
        console.log('reopen closed check .... ' + data['message']);
        message = data['message'];
        this.utilityService.closedChecks = JSON.parse(data['result']);
      }, error => {
        this.toastr.error(error,"Error", {timeOut: 2000});
      }, () => {
        this.toastr.success("Check successfully retrieve!","Success", {timeOut: 2000});
        this.getOpenChecks(this.utilityService.globalInstance.CurrentUser.EmpID,null);
        this.utilityService.selectedItemOnClosedCheck = '';
        this.utilityService.selectedItemOnClosedCheckMsg = '';
        console.log('ddddd ' + this.utilityService.selectedItemOnClosedCheck);
      });
      this.closeClosedChecks();
    }
  }

  

  getFunctionButton(functionIndex,text){
    this.toastr.clear();
    this.selectedFunctionIndex = functionIndex;
    switch(functionIndex){
     case 13 :
       this.openChecksModel();
       break;
     case 15:
        this.unsplitItem();
        break;
     case 39:
       this.printOrder();
       break;
     case 16:
       this.applyDiscount();
       break;
     case 28:
        this.openEmployeeListModal();
        break;
     case 53:
        this.openSeatListModal();
        break;
     case 63:
       this.openReasonModel();
       break;
     case 69:
        this.openClosedChecks();
        break;
    case 78:
        if(text.trim() == "Adjust Item Quantity"){
            this.adjustQtyClicked = true;
        }else{
            this.openResetModel();
        }
        break;
     case 10:
       this.cancelSale();
       break;
    case 98:
        this.openCheckModelMoveItem();
        break;
     case 147:
       this.removeAllDiscount();
        break; 
     case 43:
       this.openViewAnyCheck();
       break;  
     case 49 :
        this.openSettleMultipleCheckModal();
         break;
     case 99:
        window.close();
         break; 
     case 500:
          this.openReasonCompModel();
          break;
     case 501:
          this.showNumericKeyPad2();
          break; 
     case 502:
        this.changePriceStatus = true;
        this.toastr.info('Please Select Item to Change Default Price','Information',{timeOut:3000});
        break; 
        case 503: 
        /*this.timeStatus = 'fired';
        this.addDelay();*/
        break;
      case 504: 
        this.timeStatus = 'time';
        this.showTimePicker();
        break;
      case 505:
        this.timeStatus = 'minutes';
        this.showNumericKeyPad4();
        break;
      case 506:
        this.timeStatus = 'date';
        this.showDatePicker();
        break;
      case 507:
          if(this.utilityService.saleItemArray.length > 0){
            this.reorderItems(0);
          }else{
            this.toastr.info("Please select atleast 1 ordered item.");
          }          
          break;
      case 508:
        this.showDialogAutoPay();
        break;
      case 509:
          this.specifyOrderType('delivery');
          break;
      case 510:
          this.specifyOrderType('pick up');
          break;
      case 511:
          this.specifyOrderType('dine in');
          break;
      case 1000 :
          this.openCashDrawer();
          break;    
      case 1001:
          this.openEnterChargeTip();
          break;
      case 1002:
          this.show_restoredTransactionsList();
          break;
      case 1004:
          this.openlookUpResident();
          break;
     default:
       this.toastr.warning(text + 'function is in progress','Information',{timeOut:3000})
       break;
   }
 }

 openCashDrawer(){
  let message:any;
  let status:any; 
  let isOpen : boolean;
  const _apiRoute = this.utilityService.getApiRoute('ButtonFunction');
  var nosale = { FunctionIndex :  1000} as NoSale;
  this.service.openCashDrawer(nosale,this.utilityService.localBaseAddress + _apiRoute).subscribe(data => {
    isOpen = JSON.parse(data["result"]);
    message = data["message"];
    status = data["status-code"]
  },error=> {
    this.toastr.error('Error',error, {timeOut:3000})
  },()=> {
    if(status == 201) {
      this.toastr.success('Success', message);
    } else {
      this.toastr.info('Information', message);
    }
  })
 }

 getStoredTransactions(){
  let message:any;
  let status:any; 
  const _apiRoute = this.utilityService.getApiRoute('StoredTransaction');
  this.service.getStoredTransactions(this.utilityService.localBaseAddress + _apiRoute)
  .subscribe(data => {
    this.utilityService.storedTransactions = JSON.parse(data["result"]);
    message = data["message"];
    status = data["status-code"]
  },error=>{
    this.toastr.error("Error",error, {timeOut :3000});
  },()=>{
    if(status == 200) {
      this.show_restoredTransactionsList();
    } else {
      this.toastr.error("Error","Else", {timeOut :3000});
    }
  })
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
   /*  this.toastr.error("Error",error, {timeOut :3000}); */
  },()=>{
    if(status == 200) {

    } /* else {
      this.toastr.error("Error","Else", {timeOut :3000});
    } */
  })
 }

 deleteStoredTransaction(requestId) {
  let message:any;
  let status:any; 
  const _apiRoute = this.utilityService.getApiRoute('DeleteStoredTransaction');
  this.service.deleteStoredTransaction(this.utilityService.localBaseAddress + _apiRoute  + requestId)
  .subscribe(data => {
    this.utilityService.storedTransactions = JSON.parse(data["result"]);
    message = data["message"];
    status = data["status-code"]
  },error=>{
    this.toastr.error("Error",error, {timeOut :3000});
  },()=>{
    if(status == 200) {

    } else {
      this.toastr.error("Error","Else", {timeOut :3000});
    }
  })
 }


 specifyOrderType(type){
  if(!this.utilityService.fireAllList.includes(this.utilityService.globalInstance.SelectedSaleId.toString())){
    switch(type){
      case 'delivery':
        this.utilityService.orderType = "Delivery";
      break;
      case 'pick up':
        this.utilityService.orderType = "Pick Up";
      break;
      case 'dine in':
        this.utilityService.orderType = "Dine In";
      break;
      default:
      break;
    } 

    const _apiRoute = this.utilityService.getApiRoute('ApplyOrderType');
    const ApiURL = this.utilityService.localBaseAddress + _apiRoute;
    var _orderTypeParams = {
          SaleID: this.utilityService.globalInstance.SelectedSaleId,
          OrderType: this.utilityService.orderType,
          OtherInfo: '',
          SaleOrderTypeID: ''
        } as OrderType;
    console.log("orderTypeParams");
    console.log(_orderTypeParams);
    this.service.applyOrderType(_orderTypeParams, ApiURL)
      .subscribe(result => {
        console.log(result);
      }, error => {
        console.log(error);
      }, () => {
        this.reloadGuestCheckWindow(this.utilityService.globalInstance.SelectedSaleId, this.utilityService.globalInstance.SelectedTableName);
      }
    );
    }else{
      this.toastr.warning("Order Type cannot be changed.","Warning", {timeOut: 3000});
    }
  
 }

 autoPay(){
  const _apiRoute = this.utilityService.getApiRoute('SaveAutoPaySale');
  const ApiURL = this.utilityService.localBaseAddress + _apiRoute;
  var _autoPayParams = {
        SaleID: this.utilityService.globalInstance.SelectedSaleId,
        CurrentUser: this.utilityService.globalInstance.CurrentUser.EmpID
      } as AutoPayParams;
  console.log("AutoPayParams");
  console.log(_autoPayParams);
  this.service.saveAutoPaySale(_autoPayParams, ApiURL)
    .subscribe(result => {
      console.log(result);
    }, error => {
      console.log(error);
    }, () => {
        this.functionCall("START TABLE");
    }
  );
}

 applyCoursing(value){
  const _apiRoute = this.utilityService.getApiRoute('ApplyCoursing');
  const ApiURL = this.utilityService.localBaseAddress + _apiRoute;
  var _applyCoursing = {
        SaleId: this.utilityService.globalInstance.SelectedSaleId,
        ApplyCoursing: value
      } as ApplyCoursingObj;
  console.log("applyCoursing variable");
  console.log(_applyCoursing);
  this.service.applyCoursing(_applyCoursing, ApiURL)
    .subscribe(result => {
      console.log(result);
    }, error => {
      console.log(error);
    }, () => {
        this.loadMealPlanCustomerDetail(this.utilityService.globalInstance.SelectedSaleId.toString());
        this.getCoursingItemsList();
    }
  );
}

voidItem(){
  const _apiRoute = this.utilityService.getApiRoute('VoidItem');
  const ApiURL = this.utilityService.localBaseAddress + _apiRoute;
  var ctr = 0;
  for (var i = 0; i < this.utilityService.saleItemArray.length; i++){
    var saleitem = this.utilityService.saleItemArray[i];
    var _voidItem = {
          ReasonID: this.reasonId,
         /*  CheckNumber: this.utilityService._posChecknumber, */
          SaleItemID: saleitem,
          VoidEmpId: this.utilityService.globalInstance.CurrentUser.EmpID,
          SaleId : this.utilityService.globalInstance.SelectedSaleId
        } as IVoidItem;

    this.service.voidItem(_voidItem, ApiURL)
      .subscribe(result => {
        console.log(result);
      }, error => {
        console.log(error);
      }, () => {
          console.log('sulod');
          this.utilityService.saleItemArray = [];
          this.utilityService.array = [];
          this.loadAllDiscount();
          this.loadMealPlanCustomerDetail(this.utilityService.globalInstance.SelectedSaleId.toString());
          this.getCoursingItemsList();
          this.closeReasonModal();
      }
    );
  }
}

applyDiscount(){
  console.log("-= saleItemDiscountList =-");
  console.log(this.utilityService.saleItemDiscountList);
  console.log("-= utilityService.saleItemArray =-");
  console.log(this.utilityService.saleItemArray);

  var checkDiscountDuplicate = false;

  for (var x = 0; x < Object.keys(this.utilityService.saleItemDiscountList).length; x++){
    var menu = this.utilityService.saleItemDiscountList[x];
    for (var y = 0; y < Object.keys(this.utilityService.saleItemDiscountList[x]).length; y++){
      for (var i = 0; i < this.utilityService.saleItemArray.length; i++){
        var saleitem = this.utilityService.saleItemArray[i];
        if(saleitem == this.utilityService.saleItemDiscountList[x][y].SaleItemID){
          checkDiscountDuplicate = true;
        }
      }
    }
  }

  if(!checkDiscountDuplicate){
    if(this.utilityService.saleItemArray.length > 0){
      const dialogRef = this.dialog.open(DiscountComponent, {panelClass: 'tableinfo-dialog'});
      dialogRef.afterClosed().subscribe(
        data => {
          this.utilityService.saleItemArray = [];
          this.utilityService.array = [];
          this.loadAllDiscount();
          this.loadMealPlanCustomerDetail(this.utilityService.globalInstance.SelectedSaleId.toString());
          this.getCoursingItemsList();
         }
      );
    }else{
      this.toastr.warning("Please select atleast 1 item.","Warning", {timeOut: 3000});
      this.utilityService.saleItemArray = [];
      this.utilityService.array = [];
      this.loadAllDiscount();
      this.loadMealPlanCustomerDetail(this.utilityService.globalInstance.SelectedSaleId.toString());
      this.getCoursingItemsList();
    }
  }else{
    this.toastr.warning("You've selected a discounted item, Please choose an item without discount.","Warning", {timeOut: 3000});
    this.utilityService.saleItemArray = [];
    this.utilityService.array = [];
    this.loadAllDiscount();
    this.loadMealPlanCustomerDetail(this.utilityService.globalInstance.SelectedSaleId.toString());
    this.getCoursingItemsList();
  }
}

removeAllDiscount(){

  const _apiRoute = this.utilityService.getApiRoute('DeleteDiscount');
  const ApiURL = this.utilityService.localBaseAddress + _apiRoute;

  let discountInfo:IDeleteDiscount = {
    SaleID: this.utilityService.globalInstance.SelectedSaleId
  } as IDeleteDiscount;
  console.log('deleting discount...');
  this.service.deleteDiscount(discountInfo, ApiURL)
      .subscribe(result => {
        console.log(result);
        console.log('sulod palihog');
        this.utilityService.saleItemDiscountList = [];
        this.loadAllDiscount();
        this.loadMealPlanCustomerDetail(this.utilityService.globalInstance.SelectedSaleId.toString());
        this.getCoursingItemsList();
      }, error => {
        console.log('sulod error');
        this.utilityService.saleItemDiscountList = [];
        this.loadAllDiscount();
        this.loadMealPlanCustomerDetail(this.utilityService.globalInstance.SelectedSaleId.toString());
        this.getCoursingItemsList();
      }, () => {
        
      }
    );
}

  setSaleIdForTransfer(saleid,selectedCheck){
    if(this.utilityService.selectedItemOnMoveItem != ''){
      document.getElementById('MoveItemCheckID-' + this.utilityService.selectedItemOnMoveItem).removeAttribute('class');
      this.utilityService.selectedItemOnMoveItem='';
    } 
    document.getElementById('MoveItemCheckID-' + selectedCheck).className = 'highLightItem';
    this.utilityService.selectedItemOnMoveItem = selectedCheck;
    this.utilityService.selectedItemOnMoveItemMsg = 'CHECK NUMBER : ' + selectedCheck;
    this.saleIdForTransfer = saleid;
  }

  recursiveTransfer(i){
    if(i < this.utilityService.saleItemArray.length){
      this.utilityService.ctrForRecursion = this.utilityService.ctrForRecursion + 1;
      const _apiRoute = this.utilityService.getApiRoute('MoveItem');
      var saleitem = this.utilityService.saleItemArray[i];
      var _moveItemParam: IMoveItem = { 
        SaleID: this.saleIdForTransfer,
        SaleItemID: saleitem.toString()
      } as IMoveItem;
      let message: string;
      this.service.moveItem(_moveItemParam, this.utilityService.localBaseAddress + _apiRoute).subscribe(data => {
        console.log('MoveItem.... ' + data['message']);
        message = data['message'];
      }, error => {
        this.toastr.error(error,"Error", {timeOut: 2000});
      }, () => {
        if(message == "Check Removed!"){
          this._router.navigate(['roomselection']);
        }
        this.recursiveTransfer(this.utilityService.ctrForRecursion);
      });
    }else{
      this.getOpenChecks(this.utilityService.globalInstance.CurrentUser.EmpID,null);
      this.loadMealPlanCustomerDetail(this.utilityService.globalInstance.SelectedSaleId.toString());
      this.getCoursingItemsList();
      this.toastr.success("Successfully Transfered!","Success", {timeOut: 2000});
      this.utilityService.saleItemArray = [];
      this.closeOpenCheckModelMoveItem();
    }
  }

  transferItemsToOtherCheck(){
    this.utilityService.ctrForRecursion = 0;
    this.recursiveTransfer(this.utilityService.ctrForRecursion);
  }

  /*transferToOtherCourse(saleitem:string){
    this.forTransferSaleitem = saleitem;
  }*/

  recursiveMoveItemAction(i){
    const _apiRoute = this.utilityService.getApiRoute('MoveOrderItem');
    var saleitem = this.utilityService.saleItemArray[i];
    var _moveItemParam: IMoveItemCourse = { 
      SaleID: this.forTransferSaleID.toString(),
      SaleItemID: saleitem,
      CourseNo: this.selectedCourseNo,
      CustomerNumber: this.forTransferCustomerNumber
    } as IMoveItemCourse;
    let message: string;
    this.service.moveOrderItem(_moveItemParam, this.utilityService.localBaseAddress + _apiRoute).subscribe(data => {
      console.log('MoveOrderItem.... ' + data['message']);
      message = data['message'];
    }, error => {
      this.toastr.error(error,"Error", {timeOut: 2000});
    }, () => {
      if(i >= this.utilityService.saleItemArray.length - 1){
        this.getOpenChecks(this.utilityService.globalInstance.CurrentUser.EmpID,null);
        this.loadMealPlanCustomerDetail(this.utilityService.globalInstance.SelectedSaleId.toString());
        this.getCoursingItemsList();
        this.toastr.success("Item Moved!","Success", {timeOut: 2000});
        this.utilityService.saleItemArray = [];
        this.utilityService.array = [];
        this.closeOpenCheckModelMoveItem();
        this.forTransferSaleitem = "";
        this.forTransferCustomerNumber = 0;
        this.forTransferSaleID = 0;
      }else{
        this.recursiveMoveItemAction(i+1);
      }
    });
  }

  transferItemsToOtherCheckCourseItems(){
    if(this.utilityService.saleItemArray.length > 0){
      this.recursiveMoveItemAction(0);
    }
  }

  openChecksModel(){ 
    this.openChecksModal.show();
  }
  closeOpenCheckModal(){
    if(this.utilityService.selectedItemOnCombineCheck.length > 0){
      document.getElementById('CombineCheckID-' + this.utilityService.selectedItemOnCombineCheck).removeAttribute('class');
    }
    this.utilityService.selectedItemOnCombineCheck='';
    this.openChecksModal.hide();
  }
  openReasonModel(){
    if(this.utilityService.saleItemArray.length >= 1){
      this.reasonId = 0;
      this.openReasonModal.show();
    }else{
      this.toastr.warning("Please select atleast 1 item.","Warning", {timeOut: 3000});
    }
  }
  closeReasonModal(){
    this.openReasonModal.hide();
  }

  openReasonCompModel(){
    if(this.utilityService.saleItemArray.length >= 1){
      this.reasonId = 0;
      this.openReasonCompModal.show();
    }else{
      this.toastr.warning("Please select atleast 1 item.","Warning", {timeOut: 3000});
    }
  }
  closeReasonCompModal(){
    this.loadMealPlanCustomerDetail(this.utilityService.globalInstance.SelectedSaleId.toString());
    this.getCoursingItemsList();
    this.openReasonCompModal.hide();
  }


  openSettleMultipleCheckModal(){
    this.getOpenChecks(this.utilityService.globalInstance.CurrentUser.EmpID,null);
    this.settleMultipleCheck.show();
  }

  openEnterChargeTip(){
    this.getCloseChecks(this.utilityService.globalInstance.CurrentUser.EmpID,null);
    this.dataSource_CcTipList = new MatTableDataSource(this.utilityService.closedChecks.filter(x=>x.IsCreditCardTransaction == true));
    this.dataSource_CcTipList.sort = this.sort;
    this.dataSource_CcTipList.paginator = this.paginator;
    this.enterChargeTip.show();
  }

  closeEnterChargeTip(){
    this.enterChargeTip.hide();
    if(this.utilityService.selectedCheckChargeTipSaleId.length > 0){
      document.getElementById('ChargeTip-' + this.utilityService.selectedCheckChargeTipSaleId).removeAttribute('class');
    }
    this.utilityService.selectedCheckChargeTipSaleId = '';
    this.utilityService.selectedCheckChargeTipChecknum = '';
  }

  clearChargeTip(){
    if(this.utilityService.selectedCheckChargeTipSaleId.length > 0){
      document.getElementById('ChargeTip-' + this.utilityService.selectedCheckChargeTipSaleId).removeAttribute('class');
    }
    this.utilityService.selectedCheckChargeTipSaleId = '';
    this.utilityService.selectedCheckChargeTipChecknum = '';
  }

  openpinPadTipDialog(){
    this.pinPadTipAmount.show();
  }

  closepinPadTipDialog(){
    this.pinPadTipAmount.hide();
    this.utilityService.selectedCheckChargeTipChecknum = '';
  }

  openlookUpResident(){
    this.lookUpResident.show();
    var focusElem = setTimeout(() => {
      var searchElement = (document.getElementById("SearchCustomerNameOrdering") as HTMLInputElement);
        if (searchElement) {
            searchElement.focus();
            this.value = "";
            (document.getElementById("SearchCustomerNameOrdering") as HTMLInputElement).value = "";
            this.keyboard.setInput("");
            clearTimeout(focusElem);
        }
    }, 1);
  }

  openCusInfo(){
    this.customerInfo.show();
   
    
    const SelectedValue = this.myControl.value.CustomerId;
    this.utilityService.globalInstance.SelectedCustomerId = SelectedValue;
   /*  this.utilityService.customerInfo = this.customerModule.getCustomerInfo(this.utilityService.globalInstance.SelectedCustomerId); */
    this.service.getCustomerInfo(this.utilityService.localBaseAddress + 'api/v1/customer/getCustomerInfo/' + this.utilityService.globalInstance.SelectedCustomerId)
    .subscribe(data => {
      this.utilityService.customerInfo = JSON.parse(data['result']);
      console.log(this.utilityService.customerInfo )
    }, error =>{
      this.toastr.error('Error',error,{timeOut:3000});
    },()=>{
      this.customerLastName = this.utilityService.customerInfo.CustomerInfo.LastName;
      this.customerFirstName = this.utilityService.customerInfo.CustomerInfo.FirstName;
      this.customerAddress = this.utilityService.customerInfo.CustomerInfo.Address1;
      this.customerAddress2 = this.utilityService.customerInfo.CustomerInfo.Address2;
      this.customerPhone = this.utilityService.customerInfo.CustomerInfo.Phone;
      this.customerNumber = this.utilityService.customerInfo.CustomerInfo.CustomerNumber;
    
      this.customerEmail = this.utilityService.customerInfo.CustomerInfo.Email;
      this.customerCity = this.utilityService.customerInfo.CustomerInfo.City;
      this.customerZip = this.utilityService.customerInfo.CustomerInfo.Zip;

      this.customerLastOrder = this.utilityService.customerInfo.CustomerLastOrder;
      console.log(this.customerLastOrder.length);
      if(this.customerLastOrder.length != 0){
        this.customerInfoCheckNumber = this.customerLastOrder[this.customerInfoSetIndex].CheckNumber.toString(); 
this.customerInfoOrderDate = this.customerLastOrder[this.customerInfoSetIndex].OrderDate; 
let current_datetime = new Date(this.utilityService.customerInfo.CustomerInfo.BirthDate.toString());
let formatted_date =  (current_datetime.getMonth() + 1) + '/'+ current_datetime.getDate()+ '/' + current_datetime.getFullYear() ;
console.log(formatted_date);
this.customerBirthdate = formatted_date;
this.customerOrderList = this.customerLastOrder[this.customerInfoSetIndex].OrderList.OrderItems;
this.customerSeat = this.customerLastOrder[this.customerInfoSetIndex].OrderList.SeatNumber;
this.customerDinerPlan = this.utilityService.customerInfo.FrequentDinerInfo.DescriptionPlan;
this.customerDinerStatus = this.utilityService.customerInfo.FrequentDinerInfo.DescriptionStatus;
      }
    });
  }

  previousCustomerLastOrder(){
    if(this.customerLastOrder.length != 0){ 
      if(this.customerInfoSetIndex<= 0){
        this.customerInfoSetIndex = 4;
      }
      this.customerInfoSetIndex -= 1;
      this.customerInfoCheckNumber = this.customerLastOrder[this.customerInfoSetIndex].CheckNumber.toString(); 
      this.customerInfoOrderDate = this.customerLastOrder[this.customerInfoSetIndex].OrderDate; 
      this.customerOrderList = this.customerLastOrder[this.customerInfoSetIndex].OrderList.OrderItems
      this.customerSeat = this.customerLastOrder[this.customerInfoSetIndex].OrderList.SeatNumber;
    } 
  }
  nextCustomerLastOrder(){
    if(this.customerLastOrder.length != 0){ 
    this.customerInfoSetIndex += 1;
    if(this.customerInfoSetIndex>= 4){  
      this.customerInfoSetIndex = 0;
    }
    this.customerInfoCheckNumber = this.customerLastOrder[this.customerInfoSetIndex].CheckNumber.toString(); 
    this.customerInfoOrderDate = this.customerLastOrder[this.customerInfoSetIndex].OrderDate; 
    this.customerOrderList = this.customerLastOrder[this.customerInfoSetIndex].OrderList.OrderItems;
    this.customerSeat = this.customerLastOrder[this.customerInfoSetIndex].OrderList.SeatNumber;
  }
}

  closeCusInfo(){
    this.utilityService.globalInstance.SelectedCustomerId = null;
    this.customerInfo.hide();
  }

  openFrequentDiner(){
    this.frequentDiner.show();
  }
  hideFrequentDiner() {
    this.frequentDiner.hide();
  }

  openfastCashDialog() {
    this.fastCashDialog.show();
  }

  hidefastCashDialog() {
    this.fastCashDialog.hide();
  }
  openassignSeatConfirmation(){
    this.assignSeatConfirmation.show();
  }
  hideassignSeatConfirmation(){
    this.assignSeatConfirmation.hide();
  }

  clearSelectedCustomer() {

  }

  closelookUpResident(){
    this.lookUpResident.hide();
  }

  openCCprocessingDialog(){
    this.ccprocessingDialog.show();
  }

  closeCCprocessingDialog(){
    this.ccprocessingDialog.hide();
  }
  payMultipleCheck(value) {
      let SaleID = this.utilityService.selectedMultipleCheck;
      let status: any;
      let PaymentMediaIndex = this.selectedMediaIndex;
      let CurrentUser = this.utilityService.globalInstance.CurrentUser.EmpID;
      let FunctionIndex = this.selectedFunctionIndex;
      let IsConsolidated:boolean = false;;
      let PrintReceipt:boolean = false;
  
      if(value == '1 ENTIRE CHECK') {
        IsConsolidated = true;
        PrintReceipt = true;
      }
      else if(value == 'INDIVIDUAL CHECK') {
        IsConsolidated = false;
        PrintReceipt = true;
      } else {
        IsConsolidated = false;
        PrintReceipt = false;
      }
  
      const _apiRoute = this.utilityService.getApiRoute('ButtonFunction');
  
      const _settleMultiple : SettleMultiple = {SaleID,PaymentMediaIndex,CurrentUser,IsConsolidated,FunctionIndex,PrintReceipt} as SettleMultiple;
      this.service.settleMultiple(_settleMultiple,this.utilityService.localBaseAddress + _apiRoute)
      .subscribe(data => {
        console.log(JSON.parse(data['result']));
        status = JSON.parse(data['status-code'])
      }, error => {
        this.toastr.error(error,'ERROR',{timeOut:2000})
      }, () => {
        if(status == 200) {
          this.toastr.warning('Selected Payment Media is not yet implemented','Warning',{timeOut:3000});
        } else if (status == 201) {
          const jsonStart = "{Function:2}";
          this.functionButtonExecute(jsonStart, 'START TABLE');
          this.closeMediaTypeListModal();
          this.closeSettleMultipleCheckModal();
          this.toastr.success('Successfully settled checks','Success',{timeOut:3000});
        } else {
          alert('else');
        }
      }) 
  }

  openConfirmationPrintReceipt(mediaIndex) {
    this.selectedMediaIndex = mediaIndex;
    if(this.selectedMediaIndex == 0) {
      this.confirmationPrintReceipt.show();
    } else {
      this.toastr.warning('Selected Payment Media is not yet implemented','Warning',{timeOut:3000});
    }
  }
  hideConfirmationPrintReceipt() {
    this.confirmationPrintReceipt.hide();
  }
  EnterNumberOfCopy() {
    this.showNumberToBePrinter = true;
  }
  GoBackToPrintReceiptConfirmation() {
    this.showNumberToBePrinter = false;
  }


  closeSettleMultipleCheckModal() {
    for(var i = 0;  this.utilityService.openChecks.length > i; i++){
      document.getElementById('MultipleCheck-' + this.utilityService.openChecks[i].SaleId).removeAttribute('class');
    }
    this.utilityService.selectedMultipleCheck = [];
    this.utilityService.selectedMultipleCheckAmount = [];
    this.utilityService.selectedMultipleCheckTotalAmount = '';
    this.settleMultipleCheck.hide();
  }
  closeMediaTypeListModal() {
    this.mediaTypeList.hide();
  }
  openMediaTypeListModal() {
    if(this.utilityService.selectedMultipleCheck.length == 0) {
      this.toastr.warning('Please select check','Warning',{timeOut:2000});
    } else {
      this.mediaTypeList.show();
    }
  }

  getPaymentMedia() {
    const _apiRoute = this.utilityService.getApiRoute('GetMedia');
		this.service.getMedia(this.utilityService.localBaseAddress + _apiRoute,this.utilityService.storeId)
		.subscribe(data=> {
			this.utilityService._media = JSON.parse(data['result']);
		},
		error=> {
      this.toastr.error(error,'Error',{timeOut:3000})
		},()=> {
      console.log(this.utilityService._media);
		});
  }

  openCheckModelMoveItem(){
    if(this.utilityService.selectedItemOnMoveItem != ''){
      console.log('MoveItemCheckID-' + this.utilityService.selectedItemOnMoveItem);
      document.getElementById('MoveItemCheckID-' + this.utilityService.selectedItemOnMoveItem).removeAttribute('class');
      this.utilityService.selectedItemOnMoveItem = '';
      this.utilityService.selectedItemOnMoveItemMsg = '';
      this.saleIdForTransfer = "";
    }
    this.openChecksModalMoveItem.show();
  }
  closeOpenCheckModelMoveItem(){
    if(this.utilityService.selectedItemOnMoveItem != ''){
      document.getElementById('MoveItemCheckID-' + this.utilityService.selectedItemOnMoveItem).removeAttribute('class');
      this.utilityService.selectedItemOnMoveItem='';
    } 
    this.openChecksModalMoveItem.hide();
  }

  openEmployeeListModal(){
    if(this.utilityService.selectedEmployeeList != ''){
      console.log('EmployeeListID-' + this.utilityService.selectedEmployeeList);
      document.getElementById('EmployeeListID-' + this.utilityService.selectedEmployeeList).removeAttribute('class');
      this.utilityService.selectedEmployeeList = '';
      this.utilityService.selectedEmployeeListMsg = '';
      this.saleIdForTransfer = "";
    }
    this.openEmployeeList.show();
  }
  closeOpenEmployeeListModal(){
    if(this.utilityService.selectedEmployeeList != ''){
      document.getElementById('EmployeeListID-' + this.utilityService.selectedEmployeeList).removeAttribute('class');
      this.utilityService.selectedEmployeeList='';
    } 
    this.openEmployeeList.hide();
  }
  openSeatListModal(){
    this.utilityService.splitItemCustomers = new Array();
    if(this.utilityService.saleItemArray.length == 1){
      this.openSeatList.show();
    }else{
      this.toastr.info("You need to select 1 item.");
    }
  }
  closeOpenSeatListModal(){
    if(this.utilityService.selectedEmployeeList != ''){
      document.getElementById('SeatListID-' + this.utilityService.selectedEmployeeList).removeAttribute('class');
      this.utilityService.selectedEmployeeList='';
    } 
    this.openSeatList.hide();
  }

  addCustomerSplitItems(value){
    if(this.utilityService.splitItemCustomers.indexOf(value) > -1){
      var index = this.utilityService.splitItemCustomers.indexOf(value);
      if (index > -1) { //if found
        this.utilityService.splitItemCustomers.splice(index, 1);
        document.getElementById('SeatListID-' + value).removeAttribute('class');
      }
    }else{
      this.utilityService.splitItemCustomers.push(value);
      document.getElementById('SeatListID-' + value).className = 'highLightItem';
    }
    
  }

  show_restoredTransactionsList(){
    this.storedTransaction.show();
  }
  hide_restoredTransactionList(){
    this.storedTransaction.hide();
  }


  saleManualForward(requestId,totalAmount){
    const _apiRoute = this.utilityService.getApiRoute('SaleManualForward');
    let isSuccess;
    let message;
    let status;
    this.utilityService.saleManualForward = {
      requestId : requestId,
      totalAmount : totalAmount
    } as saleManualForward;
    this.service.saleManualForward(this.utilityService.saleManualForward, this.utilityService.localBaseAddress + _apiRoute)
    .subscribe(data => {
      isSuccess = JSON.parse(data['result']);
      message = data['message'];
      status = data['status-code'];
    },error=> {
      this.toastr.error('Error',error,{timeOut:3000});
    }, ()=> {
      if(status == 200) {
        this.toastr.success('Success','Success',{timeOut:3000})
        this.refreshStoredTransactions()
      } else {
        this.toastr.info('info','info',{timeOut:3000})
      }
    })
  }


  reorderItems(i){
    const _apiRoute = this.utilityService.getApiRoute('ReorderItems');
    var saleitem = this.utilityService.saleItemArray[i];
    var itemID = this.itemArray[i];
    var _reorderItemParam: ReorderItem = { 
      SaleItemID: saleitem
    } as ReorderItem;
    let message: string;

    console.log("-= call reorderItems =-");
    console.log(_reorderItemParam);
    console.log("ItemID: "+itemID);
    console.log("saleitem: "+saleitem);

    this.service.reorderItems(_reorderItemParam, this.utilityService.localBaseAddress + _apiRoute).subscribe(data => {
      console.log('ReorderItems.... ' + data['message']);
      message = data['message'];
    }, error => {
      this.toastr.error(error,"Error", {timeOut: 2000});
    }, () => {  


      var continueLoop = true;
      for(var a = 0; a<Object.keys(this.utilityService._buttons).length && continueLoop; a++){
        for (var x = 0; x < Object.keys(this.utilityService._buttons[a].SubButtons).length && continueLoop; x++){
          var subBtn = this.utilityService._buttons[a].SubButtons[x].Buttons;
          for(var y = 0; y<Object.keys(subBtn).length && continueLoop; y++){
            var forOutput = this.utilityService._buttons[a].SubButtons[x].Buttons[y];
            //console.log(forOutput.ButtonText + " = " +forOutput.ItemCount);
            if(this.utilityService._buttons[a].SubButtons[x].Buttons[y].SubButtonID == itemID){
              continueLoop = false;
              var qty = this.utilityService._buttons[a].SubButtons[x].Buttons[y].ItemCount - 1;
              if(qty >= 0){
                this.utilityService._buttons[a].SubButtons[x].Buttons[y].ItemCount = qty;
                this.deductQty(this.utilityService.itemIDSelected, qty, false);
              }
              
            }
          }
          
        }
      }


      if(i >= this.utilityService.saleItemArray.length - 1){
        this.getOpenChecks(this.utilityService.globalInstance.CurrentUser.EmpID,null);
        this.loadMealPlanCustomerDetail(this.utilityService.globalInstance.SelectedSaleId.toString());
        this.toastr.success("Reorder item is saved!","Success", {timeOut: 2000});
        this.utilityService.saleItemArray = [];
        this.utilityService.array = [];
        this.utilityService.fireAllList = [];

        const SaleId = this.utilityService.globalInstance.SelectedSaleId;
        let selectedSeat = this.utilityService._selectedSeatOrderUI.toString().replace('Seat ', '');
        this.reloadGuestCheckWindow(SaleId, this.utilityService.globalInstance.SelectedTableName, selectedSeat);
      }else{
        this.reorderItems(i+1);
      }
    });
  }



  splitItem(){
    if(this.utilityService.saleItemArray.length != 1){
      this.toastr.info("Please select 1 item only","Informataion", {timeOut: 2000});
    }else if(this.utilityService.splitItemCustomers.length < 1){
      this.toastr.info("Please select atleast 1 customer","Informataion", {timeOut: 2000});
    }else{
      const _apiRoute = this.utilityService.getApiRoute('SplitItems');
      var saleItemID: string = this.utilityService.saleItemArray[0];
      let customers:number[] = this.utilityService.splitItemCustomers;
      var _splitItems: ISplitItem = {
        SaleItemID: saleItemID,
        CustomerNumber: customers
      } as ISplitItem;

      console.log("splitItems");
      console.log(_splitItems);

      let message: string;
      this.service.splitItems(_splitItems, this.utilityService.localBaseAddress + _apiRoute).subscribe(data => {
        console.log('SplitItems.... ' + data['message']);
        message = data['message'];
      }, error => {
        this.toastr.error(error,"Error", {timeOut: 2000});
      }, () => {
        this.getOpenChecks(this.utilityService.globalInstance.CurrentUser.EmpID,null);
        this.loadMealPlanCustomerDetail(this.utilityService.globalInstance.SelectedSaleId.toString());
        this.getCoursingItemsList();
        this.toastr.success("Item Shared!","Success", {timeOut: 2000});
        this.utilityService.saleItemArray = [];
        this.closeOpenSeatListModal();
      });
    }
  }

  unsplitItem(){
    if(this.utilityService.saleItemArray.length != 1){
      this.toastr.info("Please select 1 item only","Informataion", {timeOut: 2000});
    }else{
      const _apiRoute = this.utilityService.getApiRoute('UnsplitItems');
      var saleItemID: string = this.utilityService.saleItemArray[0];
      var _splitItems: ISplitItem = {
        SaleItemID: saleItemID
      } as ISplitItem;

      console.log("UnsplitItems");
      console.log(_splitItems);

      let message: string;
      this.service.unsplitItems(_splitItems, this.utilityService.localBaseAddress + _apiRoute).subscribe(data => {
        console.log('UnsplitItems.... ' + data['message']);
        message = data['message'];
      }, error => {
        this.toastr.error(error,"Error", {timeOut: 2000});
      }, () => {
        this.getOpenChecks(this.utilityService.globalInstance.CurrentUser.EmpID,null);
        this.loadMealPlanCustomerDetail(this.utilityService.globalInstance.SelectedSaleId.toString());
        this.getCoursingItemsList();
        this.toastr.success("Item Shared!","Success", {timeOut: 2000});
        this.utilityService.saleItemArray = [];
        this.closeOpenSeatListModal();
      });
    }
    
  }

  addDelay(time=true){

    if(this.utilityService.saleItemArray.length != 1){
      this.toastr.info("Please select 1 item only","Informataion", {timeOut: 2000});
    }else{
      const _apiRoute = this.utilityService.getApiRoute('AddDelay');
      var _itemDelay: IDelay = {
        SaleItemID: this.utilityService.saleItemArray[0],
        TimeDelay: this.inputed_numeric,
        DelayStatus: this.timeStatus
      } as IDelay;

      if(!time){
        var _itemDelay: IDelay = {
          SaleItemID: this.utilityService.saleItemArray[0],
          TimeDelay: this.inputed_date,
          DelayStatus: 'date'
        } as IDelay;
      }

      console.log("_itemDelay");
      console.log(_itemDelay);

      let message: string;
      this.service.addDelay(_itemDelay, this.utilityService.localBaseAddress + _apiRoute).subscribe(data => {
        console.log('addDelay.... ' + data['message']);
        message = data['message'];
      }, error => {
        this.toastr.error(error,"Error", {timeOut: 2000});
      }, () => {
        this.toastr.success("Successfully added item delay!","Success", {timeOut: 2000});
        this.hideNumericKeyPad4();
        this.hideDatePicker();
        this.hideTimePicker();
      });
    }
    
  }

  reprintOrder() {
    if(this.utilityService.isServerOnline) {
      const _reprintOrder: ReprintOrder = { SaleId: this.utilityService.globalInstance.SelectedSaleId } as ReprintOrder;
      let message: string;
      const _apiRoute = this.utilityService.getApiRoute('ReprintOrder');
      this.service.reprintOrder(_reprintOrder, this.utilityService.localBaseAddress + _apiRoute).subscribe(data => {
        message = data['message'];
      }, error => {
        this.toastr.error(error,"Error", {timeOut: 2000});
      }, () => {
        if (message === 'Success') {
          this.toastr.success("Reprint order, process successfully!","Success", {timeOut: 2000});
          this.getCheckDetails(this.utilityService.globalInstance.SelectedSaleId, this.utilityService.globalInstance.SelectedTableName,this.utilityService.globalInstance.SelectedLayoutTableId,this.utilityService.globalInstance.SelectedCheckNumber );
          this.toastr.success('order sent to kitchen',"Success", {timeOut: 2000});
          this.clearSelectedItemIndexes();
        } else if (message === 'No orders to be print') {
          this.toastr.warning(message,"Warning", {timeOut: 2000});
        } else {
          this.toastr.warning(message,"Warning", {timeOut: 2000});
        }
      });
    } else {
      this.toastr.info('Cannot send order while offline','Information', {timeOut: 3000});
    }
  }

  setSelectedEmployeeList(empid, empname){
    if(this.utilityService.selectedEmployeeList != ''){
      document.getElementById('EmployeeListID-' + this.utilityService.selectedEmployeeList).removeAttribute('class');
    } 
    this.utilityService.selectedEmployeeList=empid;
    document.getElementById('EmployeeListID-' + empid).className = 'highLightItem';
    this.utilityService.selectedEmployeeListMsg = 'Selected: ' + empname;
  }

  setTransferTable(){
    const _apiRoute = this.utilityService.getApiRoute('SaveEmployeeCheck');
    const ApiURL = this.utilityService.localBaseAddress + _apiRoute;

    var _emp = {
          EmpNumber: this.utilityService.selectedEmployeeList,
          EmpFrom: this.utilityService.globalInstance.CurrentUser.EmpID,
          SaleId: this.utilityService.globalInstance.SelectedSaleId
        } as IEmployee;

    this.service.transferCheck(_emp, ApiURL)
      .subscribe(result => {
        console.log(result);
      }, error => {
        console.log(error);
      }, () => {
          //this.loadMealPlanCustomerDetail(this.utilityService._posChecknumber.toString());
          this.closeOpenEmployeeListModal();
          this.clearSelectedItemIndexes();
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
          this._router.navigate(['roomselection']);
      }
    );
  }


openViewAnyCheck(){
    // console.clear();
    // tslint:disable-next-line: max-line-length
    this.service.getOpenChecks(this.utilityService.localBaseAddress+ 'api/openCheck/v1/getOpenChecksByManager', this.utilityService.storeId)
    .subscribe(data => {
      this.utilityService.openChecks = JSON.parse(data['result']);
      console.log('openViewAnyCheck');
      console.log(this.utilityService.openChecks);
    }, error => {
        this.toastr.error(error,"Error", {timeOut: 2000});
    }, () => {
             
    });
   this.viewAnyCheck.show();
}
closeViewAnyCheck(isCancel){
  if(this.utilityService.selectedCheckToView.length > 0){
    document.getElementById('selectedCheckToView-' + this.utilityService.selectedCheckToView).removeAttribute('class');
  }
  this.utilityService.selectedCheckToView='';
  this.utilityService.ByManager = false;
  this.viewAnyCheck.hide();
  if(isCancel){
    this.getOpenChecks(this.utilityService.globalInstance.CurrentUser.EmpID,null);
  }
}

selectedCheckToView(checknumber,tableName,saleid) {
  if(this.utilityService.selectedCheckToView.length > 0){
    document.getElementById('selectedCheckToView-' + this.utilityService.selectedCheckToView).removeAttribute('class');
  }
  this.utilityService.selectedCheckToView='';
  this.utilityService.selectedCheckToViewCheck = saleid;
  this.utilityService.selectedCheckToViewTableName = tableName;
  document.getElementById('selectedCheckToView-' + saleid).className = 'highLightItem';
  this.utilityService.selectedCheckToView = saleid;
  this.utilityService.selectedCheckToViewMsg = 'CHECK NUMBER : ' + saleid + ' SELECTED';
}

selectedCheckToViewOK() {
  this.utilityService.globalInstance.SelectedSaleId = this.utilityService.selectedCheckToViewCheck;
  this.utilityService.globalInstance.SelectedTableName = this.utilityService.selectedCheckToViewTableName;
  this.getCheckDetailsByManager(this.utilityService.globalInstance.SelectedSaleId, this.utilityService.globalInstance.SelectedTableName,this.utilityService.globalInstance.SelectedCheckNumber);
  this.closeViewAnyCheck(false);
}

  combineChecks(){
  /*   this.toastr.warning('Combine Check function is in progress','Information',{timeOut:3000}) */

    let selectedTable1st_SeatCount  = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SeatCount;
    let selectedTable1st_TakenSeat = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].TotalSeatsTaken;

    let selectedTable2nd_Seatcount = this.utilityService.selectedItemOnCombineCheckSeatCount;
    let selectedTable2nd_TakenSeat = this.utilityService.selectedItemOnCombineCheckTakenSeat;

    let totalSeatCount = selectedTable1st_SeatCount;
    let totalSeatTaken = selectedTable1st_TakenSeat + selectedTable2nd_TakenSeat;

    console.log('totalSeatCount -----' + totalSeatCount);
    console.log('totalSeatTaken -----' + selectedTable1st_TakenSeat + ' + ' + selectedTable2nd_TakenSeat)

    if(totalSeatCount >= totalSeatTaken) {
      const _apiRoute = this.utilityService.getApiRoute('ButtonFunction');
      let CombineCheck1stSaleId = this.utilityService.selectedSaleID;
      let FunctionIndex = this.selectedFunctionIndex;
      let CombineCheck2ndSaleId = this.utilityService.selectedItemOnCombineCheck;
      const _combineCheck : CombineCheck = {FunctionIndex,CombineCheck1stSaleId,CombineCheck2ndSaleId} as CombineCheck;
      this.service.combineCheck(_combineCheck,this.utilityService.localBaseAddress + _apiRoute)
      .subscribe(data => {
        console.log(JSON.parse(data['result']));
      }, error => {
        this.toastr.error(error,'ERROR',{timeOut:2000})
      }, () => {
        this.getOpenChecks(this.utilityService.globalInstance.CurrentUser.EmpID,null);
        this.getCheckDetails(this.utilityService.globalInstance.SelectedSaleId, this.utilityService.globalInstance.SelectedTableName,this.utilityService.globalInstance.SelectedLayoutTableId,this.utilityService.globalInstance.SelectedCheckNumber );
        this.closeOpenCheckModal();
      })
    } else {
      this.toastr.warning('Unable to combine check. Taken seats are more than seat count','Warning',{timeOut:4000});
    }
  }

  setNewButtonCounter(){
/*     var valueFromPinpad = this.utilityService.splitEven;
    if(valueFromPinpad >= 0){
      this.deductQty(this.utilityService.itemIDSelected, valueFromPinpad, true);
    }
    this.utilityService.splitEven = 0; */

    var valueFromPinpad = Number(this.inputed_numeric);
    if(valueFromPinpad >= 0){
      this.deductQty(this.utilityService.itemIDSelected, valueFromPinpad, true);
    }
    this.inputed_numeric = '0';
  }

  setQtyCoursing(){
    var valueFromPinpad = this.utilityService.splitEven;
    if(this.inputed_numeric >= '0'){
      this.applyCoursing(this.inputed_numeric);
    }
    this.utilityService.splitEven = 0;
  }

  deductQty(itemID, itemCount, force=false){
    const _apiRoute = this.utilityService.getApiRoute('SaveItemQuantity');
    const ApiURL = this.utilityService.localBaseAddress + _apiRoute;

    var _itemQty = {
          ItemID: itemID,
          ItemCount: itemCount,
          Force: force
        } as IItemQty;

    this.service.saveItemQuantity(_itemQty, ApiURL)
      .subscribe(data => {
        console.log("return value saveItemQuantity");
        console.log(data);
        this.utilityService.selectedSubButton = JSON.parse(data['result']);
      }, error => {
        console.log(error);
      }, () => {
        
        for (var x = 0; x < Object.keys(this.utilityService.subButton).length; x++){
          var subBtn = this.utilityService.subButton[x].Buttons;
          for(var y = 0; y < Object.keys(subBtn).length; y++){
            if(this.utilityService.subButton[x].Buttons[y].SubButtonID == itemID){
              console.log('equal data: '+this.utilityService.subButton[x].Buttons[y].SubButtonID);
              this.utilityService.subButton[x].Buttons[y].ItemCount = this.utilityService.selectedSubButton.ItemCount;
            }
          }
          
        }

      }
    );
  }


  resetAll(){

    const _apiRoute = this.utilityService.getApiRoute('ResetItemQuantity');
    const ApiURL = this.utilityService.localBaseAddress + _apiRoute;

    var _itemQty = {
          ItemID: "",//this.utilityService.itemIDSelected,
          ItemCount: -1
        } as IItemQty;

    this.service.resetItemQuantity(_itemQty, ApiURL)
      .subscribe(data => {
          //let selectedbutton = this.utilityService._buttons.find(c=>c.ButtonText == text);
          for(var a = 0; a<Object.keys(this.utilityService._buttons).length; a++){
            for (var x = 0; x < Object.keys(this.utilityService._buttons[a].SubButtons).length; x++){
              var subBtn = this.utilityService._buttons[a].SubButtons[x].Buttons;
              for(var y = 0; y<Object.keys(subBtn).length; y++){
                var forOutput = this.utilityService._buttons[a].SubButtons[x].Buttons[y];
                //console.log(forOutput.ButtonText + " = " +forOutput.ItemCount);
                if(this.utilityService._buttons[a].SubButtons[x].Buttons[y].ItemCount >= 0){
                  this.utilityService._buttons[a].SubButtons[x].Buttons[y].ItemCount = -1;
                }
              }
              
            }
          }
          
      }, error => {
        console.log(error);
      }, () => {
        this.toastr.success("Successfully Updated!", '', {timeOut: 2000});
        this.closeResetModal();
        this.closeResetAllModal();
      }
    );

  }

  resetOne(){
    this.resetSelection = true;
    this.closeResetModal();
  }

  openResetModel(){
    this.openResetModal.show();
  }
  closeResetModal(){
    this.openResetModal.hide();
  }

  getCourseStatus(seatNo, courseNo){
    let className = "";
    let selectedSeat = this.utilityService._selectedSeatOrderUI.toString().replace('Seat ', '');
    let courseSeat = seatNo.toString().replace('Seat ', '');
    //console.log("selectedSeat:"+selectedSeat+" courseSeat:"+courseSeat+" && selectedSeat:"+this.selectedCourseNo+" courseNo:"+courseNo);
    if(this.selectedCourseNo == courseNo && selectedSeat == courseSeat){
      className = "coursing_title_selected col-12";
    }else{
      className = "coursing_title col-12";
    }
    return className;
  }

  selectCourseNo(seatNo, courseNo, _customerId, _saleId){
    console.log("SelectCourseNo = courseNo:"+courseNo+" seatNo:"+seatNo);
    this.selectedCourseNo = courseNo;
    this.utilityService._selectedSeatOrderUI = Number(seatNo.toString().replace('Seat ', ''));
    this.utilityService._selectedCustomerIdOrderUI = _customerId;

    /*if(this.forTransferSaleitem != ""){
      this.transferItemsToOtherCheckCourseItems(_customerId, _saleId);
    }*/

    this.forTransferCustomerNumber = _customerId;
    this.forTransferSaleID = _saleId;
  }

  openResetAllModel(){
    this.openResetAllModal.show();
  }
  closeResetAllModal(){
    this.openResetAllModal.hide();
  }

  getbuttonValue(value) { 
    switch (value) {
      case 'CANCEL' :
        this.hideDialogAskForSupervisor();
        break;
      case 'DEL' :
        this.utilityService.supervisorpin = this.utilityService.supervisorpin.substring(0, this.utilityService.supervisorpin.length - 1);
        break;
      case 'OK':
        this.validatebySupervisor();
        break;
      case 'CLEAR' :
        this.utilityService.supervisorpin = '';
        this.utilityService.supervisorconvertedpin = '';
        break;
      case '00':
        this.utilityService.supervisorpin =  this.utilityService.supervisorpin + '00';
        break;
      default :
        this.utilityService.supervisorpin += value;
        break;
    }
    this.utilityService.supervisorconvertedpin = this.utilityService.supervisorpin.replace(/./g, '*');
  }

  getbuttonValueQuantity(value){
    switch(value) {
      case 'CANCEL' :
        this.hideNumericKeyPad();
        break;
      case 'DEL' :
        this.inputed_numeric = this.inputed_numeric.substring(0, this.inputed_numeric.length - 1);
          break;
      case 'OK' :
        this.saveItemQuantity();
        break;
      case 'CLEAR' :
        this.inputed_numeric = '';
        break;
      case '00' :
        if(this.inputed_numeric.length < 4) {
          this.inputed_numeric = this.inputed_numeric  + '00';
        }
        break;
      default :
        if(this.inputed_numeric.length < 4) {
          this.inputed_numeric += value;
        }
        console.clear();
        console.log('lenght ' + this.inputed_numeric.length)
        break;
    }
  }

  checkQtyCoursing() {
    if(this.inputed_numeric == '' || this.inputed_numeric == '0000' || this.inputed_numeric == '000' || this.inputed_numeric == '00' || this.inputed_numeric == '0') {
      this.toastr.error('Please input quantity');
    } else {
      this.setQtyCoursing();
      this.hideNumericKeyPad2();
    }
  }

  getbuttonValueQuantity2(value){
    switch(value) {
      case 'CANCEL' :
        this.hideNumericKeyPad2();
        break;
      case 'DEL' :
        this.inputed_numeric = this.inputed_numeric.substring(0, this.inputed_numeric.length - 1);
          break;
      case 'OK' :
        this.checkQtyCoursing();
        break;
      case 'CLEAR' :
        this.inputed_numeric = '';
        break;
      case '00' :
        if(this.inputed_numeric.length < 4) {
          this.inputed_numeric = this.inputed_numeric  + '00';
        }
        break;
      default :
        if(this.inputed_numeric.length < 4) {
          this.inputed_numeric += value;
        }
        console.clear();
        console.log('lenght ' + this.inputed_numeric.length)
        break;
    }
  }

  saveItemQuantity() {
    if(this.inputed_numeric == '' || this.inputed_numeric == '0000' || this.inputed_numeric == '000' || this.inputed_numeric == '00' || this.inputed_numeric == '0' || this.inputed_numeric.length > 4) {
      this.toastr.error('Please input quantity');
    } else {
      this.setNewButtonCounter();
      this.hideNumericKeyPad();
    }
  }

  validateTotalValue(tempValue){
    if(tempValue != ''){
      if(tempValue <= 10000){
        return true;
      }
    }
    return false;
  }

  validatebySupervisor() {
    if(this.utilityService.supervisorpin.length == 0) {
      this.toastr.error('Please input PIN','Error',{timeOut:4000});
    } else {
      let result = false;
      let statusCode : any;
    const _apiRoute = this.utilityService.getApiRoute('SupervisorPIN');
    this.service.supervisorPIN(this.utilityService.localBaseAddress + _apiRoute + '/' + this.utilityService.supervisorpin)
    .subscribe(data => {
      result = JSON.parse(data['result'])
      statusCode = data['StatusCode'];
      console.log(data['StatusCode']);
    },error=> {
      this.toastr.error(error,'Error',{timeOut:3000})
      this.utilityService.supervisorconvertedpin= '';
      this.utilityService.supervisorpin = '';
    },()=>{
        this.hideDialogAskForSupervisor();
        this.utilityService.access_grandtedby_supervisor = true;
        this.addItem(this.utilityService._itemNameData);
    })
    } 
  }



  getbuttonValueQuantity3(value){
    let num = Number(this.inputed_numeric.replace(".", ""));
    this.inputed_numeric = num.toString();
    switch(value) {
      case 'CANCEL' :
        this.hideNumericKeyPad3();
        break;
      case 'DEL' :
        this.inputed_numeric = this.inputed_numeric.substring(0, this.inputed_numeric.length - 1);
          break;
      case 'OK' :
        console.log("-= subbutton =-");
        console.log(this.utilityService.subButton);
        this.changeDefaultPrice();
        break;
      case 'CLEAR' :
        this.inputed_numeric = '';
        break;
      case '00' :
        if(this.inputed_numeric.length < 6) {
          this.inputed_numeric = this.inputed_numeric  + '00';
        }
        this.formatInputedString();
        break;
      default :
        if(this.inputed_numeric.length < 6) {
          this.inputed_numeric += value;
        }
        console.clear();
        console.log('lenght ' + this.inputed_numeric.length)
        this.formatInputedString();
        break;
    }
  }

  getbuttonValueQuantity4(value){
    if(this.inputed_numeric != "") {
      let num = Number(this.inputed_numeric.replace(":", ""));
      this.inputed_numeric = num.toString();
    }
    switch(value) {
      case 'CANCEL' :
        this.hideNumericKeyPad4();
        break;
      case 'DEL' :
        this.inputed_numeric = this.inputed_numeric.substring(0, this.inputed_numeric.length - 1);
          break;
      case 'OK' :
        console.log("-= subbutton =-");
        console.log(this.utilityService.subButton);
        this.addDelay();
        break;
      case 'CLEAR' :
        this.inputed_numeric = '';
        break;
      case '00' :
        if(this.inputed_numeric.length < 3) {
          this.inputed_numeric = this.inputed_numeric  + '00';
        }
        this.formatInputedStringToTime();
        break;
      default :
        if(this.inputed_numeric.length < 4) {
          this.inputed_numeric += value;
        }
        console.clear();
        console.log('lenght ' + this.inputed_numeric.length);
        this.formatInputedStringToTime();
        break;
    }
  }

  formatInputedStringToTime(){
    if(!(this.inputed_numeric.indexOf('.') > -1)){
      if(this.timeStatus != 'minutes'){
        var len = this.inputed_numeric.length;
        if(len == 1){
          this.inputed_numeric = '00:0' + this.inputed_numeric;
        }else if(len == 2){
          this.inputed_numeric = '00:' + this.inputed_numeric;
        }else{
          this.inputed_numeric = this.inputed_numeric.substring(0, len-2) + ":" + this.inputed_numeric.substring(len-2);
          if(len == 3){
            this.inputed_numeric = '0' + this.inputed_numeric;
          }
        } 
      }
      
    }
  }

  formatInputedString(){
    if(!(this.inputed_numeric.indexOf('.') > -1)){
      var len = this.inputed_numeric.length;
      if(len == 1){
        this.inputed_numeric = '0.0' + this.inputed_numeric;
      }else if(len == 2){
        this.inputed_numeric = '0.' + this.inputed_numeric;
      }else if(len > 2){
        this.inputed_numeric = this.inputed_numeric.substring(0, len-2) + "." + this.inputed_numeric.substring(len-2);
      }
      
    }
  }

  saveItemDefaultPrice() {
    if(this.inputed_numeric == '' || this.inputed_numeric == '0000' || this.inputed_numeric == '000' || this.inputed_numeric == '00' || this.inputed_numeric == '0' || this.inputed_numeric.length > 4) {
      this.toastr.error('Please input value');
    } else {
      this.setNewButtonCounter();
      this.hideNumericKeyPad();
    }
  }


  getItemName(value, itemId, itemPrice,functionIndex,itemCount = -1,minSecLevel,askForSupervisor) {
    let ButtonText = value;
    let ItemId = itemId;
    let ItemPrice = itemPrice;
    let FunctionIndex = functionIndex;
    let ItemCount = itemCount;
    let MinSecLevel = minSecLevel;
    this.utilityService._itemNameData  = { ButtonText, ItemId, ItemPrice, FunctionIndex, ItemCount, MinSecLevel} as ItemNameData;

    if(this.utilityService.access_grandtedby_supervisor == true) {
      this.addItem(this.utilityService._itemNameData);
      this.utilityService.access_grandtedby_supervisor = false;
    } else {
      if(minSecLevel > this.utilityService.currentUserSecurityLevel) {
        this.showDialogNotAuthorized();
      } else {
        if(askForSupervisor) {
          if(minSecLevel < this.utilityService.currentUserSecurityLevel){
            this.addItem(this.utilityService._itemNameData);
          } else {
            this.showDialogAskForSupervisor();
          }
        } else {
          this.addItem(this.utilityService._itemNameData);
        }
      }   
    }  
  } 

  changeDefaultPrice(){

    const _apiRoute = this.utilityService.getApiRoute('ChangeItemPrice');
    const ApiURL = this.utilityService.localBaseAddress + _apiRoute;

    var _itemPrice = {
          ItemID: this.utilityService._itemNameData.ItemId,
          DefaultPrice: Number(this.inputed_numeric)
        } as IItemPrice;

    this.service.changeItemPrice(_itemPrice, ApiURL)
      .subscribe(data => {
        console.log("return value ChangeItemPrice");
        console.log(data);
        this.toastr.success("Successfully Saved!","Information", {timeOut: 2000});


      }, error => {
        console.log(error);
      }, () => {

        this.formatInputedString();
        
        for (var x = 0; x < Object.keys(this.utilityService.subButton).length; x++){
          var subBtn = this.utilityService.subButton[x].Buttons;
          for(var y = 0; y < Object.keys(subBtn).length; y++){
            if(this.utilityService.subButton[x].Buttons[y].SubButtonID == this.utilityService._itemNameData.ItemId){
              this.utilityService.subButton[x].Buttons[y].ItemPrice = '$'+this.inputed_numeric;
              console.log('equal data: '+this.utilityService.subButton[x].Buttons[y].SubButtonID);
              //this.utilityService.subButton[x].Buttons[y].ItemCount = this.utilityService.selectedSubButton.ItemCount;
              this.hideNumericKeyPad3();
            }
          }
        }

      }
    );
  }

  addItem(itemData : ItemNameData){
    console.log(itemData);
    if(itemData.MinSecLevel > this.utilityService.currentUserSecurityLevel)
    {
      this.showDialogNotAuthorized();
    } else {
      this.endTime = new Date();
      let timeDiff = this.endTime - this.startTime; //in ms
      // strip the ms
      timeDiff /= 1000;
  
      // get seconds 
      let seconds = Math.round(timeDiff);
      console.log(seconds + " seconds || startTime: "+this.startTime);
      if(seconds < 1 || this.startTime == 0 || this.startTime == undefined){
        if(itemData.FunctionIndex!=-1){
          this.getFunctionButton(itemData.FunctionIndex,itemData.ButtonText);
          this.utilityService.access_grandtedby_supervisor = false;      
        } else {
          if(itemData.ButtonText === 'Cancel Sale') {
            this.cancelSale();
          }
          else if(itemData.ButtonText== "Print Check") {
            this.printOrder();
          } 
          else {
            if(itemData.ItemId === '00000000-0000-0000-0000-000000000000') {
              this.toastr.info(itemData.ButtonText + ' Not yet implemented',"Information", {timeOut: 2000});
            } else {
              
              if(this.adjustQtyClicked){
  
                this.utilityService.itemIDSelected = itemData.ItemId;
                this.adjustQtyClicked = false;
                this.utilityService.splitEven = 0;
                this.showNumericKeyPad();
                /* const dialogConfig = new MatDialogConfig();
                const dialogRef = this.dialog.open(PinpadwholeComponent, dialogConfig);
  
                dialogRef.afterClosed().subscribe(
                    data => {
                      this.setNewButtonCounter();
                    }
                );  */
  
              }else if(this.resetSelection){
                this.resetSelection = false;
                this.deductQty(this.utilityService.itemIDSelected, -1, true);
              }else if(this.changePriceStatus){
                this.changePriceStatus = false;
                this.showNumericKeyPad3();
              }else{
  
                if (itemData.ItemCount > 0){
  
                  var continueLoop = true;
                  for(var a = 0; a<Object.keys(this.utilityService._buttons).length && continueLoop; a++){
                    for (var x = 0; x < Object.keys(this.utilityService._buttons[a].SubButtons).length && continueLoop; x++){
                      var subBtn = this.utilityService._buttons[a].SubButtons[x].Buttons;
                      for(var y = 0; y<Object.keys(subBtn).length && continueLoop; y++){
                        var forOutput = this.utilityService._buttons[a].SubButtons[x].Buttons[y];
                        //console.log(forOutput.ButtonText + " = " +forOutput.ItemCount);
                        if(this.utilityService._buttons[a].SubButtons[x].Buttons[y].SubButtonID == itemData.ItemId){
                          continueLoop = false;
                          var qty = this.utilityService._buttons[a].SubButtons[x].Buttons[y].ItemCount - 1;
                          this.utilityService._buttons[a].SubButtons[x].Buttons[y].ItemCount = qty;
  
                          this.deductQty(this.utilityService.itemIDSelected, qty, false);
  
                          if(this.utilityService.globalInstance.SelectedTableName == null) {
                            this.toastr.warning('Please select table to add order.',"Warning", {timeOut: 2000});
                          } else {
                            this.utilityService._itemName = null;
                            if (this.utilityService._selectedSeatOrderUI != null) {
                              this.utilityService._itemName = itemData.ButtonText;
                              this.utilityService._isMenuItemClick = true;
                              const checknumberstr = this.utilityService.globalInstance.SelectedSaleId + "";
                              let filteredItems = this.utilityService.fireAllList.filter(function(item) {
                                return item !== checknumberstr
                              });
                              this.utilityService.fireAllList = filteredItems;
                              // tslint:disable-next-line: max-line-length
                              this.addOrder(this.utilityService.globalInstance.SelectedSaleId, this.utilityService._itemName, null, null, this.utilityService._selectedSeatOrderUI.toString().replace('Seat ', ''), this.utilityService._selectedCustomerIdOrderUI, itemData.ItemId, itemData.ItemPrice);
                            } else {
                              this.toastr.error('Please select a seat',"Error", {timeOut: 2000});
                            }
                          }
                        }
                      }
                      
                    }
                  }
  
                } else if(itemData.ItemCount == 0){
                  this.toastr.warning('Sorry, No Available Items.',"Warning", {timeOut: 3000});
                }else{
                  if(this.utilityService.globalInstance.SelectedTableName == null) {
                   /*  this.toastr.warning('Please select table to add order.',"Warning", {timeOut: 2000}); */
                    this.newOrderThenAddItem(itemData.ButtonText,itemData.ItemId,itemData.ItemPrice)
                  } else {
                    this.utilityService._itemName = null;
                    if (this.utilityService._selectedSeatOrderUI != null) {
                      this.utilityService._itemName = itemData.ButtonText;
                      this.utilityService._isMenuItemClick = true;
                      const checknumberstr = this.utilityService.globalInstance.SelectedSaleId + "";
                      let filteredItems = this.utilityService.fireAllList.filter(function(item) {
                        return item !== checknumberstr
                      });
                      this.utilityService.fireAllList = filteredItems;
                      // tslint:disable-next-line: max-line-length
                      this.addOrder(this.utilityService.globalInstance.SelectedSaleId, this.utilityService._itemName, null, null, this.utilityService._selectedSeatOrderUI.toString().replace('Seat ', ''), this.utilityService._selectedCustomerIdOrderUI, itemData.ItemId, itemData.ItemPrice);
                    } else {
                      this.toastr.error('Please select a seat',"Error", {timeOut: 2000});
                    }
                  }
                }
              }           
            }
          } 
        }
      }
    }
  }

  newOrderThenAddItem(buttonText,itemId,ItemPrice){
    if(this.utilityService.isproccessing == false) {
      this.utilityService.isproccessing = true;
      let currentEmpId = this.utilityService.globalInstance.CurrentUser.EmpID;
      this.service.newOrder({ currentEmpId},this.utilityService.localBaseAddress + 'api/v1/saleitem/NewOrder')
      .subscribe(data => {
       this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = JSON.parse(data['result']);
       console.log(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems );
       console.log('SaleID' + this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SaleId)
      /*  this.getOpenChecks(currentEmpId,null); */
       console.log(this.utilityService.openChecks);
      },error=> {
        this.toastr.error(error,"Error", {timeOut:3000});
      },()=>{
        console.clear();
        this.utilityService.globalInstance.SelectedSaleId = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SaleId;
        this.utilityService.globalInstance.SelectedTableName = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].TableName;
        this.utilityService.globalInstance.SelectedLayoutTableId = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SelectedLayoutTableId;
        this.utilityService.globalInstance.SelectedCheckNumber = this.utilityService.globalInstance.SelectedTableDetail.Checknumber;
        console.log(this.utilityService.globalInstance.SelectedTableName);
        this._css_Selected_table_speedBar(this.utilityService.globalInstance.SelectedTableName, this.utilityService.globalInstance.SelectedSaleId,this.utilityService.globalInstance.SelectedLayoutTableId,this.utilityService.globalInstance.SelectedCheckNumber);
      
        this.utilityService._itemName = buttonText;
        this.utilityService._isMenuItemClick = true;
      const checknumberstr = this.utilityService.globalInstance.SelectedSaleId + "";
      let filteredItems = this.utilityService.fireAllList.filter(function(item) {
        return item !== checknumberstr
      });
      this.utilityService.fireAllList = filteredItems;
      this.utilityService._selectedSeatOrderUI = 1;
      this.utilityService.isproccessing = false;
      this.addOrder(this.utilityService.globalInstance.SelectedSaleId, this.utilityService._itemName, null, null, this.utilityService._selectedSeatOrderUI.toString().replace
      ('Seat ', ''), this.utilityService._selectedCustomerIdOrderUI, itemId, ItemPrice);
      });
    } else {
      this.toastr.warning('Processing','Warning',{timeOut:3000});
    } 
  }

/*   getItemName(value, itemId, ItemPrice,functionIndex) {
    this.endTime = new Date();
    let timeDiff = this.endTime - this.startTime; //in ms
    // strip the ms
    timeDiff /= 1000;

    // get seconds 
    let seconds = Math.round(timeDiff);
    console.log(seconds + " seconds || startTime: "+this.startTime);
    if(seconds < 1 || this.startTime == 0 || this.startTime == undefined){
      if(functionIndex!=-1){
        this.getFunctionButton(functionIndex,value);      
      } else {
        if(value === 'Cancel Sale') {
          this.cancelSale();
        }
        else if(value== "Print Check") {
          this.printOrder();
        } 
        else {
          if(itemId === '00000000-0000-0000-0000-000000000000') {
            this.toastr.info(value + ' Not yet implemented',"Information", {timeOut: 2000});
          } else {
  
            if(this.utilityService.globalInstance.SelectedTableName == null) {
              this.toastr.warning('Please select table to add order.',"Warning", {timeOut: 2000});
            } else {
              this.utilityService._itemName = null;
              if (this.utilityService._selectedSeatOrderUI != null) {
                this.utilityService._itemName = value;
                this.utilityService._isMenuItemClick = true;
                const checknumberstr = this.utilityService._posChecknumber + "";
                let filteredItems = this.utilityService.fireAllList.filter(function(item) {
                  return item !== checknumberstr
                });
                this.utilityService.fireAllList = filteredItems;
                // tslint:disable-next-line: max-line-length
                this.addOrder(this.utilityService._posChecknumber, this.utilityService._itemName, null, null, this.utilityService._selectedSeatOrderUI.toString().replace('Seat ', ''), this.utilityService._selectedCustomerIdOrderUI, itemId, ItemPrice);
              } else {
                this.toastr.error('Please select a seat',"Error", {timeOut: 2000});
              }
            }
          }
        } 
      }
    }
  }
 */
  addOrder(SaleId, ItemName, Comment, jSonComment, SelectedSeat, SelectedCustomerId, ItemId, ItemPrice) {
    if(this.utilityService.isproccessing == false) {
      console.clear();
      this.utilityService.isproccessing = true;
      let IsOnline = this.utilityService.isServerOnline;
      let CourseNo = this.selectedCourseNo;
      const _addOrder: Order = { SaleId, ItemName, Comment, jSonComment, SelectedSeat, SelectedCustomerId, ItemPrice, ItemId,IsOnline, CourseNo} as Order;
      this.service.addOrder(_addOrder, this.utilityService.localBaseAddress + 'api/v1/saleitem/Orders')
      .subscribe(data => {
        this.utilityService._menuItemObject = JSON.parse(data['result']);
        console.log(this.utilityService._menuItemObject.Items);
      }, error => {
         this.toastr.error(error);
      }, () => {
          if (this.utilityService._menuItemObject.HasModifier) {
        /*     this.utilityService.modArray.push(ItemId); */
            const _dicItem : dictItem = {} as any;
            _dicItem.ItemHeaderName = 'ParentMod';
            _dicItem.MaxSelect = 1;
            _dicItem.ItemID = ItemId;
            _dicItem.ModifierDesc = 'ParentMod';
            _dicItem.ModifierIndex = -1;
            _dicItem.ItemModifierID = ItemId;
            _dicItem.ItemName = 'ParentMod';
            _dicItem.MinSelect = 1;
            _dicItem.UseMaxSelect = true;
            _dicItem.UseMinSelect = true;
            this.utilityService.dicItemViewModel.push(_dicItem);


        /*     const mod: SubModifierViewModel = {} as any;
            mod.ItemID = ItemId;
            mod.ModifierDesc = 'ParentMod';
            mod.ModifierIndex = -1;
            mod.ItemModifierID = ItemId;
            mod.ItemName = 'ParentMod';
            this.utilityService.subModifierViewModel.push(mod); */
            this.utilityService.screen = 'multiColumnModifier';
          } else {
            this.myItemName = ItemName;
            this.myItemID = ItemId;
            this.reloadGuestCheckWindow(SaleId, this.utilityService.globalInstance.SelectedTableName, SelectedSeat);
            this.utilityService.access_grandtedby_supervisor = false;
            this.toastr.success(ItemName + ' is successfully added to seat ' + SelectedSeat, '', {timeOut: 2000});
           /*       this.openSnackBar(ItemName + ' is successfully added to seat ' + SelectedSeat,'green-snackbar'); */
          }
          this._menuItem_status(this.utilityService._itemName, null, null, null, null);
          this.selectedMenuID = 'selectedMenuID-' + ItemId;
          var myVar = setInterval(() => {
            var objDiv = document.getElementById(this.selectedMenuID);
            if (this.selectedMenuID !== '' && objDiv != undefined && objDiv != null) {
              console.log(objDiv);
              this.countMenuRows();
              clearInterval(myVar);
            }
          }, 1);
          this.getCoursingItemsList();
          this.utilityService.isproccessing = false;
      });
    } else {
      this.toastr.warning('Proccessing','Warning', {timeOut: 3000});
    }
  }

  newOrder(){
    if(this.utilityService.isproccessing == false) {
      let currentEmpId = this.utilityService.globalInstance.CurrentUser.EmpID;
      this.utilityService.isproccessing = true;
      this.service.newOrder({ currentEmpId},this.utilityService.localBaseAddress + 'api/v1/saleitem/NewOrder')
      .subscribe(data => {
       this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = JSON.parse(data['result']);
       console.log(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems );
       console.log('SaleID' + this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SaleId)
       this.getOpenChecks(currentEmpId,null);
       console.log(this.utilityService.openChecks);
      },error=> {
        this.toastr.error(error,"Error", {timeOut:3000});
      },()=>{
        console.clear();
        this.utilityService.globalInstance.SelectedSaleId = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SaleId;
       
        this.utilityService.globalInstance.SelectedTableName = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].TableName;
        this.utilityService.globalInstance.SelectedLayoutTableId = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SelectedLayoutTableId;
        this.utilityService.globalInstance.SelectedCheckNumber = this.utilityService.globalInstance.SelectedTableDetail.Checknumber;
        console.log('selected Table ID ' + this.utilityService.globalInstance.SelectedLayoutTableId);
        this._css_Selected_table_speedBar(this.utilityService.globalInstance.SelectedTableName, this.utilityService.globalInstance.SelectedSaleId,this.utilityService.globalInstance.SelectedLayoutTableId,this.utilityService.globalInstance.SelectedCheckNumber );
        this.utilityService.isproccessing = false;
      });
    } else {
      this.toastr.warning('Please wait, Processing','Warning',{timeOut:3000});
    }
  }

  addNextSeat(){
    let currentEmpId = this.utilityService.globalInstance.CurrentUser.EmpID;
    let saleId = this.utilityService.globalInstance.SelectedSaleId;
    this.service.addNextSeat({currentEmpId,saleId},this.utilityService.localBaseAddress + 'api/v1/seat/AddNextSeat')
    .subscribe(data => {
      this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = JSON.parse(data['result']);
    },error=>{
      this.toastr.error(error,"Error", {timeOut:3000});
    },()=>{
      this.getCheckDetails(this.utilityService.globalInstance.SelectedSaleId, this.utilityService.globalInstance.SelectedTableName,this.utilityService.globalInstance.SelectedLayoutTableId,this.utilityService.globalInstance.SelectedCheckNumber );
    });
  }

  assignSeatQuickService() {
    let index = this.utilityService._selectedSeatOrderUI - 1;
    let existingCus = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[index].Description
    if(existingCus != ''){
      this.openassignSeatConfirmation();
    } else {
      this.saveCustomerOnSeat();
    }
  }

  saveCustomerOnSeat(){
    if(this.utilityService.globalInstance.SelectedLayoutTableId == null){
      this.toastr.error('ERROR','No Selected Table')
      return;
    }
    const SelectedValue = this.myControl.value.CustomerId;
    this.utilityService.globalInstance.SelectedCustomerId = SelectedValue;
    this.utilityService.selectedSeat = this.utilityService._selectedSeatOrderUI;
    let saveSeat : SaveSeat = {} as any;
    saveSeat.SaleID = this.utilityService.globalInstance.SelectedSaleId;
    saveSeat.CurrentUser = this.utilityService.globalInstance.CurrentUser.EmpID;
    saveSeat.CustomerId = this.utilityService.globalInstance.SelectedCustomerId;
  /*   saveSeat.Mealplan = this.utilityService.selectedMealPlan; */
    saveSeat.Seatnumber = this.utilityService.selectedSeat;
    saveSeat.LayoutTableId =  this.utilityService.globalInstance.SelectedLayoutTableId;
   
    saveSeat.Checknumber = 0;
    saveSeat.EmployeeName = this.utilityService.globalInstance.CurrentUser.LastName + ' ' + this.utilityService.globalInstance.CurrentUser.FirstName;


    console.log(saveSeat);
    console.log(this.utilityService._selectedSeatOrderUI);

    this.service.assignSeatQuickService(saveSeat,this.utilityService.localBaseAddress + 'api/v1/seat/AssignSeatQuickService')
    .subscribe(data => {
      console.log(JSON.parse(data['result']));
    },error=>{
      this.toastr.error('Error',error,{timeOut:3000})
    },()=>{
      this.closelookUpResident();
      this.reloadGuestCheckWindow(saveSeat.SaleID, this.utilityService.globalInstance.SelectedTableName, saveSeat.Seatnumber = "");
      this.utilityService.globalInstance.SelectedCustomerId = '';
      this.hideassignSeatConfirmation();
    });
  }

  more(){
    this.openCusInfo();
   /*  if(this.utilityService.globalInstance.SelectedCustomerId == null) {
      this.toastr.warning('Please select customer','Warning', { timeOut : 3000});
    } else {
     
    } */
  }

 scroll(value) {
      const element = document.querySelector('#' + value);
      element.scrollIntoView();
   }
   append(SelectedSeat)  {
    this.myHtml = this.myHtml + this.appendItemName();
  }


  private reloadGuestCheckWindow(saleid, tablename, SeatNumber = "") {
    let _currentEmpId = -1;
    if(!this.utilityService.ByManager) {
      _currentEmpId = this.utilityService.globalInstance.CurrentUser.EmpID;
    } 
    this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = null;
    const _apiRoute = this.utilityService.getApiRoute('GetCustomerMealPlanDetailURL');
    this.service.getMealPlanCustomerDetail(this.utilityService.localBaseAddress + _apiRoute, this.utilityService.globalInstance.SelectedSaleId, _currentEmpId)
    .subscribe(data => {
      this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = JSON.parse(data['result']);
      console.log(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems);
    }, error => {
      this.toastr.error(error,"Error", {timeOut: 2000});
    }, () => {
      this.utilityService.orderType = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].OrderType;
      this.utilityService.globalInstance.SelectedCheckNumber = this.utilityService.globalInstance.SelectedTableDetail.Checknumber;
      this.clearSelectedItemIndexes();
      this.utilityService.globalInstance.SelectedTableName = tablename;
      this.utilityService._selectedTableSpeerBar = tablename;
      this.utilityService.grandtotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].GrandTotal;
      this.utilityService.discounttotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].DiscountTotal;
      this.utilityService.totalTax = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].TaxTotal;
      this.utilityService.subTotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SubTotal;
      this._css_Selected_table_speedBar(this.utilityService.globalInstance.SelectedTableName,saleid,this.utilityService.globalInstance.SelectedLayoutTableId,this.utilityService.globalInstance.SelectedCheckNumber );
      localStorage.setItem('tableSelectedCheckNumber', saleid);
      if(!this.utilityService.ByManager) {
        this.getOpenChecks(this.utilityService.globalInstance.CurrentUser.EmpID,null);
      } else {
        this.getOpenChecksByManager(null);
      }

      if(SeatNumber != ""){
        this.utilityService._selectedSeatOrderUI = Number(SeatNumber);
        var myVar = setInterval(() => {
          var objDiv = document.getElementById(this.selectedMenuID);
          if (this.selectedMenuID !== '' && objDiv != undefined && objDiv != null) {
            console.log(objDiv);
            this.countMenuRows();
            clearInterval(myVar);
          }
        }, 1);
      }
      
      
    });
  }

  _menuItem_status(value, buttonColor, top, bottom, fontcolor, itemID = null) {
    let styles;
    let fontsize;

    if(top == null) {
      top = '#ffffff';
    }

    if(bottom == null){
      bottom = '#ffffff';
    }


    if(itemID != null && itemID != undefined){
      let div = document.getElementById(itemID);
      let inputDiv = (<HTMLInputElement>document.getElementById("btn-"+itemID));
      if(div != null && div != undefined){
        let itemwidth = div.getAttribute('itemwidth');
        let splitted = itemwidth.split("-", 3);
        let colspan = Number(splitted[2]);
        if(colspan > 8){
          fontsize = "37px";
        }else if(inputDiv.value.length > 14 && colspan > 4){
          fontsize = "27px";
        }else if(inputDiv.value.length < 14 && colspan > 4){
          fontsize = "37px";
        }else if(inputDiv.value.length >= 10 && colspan > 2){
          fontsize = "27px";
        }else if(inputDiv.value.length < 10 && colspan > 2){
          fontsize = "37px";
        }else{         
          if(value.length >= 15){
            fontsize = "13px";
          } else {
            fontsize = "17px";
          }
        }
      }else{
        if(value.length >= 15){
          fontsize = "13px";
        } else {
          fontsize = "17px";
        }
      }
    }else{
      if(value.length >= 15){
        fontsize = "13px";
      } else {
        fontsize = "17px";
      }
    }
    if (value === this.utilityService._itemName) {
      styles = {
        //'background-color' : '#007bff',
        'font-size' : fontsize,
        'white-space' : 'normal',
        'word-wrap' : 'break-word',
        'color' : '#dbeb34', 
        'background' : 'linear-gradient(to right,#000066,#1d3bb2)',
        'border-width': '3px',
        'margin-top' : '0px',
        'font-weight' : 'bold',
        'height' : this.buttonSettings[2].RowHeight
      };
    } else {
      styles = {
        //'background-color' : '#80aedf',
        'font-size' : fontsize,
        'white-space' : 'normal',
        'word-wrap' : 'break-word',
        'color' : '#' + fontcolor, 
        'background' : 'linear-gradient(135deg,' + top + ',' + bottom + ')',
        'margin-top' : '0px',
        'font-weight' : 'bold',
        'height' : this.buttonSettings[2].RowHeight
      };
    }
    return styles;
  }

  loadMenuItems(){
    this.itemRows = {};
  
    for (const menuItem of this.utilityService._menuDescription) {
      const _apiRoute = this.utilityService.getApiRoute('GetMenuItems');
      // tslint:disable-next-line: max-line-length
      this.service.getMenuItems(this.utilityService.localBaseAddress + _apiRoute + '/' + menuItem.MenuDescription + '/' + menuItem.MenuButtonID)
      .subscribe(data => {
        
        this.itemRows[menuItem.MenuButtonID]= {
                                                "menuItemButton":JSON.parse(data['result']),
                                                "totalItemCount":JSON.parse(data['result']).Total,
                                                "hasMenuItems":true
                                              };
        this.itemRows[menuItem.MenuButtonID]["totalItemCount"] = this.itemRows[menuItem.MenuButtonID]["menuItemButton"].Total;
        this.itemRows[menuItem.MenuButtonID]["hasMenuItems"] = true;
        this.clickNewMenu = true;
     
      }, error => {
        this.toastr.error(error,"Error", {timeOut: 2000});
      }, () => {
        if(this.utilityService._menuDescription[0].MenuButtonID == menuItem.MenuButtonID){
          this.utilityService._menuItemButton = this.itemRows[menuItem.MenuButtonID]["menuItemButton"];
          this.utilityService._menuItems = this.utilityService._menuItemButton.Items;
          this.utilityService._totalItemCount = this.itemRows[menuItem.MenuButtonID]["totalItemCount"];
          this.utilityService.hasMenuItems = this.itemRows[menuItem.MenuButtonID]["hasMenuItems"];
          console.log('HHHHH ' + menuItem.MenuButtonID + "| " + menuItem.MenuDescription);
        }
        console.log("MenuItemButton");
        console.log(this.itemRows);
        
      });
      
    }
    console.log('done loading menu items');
    console.log(this.itemRows);
  }
  menuItemGoTo(meal, buttonId, defaultMenu) {
    if(meal == "Cancel Sale") {
      this.showConfirmation();
    } else if(meal == "Print Check") {
      this.printOrder();
    } else {
      if (defaultMenu) {
        this.utilityService._buttonId = this.utilityService.defaultMenuButtonID;
        this.utilityService._menuName = this.utilityService.defaultMenu;
      } else {
        this.utilityService._buttonId = buttonId;
        this.utilityService._menuName = meal;
      }
      this.getMenuItems(this.utilityService._menuName, this.utilityService._buttonId);
      this._menu_status(this.utilityService._menuName);
    }
  }

  printOrder(){
    this.utilityService.okButtonOnly =false;
    this.utilityService.confirmMessage = "Would you like to Print the Check " + this.utilityService.globalInstance.SelectedCheckNumber  + " ?";
    const dialogRef = this.dialog.open(ConfirmationComponent, {panelClass: 'remove-special'});
    dialogRef.afterClosed().subscribe(
      data => {
        if(this.utilityService.confirmResult){
          if(this.utilityService.isServerOnline){
            let SaleIds = new Array();
            SaleIds.push(this.utilityService.globalInstance.SelectedSaleId);
            console.log(this.utilityService.globalInstance.SelectedSaleId);
            let IsConsolidated: boolean = false;
            const _printCheckParam: PrintCheck = { SaleIds ,IsConsolidated} as PrintCheck;
            let message: string;
            const _apiRoute = this.utilityService.getApiRoute('PrintCheck');
            this.service.printCheck(_printCheckParam, this.utilityService.localBaseAddress + _apiRoute).subscribe(data => {
              console.log('printing.... ' + data['message']);
              message = data['message'];
            }, error => {
              this.toastr.error(error,"Error", {timeOut: 2000});
            }, () => {
              if (message === 'Success') {
                this.toastr.success("Check successfully sent to printer!","Success", {timeOut: 2000});
                this.clearSelectedItemIndexes();
              } else if (message === 'No orders to be print') {
                this.toastr.warning(message,"Warning", {timeOut: 2000});
              } else {
                this.toastr.warning(message,"Warning", {timeOut: 2000});
              }
            });
          }else{
            this.toastr.info("Cannot print check, you're currently offline.","Info", {timeOut: 3000});
          }
        }
      }
    );
  }

getMenuItems(menu, buttonId) {
  
  this.utilityService._menuItemButton = this.itemRows[buttonId]["menuItemButton"];
  this.utilityService._menuItems = this.utilityService._menuItemButton.Items;
  this.utilityService._totalItemCount = this.itemRows[buttonId]["totalItemCount"];
  this.utilityService.hasMenuItems = this.itemRows[buttonId]["hasMenuItems"];

  this.clickNewMenu = true;

  console.log(this.utilityService._menuItemButton);
  this.utilityService._menuName = menu;
  console.log(this.utilityService._itemName);
  this._menuItem_status(this.utilityService._itemName, null, null, null, null);
   let count = 0;
   let rowCount = 0;
   for (const item of this.utilityService._menuItems) {
     ++rowCount;
     for (const i of item.Items) {
       ++count;
      if (i.ItemDescription.length > 14) {
        this.menuItemStatus = 'btn-menu-item-large';
      } else if (i.ItemDescription.length > 9 && this.menuItemStatus !== 'btn-menu-item-large') {
        this.menuItemStatus = 'btn-menu-item-large';
      }
     }
  }
}

getClassInfo(type: string) {
  if (type === 'menuitem') {
    return this.menuItemStatus;
  } else {
    return this.menuDescStatus;
  }
}

  getTotalPages(totalItem): number {
    const _pages = Math.round(totalItem / 28);
    const _remainder = totalItem % 28;
    const _extraPage = _remainder === 0 ? 0 : 1;
    return _pages + _extraPage;
  }
  groupBy(data, property) {
    return data.reduce((acc, obj) => {
      const key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  }

  selectedButton(text,functionIndex){
    if(functionIndex== 7){
      if(text == "Apply 2 Courses"){
        this.applyCoursing(2);
      } else if(text == "Apply 3 Courses"){
        this.applyCoursing(3);
      }else{
        this.executeFunctionButton(text,true);
      }
      
    } else {
      this.varSelectedbuttonText = text;
      let selectedbutton = this.utilityService._buttons.find(c=>c.ButtonText == text);
      this.utilityService.subButton = selectedbutton.SubButtons;
      this.utilityService._totalItemCount = selectedbutton.TotalButton;
      this.utilityService._menuName = text;
      console.log(selectedbutton.SubButtons);
      console.log(this.utilityService._totalItemCount);
    }
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
        'margin-top' : '10px',
        'font-weight' : 'bold',
        'height' : this.buttonSettings[1].RowHeight
      };
    } else {
      styles = {
        'background-color' : '#80aedf',
        'font-size' : '18px',
        'white-space' : 'normal',
        'word-wrap' : 'break-word',
        'color' : '#fff',
        'background' : 'linear-gradient(135deg,#1E86FF,#8a968b)',
        'margin-top' : '10px',
        'font-weight' : 'bold',
        'height' : this.buttonSettings[1].RowHeight
      };
    }
    return styles;
  }

  _css_navigation_buttons(width){
    let styles;
    styles = {
      'width':width+'px',
      'padding': '3px',
      'display': 'inline-block'
    };
    return styles;
  }

  _css_menu_buttons(){
    let styles;
    styles = {
      'padding':'0px 0px 10px 0px'
    };
    return styles;
  }

  _css_menu_item_buttons(){
    let styles;
    if(this.utilityService._menuDescription.length > this.buttonSettings[1].ColumnCount){
      styles = {
        'height':'55vh'
      };
    }else{
      styles = {
        'height':'55vh'
      };
    }
    return styles;
  }

_css_Selected_table_speedBar(value,saleid,layoutTableId,checknumber) {
/*     console.log(value); */
    let styles;
    if (value === this.utilityService.globalInstance.SelectedTableName && saleid == this.utilityService.globalInstance.SelectedSaleId) {
      styles = {
        'background-color' : 'midnightblue',
        'color' : 'white'
      };
     /*  this.utilityService.reloadChecknumberWhenOnline = checknumber; */
     this.utilityService.globalInstance.SelectedLayoutTableId = layoutTableId;
     this.utilityService.globalInstance.SelectedCheckNumber = checknumber;
    } else {
      styles = {
        'color' : 'gray'
      };
    }
    return styles;
  }

  _css_selectedSeatOrderUI_Highlight(value) {
    if(this.utilityService._selectedSeatOrderUI == 0){
      this.utilityService._selectedSeatOrderUI = value;
    }

    let styles;
    if (value.includes(this.utilityService._selectedSeatOrderUI)) {
      styles = {
        'color': 'black',
        'font-size' : '23px',
         'background-color' : '#ADD8E6',
         'border-top-style': 'groove'
/*         'text-align' : 'center' */
        };
    } else {
      styles = {
        'color': 'black',
        'font-size' : '20px',
        'border-top-style': 'groove'
        };
    }
    return styles;
  }

  getSelectedSeat_OrderUI(_selectedSeat, _customerId, applyCoursing = 0, _saleId = 0) {
    
	  this.utilityService._selectedSeatOrderUI = _selectedSeat.replace("Seat", "");

	  this.utilityService._selectedCustomerIdOrderUI = _customerId;
    /*if(applyCoursing > 0){
      this.selectedCourseNo = 1;
    }else{
      this.selectedCourseNo = 0;
    }*/
    this.selectedCourseNo = 0;
    /*if(this.forTransferSaleitem != ""){
      this.transferItemsToOtherCheckCourseItems(_customerId, _saleId);
    }*/
    this.forTransferCustomerNumber = _customerId;
    this.forTransferSaleID = _saleId;

	  this._css_selectedSeatOrderUI_Highlight(_selectedSeat);
	  this.toastr.success('You selected seat number ', _selectedSeat, {timeOut: 2000});
	  for (let i = 0; this.utilityService.array.length > i ; i++) {
		  document.getElementById('itemDiv' + this.utilityService.array[i]).removeAttribute('class');
	  }
	  this.clearSelectedItemIndexes();
  }

  _css_enable_green_dot(value, remotePrns , sentToKitchen) {
    let styles;
    if(sentToKitchen) {
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
    return styles;
  }


  saveCompensation(){
    const _apiRoute = this.utilityService.getApiRoute('SaveSaleCompensation');
    const ApiURL = this.utilityService.localBaseAddress + _apiRoute;

    /*console.log("saleItemArray");
    console.log(this.utilityService.saleItemArray);*/

    for (var i = 0; i < this.utilityService.saleItemArray.length; i++){
      var saleitem = this.utilityService.saleItemArray[i];
      var saleitemPrice;
      var dollar;
      for (var x = 0; x < Object.keys(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems).length; x++){
        var menu = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[x];
        for (var y = 0; y < Object.keys(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[x].GetMenuItems).length; y++){
          var saleitemid = (menu.GetMenuItems[y].SaleItemId);
          if(saleitemid == saleitem){
            saleitemPrice = Number(menu.GetMenuItems[y].Price.replace(/[^0-9.-]+/g,""));
          }
        }
      }
      let saleDiscount:ISaleDiscount;

        saleDiscount = {
        DiscountIndex: 0,
        Amount: saleitemPrice,
        ReasonIndex: this.reasonId,
        MaxAmount: 0,
       /*  CheckNumber: this.utilityService._posChecknumber, */
        SaleItemID: saleitem,
        SaleID : this.utilityService.globalInstance.SelectedSaleId
      } as ISaleDiscount; 

/*       saleDiscount = {
        DiscountIndex: 0,
        Amount: Number(this.utilityService.selectedItemPrice.replace(/[^0-9.-]+/g,"")),
        ReasonIndex: this.reasonId,
        MaxAmount: 0,
        CheckNumber: this.utilityService._posChecknumber,
        SaleItemID: this.utilityService.selectedItemId
      } as ISaleDiscount; */

      this.service.saveSaleCompensation(saleDiscount, ApiURL)
        .subscribe(result => {
          console.log(result);
        }, error => {
          console.log(error);
        }, () => {
          console.log("done saving");
          this.closeReasonCompModal();
        }
      );

      console.log("saving saleCompensation");
      console.log("i:"+i+" total:"+this.utilityService.saleItemArray.length);
      console.log(saleDiscount);
    }
  }

  showDialogAutoPay(){
    this.diaglogAutopaySale.show();
  }
  hideDialogAutoPay() {
    this.diaglogAutopaySale.hide();
  }

  showDialogCancelSale(){
    this.diaglogCancelSale.show();
  }
  hideDialogCancelSale() {
    this.diaglogCancelSale.hide();
  }

  showDialogDatePicker(){
    this.dialogDatePicker.show();
  }
  hideDialogDatePicker() {
    this.inputed_date = "";
    this.dialogDatePicker.hide();
  }

  showConfirmation(){
   
    this.utilityService.okButtonOnly =false;
    this.utilityService.confirmMessage = "Would you like to cancel this  sale " + this.utilityService.globalInstance.SelectedSaleId  + " ?";
    const dialogRef = this.dialog.open(ConfirmationComponent, {panelClass: 'remove-special'});
    dialogRef.afterClosed().subscribe(
      data => {
        if(this.utilityService.confirmResult){
          const _apiRoute = this.utilityService.getApiRoute('CancelSale');
          const SaleId = this.utilityService.globalInstance.SelectedSaleId;
          const IsOnline = this.utilityService.isServerOnline;
          const _cancelSale : CancelSale = { SaleId,IsOnline  } as CancelSale;
          this.service.cancelSale(_cancelSale, this.utilityService.localBaseAddress + _apiRoute)
            .subscribe(data => {
            console.log(JSON.parse(data['result']))
          }, error => {
            this.toastr.error(error,"Error", {timeOut: 2000});
          }, ()=> {
            this.getOpenChecks(this.utilityService.globalInstance.CurrentUser.EmpID, null);
            this.toastr.success('Guest check ' + this.utilityService.globalInstance.SelectedCheckNumber + ' cancelled.',"Succcess", {timeOut: 2000});
            this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = [];
            this.utilityService.globalInstance.SelectedTableName = null;
            if(this.utilityService.serviceTypeDesc == 'Quick Service'){
              this.hideDialogCancelSale();
            } else {
              this.getbuttonActionRSO('BACK TO FLOOR PLANS',null,null,null,null,null,null,null);
            }
          });
        }else{
          
        }
      }
    );
  }

  selectItem(value, WasPrinted, itemId, saleItemId,isDeletable,sentToKitchen,voidReason,customerID) {
    /*if(sentToKitchen) {
      this.toastr.info('Item is already sent to kitchen, Cannot add modifier or delete','Information',{timeOut:3000})
    } else {*/
    if(voidReason > 0) {
      this.toastr.info('This item has been deleted!','Information',{timeOut:3000})
    } else {
      if (!this.utilityService.array.some(x => x === value)) {
         //document.getElementById('itemDiv' + value).className = 'highLightItem';
         let itemDivClass = document.querySelector('#itemDiv' + value);
        itemDivClass.classList.add('highLightItem');
        let itemDivClass2 = document.querySelector('#selectedMenuID-' + itemId);
        itemDivClass2.classList.add('highLightItem');
        this.utilityService.array.push(value);
        console.log(this.utilityService.array);
        localStorage.setItem('SelectedItemIndex', this.utilityService.array.toString());
        this.selectedSaleItemId = saleItemId;
        this.selectedItemId = itemId;
        this.utilityService.selectedItemId = itemId;
        this.utilityService.saleItemArray.push(saleItemId);
        this.utilityService.splitItemSelectedCustomer = customerID;
        this.itemArray.push(itemId);
        if(isDeletable) {
          this.utilityService.itemsDeletable.push(value);
          localStorage.setItem('SelectedItemIndexDeletable',this.utilityService.itemsDeletable.toString())
        }
      } else {
         //document.getElementById('itemDiv' + value).removeAttribute('class'); 
        
        let itemDivClass = document.querySelector('#itemDiv' + value);
         itemDivClass.classList.remove('highLightItem');
        let itemDivClass2 = document.querySelector('#selectedMenuID-' + itemId);
         itemDivClass2.classList.remove('highLightItem');
        const index = this.utilityService.array.indexOf(value);
        if (index !== -1) {
          this.utilityService.array.splice(index, 1);
          localStorage.setItem('SelectedItemIndex', this.utilityService.array.toString());
          this.utilityService.saleItemArray.splice(index, 1);
          this.itemArray.splice(index, 1);
        }
        const indexDeletable = this.utilityService.itemsDeletable.indexOf(value);
        if (indexDeletable !== -1) {
          this.utilityService.itemsDeletable.splice(indexDeletable, 1);
          localStorage.setItem('SelectedItemIndexDeletable', this.utilityService.itemsDeletable.toString());
        }
      }
      console.log('after clicked!');
      console.log(this.utilityService.array);
    }
    /*}*/   
}

selectedItemOnCombineCheck(selectedCheck,checknumber,takenSeat,seatCount){
  if(this.utilityService.selectedItemOnCombineCheck.length > 0){
    document.getElementById('CombineCheckID-' + this.utilityService.selectedItemOnCombineCheck).removeAttribute('class');
    this.utilityService.selectedItemOnCombineCheck='';
  }
  document.getElementById('CombineCheckID-' + selectedCheck).className = 'highLightItem';
  this.utilityService.selectedItemOnCombineCheck = selectedCheck;
  this.utilityService.selectedItemOnCombineCheckMsg = 'CHECK NUMBER : ' + checknumber;
  this.utilityService.selectedItemOnCombineCheckSeatCount = seatCount;
  this.utilityService.selectedItemOnCombineCheckTakenSeat = takenSeat;
}

  messagekitchen()
  {
    console.log('message kitchen');
  }

   deleteItem() {
     if(this.utilityService.isServerOnline) {
      var mainDiv = document.getElementById('GuestCheckDiv');
      console.log(" BEFORE DELETE mainDiv scrollHeight: "+mainDiv.scrollHeight+" scrollTop: "+mainDiv.scrollTop);
      this.scrollPosition = mainDiv.scrollTop;//mainDiv.scrollHeight;
        var tempDataMeal: GuestCheckWindow[] = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems;
        const ss = localStorage.getItem('SelectedItemIndexDeletable');
        let status: any;
        if (ss === 'null') {
            this.toastr.warning('Cannot delete seat number',"Warning", {timeOut: 2000});
        } else {
            const _apiRoute = this.utilityService.getApiRoute('DeleteItem');
            // tslint:disable-next-line: max-line-length
            this.service.deleteItem(this.utilityService.localBaseAddress + _apiRoute + this.utilityService.globalInstance.SelectedSaleId + '/' + ss + '/' + this.utilityService.isServerOnline).subscribe(data => {
              this.utilityService.openMod = JSON.parse(data['result']);
              console.log(this.utilityService.openMod);
              status = JSON.parse(data['status-code'])
            }, error => {
                this.toastr.error(error,'deleteItem ERROR',{timeOut:5000});
            }, () => {
              if(status == 200) {
                console.log('delete item ' + this.utilityService.openMod)
                if(this.utilityService.openMod.OpenMod) {
                  this.getItemName(this.utilityService.openMod.ItemName,this.utilityService.openMod.ParentItemID,'$0.00',-1,-1,2,false);
                } else {
                  console.log("called deleteItem() selectedSaleItemId= " + this.selectedSaleItemId);
                  this.getCheckDetails(this.utilityService.globalInstance.SelectedSaleId, this.utilityService.globalInstance.SelectedTableName,this.utilityService.globalInstance.SelectedLayoutTableId,this.utilityService.globalInstance.SelectedCheckNumber );
                  this.toastr.success('menu item removed',"Success", {timeOut: 2000});
                  this.clearSelectedItemIndexes();
                }

                /* if (this.selectedSaleItemId != "") {
                    this.getParentModifier(tempDataMeal);
                } */
              /*   this.addOrder(this.utilityService._posChecknumber,) */
              } else {
                this.toastr.error(status,"Error", {timeOut: 2000});
              }

              var myVar = setInterval(() => {
                var objDiv = document.getElementById('newCourse');
                if (objDiv != undefined && objDiv != null) {
                  var mainDiv = document.getElementById('GuestCheckDiv');
                  console.log(" AFTER DELETE mainDiv scrollTop: "+this.scrollPosition);
                  mainDiv.scrollTop = this.scrollPosition;
                  clearInterval(myVar);
                }
              }, 1);
                /*var mainDiv = document.getElementById('GuestCheckDiv');
                mainDiv.scrollTop = this.scrollPosition;*/

            });
        }
     } else {
        this.toastr.info('Cannot delete item while offline.','Information', {timeOut: 3000})
     }
  }

  getbuttonActionRSO(action, tablename, tableshape, seatCount, layoutTableId, takenSeats, saleid, defaultMenu) {
    this.utilityService.globalInstance.SelectedTableName == null;
    this.utilityService.isproccessing = false;
    switch (action) {
      case 'BACK TO FLOOR PLANS' :
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
        break;
      case 'Table Selected' :
        this.utilityService.globalInstance.SelectedLayoutTableId = layoutTableId;
        this.utilityService.chosenTableShape = tableshape;
        this.utilityService.menuDiv = false;
        this.utilityService.showAddOrder = false;
        this.utilityService.showMealDiv = false;
        this.utilityService.showCustomerDetail = false;
        this.utilityService.showCustomerDetail2 = false;
        this.utilityService.showButtonReAssignSeatAndRemoveSeat = false;
        this.selectedTable(saleid, seatCount, layoutTableId);
        this.utilityService.globalInstance.SelectedTableName = tablename; 
        break;
        case 'ADD ORDER':
            this.utilityService.screen = 'orderingModule' ;
            if (this.utilityService.globalInstance.SelectedSaleId != null) {
              console.log('table ' + this.utilityService.globalInstance.SelectedTableName);
              this._css_Selected_table_speedBar(this.utilityService.globalInstance.SelectedTableName,this.utilityService.globalInstance.SelectedSaleId,this.utilityService.globalInstance.SelectedLayoutTableId,0);
              if (defaultMenu) {
                // tslint:disable-next-line: max-line-length
                this.getSelectedSeat_OrderUI(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SeatNumber, this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].CustomerId);
              }
              this.getCheckDetails(this.utilityService.globalInstance.SelectedSaleId,this.utilityService.globalInstance.SelectedTableName,this.utilityService.globalInstance.SelectedLayoutTableId,null);
            }
        break;
      default:
        break;
    }
    this.utilityService.dicItemViewModel = [];
}

selectedTable(saleid, seatCount, layoutTableId): void {
    if (this.utilityService.isChangeTable) {
      if (saleid != '00000000-0000-0000-0000-000000000000') {
        this.toastr.error('Table is not available',"Error", {timeOut: 2000});
      } else {
        const largest = Math.max.apply(Math, this.utilityService.globalInstance.SelectedTableDetail.TakenSeats);
        if (largest > seatCount) {
           this.toastr.error('Cannot Change Table with less seat',"Error", {timeOut: 2000});
           this.utilityService.isChangeTable = false;
        } else {
          this.updateTable(this.utilityService.prevTableId, layoutTableId, this.utilityService.globalInstance.SelectedTableDetail.Checknumber);
        }
      }
    } else {
      this.pullcustomerList();
      this.loadSelectedTable();
    }
  }

  private iterateSeatFunction(seatCount) {
    let i = 1;
    while (i <= seatCount) {
      this.utilityService.iterateSeat.push(i);
      i++;
    }
  }

  private loadSelectedTable() {
    const _apiRoute = this.utilityService.getApiRoute('GetSelectedTableURL');
    //EDIT HERE
    this.service.selectedTable(this.utilityService.localBaseAddress+ _apiRoute, this.utilityService.globalInstance.SelectedLayoutTableId, this.utilityService.globalInstance.CurrentUser.EmpID)
    .subscribe(data => {
        this.utilityService.globalInstance.SelectedTableDetail = JSON.parse(data['result']);
        console.log('LOAD-----');
        console.log(this.utilityService.globalInstance.SelectedTableDetail);
    }, error => {
     this.toastr.error(error,"Error", {timeOut: 2000});
    }, () => {
      this.iterateSeatFunction(this.utilityService.globalInstance.SelectedTableDetail.SeatCount);

      this.utilityService.globalInstance.SelectedTableName = this.utilityService.globalInstance.SelectedTableDetail.TableName;
      this.utilityService.globalInstance.SelectedLayoutTableId = this.utilityService.globalInstance.SelectedLayoutTableId;
      this.utilityService.selectedtable = this.utilityService.globalInstance.SelectedTableDetail.TableName;
      this.utilityService.seatCount = this.utilityService.globalInstance.SelectedTableDetail.SeatCount;
      this.utilityService.selectedtableShape = this.getTableShape(this.utilityService.chosenTableShape, this.utilityService.globalInstance.SelectedTableDetail.Checknumber);
      this.utilityService.screen = 'selectedTable';
      this.loadMealPlanCustomerDetail(this.utilityService.globalInstance.SelectedSaleId);
      this.getCoursingItemsList();
      if (this.utilityService.globalInstance.SelectedTableDetail.Checknumber != null) {
        const _check = this.utilityService.globalInstance.SelectedTableDetail.Checknumber.toString();
        localStorage.setItem('tableSelectedCheckNumber', _check);
      }
      this._router.navigate(['selectedtable']);
    });
  }
  loadMealPlanCustomerDetail(saleid,SelectedSeat=0) {
    let _currentEmpId = this.utilityService.globalInstance.CurrentUser.EmpID;
    if(this.utilityService.ByManager) {
      _currentEmpId = -1;
    }
    this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = null; 
    const _apiRoute = this.utilityService.getApiRoute('GetCustomerMealPlanDetailURL');
    this.service.getMealPlanCustomerDetail(this.utilityService.localBaseAddress + _apiRoute, saleid, _currentEmpId)
    .subscribe(data => {
      this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = JSON.parse(data['result']);
    }, error => {
      return alert(error);
    }, () => {
      if (saleid != '00000000-0000-0000-0000-000000000000') {
       this.utilityService.grandtotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].GrandTotal;
       this.utilityService.totalTax = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].TaxTotal;
       this.utilityService.subTotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SubTotal;
       this.utilityService.discounttotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].DiscountTotal;
       this.utilityService.orderType = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].OrderType;
      }
      this.getCoursingItemsList();
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
  
/*   SyncSale() { 
    this.utilityService.syncProccessing = true;
    let isSuccess: any;
    let statusCode: any;
    let message: any;
  const _apiRoute = this.utilityService.getApiRoute('SyncSale');
  this.service.syncSale(this.utilityService.localBaseAddress+ _apiRoute).subscribe(data => {
    isSuccess = JSON.parse(data['IsSuccess']);
    statusCode = data['StatusCode'];
    message = data['Message'];
    console.log(statusCode);

}, error => {
  this.toastr.error(error,"Error", {timeOut: 10000});
}, () => {
  if(isSuccess && (statusCode == 201)){
    this.utilityService.SyncStatus = 'DONE';
    this.toastr.success('Offline transactions successfully uploaded to server.','SUCCESS');
    this.toastr.info(message,'Information');
    this.getOpenChecks(this.utilityService.globalInstance.CurrentUser.EmpID,null);
    this.utilityService.hasofflineOrder = false;
    this.utilityService.showSYNCSALE = false;
  } else if(!isSuccess && (statusCode == 200)){
    this.toastr.info(message,'Information');
  }

    this.utilityService.syncProccessing = false;
});
  } */
  pullcustomerList() {
  const _apiRoute = this.utilityService.getApiRoute('GetCustomerList');
  this.service.getCustomerList(this.utilityService.localBaseAddress+ _apiRoute)
    .subscribe(data => {
      this.utilityService.customerList = JSON.parse(data['result']);
      console.log(this.utilityService.customerList);
    }, error => {
      return alert(error);
    }, () => {
      this.loadCustomer();
    });
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

getGuestCheckDetailPassParams(saleid) {
  // console.clear();
  let statusCode = 0;
  const _apiRoute = this.utilityService.getApiRoute('GetGuestCheckDetail');
  this.service.getGuestCheckDetail(this.utilityService.localBaseAddress+ _apiRoute + saleid, this.utilityService.storeId)
  .subscribe(data => {
    this.utilityService.guestCheck = JSON.parse(data['result']);
    statusCode = JSON.parse(data['status-code']);
    console.log(this.utilityService.guestCheck );
  }, error => {
      this.toastr.error(error,"Error", {timeOut: 2000});
  }, () => {
      if(statusCode == 200) {
             /*  this.utilityService.patCheckNumber = this.utilityService.guestCheck[0].CheckNumber; */
        this.utilityService.patTableName = this.utilityService.guestCheck[0].TableName;
        this.utilityService.totalTax = this.utilityService.guestCheck[0].SaleSummary.TotalTax;
        this.utilityService.grandtotal = this.utilityService.guestCheck[0].SaleSummary.Total;
        this.utilityService.discounttotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].DiscountTotal;
        this._router.navigate(['patselectedcheck']);
      } else {
        this.toastr.error('Error');
      }
  });
}

getCheckDetails(saleid, tablename, layouttableid,checknumber) {
    this.utilityService.globalInstance.SelectedSaleId = saleid;
    this.utilityService.globalInstance.SelectedLayoutTableId = layouttableid;
    this.utilityService.globalInstance.SelectedCheckNumber = checknumber;
    if(this.utilityService.ByManager) {
      this.getCheckDetailsByManager(saleid,tablename,checknumber);
    } else {
      let sameChecknumber = true;
      if(saleid != this.utilityService.globalInstance.SelectedSaleId){
        sameChecknumber = false;
      }
      this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = null;
        const _apiRoute = this.utilityService.getApiRoute('GetCustomerMealPlanDetailURL');
        this.service.getMealPlanCustomerDetail(this.utilityService.localBaseAddress + _apiRoute, saleid, this.utilityService.globalInstance.CurrentUser.EmpID)
        .subscribe(data => {
          this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = JSON.parse(data['result']);
          console.log(this.utilityService.globalInstance.SelectedTableDetail);
          console.log(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems );
        }, error => {
          return alert(error);
        }, () => {
          if (this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems !== []) {
            console.log('-------' + this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].TotalSeatsTaken);
            console.log('-------' + this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SeatCount);
            this.utilityService.orderType = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].OrderType;
            this.clearSelectedItemIndexes();
            this.utilityService.patTableName = tablename;
            this.utilityService.globalInstance.SelectedTableName = tablename;
            this.utilityService._selectedTableSpeerBar = tablename;
            this.utilityService.selectedSaleID = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SaleId;
            console.log('1st saleID' + this.utilityService.selectedSaleID);
            this.utilityService.grandtotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].GrandTotal;
            this.utilityService.discounttotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].DiscountTotal;
            this.utilityService.totalTax = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].TaxTotal;
            this.utilityService.subTotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SubTotal;
            this.utilityService._empName = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].EmpName;
            this._css_Selected_table_speedBar(this.utilityService.globalInstance.SelectedTableName,saleid,this.utilityService.globalInstance.SelectedLayoutTableId,checknumber);
            localStorage.setItem('tableSelectedCheckNumber', saleid);         
            if(this.utilityService._selectedSeatOrderUI == 0 || !sameChecknumber) {
              this.utilityService._selectedSeatOrderUI = Number(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SeatNumber.replace('Seat', ''));
              this.utilityService._selectedCustomerIdOrderUI = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].CustomerId;
            } else {
              this.utilityService._selectedSeatOrderUI = Number(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SeatNumber.replace('Seat', ''));
              this.utilityService._selectedCustomerIdOrderUI = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].CustomerId;
            }
          }
        });
    }  
  }

  getCheckDetailsByManager(saleid, tablename, checknumber) {
    // console.clear();
    let sameChecknumber = true;
    if(saleid != this.utilityService.globalInstance.SelectedSaleId){
      sameChecknumber = false;
    }
    this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = null;
      const _apiRoute = this.utilityService.getApiRoute('GetCustomerMealPlanDetailURL');
      this.service.getMealPlanCustomerDetail(this.utilityService.localBaseAddress + _apiRoute, saleid, -1)
      .subscribe(data => {
        this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = JSON.parse(data['result']);
        console.log(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems );
      }, error => {
        return alert(error);
      }, () => {
        if (this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems !== []) {
          this.clearSelectedItemIndexes();
  /*         this.utilityService._posChecknumber = checknumber; */
          this.utilityService.globalInstance.SelectedTableName = tablename;
          this.utilityService._selectedTableSpeerBar = tablename;
          this.utilityService.selectedSaleID = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SaleId;
          console.log('1st saleID' + this.utilityService.selectedSaleID);
          this.utilityService.orderType = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].OrderType;
          this.utilityService.grandtotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].GrandTotal;
          this.utilityService.discounttotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].DiscountTotal;
          this.utilityService.totalTax = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].TaxTotal;
          this.utilityService.subTotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SubTotal;
          this.utilityService._empName = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].EmpName;
          this._css_Selected_table_speedBar(this.utilityService.globalInstance.SelectedTableName,saleid,this.utilityService.globalInstance.SelectedLayoutTableId,checknumber);
          localStorage.setItem('tableSelectedCheckNumber', saleid);         
          if(this.utilityService._selectedSeatOrderUI == 0 || !sameChecknumber) {
            this.utilityService._selectedSeatOrderUI = Number(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SeatNumber.replace('Seat', ''));
            this.utilityService._selectedCustomerIdOrderUI = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].CustomerId;
          } else {
            this.utilityService._selectedSeatOrderUI = Number(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SeatNumber.replace('Seat', ''));
            this.utilityService._selectedCustomerIdOrderUI = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].CustomerId;
          }
          this.utilityService.ByManager = true;
        }
        this.getCoursingItemsList();
      });
  }
  
  
  selectedMultipleCheck(saleid,totalAmount) {
    console.clear();
     if(!this.utilityService.selectedMultipleCheck.includes(saleid)) {
       this.utilityService.selectedMultipleCheck.push(saleid);
       document.getElementById('MultipleCheck-' + saleid).className = 'highLightItem';
       this.utilityService.selectedMultipleCheckAmount.push(totalAmount.replace('$',''));
     } else {
       console.log('existing');
       var index = this.utilityService.selectedMultipleCheck.indexOf(saleid);
       if (index > -1) { //if found
         this.utilityService.selectedMultipleCheck.splice(index, 1);
         this.utilityService.selectedMultipleCheckAmount.splice(index, 1);
         document.getElementById('MultipleCheck-' + saleid).removeAttribute('class');
       }
       this.isChecked = false;
     }
     let _totalAmount = 0.00;
      for(var i = 0; this.utilityService.selectedMultipleCheckAmount.length > i; i ++){
        let n = parseFloat(this.utilityService.selectedMultipleCheckAmount[i]);
        _totalAmount += n;
     }
     this.utilityService.selectedMultipleCheckTotalAmount = 'TOTAL AMOUNT : $'+ ((_totalAmount*100) / 100).toFixed(2);
     console.log(  this.utilityService.selectedMultipleCheck);
     console.log(  this.utilityService.selectedMultipleCheckAmount);
     console.log(  this.utilityService.selectedMultipleCheckTotalAmount);
  }

  selectAll(value){
    let _totalAmount = 0.00;
    for(var i = 0;  this.utilityService.openChecks.length > i; i++){
      document.getElementById('MultipleCheck-' + this.utilityService.openChecks[i].SaleId).removeAttribute('class');
      this.utilityService.selectedMultipleCheck = [];
      this.utilityService.selectedMultipleCheckAmount = [];
    }
    if(!value) {
      for(var i = 0; this.utilityService.openChecks.length > i; i++){
        document.getElementById('MultipleCheck-' + this.utilityService.openChecks[i].SaleId).className = 'highLightItem';
        this.utilityService.selectedMultipleCheck.push(this.utilityService.openChecks[i].SaleId);
        this.utilityService.selectedMultipleCheckAmount.push(this.utilityService.openChecks[i].Amount.replace('$',''));
      }
    } 
    for(var i = 0; this.utilityService.selectedMultipleCheckAmount.length > i; i ++){
      let n = parseFloat(this.utilityService.selectedMultipleCheckAmount[i]);
      _totalAmount += n;
    }
    this.isChecked = value;
    this.utilityService.selectedMultipleCheckTotalAmount = 'TOTAL AMOUNT : $'+ ((_totalAmount*100) / 100).toFixed(2);
  }

  clearMultipleChecks(index){
    document.getElementById('table-' + this.utilityService.selectedMultipleCheck[index]).removeAttribute('class');
  }

  
  onItemDrop(event: CdkDragDrop<any[]>) {
    console.log(event);
    console.log(event.container.data);

    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.saveScreenLayoutDrop(event.container.data);
  }

  saveScreenLayoutDrop(changedContainer: any[]) {
    const newContainer = [];

    const _apiRoute = this.utilityService.getApiRoute('SaveScreenLayout');
    const ApiURL = this.utilityService.localBaseAddress+ _apiRoute;

    let index = 0;
    for (const data of changedContainer) {
      index++;
      const newData = {
        'controlPanel': data.ControlPanel,
        'appClass': data.AppClass,
        'backgroundColor': data.BackgroundColor,
        'appId': data.AppID,
        'empId': data.EmpID,
        'position': "" + index,
        'storeId': data.StoreID
      };
      data.Position = '' + index;
      this.service.saveScreenLayoutDetail(newData, ApiURL)
      .subscribe(result => {
        console.log(result);
      }, error => {
        console.log(error);
        this.toastr.error(error.toString(),"Error", {timeOut: 2000});
      }, () => {
        console.log('success on saving!');
      });
    }
  }

  callItemModifier_down() {
    /*this.utilityService._selectedSeatOrderUI = _selectedSeat;
    this.utilityService._selectedCustomerIdOrderUI = _customerId;*/

    console.log('MOUSEDOWN!');

    this.utilityService.mouseHold = 1;
    const timer = setInterval(() => {
      this.utilityService.mouseHold =  this.utilityService.mouseHold + 1;
      console.log('holdPress called! mouseHold : ' + this.utilityService.mouseHold);
      if (this.utilityService.mouseHold >= 3) {
        this.utilityService.screen = 'itemModifier';
        clearInterval(timer);
      }
    }, 1000);
  }

  callItemModifier_up() {
    console.log('MouseUP');
    if (this.utilityService.mouseHold >= 3) {
      this.utilityService.screen = 'itemModifier';
      clearInterval();
    } else {
      clearInterval();
    }
  }
  filterString(str: string) {
    const strMod = str.replace('MOD-', '');
    const strAction = strMod.replace('ACTION-', '');
    return strAction;
  }

  getModifierSaleItem(itemID) {
    console.log('GetModifierSaleItem Information!');
    let statusCode: any;
    let message: any;
    const _apiRoute = this.utilityService.getApiRoute('GetModifierSaleItem');
    this.service.getModifierSaleItem(this.utilityService.localBaseAddress + _apiRoute + '/' + this.selectedSaleItemId)
      .subscribe(data => {
        console.log(JSON.parse(data['status-code']));
        statusCode = JSON.parse(data['status-code']);
        console.log(data['message']);
        message = data['message'];
        this.utilityService.saleItemModifiers = JSON.parse(data['result']);
      }, error => {
        this.toastr.error(error,"Error", {timeOut: 2000});
      }, () => {
        if(statusCode == 202) {
          this.toastr.info(message);
        } else {
          console.log("selected ItemID: "+itemID + " | " +  this.selectedSaleItemId);

          this.longPressing = null;
          this.isLongPressed = !this.isLongPressed;
          console.log('longpress start!');
          if (itemID != '') {
            this.utilityService.screen = 'itemModifier';
      
            this.utilityService.itemMod = {
              SaleId: this.utilityService.globalInstance.SelectedSaleId,
              CurrentUser: this.utilityService.globalInstance.CurrentUser.EmpID,
              SelectedSaleItemID: itemID,
              ItemID: [],
              ModifierGroupItem: []
            } as ItemModifierDetails;
            console.log(this.utilityService.itemMod);
          }
        }
/*         console.log(this.utilityService.saleItemModifiers); */
      });
  }

  getParentModifier(meal: GuestCheckWindow []){
    var parentModifier = "";
    //console.log("called getParentModifier()");

    for (var i = 0; i < meal.length; i++){

      for (var x = 0; x < meal[i].GetMenuItems.length; x++) {
        //console.log(this.selectedSaleItemId+" == "+meal[i].GetMenuItems[x].SaleItemId);
        if(this.selectedSaleItemId == meal[i].GetMenuItems[x].SaleItemId 
            && meal[i].GetMenuItems[x].IsModifier == true){
          for(var y=x; y>=0; y--){
            //console.log("modifier: "+meal[i].GetMenuItems[y].IsModifier);
            if(meal[i].GetMenuItems[y].IsModifier == false){
              parentModifier = meal[i].GetMenuItems[y].SaleItemId;

              //console.log("parentModifier: "+parentModifier);
              this.onLongPress(parentModifier);
              x = 1000;
              i = 1000;
            }
          }
        }
      }

    }
  }

  onLongPress(itemID: string) {
    if(itemID == undefined || itemID == "" || itemID.length == 0) {
      this.toastr.info('Please select item to add modifier');
    } else {
      this.getModifierSaleItem(itemID);
    }
  }

  checkItemModifier(itemID: string) {
    if (this.utilityService.itemMod.ItemID === undefined || this.utilityService.itemMod.ItemID.length == 0) {
      return 'modunselected';
    } else {
      const index = this.utilityService.itemMod.ItemID.indexOf(itemID);
      if (index !== -1) {
        return 'modselected';
      } else {
        return 'modunselected';
      }
    }
  }

  saveSelectedModifier(modifierGroupItem: string, itemID: string ,ModifierMaxSelect : boolean,ModifierMinSelect: boolean,UseModifierMaxSelect: number,UseModifierMinSelect: number) {
    if (this.utilityService.itemMod.ItemID === undefined || this.utilityService.itemMod.ItemID.length == 0) {
      this.utilityService.itemMod.ItemID.push(itemID);
      this.utilityService.itemMod.ModifierGroupItem.push(modifierGroupItem);
    } else {
      if (this.utilityService.itemMod.ItemID.indexOf(itemID) == -1) {
        this.utilityService.itemMod.ItemID.push(itemID);
        this.utilityService.itemMod.ModifierGroupItem.push(modifierGroupItem);
      } else {
        const index = this.utilityService.itemMod.ItemID.indexOf(itemID);
        if (index !== -1) {
          this.utilityService.itemMod.ItemID.splice(index, 1);
          this.utilityService.itemMod.ModifierGroupItem.splice(index, 1);
        }
      }
    }
    this.utilityService.itemMod.CourseNo = this.selectedCourseNo;
  }

  saveSaleItemModifier() {
    let exitVal;
    for (let i=0; i<this.utilityService.saleItemModifiers.length; i++){
      let modifierDesc = this.utilityService.saleItemModifiers[i].ModifierDescription;
      let textValidate = this.utilityService.saleItemModifiers[i].Text;
      let upcValue = this.utilityService.saleItemModifiers[i].ItemName;
      let total = 0;

      for (let j=0; j<this.utilityService.itemMod.ModifierGroupItem.length; j++){
        if(this.utilityService.itemMod.ModifierGroupItem[j] == upcValue){
          total = total + 1;
        }
      }

      switch(textValidate){
        case "Select at least 1":
          if(total < 1){
            this.toastr.warning('Please select at least 1 item on ' + modifierDesc + ' column.',"Warning", {timeOut: 2000});
            exitVal = true;
          }
          break;
        case "Select at least 1,but no more than 1":
          if(total != 1){
            this.toastr.warning('Please select at least 1,but no more than 1 on ' + modifierDesc + ' column.',"Warning", {timeOut: 2000});
            exitVal = true;
          }
          break;
        default:
          //exitVal = false;
          break;
      }
    }
    
    const _apiRoute = this.utilityService.getApiRoute('SaveModifierSaleItem');
    const ApiURL = this.utilityService.localBaseAddress + _apiRoute;
    this.utilityService.itemMod.IsOnline = this.utilityService.isServerOnline;
    console.log(this.utilityService.itemMod);
    if(!exitVal){
      const _apiRoute = this.utilityService.getApiRoute('SaveModifierSaleItem');
      const ApiURL = this.utilityService.localBaseAddress + _apiRoute;
      this.utilityService.itemMod.IsOnline = this.utilityService.isServerOnline;
      console.log(this.utilityService.itemMod);
      this.service.saveModifierSaleItem(this.utilityService.itemMod, ApiURL)
        .subscribe(result => {
          console.log(result);
        }, error => {
          console.log(error);
          this.toastr.error(error.toString(),"Error", {timeOut: 2000});
        }, () => {
          console.log('success on saving!');
          this.getCheckDetails(this.utilityService.globalInstance.SelectedSaleId,this.utilityService.globalInstance.SelectedTableName,this.utilityService.globalInstance.SelectedLayoutTableId,this.utilityService.globalInstance.SelectedCheckNumber );
          this.utilityService.screen = 'orderingModule';
          this.getCoursingItemsList();
        });
    }
  }

  getSpecialModifiersClassName() {
    if (this.utilityService.saleItemModifiers !== undefined) {
      return 12 / this.utilityService.saleItemModifiers.length;
    } else {
      return 12;
    }
  }

  onPan(item: any, event: any): void {
    this.clickNewMenu = false;
    console.log("OnPan!");
    event.preventDefault();
    this.startX = event.deltaX / 100;
    this.startY = event.deltaY/ 100;
    console.log("total x: "+(this.x - this.startX));
    console.log("total y: "+(this.y - this.startY));

 

    let div = document.getElementById(item.SubButtonID);
    let itemwidth = div.getAttribute('itemwidth');
    var splitted = itemwidth.split("-", 3);
    var colspan = Number(splitted[2]);
    /*if(colspan < this.defaultItemColumn){
      colspan = this.defaultItemColumn;
    }*/
    div.classList.remove(itemwidth);
    if(this.x > this.startX && colspan > 2 && (this.x - this.startX) > 1){
      colspan = colspan - 2;
      this.x = this.startX;
    }else if(this.x < this.startX && colspan < 12 && (this.startX - this.x) > 1){
      colspan = colspan + 2;
      this.x = this.startX;
    }else if(this.y > this.startY){
      let div = document.getElementById('MenuItemsDivRow');
      div.scrollTop = div.scrollTop + 8;
    }else if(this.y < this.startY){
      let div = document.getElementById('MenuItemsDivRow');
      div.scrollTop = div.scrollTop - 8;
    }

    var newVal = splitted[0] + "-" + splitted[1] + "-" + colspan;
    div.classList.add(newVal);
    div.setAttribute('itemwidth', newVal);
    console.log("action: PAN - colspan: " + colspan + " (x>start)="+(this.x > this.startX));
  }

/*   swipe(item: any, action: string = this.SWIPE_ACTION.RIGHT) {
    //this.toastr.info("SWIPE is working!","Info", {timeOut: 2000});

    let div = document.getElementById(item.ItemID);
    let itemwidth = div.getAttribute('itemwidth');
    var splitted = itemwidth.split("-", 3);
    var colspan = Number(splitted[2]);
    div.classList.remove(itemwidth);

    if (action === this.SWIPE_ACTION.RIGHT && colspan < 12) {
      colspan = colspan + 2;
    }

    // swipe left, previous avatar
    if (action === this.SWIPE_ACTION.LEFT && colspan > 2) {
      colspan = colspan - 2;
    }

    var newVal = splitted[0] + "-" + splitted[1] + "-" + colspan;
    div.classList.add(newVal);
    div.setAttribute('itemwidth', newVal);
    console.log("action: " + action + " colspan: " + colspan);
  } */

/*   pinch(item: any, action: string = this.PINCH_ACTION.IN) {
      this.pinchCalled++;

      alert('pinch called!');

      //this.toastr.info("PINCH is working!","Info", {timeOut: 2000});

      if (this.pinchCalled % 20 == 0){
        this.pinchCalled++;
        let div = document.getElementById(item.ItemID);
        let itemwidth = div.getAttribute('itemwidth');
        var splitted = itemwidth.split("-", 3);
        var colspan = Number(splitted[2]);
        div.classList.remove(itemwidth); 
        if (colspan > 2 && action === this.PINCH_ACTION.IN){
          colspan = colspan - 2;
        }
        if (colspan < 12 && action === this.PINCH_ACTION.OUT){
          colspan = colspan + 2;
        }
        var newVal = splitted[0] + "-" + splitted[1] + "-" + colspan;
        div.classList.add(newVal);
        div.setAttribute('itemwidth', newVal);
        console.log("action: " + action + " colspan: " + colspan + " pinchCalled: " + this.pinchCalled);
      }

      if (this.pinchCalled > 500){
        this.pinchCalled = 0;
      }
  } */

  voidCreditCard(){
    const _apiRoute = this.utilityService.getApiRoute('VoidCreditCard');
    let data : any;
    let status : any;
    let message :any;
    const _void: VoidCreditCard = { SaleId :this.tempSaleId , EmpId : this.utilityService.globalInstance.CurrentUser.EmpID } as VoidCreditCard;
    this.service.voidCreditCard(_void,this.utilityService.localBaseAddress + _apiRoute)
    .subscribe(result => {
      console.log(result['result']);
      status = result['status-code'];
      this.utilityService.closedChecks = JSON.parse(result['result']);
      message = result['message'];
    }, error => {
      this.toastr.error("Error", error, { timeOut : 3000})
    }, () => {
      if(status == 201) {
        this.utilityService.selectedItemOnClosedCheck = '';
        this.toastr.success("Success");
        this.getOpenChecks(this.utilityService.globalInstance.CurrentUser.EmpID,null);
      } else if(status == 200) {
        this.toastr.error(message,'Error', { timeOut:3000})
      } else {
        this.toastr.error("Error","Something came up", { timeOut : 3000})
      }
    })
  }

  showMessage(){
    var mainDiv = document.getElementById('GuestCheckDiv');
    console.log(" BEFORE message mainDiv scrollHeight: "+mainDiv.scrollHeight+" scrollTop: "+mainDiv.scrollTop);
    this.scrollPosition = mainDiv.scrollTop;

    var ParentItemId = this.selectedItemId;
    var PrecedingSaleItemId = this.selectedSaleItemId;

    console.log("-= executeFunctionButton =-");
    console.log(this.utilityService._selectedSeatOrderUI);
    console.log("ParentItemId:"+ParentItemId);
    console.log("PrecedingSaleItemId:"+PrecedingSaleItemId);
    console.log(this.utilityService.saleItemArray);
    console.log("-= itemArray =-");
    console.log(this.itemArray);

    if(this.utilityService.saleItemArray.length > 1){
      this.toastr.warning('Multiple items has been selected. Please select one item to proceed.','Warning', {timeOut: 5000});
    }else{
      const dialogRef = this.dialog.open(MessageComponent, {panelClass: 'remove-special'});
      dialogRef.afterClosed().subscribe(
        data => {
          console.log("done showing message! This is the message: "+this.utilityService.message);
          console.log(data);
          /*    if (this.utilityService.message == '') {
            this.toastr.warning('No message');
          } */
          if(this.utilityService.message == "the button is closed, dont operate anything"){
            // do nothing
          }else if (this.utilityService.message.length > 20) {
            this.toastr.warning('Invalid Message, the message should be lessthan equal to 20 characters.');
          } else {
            this.executeFunctionButton(this.utilityService.message);
            this.utilityService.message = null;
          }   
         }
      );
    }
  }


  getColumnSpacing(val){
    if(val) return "col-11";
    else return "col-7";
  }

  getBorderStyle(val,discounted,voidReason,varSaleDiscount:ISaleDiscount){
    let retVal = {};
    if(voidReason>0){
      retVal = {'background': 'red'};
    }else{
      if(val) retVal = {'border-top-style': 'dotted', 'border-color': '#bbbbbb'};
      else retVal = {'border-top-style': 'groove'};
      if(varSaleDiscount!=null){
        if(varSaleDiscount.IsComp == 0) retVal['background']='orange';
        else retVal['background']='green';
      }
      
    }   
    return retVal;  
  }

  private loadSaleItemDiscount(saleItemDiscount) {
    //console.clear();
    const _apiRoute = this.utilityService.getApiRoute('GetSaleItemDiscountList');
    // tslint:disable-next-line: max-line-length
    this.service.getSaleItemDiscountList(this.utilityService.localBaseAddress+ _apiRoute, saleItemDiscount)
    .subscribe(data => {
        this.utilityService.saleItemDiscountList.push(JSON.parse(data['result']));
    }, error => {
     this.toastr.error(error,"Error", {timeOut: 2000});
    }, () => {
      console.log('-=newSaleitemDiscountList=-');
      console.log(this.utilityService.saleItemDiscountList);
    });
  }

  triposSale() {
    const _apiRoute = this.utilityService.getApiRoute('TriposSale');

    const triposSaleBody = {
      'CardNumber': 10473,
      'Amount': 10.00,
      'ResponseCode': 200,
      'TransactionID': '12312312'
    };

    this.service.triposSale(triposSaleBody,this.utilityService.triposDomain + _apiRoute)
    .subscribe(data => {
      
    },error => {

    },()=>{

    });
  }


  fastCash(){
    this.openfastCashDialog();
    console.clear();
    const CurrentUser = this.utilityService.globalInstance.CurrentUser.EmpID;
    const SaleId = this.utilityService.globalInstance.SelectedSaleId;
    const _settleResidentCharge: ResidenChargeSettleCheck = { SaleId, CurrentUser} as ResidenChargeSettleCheck;
    this.service.residentChargeSettleCheck(_settleResidentCharge, this.utilityService.localBaseAddress + 'api/openCheck/v1/ResidentChargeSettleCheck')
    .subscribe(settleCheck => {
      this.utilityService.settleCheckResidentCharge.push(settleCheck);
    }, error => {
      this.toastr.error(error);
    }, () => {
      this.utilityService.guestCheck = [];
      this.utilityService.patTableName = null;
      this.utilityService.globalInstance.SelectedSaleId = '00000000-0000-0000-0000-000000000000';
      this.getOpenChecks(this.utilityService.globalInstance.CurrentUser.EmpID,null);
      this.toastr.success('Check has been successfully settled');
      this.hidefastCashDialog();
    });
  }
}




