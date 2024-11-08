import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/Services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm:FormGroup | any;

  constructor(
    private _fb:FormBuilder,
    private _router:Router,
    private _storage:StorageService
  ) { }

  ngOnInit() {
    this.initializeForm();
  }

  ionViewWillEnter(){
  }

  initializeForm(){
    this.loginForm = this._fb.group({
      userName : ['',Validators.required],
      password : ['',Validators.required]
    });
  }

  async login(){
    await this._storage.set('login','mahesh');
    this._router.navigate(['home']);
  }
}
