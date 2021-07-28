import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import Keyboard from "simple-keyboard";

import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MessageComponent implements OnInit {

  keyboard: Keyboard;
  value = '';
  totalRemainingCharacters = "20 remaining characters.";

  constructor(public utilityService: UtilityService,
    private dialogRef: MatDialogRef<MessageComponent>) { 
    this.value = "";
    this.utilityService.message = "";
  }

  ngOnInit() {

  }
  onClickDONE(status) {
    if(status == 'close'){
      this.utilityService.message = "the button is closed, dont operate anything";
      this.dialogRef.close(this);
    }else{
      if(this.value.length > 20 || this.utilityService.message.length > 20){
        this.utilityService.message = "Invalid message, the message is too long.";
        this.dialogRef.close(this);
      }else{
        this.dialogRef.close(this);
      }
    }
    
    
  }

  ngAfterViewInit() {
    this.keyboard = new Keyboard({
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button),
      theme: "hg-theme-default myTheme1"
    });
  }

  getLabelColor(){
    let retVal = {};
    if(this.value.length >= 20 || this.utilityService.message.length >= 20){
      retVal = {'color': 'red', 'font-size':'18pt', 'margin-left':'25px'};
    }else{
      retVal = {'color': 'green', 'font-size':'18pt', 'margin-left':'25px'};
    }
    return retVal;  
  }

  validateCharacters(){
    if(this.value.length > 20 || this.utilityService.message.length > 20){
      this.totalRemainingCharacters = "Your message is too long.";
      return false;
    }else{
      this.totalRemainingCharacters = (20 - this.value.length) + " remaining characters.";
      return true;
    }
  }

  onChange = (input: string) => {
    this.value = input;
    this.utilityService.message = this.value;
    console.log("onchanged Called! "+this.utilityService.message);
    this.validateCharacters();
  };

  onKeyPress = (button: string) => {
    console.log("Button pressed", button);
    if (button === "{shift}" || button === "{lock}") this.handleShift();
    this.validateCharacters();
  };

  onInputChange = (event: any) => {
    this.keyboard.setInput(event.target.value);
    (document.getElementById("SearchCustomerName") as HTMLInputElement).focus();  
    this.validateCharacters();
  };

  onKeyup(event){
    var currentValue = (document.getElementById("txtMessage") as HTMLInputElement).value;
    this.value = currentValue;
    this.utilityService.message = this.value;

    if(event.key == "Enter"){
      this.onClickDONE('save');
    }
    this.validateCharacters();

  }

  open(){
    //trigger.openPanel();
    //debugger;
    (document.getElementById("SearchCustomerName") as HTMLInputElement).click();  
    (document.getElementById("SearchCustomerName") as HTMLInputElement).focus();  
    //this.inputAutoComplit.openPanel(); 
    console.log("focusOnInput called!");
    this.onChange((document.getElementById("SearchCustomerName") as HTMLInputElement).value);
    event.preventDefault();
  }

  handleShift = () => {
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    this.keyboard.setOptions({
      layoutName: shiftToggle
    });
  };

}
