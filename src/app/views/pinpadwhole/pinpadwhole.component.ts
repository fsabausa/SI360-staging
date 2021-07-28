import { Component, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-pinpadwhole',
  templateUrl: './pinpadwhole.component.html',
  styleUrls: ['./pinpadwhole.component.css']
})
export class PinpadwholeComponent implements OnInit {
  
  public numericButtons = [1,2,3,4,5,6,7,8,9,0,"00","DEL"];
  inputed_numeric = '';
  params;

  constructor(public utilityService: UtilityService,
    private dialogRef: MatDialogRef<PinpadwholeComponent>) { 
    this.inputed_numeric = "";
  }

  ngOnInit() {
    //this.inputed_numeric = (Number(localStorage.getItem('AmountPay').replace(/[^0-9.-]+/g,""))).toFixed(2);
  }
  onClickDONE(data: any) {
    if(data != ''){
      this.utilityService.splitEven = data;
    }else{
      this.utilityService.splitEven = -1;
    }
    console.log("inputedAmount:"+this.utilityService.inputedAmount);
    this.dialogRef.close(this);
  }

  getbuttonValue(value: any) {
    let el = document.getElementById('inputLabel');
    let tempValue = "";
    switch (value) {
      case 'DONE':
        this.onClickDONE(this.inputed_numeric);
        this.inputed_numeric = "";
        break;
      case 'CANCEL':
        el.style.fontSize = "36px";
        this.inputed_numeric = "";
        this.onClickDONE(this.inputed_numeric);
        break;
      case 'CLEAR':
        el.style.fontSize = "36px";
        this.inputed_numeric = "";
        break;
      case 'DEL':
        if((this.inputed_numeric).trim()!=''){
          this.setLargerFont();
        }
        this.inputed_numeric=this.inputed_numeric.substring(0, this.inputed_numeric.length-1);
        break;
      case '00':
        tempValue = this.inputed_numeric + "00";
        if((this.inputed_numeric).trim()!=''){
          if(this.validateTotalValue(tempValue)){
            this.inputed_numeric=this.inputed_numeric + "00";
          }
        }
        break;
      default:
        tempValue = this.inputed_numeric + value
        if(this.validateTotalValue(tempValue)){
          this.inputed_numeric += value;
        }
        break;
    }
  }

  isOverflown(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
  }

  validateTotalValue(tempValue){
    if(tempValue != ''){
      if(tempValue <= 10000){
        return true;
      }
    }
    return false;
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
