import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortComponent } from './sort.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [SortComponent],
  imports: [CommonModule, FlexLayoutModule],
  exports: [SortComponent],
  providers: [],
})
export class SortComponentModule {}
