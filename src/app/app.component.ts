import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { StorageService } from './Services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  userName: string = 'Mahesh';
  email: string = 'abc@mail.com';
  showHeader: boolean = false;

  menu = [
    {
      item: 'Pages',
      children: [
        {
          title: 'Attachments',
          url: 'attachments',
          icon: 'grid-outline'
        }
      ]
    }
  ];

  constructor(
    private _router: Router,
    private _platform:Platform,
    private _storage:StorageService
  ) {
    _router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.showHeader = event['url'].includes('login') || event['url'] == '/' ? false : true;
      }
    });

    _storage.remove('platform');
    let platformName = _platform.platforms()[0];
    _storage.set('platform',platformName);
  }
}
