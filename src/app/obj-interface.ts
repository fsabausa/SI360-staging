import { ICustomer } from 'src/app/shared/customer';

export interface ModifierViewModel {
  Parent: string;
  Modifier: SubModifierViewModel[];
}
export interface SubModifierViewModel{
  ItemID: string;
  ModifierDesc: string;
  ModifierIndex: number;
  ItemModifierID: string;
  ItemName: string;
  MaxSelect: number;
}

export interface MenuItemsObject{
  Items: MenuItems[];
  ModName: string[];
  HasModifier: boolean;
  IsButtonType: boolean;
}

export interface GroupMenuItems {
  ItemFilter: string;
  RGB: string;
  Items: MenuItems[];
}

export interface ItemModv4 {
  ParentItemDescription:string;
  ParentItemID: string;
  ItemModifiers: MenuItemModifier[];
}

export interface dictItem {
  ItemHeaderName : string;
  MaxSelect: number;
  MinSelect: number;
  SelectedCount: number;
  ItemID: string;
  ModifierDesc : string;
  ModifierIndex:number;
  ItemModifierID: string;
  ItemName: string;
  UseMaxSelect: boolean;
  UseMinSelect: boolean;
}

export interface MenuItems {
  GroupBy: string;
  ItemID: string;
  ItemName: string;
  ItemDescription: string;
  ReceiptDesc: string;
  ItemPrice: string;
  ItemModifier: MenuItemModifier[];
  ItemPrice2: MenuItemPrice[];
  ModifierDescription: string;
  ModifierMaxSelect: number;
  ModifierMinSelect: number;
  UseModifierMaxSelect: boolean;
  UseModifierMinSelect: boolean;
  Text: string;
  Top: string;
  Bottom: string;
  FontColor: string;
}

export interface AppDetail {
  StoreID: number;
  AppVersion: string;
  MasterAPI: string;
}

export interface PreloadData {
  StoreID: number;
  AppVersion: string;
  MasterAPI: string;
  NavigationButtons : NavigationButton[];
  MealTypeList: string[];
  Rooms: LayoutRoom[];
  Buttons: Button[];
  Reasons :IReason[];
  ServiceTypeDesc : string;
  CustomerList: ICustomer[];
}

export interface LayoutRoom{
  RoomId :string,
  LayoutId :string,
  RoomIndex :number,
  RoomName :string,
  StoreId : number,
}

export interface IMealPlan{
  MealPlan : string;
}

export interface MenuItemModifier {
  ItemModifierID: string;
  ItemID: string;
  ModifierIndex: number;
  ModifierName: string;
  IsSelected: boolean;
  Item: MenuItems;
}

export interface SelectedItemId {
  ItemId: string;
}

export interface MenuItemPrice {
  Level1Price: string;
  Level2Price: string;
  DefaultPrice: string;
}
export interface FireAll {
  SaleId: string;
}
export interface SelectedSaleItem {
  SaleItemId: string;
}

export interface FireSelected {
  SaleId: string;
  ItemIndexes: string;
}

export interface PrintCheck {
  SaleIds: string[];
  IsConsolidated: boolean;
}

export interface CreditCardResponse {
IsApproved: boolean;
TransactionId: string;
StatusCode: string;
TipAmount: string;
SubTotal: string;
CashBack: string;
TotalAmount: string;
ApprovedAmount: string;
TransactionMessage: string;
}

export interface CustomerDetailCreditCard {
FirstName: string;
LastName: string;
Address1: string;
Address2: string;
City: string;
State: string;
Zip: string;
}

export interface SignOnEmployee {
  FirstName: string;
  LastName: string;
  EmpID: number;
  PIN: number;
  POSEmployeeID: string;
  SecurityLevel:number;
}

export interface CurrentUser {
  FirstName: string;
  LastName: string;
  EmpID: number;
  PIN: number;
  POSEmployeeID: string;
  SecurityLevel:number;
}
export interface Media {
  MediaName: string;
  ButtonText: string;
  MediaIndex: number;
}

export interface Menu {
  Text: string;
  Position: number;
  Height: number;
  Width: number;
  MinSecLevel: number;
  AskForSupervisor:boolean;
}

export interface MenuItemButton {
  ItemFilter: string;
  Items: GroupMenuItems[];
  Total: number;
}
export interface IApi_Url {
  ConnectionType: string;
  ApiURL: string;
}
export interface IApi_Endpoint {
  ApiUrlDesc: string;
  ApiUrlRoute: string;
}

