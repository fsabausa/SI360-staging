import { Injectable,ViewChild } from '@angular/core';
import { ICustomer , CustomerInfo } from '../shared/customer';
import { ICustomerDetail } from '../shared/customerDetail';
import { ILayoutRoom } from '../shared/room';
import { ISeatDetailBySeatNo } from '../shared/seatDetailBySeatNo';
import { ILayoutTable } from '../shared/table';
import { ITableDetail } from '../shared/tableDetail';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {
	MenuItemsObject,
	MenuItems,
	SelectedItemId,
	MenuItemPrice,
	FireSelected,
	CreditCardResponse,
	CustomerDetailCreditCard,
  PayCheck,
	SignOnEmployee,
	Media,
	MenuItemButton,
	IApi_Url,
	IApi_Endpoint,
	SyncSaleResponse,
	SaveSeat,
	AddSeat,
	UpdateMeal,
	UpdateSeat,
	ChangeTable,
	UploadPhoto,
	HasOfflineOrder,
	Access,
	OpenChecks,
	CheckItems,
	GuestCheck,
	ResidenChargeSettleCheck,
	Payment,
	Order,
	GuestCheckWindow,
	MenuItemList,
	Menus,
	ChangePinResult,
  ScreenLayout,
  ParentItemModifier,
  ChildItemModifier,
  ItemModifierDetails,
  AppSetting,
  DefaultMedia,
  GroupMenuItems,
  ItemModv4,
  DeleteItem,
  Settlement,
  ResponseAssignSeat,
  IMealType,
  MenuButton,
  AppDetail,
  NavigationButton,
  MealTypeViewModel,
  PreloadData,
  Button,
  SubButtonViewModel,
  SubButton,
  IDiscount, 
  IReason,
  ISaleItemDiscount,
  ISaleDiscount,
  MultipleCheck,
    IEmployee,
  IEmployeeCheck,
  ItemNameData,
  IItemQty,
  CoursingItem,
  ISplitItem,
  globalInstance,
  storedTransactions,
  saleManualForward,
  ClosedChecks,
  CreditCardTransactionDetail,
  dictItem
} from '../obj-interface';
import { IMealPlan } from '../shared/mealplan';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  public globalInstance: globalInstance;

  public isproccessing: boolean = false;
  public selectedSaleID:string;
  public baseAddress: string;
  public _changePinResult: ChangePinResult;
  public animationState: string;
  public panelOpenState = true;
  public _isActiveMenuItem = false;
  public _css_selectedSeatOrderUI = false;
  public showCustomerSearchDiv = false;
  public serverIsDone = false;
  public responseAssignSeat : ResponseAssignSeat;
  public menuDiv = false;
  public showAddOrder = false;
  public showCustomerDetail = false;
  public showCustomerDetail2 = false;
  public showMealDiv = false;
  public showButtonAssignSeat = false;
  public showButtonReAssignSeatAndRemoveSeat = false;
  public showChangeMealPlanButton  = false;
  public showButtonMoveToSeatAndRemoveSeat  = false;
  public screen = '';
  public loadingType = 'defaultLoading';
  public title = 'app';
  public date  = new Date();
  public tableShapeUrl = 'assets/img/circle.png';
  public toast;
  public shape;
  public seat;
  public seatUrl;
  public customerUrlPhoto;
  public takenSeats;
  public tableShape;
  public prevSelectedSeat;
  public prevAssignSeat;
  public successsAssignSeat;
  public selectedSeat;
  public selectedMealPlan;
  public selectedCustomerName;
 /*  public selectedCustomerId; */
