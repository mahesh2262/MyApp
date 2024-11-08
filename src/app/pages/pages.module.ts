import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AttachmentsPage } from './attachments/attachments.page';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  
  {
    path:'',
    redirectTo:'attachments',
    pathMatch:'full'
  },
  {
    path:'attachments',
    component:AttachmentsPage
  }
  ];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PagesModule { }
