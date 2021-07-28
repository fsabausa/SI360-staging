import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig} from '@angular/material/dialog';
import { UtilityService } from '../../services/utility.service';
import { SiposService } from '../../shared/sipos.service';
import { ToastrService } from 'ngx-toastr';
import { 
  IDiscount,
  IReason,
  ISaleItemDiscount,
  ISaleDiscount
} from '../../obj-interface';
import { PinpadDialogComponent } from '../pinpad/pinpad-dialog.component';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.css']
})
export class DiscountComponent implements OnInit {

  discountAmount;
  discountAmountForDB;
  overallDiscount;
  discountId = "";
  reasonId:number;
  selectedDiscount: IDiscount;
  selectedReason: IReason;
  showAmountBtn = false;
  doneSaving = false;

  constructor(public utilityService: UtilityService,
    private service: SiposService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<DiscountComponent>,
    public dialog: MatDialog) { 

  }

  ngOnInit() {
    this.getDiscountList();
    this.getReasonList();
    console.log('-= utilityService.mealPlanCustomerDetail =-');
    console.log(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems);
    console.log('-= saleItemArray =-');
    console.log(this.utilityService.saleItemArray);
    console.log('-= utilityService.saleItemDiscountList =-');
    console.log(this.utilityService.saleItemDiscountList);
  }

  onClickDONE() {
    this.dialogRef.close(this);
  }

  initializeData(){
    var selectedItem = this.utilityService.saleItemArray[0];
    for (var x = 0; x < Object.keys(this.utilityService.saleItemDiscountList).length; x++){
      var menu = this.utilityService.saleItemDiscountList[x];
      for (var y = 0; y < Object.keys(this.utilityService.saleItemDiscountList[x]).length; y++){
        let defaultVal = this.utilityService.saleItemDiscountList[x][y];
        if(selectedItem == defaultVal.SaleItemID){

        }
      }
    }
  }

  openNumberPad() {
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(PinpadDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
        data => {
          console.log('this is a return data from dialog');
          console.log(data);
          this.discountAmount = this.utilityService.splitEven;
          this.discountAmountForDB = this.utilityService.splitEven;
        }
    );
  }

  getDiscountList(){
    let message: string;
    let statusCode: number;
    const _apiRoute = this.utilityService.getApiRoute('GetDiscountList');
    this.service.getDiscountList(this.utilityService.localBaseAddress + _apiRoute)
    .subscribe(data => {
      console.log(data);
      message = data['message'];
      statusCode = data['status-code'];
      this.utilityService.discountList = JSON.parse(data['result']);
    }, error => {
      console.log(error);
      
    }, () => {

    });
  }

  getReasonList(){
    let message: string;
    let statusCode: number;
    const _apiRoute = this.utilityService.getApiRoute('GetReasonList');
    this.service.getReasonList(this.utilityService.localBaseAddress + _apiRoute)
    .subscribe(data => {
      console.log(data);
      message = data['message'];
      statusCode = data['status-code'];
      this.utilityService.discountReasonList = JSON.parse(data['result']);
    }, error => {
      console.log(error);
      
    }, () => {

    });
  }

  computeOverallDiscount(){

    for (var i = 0; i < this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems.length; i++){
      this.overallDiscount = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[i].GrandTotal;
    }
  }

  onDiscountSelected(selectedDiscountIndex:number){
    var discountChanged = false;
    for (var i = 0; i < this.utilityService.discountList.length; i++){
      if(this.utilityService.discountList[i].DiscountIndex == selectedDiscountIndex){
        this.selectedDiscount = this.utilityService.discountList[i];
        if(this.selectedDiscount.EnterAmount){
          this.discountAmount = "0.00";
          this.discountAmountForDB = 0;
          this.showAmountBtn = true;
        }else{
          if(this.selectedDiscount.PercentOff > 0){
            var tempPerc = this.selectedDiscount.PercentOff.toString();
            this.discountAmount = tempPerc.substring(0, tempPerc.length-2) + "%";
            this.discountAmountForDB = this.selectedDiscount.PercentOff;
            this.showAmountBtn = false;
          }else{
            this.discountAmount = "0.00";
            this.discountAmountForDB = this.selectedDiscount.DollarsOff;
            this.showAmountBtn = true;
          }
        }
        discountChanged = true;
      }
    }
    if(!discountChanged){
      this.selectedDiscount = undefined;
    }
  }

