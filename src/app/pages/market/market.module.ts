import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MarketPageComponent } from './market.page';
import { SharedModule } from '../../modules/shared.module';

const routes: Routes = [
  {
    path: '',
    component: MarketPageComponent,
  },
];

@NgModule({
  declarations: [MarketPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    FlexLayoutModule,
    SharedModule,
  ],
})
export class MarketPageModule {}
