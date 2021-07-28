import { Component, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-pinpad-dialog',
  templateUrl: './pinpad.component.html',
  styleUrls: ['./pinpad.component.css']
})
export class PinpadDialogComponent implements OnInit {
  
  public numericButtons = [1,2,3,4,5,6,7,8,9,0,".","DEL"];
  inputed_numeric = '';
  params;

  constructor(public utilityService: UtilityService,
    private dialogRef: MatDialogRef<PinpadDialogComponent>) { 
    this.inputed_numeric = "";
  }

  ngOnInit() {
    //this.inputed_numeric = (Number(localStorage.getItem('AmountPay').replace(/[^0-9.-]+/g,""))).toFixed(2);
  }
  onClickDONE(data: any) {
    this.utilityService.splitEven = data;
    this.utilityService.payment_Option = 'Split by ' + data;
    console.log("splitEven:"+this.utilityService.splitEven);
    this.dialogRef.close(this);
  }

  getbuttonValue(value: any) {
    switch (value) {
      case 'DONE':
        this.onClickDONE(this.inputed_numeric);
        this.inputed_numeric = "";
        break;
      case 'CLEAR':
        let el = document.getElementById('inputLabel');
        el.style.fontSize = "36px";
        this.inputed_numeric = "";
        break;
      case 'DEL':
        if((this.inputed_numeric).trim()!=''){
          this.setLargerFont();
        }
        this.inputed_numeric=this.inputed_numeric.substring(0, this.inputed_numeric.length-1);
        break;
      case '.':
        if (!(this.inputed_numeric.indexOf('.') > -1)){
          this.inputed_numeric += value;
          this.setSmallerFont();
        }
        break;
      default:
        this.inputed_numeric += value;
        this.setSmallerFont();
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
