import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../../services/utility.service';
@Component({
  selector: 'app-information-message',
  templateUrl: './information-message.component.html',
  styleUrls: ['./information-message.component.css']
})
export class InformationMessageComponent implements OnInit {

  constructor(
    public utilityService: UtilityService,
  ) { }

  ngOnInit() {
  }

}
