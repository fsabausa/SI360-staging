import { Component, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
@Component({
  selector: 'app-payment-successful',
  templateUrl: './payment-successful.component.html',
  styleUrls: ['./payment-successful.component.css']
})
export class PaymentSuccessfulComponent implements OnInit {
  payCheckMessage : string;
  constructor(
    private dialogRef: MatDialogRef<PaymentSuccessfulComponent>
  ) { }

  ngOnInit() {
    this.payCheckMessage = localStorage.getItem("PayCheckSuccessful")
  }
  close(){
    this.dialogRef.close();
  }

}
