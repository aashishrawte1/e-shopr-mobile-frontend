import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MixedContentPageComponent } from './mixed-content.page';
import { SharedModule } from '../../modules/shared.module';

const routes: Routes = [
  {
    path: '',
    component: MixedContentPageComponent,
  },
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    FlexLayoutModule,
    SharedModule,
  ],
  declarations: [MixedContentPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MixedContentPageModule {}
