import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { RouterModule } from '@angular/router';
import { ContactUsComponent } from './contact-us.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';



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
    NzSelectModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    
  ]
})
export class ContactUsModule { }
