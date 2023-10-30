import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPageComponent } from './login.page';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    LoginPageRoutingModule,
    FlexLayoutModule,
  ],
  declarations: [LoginPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginPageModule {}
