import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ProductSearchPageComponent } from './product-search.page';
import { SharedModule } from '../../modules/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ProductSearchPageComponent,
  },
];

@NgModule({
  declarations: [ProductSearchPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    FlexLayoutModule,
    SharedModule,
  ],
})
export class ProductSearchPageModule {}
