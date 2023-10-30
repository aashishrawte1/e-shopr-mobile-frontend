import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunityPageRoutingModule } from './community-routing.module';

import { CommunityPageComponent } from './community.page';
import { SharedModule } from '../../modules/shared.module';
import { MaterialModule } from '../../modules/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MaterialModule,
    CommunityPageRoutingModule,
  ],
  declarations: [CommunityPageComponent],
})
export class CommunityPageModule {}