export interface SyncSaleResponse {
  IsSuccess: boolean;
}
export interface customer {
  Name: string;
}
export interface SaveSeat {
  LayoutTableId: string;
  CustomerId: string;
  EmployeeName: string;
  Seatnumber: string;
  Mealplan: string;
  Checknumber: number;
  CurrentUser: number;
  IsOnline: boolean;
  SaleID: string;
}

export interface SaveSeatLocal {
  LayoutTableId: string;
  CustomerId: string;
  Seatnumber: string;
  Mealplan: string;
  Checknumber: number;
  CurrentUser: number;
  IsOnline: boolean;
  NextSaleID: string;
}

export interface ResponseAssignSeat {
  CheckNumber: number;
  NextSaleId: string;
  TicketNumber: number;
}

export interface AddSeat {
  LayoutTableId: string;
  ApiUrl: string;
  IsOnline: boolean;
}
export interface UpdateMeal {
  CustomerId: string;
  Checknumber: number;
  MealTypeDesc: string;
}
export interface UpdateSeat {
  LayoutTableId: string;
  customerid: string;
  previousSeat: string;
  seatnumber: string;
  SaleId: string;
  CurrentUser: number;
  IsOnline: boolean;
}
export interface ChangeTable {
  PrevTableId: string;
  NewTableId: string;
  Checknumber: number;
}
export interface UploadPhoto {
  CustomerId: string;
  Data: string;
}
export interface CheckNumber {
  Checknumber: number;
}
export interface HasOfflineOrder {
  HasOfflineOrder: boolean;
}
export interface Access {
  StatusCode: number;
  AccessToken: string;
}

export interface SignOn {
  StoreNumber: number;
  EmployeePIN: number;
  EmpID: number;
}


export interface OpenChecks {
  SaleId: string;
  CustomerName: string;
  CustonmerNumber: number;
  CheckNumber: number;
  TableName: string;
  Total: number;
  EmployeeName: string;
  Email: string;
  FirstName: string;
  LastName: string;
  CheckDescription: string;
  StartDate: Date;
  SyncStatus: boolean;
  Amount: string;
  EmployeeNumber: number;
  SeatCount: number;
  TakenSeats: number;
  LayoutTableId: string;
  IsCreditCardTransaction: boolean;
  TipAmount: string;
  CardNumber: string;
  CreditCardType: string;
}

export interface ClosedChecks {
  SaleId: string;
  CustomerName: string;
  CustonmerNumber: number;
  CheckNumber: number;
  TableName: string;
  Total: number;
  EmployeeName: string;
  Email: string;
  FirstName: string;
  LastName: string;
  CheckDescription: string;
  StartDate: Date;
  SyncStatus: boolean;
  Amount: string;
  EmployeeNumber: number;
  SeatCount: number;
  TakenSeats: number;
  LayoutTableId: string;
  IsCreditCardTransaction: boolean;
  TipAmount: string;
  CardNumber: string;
  CreditCardType: string;
  TransactionId: string;
  CompletionTransactionId : string;
  IsUpdated: boolean;
  TicketNum: number;
}

export interface ClosedChecksByCC {
  SaleId: string;
  CustomerName: string;
  CustonmerNumber: number;
  CheckNumber: number;
  TableName: string;
  Total: number;
  EmployeeName: string;
  Email: string;
  FirstName: string;
  LastName: string;
  CheckDescription: string;
  StartDate: Date;
  SyncStatus: boolean;
  Amount: string;
  EmployeeNumber: number;
  SeatCount: number;
  TakenSeats: number;
  LayoutTableId: string;
  IsCreditCardTransaction: boolean;
  TipAmount: string;
  CardNumber: string;
  CreditCardType: string;
}

export interface CheckItems {
  SaleId: string;
  Checknumber: number;
  TableName: string;
  ItemName: string;
  Quantity: number;
  ActualPrice: number;
  Subtotal: number;
  Tax: number;
  Email: string;
}

export interface GuestCheck {
  SeatNo: string;
  ItemName: string;
  TotalTax: string;
  ActualPrice: string;
  ReceiptDescription: string;
  SaleId: string;
  TableName: string;
  Price: string;
  PaidFlag: string;
  SaleSummary: SaleSummary;
}
export interface SampleGuestCheck {
  id: string,
  SeatNo: string;
  ItemName: string;
  TotalTax: string;
  ActualPrice: string;
  RecieptDescription: string;
  CheckNumber: number;
  TableName: string;
  Price: string;
  PaidFlag: string;
  SaleSummary: SaleSummary;
}

export interface DefaultMedia {
  MediaIndex: number;
  MediaDescription: string;
}

export interface VoidCreditCard {
  SaleId : string;
  EmpId : number;
}

