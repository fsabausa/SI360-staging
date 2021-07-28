import { Component, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { UtilityService } from '../../services/utility.service';
import { SiposService } from '../../shared/sipos.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tableinfo',
  templateUrl: './tableinfo.component.html',
  styleUrls: ['./tableinfo.component.css']
})
export class TableinfoComponent implements OnInit {

  constructor(public utilityService: UtilityService,
    private service: SiposService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<TableinfoComponent>) { 
  		this.reloadSelectedTable();
      this.utilityService.subTotal = "0.00";
      this.utilityService.totalTax = "0.00";
      this.utilityService.grandtotal = "0.00";
  }

  ngOnInit() {

  }
  onClickDONE() {
    this.dialogRef.close(this);
  }

/*   loadMealPlanCustomerDetail(saleId) {
    this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = null;
    const _apiRoute = this.utilityService.getApiRoute('GetCustomerMealPlanDetailURL');
    this.service.getMealPlanCustomerDetail(this.utilityService.localBaseAddress + _apiRoute, saleId, this.utilityService.globalInstance.CurrentUser.EmpID)
    .subscribe(data => {
      this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems = JSON.parse(data['result']);
      console.log('-= mealPlanCustomerDetail =-');
      console.log(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems);

      for (var x = 0; x < Object.keys(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems).length; x++){
        var menu = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[x];
        this.utilityService.totalTax = menu.TaxTotal;
        this.utilityService.grandtotal = menu.GrandTotal;
        this.utilityService.subTotal = menu.SubTotal;
      }
    }, error => {
      this.toastr.error(error,"Error", {timeOut: 2000});
    }, () => {
      if (this.utilityService.globalInstance.SelectedTableDetail.Checknumber != null) {
        this.utilityService.grandtotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].GrandTotal;
        this.utilityService.totalTax = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].TaxTotal;
        this.utilityService.subTotal = this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].SubTotal;
        console.log(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].GetMenuItems);
        console.log(this.utilityService.globalInstance.SelectedTableDetail.GetSaleItems[0].GetMenuItems.length - 1);
      }
    });
  } */

  private reloadSelectedTable() {
    console.clear();
    const _apiRoute = this.utilityService.getApiRoute('GetSelectedTableURL');
    // tslint:disable-next-line: max-line-length
    this.service.selectedTable(this.utilityService.localBaseAddress + _apiRoute, this.utilityService.globalInstance.SelectedLayoutTableId, this.utilityService.globalInstance.CurrentUser.EmpID)
    .subscribe(data => {
        this.utilityService.globalInstance.SelectedTableDetail = JSON.parse(data['result']);
        console.log('-= reloadSelectedTable =-');
        console.log(JSON.parse(data['result']));
    }, error => {
      this.toastr.error(error,'Reload Table Error');
    }, () => {
      if (this.utilityService.globalInstance.SelectedSaleId == '00000000-0000-0000-0000-000000000000') {
      } else {
       /*  this.loadMealPlanCustomerDetail(this.utilityService.globalInstance.SelectedSaleId); */
      }
      this.utilityService.showButtonAssignSeat = false;
    });
  }

  css_enable_green_dot(value, remotePrns , sentToKitchen) {
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

  getBorderStyle(val){
    if(val) return {'border-top-style': 'dotted', 'border-color': '#bbbbbb'};
    else return {'border-top-style': 'groove'};
  }

  addPadding(val){
    if(val) return {'padding-left':'20px'};
    else return {'padding-left':'0px'};
  }

}
