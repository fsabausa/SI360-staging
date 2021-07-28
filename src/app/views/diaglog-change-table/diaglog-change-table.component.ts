import { Component, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
@Component({
  selector: 'app-diaglog-change-table',
  templateUrl: './diaglog-change-table.component.html',
  styleUrls: ['./diaglog-change-table.component.css']
})
export class DiaglogChangeTableComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<DiaglogChangeTableComponent>) { }

  ngOnInit() {
  }
  params;
  onClick(data){
    let returnedValue = this.params.ChangeTable(data);
    this.dialogRef.close();
  }
}