export interface ResidenChargeSettleCheck {
  SaleId: string;
  CurrentUser: number;
}
export interface SettleMultiple {
  SaleID: string[];
  PaymentMediaIndex: number;
  CurrentUser:number;
  IsConsolidated:boolean;
  FunctionIndex: number;
  PrintReceipt:boolean;
}

export interface MealTypeViewModel {
  MealTypeViewModel: MealTypeDetail
}

export interface MealTypeDetail {
  Filters: string;
  IsActive: boolean;
}

export interface SaleSummary {
  CheckNumber: number;
  CheckDescription: string;
  SubTotal: string;
  TotalTax: string;
  Total: string;
}

export interface LocalLogin {
  EmployeeID: string;
  FirstName: string;
  LastName: string;
  EmpNumber: number;
  EmpPin: number;
  LastLogin: Date;
}

export interface Payment {
  PaymentMedia: string;
  PaymentType: string;
  CheckNumber: CheckNumber;
  Total: number;
  Balance: number;
}

export interface Order {
  SaleId: string;
  ItemName: string;
  Comment: string;
  jSonComment: string;
  SelectedSeat: number;
  SelectedCustomerId: string;
  ItemPrice: string;
  ItemId: string;
  IsOnline: boolean;
  CourseNo: number;
}

export interface Modifiers {
  ParentItemID: string;
  ItemID: string[];
  SaleId: string;
  SelectedSeat: number;
  SelectedMod: SubModifierViewModel[];
  EmpID: number;
  CourseNo : number;
  DicItem : dictItem[];
}


export interface GuestCheckWindow {
  SeatNumber: string;
  DietaryDesc: string;
  Description: string;
  GrandTotal: string;
  TaxTotal: string;
  SubTotal: string;
  DiscountTotal: string;
  CustomerId: string;
  DietaryDescRemotePrns: number;
  DietaryDescWasPrinted: number;
  DietaryDescSentToKitchen: boolean;
  DescriptionRemotePrns: number;
  DescriptionWasPrinted: number;
  DescriptionSentToKitchen: boolean;
  MenuItemList: MenuItemList[];
  GetMenuItems: MenuItemList[];
  SaleId: string;
  TotalSeatsTaken: number;
  SeatCount: number;
  EmpId:number;
  EmpName:string;
  OrderType:string;
  TableName:string;
  SelectedLayoutTableId:string;
}

export interface DeleteItem {
  OpenMod: boolean;
  ParentItemID: string;
  ItemName: string;
}

export interface CombineCheck {
  FunctionIndex:number;
  CombineCheck1stSaleId : string;
  CombineCheck2ndSaleId :string;
}

export interface MenuItemList {
  ItemID: string;
  MenuItemName: string;
  Price: string;
  ItemIndex: number;
  SaleItemId: string;
  WasPrinted: number;
  IsModifier: boolean;
  RemotePrns: number;
  IsDeletable: boolean;
  SentToKitchen: boolean;
  CourseItem: CoursingItem;
  TempSeat: string;
}
export interface Menus {
  ButtonID: string;
  Text: string;
  Function: number;
}

export interface MenuButton {
  MenuButtonID: string;
  MenuDescription: string;
  Position: number;
  Function: boolean;
  MinSecLevel:number;
  AskForSupervisor:boolean;
}

export interface PostComment {
  PosCheckNumber: number;
  Comment: string;
  SelectedSeat: string;
  PrecedingSaleItemId: string;
  ParentItemId: string;
  IsOnline: boolean;
  SaleId: string;
}
export interface CancelSale {
  SaleId: string;
  IsOnline: boolean;
}
export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}
export interface ChangePIN {
  StoreNumber: number;
  EmpID: number;
  NewPIN: number;
  OldPIN: number;
}
export interface ChangePinResult {
  result: string;
  message: string;
}

export interface SicSettings {
  StoreID: number;
  ApiUrl: string;
}
export interface ServerBaseAddress {
  BaseAddress: string;
}
export interface LocalBaseAddress {
  BaseAddress: string;
}
export interface TestServerBaseAddress {
  BaseAddress: string;
}
export interface TestLocalBaseAddress {
  BaseAddress: string;
}
export interface TimeLimitation {
  ResponseTime:string;
}

export interface AppSetting {
  SicSettings: SicSettings[];
  AppVersion: string;
  DeviceStore: DeviceStore[];
  ServerBaseAddress: ServerBaseAddress[];
  LocalBaseAddress: LocalBaseAddress[];
  ForProduction: boolean;
  TestServerBaseAddress: TestServerBaseAddress[];
  TestLocalBaseAddress: TestLocalBaseAddress[];
  TimeLimitation: TimeLimitation[];
  DefaultActiveMenu: DefaultActiveMenu[];
}

