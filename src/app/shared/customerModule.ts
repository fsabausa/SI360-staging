import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/services/utility.service';
import { SiposService } from 'src/app/shared/sipos.service';
import { ToastrComponentlessModule, ToastrService } from 'ngx-toastr';
import { CustomerInfo } from './customer';
@Injectable({
    providedIn: 'root'
  })
  export class CustomerModule {
 
    constructor(private service: SiposService,
      public utilityService: UtilityService,
      private toastr: ToastrService,){

    }

    getCustomerInfo(customerId) : CustomerInfo {
      this.service.getCustomerInfo(this.utilityService.localBaseAddress + 'api/v1/customer/getCustomerInfo/' + customerId)
      .subscribe(data => {
        this.utilityService.customerInfo = JSON.parse(data['result']);
        console.log(this.utilityService.customerInfo )
      }, error =>{
        this.toastr.error('Error',error,{timeOut:3000});
      },()=>{
        
      });
      return this.utilityService.customerInfo;
    }
};