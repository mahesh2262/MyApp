import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './login/login.page';
import { LoginPageModule } from './login/login.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
{
  path:'login',
  component:LoginPage
},
{
  path:'',
  redirectTo:'login',
  pathMatch:'full'
}
];

@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
