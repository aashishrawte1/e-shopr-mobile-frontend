import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CircularProgressBarComponent } from './circular-progress-bar.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [CircularProgressBarComponent],
  imports: [CommonModule, FlexLayoutModule],
  exports: [CircularProgressBarComponent],
  providers: [],
})
export class CircularProgressBarModule {}
