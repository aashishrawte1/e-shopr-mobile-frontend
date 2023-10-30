import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegisterPageRoutingModule } from './register-routing.module';
import { RegisterPageComponent } from './register.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RegisterPageRoutingModule,
  ],
  declarations: [RegisterPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RegisterPageModule {}