export interface DeviceStore{
  DeviceStoreID: number;
}

export interface DefaultActiveMenu{
  Menu: string;
  ButtonID: string;
}

export interface PayCheck {
  StoreId: number;
  TableName: number;
  PaymentMedia: string;
  PaymentType: string;
  SaleId: string;
  Total: string;
  Balance: string;
  SeatNumber: number;
  TotalTax: string;
  MediaIndex: number;
  Tip:string;
  IsOnline: boolean;
  EmpId: number;
  TransactionId : string
}

export interface ScreenLayout {
  AppID: string;
  EmpID: number;
  ControlPanel: string;
  Position: string;
  UpdateDate: string;
  AppClass: string;
  BackgroundColor: string;
  StoreID: string;
}

export interface ChildItemModifier {
  ItemModifierID: string;
  ItemID: string;
  ModifierIndex: number;
  ModifierName: string;
  IsSelected: boolean;
  Item: string;
}

export interface ParentItemModifier {
  ItemID: string;
  ItemName: string;
  ItemDescription: string;
  Department: string;
  Upc: string;
  ReceiptDesc: string;
  ItemCount: number;
  IsModifier: boolean;
  OrderPriority: number;
  ModifierDescription: string;
  UseModifierMaxSelect: boolean;
  ModifierMaxSelect: number;
  UseModifierMinSelect: boolean;
  ModifierMinSelect: number;
  Text: string;
  DisplayIndex: number;
  ItemModifiers: ChildItemModifier[];
  ItemPrice: number;
}

export interface ItemModifierDetails {
  SaleId: string;
  CurrentUser: number;
  SelectedSaleItemID: string;
  ItemID: string[];
  ModifierGroupItem: string[];
  IsOnline: boolean;
  CourseNo: number;
}

export interface SiposAccessMessage {
  version: string;
  result: string;
  message: string;
}

export interface LogOut {
  EmpID: number;
}

export interface Settlement {
  Id: string;
  MessageSet: string;
  RetrievalRefNo: string;
  Transactionamount: string;
  TransactionDate: string;
  CheckType: string;
  CustomerName: string;
  TipAmount: string;
  PaymentType: string;
  CheckNumber: string;
  Response: string;
  ItemIndex: string;
  PaymentMedia: string;
  SeatNumber: string;
  CustomerNumber: string;
}

export interface NavigationButton {
  NavButtonID: string;
  Text: string;
  Function: number;
  Position: number;
  Active: number;
  StoreID: number;
  ButtonId: string;
}

export interface IMealType{
  MealType : string;
}

export interface FunctionButton{
  version: string;
  result: string;
  message: string;
}

export interface Button {
  ButtonID: string;
  ButtonText: string;
  Position: number;
  Function: boolean;
  Active: boolean;
  TotalButton: number;
  SubButtons: SubButton[];
}

export interface SubButton {
  Position: number;
  Buttons: SubButtonViewModel[];

}

export interface SubButtonViewModel {
  SubButtonID: string;
  ButtonText: string;
  FunctionIndex: number;
  Position:number;
  GroupBy: string;
  FontColor: string;
  Top:string;
  Bottom:string;
  ParentButtonID: string;
  ItemPrice: string;
  ItemCount: number;
  MinSecLevel:number;
  AskForSupervisor:boolean;
}

export interface IDiscount {
  DiscountID: string;
  RegionID: string;
  DiscountIndex: number;
  DiscountName: string;
  DiscountType: number;
  PercentOff: number;
  DollarsOff: number;
  MaxAmount: number;
  EnterAmount: boolean;
  SubFrTax: boolean;
  StartDate: Date;
  EndDate: Date;
  Days: number;
  Reason: number;
  SecurityLevel: number;
  Text: string;
  DollarsOffSale: number;
  IsExclusive: boolean;
  DisplayInOwnSection: boolean;
}

export interface IReason {
  ReasonID: string;
  RegionID: string;
  ReasonType: number;
  ReasonIndex: number;
  ReasonName: string;
}

export interface ISaleItemDiscount {
  SaleItemDiscountID: string;
  SaleItemID: string;
  ItemIndex: number;
  DiscountIndex: number;
  Amount: number;
}

export interface ISaleDiscount {
  SaleDiscountID: string;
  SaleID: string;
  DiscountIndex: number;
  Dollar: number;
  Amount: number;
  ReasonIndex: number;
  MaxAmount: number;
/*   CheckNumber: number; */
  SaleItemID: string;
  ItemID:string;
  ItemPrice:string;
  IsComp: number;
}

