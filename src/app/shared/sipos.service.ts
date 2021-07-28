import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICustomer ,CustomerInfo} from 'src/app/shared/customer';
import { IMealPlan } from 'src/app/shared/mealplan';
import { ISeatDetailBySeatNo } from 'src/app/shared/seatDetailBySeatNo';
import { AddSeat, UpdateSeat, UploadPhoto, IApi_Url, IApi_Endpoint, CheckNumber, SyncSaleResponse, HasOfflineOrder, SignOn, Access, Menu, MenuItems, OpenChecks, CheckItems, GuestCheck, ResidenChargeSettleCheck, PayCheck, Payment, Order, GuestCheckWindow, Media, CustomerDetailCreditCard, MenuItemPrice, FireAll, FireSelected, Modifiers, ChangePIN, ScreenLayout, ParentItemModifier, ChildItemModifier, ItemModifierDetails, SiposAccessMessage, DefaultMedia, PostComment, CancelSale, DeleteItem, LogOut, Settlement,SaveSeatLocal,NavigationButton,MealTypeViewModel,FunctionButton,PrintCheck, PreloadData, IDiscount, IReason, ISaleItemDiscount, ISaleDiscount, IDeleteDiscount, IVoidItem, IReopenCheck,CombineCheck , IMoveItem,SettleMultiple, IEmployee, IEmployeeCheck, IItemQty, ApplyCoursingObj, CoursingItem,IMoveItemCourse,IItemPrice, ISplitItem,IDelay,ReprintOrder,ReorderItem,AutoPayParams,NoSale,OrderType, storedTransactions, ClosedChecks} from '../obj-interface';
import { ICustomerDetail } from './customerDetail';
import { ILayoutRoom } from './room';
import { ILayoutTable } from './table';
import { ITableDetail } from './tableDetail';
import { IMealPlanCustomerDetail} from 'src/app/shared/meaplanCustomerDetail';
import { Data } from '@angular/router';



export interface SaveSeat {
  LayoutTableId: string;
  CustomerId: string;
  Seatnumber: string;
  Mealplan: string;
}
@Injectable({
  providedIn: 'root'
})
export class SiposService {
  customerList: ICustomer[];

  private isOnline = false;

  private httpOptions = {
    headers: new HttpHeaders({

    })
  };


  private triposHttpOption = {
    headers: new HttpHeaders({
      'tp-application-id': '10473',
      'tp-application-name': 'sipos',
      'tp-application-version': '1.01',
      'tp-authorization': 'power',
      'tp-express-acceptor-id': '874767292',
      'tp-express-account-id': '1049667',
      'tp-express-account-token': 'D094556C0C052DE793F69A1A3A91247E6164E1F02FA130B71CBC3AAA6DEB173258505E01',
      'tp-request-id': '123123123',
      'tp-return-logs': 'true',
      'TokenAuthorizationRequest': null,
    })
  }



  private _getMealPlanListURL = 'api/v1/mealplan/mealplan';

  constructor(private http: HttpClient) {}

