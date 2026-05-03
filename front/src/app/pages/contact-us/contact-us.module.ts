import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { RouterModule } from '@angular/router';
import { ContactUsComponent } from './contact-us.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectComponent } from 'src/app/core/components/select/select.component';



@NgModule({
  declarations: [
    ContactUsComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule.forChild([
      {path:'',component:ContactUsComponent}
    ]),
    ReactiveFormsModule,
    SelectComponent
  ]
})
export class ContactUsModule { }
