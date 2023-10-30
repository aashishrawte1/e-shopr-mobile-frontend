import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PassionWavePageRoutingModule } from './passion-wave-routing.module';
import { PassionWavePageComponent } from './passion-wave.page';
import {
  ChartAllModule,
  AccumulationChartAllModule,
  RangeNavigatorAllModule,
} from '@syncfusion/ej2-angular-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlexLayoutModule,
    PassionWavePageRoutingModule,
    ChartAllModule,
    AccumulationChartAllModule,
    RangeNavigatorAllModule,
  ],
  declarations: [PassionWavePageComponent],
})
export class PassionWavePageModule {}
