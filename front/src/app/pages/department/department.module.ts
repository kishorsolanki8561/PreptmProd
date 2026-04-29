import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentDetailsComponent } from './department-details/department-details.component';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';

const routes: Routes = [
  { path: ':slug', component: DepartmentDetailsComponent }
]

@NgModule({
  declarations: [
    DepartmentDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreModule
  ]
})
export class DepartmentModule { }
