import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../../services/utility.service';
import { ToastrService } from 'ngx-toastr';
import { SiposService } from '../../shared/sipos.service';
import { ChangePIN } from '../../obj-interface';



@Component({
  selector: 'app-change-pin',
  templateUrl: './change-pin.component.html',
  styleUrls: ['./change-pin.component.css']
})
export class ChangePINComponent implements OnInit {

  constructor(
    public utilityService: UtilityService,
    private toastr: ToastrService,
    private service: SiposService,
  ) { }

  ngOnInit() {
  }

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
      const StoreNumber = this.utilityService.appSetting[0].SicSettings['StoreID'];
      if (NewPIN === ConfirmPIN) {
        // tslint:disable-next-line: max-line-length
        /* const getAccessUrl = this.utilityService.appSetting[0].SicSettings['ApiUrl'] + 'api/account/v1/access/' + this.utilityService.appSetting[0].SicSettings['StoreID']; */
     /*    const getAccess = await fetch(getAccessUrl);
        const res = await getAccess.json();
        this.utilityService.access = JSON.parse(res['result']); */
        const _apiRoute = this.utilityService.getApiRoute('UpdatePin');
        let message: any;
        let response: any;
        const _changePIN: ChangePIN = { StoreNumber, NewPIN, EmpID} as ChangePIN;
        /* this.service.updatePIN(_changePIN, _apiRoute, this.utilityService.access.AccessToken) */
        this.service.updatePIN(_changePIN, this.utilityService.baseAddress + _apiRoute)
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

  logOut(){

  }

  textInputActive(value, id) {
    document.getElementById('EmpIDTextBox').removeAttribute('style');
    document.getElementById('newPINTextBox').removeAttribute('style');
    document.getElementById('confirmPINTextBox').removeAttribute('style');
    this.utilityService.inputActive = value;
    document.getElementById(id).setAttribute('style', 'background-color :#BCED91;');
    console.log(value);
  }
}
