import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../../services/utility.service';
import {MatDialogRef} from '@angular/material/dialog';
@Component({
  selector: 'app-check-update-dialog',
  templateUrl: './check-update-dialog.component.html',
  styleUrls: ['./check-update-dialog.component.css']
})
export class CheckUpdateDialogComponent implements OnInit {
  seconds:number = 60;
  constructor(
    public utilityService: UtilityService,
    private dialogRef: MatDialogRef<CheckUpdateDialogComponent>,
  ) { }

  ngOnInit() {
    setInterval(()=>{
      this.beginAutoUpdateCountDown();
    },1000)
  }

  beginAutoUpdateCountDown() {
    if(this.seconds>= 1 && this.utilityService.remindIn2Hrs == false){
      this.seconds = this.seconds - 1;
      console.log('---' + this.seconds);
      if(this.seconds == 0){
        console.log('BOOM Quit and Install updates');
        this.quitInstall();
      }
    } 
  }


  restartApp(){
    const electron = (<any>window).require('electron');
    electron.ipcRenderer.send('restart_app');
  }
  closeNotification() {
   this.utilityService.showUpdateNoti = false;
  }

  remindLater() {
    console.clear();
    console.log('remindIn2Hrs = true || skipThis = false')
    this.utilityService.remindIn2Hrs = true;
    this.utilityService.skipThis = false;
    this.utilityService.countDown = 0;
    this.seconds = 60;
    this.dialogRef.close();
  }
  quitInstall() {
    const electron = (<any>window).require('electron');
    electron.ipcRenderer.send('restart_app');  
  }
}