  updateAuthorization(bearer: string) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': '"Bearer":"'+bearer+'"',
        'Access-Control-Allow-Origin' : '*'
      })
    };
    console.log("bearer = "+bearer);
  }

  getAppSettings() {
    return this.http.get('assets/data/appSetting.json').pipe(catchError(this.handleError));
  }
  getStatus(_apiUrl) {
    return this.http.get<boolean>(_apiUrl).pipe(catchError(this.handleError));
  }

  getStoreID(_apiUrl) {
    return this.http.get<number>(_apiUrl,this.httpOptions).pipe(catchError(this.handleError));
  }
  syncSale(_apiUrl) {
    return this.http.post(_apiUrl, this.httpOptions)
    .pipe(catchError(this.handleError));
  }

  accessSiCloud(_apiUrl) {
    return this.http.get<Access>(_apiUrl)
    .pipe(catchError(this.handleError));
  }

  getNavigationFunction(_apiUrl, data:any) {
    return this.http.post<FunctionButton>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }


  getroomlist(_apiUrl): Observable<ILayoutRoom[]> {
      return this.http.get<ILayoutRoom[]>(_apiUrl,this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  selectedRoom(_apiUrl, roomid) {
        return this.http.get<ILayoutTable[]>(_apiUrl + roomid,this.httpOptions)
        .pipe(catchError(this.handleError));
  }
  selectedTable(_apiUrl, layoutTableId, currentUser) {
    return this.http.get<ITableDetail>(_apiUrl + layoutTableId + '/' + currentUser , this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  getCustomerList(_apiUrl) {
      return this.http.get<ICustomer[]>(_apiUrl)
      .pipe(catchError(this.handleError));
  }

  getMealPlanList(_apiUrl): Observable<IMealPlan[]> {
      return this.http.get<IMealPlan[]>(_apiUrl + this._getMealPlanListURL,this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  getSeatDetailBySeatNo(_apiUrl, saleid, seatnumber) {
    return this.http.get<ISeatDetailBySeatNo>(_apiUrl + saleid + '/' + seatnumber , this.httpOptions)
    .pipe(catchError(this.handleError));
  }

  getCustomerDetail(_apiUrl, customerID) {
      return this.http.get<ICustomerDetail>(_apiUrl + customerID , this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  getMealPlanCustomerDetail(_apiUrl, checknumber, userId) {
      return this.http.get<GuestCheckWindow>(_apiUrl + checknumber + '/' + userId,this.httpOptions)
      .pipe(catchError(this.handleError));
  }


  saveAssignSeat (data: SaveSeat, _apiUrl): Observable<SaveSeat> {
    return this.http.post<SaveSeat>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }

  saveAssignSeatLocal (data: SaveSeatLocal, _apiUrl): Observable<SaveSeatLocal> {
    return this.http.post<SaveSeatLocal>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }

  addSeat(layoutTableid: AddSeat, _apiUrl): Observable<AddSeat> {
    return this.http.post<AddSeat>(_apiUrl, layoutTableid, this.httpOptions)
    .pipe(catchError(this.handleError));
  }

  removeCustomerFromSeat(_apiUrl, checknumber, customerId, seatnumber, isOnline) {
    return this.http.delete<ISeatDetailBySeatNo>(_apiUrl + checknumber + '/' + customerId + '/' + seatnumber + '/' + isOnline,this.httpOptions)
    .pipe(catchError(this.handleError));
  }

  getUpdatedMealPlan(_apiUrl, checknumber, customerId, mealType, seatnumber, userId,isOnline) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<IMealPlanCustomerDetail[]>(_apiUrl + checknumber + '/' + customerId + '/' + mealType + '/' + seatnumber +  '/' + '/' + userId + '/' + isOnline,this.httpOptions)
    .pipe(catchError(this.handleError));
  }

  updateSeat(data: UpdateSeat, _apiUrl) {
    return this.http.post<UpdateSeat>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }

  changeTable(_apiUrl, roomid, prevTableId, newTableId, checknumber) {
    return this.http.get<ILayoutTable[]>(_apiUrl + roomid + '/' + prevTableId + '/' + newTableId + '/' + checknumber,this.httpOptions)
    .pipe(catchError(this.handleError));
  }

  uploadPhoto(data: UploadPhoto, _apiUrl) {
    return this.http.post<UploadPhoto>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }

  updatePIN(data: ChangePIN, _apiUrl) {
    return this.http.post<ChangePIN>(_apiUrl, data).pipe(catchError(this.handleError));
  }

  getCheckNumberFromMaster(_apiUrl, storeId) {
    return this.http.get<CheckNumber>(_apiUrl + storeId, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  checkOfflineOrder(_apiUrl, storeId) {
    return this.http.get<HasOfflineOrder>(_apiUrl + storeId, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
 signOnCustomer2(_apiUrl) {
   return this.http.get<SignOn>(_apiUrl).pipe(catchError(this.handleError));
 }

 signOnCustomer(data: SignOn, _apiUrl, access: Access) {
  const httpOptions3 = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer:' + access.AccessToken,
      'Access-Control-Allow-Origin' : '*'
    })
  };
   return this.http.post<SignOn>(_apiUrl, data, httpOptions3).pipe(catchError(this.handleError));
 }

 getNavigation(_apiUrl) {
  return this.http.get<NavigationButton>(_apiUrl,this.httpOptions)
  .pipe(catchError(this.handleError));
}

 getMenu(_apiUrl, storeId) {
   return this.http.get<string>(_apiUrl,this.httpOptions)
   .pipe(catchError(this.handleError));
 }
 getMenuItems(_apiUrl) {
   return this.http.get<MenuItems>(_apiUrl, this.httpOptions)
   .pipe(catchError(this.handleError));
 }

  private handleError(error: HttpErrorResponse){
    return throwError(error.error.message);
    }

  public getapiUrl(): Observable<any> {
    return this.http.get<IApi_Url>('./assets/data/api_url.json')
    .pipe(catchError(this.handleError));
  }
  public getapiEndPoint(): Observable<any> {
    return this.http.get<IApi_Endpoint>('./assets/data/api_endpoint.json')
    .pipe(catchError(this.handleError));
  }
  getSettlement(_apiUrl, storeId) {
    return this.http.get<Settlement>(_apiUrl, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  getOpenChecks(_apiUrl, storeId) {
    return this.http.get<OpenChecks>(_apiUrl, this.httpOptions)
    .pipe(catchError(this.handleError));
  }

  getGuestCheckDetail(_apiUrl, storeId) {
    return this.http.get<GuestCheck>(_apiUrl, this.httpOptions)
    .pipe(catchError(this.handleError));
  }

  getScreenLayoutDetail(_apiUrl) {
    console.log(_apiUrl);
    return this.http.get<ScreenLayout>(_apiUrl, this.httpOptions)
    .pipe(catchError(this.handleError));
  }

  getModifierSaleItem(_apiUrl) {
    return this.http.get<ParentItemModifier[]>(_apiUrl, this.httpOptions)
    .pipe(catchError(this.handleError));
  }

  getSiposAccess(_apiUrl) {
    const httpOptionsAccess = {
      headers: new HttpHeaders({
        'Authorization': '{"SIPOS":"aa1d7055-df0e-40f8-98cb-a414f870a4e0"}'
      })
    };
    //alert("API_URL:"+_apiUrl);
    return this.http.get<SiposAccessMessage>(_apiUrl, httpOptionsAccess)
    .pipe(catchError(this.handleError));
  }

  saveModifierSaleItem(data: ItemModifierDetails, _apiUrl) {
    return this.http.post<ItemModifierDetails>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }

  savePayCheck(data: PayCheck, _apiUrl) {
    return this.http.post<PayCheck>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }

  saveScreenLayoutDetail(data: any, _apiUrl) {
    return this.http.post<any>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }

  residentChargeSettleCheck(data: ResidenChargeSettleCheck, _apiUrl) {
    return this.http.post<ResidenChargeSettleCheck>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }

  paycheck(data: Payment, _apiUrl) {
    return this.http.post<Payment>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  fireAll(data: FireAll, _apiUrl) {
    return this.http.post<FireAll>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  addOrder(data: Order, _apiUrl) {
    return this.http.post<Order>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }

  getMedia(_apiUrl, storeId) {
    return this.http.get<Media>(_apiUrl, this.httpOptions).pipe(catchError(this.handleError));
  }
  getCustomerDetailCreditCard(_apiUrl, storeId) {
    return this.http.get<CustomerDetailCreditCard>(_apiUrl, this.httpOptions).pipe(catchError(this.handleError));
  }
  deleteItem(_apiUrl) {
    return this.http.delete<DeleteItem>(_apiUrl,this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  fireSelected(data: FireSelected, _apiUrl) {
    return this.http.post<FireSelected>(_apiUrl, data, this.httpOptions).pipe(catchError(this.handleError));
  }
  addModifiers(data: Modifiers, _apiUrl) {
    return this.http.post<Modifiers>(_apiUrl, data, this.httpOptions).pipe(catchError(this.handleError));
  }

  getMenuItemPrice(_apiUrl, storeId) {
    return this.http.get<MenuItemPrice>(_apiUrl, this.httpOptions).pipe(catchError(this.handleError));
  }

  getDefaultMedia(_apiUrl) {
    return this.http.get<DefaultMedia>(_apiUrl,this.httpOptions).pipe(catchError(this.handleError));
  }

  getSignOnSettings(_apiUrl) {
    return this.http.get<boolean>(_apiUrl).pipe(catchError(this.handleError));
  }

  postComment(data: PostComment, _apiUrl) {
    return this.http.post<PostComment>(_apiUrl, data, this.httpOptions).pipe(catchError(this.handleError));
  }

  cancelSale(data: CancelSale, _apiUrl) {
    return this.http.post<CancelSale>(_apiUrl,data,this.httpOptions).pipe(catchError(this.handleError));
  }
  updatePINLocal(data: ChangePIN, _apiUrl) {
    return this.http.post<ChangePIN>(_apiUrl,data,this.httpOptions).pipe(catchError(this.handleError));
  }
  logOut(data: LogOut, _apiUrl) {
    return this.http.post<LogOut>(_apiUrl,data,this.httpOptions).pipe(catchError(this.handleError));
  }
  uploadFposSale(_apiUrl) {
    return this.http.post(_apiUrl,this.httpOptions).pipe(catchError(this.handleError));
  }
  getMealTypeFilters(_apiUrl) {
    return this.http.get<MealTypeViewModel>(_apiUrl,this.httpOptions).pipe(catchError(this.handleError));
  }
  getMasterAPI(_apiUrl){
    return this.http.get<string>(_apiUrl,this.httpOptions).pipe(catchError(this.handleError));
  }
  printCheck(data: PrintCheck, _apiUrl) {
    return this.http.post<PrintCheck>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  preloadData(_apiUrl) {
    return this.http.get<PreloadData>(_apiUrl,this.httpOptions).pipe(catchError(this.handleError));
  }
  getDiscountList(_apiUrl) {
    return this.http.get<IDiscount>(_apiUrl, this.httpOptions).pipe(catchError(this.handleError));
  }
  getReasonList(_apiUrl, reasonType = 0) {
    return this.http.get<IReason>(_apiUrl + "/" + reasonType, this.httpOptions).pipe(catchError(this.handleError));
  }
  getSaleItemDiscountList(_apiUrl, saleItemDiscount) {
    return this.http.get<ISaleItemDiscount>(_apiUrl+saleItemDiscount, this.httpOptions).pipe(catchError(this.handleError));
  }
  saveSaleDiscount(data: ISaleDiscount, _apiUrl) {
    return this.http.post<ISaleDiscount>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  saveSaleItemDiscount(data: ISaleItemDiscount, _apiUrl) {
    return this.http.post<ISaleItemDiscount>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  deleteDiscount(data: IDeleteDiscount, _apiUrl) {
    return this.http.post<IDeleteDiscount>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  combineCheck(data: CombineCheck,_apiUrl) {
    return this.http.post<CombineCheck>(_apiUrl,data,this.httpOptions).pipe(catchError(this.handleError));
  }
  voidItem(data: IVoidItem, _apiUrl) {
    return this.http.post<IVoidItem>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  getClosedChecks(_apiUrl, storeId) {
    return this.http.get<OpenChecks>(_apiUrl, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  reopenCheck(data: IReopenCheck, _apiUrl) {
    return this.http.post<IReopenCheck>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  moveItem(data: IMoveItem, _apiUrl) {
    return this.http.post<IMoveItem>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  settleMultiple(data: SettleMultiple, _apiUrl) {
    return this.http.post<SettleMultiple>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  getEmployeeList(_apiUrl) {
    return this.http.get<IEmployee>(_apiUrl, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  transferCheck(data: IEmployee, _apiUrl) {
    return this.http.post<IEmployee>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  getEmployeeCheck(_apiUrl) {
    return this.http.get<IEmployeeCheck>(_apiUrl, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  saveSaleCompensation(data: ISaleDiscount, _apiUrl) {
    return this.http.post<ISaleDiscount>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  saveItemQuantity(data: IItemQty, _apiUrl) {
    return this.http.post<IItemQty>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  resetItemQuantity(data: IItemQty, _apiUrl) {
    return this.http.post<IItemQty>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  syncItem(_apiUrl) {
    return this.http.post(_apiUrl, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  getUpdatedItem(_apiUrl) {
    return this.http.get<IItemQty>(_apiUrl, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  supervisorPIN(_apiUrl) {
    return this.http.post<boolean>(_apiUrl,this.httpOptions).pipe(catchError(this.handleError));
  }
  applyCoursing(data: ApplyCoursingObj, _apiUrl) {
    return this.http.post<ApplyCoursingObj>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  getSaleCourseItems(_apiUrl, saleid) {
    return this.http.get<CoursingItem>(_apiUrl + "/" + saleid, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  moveOrderItem(data: IMoveItemCourse, _apiUrl) {
    return this.http.post<IMoveItemCourse>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  changeItemPrice(data: IItemPrice, _apiUrl) {
    return this.http.post<IItemPrice>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  splitItems(data: ISplitItem, _apiUrl) {
    return this.http.post<ISplitItem>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  unsplitItems(data: ISplitItem, _apiUrl) {
    return this.http.post<ISplitItem>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  addDelay(data: IDelay, _apiUrl) {
    return this.http.post<IDelay>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  reprintOrder(data: ReprintOrder, _apiUrl) {
    return this.http.post<ReprintOrder>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  reorderItems(data: ReorderItem, _apiUrl) {
    return this.http.post<ReorderItem>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  saveAutoPaySale(data: AutoPayParams, _apiUrl) {
    return this.http.post<AutoPayParams>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  openCashDrawer(data:NoSale,_apiUrl){
    return this.http.post<boolean>(_apiUrl,data,this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  triposSale(data:any,_apiUrl){
    return this.http.post<any>(_apiUrl,data,this.triposHttpOption).pipe(catchError(this.handleError))
  }
  AddTip(data:any,_apiUrl){
    return this.http.post<any>(_apiUrl,data,this.httpOptions).pipe(catchError(this.handleError));
  }
  applyOrderType(data: OrderType, _apiUrl) {
    return this.http.post<OrderType>(_apiUrl, data, this.httpOptions)
    .pipe(catchError(this.handleError));
  }
  voidCreditCard(data:any,_apiUrl) {
    return this.http.post<boolean>(_apiUrl,data,this.httpOptions).pipe(catchError(this.handleError))
  }
  getStoredTransactions(_apiUrl) {
    return this.http.get<storedTransactions>(_apiUrl,this.httpOptions).pipe(catchError(this.handleError));
  }
  saleManualForward(data:any,_apiUrl) {
    return this.http.post<boolean>(_apiUrl,data,this.httpOptions).pipe(catchError(this.handleError));
  }
  deleteStoredTransaction(_apiUrl) {
    return this.http.delete<storedTransactions>(_apiUrl ,this.httpOptions).pipe(catchError(this.handleError))
  }
  newOrder(data:any,_apiUrl) {
    return this.http.post<GuestCheckWindow>(_apiUrl,data,this.httpOptions).pipe(catchError(this.handleError));
  }
  addNextSeat(data:any,_apiUrl) {
    return this.http.post<GuestCheckWindow>(_apiUrl,data,this.httpOptions).pipe(catchError(this.handleError));
  }
  assignSeatQuickService(data:any,_apiUrl) { 
    return this.http.post<GuestCheckWindow>(_apiUrl,data,this.httpOptions).pipe(catchError(this.handleError));
  }

  getCustomerInfo(_apiUrl) {
    return this.http.get<CustomerInfo>(_apiUrl,this.httpOptions).pipe(catchError(this.handleError));
  }
}
