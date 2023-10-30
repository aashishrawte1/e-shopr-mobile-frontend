import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchResultPageRoutingModule } from './search-result-routing.module';

import { SearchResultPageComponent } from './search-result.page';
import { SharedModule } from '../../modules/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchResultPageRoutingModule,
    SharedModule,
  ],
  declarations: [SearchResultPageComponent],
})
export class SearchResultPageModule {}
