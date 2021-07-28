import { Component, OnInit ,Inject} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { SiposService } from 'src/app/shared/sipos.service';
import {IMealPlan} from 'src/app/shared/mealplan';
import { UtilityService } from '../../services/utility.service';
export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-mealplan',
  templateUrl: './mealplan.component.html',
  styleUrls: ['./mealplan.component.css']
})
export class MealplanComponent implements OnInit {
  mealplanList : IMealPlan[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
  private dialogRef: MatDialogRef<MealplanComponent>,
  public service : SiposService,
  public utilityService : UtilityService) { }

  ngOnInit() {
    /* this.service.getMealPlanList(this.utilityService.localBaseAddress)
    .subscribe(meal=> {
        this.mealplanList = JSON.parse(meal['result']);
      var tempMealplanList : IMealPlan[] = JSON.parse(meal['result']);
      for(var x=0;x<tempMealplanList.length;x++){
        var contains = "GUEST";
        for(var y=0;y<tempMealplanList.length;y++){
          var samp = JSON.stringify(tempMealplanList[y]);
          if(samp.includes(contains)
            && !this.mealplanList.includes(tempMealplanList[y])
            && this.mealplanList.length % 2 != 0){
              console.log(tempMealplanList[y]);
              this.mealplanList.push(tempMealplanList[y]);
            break;
          }else if(!this.mealplanList.includes(tempMealplanList[y])
            && this.mealplanList.length % 2 == 0){
              console.log(tempMealplanList[y]);
            this.mealplanList.push(tempMealplanList[y]);
            break;
          }else if(!this.mealplanList.includes(tempMealplanList[y])
            && this.mealplanList.length >= 6){
            this.mealplanList.push(tempMealplanList[y]);
            break;
          }
        }
      }
      console.log("mealplanList");
      console.log(this.mealplanList);
    });   */
  }
  params;
  onClick(data){
    let returnedValue = this.params.getmealplan(data);
    this.dialogRef.close();
  }
  cancel(){
    this.dialogRef.close();
  }

}