/*   public selectedlayoutTableId; */
  public prevTableId;
  public newTableId;
  public isSuccessfulCreditCardPayment;
  public isReassignSeat  = false;
  public isChangeTable  = false;
  public isServerOnline  = false;
  public readyForUse = false;
  public loadAllDataNeed = false;
  public hasofflineOrder= false;
  public hasMenuItems = false;
  public UpdateMealPlan = false;
  public storeId: number;
  public showSYNCSALE = false;
  public syncProccessing = false;
  public user = '';
  public pin = '';
  public employeeIDSignOn = '';
  public convertedpin = '';
  public supervisorconvertedpin = '';
  public supervisorpin = '';
  public access_grandtedby_supervisor = false;
  public signon_buttons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '00', 'DEL'];
  public signon_buttons2 = ['SIGN ON', 'CLOCK IN', 'CLOCK OUT'];
  public selectedroom = 'Please select a room';
  public selectedtable;
  public selectedtableShape;
  public chosenTableShape;
/*   public selectedRoomId; */
  public rso_rooms2 = [];
  public error;
  public seatCount;
  public _seats = [];
  public _seatPayments = [];
  public iterateSeat = [];
  public subModifierViewModel = [];
  public dicItemViewModel : dictItem[] = [];
  public countModName : number = 1;
  public _prevItemName = '';
  public listItemMod = [];
  public seatClass = '';
  public seatLabel = '';
  public seatImageClass = '';
  public setStatus = '';
  public table = 'assets/img/circle.png';
  public _itemPageNumber = 1;
  public _totalItemCount = 0;
  public _totalPages = 0;
  public _menuAction;
  public _buttonId = '';
  public _prevModName = '';
  public _itemNameData : ItemNameData;
  public array = new Array();
  public itemsDeletable = new Array();
  public modArray = new Array();
  public modItemName = new Array();
  public selectedmodNameArray = new Array();
  public modArrayValidatiom = new Array();
  public modifierDesc;
  public _hasOffLineOrder: HasOfflineOrder[];
  public access: Access;
  public accessToken: string;
  public isSuccessSync: SyncSaleResponse;
  public saveSeat: SaveSeat[] = [];
  public addSeat: AddSeat[] = [];
  public updateMeal: UpdateMeal[] = [];
  public updateSeat: UpdateSeat[] = [];
  public settleCheckResidentCharge: ResidenChargeSettleCheck[] = [];
  public changeTableParam: ChangeTable[] = [];
  public uploadPhoto_: UploadPhoto[] = [];
  public roomList: ILayoutRoom[]; 
  public layoutTable: ILayoutTable[];
  public customerList: ICustomer[];
  public customerDetail: ICustomerDetail;
/*   public tableDetail: ITableDetail; */
/*   public seatDetailBySeatNo: ISeatDetailBySeatNo; */
/*   public mealPlanCustomerDetail: GuestCheckWindow []; */
  public menuItemList: MenuItemList [] = [];
  public takenSeatsArray = [];
  public checkNumbers = [];
  public customerIds = [];
  public api_url: IApi_Url[];
  public api_endpoint: IApi_Endpoint[];
  public interval: any;
  public server: string;
  public local: string;
  public _checknumber: string;
/*   public _selected_apiUrl: string; */
  public _menuDescription: MenuButton[] = [];
  public _buttons: Button[] = [];
  public _menuItems: GroupMenuItems[];
  public _menuItemButton: MenuItemButton;
  public _media: Media[];
/*   public _signOnEmployee: SignOnEmployee; */
  public _selectedSaleItem: [];
  public _fireSelected: FireSelected;
/*   public _tableNameOrderScreen: string = null; */
/*   public _posChecknumber: number; */
  public _menuItemObject: MenuItemsObject;
  public _empName:string;
  public ModifierIndex = 'ModifierIndex';
  public _itemName: string;
  public _menuName: string;
/*   public currentUser: number; */
  public currentUserSecurityLevel:number;
  public defaultMedia: DefaultMedia;
  public menuItemsCount: number;
  public menuItemRowCount: number;
  public hasMod : boolean = false;
  public itemModv4 =[];
/*   public appDetail: AppDetail; */
  public preloadData: PreloadData;
  public preSelectedRoom: number = 0;
  public _selectedSeatOrderUI: number;
  public _selectedCustomerIdOrderUI: string;
  public _isMenuItemClick = false;
  public _selectedTableSpeerBar: string;
  public _selectedItems: SelectedItemId[];

