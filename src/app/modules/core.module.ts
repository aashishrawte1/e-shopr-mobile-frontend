import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [CommonModule, IonicModule],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() core: CoreModule) {
    if (core) {
      throw new Error('Module has already been imported');
    }
  }
}
