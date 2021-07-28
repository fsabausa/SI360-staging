import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './views/main/main.component';
import { PatSelectedCheckComponent } from './views/pat-selected-check/pat-selected-check.component';
import { PbsRowComponent } from './views/pat-selected-check/pbs-row.component';
import { PatPaymentSelectionComponent } from './views/pat-payment-selection/pat-payment-selection.component';
import { PinpadComponent } from './views/pinpad/pinpad.component';
import { PinpadwholeComponent } from './views/pinpadwhole/pinpadwhole.component';
import { PinpadDialogComponent } from './views/pinpad/pinpad-dialog.component';
import { PatSeatSelectionComponent } from './views/pat-selected-check/pat-seat-selection.component';
import { PatSplitSelectionComponent } from './views/pat-selected-check/pat-split-selection.component';
import { RoomSelectionComponent } from './views/room-selection/room-selection.component';
import { OrderingComponent } from './views/ordering/ordering.component';
import { SelectedTableComponent } from './views/selected-table/selected-table.component';
import { LoginComponent } from './views/login/login.component';
import { MessageComponent } from './views/message/message.component';
import { ConfirmationComponent } from './views/confirmation/confirmation.component';
import { LoadingmodalComponent } from './views/loadingmodal/loadingmodal.component';
import { ChangePINComponent } from './views/change-pin/change-pin.component';
import { TableinfoComponent } from './views/tableinfo/tableinfo.component';
import { DiscountComponent } from './views/discount/discount.component';
const routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'main', component: MainComponent, data: { state: 'main'} },
  { path: 'patselectedcheck', component: PatSelectedCheckComponent, data: { state: 'patselectedcheck'} },
  { path: 'patpaymentselection', component: PatPaymentSelectionComponent, data: { state: 'patpaymentselection'} },
  { path: 'pinpad', component: PinpadComponent, data: { state: 'pinpad'} },
  { path: 'pinpaddialog', component: PinpadDialogComponent, data: { state: 'pinpaddialog'} },
  { path: 'pinpadwhole', component: PinpadwholeComponent, data: { state: 'pinpadwhole'} },
  { path: 'patseatselection', component: PatSeatSelectionComponent, data: { state: 'patseatselection'} },
  { path: 'patsplitselection', component: PatSplitSelectionComponent, data: { state: 'patsplitselection'} },
  { path: 'roomselection', component: RoomSelectionComponent, data: { state: 'roomselection' }},
  { path: 'ordering', component: OrderingComponent, data: { state: 'ordering' }},
  { path: 'selectedtable', component: SelectedTableComponent, data: { state: 'selectedtable' }},
  { path: 'login', component: LoginComponent, data: { state: 'login' }},
  { path: 'message', component: MessageComponent, data: { state: 'message'} },
  { path: 'confirmation', component: ConfirmationComponent, data: { state: 'confirmation'} },
  { path: 'loading', component: LoadingmodalComponent, data: { state: 'loading'} },
  { path: 'changepin', component: ChangePINComponent, data: { state: 'changepin'}},
  { path: 'tableinfo', component: TableinfoComponent, data: { state: 'tableinfo'} },
  { path: 'discount', component: DiscountComponent, data: { state: 'discount'} }
];

export const routingComponents = [
MainComponent,
PatSelectedCheckComponent,
PbsRowComponent,
PatPaymentSelectionComponent,
PinpadComponent,
PinpadwholeComponent,
PinpadDialogComponent,
PatSeatSelectionComponent,
PatSplitSelectionComponent,
RoomSelectionComponent,
OrderingComponent,
SelectedTableComponent,
LoginComponent,
MessageComponent,
ConfirmationComponent,
LoadingmodalComponent,
ChangePINComponent,
TableinfoComponent,
DiscountComponent
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
