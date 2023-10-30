import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GamePageRoutingModule } from './spin-the-wheel-routing.module';
import { SpinTheWheelComponent } from './spin-the-wheel.page';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../../modules/shared.module';
import { SpinTheWheelService } from './spin-the-wheel.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GamePageRoutingModule,
    SharedModule,
    FlexLayoutModule,
  ],
  declarations: [SpinTheWheelComponent],
  providers: [SpinTheWheelService],
})
export class SpinTheWheelModule {}