export interface IDeleteDiscount {
/*   CheckNumber: number; */
  SaleID: string;
}
export interface IVoidItem {
  SaleItemId: string;
  ReasonID: number;
  VoidEmpId: number;
/*   CheckNumber: number; */
  SaleItemID: string;
  SaleId: string;
}

export interface IReopenCheck {
  SaleId: string;
  EmpId: number;
}
export interface MultipleCheck {
  CheckNumber: number;
  TableName: string;
} 

export interface IMoveItem {
  SaleID: string;
  SaleItemID: string;
}
export interface IEmployee {
  EmployeeId: string;
  EmpNumber: string;
  LastName: string;
  FirstName: string;
/*   CheckNumber: number; */
  EmpFrom: number;
  SaleId:string;
}

export interface IEmployeeCheck {
  EmpCheckID: string;
  EmpNumber: string;
  CheckNumber: number;
  CheckStatus: number;
  TransferDate: Date;
  EmpFrom: number;
  EmpSender: string;
  EmpReceiver: string;
  StatusMsg: string;
  SaleId: string;
}

export interface IItemQty {
  ItemID: string;
  ItemCount: number;
  Force: boolean;
}

export interface ItemNameData {
  ButtonText:string;
  ItemId:string;
  ItemPrice:string;
  FunctionIndex:number;
  ItemCount:number;
  MinSecLevel:number;
}

export interface ApplyCoursingObj {
/*   CheckNumber: number; */
  ApplyCoursing: number;
  SaleId:string;
}

export interface CoursingItem {
  CourseID: string;
  SaleItemID: string;
  SaleID: string;
  CourseNo: number;
  CourseIndex: number;
}

export interface CoursingMenuItem {
  SeatNo: string;
  CourseNo: number;
  Total: number;
}
export interface IMoveItemCourse {
  CourseNo: number;
  CustomerNumber: number;
  SaleID: string;
  SaleItemID: string;
}

export interface IItemPrice {
  ItemID: string;
  DefaultPrice: number;
}

export interface ISplitItem {
  SaleItemID: string;
  CustomerNumber: any[];
}

export interface IassignSeat {
  LayoutTableId : string;
  CustomerId : string;
  Mealplan: string;
  Seatnumber: number;
  CurrentUser: number;
}
export interface IDelay {
  SaleItemID: string;
  DelayStatus: string;
  TimeDelay: string;
}
export interface ReprintOrder {
  SaleId: string;
}

export interface globalInstance {
  CurrentUser : CurrentUser;
  SelectedTableName: string;
  SelectedSaleId : string;
  SelectedCheckNumber: number;
  SelectedLayoutTableId: string;
  SelectedCustomerId: string;
  SelectedCustomerDetail: SelectedCustomerDetail;
  SelectedTableDetail: SelectedTableDetail;
}

export interface SelectedTableDetail {
  SeatCount : number;
  LayoutTableId : string;
  TableName :string;
  TakenSeats : number[];
  Checknumber : number; 
  SaleId : string;
  EmpName: string;
  EmpId: number;
  GetSaleItems : GuestCheckWindow[]
}

export interface SelectedCustomerDetail {
  CustomerName  :string;
  SeatNumber : number;
  MealPlan : string;
  CustomerNumber : number;
  Credit : string;
  DietaryRestriction : string;
  LastVisit : string;
  Check : string;
  Address : string;
  ProfilePicture : string;
  CustomerId : string;
  Balance: string;
  MealPlanPoint: number;
}

export interface ReorderItem {
  SaleItemID: string;
}

export interface AutoPayParams {
  CurrentUser: number;
  SaleID: string;
}

export interface NoSale {
  FunctionIndex : number;
}

export interface OrderType {
  OrderType: string;
  OtherInfo: string;
  SaleID: string;
  SaleOrderTypeID: string;
}

export interface storedTransactions {
  tpRequestId: string;
  transactionType: string;
  createdDate: string;
  totalAmount: number;
  state: string;
  CheckNumber: number;
}

export interface saleManualForward {
  requestId: string;
  totalAmount: number;
}

export interface addTip {
  transactionId : string;
  tipAmount : string;
  saleId:string;
  empId:number;
  completionTransactionId: string;
  ticketNumber: number;
}

export interface CreditCardTransactionDetail{
  CCTransactionDetailID : string;
  CCTransactionID : string;
  MerchantID : string;
  TerminalID : string;
  ReferenceNumber : string;
  AccountNumber : string;
  Logo : string;
  Entry : string;
  TransactionID : string;
  ApprovalCode : string;
  ResponseCode : string;
  TransactionDate : string;
}

