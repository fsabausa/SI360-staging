import { Component, OnInit,ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-pinpad',
  templateUrl: './pinpad.component.html',
  styleUrls: ['./pinpad.component.css']
})
export class PinpadComponent implements OnInit {

  public numericButtons = [1,2,3,4,5,6,7,8,9,0,".","DEL"];
  inputed_numeric = 0.00;
  params;

  constructor(public utilityService: UtilityService) { 
    this.inputed_numeric = Number((parseFloat(this.utilityService.grandtotal.replace(/[^0-9.-]+/g,""))).toFixed(2));
    //this.inputed_numeric = '';
  }

  ngOnInit() {
    //this.inputed_numeric = (Number(localStorage.getItem('AmountPay').replace(/[^0-9.-]+/g,""))).toFixed(2);
   /*  if(this.utilityService.showbtnTotalPayment == false){
      this.inputed_numeric = '0.00';
      this.utilityService.inputedAmount = Number((parseFloat(this.utilityService.grandtotal.replace(/[^0-9.-]+/g,""))).toFixed(2));
    } */
    if(this.utilityService.payment_Option.toLowerCase() == "entire check"){
      this.inputed_numeric = 0;
    }
  }
  onClickDONE(data: any) {
    this.utilityService.inputedAmount = data;
    console.log("inputedAmount:"+this.utilityService.inputedAmount);
  }
  onClickTIP(data:any) {
    this.utilityService.inputed_tip = data;
  }

  moveDecimal(n) {
		var l = n.toString().length-3;
		var v = n/Math.pow(10, l);
		return v;
	  }
 

  getbuttonValue(value: any) {
    switch (value) {
      case 'DONE':
         if(this.utilityService.tip_isActive == true) {
          this.onClickTIP(this.inputed_numeric);
         } else {
          this.onClickDONE(this.inputed_numeric);
          this.inputed_numeric = 0;
         }
        break;
      case 'TIP':
          this.onClickTIP(this.inputed_numeric);
          break;
      case 'CLEAR':
        let el = document.getElementById('inputLabel');
        el.style.fontSize = "36px";
        this.inputed_numeric = 0;
        break;
      case 'DEL':
        /* if((this.inputed_numeric).trim()!=''){
          this.setLargerFont();
        } */
        this.inputed_numeric = Number(this.inputed_numeric.toString().substring(0, this.inputed_numeric.toString().length-1));
        break;
      case '.':
        if (!(this.inputed_numeric.toString().indexOf('.') > -1)){
          if(this.inputed_numeric == 0){
            this.inputed_numeric
          }
          this.inputed_numeric += value;
          this.setSmallerFont();
        }
        break;
      default:
        if(this.inputed_numeric == 0) {
          this.inputed_numeric = value;
        } else {
          this.inputed_numeric += value;
          this.setSmallerFont();
        }

        break;
    }
  }

  isOverflown(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
  }

  setSmallerFont() {
    let el = document.getElementById('inputLabel');
    let fontSize = parseInt(el.style.fontSize);
    console.log('fontSize: '+fontSize);
    console.log('scrollHeight: '+el.scrollHeight);
    console.log('clientHeight: '+el.clientHeight);
    console.log('scrollWidth: '+el.scrollWidth);
    console.log('clientWidth: '+el.clientWidth);
    for (let i = fontSize; i >= 0; i--) {
        let overflow = this.isOverflown(el);
        if (overflow) {
         fontSize-=2;
         el.style.fontSize = fontSize + "px";
         console.log('overflow');
        }
    }
  }

  setLargerFont(){
    let el = document.getElementById('inputLabel');
    let fontSize = parseInt(el.style.fontSize);
    if(fontSize<36) el.style.fontSize = (fontSize + 2) + "px";
  }
}