/*   PATatTable */
  public payment_Option = 'Entire Check';
  public payment_type: string;
  public payment_media: string;
/*   public patCheckNumber: number; */
  public patTableName: string;
  public creditCardPaymentResponse: CreditCardResponse;
  public openChecks: OpenChecks[];
  public checkItems: CheckItems[];
  public guestCheck: GuestCheck[];
  public payment: Payment [] = [];
  public order: Order[] = [];
  public subTotal = '$0.00';
  public grandtotal: string;
  public discounttotal: string;
  public totalTax: string;
  public inputed_amount: number;
  public balance: string;
  public customerDetailCreditCard: CustomerDetailCreditCard[];
  public creditCardResponse: CreditCardResponse[];
  public menuItemPrice: MenuItemPrice[];
  public clearSelectedItem = [];
  public employeeID = '';
  public newPIN = '';
  public confirmPIN = '';
  public convertedNewPIN: string;
  public convertedConfirmPIN: string;
  public inputActive: string;
  public inputActiveSignON: string;
  public previousMenu = '';
  public reloadChecknumberWhenOnline:number;

  public appSetting: AppSetting[];
  public appVersion: string;
  public defaultMenu: string;
  public defaultMenuButtonID: string;
  public serverBaseAddress: string;
  public localBaseAddress: string;
  public serviceTypeDesc: string;
  public triposDomain: string;
  public itemIds: string[];
  public now: number;
  public inputedAmount = 0.00;
  public splitEven = 0;
  public pbsSelection: string[] = [];
  public payCheck: PayCheck;
  public total: string;
  public canUploadPhoto = true;
  public saleItemModifiers: ParentItemModifier[];
  public itemMod: ItemModifierDetails;
  public openMod: DeleteItem;
  public _navigationEntries: NavigationButton[] = [];
  public settlement: Settlement[] = [];
  public mealTypeList: IMealType[] = [];
  public mealTypes : string[];
  public showHandler = false;
  public mouseHold = 0;
  public onHold = false;
  public discountList: IDiscount[] = [];
  public discountReasonList: IReason[] = [];
  public saleItemDiscountList: ISaleItemDiscount[] = [];
  public saleDiscountList: ISaleDiscount[] = [];
  public saleItemArray = [];
  public handlerStatusInfo = "hide-handler";
  public message = "";

  public selectedItemId = '';
  public selectedItemPrice = '';

  connectionStatus = "offline";

  public confirmMessage = "";
  public confirmResult = false;
  public confirmSeatnum = "";
  public okButtonOnly = false;
  public EnableEmployeeNumber = false;
  public textBoxPlaceholderSignOn: string;
  public SyncStatus = '';
  public informationMessage :string;
  public mealTypeFilters: string[];
  public hasMealType: boolean = true;
  public selectAtLeastOne = false;
  public selectAtLeastOneButNoMoreThanOne = false;
  public canSkip = false;
  public fireAllList: string[] = [];
  public version2: string;
  public ctrForRecursion: number;
