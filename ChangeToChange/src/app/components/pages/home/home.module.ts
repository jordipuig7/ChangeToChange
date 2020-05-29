import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

import {MaterialModule} from '../../../material.module';
import { FormsModule } from '@angular/forms';

import {Ng2SearchPipeModule} from 'ng2-search-filter';



@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule,
    FormsModule,
    Ng2SearchPipeModule
    
  ]
})
export class HomeModule { }
