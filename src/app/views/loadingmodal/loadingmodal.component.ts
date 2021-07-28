import { Component, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-loadingmodal',
  templateUrl: './loadingmodal.component.html',
  styleUrls: ['./loadingmodal.component.css']
})
export class LoadingmodalComponent implements OnInit {

  constructor(public utilityService: UtilityService,
    private dialogRef: MatDialogRef<LoadingmodalComponent>) { 
  	dialogRef.disableClose = true;
  }

  ngOnInit() {
  }

}