  /*onReasonSelected(selectedReasonIndex:string){
    for (var i = 0; i < this.utilityService.discountReasonList.length; i++){
      if(this.utilityService.discountList[i].DiscountID == selectedDiscountID){
        this.selectedDiscount = this.utilityService.discountList[i];
        if(this.selectedDiscount.EnterAmount){
          this.discountAmount = "0.00";
        }else{
          if(this.selectedDiscount.PercentOff > 0){
            var tempPerc = this.selectedDiscount.PercentOff.toString();
            this.discountAmount = tempPerc.substring(0, tempPerc.length-2) + "%";
          }else{
            this.discountAmount = "0.00";
          }
        }
        
      }
    }
      
  }*/

  saveDiscount(){
    /*console.log(" discountAmount: "+this.discountAmount);
    console.log(" overallDiscount: "+this.overallDiscount);
    console.log(" discountId: "+this.discountId);
    console.log(" reasonId: "+this.reasonId);
    console.log(this.selectedReason);

    console.log(this.selectedDiscount);
    console.log(this.reasonId);*/

    const _apiRoute = this.utilityService.getApiRoute('SaveSaleDiscount');
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

      if(this.selectedDiscount == undefined || this.reasonId == undefined){
        /*saleDiscount = {
          DiscountIndex: null,
          Amount: null,
          ReasonIndex: null,
          MaxAmount: null,
          CheckNumber: null,
          SaleItemID: saleitem
        } as ISaleDiscount;*/
        this.toastr.info('Please fill-out discount type and reason!',"Information", {timeOut: 2000});
        i = this.utilityService.saleItemArray.length + 1;
      }else{
        saleDiscount = {
          DiscountIndex: this.selectedDiscount.DiscountIndex,
          Amount: this.discountAmountForDB,
          ReasonIndex: this.reasonId,
          MaxAmount: this.selectedDiscount.MaxAmount,
     /*      CheckNumber: this.utilityService._posChecknumber, */
          SaleItemID: saleitem,
          ItemID : this.utilityService.selectedItemId,
          ItemPrice : this.utilityService.selectedItemPrice,
          SaleID : this.utilityService.globalInstance.SelectedSaleId
        } as ISaleDiscount;

        this.service.saveSaleDiscount(saleDiscount, ApiURL)
          .subscribe(result => {
            console.log(result);
            //alert("done");  
          }, error => {
            console.log(error);
            //alert("error found!");
          }, () => {
            console.log("done saving");
            this.dialogRef.close(this);
            if(i==this.utilityService.saleItemArray.length-1){
              this.dialogRef.close(this);
              console.log("i:"+i+" close dialog");
            }else{
              console.log("i:"+i+" else not closing dialog");
            }
          }
        );
      }

      console.log("saving saleDiscount");
      console.log("i:"+i+" total:"+this.utilityService.saleItemArray.length);
      console.log(saleDiscount);

      /*if(i==this.utilityService.saleItemArray.length-1){
          this.dialogRef.close(this);
          console.log("i:"+i+" close dialog");
        }else{
          console.log("i:"+i+" else not closing dialog");
        }*/

      
    }
    
  }

  _css_selectedSeatOrderUI_Highlight(value) {
    if(this.utilityService._selectedSeatOrderUI == 0){
      this.utilityService._selectedSeatOrderUI = value;
    }

    let styles;
    if (value.includes(this.utilityService._selectedSeatOrderUI)) {
      styles = {
        'color': 'black',
        'font-size' : '25px',
         'background-color' : '#ADD8E6',
         'border-top-style': 'groove'
/*         'text-align' : 'center' */
        };
    } else {
      styles = {
        'color': 'black',
        'font-size' : '22px',
        'border-top-style': 'groove'
        };
    }
    return styles;
  }

  getSelectedSeat_OrderUI(_selectedSeat, _customerId) {
    this.utilityService._selectedSeatOrderUI = _selectedSeat;
    this.utilityService._selectedCustomerIdOrderUI = _customerId;
    this._css_selectedSeatOrderUI_Highlight(_selectedSeat);
    for (let i = 0; this.utilityService.array.length > i ; i++) {
      document.getElementById('itemDiv' + this.utilityService.array[i]).removeAttribute('class');
    }
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

}