/*   public SubButtonsViewModel: SubButtonViewModel[]=[]; */
  public selectedItemOnMoveItem:string ='';
  public selectedItemOnMoveItemMsg:string = '';

  public subButton: SubButton[]=[];
  public selectedItemOnCombineCheck:string ='';
  public selectedItemOnCombineCheckMsg:string = '';
  public selectedItemOnCombineCheckTakenSeat:number;
  public selectedItemOnCombineCheckSeatCount:number;
  public selectedCheckToView:string = '';
  public selectedCheckToViewCheck:string;
  public selectedCheckToViewTableName:string = '';
  public selectedCheckToViewMsg:string = '';
  public voidReasonList: IReason[] = [];
  public compReasonList: IReason[] = [];
  // Drag and Drop Arrays
  public screenLayoutArr: any[];    
  public closedChecks: ClosedChecks[];

  public selectedItemOnClosedCheck:string ='';
  public selectedItemOnClosedCheckMsg:string = '';
  public selectedCheckChargeTipSaleId: string = '';
  public selectedCheckChargeTipChecknum: string ='';
  public selectedCheckChargeTip : ClosedChecks;
  public selectedMultipleCheck=[];
  public selectedMultipleCheckAmount=[];
  public selectedMultipleCheckTotalAmount:string;
  public addSeatProccessing:boolean = false;
  public ByManager = false;
  public itemList: any[]=[];
  public selectedEmployeeList:string ='';
  public selectedEmployeeListMsg:string = '';
  public employeeList: IEmployee[];
  
  public employeeCheckList: IEmployeeCheck[];
  public selectedEmployeeCheckList:string ='';
  public selectedEmployeeCheckListMsg:string = '';

  public employeeStatusCheckList: IEmployeeCheck[];

  public selectedSubButton: SubButtonViewModel;

  public itemIDSelected: string;

  public coursingItems: CoursingItem[];
  public creaditCardMsg = '';
  public creditCardDialogButtons: boolean = false;
  public creditCardIndex:number;


  public splitItemSaleID = '';
  public splitItemSaleItemID = '';
  public splitItemSelectedCustomer = '';
  public splitItemCustomers = [];

  public showUpdateNoti: boolean = true;
  public showRestartButt:boolean = false;
  public showDownloadUpdateProgressBar: boolean = false;
  public UpdateNotificationMsg: string;
  public UpdateMsg:string;
  public progressBarValue:number;
  public timerToRestart: number = 5;
  public remindIn2Hrs:boolean = false;
  public skipThis = false;
  public countDown:number = 0;
  public authorizationOkBtn : boolean = false;
  public orderType = 'Dine In';

  public tip_isActive = false;
  public inputed_tip = '0';
  public showbtnTotalPayment : boolean = true;
  public isCreditCardTrans: boolean = false;

  public storedTransactions : storedTransactions[];

  public isConnected = true;
  public hasInternetConnection: boolean;
  public internetConnectionMsg: string;
  public saleManualForward : saleManualForward;

  public ccTransactionDetail : CreditCardTransactionDetail;

  public pinpadv2_value : number;

