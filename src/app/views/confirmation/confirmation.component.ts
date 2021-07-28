import { Component, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  constructor(public utilityService: UtilityService,
    private dialogRef: MatDialogRef<ConfirmationComponent>) { 
    this.utilityService.confirmResult = false;
  }

  ngOnInit() {
  }

  onClick(val){
  	if((this.utilityService.confirmResult = val) == true){
  		this.dialogRef.close();
  	}else{
  		this.dialogRef.close();
  	}
  	
  }

  colorLabel(){
    if(this.utilityService.confirmMessage.indexOf("Connection status") !== -1){
      if(this.utilityService.isServerOnline){
        return {'color': 'green'};
      }else{
        return {'color': 'red'};
      }
    }else{
      return {'color': '#000'};
    }
  }

}
