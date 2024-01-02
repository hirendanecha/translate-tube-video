import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoDataFoundComponent } from './no-data-found.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NoDataFoundComponent],
  exports: [NoDataFoundComponent]
})
export class NoDataFoundModule { }