/*   public globalselectedsaleid: string = '00000000-0000-0000-0000-000000000000'; */
  public totalSentToKitchen = 0;



  public customerInfo : CustomerInfo;

  public isProccessing : boolean = false;


  draggableSignonTB:any[] = [
    {"ControlPanel":"signOnHead","AppClass":"row","BackgroundColor":"","AppID":"","EmpID":"","Position":"","StoreId":""},
    {"ControlPanel":"signOnDetail","AppClass":"row","BackgroundColor":"","AppID":"","EmpID":"","Position":"","StoreId":""}
  ];
  draggableSignonLR:any[] = [
    {"ControlPanel":"signOnNumpad","AppClass":"col-sm-5","BackgroundColor":"","AppID":"","EmpID":"","Position":"","StoreId":""},
    {"ControlPanel":"signOnControlBtn","AppClass":"col-sm-3","BackgroundColor":"","AppID":"","EmpID":"","Position":"","StoreId":""}
  ];
  draggableRSComponents:any[] = [
    {"ControlPanel":"roomlist","AppClass":"col-sm-3","BackgroundColor":"#343B45","AppID":"","EmpID":"","Position":"","StoreId":""},
    {"ControlPanel":"tablelist","AppClass":"col-sm-9","BackgroundColor":"#D2D3D4","AppID":"","EmpID":"","Position":"","StoreId":""}
  ];
  draggableRSOComponents:any[] = [
    {"ControlPanel":"rsoimagediv","AppClass":"col-sm-3","BackgroundColor":"","AppID":"","EmpID":"","Position":"","StoreId":""},
    {"ControlPanel":"rsodetaildiv","AppClass":"col-sm-9","BackgroundColor":"","AppID":"","EmpID":"","Position":"","StoreId":""}
  ];
  dcOrderingTB:any[] = [
    {"ControlPanel":"orderbuttoncontrol","AppClass":"row","BackgroundColor":"#343B45","AppID":"","EmpID":"","Position":"","StoreId":""},
    {"ControlPanel":"orderdetailcontrol","AppClass":"row","BackgroundColor":"#343B45","AppID":"","EmpID":"","Position":"","StoreId":""}
  ];
  dcOrderingLR:any[] = [
    {"ControlPanel":"orderguestcheckdiv","AppClass":"col-sm-3","BackgroundColor":"#343B45","AppID":"","EmpID":"","Position":"","StoreId":""},
    {"ControlPanel":"ordertablediv","AppClass":"col-sm-2","BackgroundColor":"#343B45","AppID":"","EmpID":"","Position":"","StoreId":""},
    {"ControlPanel":"ordermenuitemdiv","AppClass":"col-sm-7","BackgroundColor":"#343B45","AppID":"","EmpID":"","Position":"","StoreId":""}
  ];
  draggablePATComponentsLR:any[] = [
    {"ControlPanel":"split","AppClass":"col-sm-4","BackgroundColor":"#343B45","AppID":"","EmpID":"","Position":"","StoreId":""},
    {"ControlPanel":"seat","AppClass":"col-sm-8","BackgroundColor":"#D2D3D4","AppID":"","EmpID":"","Position":"","StoreId":""}
  ];
  draggablePATComponentsTB:any[] = [
    {"ControlPanel":"checkdetaildiv","AppClass":"row","BackgroundColor":"#343B45","AppID":"","EmpID":"","Position":"","StoreId":""},
    {"ControlPanel":"checkbuttondiv","AppClass":"row","BackgroundColor":"#343B45","AppID":"","EmpID":"","Position":"","StoreId":""}
  ];

  public getApiRoute(value) {
    let api_route = '';
    for (const data of this.api_endpoint) {
      if (data.ApiUrlDesc === value) {
          api_route = data.ApiUrlRoute;
      }
    }
    return api_route;
  }
  public setStatusFunction(service) {
    const _apiRoute = this.getApiRoute('GetStatus');
   service.getStatus(this.serverBaseAddress + _apiRoute)
    .subscribe(data => {
      this.isServerOnline = JSON.parse(data['result']);
    }, error => {
      this.setStatus = 'offline-status';
      this.isServerOnline = false;
      this.hasofflineOrder = false;
      this.baseAddress = this.localBaseAddress;
    }, ()=> {
      if(this.isServerOnline) {
        this.setStatus = 'online-status';
        this.isServerOnline = true;
        this.baseAddress = this.serverBaseAddress;
        this.checkOfflineOrder(service);
        return true;
      } else {
        this.setStatus = 'offline-status';
        this.isServerOnline = false;
        this.baseAddress = this.localBaseAddress;
        this.hasofflineOrder = false;
      }
    })
  }

  setconnectionStatus() {
    if (this.isServerOnline) {
  
      if(this.connectionStatus != "online"){
        this.connectionStatus = "online";
        /* this.showConnectionMessage("Connection status is Online!"); */
      }
    } else {
      
      if(this.connectionStatus != "offline"){
        this.connectionStatus = "offline";
        /* this.showConnectionMessage("Connection status is Offline!"); */
      }
    }
  }

  public checkOfflineOrder(service) {
    const _apiRoute = this.getApiRoute('CheckOfflineOrder');
    service.checkOfflineOrder(this.baseAddress + _apiRoute, 32704).subscribe(data => {
      this._hasOffLineOrder = JSON.parse(data['result']);
      console.log(this._hasOffLineOrder);
    }, error => {
      console.log(error);
    }, () => {
      if (this._hasOffLineOrder) {
        this.hasofflineOrder = true;
      } else {
        this.hasofflineOrder = false;
      }
    });
  }

  public getBaseAddress(isOnline) {
    if(isOnline) {
      this.baseAddress = this.serverBaseAddress;
    } else {
      this.baseAddress = this.localBaseAddress;
    }
  }
}
