import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatGridListModule, MatDialogModule, MatAutocompleteModule, MatIconModule, MatExpansionModule, MatCheckboxModule, MatCardModule, MatSnackBarModule,MatProgressBarModule,MatDividerModule,MatSlideToggleModule,MatSliderModule,MatBadgeModule,MatNativeDateModule,MatTableModule ,MatSortModule,MatPaginatorModule } from '@angular/material';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SiposService } from './shared/sipos.service';
import { ToastrModule } from 'ngx-toastr';
import { MealplanComponent } from './views/mealplan/mealplan.component';
import { UploadphotoComponent } from './views/uploadphoto/uploadphoto.component';
import { DiaglogChangeTableComponent } from './views/diaglog-change-table/diaglog-change-table.component';
import { ClockinComponent } from './views/clockin/clockin.component';
import { LongPress } from './events/long-press';
import { MyHammerConfig } from './my-hammer.config';
import { HammertimeDirective } from './hammertime.directive';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  LyThemeModule,
  LY_THEME
} from '@alyle/ui';
/* import  {  PdfViewerModule  }  from  'ng2-pdf-viewer'; */
/** Import the component modules */
 import { LyResizingCroppingImageModule } from '@alyle/ui/resizing-cropping-images';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';
/** Import themes */
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';
import { PinpadComponent } from './views/pinpad/pinpad.component';
import { PinpadwholeComponent } from './views/pinpadwhole/pinpadwhole.component';
import { CreditcardComponent } from './views/creditcard/creditcard.component';
import { PaymentSuccessfulComponent } from './views/payment-successful/payment-successful.component';
import { ComingsoonComponent } from './views/comingsoon/comingsoon.component';
import { OrderModule } from 'ngx-order-pipe';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { InformationMessageComponent } from './views/information-message/information-message.component';
import { ChangePINComponent } from './views/change-pin/change-pin.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { MomentModule } from 'angular2-moment'; // optional, provides moment-style pipes for date formatting
import { ModalModule } from 'ngx-bootstrap/modal';
import { GroupByPipe } from './group-by.pipe';
import { Ng5SliderModule } from 'ng5-slider';
import { CheckUpdateDialogComponent } from './views/check-update-dialog/check-update-dialog.component';
import { PinpadV2Component } from './views/pinpad-v2/pinpad-v2.component';


@NgModule({
  declarations: [
    AppComponent,
    MealplanComponent,
    UploadphotoComponent,
    DiaglogChangeTableComponent,
    ClockinComponent,
    PinpadComponent,
    CreditcardComponent,
    PaymentSuccessfulComponent,
    ComingsoonComponent,
    HammertimeDirective,
    routingComponents,
    LongPress,
    InformationMessageComponent,
    ChangePINComponent,
    PinpadwholeComponent,
    GroupByPipe,
    CheckUpdateDialogComponent,
    PinpadV2Component
  ],
  imports: [
    AppRoutingModule,
    LyThemeModule.setTheme('minima-light'),
    LyButtonModule,
    LyIconModule,
    LyResizingCroppingImageModule, 
    MatIconModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatGridListModule, FormsModule, MatDialogModule, HttpClientModule, ReactiveFormsModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatCardModule,
    OrderModule,
    DragDropModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatDividerModule,
    ModalModule,
    MatSlideToggleModule,
    MatSliderModule,
    Ng5SliderModule,
    MatBadgeModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgIdleKeepaliveModule.forRoot(),
    MatTableModule,
    MatSortModule ,
    MatPaginatorModule,
/*     PdfViewerModule, */
    ModalModule.forRoot(),
    // tslint:disable-next-line: max-line-length
    ToastrModule.forRoot({preventDuplicates: true, newestOnTop: true, maxOpened : 1, autoDismiss: true, timeOut: 3000 , positionClass : 'toast-top-left' })
  ],
  entryComponents : [
    MealplanComponent,
    UploadphotoComponent,
    DiaglogChangeTableComponent,
    ClockinComponent,
    PinpadComponent,
    CreditcardComponent,
    PaymentSuccessfulComponent,
    ComingsoonComponent,
    InformationMessageComponent,
    ChangePINComponent,
    PinpadwholeComponent,
    CheckUpdateDialogComponent
  ],
  providers: [SiposService,
    MatDatepickerModule ,
    { provide: LY_THEME, useClass: MinimaLight, multi: true }, // name: `minima-light`
    { provide: LY_THEME, useClass: MinimaDark, multi: true }, // name: `minima-dark`
    {
      provide: HAMMER_GESTURE_CONFIG,
       useClass: MyHammerConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
