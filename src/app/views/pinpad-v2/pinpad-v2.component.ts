import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../../services/utility.service';
import { OrderingComponent } from '../ordering/ordering.component'
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-pinpad-v2',
  templateUrl: './pinpad-v2.component.html',
  styleUrls: ['./pinpad-v2.component.css']
})
export class PinpadV2Component implements OnInit {
  _numKeyValue: string = '0';
  _converted_numValue: string = '$0.00';
  constructor(
    public utilityService: UtilityService,
    public orderingFunction : OrderingComponent,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    console.log(this.utilityService.selectedCheckChargeTip);
  }

  getNumKeyValue(value){
    switch(value) {
      case 'CANCEL' :
        this.orderingFunction.closepinPadTipDialog();
        this._numKeyValue = '$0.00';
        this._converted_numValue = '$0.00';
        this.utilityService.pinpadv2_value  = 0.00;
       /*  this.utilityService.selectedCheckChargeTipChecknum = ''; */
        break;
      case 'DEL' :
        this.del();
        break;
      case 'OK' :
        this.ok();
        break;
      case 'CLEAR' :
        this._numKeyValue = '$0.00';
        this._converted_numValue = '$0.00';
        this.utilityService.pinpadv2_value  = 0.00;
        break;
      case '00' :
        if(this._numKeyValue == '$0.00') {
          this._numKeyValue = '';
        }
        if(this._converted_numValue == '$0.00'){
          this._converted_numValue = '';
        }
        this._numKeyValue += value;
        this._converted_numValue = (parseFloat(this._numKeyValue)/ 100).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        });
        console.log(this._numKeyValue);
        break;
      default :
        this.num(value);
        break;
    }
    this.utilityService.pinpadv2_value = parseFloat(this._converted_numValue.replace(/[$,]+/g,""));
  }

  del() {
    if(this._numKeyValue == '$0.00') {
      this._numKeyValue = '';
    }
    if(this._converted_numValue == '$0.00'){
      this._converted_numValue = '';
    }
    if(this._numKeyValue.length > 1){
      this._numKeyValue = (this._numKeyValue.substring(0, this._numKeyValue.length - 1)).toString();
        this._converted_numValue =(parseFloat(this._numKeyValue)* 0.01).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        });
    } else {
      this._numKeyValue = '0';
      this._converted_numValue = '$0.00';
    }
  }
  ok(){
    if(this._converted_numValue != '' || this._numKeyValue.length > 0){
      console.log('HHHH');
      this.orderingFunction.SaveTip(this._numKeyValue);
    } else {
      this.toastr.warning('Please input amount','Warning', {timeOut:3000});
    }
    this._converted_numValue = '$0.00';
    this._numKeyValue = '0';
  }
  num(value){
    if(this._numKeyValue == '$0.00') {
      this._numKeyValue = '';
    }
    if(this._converted_numValue == '$0.00'){
      this._converted_numValue = '';
    }

    this._numKeyValue += value;

    this._converted_numValue = (parseFloat(this._numKeyValue) * 0.01).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  }



}
