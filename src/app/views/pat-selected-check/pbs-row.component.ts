import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilityService } from '../../services/utility.service';
import { 
	GuestCheck,
} from '../../obj-interface';

@Component({
  selector: '[pbs-row]',
  templateUrl: './pbs-row.component.html',
  styleUrls: ['./pbs-row.component.css']
})
export class PbsRowComponent implements OnInit {

	@Input() guest: GuestCheck;

	constructor(
	    public utilityService: UtilityService,
	    public dialog: MatDialog) 
	{ 
		//this.fetchUtility();
	}

	ngOnInit() {
	}

	generateRow(){
		
	}

}